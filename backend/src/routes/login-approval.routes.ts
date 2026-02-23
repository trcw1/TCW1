import express, { Router, Request, Response } from 'express';
import { LoginApprovalService } from '../services/login-approval.service';

const router: Router = express.Router();

// Create login approval request
router.post('/request', async (req: Request, res: Response) => {
  try {
    const { userId, ipAddress, userAgent, deviceName } = req.body;

    if (!userId || !ipAddress || !userAgent) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await LoginApprovalService.createLoginApproval(userId, ipAddress, userAgent, deviceName);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Approve login
router.post('/approve/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const result = await LoginApprovalService.approveLogin(token);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Reject login
router.post('/reject/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }

    const result = await LoginApprovalService.rejectLogin(token, rejectionReason);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get pending approvals for user
router.get('/pending/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await LoginApprovalService.getPendingApprovals(userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
