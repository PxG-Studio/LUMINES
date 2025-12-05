import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRedisClient, resetCacheMocks } from '../../../__tests__/mocks/cache';

vi.mock('../client', () => ({
  getActiveRedisClient: () => mockRedisClient,
}));

const { getCached, setCached, invalidateCache } = await import('../strategies');

describe('Cache Strategies', () => {
  beforeEach(() => {
    resetCacheMocks();
  });

  describe('getCached', () => {
    it('returns cached value if exists', async () => {
      const cachedValue = JSON.stringify({ data: 'test' });
      mockRedisClient.get.mockResolvedValue(cachedValue);

      const fetcher = vi.fn();
      const result = await getCached('test-key', fetcher, 3600);

      expect(result).toEqual({ data: 'test' });
      expect(fetcher).not.toHaveBeenCalled();
      expect(mockRedisClient.get).toHaveBeenCalledWith('test-key');
    });

    it('calls fetcher on cache miss', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      const fetchedData = { data: 'fetched' };
      const fetcher = vi.fn().mockResolvedValue(fetchedData);

      const result = await getCached('test-key', fetcher, 3600);

      expect(result).toEqual(fetchedData);
      expect(fetcher).toHaveBeenCalled();
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(fetchedData),
        'EX',
        3600
      );
    });

    it('handles JSON parse errors', async () => {
      mockRedisClient.get.mockResolvedValue('invalid json');
      const fetchedData = { data: 'fetched' };
      const fetcher = vi.fn().mockResolvedValue(fetchedData);

      const result = await getCached('test-key', fetcher, 3600);

      expect(result).toEqual(fetchedData);
      expect(fetcher).toHaveBeenCalled();
    });

    it('handles Redis errors gracefully', async () => {
      mockRedisClient.get.mockRejectedValue(new Error('Redis error'));
      const fetchedData = { data: 'fallback' };
      const fetcher = vi.fn().mockResolvedValue(fetchedData);

      const result = await getCached('test-key', fetcher, 3600);

      expect(result).toEqual(fetchedData);
      expect(fetcher).toHaveBeenCalled();
    });

    it('uses default TTL if not provided', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      const fetcher = vi.fn().mockResolvedValue({ data: 'test' });

      await getCached('test-key', fetcher);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'test-key',
        expect.any(String),
        'EX',
        expect.any(Number)
      );
    });
  });

  describe('setCached', () => {
    it('sets value in cache with TTL', async () => {
      const data = { test: 'data' };
      const ttl = 3600;

      await setCached('test-key', data, ttl);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(data),
        'EX',
        ttl
      );
    });

    it('handles Redis set errors', async () => {
      mockRedisClient.set.mockRejectedValue(new Error('Redis error'));

      await expect(setCached('test-key', { data: 'test' }, 3600)).resolves.not.toThrow();
    });

    it('serializes complex objects', async () => {
      const complexData = {
        nested: { array: [1, 2, 3], string: 'test' },
        date: new Date(),
      };

      await setCached('test-key', complexData, 3600);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(complexData),
        'EX',
        3600
      );
    });
  });

  describe('invalidateCache', () => {
    it('deletes matching keys', async () => {
      mockRedisClient.keys.mockResolvedValue(['key1', 'key2', 'key3']);
      mockRedisClient.del.mockResolvedValue(3);

      await invalidateCache('key*');

      expect(mockRedisClient.keys).toHaveBeenCalledWith('key*');
      expect(mockRedisClient.del).toHaveBeenCalledWith('key1', 'key2', 'key3');
    });

    it('handles no matching keys', async () => {
      mockRedisClient.keys.mockResolvedValue([]);

      await invalidateCache('nonexistent*');

      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });

    it('handles Redis errors during invalidation', async () => {
      mockRedisClient.keys.mockRejectedValue(new Error('Redis error'));

      await expect(invalidateCache('key*')).resolves.not.toThrow();
    });

    it('deletes keys in batches if many matches', async () => {
      const manyKeys = Array.from({ length: 150 }, (_, i) => `key${i}`);
      mockRedisClient.keys.mockResolvedValue(manyKeys);
      mockRedisClient.del.mockResolvedValue(100);

      await invalidateCache('key*');

      expect(mockRedisClient.del).toHaveBeenCalledTimes(2);
    });
  });
});
