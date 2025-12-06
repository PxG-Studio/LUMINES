/**
 * Preview Frame Cache
 *
 * In-memory cache for preview frames with TTL and size limits
 */

interface CacheEntry {
  frameRef: string;
  timestamp: number;
  ttl: number;
}

class PreviewCache {
  private cache = new Map<string, CacheEntry>();
  private readonly defaultTtl = 300000; // 5 min
  private readonly maxSize = 1000;

  get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.frameRef;
  }

  set(key: string, frameRef: string, ttl = this.defaultTtl) {
    this.cache.set(key, { frameRef, timestamp: Date.now(), ttl });
    if (this.cache.size > this.maxSize) {
      const first = this.cache.keys().next().value;
      if (first !== undefined) {
        this.cache.delete(first);
      }
    }
  }

  clear() {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const previewCache = new PreviewCache();
