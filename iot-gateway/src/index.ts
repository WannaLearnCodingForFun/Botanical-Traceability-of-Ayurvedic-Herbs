import express from 'express';

const app = express();
app.use(express.json());

// Example: SMS webhook (Twilio-like json)
// { from: "+91xxxx", text: "COLLECT batch=ASHWA-001 lat=23.1 lng=77.2 species=Ashwagandha" }
app.post('/sms', async (req, res) => {
  const text: string = req.body?.text || '';
  const parsed = parseSms(text);
  if (!parsed) return res.status(400).json({ error: 'Invalid SMS' });

  // Forward to backend API
  const payload = {
    batchId: parsed.batchId,
    species: parsed.species,
    collectorId: req.body?.from || 'sms-unknown',
    gps: { lat: parsed.lat, lng: parsed.lng },
    timestamp: new Date().toISOString(),
  };
  try {
    const r = await fetch('http://localhost:4000/api/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(await r.text());
    res.json({ ok: true });
  } catch (e: any) {
    res.status(502).json({ error: e.message });
  }
});

function parseSms(text: string): { batchId: string; lat: number; lng: number; species: string } | null {
  try {
    // Very simple parser for PoC
    const parts = Object.fromEntries(
      text
        .split(/\s+/)
        .map((kv) => kv.split('='))
        .filter((p) => p.length === 2)
    ) as any;
    if (!parts.batch || !parts.lat || !parts.lng || !parts.species) return null;
    return { batchId: String(parts.batch), lat: Number(parts.lat), lng: Number(parts.lng), species: String(parts.species) };
  } catch {
    return null;
  }
}

const PORT = process.env.PORT || 4010;
app.listen(PORT, () => console.log(`iot-gateway listening on :${PORT}`));




