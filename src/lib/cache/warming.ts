/**
 * Cache Warming Strategies
 * Pre-populate cache with frequently accessed data for better performance
 */

import { redis, checkRedisHealth } from './client';
import { CacheKeys, CacheTTL } from './keys';
import { logger } from '../monitoring/logger';

export interface WarmingStrategy {
  name: string;
  keys: () => Promise<string[]>;
  fetcher: (key: string) => Promise<any>;
  ttl: number;
}

/**
 * Warm cache with specific data
 */
export async function warmCache(
  keys: string[],
  fetcher: (key: string) => Promise<any>,
  ttl: number
): Promise<{ success: number; failed: number }> {
  const results = { success: 0, failed: 0 };
  
  // Check Redis health before warming
  const isHealthy = await checkRedisHealth();
  if (!isHealthy) {
    logger.warn('Redis unhealthy, skipping cache warming');
    return results;
  }

  for (const key of keys) {
    try {
      const data = await fetcher(key);
      if (data) {
        await redis.setex(key, ttl, JSON.stringify(data));
        results.success++;
      }
    } catch (error) {
      logger.error(`Failed to warm cache for key ${key}`, error);
      results.failed++;
    }
  }

  logger.info(`Cache warming completed`, results);
  return results;
}

/**
 * Warm project cache for active projects
 */
export async function warmProjectCache(
  projectIds: string[]
): Promise<void> {
  const keys = projectIds.map(id => CacheKeys.project(id));
  
  await warmCache(
    keys,
    async (key) => {
      // Extract project ID from cache key
      const projectId = key.split(':')[1];
      // Fetch from database (would be imported from database operations)
      return null; // Placeholder - implement with actual DB fetch
    },
    CacheTTL.project
  );
}

/**
 * Warm frequently accessed data on server start
 */
export async function warmOnStartup(): Promise<void> {
  logger.info('Starting cache warming on server startup');
  
  try {
    // Warm system configuration
    await warmCache(
      [CacheKeys.system.config],
      async () => {
        // Fetch system config
        return { initialized: true, version: '1.0.0' };
      },
      CacheTTL.system
    );

    logger.info('Cache warming on startup completed');
  } catch (error) {
    logger.error('Cache warming failed', error);
  }
}

/**
 * Background cache warming task
 */
export function startCacheWarmingTask(intervalMs: number = 300000): NodeJS.Timer {
  logger.info('Starting background cache warming task', { intervalMs });
  
  return setInterval(async () => {
    try {
      await warmOnStartup();
    } catch (error) {
      logger.error('Background cache warming failed', error);
    }
  }, intervalMs);
}
