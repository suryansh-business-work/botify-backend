import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response-object';

interface AuthRequest extends Request {
  userId?: string;
  organizationId?: string;
}

export const authenticateJWT = (req: AuthRequest, res: any, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Authorization header missing or malformed' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'SECRET_KEY') as { userId: string, organizationId: string };
    req.userId = decoded.userId;
    req.organizationId = decoded.organizationId;
    if (!decoded.userId) {
      return errorResponse(res, null, 'User ID not found in token');
    }
    if (!decoded.organizationId) {
      return errorResponse(res, null, 'Organization ID not found in token');
    }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
