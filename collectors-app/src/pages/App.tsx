import React, { useEffect, useState } from 'react';

export default function App() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [manualLat, setManualLat] = useState<string>('');
  const [manualLng, setManualLng] = useState<string>('');
  const [useManualLocation, setUseManualLocation] = useState(false);
  const [species, setSpecies] = useState('Ashwagandha');
  const [batchId, setBatchId] = useState('ASHWA-001');
  const [collectorId, setCollectorId] = useState('collector-001');
  const [moisturePercent, setMoisturePercent] = useState<number | ''>('');
  const [weightKg, setWeightKg] = useState<number | ''>('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if (!useManualLocation && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setStatus('Location not available - use manual entry'),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, [useManualLocation]);

  const submit = async () => {
    setStatus('Submitting...');
    
    // Validate required fields
    if (!batchId.trim()) {
      setStatus('Error: Batch ID is required');
      return;
    }
    if (!species.trim()) {
      setStatus('Error: Species is required');
      return;
    }
    if (!collectorId.trim()) {
      setStatus('Error: Collector ID is required');
      return;
    }

    // Get coordinates - prioritize manual entry if checkbox is checked
    let finalCoords: { lat: number; lng: number };
    
    if (useManualLocation) {
      const lat = parseFloat(manualLat);
      const lng = parseFloat(manualLng);
      
      if (isNaN(lat) || isNaN(lng)) {
        setStatus('Error: Please enter valid latitude and longitude values');
        return;
      }
      
      if (lat < -90 || lat > 90) {
        setStatus('Error: Latitude must be between -90 and 90');
        return;
      }
      
      if (lng < -180 || lng > 180) {
        setStatus('Error: Longitude must be between -180 and 180');
        return;
      }
      
      finalCoords = { lat, lng };
    } else {
      // Use GPS coordinates if available, otherwise fallback to default
      finalCoords = coords || { lat: 20.5937, lng: 78.9629 };
    }

    try {
      const payload = {
        batchId: batchId.trim(),
        species: species.trim(),
        collectorId: collectorId.trim(),
        gps: finalCoords,
        timestamp: new Date().toISOString(),
        initialQuality: {
          moisturePercent: moisturePercent === '' ? undefined : Number(moisturePercent),
          weightKg: weightKg === '' ? undefined : Number(weightKg),
        },
      };
      
      const res = await fetch('/api/collection', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to submit');
      }
      
      setStatus('Submitted successfully! Location: ' + finalCoords.lat.toFixed(4) + ', ' + finalCoords.lng.toFixed(4));
      
      // Reset form but keep manual location checkbox state
      setBatchId('');
      setSpecies('Ashwagandha');
      setMoisturePercent('');
      setWeightKg('');
      if (!useManualLocation) {
        setCoords(null);
      } else {
        setManualLat('');
        setManualLng('');
      }
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <nav style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8, display: 'flex', gap: 16 }}>
        <a href="/dashboard" style={{ textDecoration: 'none', color: '#666' }}>Dashboard</a>
        <a href="/consumer" style={{ textDecoration: 'none', color: '#666' }}>Consumer Portal</a>
        <a href="/collectors" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>Collectors</a>
        <a href="/logs" style={{ textDecoration: 'none', color: '#666' }}>Fabric Logs</a>
      </nav>
      <h2>Collectors - Record Collection Event</h2>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Batch ID *</label>
        <input 
          value={batchId} 
          onChange={(e) => setBatchId(e.target.value)} 
          placeholder="e.g. ASHWA-001"
          style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} 
        />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Species *</label>
        <input 
          value={species} 
          onChange={(e) => setSpecies(e.target.value)} 
          placeholder="e.g. Ashwagandha"
          style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} 
        />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Collector ID *</label>
        <input 
          value={collectorId} 
          onChange={(e) => setCollectorId(e.target.value)} 
          placeholder="e.g. collector-001"
          style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} 
        />
      </div>
      
      <div style={{ marginBottom: 16, padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={useManualLocation} 
            onChange={(e) => {
              setUseManualLocation(e.target.checked);
              if (e.target.checked) {
                setCoords(null);
              }
            }} 
          />
          <span style={{ fontWeight: 'bold' }}>Enter location manually</span>
        </label>
        
        {useManualLocation ? (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Latitude *</label>
                <input 
                  type="number" 
                  step="any" 
                  value={manualLat} 
                  onChange={(e) => setManualLat(e.target.value)} 
                  placeholder="e.g. 20.5937"
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Longitude *</label>
                <input 
                  type="number" 
                  step="any" 
                  value={manualLng} 
                  onChange={(e) => setManualLng(e.target.value)} 
                  placeholder="e.g. 78.9629"
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} 
                />
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
              Enter coordinates between -90 to 90 for latitude and -180 to 180 for longitude
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Latitude (GPS)</label>
                <input 
                  type="number" 
                  step="any" 
                  value={coords?.lat?.toFixed(6) ?? ''} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      setCoords({ lat: val, lng: coords?.lng ?? 0 });
                    }
                  }} 
                  placeholder="Auto-detected from GPS"
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, background: coords ? '#fff' : '#f5f5f5' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Longitude (GPS)</label>
                <input 
                  type="number" 
                  step="any" 
                  value={coords?.lng?.toFixed(6) ?? ''} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      setCoords({ lat: coords?.lat ?? 0, lng: val });
                    }
                  }} 
                  placeholder="Auto-detected from GPS"
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, background: coords ? '#fff' : '#f5f5f5' }} 
                />
              </div>
            </div>
            {!coords && (
              <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                Waiting for GPS location... Check the box above to enter manually
              </p>
            )}
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Moisture %</label>
          <input 
            type="number" 
            step="any"
            value={moisturePercent} 
            onChange={(e) => setMoisturePercent(e.target.value === '' ? '' : Number(e.target.value))} 
            placeholder="Optional"
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} 
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Weight (kg)</label>
          <input 
            type="number" 
            step="any"
            value={weightKg} 
            onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))} 
            placeholder="Optional"
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} 
          />
        </div>
      </div>
      
      <button 
        onClick={submit} 
        style={{ 
          padding: '12px 24px', 
          marginTop: 12, 
          background: '#1976d2', 
          color: 'white', 
          border: 'none', 
          borderRadius: 4, 
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: 16,
          width: '100%'
        }}
      >
        Submit Collection Event
      </button>
      
      {status && (
        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          borderRadius: 4,
          background: status.includes('Error') ? '#ffebee' : '#e8f5e9',
          color: status.includes('Error') ? '#c62828' : '#2e7d32',
          border: `1px solid ${status.includes('Error') ? '#ef5350' : '#4caf50'}`
        }}>
          {status}
        </div>
      )}
      
      <p style={{ fontSize: 12, color: '#666', marginTop: 16 }}>
        * Required fields. Location can be entered manually or detected via GPS.
      </p>
    </div>
  );
}


