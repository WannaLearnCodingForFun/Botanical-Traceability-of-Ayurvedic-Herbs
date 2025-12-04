import { Router } from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { adapter } from '../adapters/memoryAdapter.js';
import { CollectionEvent } from '../models/types.js';
import { createTransaction } from '../services/transactionManager.js';

export const router = Router();

const schema = Joi.object({
  batchId: Joi.string().required(),
  species: Joi.string().required(),
  collectorId: Joi.string().required(),
  gps: Joi.object({ lat: Joi.number().required(), lng: Joi.number().required() }).required(),
  timestamp: Joi.string().isoDate().required(),
  initialQuality: Joi.object({ moisturePercent: Joi.number(), weightKg: Joi.number(), notes: Joi.string() }),
  media: Joi.array().items(Joi.string().uri()),
});

router.post('/', async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ error: error.details.map((d) => d.message) });

  const evt: CollectionEvent = { id: uuidv4(), ...value };
  await adapter.addCollectionEvent(evt);
  
  // Create blockchain transaction
  createTransaction('CollectionEvent', evt.batchId, 'CollectionRecorded', evt.id);
  
  res.status(201).json(evt);
});


