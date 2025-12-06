/**
 * Cache Utilities
 * EC-184, EC-185: Caching for performance
 */
export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
}

class Cache<K, V> {
  private cache = new Map<K, { value: V; expires: number }>();
  private ttl: number;
  private maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.ttl = options.ttl || Infinity;
    this.maxSize = options.maxSize || 100;
  }

  set(key: K, value: V, customTtl?: number): void {
    // Remove oldest entries if at max size
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    const expires = Date.now() + (customTtl || this.ttl);
    this.cache.set(key, { value, expires });
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    // Check if expired
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    // Clean expired entries
    this.clean();
    return this.cache.size;
  }

  clean(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }
}

export function createCache<K, V>(options?: CacheOptions): Cache<K, V> {
  return new Cache<K, V>(options);
}

