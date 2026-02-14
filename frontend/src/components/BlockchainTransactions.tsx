import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/BlockchainTransactions.css';

interface BlockchainTransaction {
  _id: string;
  transactionHash: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  currency: 'BTC' | 'ETH' | 'USDT';
  type: 'send' | 'receive' | 'trade';
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  blockNumber?: number;
  verified: boolean;
  metadata?: {
    tradePair?: string;
    receivedAmount?: number;
    receivedCurrency?: string;
  };
  createdAt: string;
  confirmedAt?: string;
}

export const BlockchainTransactions = () => {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'trade' | 'send' | 'receive'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [filter, statusFilter]);

  const fetchTransactions = async () => {
    try {
      const params: any = { limit: 50 };
      if (filter !== 'all') params.type = filter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await api.get('/blockchain/transactions', { params });
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: '⏳ Pending',
      confirmed: '✅ Confirmed',
      failed: '❌ Failed'
    };
    return badges[status] || status;
  };

  const getTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      trade: '🔄 Trade',
      send: '📤 Send',
      receive: '📥 Receive'
    };
    return badges[type] || type;
  };

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="blockchain-transactions">
      <div className="transactions-header">
        <h2>⛓️ Blockchain Transactions</h2>
        <p className="subtitle">All transactions are verified on the blockchain</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Type:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">All Types</option>
            <option value="trade">Trades</option>
            <option value="send">Sent</option>
            <option value="receive">Received</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
          </select>
        </div>

        <button className="refresh-btn" onClick={fetchTransactions}>
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <p>No blockchain transactions found</p>
          <p className="hint">Your trades will appear here once executed</p>
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.map((tx) => (
            <div key={tx._id} className={`transaction-card ${tx.status}`}>
              <div className="tx-header">
                <span className={`type-badge ${tx.type}`}>{getTypeBadge(tx.type)}</span>
                <span className={`status-badge ${tx.status}`}>{getStatusBadge(tx.status)}</span>
              </div>

              <div className="tx-body">
                <div className="tx-main-info">
                  {tx.type === 'trade' && tx.metadata?.tradePair ? (
                    <>
                      <div className="tx-amount">
                        <span className="label">Traded:</span>
                        <span className="value">{tx.amount} {tx.currency}</span>
                      </div>
                      <div className="tx-amount">
                        <span className="label">Received:</span>
                        <span className="value received">
                          {tx.metadata.receivedAmount?.toFixed(8)} {tx.metadata.receivedCurrency}
                        </span>
                      </div>
                      <div className="tx-pair">
                        <span className="label">Pair:</span>
                        <span className="value">{tx.metadata.tradePair}</span>
                      </div>
                    </>
                  ) : (
                    <div className="tx-amount">
                      <span className="label">Amount:</span>
                      <span className="value">{tx.amount} {tx.currency}</span>
                    </div>
                  )}
                </div>

                <div className="tx-details">
                  <div className="detail-row">
                    <span className="label">Transaction Hash:</span>
                    <span className="value hash" title={tx.transactionHash}>
                      {truncateHash(tx.transactionHash)}
                    </span>
                  </div>

                  {tx.blockNumber && (
                    <div className="detail-row">
                      <span className="label">Block:</span>
                      <span className="value">{tx.blockNumber}</span>
                    </div>
                  )}

                  <div className="detail-row">
                    <span className="label">Confirmations:</span>
                    <span className="value">{tx.confirmations}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Verified:</span>
                    <span className={`value ${tx.verified ? 'verified' : 'unverified'}`}>
                      {tx.verified ? '✓ Yes' : '○ No'}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span className="value">{formatDate(tx.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockchainTransactions;
