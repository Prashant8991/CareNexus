import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";

// Extend Express Request type to include file property from multer
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Hugging Face Skin Analysis Proxy
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
  app.post('/api/skin/analyze', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'image file is required' });

      const hfToken = process.env.HF_TOKEN;
      const modelId = process.env.HF_MODEL_ID || 'nateraw/vit-base-beans'; // placeholder image classifier
      if (!hfToken) return res.status(500).json({ message: 'HF_TOKEN not configured on server' });

      const hfUrl = `https://api-inference.huggingface.co/models/${modelId}`;
      // Retry logic for model warmup (HF returns 503 with estimated_time)
      let resp = await fetch(hfUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': req.file.mimetype || 'application/octet-stream',
          'x-use-cache': '0',
        },
        body: req.file.buffer,
      });

      if (resp.status === 503) {
        const body = await resp.json().catch(() => ({} as any));
        const waitMs = Math.min(Math.round((body?.estimated_time || 6) * 1000), 15000);
        await new Promise(r => setTimeout(r, waitMs));
        resp = await fetch(hfUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${hfToken}`,
            'Content-Type': req.file.mimetype || 'application/octet-stream',
            'x-use-cache': '0',
          },
          body: req.file.buffer,
        });
      }

      if (!resp.ok) {
        const text = await resp.text();
        return res.status(502).json({ message: 'Model inference failed', details: text });
      }

      const data = await resp.json();
      // Expected HF image-classification output: [{label: string, score: number}, ...]
      const top = Array.isArray(data) && data.length > 0 ? data[0] : { label: 'unknown', score: 0 };

      const normalized = {
        condition: String(top.label || 'unknown').toLowerCase(),
        confidence: Number(top.score || 0),
        tips: [
          'consult a dermatologist for confirmation',
          'avoid self-diagnosis; use this as guidance only',
        ],
        source: {
          provider: 'Hugging Face Inference API',
          model: modelId,
          url: `https://huggingface.co/${modelId}`,
        },
        isTestModel: modelId === 'nateraw/vit-base-beans',
        raw: Array.isArray(data) ? data : undefined,
      };

      return res.json(normalized);
    } catch (err: any) {
      return res.status(500).json({ message: err?.message || 'Unexpected server error' });
    }
  });

  // Nearby hospitals via OpenStreetMap Overpass (no API key required)
  app.get('/api/hospitals/nearby', async (req, res) => {
    try {
      const lat = parseFloat(String(req.query.lat))
      const lng = parseFloat(String(req.query.lng))
      const radius = Math.min(parseInt(String(req.query.radius || '3000'), 10), 10000) || 3000 // meters
      if (!isFinite(lat) || !isFinite(lng)) {
        return res.status(400).json({ message: 'lat and lng are required' })
      }

      const overpassQuery = `[
        out:json
      ];
      (
        node(around:${radius},${lat},${lng})[amenity=hospital];
        node(around:${radius},${lat},${lng})[amenity=clinic];
        node(around:${radius},${lat},${lng})[healthcare=hospital];
        node(around:${radius},${lat},${lng})[healthcare=clinic];
      );
      out body;
      >;
      out skel qt;`;

      const resp = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ data: overpassQuery })
      })

      if (!resp.ok) {
        const text = await resp.text()
        return res.status(502).json({ message: 'Overpass error', details: text })
      }

      const data = await resp.json()
      const elements = Array.isArray(data?.elements) ? data.elements : []
      const items = elements
        .filter((e: any) => e?.type === 'node')
        .map((e: any, idx: number) => {
          const tags = e.tags || {}
          const name = tags.name || 'Unknown Facility'
          const phone = tags.phone || tags['contact:phone'] || ''
          const addressParts = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city'], tags['addr:state']]
            .filter(Boolean)
            .join(', ')
          return {
            id: String(e.id || idx),
            name,
            address: addressParts || tags['addr:full'] || 'Address not available',
            phone,
            lat: e.lat,
            lng: e.lon,
          }
        })

      return res.json({ hospitals: items })
    } catch (err: any) {
      return res.status(500).json({ message: err?.message || 'Unexpected server error' })
    }
  })

  // First Aid API with OpenAI integration and fallback
  app.post('/api/first-aid', async (req, res) => {
    try {
      const { scenario, language = 'english' } = req.body;
      
      if (!scenario) {
        return res.status(400).json({ message: 'scenario is required' });
      }

      let aiResponse: any = null;
      let isOpenAIAvailable = true;

      // Try OpenAI first
      try {
        const { OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const systemPrompt = "You are a certified first-aid trainer. Keep answers short, step-by-step, non-judgemental, emergency-first. If the user indicates unconscious/no-breathing, instruct to call emergency services first and list chest compressions sequence concisely. Always end with 'If in doubt, call your local emergency number.'";
        
        const userPrompt = `Provide first aid guidance for: ${scenario}. Respond in ${language}. Format your response as JSON with: answerText (step-by-step instructions), followUps (array of 2 follow-up questions), severityScore (1-10 scale).`;

        // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        const response = await openai.chat.completions.create({
          model: "gpt-5",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" }
        });

        aiResponse = JSON.parse(response.choices[0].message.content || '{}');
      } catch (openaiError: any) {
        console.log('OpenAI unavailable, using fallback system:', openaiError?.message || 'Unknown error');
        isOpenAIAvailable = false;
        
        // Fallback system with pattern-based responses
        const scenarioLower = scenario.toLowerCase();
        
        if (scenarioLower.includes('chok') || scenarioLower.includes('airway')) {
          aiResponse = {
            answerText: "For choking (adult):\\n\\n1. Ask 'Are you choking?' - if they can't speak or breathe, proceed\\n2. Call 911 immediately if available\\n3. Stand behind the person, wrap arms around their waist\\n4. Make a fist with one hand, place above the navel\\n5. Grasp fist with other hand, give quick upward thrusts\\n6. Continue until object is expelled or person becomes unconscious\\n7. If unconscious, begin CPR\\n\\nIf in doubt, call your local emergency number.",
            followUps: ["What if the person becomes unconscious?", "How do I perform the Heimlich maneuver on a child?"],
            severityScore: 9
          };
        } else if (scenarioLower.includes('cpr') || scenarioLower.includes('cardiac') || scenarioLower.includes('heart') || scenarioLower.includes('unconscious')) {
          aiResponse = {
            answerText: "For CPR (Adult):\\n\\n1. Call 911 immediately\\n2. Check for responsiveness and breathing\\n3. Place person on firm, flat surface\\n4. Tilt head back, lift chin\\n5. Place heel of hand on center of chest between nipples\\n6. Push hard and fast at least 2 inches deep\\n7. Allow complete chest recoil between compressions\\n8. Compress at rate of 100-120 per minute\\n9. Continue until emergency services arrive\\n\\nIf in doubt, call your local emergency number.",
            followUps: ["How long should I continue CPR?", "What if I get tired during CPR?"],
            severityScore: 10
          };
        } else if (scenarioLower.includes('cut') || scenarioLower.includes('bleed') || scenarioLower.includes('wound')) {
          aiResponse = {
            answerText: "For cuts and bleeding:\\n\\n1. Apply direct pressure with clean cloth or bandage\\n2. Elevate the injured area above heart level if possible\\n3. Do not remove embedded objects\\n4. If bleeding doesn't stop, apply additional dressings over the first\\n5. Seek immediate medical attention for deep cuts\\n6. Watch for signs of shock\\n7. Clean and dress minor cuts after bleeding stops\\n\\nIf in doubt, call your local emergency number.",
            followUps: ["How do I know if a cut needs stitches?", "What are the signs of shock?"],
            severityScore: 6
          };
        } else if (scenarioLower.includes('burn')) {
          aiResponse = {
            answerText: "For burns:\\n\\n1. Remove from heat source immediately\\n2. Cool burn with cool (not cold) running water for 10-15 minutes\\n3. Remove tight items before swelling starts\\n4. Do not break blisters\\n5. Cover with sterile, non-stick dressing\\n6. Take over-the-counter pain medication if needed\\n7. Seek medical care for severe burns (larger than 3 inches, deep, or on face/hands)\\n\\nIf in doubt, call your local emergency number.",
            followUps: ["When should I go to the hospital for a burn?", "What should I NOT put on a burn?"],
            severityScore: 5
          };
        } else if (scenarioLower.includes('sprain') || scenarioLower.includes('ankle') || scenarioLower.includes('twist')) {
          aiResponse = {
            answerText: "For sprains (R.I.C.E. method):\\n\\n1. Rest - avoid activities that cause pain\\n2. Ice - apply for 15-20 minutes every 2-3 hours for first 24-48 hours\\n3. Compression - use elastic bandage (not too tight)\\n4. Elevation - raise injured area above heart level when possible\\n5. Take anti-inflammatory medication as directed\\n6. Seek medical care if unable to bear weight or severe pain\\n\\nIf in doubt, call your local emergency number.",
            followUps: ["How long does a sprain take to heal?", "When should I see a doctor for a sprain?"],
            severityScore: 3
          };
        } else {
          aiResponse = {
            answerText: "General emergency guidance:\\n\\n1. Assess the situation for safety\\n2. Check if person is conscious and responsive\\n3. Call 911 for serious injuries or medical emergencies\\n4. Apply basic first aid principles\\n5. Monitor vital signs if trained\\n6. Stay calm and reassuring\\n7. Do not move person unless absolutely necessary\\n\\nFor specific guidance, please describe the injury or emergency more specifically. If in doubt, call your local emergency number.",
            followUps: ["What are the signs of a medical emergency?", "How do I check someone's pulse?"],
            severityScore: 5
          };
        }
      }

      // Generate TTS audio (stub implementation)
      let audioUrl: string | null = null;
      try {
        const gTTS = await import('gtts');
        const gtts = new gTTS.default(aiResponse.answerText.replace(/\\n/g, ' '), language.substring(0, 2) || 'en');
        const audioPath = `/tmp/tts_${Date.now()}.mp3`;
        
        await new Promise<void>((resolve, reject) => {
          gtts.save(audioPath, (err: any) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        audioUrl = `/api/audio/${audioPath.split('/').pop()}`;
      } catch (ttsError: any) {
        console.log('TTS generation failed, continuing without audio:', ttsError?.message || 'Unknown TTS error');
      }

      return res.json({
        answerText: aiResponse.answerText,
        followUps: aiResponse.followUps || [],
        severityScore: aiResponse.severityScore || 5,
        audioUrl,
        fallbackUsed: !isOpenAIAvailable
      });
    } catch (error: any) {
      console.error('First aid API error:', error);
      return res.status(500).json({ 
        message: 'Failed to generate first aid guidance',
        details: error.message 
      });
    }
  });

  // Serve TTS audio files
  app.get('/api/audio/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = `/tmp/${filename}`;
    res.sendFile(filepath, (err) => {
      if (err) {
        res.status(404).json({ message: 'Audio file not found' });
      }
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
