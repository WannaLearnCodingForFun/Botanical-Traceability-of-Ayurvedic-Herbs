import { Context, Contract } from 'fabric-contract-api';

type GeoPoint = { lat: number; lng: number };
type CollectionEvent = {
  id: string;
  batchId: string;
  species: string;
  collectorId: string;
  gps: GeoPoint;
  timestamp: string;
  initialQuality?: { moisturePercent?: number; weightKg?: number; notes?: string };
  media?: string[];
};
type ProcessingStep = {
  id: string;
  batchId: string;
  stepType: 'DRYING' | 'CLEANING' | 'GRINDING' | 'STORAGE' | 'FORMULATION';
  facilityId: string;
  timestamp: string;
  parameters?: Record<string, string | number | boolean>;
};
type QualityTest = {
  id: string;
  batchId: string;
  labId: string;
  timestamp: string;
  tests: { moisturePercent?: number; pesticidePpm?: number; dnaAuthenticated?: boolean };
  certificateUrl?: string;
};

export class TraceabilityContract extends Contract {
  async initLedger(ctx: Context): Promise<void> {
    await ctx.stub.putState('schema:version', Buffer.from('1'));
  }

  // Collection Event
  async addCollectionEvent(ctx: Context, json: string): Promise<void> {
    const evt: CollectionEvent = JSON.parse(json);
    this.assertGeoFence(evt.gps);
    this.assertSeason(evt.timestamp, evt.species);
    await ctx.stub.putState(`collection:${evt.id}`, Buffer.from(JSON.stringify(evt)));
    await this.indexByBatch(ctx, 'collection', evt.batchId, evt.id);
  }

  // Processing Step
  async addProcessingStep(ctx: Context, json: string): Promise<void> {
    const step: ProcessingStep = JSON.parse(json);
    await ctx.stub.putState(`processing:${step.id}`, Buffer.from(JSON.stringify(step)));
    await this.indexByBatch(ctx, 'processing', step.batchId, step.id);
  }

  // Quality Test
  async addQualityTest(ctx: Context, json: string): Promise<void> {
    const test: QualityTest = JSON.parse(json);
    this.assertQuality(test);
    await ctx.stub.putState(`quality:${test.id}`, Buffer.from(JSON.stringify(test)));
    await this.indexByBatch(ctx, 'quality', test.batchId, test.id);
  }

  // Query provenance by batchId
  async getProvenance(ctx: Context, batchId: string): Promise<string> {
    const collectionIds = await this.getIndex(ctx, 'collection', batchId);
    const processingIds = await this.getIndex(ctx, 'processing', batchId);
    const qualityIds = await this.getIndex(ctx, 'quality', batchId);

    const collectionEvents = await this.readMany<CollectionEvent>(ctx, 'collection', collectionIds);
    const processingSteps = await this.readMany<ProcessingStep>(ctx, 'processing', processingIds);
    const qualityTests = await this.readMany<QualityTest>(ctx, 'quality', qualityIds);

    const compliance = {
      geoFenceOk: collectionEvents.every((e) => this.isWithinApprovedZone(e.gps)),
      seasonOk: collectionEvents.every((e) => this.isWithinSeason(e.timestamp, e.species)),
      qualityOk: qualityTests.every((q) => this.qualityOk(q)),
    };

    return JSON.stringify({ batchId, collectionEvents, processingSteps, qualityTests, compliance });
  }

  // Helpers
  private async indexByBatch(ctx: Context, kind: string, batchId: string, id: string): Promise<void> {
    const key = `index:${kind}:${batchId}`;
    const buf = await ctx.stub.getState(key);
    const arr = buf && buf.length ? (JSON.parse(buf.toString()) as string[]) : [];
    arr.push(id);
    await ctx.stub.putState(key, Buffer.from(JSON.stringify(arr)));
  }

  private async getIndex(ctx: Context, kind: string, batchId: string): Promise<string[]> {
    const key = `index:${kind}:${batchId}`;
    const buf = await ctx.stub.getState(key);
    return buf && buf.length ? (JSON.parse(buf.toString()) as string[]) : [];
  }

  private async readMany<T>(ctx: Context, kind: string, ids: string[]): Promise<T[]> {
    const out: T[] = [];
    for (const id of ids) {
      const buf = await ctx.stub.getState(`${kind}:${id}`);
      if (buf && buf.length) out.push(JSON.parse(buf.toString()) as T);
    }
    return out;
  }

  private assertGeoFence(gps: GeoPoint) {
    if (!this.isWithinApprovedZone(gps)) throw new Error('GeoFence violation');
  }

  private assertSeason(iso: string, species: string) {
    if (!this.isWithinSeason(iso, species)) throw new Error('Season restriction violation');
  }

  private assertQuality(test: QualityTest) {
    if (!this.qualityOk(test)) throw new Error('Quality thresholds not met');
  }

  private isWithinApprovedZone(gps: GeoPoint): boolean {
    const inLat = gps.lat >= 6 && gps.lat <= 38;
    const inLng = gps.lng >= 68 && gps.lng <= 98;
    return inLat && inLng;
  }

  private isWithinSeason(iso: string, species: string): boolean {
    const month = new Date(iso).getUTCMonth() + 1;
    if (species.toLowerCase().includes('ashwagandha')) {
      return [11, 12, 1, 2].includes(month);
    }
    return true;
  }

  private qualityOk(q: QualityTest): boolean {
    const moistureOk = q.tests.moisturePercent === undefined || q.tests.moisturePercent <= 12;
    const pesticideOk = q.tests.pesticidePpm === undefined || q.tests.pesticidePpm <= 0.01;
    const dnaOk = q.tests.dnaAuthenticated !== false;
    return moistureOk && pesticideOk && dnaOk;
  }
}

export const contracts = [TraceabilityContract];




