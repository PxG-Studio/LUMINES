/**
 * Rate Limiting Bridge
 * 
 * Re-exports rate limiter from SPARK module
 * This allows the main app to use SPARK's rate limiting functionality
 */

export { getRateLimiter, DEFAULT_RATE_LIMITS } from '@/lib/spark/rate-limiting/limiter';
export type { RateLimitConfig, RateLimitResult } from '@/lib/spark/rate-limiting/limiter';

