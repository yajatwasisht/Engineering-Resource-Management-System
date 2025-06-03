import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

type UserRole = 'manager' | 'engineer';

export const checkRole = (role: UserRole) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Please authenticate' });
    }
  };
}; 