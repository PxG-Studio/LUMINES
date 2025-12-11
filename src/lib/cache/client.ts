/**
 * Redis Cache Client
 * Redis connection using ioredis with abstraction layer
 * Lumines version - Next.js compatible
 */

import Redis from 'ioredis';
import { redisConfig, getRedisUrl } from '../config/redis';
import type { CacheClient } from './types';

// Redis client singleton pattern for Next.js
const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

// Create Redis connection
export const redis: Redis =
  globalForRedis.redis ??
  new Redis(getRedisUrl(), {
    retryStrategy: redisConfig.retryStrategy,
    reconnectOnError: redisConfig.reconnectOnError,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    enableOfflineQueue: false,
    lazyConnect: false,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

// Handle connection events
redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (error) => {
  console.error('❌ Redis error:', error);
});

redis.on('close', () => {
  console.log('⚠️  Redis connection closed');
});

redis.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

// Cache client implementation
export const cache: CacheClient = {
  get: async (key: string): Promise<string | null> => {
    try {
      return await redis.get(key);
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error);
      throw error;
    }
  },

  set: async (key: string, value: string, ttl?: number): Promise<void> => {
    try {
      if (ttl) {
        await redis.setex(key, ttl, value);
      } else {
        await redis.set(key, value, 'EX', redisConfig.ttl);
      }
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error);
      throw error;
    }
  },

  del: async (key: string): Promise<void> => {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`Redis DEL error for key ${key}:`, error);
      throw error;
    }
  },

  exists: async (key: string): Promise<boolean> => {
    try {
      const count = await redis.exists(key);
      return count > 0;
    } catch (error) {
      console.error(`Redis EXISTS error for key ${key}:`, error);
      throw error;
    }
  },

  close: async (): Promise<void> => {
    try {
      await redis.quit();
    } catch (error) {
      console.error('Redis close error:', error);
      // Force disconnect if quit fails
      redis.disconnect();
    }
  },
};

/**
 * Health check for Redis connection
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    const result = await redis.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}

// Export Redis client for advanced usage
export { Redis };
