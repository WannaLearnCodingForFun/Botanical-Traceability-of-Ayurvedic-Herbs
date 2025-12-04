// Stub adapter wiring for Fabric SDK (to be implemented against live network)
// This file documents the expected interface matching memoryAdapter

import { CollectionEvent, ProcessingStep, QualityTest, Provenance } from '../models/types.js';

export const adapter = {
  async addCollectionEvent(_evt: CollectionEvent) {
    throw new Error('Fabric adapter not configured');
  },
  async addProcessingStep(_step: ProcessingStep) {
    throw new Error('Fabric adapter not configured');
  },
  async addQualityTest(_q: QualityTest) {
    throw new Error('Fabric adapter not configured');
  },
  async getProvenance(_batchId: string): Promise<Provenance> {
    throw new Error('Fabric adapter not configured');
  },
};

export type FabricAdapter = typeof adapter;




