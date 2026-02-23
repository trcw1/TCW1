import express, { Router, Request, Response } from 'express';
import { UserWalletService } from '../services/user-wallet.service';

const router: Router = express.Router();

// Assign wallet to user
router.post('/assign', async (req: Request, res: Response) => {
  try {
    const { userId, walletAddress, walletType, publicKey } = req.body;

    if (!userId || !walletAddress || !walletType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await UserWalletService.assignWallet(userId, walletAddress, walletType, publicKey);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's wallets
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await UserWalletService.getUserWallets(userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific wallet
router.get('/user/:userId/:walletType', async (req: Request, res: Response) => {
  try {
    const { userId, walletType } = req.params;
    const result = await UserWalletService.getWallet(userId, walletType as any);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update wallet balance
router.put('/balance/:userId/:walletType', async (req: Request, res: Response) => {
  try {
    const { userId, walletType } = req.params;
    const { amount } = req.body;

    if (amount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Amount is required'
      });
    }

    const result = await UserWalletService.updateBalance(userId, walletType, amount);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Deactivate wallet
router.put('/deactivate/:userId/:walletType', async (req: Request, res: Response) => {
  try {
    const { userId, walletType } = req.params;
    const result = await UserWalletService.deactivateWallet(userId, walletType);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
