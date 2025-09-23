import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';
import { verifyAccessToken } from '../lib/jwt';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Access denied. Invalid token format.'
      });
      return;
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      res.status(401).json({
        status: 'error',
        message: 'Access denied. Invalid token.'
      });
      return;
    }
    
    const user = await User.findById(decoded.userId).select('+password');
    
    if (!user || !user.isActive) {
      res.status(401).json({
        status: 'error',
        message: 'Access denied. User not found or inactive.'
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error during authentication.',
      error: process.env.NODE_ENV !== 'production' ? String(error) : undefined
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Access denied. User not authenticated.'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: 'error',
        message: 'Access denied. Insufficient permissions.'
      });
      return;
    }

    next();
  };
};