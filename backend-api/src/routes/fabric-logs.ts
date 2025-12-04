import { Router } from 'express';
import { adapter } from '../adapters/memoryAdapter.js';
import { transactionHistory, getBlockNumber, createTransaction } from '../services/transactionManager.js';

export const router = Router();

// Get transaction logs (real data from memory adapter)
router.get('/', async (_req, res) => {
  const collectionEvents = await adapter.getAllCollectionEvents();
  const allBatches = await adapter.getAllBatches();
  
  // Sync transactions with actual data
  const existingEventIds = new Set(transactionHistory.map(tx => tx.eventId).filter(Boolean));
  
  // Add collection events as transactions
  collectionEvents.forEach((evt) => {
    if (!existingEventIds.has(evt.id)) {
      createTransaction('CollectionEvent', evt.batchId, 'CollectionRecorded', evt.id);
    }
  });
  
  // Sync processing steps and quality tests (they're stored but we need to check them)
  // This will be handled when they're created via the routes

  // Sort by timestamp (newest first)
  const sortedTransactions = [...transactionHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const logs = {
    network: 'traceability-network',
    channel: 'traceability-channel',
    chaincode: 'traceability-chaincode',
    transactions: sortedTransactions.slice(0, 50), // Last 50 transactions
    totalTransactions: transactionHistory.length,
    totalBatches: allBatches.length,
    peers: [
      {
        peerId: 'peer0.farmers.example.com',
        status: 'RUNNING',
        lastBlock: getBlockNumber() - 1,
        lastTransaction: sortedTransactions[0]?.timestamp || new Date().toISOString()
      },
      {
        peerId: 'peer0.labs.example.com',
        status: 'RUNNING',
        lastBlock: getBlockNumber() - 1,
        lastTransaction: sortedTransactions[0]?.timestamp || new Date().toISOString()
      },
      {
        peerId: 'peer0.processors.example.com',
        status: 'RUNNING',
        lastBlock: getBlockNumber() - 1,
        lastTransaction: sortedTransactions[0]?.timestamp || new Date().toISOString()
      }
    ],
    chaincode: {
      name: 'traceability-chaincode',
      version: '1.0',
      status: 'INSTALLED',
      functions: ['addCollectionEvent', 'addProcessingStep', 'addQualityTest', 'getProvenance']
    }
  };
  res.json(logs);
});

// Get specific transaction details
router.get('/tx/:txId', async (req, res) => {
  const { txId } = req.params;
  const tx = transactionHistory.find(t => t.txId === txId);
  if (!tx) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.json({
    ...tx,
    payload: {
      batchId: tx.batchId,
      eventType: tx.type,
      validated: true
    }
  });
});

// Get block information
router.get('/blocks/:blockNumber', async (req, res) => {
  const { blockNumber } = req.params;
  const blockNum = parseInt(blockNumber);
  const txsInBlock = transactionHistory.filter(tx => tx.blockNumber === blockNum);
  res.json({
    blockNumber: blockNum,
    transactions: txsInBlock,
    blockHash: '0x' + Math.random().toString(16).substr(2, 64),
    timestamp: txsInBlock[0]?.timestamp || new Date().toISOString()
  });
});

