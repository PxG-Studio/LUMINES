/**
 * Error Handling Middleware
 * Catches and handles errors in API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackApiError } from '@/lib/monitoring/error-tracking';
import { logger } from '@/lib/monitoring/logger';
import { LoggedRequest } from './logging';

export interface ErrorHandlerOptions {
  trackErrors?: boolean;
  logErrors?: boolean;
  exposeDetails?: boolean;
}

const defaultOptions: ErrorHandlerOptions = {
  trackErrors: true,
  logErrors: true,
  exposeDetails: process.env.NODE_ENV === 'development',
};

/**
 * Error handler wrapper for API routes
 */
export function withErrorHandler<T extends NextRequest = NextRequest>(
  handler: (req: T) => Promise<NextResponse>,
  options: ErrorHandlerOptions = {}
): (req: T) => Promise<NextResponse> {
  const opts = { ...defaultOptions, ...options };

  return async (request: T) => {
    try {
      return await handler(request);
    } catch (error) {
      // Extract request information
      const url = new URL(request.url);
      const requestId = (request as LoggedRequest).requestId;
      const userId = (request as any).user?.id;

      // Determine error severity
      const statusCode = (error as any)?.statusCode || (error as any)?.status || 500;
      const severity = statusCode >= 500 ? 'critical' : statusCode >= 400 ? 'high' : 'medium';

      // Log error
      if (opts.logErrors) {
        logger.error('API route error', error as Error, {
          requestId,
          userId,
          path: url.pathname,
          method: request.method,
        });
      }

      // Track error
      if (opts.trackErrors) {
        trackApiError(
          error,
          {
            method: request.method,
            path: url.pathname,
            requestId,
            userId,
          },
          severity
        );
      }

      // Prepare error response
      const isDevelopment = process.env.NODE_ENV === 'development';
      const errorResponse: any = {
        error: 'Internal server error',
        ...(opts.exposeDetails && {
          message: error instanceof Error ? error.message : String(error),
          ...(isDevelopment && {
            stack: error instanceof Error ? error.stack : undefined,
          }),
        }),
        ...(requestId && { requestId }),
      };

      // Include status code if available
      const finalStatusCode = statusCode >= 400 && statusCode < 600 ? statusCode : 500;

      return NextResponse.json(errorResponse, { status: finalStatusCode });
    }
  };
}

/**
 * Combine error handler with logging
 */
export function withErrorHandlingAndLogging<T extends NextRequest = NextRequest>(
  handler: (req: LoggedRequest & T) => Promise<NextResponse>,
  options: ErrorHandlerOptions = {}
): (req: T) => Promise<NextResponse> {
  const errorHandler = withErrorHandler(handler, options);
  
  // Import here to avoid circular dependency
  const { logRequest } = require('./logging');
  
  return (request: T) => {
    return logRequest(request, errorHandler);
  };
}

