/**
 * Rate Limiting Middleware
 * Production-ready rate limiting with in-memory fallback
 * 
 * NOTE: This implementation uses in-memory storage to avoid Redis dependency.
 * For distributed rate limiting with Redis, see rate-limiter-redis.ts
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Skip counting successful requests
  skipFailedRequests?: boolean; // Skip counting failed requests
  message?: string; // Error message
}

interface RateLimitResult {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
  retryAfter?: number; // Seconds until retry
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests, please try again later.',
};

/**
 * Rate limiter class (in-memory implementation)
 */
export class RateLimiter {
  private memoryStore: Map<string, { count: number; reset: number; requests: Array<{ timestamp: number; success: boolean }> }> = new Map();
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Generate rate limit key
   */
  private getKey(req: NextRequest): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req);
    }

    // Default: IP address
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
               req.headers.get('x-real-ip') ||
               req.ip ||
               'unknown';

    return `rate-limit:${ip}`;
  }

  /**
   * Check rate limit (in-memory implementation)
   */
  async check(req: NextRequest): Promise<RateLimitResult & { allowed: boolean }> {
    const key = this.getKey(req);
    const windowSeconds = Math.floor(this.config.windowMs / 1000);
    const now = Math.floor(Date.now() / 1000);
    const reset = now + windowSeconds;

    return this.checkMemory(key, windowSeconds, reset);
  }

  private checkMemory(
    key: string,
    windowSeconds: number,
    reset: number
  ): RateLimitResult & { allowed: boolean } {
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - windowSeconds;
    const stored = this.memoryStore.get(key);

    if (!stored || stored.reset < now) {
      // New window
      this.memoryStore.set(key, {
        count: 1,
        reset,
        requests: [{ timestamp: now, success: true }],
      });
      return {
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        reset,
        allowed: true,
      };
    }

    // Filter requests within window
    let requests = stored.requests.filter((r: { timestamp: number; success: boolean }) => r.timestamp > windowStart);

    // Filter by success/failure if configured
    if (this.config.skipSuccessfulRequests) {
      requests = requests.filter((r: { timestamp: number; success: boolean }) => !r.success);
    }
    if (this.config.skipFailedRequests) {
      requests = requests.filter((r: { timestamp: number; success: boolean }) => r.success);
    }

    // Existing window
    const newCount = requests.length + 1;
    stored.requests.push({ timestamp: now, success: true });
    stored.count = newCount;
    stored.requests = stored.requests.filter((r: { timestamp: number; success: boolean }) => r.timestamp > windowStart);
    this.memoryStore.set(key, stored);
    const allowed = newCount <= this.config.maxRequests;

    return {
      limit: this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - newCount),
      reset: stored.reset,
      allowed,
      retryAfter: allowed ? undefined : stored.reset - now,
    };
  }

  /**
   * Rate limit middleware
   */
  async middleware(req: NextRequest): Promise<NextResponse | null> {
    const result = await this.check(req);

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: this.config.message,
          retryAfter: result.retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': result.retryAfter?.toString() || '0',
          },
        }
      );
    }

    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.reset.toString());

    return null; // Continue to next middleware
  }
}

/**
 * Pre-configured rate limiters
 */
export const rateLimiters = {
  // Strict rate limiter (10 requests per minute)
  strict: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 10,
  }),

  // Standard rate limiter (100 requests per 15 minutes)
  standard: new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
  }),

  // Relaxed rate limiter (1000 requests per hour)
  relaxed: new RateLimiter({
    windowMs: 60 * 60 * 1000,
    maxRequests: 1000,
  }),

  // API rate limiter (per API key)
  api: new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 1000,
    keyGenerator: (req) => {
      const apiKey = req.headers.get('x-api-key') || 'anonymous';
      return `rate-limit:api:${apiKey}`;
    },
  }),
};
