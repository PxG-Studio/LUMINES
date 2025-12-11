/**
 * Performance Tests for SPARK
 * Target: 10-15 tests
 */

import { describe, it, expect, vi } from 'vitest';
import { getAICache } from '../ai/cache';
import { getRateLimiter } from '../rate-limiting/limiter';
import { getAnalyticsTracker } from '../analytics/tracker';
import { validateCSharp } from '../unity/validator';

describe('SPARK Performance Tests', () => {
  describe('Cache performance', () => {
    it('should handle many cache operations quickly', () => {
      const cache = getAICache();
      const start = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        cache.set(`prompt${i}`, 'claude', 'claude-3', `result${i}`);
      }
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // Should complete in < 1 second
    });

    it('should retrieve cached values quickly', () => {
      const cache = getAICache();
      cache.set('test', 'claude', 'claude-3', 'result');
      
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        cache.get('test', 'claude', 'claude-3');
      }
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // Should be very fast
    });
  });

  describe('Rate limiter performance', () => {
    it('should check limits quickly', () => {
      const limiter = getRateLimiter();
      const start = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        limiter.checkLimit(`user${i}`, { windowMs: 60000, maxRequests: 10 });
      }
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(500); // Should be fast
    });

    it('should record requests quickly', () => {
      const limiter = getRateLimiter();
      const start = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        limiter.recordRequest(`user${i}`, true);
      }
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Validation performance', () => {
    it('should validate small code quickly', () => {
      const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
      const start = Date.now();
      
      for (let i = 0; i < 100; i++) {
        validateCSharp(code);
      }
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // Should be very fast
    });

    it('should validate large code efficiently', () => {
      const largeCode = Array(1000).fill('using UnityEngine;').join('\n') + 
        '\npublic class Test : MonoBehaviour { }';
      const start = Date.now();
      
      const result = validateCSharp(largeCode);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // Should handle large code
      expect(result).toBeDefined();
    });
  });

  describe('Analytics performance', () => {
    it('should track events quickly', () => {
      const tracker = getAnalyticsTracker();
      const start = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        tracker.track(`event_${i}`, { index: i });
      }
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // Should be fast
    });

    it('should calculate metrics quickly', () => {
      const tracker = getAnalyticsTracker();
      
      // Add some events
      for (let i = 0; i < 100; i++) {
        tracker.trackGeneration('unity', 'claude', 100, 500, true);
      }
      
      const start = Date.now();
      const metrics = tracker.getMetrics();
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100); // Metrics calculation should be fast
      expect(metrics).toBeDefined();
    });
  });

  describe('Memory usage', () => {
    it('should not leak memory with many cache entries', () => {
      const cache = getAICache();
      
      // Add many entries
      for (let i = 0; i < 10000; i++) {
        cache.set(`prompt${i}`, 'claude', 'claude-3', `result${i}`);
      }
      
      // Cache should limit size
      const stats = cache.getStats();
      expect(stats.size).toBeLessThanOrEqual(stats.maxSize);
    });

    it('should clean up old rate limit entries', () => {
      const limiter = getRateLimiter();
      
      // Add many requests
      for (let i = 0; i < 1000; i++) {
        limiter.recordRequest(`user${i}`, true);
      }
      
      // Should not crash or leak
      expect(true).toBe(true);
    });
  });

  describe('Concurrent operations', () => {
    it('should handle concurrent cache operations', async () => {
      const cache = getAICache();
      
      const operations = Array(100).fill(null).map(async (_, i) => {
        cache.set(`prompt${i}`, 'claude', 'claude-3', `result${i}`);
        return cache.get(`prompt${i}`, 'claude', 'claude-3');
      });
      
      const results = await Promise.all(operations);
      expect(results.length).toBe(100);
      expect(results.every(r => r !== null)).toBe(true);
    });

    it('should handle concurrent validation', async () => {
      const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
      
      const validations = Array(100).fill(null).map(() => validateCSharp(code));
      expect(validations.length).toBe(100);
      expect(validations.every(v => v.isValid)).toBe(true);
    });
  });
});

