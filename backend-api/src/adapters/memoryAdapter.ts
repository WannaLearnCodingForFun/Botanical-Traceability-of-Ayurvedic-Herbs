import { CollectionEvent, ProcessingStep, QualityTest, Provenance } from '../models/types.js';

class MemoryStore {
  collectionEvents: Map<string, CollectionEvent> = new Map();
  processingSteps: Map<string, ProcessingStep> = new Map();
  qualityTests: Map<string, QualityTest> = new Map();

  getByBatch<T extends { batchId: string }>(store: Map<string, T>, batchId: string): T[] {
    return [...store.values()].filter((v) => v.batchId === batchId);
  }
}

const db = new MemoryStore();

export const adapter = {
  async addCollectionEvent(evt: CollectionEvent) {
    db.collectionEvents.set(evt.id, evt);
  },
  async addProcessingStep(step: ProcessingStep) {
    db.processingSteps.set(step.id, step);
  },
  async addQualityTest(q: QualityTest) {
    db.qualityTests.set(q.id, q);
  },
  async getAllBatches(): Promise<string[]> {
    const batches = new Set<string>();
    db.collectionEvents.forEach((evt) => batches.add(evt.batchId));
    db.processingSteps.forEach((step) => batches.add(step.batchId));
    db.qualityTests.forEach((test) => batches.add(test.batchId));
    return Array.from(batches);
  },
  async getAllCollectionEvents(): Promise<CollectionEvent[]> {
    return Array.from(db.collectionEvents.values()).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },
  async getProvenance(batchId: string): Promise<Provenance> {
    const collectionEvents = db.getByBatch(db.collectionEvents, batchId).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const processingSteps = db.getByBatch(db.processingSteps, batchId).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const qualityTests = db.getByBatch(db.qualityTests, batchId).sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    const geoFenceOk = collectionEvents.every((e) => isWithinApprovedZone(e.gps));
    const seasonOk = collectionEvents.every((e) => isWithinSeason(e.timestamp, e.species));
    const qualityOk = qualityTests.every((q) =>
      (q.tests.moisturePercent === undefined || q.tests.moisturePercent <= 12) &&
      (q.tests.pesticidePpm === undefined || q.tests.pesticidePpm <= 0.01) &&
      (q.tests.dnaAuthenticated !== false)
    );

    return { batchId, collectionEvents, processingSteps, qualityTests, compliance: { geoFenceOk, seasonOk, qualityOk } };
  },
};

function isWithinApprovedZone(gps: { lat: number; lng: number }): boolean {
  // Demo geofence: India bounding box (very rough)
  const inLat = gps.lat >= 6 && gps.lat <= 38;
  const inLng = gps.lng >= 68 && gps.lng <= 98;
  return inLat && inLng;
}

function isWithinSeason(iso: string, species: string): boolean {
  const month = new Date(iso).getUTCMonth() + 1;
  // Demo rule for Ashwagandha (example): harvest months Nov–Feb
  if (species.toLowerCase().includes('ashwagandha')) {
    return [11, 12, 1, 2].includes(month);
  }
  return true;
}

export type MemoryAdapter = typeof adapter;


