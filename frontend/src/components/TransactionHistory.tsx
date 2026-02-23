import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { api } from '../services/api';
import './TransactionHistory.css';

interface TransactionHistoryProps {
  userId: string;
  refresh: number;
  filter?: 'all' | 'payments' | 'withdrawals' | 'sending';
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userId, refresh, filter = 'all' }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, [userId, refresh]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await api.getTransactions(userId);
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'BTC') {
      return amount.toFixed(8);
    } else if (currency === 'ETH') {
      return amount.toFixed(6);
    } else {
      return amount.toFixed(2);
    }
  };

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  // Filtering logic
  let filtered = transactions;
  if (filter === 'payments') {
    filtered = transactions.filter(tx => tx.type === 'receive' && tx.currency !== 'BTC' && tx.currency !== 'ETH' && tx.currency !== 'USDT');
  } else if (filter === 'withdrawals') {
    filtered = transactions.filter(tx => tx.type === 'send' && (tx.currency === 'USD' || tx.currency === 'PAYPAL'));
  } else if (filter === 'sending') {
    filtered = transactions.filter(tx => tx.type === 'send' && (tx.currency === 'BTC' || tx.currency === 'ETH' || tx.currency === 'USDT'));
  }

  return (
    <div className="transaction-history">
      <h3>📜 Transaction History</h3>
      {filtered.length === 0 ? (
        <div className="no-transactions">
          <p>No transactions yet</p>
        </div>
      ) : (
        <div className="transactions-list">
          {filtered.map((tx) => (
            <div key={tx.id} className={`transaction-item ${tx.type}`}>
              <div className="tx-icon">
                {tx.type === 'send' ? '📤' : '📥'}
              </div>
              <div className="tx-details">
                <div className="tx-header">
                  <span className="tx-type">{tx.type === 'send' ? 'Sent' : 'Received'}</span>
                  <span className={`tx-status ${tx.status}`}>{tx.status}</span>
                </div>
                <div className="tx-amount">
                  {formatAmount(tx.amount, tx.currency)} {tx.currency}
                </div>
                <div className="tx-info">
                  {tx.type === 'send' && tx.recipientId && (
                    <span className="tx-party">To: {tx.recipientId}</span>
                  )}
                  {tx.type === 'receive' && tx.senderId && (
                    <span className="tx-party">From: {tx.senderId}</span>
                  )}
                  <span className="tx-date">{formatDate(tx.timestamp)}</span>
                </div>
                {tx.txHash && (
                  <div className="tx-hash">
                    Hash: {tx.txHash.substring(0, 16)}...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
