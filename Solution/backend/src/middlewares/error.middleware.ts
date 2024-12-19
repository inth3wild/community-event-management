import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

// Custom error class
class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error handling middleware
const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  // Handle Zod errors
  if (err instanceof ZodError) {
    console.error(err.message);

    res.status(400).json({
      status: 'error',
      message: 'Zod validation error',
      data: err,
    });
    return;
  }

  // Handle Prisma client errors
  if (err instanceof PrismaClientKnownRequestError) {
    console.error(err.message);

    res.status(500).json({
      status: 'error',
      message: 'Database error',
      data: null,
    });
    return;
  }

  console.error(err.message);
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message || 'An unexpected error occurred',
  });
};

export { AppError, errorHandler };
