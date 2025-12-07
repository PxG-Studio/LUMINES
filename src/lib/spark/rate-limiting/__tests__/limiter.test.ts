/**
 * Unit Tests for Rate Limiter
 * Target: 15-20 tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter, getRateLimiter, DEFAULT_RATE_LIMITS } from '../limiter';

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter();
  });

  describe('checkLimit', () => {
    it('should allow requests within limit', () => {
      const result = limiter.checkLimit('user1', {
        windowMs: 60000,
        maxRequests: 10,
      });

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(10);
    });

    it('should deny requests exceeding limit', () => {
      const config = { windowMs: 60000, maxRequests: 2 };

      // Make 2 requests
      limiter.recordRequest('user1', true);
      limiter.recordRequest('user1', true);

      const result = limiter.checkLimit('user1', config);

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should calculate remaining requests correctly', () => {
      const config = { windowMs: 60000, maxRequests: 5 };

      limiter.recordRequest('user1', true);
      limiter.recordRequest('user1', true);

      const result = limiter.checkLimit('user1', config);

      expect(result.remaining).toBe(3);
    });

    it('should reset after window expires', async () => {
      vi.useFakeTimers();
      const config = { windowMs: 1000, maxRequests: 2 };

      limiter.recordRequest('user1', true);
      limiter.recordRequest('user1', true);

      vi.advanceTimersByTime(1001);

      const result = limiter.checkLimit('user1', config);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
    });

    it('should skip successful requests when configured', () => {
      const config = {
        windowMs: 60000,
        maxRequests: 2,
        skipSuccessfulRequests: true,
      };

      limiter.recordRequest('user1', true);
      limiter.recordRequest('user1', true);
      limiter.recordRequest('user1', false);

      const result = limiter.checkLimit('user1', config);

      // Only failed request counts
      expect(result.allowed).toBe(true);
    });

    it('should skip failed requests when configured', () => {
      const config = {
        windowMs: 60000,
        maxRequests: 2,
        skipFailedRequests: true,
      };

      limiter.recordRequest('user1', false);
      limiter.recordRequest('user1', false);
      limiter.recordRequest('user1', true);

      const result = limiter.checkLimit('user1', config);

      // Only successful request counts
      expect(result.allowed).toBe(true);
    });

    it('should calculate reset time', () => {
      const config = { windowMs: 60000, maxRequests: 10 };
      const result = limiter.checkLimit('user1', config);

      expect(result.resetTime).toBeGreaterThan(Date.now());
    });

    it('should calculate retry after when limited', () => {
      const config = { windowMs: 60000, maxRequests: 1 };

      limiter.recordRequest('user1', true);
      const result = limiter.checkLimit('user1', config);

      expect(result.retryAfter).toBeDefined();
      expect(result.retryAfter).toBeGreaterThan(0);
    });
  });

  describe('recordRequest', () => {
    it('should record successful request', () => {
      limiter.recordRequest('user1', true);

      const result = limiter.checkLimit('user1', {
        windowMs: 60000,
        maxRequests: 10,
      });

      expect(result.remaining).toBe(9);
    });

    it('should record failed request', () => {
      limiter.recordRequest('user1', false);

      const result = limiter.checkLimit('user1', {
        windowMs: 60000,
        maxRequests: 10,
      });

      expect(result.remaining).toBe(9);
    });

    it('should limit stored requests per key', () => {
      // Record more than 1000 requests
      for (let i = 0; i < 1001; i++) {
        limiter.recordRequest('user1', true);
      }

      // Should not crash and should still work
      const result = limiter.checkLimit('user1', {
        windowMs: 60000,
        maxRequests: 10,
      });

      expect(result).toBeDefined();
    });
  });

  describe('clearLimit', () => {
    it('should clear limits for a key', () => {
      limiter.recordRequest('user1', true);
      limiter.recordRequest('user1', true);

      limiter.clearLimit('user1');

      const result = limiter.checkLimit('user1', {
        windowMs: 60000,
        maxRequests: 2,
      });

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
    });
  });

  describe('clearAll', () => {
    it('should clear all limits', () => {
      limiter.recordRequest('user1', true);
      limiter.recordRequest('user2', true);

      limiter.clearAll();

      const result1 = limiter.checkLimit('user1', {
        windowMs: 60000,
        maxRequests: 1,
      });
      const result2 = limiter.checkLimit('user2', {
        windowMs: 60000,
        maxRequests: 1,
      });

      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
    });
  });

  describe('getRateLimiter singleton', () => {
    it('should return same instance', () => {
      const limiter1 = getRateLimiter();
      const limiter2 = getRateLimiter();

      expect(limiter1).toBe(limiter2);
    });
  });

  describe('DEFAULT_RATE_LIMITS', () => {
    it('should have standard limits defined', () => {
      expect(DEFAULT_RATE_LIMITS).toBeDefined();
      expect(DEFAULT_RATE_LIMITS.standard).toBeDefined();
      expect(DEFAULT_RATE_LIMITS.strict).toBeDefined();
    });
  });
});

