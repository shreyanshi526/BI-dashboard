import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.dto';
import { AppMessages } from '../utils/app.messages';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message: string = AppMessages.INTERNAL_SERVER_ERROR;
  let isOperational = false;

  // Handle AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err instanceof Error) {
    // Handle standard Error instances
    message = err.message || AppMessages.ERROR;
  }

  // Log error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      message: err.message,
      stack: err.stack,
      statusCode,
      isOperational,
      path: req.path,
      method: req.method,
    });
  } else {
    // Log minimal info in production
    console.error('Error:', {
      message: err.message,
      statusCode,
      path: req.path,
      method: req.method,
    });
  }

  // Send error response
  const response = errorResponse(message, statusCode, {
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  const response = errorResponse(
    `${AppMessages.NOT_FOUND}: ${req.method} ${req.path}`,
    404
  );
  res.status(404).json(response);
};

/**
 * Async error wrapper - wraps async route handlers to catch errors
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validation error handler
 */
export class ValidationError extends AppError {
  constructor(message: string, public errors?: any[]) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

/**
 * Not Found error handler
 */
export class NotFoundError extends AppError {
  constructor(message: string = AppMessages.NOT_FOUND) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Unauthorized error handler
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = AppMessages.UNAUTHORIZED) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Forbidden error handler
 */
export class ForbiddenError extends AppError {
  constructor(message: string = AppMessages.FORBIDDEN) {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

