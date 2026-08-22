import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    businessId?: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'growthpilot_super_secret_jwt_key_change_in_production';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
      businessId?: string;
    };

    // Verify user still exists
    const user = db.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      businessId: user.businessId,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
  }
};

export const generateToken = (user: { id: string; email: string; name: string; businessId?: string }): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      businessId: user.businessId,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
