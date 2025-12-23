import React, { useEffect, useState } from 'react';

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

type CollectionEvent = {
  id: string;
  batchId: string;
  species: string;
  collectorId: string;
  timestamp: string;
  gps: { lat: number; lng: number };
};

type Prov = {
  batchId: string;
  compliance: { geoFenceOk: boolean; seasonOk: boolean; qualityOk: boolean };
  collectionEvents: any[];
  processingSteps: any[];
  qualityTests: any[];
};

export default function App() {
  const [batches, setBatches] = useState<string[]>([]);
  const [events, setEvents] = useState<CollectionEvent[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [prov, setProv] = useState<Prov | null>(null);
  const [status, setStatus] = useState('');

  const loadBatches = async () => {
    try {
      const r = await fetch('/api/dashboard/batches');
      const d = await r.json();
      setBatches(d);
    } catch (e: any) {
      console.error('Failed to load batches:', e);
    }
  };

  const loadEvents = async () => {
    try {
      const r = await fetch('/api/dashboard/events');
      const d = await r.json();
      setEvents(d);
    } catch (e: any) {
      console.error('Failed to load events:', e);
    }
  };

  const loadProvenance = async (batchId: string) => {
    setStatus('Loading provenance data...');
    setProv(null);
    try {
      const r = await fetch(`/api/provenance/${encodeURIComponent(batchId)}`);
      const d = (await r.json()) as Prov;
      setProv(d);
      setStatus('');
    } catch (e: any) {
      setStatus('');
    }
  };

  useEffect(() => {
    loadBatches();
    loadEvents();
    const interval = setInterval(() => {
      loadBatches();
      loadEvents();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const compliance = prov?.compliance;
  const passed = compliance && compliance.geoFenceOk && compliance.seasonOk && compliance.qualityOk;

  return (
    <div style={{ minHeight: '100vh', background: colors.background, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <header style={{ background: colors.primary, padding: '16px 24px', boxShadow: '0 2px 8px rgba(45, 90, 61, 0.15)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: '#ffffff', fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: '-0.3px' }}>Botanical Traceability System</h1>
          <nav style={{ display: 'flex', gap: 8 }}>
            <a href="/dashboard" style={{ textDecoration: 'none', color: '#ffffff', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500, background: 'rgba(255,255,255,0.15)' }}>Dashboard</a>
            <a href="/consumer" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>Consumer Portal</a>
            <a href="/collectors" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>Collectors</a>
            <a href="/logs" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>Fabric Logs</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, color: colors.text, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Stakeholder Dashboard</h2>
          <p style={{ color: colors.textSecondary, margin: 0, fontSize: 15, lineHeight: 1.5 }}>Monitor batch registrations, collection events, and compliance status across the supply chain</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${colors.borderLight}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>Registered Batches</h3>
              <span style={{ background: colors.successBg, color: colors.success, padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{batches.length}</span>
            </div>
            {batches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <p style={{ color: colors.textMuted, fontSize: 14, margin: 0 }}>No batches recorded yet. Use the Collectors app to create collection events.</p>
              </div>
            ) : (
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {batches.map((batchId) => (
                  <div 
                    key={batchId} 
                    onClick={() => { setSelectedBatchId(batchId); loadProvenance(batchId); }}
                    style={{ 
                      padding: '14px 16px', 
                      marginBottom: 8, 
                      background: selectedBatchId === batchId ? colors.successBg : colors.surfaceAlt, 
                      border: `1px solid ${selectedBatchId === batchId ? colors.primary : colors.borderLight}`,
                      borderRadius: 8, 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontWeight: selectedBatchId === batchId ? 600 : 500,
                      color: selectedBatchId === batchId ? colors.primary : colors.text,
                      fontSize: 14,
                    }}
                  >
                    {batchId}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${colors.borderLight}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>Recent Collection Events</h3>
              <span style={{ background: colors.successBg, color: colors.success, padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{events.length}</span>
            </div>
            {events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <p style={{ color: colors.textMuted, fontSize: 14, margin: 0 }}>No collection events recorded yet.</p>
              </div>
            ) : (
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {events.slice(0, 10).map((event) => (
                  <div key={event.id} style={{ padding: '14px 16px', marginBottom: 8, background: colors.surfaceAlt, borderRadius: 8, border: `1px solid ${colors.borderLight}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, color: colors.text, fontSize: 14 }}>{event.batchId}</span>
                      <span style={{ background: colors.primary, color: '#ffffff', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500 }}>{event.species}</span>
                    </div>
                    <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.5 }}>
                      <div>Collector: {event.collectorId}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span>Location: {event.gps.lat.toFixed(4)}, {event.gps.lng.toFixed(4)}</span>
                        <span style={{ color: colors.textMuted }}>{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedBatchId && (
          <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${colors.borderLight}` }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: 0 }}>Batch Details: {selectedBatchId}</h3>
              <button 
                onClick={() => loadProvenance(selectedBatchId)} 
                style={{ 
                  padding: '8px 16px', 
                  background: colors.surfaceAlt, 
                  color: colors.text, 
                  border: `1px solid ${colors.border}`, 
                  borderRadius: 6, 
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'background 0.2s ease',
                }}
              >
                Refresh
              </button>
            </div>
            
            {status && (
              <div style={{ background: colors.surfaceAlt, borderRadius: 10, border: `1px solid ${colors.borderLight}` }}>
                <LoadingSpinner text={status} />
              </div>
            )}

            {prov && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ background: colors.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${colors.borderLight}` }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: colors.text, margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Compliance Summary</h4>
                  <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${colors.borderLight}` }}>
                    <span style={{ color: colors.textSecondary, fontSize: 14 }}>Overall Status</span>
                    <span style={{ 
                      fontWeight: 700, 
                      fontSize: 15,
                      color: passed ? colors.success : colors.error,
                      background: passed ? colors.successBg : colors.errorBg,
                      padding: '4px 12px',
                      borderRadius: 4,
                    }}>{passed ? 'PASS' : 'FAIL'}</span>
                  </div>
                  <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: colors.textSecondary, fontSize: 14 }}>Geo-fence</span>
                    <span style={{ fontWeight: 600, color: compliance!.geoFenceOk ? colors.success : colors.error }}>{compliance!.geoFenceOk ? 'OK' : 'FAIL'}</span>
                  </div>
                  <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: colors.textSecondary, fontSize: 14 }}>Season</span>
                    <span style={{ fontWeight: 600, color: compliance!.seasonOk ? colors.success : colors.error }}>{compliance!.seasonOk ? 'OK' : 'FAIL'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: colors.textSecondary, fontSize: 14 }}>Quality</span>
                    <span style={{ fontWeight: 600, color: compliance!.qualityOk ? colors.success : colors.error }}>{compliance!.qualityOk ? 'OK' : 'FAIL'}</span>
                  </div>
                </div>
                <div style={{ background: colors.surfaceAlt, borderRadius: 10, padding: 20, border: `1px solid ${colors.borderLight}` }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: colors.text, margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Activity Counts</h4>
                  <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${colors.borderLight}` }}>
                    <span style={{ color: colors.textSecondary, fontSize: 14 }}>Collections</span>
                    <span style={{ fontWeight: 700, fontSize: 20, color: colors.primary }}>{prov.collectionEvents.length}</span>
                  </div>
                  <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${colors.borderLight}` }}>
                    <span style={{ color: colors.textSecondary, fontSize: 14 }}>Processing Steps</span>
                    <span style={{ fontWeight: 700, fontSize: 20, color: colors.primary }}>{prov.processingSteps.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                    <span style={{ color: colors.textSecondary, fontSize: 14 }}>Quality Tests</span>
                    <span style={{ fontWeight: 700, fontSize: 20, color: colors.primary }}>{prov.qualityTests.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}


