/**
 * Route Wrapper Utilities
 * Convenience functions for wrapping API routes with common middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandlingAndLogging } from '../middleware/error-handler';
import { LoggedRequest } from '../middleware/logging';

type RouteHandler<T extends NextRequest = NextRequest> = (req: T) => Promise<NextResponse>;

/**
 * Wrap route with error handling and logging
 */
export function wrapRoute<T extends NextRequest = NextRequest>(
  handler: RouteHandler<LoggedRequest & T>
): RouteHandler<T> {
  return withErrorHandlingAndLogging(handler);
}

/**
 * Wrap route with error handling, logging, and authentication
 */
export function wrapProtectedRoute<T extends NextRequest = NextRequest>(
  handler: RouteHandler<LoggedRequest & T & { user: any }>
): RouteHandler<T> {
  return wrapRoute(async (request) => {
    const { requireAuth } = await import('../middleware');
    const authResult = await requireAuth(request);
    
    if (authResult.error) {
      const response = NextResponse.json(
        { error: authResult.error.message },
        { status: authResult.error.status }
      );
      return response;
    }

    return handler(authResult.request as LoggedRequest & T & { user: any });
  });
}

/**
 * Wrap route with error handling, logging, authentication, and rate limiting
 */
export function wrapProtectedRouteWithRateLimit<T extends NextRequest = NextRequest>(
  handler: RouteHandler<LoggedRequest & T & { user: any }>
): RouteHandler<T> {
  return wrapProtectedRoute(async (request) => {
    const { requireRateLimit } = await import('../middleware');
    const rateLimitResult = await requireRateLimit(request, request.user?.id);
    
    if (rateLimitResult.error) {
      const response = NextResponse.json(
        { error: rateLimitResult.error.message },
        {
          status: rateLimitResult.error.status,
          headers: rateLimitResult.error.headers,
        }
      );
      return response;
    }

    return handler(request);
  });
}

