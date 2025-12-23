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
  warning: '#7a5a2d',
  warningBg: '#faf5e8',
  error: '#8b3a3a',
  errorBg: '#fdf2f2',
};

type Transaction = {
  txId: string;
  timestamp: string;
  type: string;
  batchId: string;
  status: string;
  blockNumber: number;
  chaincodeEvents: string[];
};

type Peer = {
  peerId: string;
  status: string;
  lastBlock: number;
  lastTransaction: string;
};

type LogsData = {
  network: string;
  channel: string;
  chaincode: string;
  transactions: Transaction[];
  peers: Peer[];
  chaincode: {
    name: string;
    version: string;
    status: string;
    functions: string[];
  };
};

export default function App() {
  const [logs, setLogs] = useState<LogsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/fabric-logs');
      if (!res.ok) throw new Error('Failed to fetch logs');
      const data = await res.json();
      setLogs(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !logs) {
    return (
      <div style={{ minHeight: '100vh', background: colors.background, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <header style={{ background: colors.primary, padding: '16px 24px', boxShadow: '0 2px 8px rgba(45, 90, 61, 0.15)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h1 style={{ color: '#ffffff', fontSize: 18, fontWeight: 600, margin: 0 }}>Botanical Traceability System</h1>
          </div>
        </header>
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, color: colors.text, marginBottom: 24 }}>Hyperledger Fabric Network Logs</h2>
          <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <LoadingSpinner text="Loading network data..." />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: colors.background, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <header style={{ background: colors.primary, padding: '16px 24px', boxShadow: '0 2px 8px rgba(45, 90, 61, 0.15)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h1 style={{ color: '#ffffff', fontSize: 18, fontWeight: 600, margin: 0 }}>Botanical Traceability System</h1>
          </div>
        </header>
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, color: colors.text, marginBottom: 24 }}>Hyperledger Fabric Network Logs</h2>
          <div style={{ background: colors.errorBg, borderRadius: 12, border: `1px solid ${colors.error}`, padding: 24, marginBottom: 20 }}>
            <p style={{ color: colors.error, fontSize: 15, margin: 0 }}>Error: {error}</p>
          </div>
          <button 
            onClick={fetchLogs}
            style={{ 
              padding: '10px 20px', 
              background: colors.primary, 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: 8, 
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Retry
          </button>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.background, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <header style={{ background: colors.primary, padding: '16px 24px', boxShadow: '0 2px 8px rgba(45, 90, 61, 0.15)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: '#ffffff', fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: '-0.3px' }}>Botanical Traceability System</h1>
          <nav style={{ display: 'flex', gap: 8 }}>
            <a href="/dashboard" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>Dashboard</a>
            <a href="/consumer" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>Consumer Portal</a>
            <a href="/collectors" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>Collectors</a>
            <a href="/logs" style={{ textDecoration: 'none', color: '#ffffff', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500, background: 'rgba(255,255,255,0.15)' }}>Fabric Logs</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 600, color: colors.text, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Hyperledger Fabric Network Logs</h2>
            <p style={{ color: colors.textSecondary, margin: 0, fontSize: 15, lineHeight: 1.5 }}>Monitor blockchain network status, peer health, and transaction history</p>
          </div>
          <button 
            onClick={fetchLogs} 
            style={{ 
              padding: '10px 20px', 
              background: colors.surfaceAlt, 
              color: colors.text, 
              border: `1px solid ${colors.border}`, 
              borderRadius: 8, 
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 14,
              transition: 'background 0.2s ease',
            }}
          >
            Refresh
          </button>
        </div>

        {logs && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 28 }}>
              <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Network</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>{logs.network}</div>
              </div>
              <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Channel</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>{logs.channel}</div>
              </div>
              <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Chaincode</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>{logs.chaincode.name} <span style={{ fontSize: 13, fontWeight: 400, color: colors.textMuted }}>v{logs.chaincode.version}</span></div>
              </div>
            </div>

            <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 24, marginBottom: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0', paddingBottom: 12, borderBottom: `1px solid ${colors.borderLight}` }}>Chaincode Functions</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {logs.chaincode.functions.map((fn) => (
                  <span key={fn} style={{ padding: '6px 14px', background: colors.successBg, borderRadius: 6, fontSize: 13, fontWeight: 500, color: colors.primary, border: `1px solid ${colors.border}` }}>
                    {fn}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 24, marginBottom: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 20px 0', paddingBottom: 12, borderBottom: `1px solid ${colors.borderLight}` }}>Peer Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {logs.peers.map((peer) => (
                  <div key={peer.peerId} style={{ padding: 20, background: colors.surfaceAlt, borderRadius: 10, border: `1px solid ${colors.borderLight}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontWeight: 600, color: colors.text, fontSize: 15 }}>{peer.peerId}</span>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: 4, 
                        fontSize: 12, 
                        fontWeight: 600,
                        background: peer.status === 'RUNNING' ? colors.successBg : colors.errorBg,
                        color: peer.status === 'RUNNING' ? colors.success : colors.error,
                      }}>
                        {peer.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ color: colors.textMuted, fontSize: 13 }}>Last Block</span>
                      <span style={{ fontWeight: 600, color: colors.text, fontSize: 14 }}>{peer.lastBlock}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: colors.textMuted, fontSize: 13 }}>Last Transaction</span>
                      <span style={{ color: colors.textSecondary, fontSize: 12 }}>{new Date(peer.lastTransaction).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 20px 0', paddingBottom: 12, borderBottom: `1px solid ${colors.borderLight}` }}>Recent Transactions</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${colors.borderLight}` }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transaction ID</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Batch ID</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Block</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.transactions.map((tx) => (
                      <tr key={tx.txId} style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                        <td style={{ padding: '14px 16px', fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace', fontSize: 12, color: colors.textSecondary }}>{tx.txId}</td>
                        <td style={{ padding: '14px 16px', fontSize: 14, color: colors.text, fontWeight: 500 }}>{tx.type}</td>
                        <td style={{ padding: '14px 16px', fontSize: 14, color: colors.text }}>{tx.batchId}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: 4, 
                            fontSize: 12,
                            fontWeight: 600,
                            background: tx.status === 'COMMITTED' ? colors.successBg : colors.warningBg,
                            color: tx.status === 'COMMITTED' ? colors.success : colors.warning,
                          }}>
                            {tx.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 14, color: colors.text, fontWeight: 500 }}>{tx.blockNumber}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textMuted }}>{new Date(tx.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}



