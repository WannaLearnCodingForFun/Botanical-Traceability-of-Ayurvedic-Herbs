import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type GeoPoint = { lat: number; lng: number };
type CollectionEvent = { id: string; gps: GeoPoint; timestamp: string; species: string; collectorId: string; initialQuality?: { moisturePercent?: number; weightKg?: number } };
type ProcessingStep = { id: string; stepType: string; timestamp: string; facilityId: string };
type QualityTest = { id: string; timestamp: string; tests: { moisturePercent?: number; pesticidePpm?: number; dnaAuthenticated?: boolean }; labId: string };
type Provenance = {
  batchId: string;
  collectionEvents: CollectionEvent[];
  processingSteps: ProcessingStep[];
  qualityTests: QualityTest[];
  compliance: { geoFenceOk: boolean; seasonOk: boolean; qualityOk: boolean };
};

export default function App() {
  const [batchId, setBatchId] = useState('');
  const [batches, setBatches] = useState<string[]>([]);
  const [prov, setProv] = useState<Provenance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const q = url.searchParams.get('batchId');
      if (q) {
        setBatchId(q);
        fetchProv(q);
      }
    } catch {}
    loadBatches();
    const interval = setInterval(loadBatches, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadBatches = async () => {
    try {
      const res = await fetch('/api/dashboard/batches');
      const data = await res.json();
      setBatches(data);
    } catch (e) {
      console.error('Failed to load batches:', e);
    }
  };

  const mapCenter = useMemo(() => {
    if (prov?.collectionEvents?.length) return prov.collectionEvents[0].gps;
    return { lat: 20.5937, lng: 78.9629 };
  }, [prov]);

  const fetchProv = async (id?: string) => {
    const targetBatchId = id || batchId;
    if (!targetBatchId) return;
    
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/provenance/${encodeURIComponent(targetBatchId)}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Batch not found');
      }
      const data = (await res.json()) as Provenance;
      setProv(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch provenance');
    } finally {
      setLoading(false);
    }
  };

  const allEvents = useMemo(() => {
    if (!prov) return [];
    const events: Array<{ type: string; timestamp: string; data: any }> = [];
    prov.collectionEvents.forEach(e => events.push({ type: 'Collection', timestamp: e.timestamp, data: e }));
    prov.processingSteps.forEach(p => events.push({ type: 'Processing', timestamp: p.timestamp, data: p }));
    prov.qualityTests.forEach(q => events.push({ type: 'Quality Test', timestamp: q.timestamp, data: q }));
    return events.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }, [prov]);

  const complianceStatus = prov ? (prov.compliance.geoFenceOk && prov.compliance.seasonOk && prov.compliance.qualityOk ? 'PASS' : 'FAIL') : null;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      <nav style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8, display: 'flex', gap: 16 }}>
        <a href="/dashboard" style={{ textDecoration: 'none', color: '#666' }}>Dashboard</a>
        <a href="/consumer" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>Consumer Portal</a>
        <a href="/collectors" style={{ textDecoration: 'none', color: '#666' }}>Collectors</a>
        <a href="/logs" style={{ textDecoration: 'none', color: '#666' }}>Fabric Logs</a>
      </nav>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 8px 0' }}>Product Traceability Verification</h1>
        <p style={{ color: '#666', margin: 0 }}>Scan a QR code or enter a batch ID to verify the authenticity and origin of your Ayurvedic herbs</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        <div>
          <h3 style={{ marginTop: 0 }}>Select Batch ID</h3>
          {batches.length === 0 ? (
            <p style={{ color: '#666', fontSize: 14 }}>No batches available yet</p>
          ) : (
            <div style={{ border: '1px solid #ddd', borderRadius: 8, maxHeight: 400, overflowY: 'auto' }}>
              {batches.map((bid) => (
                <div
                  key={bid}
                  onClick={() => { setBatchId(bid); fetchProv(bid); }}
                  style={{
                    padding: 12,
                    borderBottom: '1px solid #eee',
                    background: batchId === bid ? '#e3f2fd' : '#fff',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (batchId !== bid) e.currentTarget.style.background = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    if (batchId !== bid) e.currentTarget.style.background = '#fff';
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{bid}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <h4>Or Enter Manually</h4>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="Enter batch ID"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchProv()}
                style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
              <button 
                onClick={() => fetchProv()} 
                disabled={!batchId || loading} 
                style={{ padding: '8px 16px', background: '#1976d2', color: 'white', border: 'none', borderRadius: 4, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Loading...' : 'Verify'}
              </button>
            </div>
          </div>
        </div>

        <div>
          {error && (
            <div style={{ padding: 16, background: '#ffebee', border: '1px solid #ef5350', borderRadius: 8, marginBottom: 16 }}>
              <strong style={{ color: '#c62828' }}>Error:</strong> {error}
            </div>
          )}

          {!prov && !error && (
            <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
              <p>Select a batch ID from the list or enter one manually to view product traceability information</p>
            </div>
          )}

          {prov && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h2 style={{ margin: 0 }}>Batch: {prov.batchId}</h2>
                  <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                    Species: {prov.collectionEvents[0]?.species || 'Unknown'}
                  </p>
                </div>
                <div style={{ padding: '12px 24px', background: complianceStatus === 'PASS' ? '#e8f5e9' : '#ffebee', borderRadius: 8, border: `2px solid ${complianceStatus === 'PASS' ? '#4caf50' : '#f44336'}` }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Compliance Status</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: complianceStatus === 'PASS' ? '#2e7d32' : '#c62828' }}>
                    {complianceStatus}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3>Supply Chain Journey</h3>
                <div style={{ position: 'relative', paddingLeft: 32 }}>
                  {allEvents.map((event, idx) => (
                    <div key={idx} style={{ marginBottom: 24, position: 'relative' }}>
                      <div style={{ position: 'absolute', left: -8, top: 4, width: 16, height: 16, borderRadius: '50%', background: '#1976d2', border: '3px solid white', boxShadow: '0 0 0 2px #1976d2' }} />
                      {idx < allEvents.length - 1 && (
                        <div style={{ position: 'absolute', left: -1, top: 20, width: 2, height: 'calc(100% + 8px)', background: '#ddd' }} />
                      )}
                      <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, border: '1px solid #e0e0e0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <strong>{event.type}</strong>
                          <span style={{ color: '#666', fontSize: 14 }}>{new Date(event.timestamp).toLocaleString()}</span>
                        </div>
                        {event.type === 'Collection' && (
                          <div style={{ fontSize: 14, color: '#666' }}>
                            <div>Collector: {event.data.collectorId}</div>
                            <div>Location: {event.data.gps.lat.toFixed(4)}, {event.data.gps.lng.toFixed(4)}</div>
                            {event.data.initialQuality?.weightKg && <div>Weight: {event.data.initialQuality.weightKg} kg</div>}
                          </div>
                        )}
                        {event.type === 'Processing' && (
                          <div style={{ fontSize: 14, color: '#666' }}>
                            <div>Step: {event.data.stepType}</div>
                            <div>Facility: {event.data.facilityId}</div>
                          </div>
                        )}
                        {event.type === 'Quality Test' && (
                          <div style={{ fontSize: 14, color: '#666' }}>
                            <div>Lab: {event.data.labId}</div>
                            <div>Moisture: {event.data.tests.moisturePercent ?? 'N/A'}%</div>
                            <div>Pesticide: {event.data.tests.pesticidePpm ?? 'N/A'} ppm</div>
                            <div>DNA Authenticated: {event.data.tests.dnaAuthenticated !== false ? 'Yes' : 'No'}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3>Collection Locations</h3>
                <MapContainer center={mapCenter} zoom={prov.collectionEvents.length > 1 ? 6 : 8} style={{ height: 400, width: '100%', borderRadius: 8, border: '1px solid #ddd' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {prov.collectionEvents.map((e) => (
                    <Marker key={e.id} position={e.gps}>
                      <Popup>
                        <div>
                          <strong>{e.species}</strong><br />
                          Collected: {new Date(e.timestamp).toLocaleDateString()}<br />
                          Collector: {e.collectorId}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div style={{ padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Geo-fence Compliance</div>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: prov.compliance.geoFenceOk ? '#4caf50' : '#f44336' }}>
                    {prov.compliance.geoFenceOk ? 'PASS' : 'FAIL'}
                  </div>
                </div>
                <div style={{ padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Season Compliance</div>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: prov.compliance.seasonOk ? '#4caf50' : '#f44336' }}>
                    {prov.compliance.seasonOk ? 'PASS' : 'FAIL'}
                  </div>
                </div>
                <div style={{ padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Quality Compliance</div>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: prov.compliance.qualityOk ? '#4caf50' : '#f44336' }}>
                    {prov.compliance.qualityOk ? 'PASS' : 'FAIL'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
