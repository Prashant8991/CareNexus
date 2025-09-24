import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // No external AI routes. Demo runs locally in client.

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
