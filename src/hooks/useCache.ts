import { useCallback } from 'react';
import { getCached, setCached, invalidateCache } from '@/lib/cache/strategies';
import { CacheKeys, CacheTTL } from '@/lib/cache/keys';

export function useCache() {
  const get = useCallback(
    async <T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> => {
      return getCached(key, fetcher, ttl);
    },
    []
  );

  const set = useCallback(
    async <T>(key: string, value: T, ttl?: number): Promise<void> => {
      return setCached(key, value, ttl);
    },
    []
  );

  const invalidate = useCallback(async (pattern: string): Promise<void> => {
    return invalidateCache(pattern);
  }, []);

  return { get, set, invalidate };
}

export function useProjectCache() {
  const { get, set, invalidate } = useCache();

  const getProject = useCallback(
    async <T>(projectId: string, fetcher: () => Promise<T>): Promise<T> => {
      return get(CacheKeys.project(projectId), fetcher, CacheTTL.project);
    },
    [get]
  );

  const setProject = useCallback(
    async <T>(projectId: string, value: T): Promise<void> => {
      return set(CacheKeys.project(projectId), value, CacheTTL.project);
    },
    [set]
  );

  const invalidateProject = useCallback(
    async (projectId: string): Promise<void> => {
      await invalidate(CacheKeys.project(projectId));
      await invalidate(CacheKeys.projectList('*'));
    },
    [invalidate]
  );

  return { getProject, setProject, invalidateProject };
}
