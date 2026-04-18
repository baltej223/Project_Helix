import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import config from '../config/index.js';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  if (config.isDevelopment) {
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      stack: err.stack,
    });
    return;
  }

  if (err instanceof AppError && err.isOperational) {
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal Server Error',
  });
};