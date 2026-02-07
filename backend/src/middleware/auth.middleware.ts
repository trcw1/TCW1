import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = authService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};
