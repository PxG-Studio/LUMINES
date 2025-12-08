/**
 * Per-User Rate Limiting for SPARK
 * 
 * Provides rate limiting based on user ID, not just IP address
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRateLimiter, DEFAULT_RATE_LIMITS } from './limiter';
import { getCurrentUserId } from '../auth/user-context';
import { validateAPIKey } from '../auth/api-key-auth';

export interface UserRateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Per-user rate limit configuration
 */
export const USER_RATE_LIMITS = {
  generation: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // 20 generations per minute per user
    skipFailedRequests: true,
  },
  export: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50, // 50 exports per minute per user
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 API calls per minute per user
  },
} as const;

/**
 * Check rate limit for a specific user
 */
export async function checkUserRateLimit(
  request: NextRequest,
  endpoint: keyof typeof USER_RATE_LIMITS
): Promise<UserRateLimitResult> {
  // Get user ID from API key or default
  let userId: string;
  try {
    const authResult = await validateAPIKey(request);
    userId = authResult.authenticated && authResult.userId 
      ? authResult.userId 
      : getCurrentUserId();
  } catch {
    userId = getCurrentUserId();
  }

  // Use IP as fallback if user ID is not available
  const identifier = userId !== '00000000-0000-0000-0000-000000000000' 
    ? `user:${userId}` 
    : `ip:${request.headers.get('x-forwarded-for') || request.ip || 'unknown'}`;

  const config = USER_RATE_LIMITS[endpoint];
  const limiter = getRateLimiter();

  const result = limiter.checkLimit(identifier, {
    windowMs: config.windowMs,
    maxRequests: config.maxRequests,
    skipSuccessfulRequests: false,
    skipFailedRequests: config.skipFailedRequests || false,
  });

  return {
    allowed: result.allowed,
    remaining: result.remaining,
    resetTime: result.resetTime,
    retryAfter: result.retryAfter,
  };
}

/**
 * Middleware for per-user rate limiting
 */
export async function userRateLimitMiddleware(
  request: NextRequest,
  endpoint: keyof typeof USER_RATE_LIMITS
): Promise<NextResponse | null> {
  const result = await checkUserRateLimit(request, endpoint);

  if (!result.allowed) {
    const response = NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: `Too many requests. Limit: ${USER_RATE_LIMITS[endpoint].maxRequests} per ${USER_RATE_LIMITS[endpoint].windowMs / 1000}s`,
        retryAfter: result.retryAfter,
        resetTime: new Date(result.resetTime).toISOString(),
      },
      { status: 429 }
    );

    response.headers.set('X-RateLimit-Limit', USER_RATE_LIMITS[endpoint].maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', '0');
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
    if (result.retryAfter) {
      response.headers.set('Retry-After', result.retryAfter.toString());
    }

    return response;
  }

  // Add rate limit headers to successful responses
  return null; // Continue to next middleware
}

/**
 * Record a successful request for rate limiting
 */
export async function recordUserRequest(
  request: NextRequest,
  endpoint: keyof typeof USER_RATE_LIMITS,
  success: boolean = true
): Promise<void> {
  let userId: string;
  try {
    const authResult = await validateAPIKey(request);
    userId = authResult.authenticated && authResult.userId 
      ? authResult.userId 
      : getCurrentUserId();
  } catch {
    userId = getCurrentUserId();
  }

  const identifier = userId !== '00000000-0000-0000-0000-000000000000' 
    ? `user:${userId}` 
    : `ip:${request.headers.get('x-forwarded-for') || request.ip || 'unknown'}`;

  const limiter = getRateLimiter();
  limiter.recordRequest(identifier, success);
}

