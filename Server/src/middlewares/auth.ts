import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

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

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({
        status: 'error',
        message: 'Server configuration error.'
      });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
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
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        status: 'error',
        message: 'Access denied. Invalid token.'
      });
      return;
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error during authentication.'
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