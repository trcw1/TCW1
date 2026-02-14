import express, { Router, Request, Response } from 'express';
import { blockchainService } from '../services/blockchain.service';
import { cryptoService } from '../services/crypto.service';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Get crypto prices
router.get('/prices', async (req: Request, res: Response) => {
  try {
    const [btcData, ethData, usdtData] = await Promise.all([
      cryptoService.getCryptoData('BTC'),
      cryptoService.getCryptoData('ETH'),
      cryptoService.getCryptoData('USDT')
    ]);

    res.json({
      success: true,
      data: {
        BTC: btcData,
        ETH: ethData,
        USDT: usdtData
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch prices'
    });
  }
});

// Get chart data for a specific crypto
router.get('/chart/:currency', async (req: Request, res: Response) => {
  try {
    const currency = req.params.currency.toUpperCase() as 'BTC' | 'ETH' | 'USDT';
    const days = parseInt(req.query.days as string) || 7;

    if (!['BTC', 'ETH', 'USDT'].includes(currency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid currency'
      });
    }

    const chartData = await cryptoService.getChartData(currency, days);

    res.json({
      success: true,
      currency,
      days,
      data: chartData
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch chart data'
    });
  }
});

// Execute a trade
router.post('/trade', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { fromCurrency, toCurrency, amount, fromAddress, toAddress } = req.body;

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (!fromCurrency || !toCurrency || !amount || !fromAddress || !toAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const result = await blockchainService.executeTrade({
      userId: req.userId,
      fromCurrency,
      toCurrency,
      amount: parseFloat(amount),
      fromAddress,
      toAddress
    });

    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Trade execution failed'
    });
  }
});

// Get user's blockchain transactions
router.get('/transactions', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const status = req.query.status as 'pending' | 'confirmed' | 'failed' | undefined;
    const type = req.query.type as 'send' | 'receive' | 'trade' | undefined;

    const transactions = await blockchainService.getUserTransactions(req.userId, {
      limit,
      status,
      type
    });

    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch transactions'
    });
  }
});

// Get transaction by hash
router.get('/transaction/:hash', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { hash } = req.params;
    const transaction = await blockchainService.getTransactionByHash(hash);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      transaction
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch transaction'
    });
  }
});

// Verify transaction
router.post('/verify/:hash', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { hash } = req.params;
    const result = await blockchainService.verifyTransaction(hash);

    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Verification failed'
    });
  }
});

// Get trading statistics
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const stats = await blockchainService.getTradingStats(req.userId);

    res.json({
      success: true,
      stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch stats'
    });
  }
});

// Get recent public transactions
router.get('/recent', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const transactions = await blockchainService.getRecentTransactions(limit);

    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch recent transactions'
    });
  }
});

export default router;
