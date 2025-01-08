import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '@/config/app.config';
import prisma from '@/config/database.config';
import { AppError } from '@/middlewares/error.middleware';
import { RequestWithUser } from '@/types/index';

export const authenticateToken = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = jwt.verify(token, environment.JWT_SECRET as string) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};

export const requireAdmin = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    throw new AppError('Unauthorized - Admin access required', 403);
  }
  next();
};
