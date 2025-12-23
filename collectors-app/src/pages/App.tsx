import React, { useEffect, useState } from 'react';

const LoadingSpinner = () => (
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
    <p style={{ marginTop: 16, color: '#4a5d4e', fontSize: 14, fontWeight: 500 }}>Loading...</p>
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

const styles = {
  container: {
    minHeight: '100vh',
    background: colors.background,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    background: colors.primary,
    padding: '16px 24px',
    boxShadow: '0 2px 8px rgba(45, 90, 61, 0.15)',
  },
  headerContent: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
    letterSpacing: '-0.3px',
  },
  nav: {
    display: 'flex',
    gap: 8,
  },
  navLink: {
    textDecoration: 'none',
    color: 'rgba(255,255,255,0.8)',
    padding: '8px 16px',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  navLinkActive: {
    textDecoration: 'none',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    background: 'rgba(255,255,255,0.15)',
  },
  main: {
    maxWidth: 640,
    margin: '0 auto',
    padding: '32px 24px',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 600,
    color: colors.text,
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  pageSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    margin: '0 0 32px 0',
    lineHeight: 1.5,
  },
  card: {
    background: colors.surface,
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    padding: 24,
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.text,
    margin: '0 0 20px 0',
    paddingBottom: 12,
    borderBottom: `1px solid ${colors.borderLight}`,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 500,
    color: colors.text,
  },
  labelRequired: {
    color: colors.error,
    marginLeft: 2,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    fontSize: 14,
    color: colors.text,
    background: colors.surface,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  inputDisabled: {
    background: colors.surfaceAlt,
  },
  checkbox: {
    width: 18,
    height: 18,
    accentColor: colors.primary,
  },
  button: {
    padding: '14px 24px',
    background: colors.primary,
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 15,
    width: '100%',
    transition: 'background 0.2s ease, transform 0.1s ease',
    boxShadow: '0 2px 4px rgba(45, 90, 61, 0.2)',
  },
  alert: {
    padding: '14px 16px',
    borderRadius: 8,
    fontSize: 14,
    lineHeight: 1.5,
  },
  alertSuccess: {
    background: colors.successBg,
    color: colors.success,
    border: `1px solid ${colors.primary}`,
  },
  alertError: {
    background: colors.errorBg,
    color: colors.error,
    border: `1px solid ${colors.error}`,
  },
  helpText: {
    fontSize: 13,
    color: colors.textMuted,
    margin: '8px 0 0 0',
    lineHeight: 1.4,
  },
  locationBox: {
    background: colors.surfaceAlt,
    borderRadius: 8,
    padding: 16,
    border: `1px solid ${colors.borderLight}`,
  },
  row: {
    display: 'flex',
    gap: 16,
  },
  col: {
    flex: 1,
  },
};

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
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>Botanical Traceability System</h1>
          <nav style={styles.nav}>
            <a href="/dashboard" style={styles.navLink}>Dashboard</a>
            <a href="/consumer" style={styles.navLink}>Consumer Portal</a>
            <a href="/collectors" style={styles.navLinkActive}>Collectors</a>
            <a href="/logs" style={styles.navLink}>Fabric Logs</a>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <h2 style={styles.pageTitle}>Record Collection Event</h2>
        <p style={styles.pageSubtitle}>
          Document the collection of Ayurvedic herbs with GPS coordinates and quality metrics for full traceability.
        </p>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Collection Details</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Batch ID<span style={styles.labelRequired}>*</span>
            </label>
            <input 
              value={batchId} 
              onChange={(e) => setBatchId(e.target.value)} 
              placeholder="e.g. ASHWA-001"
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Species<span style={styles.labelRequired}>*</span>
            </label>
            <input 
              value={species} 
              onChange={(e) => setSpecies(e.target.value)} 
              placeholder="e.g. Ashwagandha"
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Collector ID<span style={styles.labelRequired}>*</span>
            </label>
            <input 
              value={collectorId} 
              onChange={(e) => setCollectorId(e.target.value)} 
              placeholder="e.g. collector-001"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Location Information</h3>
          
          <div style={styles.locationBox}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: useManualLocation ? 16 : 0 }}>
              <input 
                type="checkbox" 
                checked={useManualLocation} 
                onChange={(e) => {
                  setUseManualLocation(e.target.checked);
                  if (e.target.checked) {
                    setCoords(null);
                  }
                }}
                style={styles.checkbox}
              />
              <span style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>Enter location manually</span>
            </label>
            
            {useManualLocation ? (
              <div>
                <div style={styles.row}>
                  <div style={styles.col}>
                    <label style={styles.label}>Latitude<span style={styles.labelRequired}>*</span></label>
                    <input 
                      type="number" 
                      step="any" 
                      value={manualLat} 
                      onChange={(e) => setManualLat(e.target.value)} 
                      placeholder="e.g. 20.5937"
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.col}>
                    <label style={styles.label}>Longitude<span style={styles.labelRequired}>*</span></label>
                    <input 
                      type="number" 
                      step="any" 
                      value={manualLng} 
                      onChange={(e) => setManualLng(e.target.value)} 
                      placeholder="e.g. 78.9629"
                      style={styles.input}
                    />
                  </div>
                </div>
                <p style={styles.helpText}>
                  Enter coordinates between -90 to 90 for latitude and -180 to 180 for longitude
                </p>
              </div>
            ) : (
              <div>
                <div style={{ ...styles.row, marginTop: 16 }}>
                  <div style={styles.col}>
                    <label style={styles.label}>Latitude (GPS)</label>
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
                      style={{ ...styles.input, ...(coords ? {} : styles.inputDisabled) }}
                    />
                  </div>
                  <div style={styles.col}>
                    <label style={styles.label}>Longitude (GPS)</label>
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
                      style={{ ...styles.input, ...(coords ? {} : styles.inputDisabled) }}
                    />
                  </div>
                </div>
                {!coords && (
                  <p style={styles.helpText}>
                    Waiting for GPS location... Check the box above to enter manually
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Quality Metrics (Optional)</h3>
          
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Moisture %</label>
              <input 
                type="number" 
                step="any"
                value={moisturePercent} 
                onChange={(e) => setMoisturePercent(e.target.value === '' ? '' : Number(e.target.value))} 
                placeholder="Enter moisture percentage"
                style={styles.input}
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Weight (kg)</label>
              <input 
                type="number" 
                step="any"
                value={weightKg} 
                onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))} 
                placeholder="Enter weight in kg"
                style={styles.input}
              />
            </div>
          </div>
        </div>
        
        <button 
          onClick={submit} 
          style={{
            ...styles.button,
            opacity: status === 'Submitting...' ? 0.7 : 1,
            cursor: status === 'Submitting...' ? 'not-allowed' : 'pointer',
          }}
          disabled={status === 'Submitting...'}
          onMouseEnter={(e) => status !== 'Submitting...' && (e.currentTarget.style.background = colors.primaryDark)}
          onMouseLeave={(e) => (e.currentTarget.style.background = colors.primary)}
        >
          {status === 'Submitting...' ? 'Submitting...' : 'Submit Collection Event'}
        </button>
        
        {status === 'Submitting...' && (
          <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, marginTop: 20 }}>
            <LoadingSpinner />
          </div>
        )}

        {status && status !== 'Submitting...' && (
          <div style={{ 
            ...styles.alert,
            ...(status.includes('Error') ? styles.alertError : styles.alertSuccess),
            marginTop: 20,
          }}>
            {status}
          </div>
        )}
        
        <p style={{ ...styles.helpText, marginTop: 20, textAlign: 'center' as const }}>
          Fields marked with * are required. Location can be entered manually or detected via GPS.
        </p>
      </main>
    </div>
  );
}


