/**
 * Rate Limiting Middleware
 * Redis-based rate limiting
 */

import { NextRequest } from 'next/server';
import { cache } from '@/lib/cache/client';
import { env } from '@/lib/config/environment';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number; // Unix timestamp when limit resets
  limit: number;
}

/**
 * Get rate limit for user tier
 */
function getRateLimit(roles: string[]): number {
  if (roles.includes('Enterprise')) {
    return env.RATE_LIMIT_ENTERPRISE;
  }
  if (roles.includes('Pro')) {
    return env.RATE_LIMIT_PRO;
  }
  return env.RATE_LIMIT_FREE;
}

/**
 * Rate limit check
 * Returns whether request is allowed and remaining quota
 */
export async function checkRateLimit(
  identifier: string, // User ID, IP address, or other identifier
  windowSeconds: number = 3600, // 1 hour default
  customLimit?: number
): Promise<RateLimitResult> {
  const key = `rate-limit:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSeconds);

  try {
    // Get current count
    const current = await cache.get(key);
    const count = current ? parseInt(current, 10) : 0;

    // Determine limit (use custom limit or default based on roles - would need user context)
    // For now, using default from env
    const limit = customLimit || env.RATE_LIMIT_FREE;

    // Check if limit exceeded
    if (count >= limit) {
      const reset = windowStart + windowSeconds;
      return {
        allowed: false,
        remaining: 0,
        reset,
        limit,
      };
    }

    // Increment counter
    const newCount = count + 1;
    await cache.set(key, newCount.toString(), windowSeconds);

    const reset = windowStart + windowSeconds;
    return {
      allowed: true,
      remaining: limit - newCount,
      reset,
      limit,
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // On error, allow request (fail open)
    return {
      allowed: true,
      remaining: 1000,
      reset: now + windowSeconds,
      limit: 1000,
    };
  }
}

/**
 * Rate limit middleware
 * Returns 429 if rate limit exceeded
 */
export async function rateLimit(
  request: NextRequest,
  identifier?: string
): Promise<{
  result?: RateLimitResult;
  error?: { status: number; message: string; headers?: Record<string, string> };
}> {
  // Get identifier from request
  const id = identifier || 
    request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.headers.get('x-real-ip') ||
    'anonymous';

  const rateLimitResult = await checkRateLimit(id);

  if (!rateLimitResult.allowed) {
    return {
      error: {
        status: 429,
        message: 'Rate limit exceeded',
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          'Retry-After': Math.ceil(rateLimitResult.reset - Math.floor(Date.now() / 1000)).toString(),
        },
      },
    };
  }

  return { result: rateLimitResult };
}

