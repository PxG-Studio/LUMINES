/**
 * Query Result Cache
 * Caches database query results to reduce database load
 */

import { cache } from '../client';
import { env } from '../../config/environment';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string; // Custom cache key
}

class QueryCache {
  private readonly defaultTTL: number;

  constructor() {
    this.defaultTTL = env.REDIS_TTL || 3600;
  }

  /**
   * Generate cache key from query parameters
   */
  private generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|');
    return `query:${prefix}:${sortedParams}`;
  }

  /**
   * Get cached query result
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await cache.get(key);
      if (cached) {
        return JSON.parse(cached) as T;
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set query result in cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const ttlToUse = ttl || this.defaultTTL;
      await cache.set(key, JSON.stringify(value), ttlToUse);
    } catch (error) {
      console.error('Cache set error:', error);
      // Don't throw - caching failures shouldn't break queries
    }
  }

  /**
   * Cache query result
   */
  async cacheQuery<T>(
    prefix: string,
    params: Record<string, any>,
    queryFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const key = options.key || this.generateKey(prefix, params);
    const ttl = options.ttl || this.defaultTTL;

    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Execute query
    const result = await queryFn();

    // Cache result
    await this.set(key, result, ttl);

    return result;
  }

  /**
   * Invalidate cache by prefix
   */
  async invalidate(prefix: string): Promise<void> {
    try {
      // Note: This requires Redis SCAN if we need to invalidate all keys with prefix
      // For now, we'll use a pattern-based approach
      // In production, consider using Redis keyspace notifications or a cache tag system
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  /**
   * Invalidate specific cache key
   */
  async invalidateKey(key: string): Promise<void> {
    try {
      await cache.del(key);
    } catch (error) {
      console.error('Cache key invalidation error:', error);
    }
  }

  /**
   * Cache user query
   */
  async cacheUserQuery<T>(
    params: Record<string, any>,
    queryFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    return this.cacheQuery('user', params, queryFn, { ttl });
  }

  /**
   * Cache project query
   */
  async cacheProjectQuery<T>(
    params: Record<string, any>,
    queryFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    return this.cacheQuery('project', params, queryFn, { ttl });
  }

  /**
   * Cache template query
   */
  async cacheTemplateQuery<T>(
    params: Record<string, any>,
    queryFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Templates change rarely, use longer TTL
    return this.cacheQuery('template', params, queryFn, { ttl: ttl || 7200 }); // 2 hours
  }
}

export const queryCache = new QueryCache();

