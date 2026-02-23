import express, { Router, Request, Response } from 'express';
import { DepositConfirmationService } from '../services/deposit-confirmation.service';

const router: Router = express.Router();

// Create deposit confirmation
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { userId, depositAmount, currency, toAddress, transactionHash, fromAddress } = req.body;

    if (!userId || !depositAmount || !currency || !toAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await DepositConfirmationService.createDepositConfirmation(
      userId,
      depositAmount,
      currency,
      toAddress,
      transactionHash,
      fromAddress
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update confirmation count
router.put('/confirm/:depositId', async (req: Request, res: Response) => {
  try {
    const { depositId } = req.params;
    const { confirmationCount } = req.body;

    if (confirmationCount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Confirmation count is required'
      });
    }

    const result = await DepositConfirmationService.updateConfirmationCount(depositId, confirmationCount);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mark deposit as failed
router.put('/failed/:depositId', async (req: Request, res: Response) => {
  try {
    const { depositId } = req.params;
    const { failureReason } = req.body;

    if (!failureReason) {
      return res.status(400).json({
        success: false,
        error: 'Failure reason is required'
      });
    }

    const result = await DepositConfirmationService.markDepositFailed(depositId, failureReason);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's deposit status
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    const result = await DepositConfirmationService.getUserDepositStatus(userId, status as string);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get pending deposits (admin)
router.get('/pending', async (req: Request, res: Response) => {
  try {
    const result = await DepositConfirmationService.getPendingDeposits();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
