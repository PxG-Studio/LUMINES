export {
  getRedisClient,
  getSentinelClient,
  getActiveRedisClient,
  closeRedisConnections,
} from './client';

export { CacheKeys, CacheTTL } from './keys';

export {
  getCached,
  setCached,
  invalidateCache,
  invalidateProjectCache,
  invalidateFileCache,
  invalidateAssetCache,
  mgetCached,
  msetCached,
} from './strategies';

export {
  warmCache,
  warmProjectCache,
  warmOnStartup,
  startCacheWarmingTask,
} from './warming';

export {
  getCacheMetrics,
  monitorCacheHealth,
  startCacheMonitoring,
} from './metrics';

export type { CacheMetrics } from './metrics';
