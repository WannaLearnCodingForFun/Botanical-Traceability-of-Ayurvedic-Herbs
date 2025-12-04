import { Router } from 'express';
import { adapter } from '../adapters/memoryAdapter.js';

export const router = Router();

router.get('/batches', async (_req, res) => {
  const batches = await adapter.getAllBatches();
  res.json(batches);
});

router.get('/events', async (_req, res) => {
  const events = await adapter.getAllCollectionEvents();
  res.json(events);
});



