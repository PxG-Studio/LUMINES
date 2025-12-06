<<<<<<< HEAD
/**
 * Redis Cache Client
 * Redis connection using ioredis with abstraction layer
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
=======
import Redis, { RedisOptions } from 'ioredis';

let redisClient: Redis | null = null;
let sentinelClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    const host = import.meta.env.VITE_REDIS_HOST || '192.168.86.27';
    const port = parseInt(import.meta.env.VITE_REDIS_PORT || '6379');
    const db = parseInt(import.meta.env.VITE_REDIS_DB || '0');
    const password = import.meta.env.VITE_REDIS_PASSWORD;

    const options: RedisOptions = {
      host,
      port,
      db,
      password: password || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    };

    redisClient = new Redis(options);

    redisClient.on('connect', () => {
      console.log('Redis connected to', `${host}:${port}`);
    });

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    redisClient.on('ready', () => {
      console.log('Redis ready');
    });

    redisClient.on('close', () => {
      console.log('Redis connection closed');
    });
  }

  return redisClient;
}

export function getSentinelClient(): Redis | null {
  const sentinelHost = import.meta.env.VITE_REDIS_SENTINEL_HOST;

  if (!sentinelHost) {
    return null;
  }

  if (!sentinelClient) {
    const sentinelPort = parseInt(import.meta.env.VITE_REDIS_SENTINEL_PORT || '26379');
    const masterName = import.meta.env.VITE_REDIS_MASTER_NAME || 'mymaster';
    const password = import.meta.env.VITE_REDIS_PASSWORD;

    const options: RedisOptions = {
      sentinels: [
        { host: sentinelHost, port: sentinelPort }
      ],
      name: masterName,
      password: password || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    };

    sentinelClient = new Redis(options);

    sentinelClient.on('error', (err) => {
      console.error('Redis Sentinel error:', err);
    });
  }

  return sentinelClient;
}

export function getActiveRedisClient(): Redis {
  const sentinel = getSentinelClient();
  return sentinel || getRedisClient();
}

export async function closeRedisConnections(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }

  if (sentinelClient) {
    await sentinelClient.quit();
    sentinelClient = null;
  }
}

export { redisClient, sentinelClient };
>>>>>>> slate/prototype-1
