export type GeoPoint = {
  lat: number;
  lng: number;
};

export type CollectionEvent = {
  id: string;
  batchId: string;
  species: string;
  collectorId: string;
  gps: GeoPoint;
  timestamp: string; // ISO
  initialQuality?: {
    moisturePercent?: number;
    weightKg?: number;
    notes?: string;
  };
  media?: string[]; // image URLs
};

export type ProcessingStep = {
  id: string;
  batchId: string;
  stepType: 'DRYING' | 'CLEANING' | 'GRINDING' | 'STORAGE' | 'FORMULATION';
  facilityId: string;
  timestamp: string;
  parameters?: Record<string, string | number | boolean>;
};

export type QualityTest = {
  id: string;
  batchId: string;
  labId: string;
  timestamp: string;
  tests: {
    moisturePercent?: number;
    pesticidePpm?: number;
    dnaAuthenticated?: boolean;
  };
  certificateUrl?: string;
};

export type Provenance = {
  batchId: string;
  collectionEvents: CollectionEvent[];
  processingSteps: ProcessingStep[];
  qualityTests: QualityTest[];
  compliance: {
    geoFenceOk: boolean;
    seasonOk: boolean;
    qualityOk: boolean;
  };
};




