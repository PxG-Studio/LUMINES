/**
 * Build Cache Service
 * Redis-based caching for IGNIS build artifacts
 */

import { cache } from '../client';

const BUILD_CACHE_PREFIX = 'build:';
const BUILD_CACHE_TTL = 7 * 24 * 60 * 60; // 7 days

export class BuildCache {
  /**
   * Cache build artifact metadata
   */
  static async cacheBuild(buildId: string, metadata: any): Promise<void> {
    const key = `${BUILD_CACHE_PREFIX}${buildId}`;
    await cache.set(key, JSON.stringify(metadata), BUILD_CACHE_TTL);
  }

  /**
   * Get cached build metadata
   */
  static async getBuild(buildId: string): Promise<any | null> {
    const key = `${BUILD_CACHE_PREFIX}${buildId}`;
    const data = await cache.get(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Invalidate build cache
   */
  static async invalidate(buildId: string): Promise<void> {
    const key = `${BUILD_CACHE_PREFIX}${buildId}`;
    await cache.del(key);
  }
}

