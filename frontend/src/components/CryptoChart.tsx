import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import '../styles/CryptoChart.css';

interface CryptoPriceData {
  symbol: string;
  price: number;
  change24h: number;
  change7d: number;
  name: string;
  icon: string;
  marketCap?: number;
  volume24h?: number;
}

const CryptoChart: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoPriceData[]>([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 45230,
      change24h: 0,
      change7d: 0,
      icon: '₿',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2840,
      change24h: 0,
      change7d: 0,
      icon: 'Ξ',
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      price: 1.0,
      change24h: 0,
      change7d: 0,
      icon: '₮',
    },
  ]);

  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch real crypto prices from API
  const fetchCryptoPrices = async () => {
    try {
      const response = await api.get('/blockchain/prices');
      
      if (response.data.success) {
        const { BTC, ETH, USDT } = response.data.data;
        
        setCryptoData([
          {
            symbol: 'BTC',
            name: 'Bitcoin',
            price: BTC.price,
            change24h: BTC.change24h,
            change7d: BTC.change7d,
            marketCap: BTC.marketCap,
            volume24h: BTC.volume24h,
            icon: '₿',
          },
          {
            symbol: 'ETH',
            name: 'Ethereum',
            price: ETH.price,
            change24h: ETH.change24h,
            change7d: ETH.change7d,
            marketCap: ETH.marketCap,
            volume24h: ETH.volume24h,
            icon: 'Ξ',
          },
          {
            symbol: 'USDT',
            name: 'Tether',
            price: USDT.price,
            change24h: USDT.change24h,
            change7d: USDT.change7d,
            marketCap: USDT.marketCap,
            volume24h: USDT.volume24h,
            icon: '₮',
          },
        ]);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching crypto prices:', err);
      setError('Using cached prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchCryptoPrices();

    // Update every 60 seconds
    const interval = setInterval(fetchCryptoPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  const handlePriceClick = (index: number) => {
    setAnimatingIndex(index);
    setTimeout(() => setAnimatingIndex(null), 600);
  };

  const generateSparkline = (): string => {
    const points: number[] = [];
    for (let i = 0; i < 20; i++) {
      points.push(Math.random() * 100);
    }
    const pathString = points
      .map((y, i) => `${(i / points.length) * 100},${100 - y}`)
      .join(' L ');
    return pathString;
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(decimals)}`;
  };

  return (
    <div className="crypto-chart-container">
      <div className="chart-header">
        <h2 className="chart-title">💹 Market Overview</h2>
        <p className="chart-subtitle">
          Real-time cryptocurrency prices {loading && '(Loading...)'} {error && `(${error})`}
        </p>
      </div>

      <div className="crypto-grid">
        {cryptoData.map((crypto, index) => (
          <div
            key={crypto.symbol}
            className={`crypto-card ${animatingIndex === index ? 'animate-pulse' : ''}`}
            onClick={() => handlePriceClick(index)}
          >
            <div className="card-header">
              <div className="crypto-icon-circle">
                <span className="crypto-icon">{crypto.icon}</span>
              </div>
              <div className="crypto-info">
                <h3 className="crypto-name">{crypto.name}</h3>
                <p className="crypto-symbol">{crypto.symbol}</p>
              </div>
              <div className={`price-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                <span>
                  {crypto.change24h >= 0 ? '📈' : '📉'} {Math.abs(crypto.change24h).toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="card-body">
              <div className="price-section">
                <p className="price-label">Current Price</p>
                <h2 className="price-value">
                  ${crypto.symbol === 'USDT' ? crypto.price.toFixed(4) : crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
              </div>

              <svg className="sparkline" viewBox="0 0 100 40" preserveAspectRatio="none">
                <polyline
                  points={generateSparkline()}
                  fill="none"
                  stroke={crypto.change24h >= 0 ? '#00FF00' : '#FF4444'}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              <div className="stats-row">
                <div className="stat">
                  <span className="stat-label">24h Change</span>
                  <span className={`stat-value ${crypto.change24h >= 0 ? 'green' : 'red'}`}>
                    {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">7d Change</span>
                  <span className={`stat-value ${crypto.change7d >= 0 ? 'green' : 'red'}`}>
                    {crypto.change7d >= 0 ? '+' : ''}{crypto.change7d.toFixed(2)}%
                  </span>
                </div>
              </div>

              {crypto.marketCap && crypto.marketCap > 0 && (
                <div className="stats-row">
                  <div className="stat">
                    <span className="stat-label">Market Cap</span>
                    <span className="stat-value">{formatNumber(crypto.marketCap)}</span>
                  </div>
                  {crypto.volume24h && crypto.volume24h > 0 && (
                    <div className="stat">
                      <span className="stat-label">24h Volume</span>
                      <span className="stat-value">{formatNumber(crypto.volume24h)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="card-footer">
              <button className="buy-btn">Buy {crypto.symbol}</button>
              <button className="info-btn">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoChart;
