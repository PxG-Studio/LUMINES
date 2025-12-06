/**
 * AI Response Caching System
 * 
 * Caches common prompts and validation results to reduce API calls
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

export class AICache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number;
  private defaultTTL: number;

  constructor(options: { maxSize?: number; defaultTTL?: number } = {}) {
    this.maxSize = options.maxSize || 1000;
    this.defaultTTL = options.defaultTTL || 3600000; // 1 hour default
  }

  /**
   * Generate cache key from prompt and options
   */
  private generateKey(prompt: string, provider: string, model: string): string {
    const normalizedPrompt = prompt.toLowerCase().trim();
    return `ai:${provider}:${model}:${this.hashString(normalizedPrompt)}`;
  }

  /**
   * Simple hash function for cache keys
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get cached value
   */
  get<T>(prompt: string, provider: string, model: string): T | null {
    const key = this.generateKey(prompt, provider, model);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Set cached value
   */
  set<T>(prompt: string, provider: string, model: string, value: T, ttl?: number): void {
    // Evict oldest entries if at max size
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const key = this.generateKey(prompt, provider, model);
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  /**
   * Check if prompt is cached
   */
  has(prompt: string, provider: string, model: string): boolean {
    const key = this.generateKey(prompt, provider, model);
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete cached entry
   */
  delete(prompt: string, provider: string, model: string): void {
    const key = this.generateKey(prompt, provider, model);
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Evict oldest entries
   */
  private evictOldest(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Remove oldest 10% of entries
    const toRemove = Math.max(1, Math.floor(entries.length * 0.1));
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // Would need to track hits/misses
    };
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
let cacheInstance: AICache | null = null;

/**
 * Get the global AI cache instance
 */
export function getAICache(): AICache {
  if (!cacheInstance) {
    cacheInstance = new AICache({
      maxSize: parseInt(process.env.AI_CACHE_MAX_SIZE || '1000'),
      defaultTTL: parseInt(process.env.AI_CACHE_TTL || '3600000'),
    });

    // Clean expired entries every 5 minutes
    setInterval(() => {
      cacheInstance?.cleanExpired();
    }, 5 * 60 * 1000);
  }
  return cacheInstance;
}

/**
 * Cache validation results
 */
export class ValidationCache {
  private cache: Map<string, CacheEntry<boolean>> = new Map();
  private maxSize: number;
  private defaultTTL: number;

  constructor(options: { maxSize?: number; defaultTTL?: number } = {}) {
    this.maxSize = options.maxSize || 5000;
    this.defaultTTL = options.defaultTTL || 86400000; // 24 hours default
  }

  /**
   * Generate cache key from code
   */
  private generateKey(code: string): string {
    return `validation:${this.hashString(code)}`;
  }

  /**
   * Hash function
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get cached validation result
   */
  get(code: string): boolean | null {
    const key = this.generateKey(code);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Set cached validation result
   */
  set(code: string, isValid: boolean, ttl?: number): void {
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const key = this.generateKey(code);
    this.cache.set(key, {
      value: isValid,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  /**
   * Evict oldest entries
   */
  private evictOldest(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = Math.max(1, Math.floor(entries.length * 0.1));
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Singleton instance
let validationCacheInstance: ValidationCache | null = null;

/**
 * Get the global validation cache instance
 */
export function getValidationCache(): ValidationCache {
  if (!validationCacheInstance) {
    validationCacheInstance = new ValidationCache({
      maxSize: parseInt(process.env.VALIDATION_CACHE_MAX_SIZE || '5000'),
      defaultTTL: parseInt(process.env.VALIDATION_CACHE_TTL || '86400000'),
    });
  }
  return validationCacheInstance;
}

