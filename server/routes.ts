import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";

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

  const httpServer = createServer(app);

  return httpServer;
}
