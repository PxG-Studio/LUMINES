/**
 * Unit Tests for Connection Pool
 * Target: 12-15 tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  AIConnectionPool,
  getConnectionPool,
  withConnectionPool,
} from '../connection-pool';

describe('AIConnectionPool', () => {
  let pool: AIConnectionPool;

  beforeEach(() => {
    // Create new instance for each test
    pool = new AIConnectionPool();
  });

  describe('recordSuccess', () => {
    it('should record successful request', () => {
      pool.recordSuccess('claude', 100);

      const health = pool.getHealth('claude');
      expect(health?.healthy).toBe(true);
      expect(health?.consecutiveFailures).toBe(0);
    });

    it('should update average response time', () => {
      pool.recordSuccess('claude', 100);
      pool.recordSuccess('claude', 200);

      const stats = pool.getStats('claude');
      expect(stats?.averageResponseTime).toBeGreaterThan(0);
    });

    it('should update stats for successful requests', () => {
      pool.recordSuccess('claude', 100);

      const stats = pool.getStats('claude');
      expect(stats?.successfulRequests).toBe(1);
      expect(stats?.totalRequests).toBe(1);
      expect(stats?.failedRequests).toBe(0);
    });
  });

  describe('recordFailure', () => {
    it('should record failed request', () => {
      pool.recordFailure('claude');

      const health = pool.getHealth('claude');
      expect(health?.consecutiveFailures).toBe(1);
    });

    it('should mark unhealthy after 3 consecutive failures', () => {
      pool.recordFailure('claude');
      pool.recordFailure('claude');
      pool.recordFailure('claude');

      const health = pool.getHealth('claude');
      expect(health?.healthy).toBe(false);
    });

    it('should reset failures on success', () => {
      pool.recordFailure('claude');
      pool.recordFailure('claude');
      pool.recordSuccess('claude', 100);

      const health = pool.getHealth('claude');
      expect(health?.healthy).toBe(true);
      expect(health?.consecutiveFailures).toBe(0);
    });

    it('should update stats for failed requests', () => {
      pool.recordFailure('claude');

      const stats = pool.getStats('claude');
      expect(stats?.failedRequests).toBe(1);
      expect(stats?.totalRequests).toBe(1);
    });
  });

  describe('isHealthy', () => {
    it('should return true for healthy provider', () => {
      pool.recordSuccess('claude', 100);
      expect(pool.isHealthy('claude')).toBe(true);
    });

    it('should return false for unhealthy provider', () => {
      pool.recordFailure('claude');
      pool.recordFailure('claude');
      pool.recordFailure('claude');

      expect(pool.isHealthy('claude')).toBe(false);
    });

    it('should return false for unknown provider', () => {
      expect(pool.isHealthy('unknown' as any)).toBe(false);
    });
  });

  describe('getHealth', () => {
    it('should return health status for provider', () => {
      const health = pool.getHealth('claude');

      expect(health).toHaveProperty('provider');
      expect(health).toHaveProperty('healthy');
      expect(health).toHaveProperty('lastCheck');
      expect(health).toHaveProperty('consecutiveFailures');
    });

    it('should return null for unknown provider', () => {
      expect(pool.getHealth('unknown' as any)).toBeNull();
    });
  });

  describe('getStats', () => {
    it('should return stats for provider', () => {
      const stats = pool.getStats('claude');

      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('successfulRequests');
      expect(stats).toHaveProperty('failedRequests');
      expect(stats).toHaveProperty('averageResponseTime');
    });

    it('should return null for unknown provider', () => {
      expect(pool.getStats('unknown' as any)).toBeNull();
    });
  });

  describe('getAllHealth', () => {
    it('should return health for all providers', () => {
      const allHealth = pool.getAllHealth();

      expect(allHealth.has('claude')).toBe(true);
      expect(allHealth.has('openai')).toBe(true);
    });
  });

  describe('resetHealth', () => {
    it('should reset health status', () => {
      pool.recordFailure('claude');
      pool.recordFailure('claude');
      pool.recordFailure('claude');

      pool.resetHealth('claude');

      const health = pool.getHealth('claude');
      expect(health?.healthy).toBe(true);
      expect(health?.consecutiveFailures).toBe(0);
    });
  });

  describe('withConnectionPool', () => {
    it('should record success on successful execution', async () => {
      const fn = vi.fn().mockResolvedValue('result');
      const pool = getConnectionPool();

      const result = await withConnectionPool('claude', fn);

      expect(result).toBe('result');
      expect(pool.isHealthy('claude')).toBe(true);
    });

    it('should record failure on error', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('API error'));
      const pool = getConnectionPool();

      await expect(withConnectionPool('claude', fn)).rejects.toThrow();

      const health = pool.getHealth('claude');
      expect(health?.consecutiveFailures).toBe(1);
    });

    it('should measure response time', async () => {
      vi.useFakeTimers();
      const fn = vi.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'result';
      });

      const promise = withConnectionPool('claude', fn);
      await vi.advanceTimersByTimeAsync(100);
      await promise;

      const stats = getConnectionPool().getStats('claude');
      expect(stats?.averageResponseTime).toBeGreaterThan(0);
    });
  });

  describe('getConnectionPool singleton', () => {
    it('should return same instance on multiple calls', () => {
      const pool1 = getConnectionPool();
      const pool2 = getConnectionPool();

      expect(pool1).toBe(pool2);
    });
  });
});

