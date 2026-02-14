import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/CryptoTrade.css';

interface TradeProps {
  onClose?: () => void;
  onTradeSuccess?: () => void;
}

interface PriceData {
  price: number;
  change24h: number;
}

export const CryptoTrade = ({ onClose, onTradeSuccess }: TradeProps) => {
  const [fromCurrency, setFromCurrency] = useState<'BTC' | 'ETH' | 'USDT'>('USDT');
  const [toCurrency, setToCurrency] = useState<'BTC' | 'ETH' | 'USDT'>('BTC');
  const [amount, setAmount] = useState('');
  const [estimatedReceive, setEstimatedReceive] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [prices, setPrices] = useState<Record<string, PriceData>>({});

  // Fetch current prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await api.get('/blockchain/prices');
        if (response.data.success) {
          setPrices(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching prices:', err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  // Calculate estimated receive amount
  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && prices[fromCurrency] && prices[toCurrency]) {
      const fromPrice = prices[fromCurrency].price;
      const toPrice = prices[toCurrency].price;
      const tradingFee = 0.005; // 0.5% fee
      
      const usdValue = parseFloat(amount) * fromPrice;
      const received = (usdValue / toPrice) * (1 - tradingFee);
      
      setEstimatedReceive(received.toFixed(8));
    } else {
      setEstimatedReceive('0');
    }
  }, [amount, fromCurrency, toCurrency, prices]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!amount || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        setLoading(false);
        return;
      }

      if (fromCurrency === toCurrency) {
        setError('Cannot trade the same currency');
        setLoading(false);
        return;
      }

      // Generate demo addresses (in production, use actual wallet addresses)
      const fromAddress = fromCurrency === 'BTC' 
        ? '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
        : '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
      
      const toAddress = toCurrency === 'BTC'
        ? '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'
        : '0x2910543Af39aBA0Cd09dBb2D50200b3E800A63D2';

      const response = await api.post('/blockchain/trade', {
        fromCurrency,
        toCurrency,
        amount: parseFloat(amount),
        fromAddress,
        toAddress
      });

      if (response.data.success) {
        setSuccess(`Trade successful! You received ${response.data.receivedAmount?.toFixed(8)} ${toCurrency}`);
        setAmount('');
        
        setTimeout(() => {
          onTradeSuccess?.();
          onClose?.();
        }, 2000);
      } else {
        setError(response.data.message || 'Trade failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Trade execution failed');
    } finally {
      setLoading(false);
    }
  };

  const getCurrencyIcon = (currency: string) => {
    const icons: Record<string, string> = {
      BTC: '₿',
      ETH: 'Ξ',
      USDT: '₮'
    };
    return icons[currency] || currency;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="trade-modal" onClick={(e) => e.stopPropagation()}>
        <div className="trade-header">
          <h2>🔄 Trade Cryptocurrency</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleTrade}>
          <div className="trade-section">
            <label>From</label>
            <div className="currency-input-group">
              <select 
                value={fromCurrency} 
                onChange={(e) => setFromCurrency(e.target.value as 'BTC' | 'ETH' | 'USDT')}
                className="currency-select"
              >
                <option value="BTC">{getCurrencyIcon('BTC')} Bitcoin (BTC)</option>
                <option value="ETH">{getCurrencyIcon('ETH')} Ethereum (ETH)</option>
                <option value="USDT">{getCurrencyIcon('USDT')} Tether (USDT)</option>
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="any"
                min="0"
                required
                className="amount-input"
              />
            </div>
            {prices[fromCurrency] && (
              <p className="price-info">
                1 {fromCurrency} ≈ ${prices[fromCurrency].price.toLocaleString()}
                <span className={prices[fromCurrency].change24h >= 0 ? 'green' : 'red'}>
                  {' '}({prices[fromCurrency].change24h >= 0 ? '+' : ''}{prices[fromCurrency].change24h.toFixed(2)}%)
                </span>
              </p>
            )}
          </div>

          <div className="swap-button-container">
            <button 
              type="button" 
              className="swap-btn" 
              onClick={handleSwapCurrencies}
              title="Swap currencies"
            >
              ⇅
            </button>
          </div>

          <div className="trade-section">
            <label>To (Estimated)</label>
            <div className="currency-input-group">
              <select 
                value={toCurrency} 
                onChange={(e) => setToCurrency(e.target.value as 'BTC' | 'ETH' | 'USDT')}
                className="currency-select"
              >
                <option value="BTC">{getCurrencyIcon('BTC')} Bitcoin (BTC)</option>
                <option value="ETH">{getCurrencyIcon('ETH')} Ethereum (ETH)</option>
                <option value="USDT">{getCurrencyIcon('USDT')} Tether (USDT)</option>
              </select>
              <input
                type="text"
                value={estimatedReceive}
                readOnly
                className="amount-input estimated"
              />
            </div>
            {prices[toCurrency] && (
              <p className="price-info">
                1 {toCurrency} ≈ ${prices[toCurrency].price.toLocaleString()}
                <span className={prices[toCurrency].change24h >= 0 ? 'green' : 'red'}>
                  {' '}({prices[toCurrency].change24h >= 0 ? '+' : ''}{prices[toCurrency].change24h.toFixed(2)}%)
                </span>
              </p>
            )}
          </div>

          <div className="trade-info">
            <div className="info-row">
              <span>Trading Fee (0.5%):</span>
              <span>{amount ? (parseFloat(amount) * 0.005).toFixed(8) : '0'} {fromCurrency}</span>
            </div>
            <div className="info-row">
              <span>Transaction:</span>
              <span>On-chain (Blockchain verified)</span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="trade-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="trade-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Execute Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CryptoTrade;
