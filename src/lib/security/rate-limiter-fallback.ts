/**
 * Rate Limiter Fallback
 * 
 * Provides fallback rate limiting when Redis is not available
 * This is a bridge to avoid build errors from missing Redis imports
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
}

interface RateLimitResult {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * In-memory rate limiter (fallback when Redis unavailable)
 */
class InMemoryRateLimiter {
  private memoryStore: Map<string, { count: number; reset: number; requests: Array<{ timestamp: number; success: boolean }> }> = new Map();

  async check(req: NextRequest, config: RateLimitConfig): Promise<RateLimitResult & { allowed: boolean }> {
    const key = config.keyGenerator ? config.keyGenerator(req) : this.getDefaultKey(req);
    const windowSeconds = Math.floor(config.windowMs / 1000);
    const now = Math.floor(Date.now() / 1000);
    const reset = now + windowSeconds;

    const stored = this.memoryStore.get(key);
    const windowStart = now - windowSeconds;

    if (!stored || stored.reset < now) {
      // New window
      this.memoryStore.set(key, {
        count: 1,
        reset,
        requests: [{ timestamp: now, success: true }],
      });
      return {
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset,
        allowed: true,
      };
    }

    // Filter requests within window
    let requests = stored.requests.filter(r => r.timestamp > windowStart);

    // Filter by success/failure if configured
    if (config.skipSuccessfulRequests) {
      requests = requests.filter(r => !r.success);
    }
    if (config.skipFailedRequests) {
      requests = requests.filter(r => r.success);
    }

    const newCount = requests.length + 1;
    stored.requests.push({ timestamp: now, success: true });
    stored.count = newCount;
    stored.reset = stored.reset; // Keep existing reset time

    // Cleanup old requests
    stored.requests = stored.requests.filter(r => r.timestamp > windowStart);
    this.memoryStore.set(key, stored);

    const allowed = newCount <= config.maxRequests;

    return {
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - newCount),
      reset: stored.reset,
      allowed,
      retryAfter: allowed ? undefined : stored.reset - now,
    };
  }

  private getDefaultKey(req: NextRequest): string {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
               req.headers.get('x-real-ip') ||
               req.ip ||
               'unknown';
    return `rate-limit:${ip}`;
  }
}

const fallbackLimiter = new InMemoryRateLimiter();

/**
 * Rate limiter with Redis fallback
 */
export class RateLimiter {
  private config: RateLimitConfig;
  private useRedis: boolean = false;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
      message: 'Too many requests, please try again later.',
      ...config,
    };
    
    // Try to use Redis, but fallback to memory if not available
    this.initRedis();
  }

  private async initRedis() {
    // Check if Redis is available, but don't fail if it's not
    try {
      // Only use Redis if explicitly configured
      if (process.env.REDIS_URL) {
        // Try dynamic import to avoid build-time errors
        const redisModule = await import('../cache/client').catch(() => null);
        if (redisModule?.getRedisClient) {
          this.useRedis = true;
        }
      }
    } catch {
      // Redis not available, use in-memory fallback
      this.useRedis = false;
    }
  }

  async check(req: NextRequest): Promise<RateLimitResult & { allowed: boolean }> {
    // Always use fallback for now to avoid build errors
    // In production, can switch to Redis if available
    return fallbackLimiter.check(req, this.config);
  }

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

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.reset.toString());

    return null;
  }
}

/**
 * Pre-configured rate limiters
 */
export const rateLimiters = {
  strict: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 10,
  }),
  standard: new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
  }),
  relaxed: new RateLimiter({
    windowMs: 60 * 60 * 1000,
    maxRequests: 1000,
  }),
  api: new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 1000,
    keyGenerator: (req) => {
      const apiKey = req.headers.get('x-api-key') || 'anonymous';
      return `rate-limit:api:${apiKey}`;
    },
  }),
};

