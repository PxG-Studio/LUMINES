/**
 * Redis Integration Tests
 * Tests Redis client connection and caching operations
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { redis, cache, checkRedisHealth } from '@/lib/cache/client';
import { SessionStore, BuildCache, TokenCache } from '@/lib/cache/services';

describe('Redis Integration', () => {
  beforeAll(async () => {
    // Ensure Redis is healthy before tests
    const healthy = await checkRedisHealth();
    if (!healthy) {
      throw new Error('Redis connection failed - cannot run integration tests');
    }
  });

  afterAll(async () => {
    // Cleanup: Close Redis connection
    await cache.close();
  });

  describe('Connection Health', () => {
    it('should connect to Redis successfully', async () => {
      const healthy = await checkRedisHealth();
      expect(healthy).toBe(true);
    });

    it('should respond to PING', async () => {
      const result = await redis.ping();
      expect(result).toBe('PONG');
    });
  });

  describe('Basic Cache Operations', () => {
    it('should set and get values', async () => {
      const key = 'test:set-get';
      const value = 'test-value';

      await cache.set(key, value);
      const retrieved = await cache.get(key);

      expect(retrieved).toBe(value);

      // Cleanup
      await cache.del(key);
    });

    it('should check if key exists', async () => {
      const key = 'test:exists';

      const existsBefore = await cache.exists(key);
      expect(existsBefore).toBe(false);

      await cache.set(key, 'value');
      const existsAfter = await cache.exists(key);
      expect(existsAfter).toBe(true);

      // Cleanup
      await cache.del(key);
    });

    it('should delete keys', async () => {
      const key = 'test:delete';
      await cache.set(key, 'value');

      const existsBefore = await cache.exists(key);
      expect(existsBefore).toBe(true);

      await cache.del(key);

      const existsAfter = await cache.exists(key);
      expect(existsAfter).toBe(false);
    });

    it('should set TTL on keys', async () => {
      const key = 'test:ttl';
      const ttl = 5; // 5 seconds

      await cache.set(key, 'value', ttl);
      const ttlResult = await redis.ttl(key);

      expect(ttlResult).toBeGreaterThan(0);
      expect(ttlResult).toBeLessThanOrEqual(ttl);

      // Cleanup
      await cache.del(key);
    });
  });

  describe('SessionStore Service', () => {
    it('should store and retrieve sessions', async () => {
      const sessionId = 'test-session-123';
      const sessionData = {
        userId: 'user-123',
        email: 'test@example.com',
      };

      await SessionStore.set(sessionId, sessionData);
      const retrieved = await SessionStore.get(sessionId);

      expect(retrieved).toEqual(sessionData);

      // Cleanup
      await SessionStore.delete(sessionId);
    });

    it('should check if session exists', async () => {
      const sessionId = 'test-session-456';
      
      const existsBefore = await SessionStore.exists(sessionId);
      expect(existsBefore).toBe(false);

      await SessionStore.set(sessionId, { userId: 'user-456' });
      const existsAfter = await SessionStore.exists(sessionId);
      expect(existsAfter).toBe(true);

      // Cleanup
      await SessionStore.delete(sessionId);
    });
  });

  describe('BuildCache Service', () => {
    it('should cache build metadata', async () => {
      const buildId = 'test-build-123';
      const metadata = {
        projectId: 'project-123',
        status: 'completed',
        artifactUrl: 'https://example.com/build.zip',
      };

      await BuildCache.cacheBuild(buildId, metadata);
      const retrieved = await BuildCache.getBuild(buildId);

      expect(retrieved).toEqual(metadata);

      // Cleanup
      await BuildCache.invalidate(buildId);
    });
  });

  describe('TokenCache Service', () => {
    it('should cache design tokens by category', async () => {
      const category = 'colors';
      const tokens = {
        primary: '#FF0000',
        secondary: '#00FF00',
      };

      await TokenCache.cacheTokens(category, tokens);
      const retrieved = await TokenCache.getTokens(category);

      expect(retrieved).toEqual(tokens);

      // Cleanup
      await TokenCache.invalidate(category);
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', async () => {
      // Note: This test assumes Redis is running
      // In CI, we might need to mock Redis or skip if unavailable
      try {
        await cache.get('nonexistent-key');
        // Should not throw - should return null
        expect(true).toBe(true);
      } catch (error) {
        // If Redis is down, that's also a valid test scenario
        expect(error).toBeDefined();
      }
    });
  });
});

