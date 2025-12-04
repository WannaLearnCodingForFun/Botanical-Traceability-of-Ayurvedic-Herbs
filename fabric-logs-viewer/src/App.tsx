import React, { useEffect, useState } from 'react';

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
    const interval = setInterval(fetchLogs, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && !logs) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <h2>Hyperledger Fabric Network Logs</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <h2>Hyperledger Fabric Network Logs</h2>
        <p style={{ color: 'crimson' }}>Error: {error}</p>
        <button onClick={fetchLogs}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <nav style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8, display: 'flex', gap: 16 }}>
        <a href="/dashboard" style={{ textDecoration: 'none', color: '#666' }}>Dashboard</a>
        <a href="/consumer" style={{ textDecoration: 'none', color: '#666' }}>Consumer Portal</a>
        <a href="/collectors" style={{ textDecoration: 'none', color: '#666' }}>Collectors</a>
        <a href="/logs" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>Fabric Logs</a>
      </nav>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Hyperledger Fabric Network Logs</h2>
        <button onClick={fetchLogs} style={{ padding: '8px 16px' }}>Refresh</button>
      </div>

      {logs && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={{ padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
              <strong>Network</strong>
              <p>{logs.network}</p>
            </div>
            <div style={{ padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
              <strong>Channel</strong>
              <p>{logs.channel}</p>
            </div>
            <div style={{ padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
              <strong>Chaincode</strong>
              <p>{logs.chaincode.name} v{logs.chaincode.version}</p>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3>Chaincode Functions</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {logs.chaincode.functions.map((fn) => (
                <span key={fn} style={{ padding: '4px 12px', background: '#e3f2fd', borderRadius: 4, fontSize: 14 }}>
                  {fn}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3>Peer Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {logs.peers.map((peer) => (
                <div key={peer.peerId} style={{ padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                  <strong>{peer.peerId}</strong>
                  <p>Status: <span style={{ color: peer.status === 'RUNNING' ? 'green' : 'red' }}>{peer.status}</span></p>
                  <p>Last Block: {peer.lastBlock}</p>
                  <p style={{ fontSize: 12, color: '#666' }}>Last TX: {new Date(peer.lastTransaction).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3>Recent Transactions</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: 12, textAlign: 'left' }}>Transaction ID</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Type</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Batch ID</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Block</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.transactions.map((tx) => (
                    <tr key={tx.txId} style={{ borderTop: '1px solid #eee' }}>
                      <td style={{ padding: 12, fontFamily: 'monospace', fontSize: 12 }}>{tx.txId}</td>
                      <td style={{ padding: 12 }}>{tx.type}</td>
                      <td style={{ padding: 12 }}>{tx.batchId}</td>
                      <td style={{ padding: 12 }}>
                        <span style={{ 
                          padding: '2px 8px', 
                          borderRadius: 4, 
                          background: tx.status === 'COMMITTED' ? '#e8f5e9' : '#fff3e0',
                          color: tx.status === 'COMMITTED' ? '#2e7d32' : '#e65100'
                        }}>
                          {tx.status}
                        </span>
                      </td>
                      <td style={{ padding: 12 }}>{tx.blockNumber}</td>
                      <td style={{ padding: 12, fontSize: 12 }}>{new Date(tx.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}



