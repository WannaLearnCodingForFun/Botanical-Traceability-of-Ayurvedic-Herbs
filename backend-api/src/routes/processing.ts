import { Router } from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { adapter } from '../adapters/memoryAdapter.js';
import { ProcessingStep } from '../models/types.js';
import { createTransaction } from '../services/transactionManager.js';

export const router = Router();

const schema = Joi.object({
  batchId: Joi.string().required(),
  stepType: Joi.string().valid('DRYING', 'CLEANING', 'GRINDING', 'STORAGE', 'FORMULATION').required(),
  facilityId: Joi.string().required(),
  timestamp: Joi.string().isoDate().required(),
  parameters: Joi.object().pattern(/.*/, [Joi.string(), Joi.number(), Joi.boolean()]),
});

router.post('/', async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ error: error.details.map((d) => d.message) });

  const step: ProcessingStep = { id: uuidv4(), ...value };
  await adapter.addProcessingStep(step);
  
  // Create blockchain transaction
  createTransaction('ProcessingStep', step.batchId, 'ProcessingRecorded', step.id);
  
  res.status(201).json(step);
});


