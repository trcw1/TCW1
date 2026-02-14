# Blockchain Integration & Real-Time Trading Features

This document describes the blockchain integration and real-time trading features added to the TCW1 payment application.

## Features Overview

### 1. Real-Time Cryptocurrency Prices
- **Live Price Data**: Integration with CoinGecko API for real-time crypto prices
- **Supported Currencies**: Bitcoin (BTC), Ethereum (ETH), Tether (USDT)
- **Data Displayed**:
  - Current price in USD
  - 24-hour price change percentage
  - 7-day price change percentage
  - Market capitalization
  - 24-hour trading volume
- **Auto-Refresh**: Prices update every 60 seconds automatically
- **Caching**: 1-minute cache to reduce API calls

### 2. Blockchain Transaction Recording
All transactions are now recorded on a blockchain ledger with the following features:

#### Transaction Model
- **Transaction Hash**: Unique blockchain identifier
- **Block Number**: Block where transaction was included
- **Verification Status**: Real-time blockchain verification
- **Confirmations**: Number of network confirmations
- **Type**: Send, Receive, or Trade
- **Metadata**: Additional trade information (pairs, prices, fees)

#### Blockchain Verification
- Ethereum transaction verification
- Confirmation tracking (12 confirmations for finalization)
- Block number recording
- Gas fee tracking (for ETH/USDT)

### 3. Cryptocurrency Trading System
Built-in trading platform with blockchain verification:

#### Trading Features
- **Direct Trading**: Trade between BTC, ETH, and USDT
- **Real-Time Rates**: Live exchange rates from market data
- **Trading Fee**: 0.5% fee on all trades
- **Instant Execution**: Trades execute immediately
- **Blockchain Recording**: All trades recorded on blockchain

#### Trade UI
- Visual currency swap interface
- Real-time price updates during trading
- Estimated receive amount calculation
- Trading fee transparency
- Success/error notifications

### 4. Transaction History & Monitoring
Complete blockchain transaction viewer:

#### Features
- **Real-Time Updates**: Auto-refresh every 10 seconds
- **Filtering**: Filter by type (trade/send/receive) and status
- **Verification Status**: See which transactions are blockchain-verified
- **Detailed Information**:
  - Transaction hash
  - Block number
  - Confirmations count
  - Amount and currency
  - Timestamp
  - Trade pairs (for trades)

## API Endpoints

### Price Data
```
GET /api/blockchain/prices
```
Returns current prices and 24h/7d changes for BTC, ETH, USDT

```
GET /api/blockchain/chart/:currency?days=7
```
Returns historical price data for charting

### Trading
```
POST /api/blockchain/trade
```
Execute a cryptocurrency trade
**Body**:
```json
{
  "fromCurrency": "USDT",
  "toCurrency": "BTC",
  "amount": 1000,
  "fromAddress": "0x...",
  "toAddress": "0x..."
}
```

### Transaction Management
```
GET /api/blockchain/transactions?limit=50&status=confirmed&type=trade
```
Get user's blockchain transactions with optional filters

```
GET /api/blockchain/transaction/:hash
```
Get specific transaction by hash

```
POST /api/blockchain/verify/:hash
```
Verify a transaction on the blockchain

```
GET /api/blockchain/stats
```
Get user's trading statistics

```
GET /api/blockchain/recent?limit=20
```
Get recent public blockchain transactions

## Frontend Components

### CryptoChart
- Displays real-time cryptocurrency prices
- Shows market data (price, changes, market cap, volume)
- Auto-updates every 60 seconds
- Visual price change indicators

### CryptoTrade
- Modal dialog for executing trades
- Currency selection for from/to pairs
- Amount input with live conversion
- Swap currencies button
- Fee calculation display
- Trade execution with blockchain recording

### BlockchainTransactions
- List view of all blockchain transactions
- Filter by type and status
- Real-time confirmation tracking
- Transaction hash display
- Verification status indicators

## Database Models

### BlockchainTransaction Schema
```typescript
{
  userId: String (indexed)
  transactionHash: String (unique, indexed)
  blockNumber: Number
  fromAddress: String
  toAddress: String
  amount: Number
  currency: 'BTC' | 'ETH' | 'USDT'
  type: 'send' | 'receive' | 'trade'
  status: 'pending' | 'confirmed' | 'failed'
  confirmations: Number
  gasUsed: Number (optional)
  gasFee: Number (optional)
  blockchainNetwork: 'mainnet' | 'testnet'
  verified: Boolean
  metadata: {
    tradePair: String
    tradePrice: Number
    tradeType: 'buy' | 'sell'
  }
  createdAt: Date
  confirmedAt: Date
}
```

## Services

### CryptoService
- `getCryptoPrice(currency)`: Get current price
- `getCryptoData(currency)`: Get detailed market data
- `getChartData(currency, days)`: Get historical prices
- `convertCrypto(amount, from, to)`: Convert between currencies
- `verifyEthTransaction(txHash)`: Verify ETH transaction

### BlockchainService
- `createTransaction(data)`: Record new blockchain transaction
- `executeTrade(request)`: Execute and record a trade
- `getUserTransactions(userId, options)`: Get user's transactions
- `verifyTransaction(txHash)`: Verify transaction on blockchain
- `getTradingStats(userId)`: Get user trading statistics

## Configuration

### Environment Variables

**Backend (.env)**:
```env
# MongoDB for blockchain transaction storage
MONGODB_URI=mongodb://localhost:27017/tcw1

# API URLs
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**:
```env
# API endpoint
VITE_API_URL=http://localhost:3001
```

## Technical Details

### Price Data Source
- **Provider**: CoinGecko API (Free tier)
- **Rate Limiting**: 1-minute cache to stay within limits
- **Fallback**: Mock prices if API unavailable
- **Update Frequency**: Every 60 seconds

### Blockchain Simulation
For demo purposes, transactions are simulated:
- Transaction hashes are generated
- Confirmations are simulated (5-second delay)
- In production, integrate with actual blockchain nodes:
  - Bitcoin: BitcoinJS + blockchain.info API
  - Ethereum: Ethers.js + Infura/Alchemy
  - USDT: ERC20 contract via Ethers.js

### Trading Mechanics
1. User initiates trade with from/to currencies and amount
2. System fetches real-time prices for both currencies
3. Conversion calculated with 0.5% trading fee
4. Transaction created on blockchain
5. Trade recorded in database
6. User receives confirmation with transaction hash

## Security Considerations

- ✅ All trades require authentication (JWT)
- ✅ Transaction verification before confirmation
- ✅ Rate limiting on API endpoints (recommended)
- ✅ Input validation on all trade requests
- ⚠️ Demo mode: Replace simulated transactions with real blockchain integration
- ⚠️ Production: Implement proper wallet management
- ⚠️ Production: Add 2FA for trades above threshold

## Future Enhancements

1. **Real Blockchain Integration**
   - Connect to Bitcoin/Ethereum nodes
   - Real transaction broadcasting
   - Hardware wallet support

2. **Advanced Trading**
   - Limit orders
   - Stop-loss orders
   - Trading charts with indicators

3. **DeFi Integration**
   - Liquidity pool integration
   - Yield farming
   - Staking rewards

4. **Enhanced Analytics**
   - Portfolio tracking
   - Profit/loss calculations
   - Tax reporting

5. **Multi-chain Support**
   - Binance Smart Chain
   - Polygon
   - Solana

## Testing

### Testing the Integration

1. **Start the backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Price Data**:
   - Open app and view the crypto chart
   - Prices should update automatically
   - Check browser console for API calls

4. **Test Trading**:
   - Click on "Buy BTC" or similar option
   - Enter trade amount
   - Execute trade
   - Verify transaction appears in blockchain history

5. **Test Transaction History**:
   - View blockchain transactions
   - Filter by type and status
   - Verify confirmation updates

## Support & Documentation

- CoinGecko API: https://www.coingecko.com/en/api/documentation
- Ethers.js: https://docs.ethers.org/
- BitcoinJS: https://github.com/bitcoinjs/bitcoinjs-lib
- MongoDB: https://www.mongodb.com/docs/

## License

Same as main project license.
