import express, { Router, Request, Response } from 'express';
import { WalletRequestService } from '../services/wallet-request.service';

const router: Router = express.Router();

// Create wallet request
router.post('/request', async (req: Request, res: Response) => {
  try {
    const { userId, walletType, reference, proofFile } = req.body;

    if (!userId || !walletType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await WalletRequestService.createWalletRequest(userId, walletType, reference, proofFile);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Approve wallet request
router.post('/approve/:requestId', async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { walletAddress, approvalNotes } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }

    const result = await WalletRequestService.approveWalletRequest(requestId, walletAddress, approvalNotes);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Reject wallet request
router.post('/reject/:requestId', async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }

    const result = await WalletRequestService.rejectWalletRequest(requestId, rejectionReason);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's wallet requests
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await WalletRequestService.getUserWalletRequests(userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all pending wallet requests (admin)
router.get('/pending', async (req: Request, res: Response) => {
  try {
    const result = await WalletRequestService.getPendingWalletRequests();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
