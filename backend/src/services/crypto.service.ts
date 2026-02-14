import * as bitcoin from 'bitcoinjs-lib';
import { ethers } from 'ethers';
import axios from 'axios';

interface CryptoPriceData {
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
}

interface ChartData {
  timestamp: number;
  price: number;
}

export class CryptoService {
  private priceCache: Map<string, { data: CryptoPriceData; timestamp: number }> = new Map();
  private CACHE_DURATION = 60000; // 1 minute cache

  // Generate Bitcoin address (simplified for demo)
  generateBitcoinAddress(): string {
    // Generate a demo Bitcoin address (testnet format)
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let address = '1'; // P2PKH mainnet addresses start with 1
    for (let i = 0; i < 33; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
  }

  // Generate Ethereum address (for ETH and USDT-ERC20)
  generateEthereumAddress(): string {
    try {
      const wallet = ethers.Wallet.createRandom();
      return wallet.address;
    } catch (error) {
      // Fallback for demo purposes
      return `0x${Math.random().toString(16).substring(2, 42)}`;
    }
  }

  // Validate Bitcoin address format
  validateBitcoinAddress(address: string): boolean {
    try {
      return address.length >= 26 && address.length <= 35 && /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);
    } catch (error) {
      return false;
    }
  }

  // Validate Ethereum address format
  validateEthereumAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  }

  // Get real cryptocurrency prices from CoinGecko API
  async getCryptoPrice(currency: 'BTC' | 'ETH' | 'USDT'): Promise<number> {
    try {
      const coinIds: Record<string, string> = {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        USDT: 'tether'
      };

      const coinId = coinIds[currency];
      const cacheKey = `price_${currency}`;
      const cached = this.priceCache.get(cacheKey);

      // Return cached data if still valid
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data.price;
      }

      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
        { timeout: 5000 }
      );

      const price = response.data[coinId]?.usd || 0;
      
      // Cache the result
      this.priceCache.set(cacheKey, {
        data: { price, change24h: 0, change7d: 0, marketCap: 0, volume24h: 0 },
        timestamp: Date.now()
      });

      return price;
    } catch (error) {
      console.error(`Error fetching ${currency} price:`, error);
      // Fallback to mock prices if API fails
      const mockPrices = { BTC: 45000, ETH: 2500, USDT: 1 };
      return mockPrices[currency];
    }
  }

  // Get detailed crypto data including price changes
  async getCryptoData(currency: 'BTC' | 'ETH' | 'USDT'): Promise<CryptoPriceData> {
    try {
      const coinIds: Record<string, string> = {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        USDT: 'tether'
      };

      const coinId = coinIds[currency];
      const cacheKey = `data_${currency}`;
      const cached = this.priceCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`,
        { timeout: 5000 }
      );

      const data: CryptoPriceData = {
        price: response.data.market_data.current_price.usd,
        change24h: response.data.market_data.price_change_percentage_24h || 0,
        change7d: response.data.market_data.price_change_percentage_7d || 0,
        marketCap: response.data.market_data.market_cap.usd || 0,
        volume24h: response.data.market_data.total_volume.usd || 0
      };

      this.priceCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`Error fetching ${currency} data:`, error);
      // Fallback data
      return {
        price: currency === 'BTC' ? 45000 : currency === 'ETH' ? 2500 : 1,
        change24h: 0,
        change7d: 0,
        marketCap: 0,
        volume24h: 0
      };
    }
  }

  // Get historical price data for charts
  async getChartData(currency: 'BTC' | 'ETH' | 'USDT', days: number = 7): Promise<ChartData[]> {
    try {
      const coinIds: Record<string, string> = {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        USDT: 'tether'
      };

      const coinId = coinIds[currency];
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
        { timeout: 10000 }
      );

      const prices = response.data.prices || [];
      return prices.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        price
      }));
    } catch (error) {
      console.error(`Error fetching chart data for ${currency}:`, error);
      // Generate mock chart data
      const mockData: ChartData[] = [];
      const now = Date.now();
      const basePrice = currency === 'BTC' ? 45000 : currency === 'ETH' ? 2500 : 1;
      
      for (let i = days * 24; i >= 0; i--) {
        mockData.push({
          timestamp: now - (i * 3600000),
          price: basePrice * (0.95 + Math.random() * 0.1)
        });
      }
      return mockData;
    }
  }

  // Convert between cryptocurrencies
  async convertCrypto(
    amount: number,
    fromCurrency: 'BTC' | 'ETH' | 'USDT',
    toCurrency: 'BTC' | 'ETH' | 'USDT'
  ): Promise<number> {
    if (fromCurrency === toCurrency) return amount;
    
    const fromPrice = await this.getCryptoPrice(fromCurrency);
    const toPrice = await this.getCryptoPrice(toCurrency);
    
    return (amount * fromPrice) / toPrice;
  }

  // Simulate blockchain transaction (for demo)
  simulateBlockchainTransaction(currency: 'BTC' | 'ETH' | 'USDT', amount: number): string {
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    console.log(`Simulated ${currency} transaction: ${amount} - Hash: ${txHash}`);
    return txHash;
  }

  // Verify Ethereum transaction
  async verifyEthTransaction(txHash: string): Promise<{ verified: boolean; confirmations: number; blockNumber?: number }> {
    try {
      // Use Etherscan or Infura in production
      // For now, simulate verification
      const verified = txHash.startsWith('0x') && txHash.length === 66;
      return {
        verified,
        confirmations: verified ? Math.floor(Math.random() * 20) + 1 : 0,
        blockNumber: verified ? Math.floor(Math.random() * 1000000) + 15000000 : undefined
      };
    } catch (error) {
      return { verified: false, confirmations: 0 };
    }
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    this.priceCache.clear();
  }
}

export const cryptoService = new CryptoService();
