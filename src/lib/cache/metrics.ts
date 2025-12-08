/**
 * Cache Metrics and Monitoring
 * Track cache performance and health metrics
 */

import { redis } from './client';
import { logger } from '../monitoring/logger';

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
  memory: {
    used: number;
    peak: number;
    fragmentation: number;
  };
  keys: {
    total: number;
    expires: number;
  };
  connections: {
    clients: number;
    blocked: number;
  };
}

/**
 * Get Redis info and parse into metrics
 */
export async function getCacheMetrics(): Promise<CacheMetrics> {
  try {
    const info = await redis.info();
    const stats = parseRedisInfo(info);

    const hits = parseInt(stats.keyspace_hits || '0');
    const misses = parseInt(stats.keyspace_misses || '0');
    const total = hits + misses;

    return {
      hits,
      misses,
      hitRate: total > 0 ? (hits / total) * 100 : 0,
      evictions: parseInt(stats.evicted_keys || '0'),
      memory: {
        used: parseInt(stats.used_memory || '0'),
        peak: parseInt(stats.used_memory_peak || '0'),
        fragmentation: parseFloat(stats.mem_fragmentation_ratio || '1.0'),
      },
      keys: {
        total: await redis.dbsize(),
        expires: parseInt(stats.expires || '0'),
      },
      connections: {
        clients: parseInt(stats.connected_clients || '0'),
        blocked: parseInt(stats.blocked_clients || '0'),
      },
    };
  } catch (error) {
    logger.error('Failed to get cache metrics', error);
    throw error;
  }
}

/**
 * Parse Redis INFO output into key-value pairs
 */
function parseRedisInfo(info: string): Record<string, string> {
  const lines = info.split('\r\n');
  const stats: Record<string, string> = {};

  for (const line of lines) {
    if (line && !line.startsWith('#') && line.includes(':')) {
      const [key, value] = line.split(':');
      stats[key] = value;
    }
  }

  return stats;
}

/**
 * Monitor cache health and log warnings
 */
export async function monitorCacheHealth(): Promise<{
  healthy: boolean;
  warnings: string[];
}> {
  const warnings: string[] = [];
  const metrics = await getCacheMetrics();

  // Check hit rate
  if (metrics.hitRate < 70) {
    warnings.push(`Low cache hit rate: ${metrics.hitRate.toFixed(2)}%`);
  }

  // Check memory usage
  const memoryUsagePercent = (metrics.memory.used / metrics.memory.peak) * 100;
  if (memoryUsagePercent > 90) {
    warnings.push(`High memory usage: ${memoryUsagePercent.toFixed(2)}%`);
  }

  // Check memory fragmentation
  if (metrics.memory.fragmentation > 1.5) {
    warnings.push(
      `High memory fragmentation: ${metrics.memory.fragmentation.toFixed(2)}`
    );
  }

  // Check evictions
  if (metrics.evictions > 1000) {
    warnings.push(`High eviction count: ${metrics.evictions}`);
  }

  const healthy = warnings.length === 0;

  if (!healthy) {
    logger.warn('Cache health warnings detected', { warnings });
  }

  return { healthy, warnings };
}

/**
 * Start periodic cache health monitoring
 */
export function startCacheMonitoring(intervalMs: number = 60000): NodeJS.Timer {
  logger.info('Starting cache health monitoring', { intervalMs });

  return setInterval(async () => {
    try {
      const health = await monitorCacheHealth();
      
      if (!health.healthy) {
        logger.warn('Cache health check failed', {
          warnings: health.warnings,
        });
      }

      const metrics = await getCacheMetrics();
      logger.debug('Cache metrics', {
        hitRate: `${metrics.hitRate.toFixed(2)}%`,
        keys: metrics.keys.total,
        memory: `${(metrics.memory.used / 1024 / 1024).toFixed(2)} MB`,
      });
    } catch (error) {
      logger.error('Cache monitoring failed', error);
    }
  }, intervalMs);
}
