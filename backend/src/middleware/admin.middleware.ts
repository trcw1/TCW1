import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './auth.middleware';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  isAdmin?: boolean;
}

export const adminMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // First verify the token
    const result = verifyToken(req);
    
    if (!result) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    req.userId = result.userId;

    // Import User model here to avoid circular dependency
    const { User } = require('../models/User');
    const user = await User.findById(result.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.isAdmin = true;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};
