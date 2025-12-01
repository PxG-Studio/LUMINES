/**
 * Build Cache Manager
 * Incremental rebuilds (Phase I integration)
 */

import { BuildResult } from "./BuildTypes";
import { useWissilFS } from "../runtime/fs/wissilFs";

/**
 * Build Cache Manager
 * Manages build caching for incremental rebuilds
 */
export class BuildCacheManager {
  /**
   * Check if cache is valid
   */
  static isCacheValid(target: string, profile: string): boolean {
    const key = this.getCacheKey(target, profile);
    const cache = localStorage.getItem(key);
    if (!cache) return false;

    try {
      const cached = JSON.parse(cache);
      const currentHash = this.computeProjectHash();

      return cached.hash === currentHash;
    } catch {
      return false;
    }
  }

  /**
   * Get cached build
   */
  static getCachedBuild(target: string, profile: string): BuildResult | null {
    const key = this.getCacheKey(target, profile);
    const cache = localStorage.getItem(key);
    if (!cache) return null;

    try {
      const cached = JSON.parse(cache);
      return cached.result || null;
    } catch {
      return null;
    }
  }

  /**
   * Store build cache
   */
  static storeCache(target: string, profile: string, result: BuildResult): void {
    const key = this.getCacheKey(target, profile);
    const hash = this.computeProjectHash();

    const cache = {
      hash,
      result,
      timestamp: Date.now()
    };

    localStorage.setItem(key, JSON.stringify(cache));
  }

  /**
   * Clear cache
   */
  static clearCache(target?: string, profile?: string): void {
    if (target && profile) {
      const key = this.getCacheKey(target, profile);
      localStorage.removeItem(key);
    } else {
      // Clear all build caches
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("buildcache_")) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  /**
   * Get cache key
   */
  private static getCacheKey(target: string, profile: string): string {
    return `buildcache_${target}_${profile}`;
  }

  /**
   * Compute project hash (for cache invalidation)
   */
  private static computeProjectHash(): string {
    // Use WISSIL FS to compute hash of project files
    const fs = useWissilFS.getState();
    const snapshot = fs.getSnapshot();

    // Simple hash - would use more sophisticated hashing in production
    const projectString = JSON.stringify(snapshot);
    let hash = 0;
    for (let i = 0; i < projectString.length; i++) {
      const char = projectString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }
}

