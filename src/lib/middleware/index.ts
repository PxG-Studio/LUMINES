/**
 * Middleware Utilities
 * Centralized middleware management
 */

import { NextRequest, NextResponse } from 'next/server';
import { logRequest, LoggedRequest } from './logging';
import { authenticate, AuthenticatedRequest } from './auth';
import { rateLimit } from './rate-limit';

export interface MiddlewareResult<TRequest = NextRequest> {
  request: TRequest;
  error?: {
    message: string;
    status: number;
    headers?: Record<string, string>;
  };
}

/**
 * Apply multiple middleware functions to a request
 */
export async function applyMiddleware<TRequest extends NextRequest = NextRequest>(
  request: TRequest,
  context: Record<string, any> = {},
  handler: (req: TRequest) => Promise<NextResponse>,
  middlewares: Array<
    (req: TRequest, ctx: typeof context) => Promise<MiddlewareResult<TRequest> | NextResponse>
  > = []
): Promise<NextResponse> {
  let currentRequest = request;
  let currentContext = context;

  // Apply middlewares in sequence
  for (const middleware of middlewares) {
    const result = await middleware(currentRequest, currentContext);

    // If middleware returns a response, return it immediately (error case)
    if (result instanceof NextResponse) {
      return result;
    }

    // Check for errors
    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        {
          status: result.error.status,
          headers: result.error.headers,
        }
      );
    }

    // Update request and context
    currentRequest = result.request;
    if ('context' in result && result.context) {
      currentContext = { ...currentContext, ...result.context };
    }
  }

  // Execute handler
  return handler(currentRequest);
}

/**
 * Require authentication middleware
 */
export async function requireAuth(request: NextRequest): Promise<MiddlewareResult<AuthenticatedRequest>> {
  const authResult = await authenticate(request);
  
  if (authResult.error) {
    return {
      request: request as AuthenticatedRequest,
      error: {
        message: authResult.error.message,
        status: authResult.error.status,
      },
    };
  }

  return {
    request: authResult.request,
  };
}

/**
 * Apply rate limiting middleware
 */
export async function requireRateLimit(
  request: NextRequest,
  userId?: string
): Promise<MiddlewareResult<NextRequest>> {
  const rateLimitResult = await rateLimit(request, userId);
  
  if (rateLimitResult.error) {
    return {
      request,
      error: {
        message: rateLimitResult.error.message,
        status: rateLimitResult.error.status,
        headers: rateLimitResult.error.headers,
      },
    };
  }

  return { request };
}

/**
 * Require specific role middleware
 */
export function requireRole(
  request: AuthenticatedRequest,
  allowedRoles: string[]
): MiddlewareResult<AuthenticatedRequest> {
  if (!request.user) {
    return {
      request,
      error: {
        message: 'Authentication required',
        status: 401,
      },
    };
  }

  const userRoles = request.user.roles || [];
  const hasRole = allowedRoles.some(role => userRoles.includes(role));

  if (!hasRole) {
    return {
      request,
      error: {
        message: `Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`,
        status: 403,
      },
    };
  }

  return { request };
}

/**
 * Apply logging middleware wrapper
 * Use this to automatically log all requests and responses
 */
export function withLogging<T extends NextRequest>(
  handler: (req: LoggedRequest & T) => Promise<NextResponse>
): (req: T) => Promise<NextResponse> {
  return async (request: T) => {
    return logRequest(request, handler);
  };
}
