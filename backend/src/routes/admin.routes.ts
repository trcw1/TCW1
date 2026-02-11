import { Router, Response, Request } from 'express';
import { adminMiddleware, AuthenticatedRequest } from '../middleware/admin.middleware';
import { adminService } from '../services/admin.service';

const router = Router();

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Get dashboard stats
router.get('/stats', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await adminService.getStats();
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users
router.get('/users', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single user
router.get('/users/:userId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await adminService.getUser(userId);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Make user admin
router.patch('/users/:userId/make-admin', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await adminService.makeUserAdmin(userId);
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user details
router.patch('/users/:userId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await adminService.updateUserDetails(userId, req.body);
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user
router.delete('/users/:userId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Prevent admin from deleting themselves
    if (userId === req.userId) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const result = await adminService.deleteUser(userId);
    res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all transactions
router.get('/transactions', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const transactions = await adminService.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
