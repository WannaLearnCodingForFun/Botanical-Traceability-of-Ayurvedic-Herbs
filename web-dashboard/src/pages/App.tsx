import React, { useEffect, useState } from 'react';

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
    setStatus('Loading...');
    try {
      const r = await fetch(`/api/provenance/${encodeURIComponent(batchId)}`);
      const d = (await r.json()) as Prov;
      setProv(d);
      setStatus('');
    } catch (e: any) {
      setStatus(e.message);
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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      <nav style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8, display: 'flex', gap: 16 }}>
        <a href="/dashboard" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>Dashboard</a>
        <a href="/consumer" style={{ textDecoration: 'none', color: '#666' }}>Consumer Portal</a>
        <a href="/collectors" style={{ textDecoration: 'none', color: '#666' }}>Collectors</a>
        <a href="/logs" style={{ textDecoration: 'none', color: '#666' }}>Fabric Logs</a>
      </nav>
      <h2>Stakeholder Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div>
          <h3>All Batches ({batches.length})</h3>
          {batches.length === 0 ? (
            <p style={{ color: '#666' }}>No batches recorded yet. Use Collectors app to create collection events.</p>
          ) : (
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {batches.map((batchId) => (
                <div key={batchId} style={{ padding: 12, marginBottom: 8, background: '#f9f9f9', borderRadius: 4, cursor: 'pointer' }} onClick={() => { setSelectedBatchId(batchId); loadProvenance(batchId); }}>
                  {batchId}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3>Recent Collection Events ({events.length})</h3>
          {events.length === 0 ? (
            <p style={{ color: '#666' }}>No collection events recorded yet.</p>
          ) : (
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {events.slice(0, 10).map((event) => (
                <div key={event.id} style={{ padding: 12, marginBottom: 8, background: '#f9f9f9', borderRadius: 4 }}>
                  <div><strong>{event.batchId}</strong> - {event.species}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    Collector: {event.collectorId} | {new Date(event.timestamp).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    Location: {event.gps.lat.toFixed(4)}, {event.gps.lng.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedBatchId && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
            <h3>Batch Details: {selectedBatchId}</h3>
            <button onClick={() => loadProvenance(selectedBatchId)} style={{ padding: '8px 12px' }}>Refresh</button>
          </div>
          <p>{status}</p>

          {prov && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <strong>Compliance Summary</strong>
                <ul>
                  <li>Overall: {passed ? 'PASS' : 'FAIL'}</li>
                  <li>Geo-fence: {compliance!.geoFenceOk ? 'OK' : 'FAIL'}</li>
                  <li>Season: {compliance!.seasonOk ? 'OK' : 'FAIL'}</li>
                  <li>Quality: {compliance!.qualityOk ? 'OK' : 'FAIL'}</li>
                </ul>
              </div>
              <div>
                <strong>Counts</strong>
                <ul>
                  <li>Collections: {prov.collectionEvents.length}</li>
                  <li>Processing Steps: {prov.processingSteps.length}</li>
                  <li>Quality Tests: {prov.qualityTests.length}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


