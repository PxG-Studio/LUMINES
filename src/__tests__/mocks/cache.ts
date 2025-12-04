import { vi } from 'vitest';

export const mockRedisClient = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  keys: vi.fn(),
  ping: vi.fn(),
  quit: vi.fn(),
};

export const mockGetCached = vi.fn();
export const mockSetCached = vi.fn();
export const mockInvalidateCache = vi.fn();

vi.mock('../../lib/cache/client', () => ({
  getActiveRedisClient: () => mockRedisClient,
  initializeRedis: vi.fn(),
}));

vi.mock('../../lib/cache/strategies', () => ({
  getCached: mockGetCached,
  setCached: mockSetCached,
  invalidateCache: mockInvalidateCache,
}));

export const resetCacheMocks = () => {
  mockRedisClient.get.mockReset();
  mockRedisClient.set.mockReset();
  mockRedisClient.del.mockReset();
  mockRedisClient.keys.mockReset();
  mockGetCached.mockReset();
  mockSetCached.mockReset();
  mockInvalidateCache.mockReset();
};
