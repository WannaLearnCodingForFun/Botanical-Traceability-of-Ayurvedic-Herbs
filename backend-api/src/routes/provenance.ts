import { Router } from 'express';
import { adapter } from '../adapters/memoryAdapter.js';

export const router = Router();

router.get('/:batchId', async (req, res) => {
  const { batchId } = req.params;
  const prov = await adapter.getProvenance(batchId);
  res.json(prov);
});




