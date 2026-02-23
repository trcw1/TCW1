import express, { Router, Request, Response } from 'express';
import { MembershipService } from '../services/membership.service';

const router: Router = express.Router();

// Create membership
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, tier, paymentMethod, monthlyFee } = req.body;

    if (!userId || !tier || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await MembershipService.createMembership(userId, tier, paymentMethod, monthlyFee);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user membership
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await MembershipService.getUserMembership(userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Upgrade membership
router.put('/:userId/upgrade', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { tier } = req.body;

    if (!tier) {
      return res.status(400).json({
        success: false,
        error: 'Tier is required'
      });
    }

    const result = await MembershipService.upgradeMembership(userId, tier);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cancel membership
router.put('/:userId/cancel', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await MembershipService.cancelMembership(userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Process auto-renewal
router.post('/process-renewal', async (req: Request, res: Response) => {
  try {
    const result = await MembershipService.processAutoRenewal();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
