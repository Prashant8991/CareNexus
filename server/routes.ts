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

  // First Aid API with OpenAI integration
  app.post('/api/first-aid', async (req, res) => {
    try {
      const { scenario, language = 'english' } = req.body;
      
      if (!scenario) {
        return res.status(400).json({ message: 'scenario is required' });
      }

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

      const aiResponse = JSON.parse(response.choices[0].message.content || '{}');
      
      // Generate TTS audio (stub implementation)
      let audioUrl: string | null = null;
      try {
        const gTTS = await import('gtts');
        const gtts = new gTTS.default(aiResponse.answerText, language.substring(0, 2) || 'en');
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
        audioUrl
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
