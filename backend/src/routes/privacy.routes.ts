import express, { Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { User } from '../models/User';

const router = express.Router();

// Get privacy settings
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({
    success: true,
    showOnlineStatus: user.showOnlineStatus,
    showProfilePicture: user.showProfilePicture
  });
});

// Update privacy settings
router.post('/update', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { showOnlineStatus, showProfilePicture } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  if (typeof showOnlineStatus === 'boolean') user.showOnlineStatus = showOnlineStatus;
  if (typeof showProfilePicture === 'boolean') user.showProfilePicture = showProfilePicture;
  await user.save();
  res.json({ success: true, showOnlineStatus: user.showOnlineStatus, showProfilePicture: user.showProfilePicture });
});

export default router;
