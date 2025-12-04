import { Router } from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { adapter } from '../adapters/memoryAdapter.js';
import { QualityTest } from '../models/types.js';
import { createTransaction } from '../services/transactionManager.js';

export const router = Router();

const schema = Joi.object({
  batchId: Joi.string().required(),
  labId: Joi.string().required(),
  timestamp: Joi.string().isoDate().required(),
  tests: Joi.object({
    moisturePercent: Joi.number(),
    pesticidePpm: Joi.number(),
    dnaAuthenticated: Joi.boolean(),
  }).required(),
  certificateUrl: Joi.string().uri(),
});

router.post('/', async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ error: error.details.map((d) => d.message) });

  const test: QualityTest = { id: uuidv4(), ...value };
  await adapter.addQualityTest(test);
  
  // Create blockchain transaction
  createTransaction('QualityTest', test.batchId, 'QualityTestRecorded', test.id);
  
  res.status(201).json(test);
});


