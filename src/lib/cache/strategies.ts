import { getActiveRedisClient } from './client';
import { CacheKeys } from './keys';

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 1800
): Promise<T> {
  const redis = getActiveRedisClient();

  try {
    const cached = await redis.get(key);

    if (cached) {
      return JSON.parse(cached) as T;
    }

    const data = await fetcher();

    if (data !== null && data !== undefined) {
      await redis.setex(key, ttl, JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Cache get error:', error);
    return fetcher();
  }
}

export async function setCached<T>(
  key: string,
  value: T,
  ttl: number = 1800
): Promise<void> {
  const redis = getActiveRedisClient();

  try {
    if (value !== null && value !== undefined) {
      await redis.setex(key, ttl, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  const redis = getActiveRedisClient();

  try {
    const keys = await redis.keys(pattern);

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

export async function invalidateProjectCache(projectId: string): Promise<void> {
  await Promise.all([
    invalidateCache(`slate:project:${projectId}*`),
    invalidateCache(`slate:files:project:${projectId}*`),
    invalidateCache(`slate:assets:project:${projectId}*`),
    invalidateCache(`slate:runtime:${projectId}*`),
    invalidateCache(`slate:build:${projectId}*`),
  ]);
}

export async function invalidateFileCache(
  projectId: string,
  fileId?: string,
  path?: string
): Promise<void> {
  if (fileId) {
    await invalidateCache(CacheKeys.file(fileId));
  }
  if (path) {
    await invalidateCache(CacheKeys.fileByPath(projectId, path));
  }
  await invalidateCache(CacheKeys.projectFiles(projectId));
}

export async function invalidateAssetCache(
  projectId: string,
  assetId?: string
): Promise<void> {
  if (assetId) {
    await invalidateCache(CacheKeys.asset(assetId));
    await invalidateCache(CacheKeys.assetComponents(assetId));
  }
  await invalidateCache(CacheKeys.projectAssets(projectId));
}

export async function mgetCached<T>(keys: string[]): Promise<(T | null)[]> {
  const redis = getActiveRedisClient();

  try {
    if (keys.length === 0) return [];

    const values = await redis.mget(...keys);
    return values.map((v) => (v ? (JSON.parse(v) as T) : null));
  } catch (error) {
    console.error('Cache mget error:', error);
    return keys.map(() => null);
  }
}

export async function msetCached<T>(
  entries: Array<{ key: string; value: T; ttl: number }>
): Promise<void> {
  const redis = getActiveRedisClient();

  try {
    const pipeline = redis.pipeline();

    for (const { key, value, ttl } of entries) {
      if (value !== null && value !== undefined) {
        pipeline.setex(key, ttl, JSON.stringify(value));
      }
    }

    await pipeline.exec();
  } catch (error) {
    console.error('Cache mset error:', error);
  }
}
