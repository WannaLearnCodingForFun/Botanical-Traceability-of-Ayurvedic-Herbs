let blockNumber = 1;
export const transactionHistory: Array<{
  txId: string;
  timestamp: string;
  type: string;
  batchId: string;
  status: string;
  blockNumber: number;
  chaincodeEvents: string[];
  eventId?: string;
}> = [];

export function createTransaction(type: string, batchId: string, eventType: string, eventId?: string) {
  const tx = {
    txId: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    type,
    batchId,
    status: 'COMMITTED',
    blockNumber: blockNumber++,
    chaincodeEvents: [eventType],
    eventId
  };
  transactionHistory.push(tx);
  return tx;
}

export function getTransactionHistory() {
  return transactionHistory;
}

export function getBlockNumber() {
  return blockNumber;
}



