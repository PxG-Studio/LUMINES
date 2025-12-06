/**
 * Cache Client Types
 */

export interface CacheClient {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, ttl?: number) => Promise<void>;
  del: (key: string) => Promise<void>;
  exists: (key: string) => Promise<boolean>;
  close: () => Promise<void>;
}

