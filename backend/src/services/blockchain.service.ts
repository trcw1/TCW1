import { BlockchainTransaction, IBlockchainTransaction } from '../models/BlockchainTransaction';
import { cryptoService } from './crypto.service';

interface TradeRequest {
  userId: string;
  fromCurrency: 'BTC' | 'ETH' | 'USDT';
  toCurrency: 'BTC' | 'ETH' | 'USDT';
  amount: number;
  fromAddress: string;
  toAddress: string;
}

interface TradeResult {
  success: boolean;
  transaction?: IBlockchainTransaction;
  message?: string;
  receivedAmount?: number;
}

export class BlockchainService {
  // Create a blockchain transaction record
  async createTransaction(data: {
    userId: string;
    fromAddress: string;
    toAddress: string;
    amount: number;
    currency: 'BTC' | 'ETH' | 'USDT';
    type: 'send' | 'receive' | 'trade';
    metadata?: any;
  }): Promise<IBlockchainTransaction> {
    const txHash = cryptoService.simulateBlockchainTransaction(data.currency, data.amount);

    const transaction = new BlockchainTransaction({
      userId: data.userId,
      transactionHash: txHash,
      fromAddress: data.fromAddress,
      toAddress: data.toAddress,
      amount: data.amount,
      currency: data.currency,
      type: data.type,
      status: 'pending',
      confirmations: 0,
      blockchainNetwork: 'mainnet',
      verified: false,
      metadata: data.metadata
    });

    await transaction.save();

    // Simulate async confirmation
    this.simulateConfirmation(transaction._id.toString());

    return transaction;
  }

  // Execute a trade between cryptocurrencies
  async executeTrade(request: TradeRequest): Promise<TradeResult> {
    try {
      // Get current prices
      const fromPrice = await cryptoService.getCryptoPrice(request.fromCurrency);
      const toPrice = await cryptoService.getCryptoPrice(request.toCurrency);

      // Calculate received amount (0.5% trading fee)
      const tradingFee = 0.005;
      const usdValue = request.amount * fromPrice;
      const receivedAmount = (usdValue / toPrice) * (1 - tradingFee);

      // Create blockchain transaction for the trade
      const transaction = await this.createTransaction({
        userId: request.userId,
        fromAddress: request.fromAddress,
        toAddress: request.toAddress,
        amount: request.amount,
        currency: request.fromCurrency,
        type: 'trade',
        metadata: {
          tradePair: `${request.fromCurrency}/${request.toCurrency}`,
          tradePrice: fromPrice / toPrice,
          tradeType: 'buy',
          receivedAmount,
          receivedCurrency: request.toCurrency,
          fee: request.amount * tradingFee
        }
      });

      return {
        success: true,
        transaction,
        message: 'Trade executed successfully',
        receivedAmount
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Trade execution failed'
      };
    }
  }

  // Get user's blockchain transactions
  async getUserTransactions(
    userId: string,
    options?: {
      limit?: number;
      status?: 'pending' | 'confirmed' | 'failed';
      type?: 'send' | 'receive' | 'trade';
    }
  ): Promise<IBlockchainTransaction[]> {
    const query: any = { userId };

    if (options?.status) {
      query.status = options.status;
    }

    if (options?.type) {
      query.type = options.type;
    }

    return await BlockchainTransaction.find(query)
      .sort({ createdAt: -1 })
      .limit(options?.limit || 50);
  }

  // Get transaction by hash
  async getTransactionByHash(txHash: string): Promise<IBlockchainTransaction | null> {
    return await BlockchainTransaction.findOne({ transactionHash: txHash });
  }

  // Verify a transaction on the blockchain
  async verifyTransaction(txHash: string): Promise<{
    success: boolean;
    transaction?: IBlockchainTransaction;
    message?: string;
  }> {
    try {
      const transaction = await this.getTransactionByHash(txHash);

      if (!transaction) {
        return {
          success: false,
          message: 'Transaction not found'
        };
      }

      // Verify on blockchain (ETH/USDT)
      if (transaction.currency === 'ETH' || transaction.currency === 'USDT') {
        const verification = await cryptoService.verifyEthTransaction(txHash);
        
        transaction.verified = verification.verified;
        transaction.confirmations = verification.confirmations;
        transaction.blockNumber = verification.blockNumber;

        if (verification.confirmations >= 12) {
          transaction.status = 'confirmed';
          transaction.confirmedAt = new Date();
        }

        await transaction.save();
      }

      return {
        success: true,
        transaction,
        message: 'Transaction verified'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Verification failed'
      };
    }
  }

  // Get trading statistics for a user
  async getTradingStats(userId: string): Promise<{
    totalTrades: number;
    totalVolume: number;
    profitLoss: number;
    mostTradedPair: string;
  }> {
    const trades = await BlockchainTransaction.find({
      userId,
      type: 'trade',
      status: { $in: ['confirmed', 'pending'] }
    });

    const totalTrades = trades.length;
    let totalVolume = 0;
    const pairCounts: Record<string, number> = {};

    for (const trade of trades) {
      const price = await cryptoService.getCryptoPrice(trade.currency);
      totalVolume += trade.amount * price;

      if (trade.metadata?.tradePair) {
        pairCounts[trade.metadata.tradePair] = (pairCounts[trade.metadata.tradePair] || 0) + 1;
      }
    }

    const mostTradedPair = Object.entries(pairCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      totalTrades,
      totalVolume,
      profitLoss: 0, // Would need historical balance tracking
      mostTradedPair
    };
  }

  // Simulate transaction confirmation (for demo)
  private async simulateConfirmation(transactionId: string): Promise<void> {
    setTimeout(async () => {
      try {
        const transaction = await BlockchainTransaction.findById(transactionId);
        if (transaction && transaction.status === 'pending') {
          transaction.confirmations = 12;
          transaction.blockNumber = Math.floor(Math.random() * 1000000) + 15000000;
          transaction.status = 'confirmed';
          transaction.verified = true;
          transaction.confirmedAt = new Date();
          await transaction.save();
        }
      } catch (error) {
        console.error('Error simulating confirmation:', error);
      }
    }, 5000); // Confirm after 5 seconds for demo
  }

  // Get recent blockchain transactions (public feed)
  async getRecentTransactions(limit: number = 20): Promise<IBlockchainTransaction[]> {
    return await BlockchainTransaction.find({ verified: true })
      .sort({ confirmedAt: -1 })
      .limit(limit)
      .select('-userId'); // Don't expose user IDs publicly
  }
}

export const blockchainService = new BlockchainService();
