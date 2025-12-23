import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LoadingSpinner = ({ text = 'Loading...' }: { text?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
    <div style={{ position: 'relative', width: 60, height: 60 }}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', animation: 'leafSpin 2s ease-in-out infinite' }}>
        <path
          d="M50 10 C20 10 10 40 10 60 C10 80 30 90 50 90 C50 90 50 50 50 10 Z"
          fill="#2d5a3d"
          style={{ transformOrigin: '50% 50%', animation: 'leafPulse 1.5s ease-in-out infinite' }}
        />
        <path
          d="M50 10 C80 10 90 40 90 60 C90 80 70 90 50 90 C50 90 50 50 50 10 Z"
          fill="#3d7a52"
          style={{ transformOrigin: '50% 50%', animation: 'leafPulse 1.5s ease-in-out infinite 0.2s' }}
        />
        <line x1="50" y1="15" x2="50" y2="85" stroke="#1e3d29" strokeWidth="2" />
      </svg>
    </div>
    <p style={{ marginTop: 16, color: '#4a5d4e', fontSize: 14, fontWeight: 500 }}>{text}</p>
    <style>{`
      @keyframes leafSpin {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
      }
      @keyframes leafPulse {
        0%, 100% { opacity: 0.7; transform: scale(0.95); }
        50% { opacity: 1; transform: scale(1); }
      }
    `}</style>
  </div>
);

const colors = {
  primary: '#2d5a3d',
  primaryDark: '#1e3d29',
  primaryLight: '#3d7a52',
  accent: '#4a7c59',
  background: '#f8faf8',
  surface: '#ffffff',
  surfaceAlt: '#f0f4f1',
  border: '#d4ddd6',
  borderLight: '#e8ede9',
  text: '#1a2e1f',
  textSecondary: '#4a5d4e',
  textMuted: '#6b7d6f',
  success: '#2d5a3d',
  successBg: '#e8f0ea',
  error: '#8b3a3a',
  errorBg: '#fdf2f2',
};

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
    <div style={{ minHeight: '100vh', background: colors.background, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <header style={{ background: colors.primary, padding: '16px 24px', boxShadow: '0 2px 8px rgba(45, 90, 61, 0.15)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: '#ffffff', fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: '-0.3px' }}>Botanical Traceability System</h1>
          <nav style={{ display: 'flex', gap: 8 }}>
            <a href="/dashboard" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>Dashboard</a>
            <a href="/consumer" style={{ textDecoration: 'none', color: '#ffffff', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500, background: 'rgba(255,255,255,0.15)' }}>Consumer Portal</a>
            <a href="/collectors" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>Collectors</a>
            <a href="/logs" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>Fabric Logs</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, color: colors.text, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Product Traceability Verification</h2>
          <p style={{ color: colors.textSecondary, margin: 0, fontSize: 15, lineHeight: 1.5 }}>Scan a QR code or enter a batch ID to verify the authenticity and origin of your Ayurvedic herbs</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 32 }}>
          <div>
            <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0', paddingBottom: 12, borderBottom: `1px solid ${colors.borderLight}` }}>Select Batch</h3>
              {batches.length === 0 ? (
                <p style={{ color: colors.textMuted, fontSize: 14, margin: 0 }}>No batches available yet</p>
              ) : (
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {batches.map((bid) => (
                    <div
                      key={bid}
                      onClick={() => { setBatchId(bid); fetchProv(bid); }}
                      style={{
                        padding: '12px 14px',
                        marginBottom: 8,
                        borderRadius: 8,
                        background: batchId === bid ? colors.successBg : colors.surfaceAlt,
                        border: `1px solid ${batchId === bid ? colors.primary : colors.borderLight}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: batchId === bid ? 600 : 500,
                        color: batchId === bid ? colors.primary : colors.text,
                        fontSize: 14,
                      }}
                    >
                      {bid}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0', paddingBottom: 12, borderBottom: `1px solid ${colors.borderLight}` }}>Manual Search</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  placeholder="Enter batch ID"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchProv()}
                  style={{ flex: 1, padding: '10px 14px', border: `1px solid ${colors.border}`, borderRadius: 8, fontSize: 14, color: colors.text, outline: 'none' }}
                />
                <button 
                  onClick={() => fetchProv()} 
                  disabled={!batchId || loading} 
                  style={{ 
                    padding: '10px 20px', 
                    background: loading ? colors.textMuted : colors.primary, 
                    color: '#ffffff', 
                    border: 'none', 
                    borderRadius: 8, 
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: 14,
                    transition: 'background 0.2s ease',
                  }}
                >
                  {loading ? 'Loading...' : 'Verify'}
                </button>
              </div>
            </div>
          </div>

          <div>
            {error && (
              <div style={{ padding: 16, background: colors.errorBg, border: `1px solid ${colors.error}`, borderRadius: 12, marginBottom: 20 }}>
                <strong style={{ color: colors.error }}>Error:</strong> <span style={{ color: colors.error }}>{error}</span>
              </div>
            )}

            {!prov && !error && !loading && (
              <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 60, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 64, height: 64, background: colors.surfaceAlt, borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <p style={{ color: colors.textSecondary, fontSize: 15, margin: 0, lineHeight: 1.6 }}>Select a batch ID from the list or enter one manually to view product traceability information</p>
              </div>
            )}

            {!prov && !error && loading && (
              <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <LoadingSpinner text="Fetching provenance data..." />
              </div>
            )}

            {prov && (
              <div>
                <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: colors.text }}>Batch: {prov.batchId}</h2>
                      <p style={{ margin: '6px 0 0 0', color: colors.textSecondary, fontSize: 14 }}>
                        Species: {prov.collectionEvents[0]?.species || 'Unknown'}
                      </p>
                    </div>
                    <div style={{ 
                      padding: '16px 28px', 
                      background: complianceStatus === 'PASS' ? colors.successBg : colors.errorBg, 
                      borderRadius: 10, 
                      border: `2px solid ${complianceStatus === 'PASS' ? colors.primary : colors.error}`,
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Compliance Status</div>
                      <div style={{ fontSize: 26, fontWeight: 700, color: complianceStatus === 'PASS' ? colors.success : colors.error }}>
                        {complianceStatus}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 20px 0', paddingBottom: 12, borderBottom: `1px solid ${colors.borderLight}` }}>Supply Chain Journey</h3>
                  <div style={{ position: 'relative', paddingLeft: 28 }}>
                    {allEvents.map((event, idx) => (
                      <div key={idx} style={{ marginBottom: idx < allEvents.length - 1 ? 20 : 0, position: 'relative' }}>
                        <div style={{ 
                          position: 'absolute', 
                          left: -20, 
                          top: 6, 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          background: colors.primary, 
                          border: '2px solid white', 
                          boxShadow: `0 0 0 2px ${colors.primary}` 
                        }} />
                        {idx < allEvents.length - 1 && (
                          <div style={{ position: 'absolute', left: -15, top: 20, width: 2, height: 'calc(100% + 8px)', background: colors.borderLight }} />
                        )}
                        <div style={{ background: colors.surfaceAlt, padding: 16, borderRadius: 10, border: `1px solid ${colors.borderLight}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <strong style={{ color: colors.text, fontSize: 14 }}>{event.type}</strong>
                            <span style={{ color: colors.textMuted, fontSize: 13 }}>{new Date(event.timestamp).toLocaleString()}</span>
                          </div>
                          {event.type === 'Collection' && (
                            <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
                              <div>Collector: {event.data.collectorId}</div>
                              <div>Location: {event.data.gps.lat.toFixed(4)}, {event.data.gps.lng.toFixed(4)}</div>
                              {event.data.initialQuality?.weightKg && <div>Weight: {event.data.initialQuality.weightKg} kg</div>}
                            </div>
                          )}
                          {event.type === 'Processing' && (
                            <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
                              <div>Step: {event.data.stepType}</div>
                              <div>Facility: {event.data.facilityId}</div>
                            </div>
                          )}
                          {event.type === 'Quality Test' && (
                            <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
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

                <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0', paddingBottom: 12, borderBottom: `1px solid ${colors.borderLight}` }}>Collection Locations</h3>
                  <MapContainer center={mapCenter} zoom={prov.collectionEvents.length > 1 ? 6 : 8} style={{ height: 360, width: '100%', borderRadius: 10, border: `1px solid ${colors.border}` }}>
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
                  <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Geo-fence</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: prov.compliance.geoFenceOk ? colors.success : colors.error }}>
                      {prov.compliance.geoFenceOk ? 'PASS' : 'FAIL'}
                    </div>
                  </div>
                  <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Season</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: prov.compliance.seasonOk ? colors.success : colors.error }}>
                      {prov.compliance.seasonOk ? 'PASS' : 'FAIL'}
                    </div>
                  </div>
                  <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quality</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: prov.compliance.qualityOk ? colors.success : colors.error }}>
                      {prov.compliance.qualityOk ? 'PASS' : 'FAIL'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
