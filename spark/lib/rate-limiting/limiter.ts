/**
 * Rate Limiting System
 * 
 * Implements rate limiting for API endpoints and user actions
 */

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

class RateLimiter {
  private limits: Map<string, Array<{ timestamp: number; success: boolean }>> = new Map();

  /**
   * Check if request is allowed
   */
  checkLimit(
    key: string,
    config: RateLimitConfig
  ): RateLimitResult {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get or create limit record
    let requests = this.limits.get(key) || [];

    // Filter requests within window
    requests = requests.filter((r) => r.timestamp > windowStart);

    // Filter by success/failure if configured
    if (config.skipSuccessfulRequests) {
      requests = requests.filter((r) => !r.success);
    }
    if (config.skipFailedRequests) {
      requests = requests.filter((r) => r.success);
    }

    const remaining = Math.max(0, config.maxRequests - requests.length);
    const allowed = remaining > 0;
    const resetTime = now + config.windowMs;
    const retryAfter = allowed ? undefined : Math.ceil((requests[0]?.timestamp || now) + config.windowMs - now) / 1000;

    return {
      allowed,
      remaining,
      resetTime,
      retryAfter,
    };
  }

  /**
   * Record a request
   */
  recordRequest(key: string, success: boolean = true): void {
    const requests = this.limits.get(key) || [];
    requests.push({
      timestamp: Date.now(),
      success,
    });

    // Keep only last 1000 requests per key
    if (requests.length > 1000) {
      requests.shift();
    }

    this.limits.set(key, requests);
  }

  /**
   * Clear limits for a key
   */
  clearLimit(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Clear all limits
   */
  clearAll(): void {
    this.limits.clear();
  }

  /**
   * Get current limit status
   */
  getStatus(key: string, config: RateLimitConfig): RateLimitResult {
    return this.checkLimit(key, config);
  }
}

// Singleton instance
let limiterInstance: RateLimiter | null = null;

/**
 * Get the global rate limiter instance
 */
export function getRateLimiter(): RateLimiter {
  if (!limiterInstance) {
    limiterInstance = new RateLimiter();
  }
  return limiterInstance;
}

/**
 * Default rate limit configurations
 */
export const DEFAULT_RATE_LIMITS = {
  generation: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    skipFailedRequests: true,
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    skipSuccessfulRequests: true,
  },
} as const;

