import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCache } from '../useCache';
import { getCached, setCached, invalidateCache } from '../../lib/cache/strategies';

vi.mock('../../lib/cache/strategies');

describe('useCache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and caches data', async () => {
    const mockData = { result: 'test data' };
    (getCached as any).mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useCache('test-key', async () => mockData)
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    expect(getCached).toHaveBeenCalledWith('test-key', expect.any(Function), expect.any(Number));
  });

  it('sets loading state during fetch', async () => {
    const mockData = { result: 'test data' };
    (getCached as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockData), 100))
    );

    const { result } = renderHook(() =>
      useCache('test-key', async () => mockData)
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('handles fetch error', async () => {
    const error = new Error('Fetch failed');
    (getCached as any).mockRejectedValue(error);

    const { result } = renderHook(() =>
      useCache('test-key', async () => {
        throw error;
      })
    );

    await waitFor(() => {
      expect(result.current.error).toEqual(error);
    });
  });

  it('invalidates cache', async () => {
    const mockData = { result: 'test data' };
    (getCached as any).mockResolvedValue(mockData);
    (invalidateCache as any).mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useCache('test-key', async () => mockData)
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    await act(async () => {
      await result.current.invalidate();
    });

    expect(invalidateCache).toHaveBeenCalledWith('test-key');
  });

  it('refetches after invalidation', async () => {
    const mockData1 = { result: 'data 1' };
    const mockData2 = { result: 'data 2' };

    (getCached as any)
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);
    (invalidateCache as any).mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useCache('test-key', async () => mockData1)
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData1);
    });

    await act(async () => {
      await result.current.invalidate();
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData2);
    });
  });

  it('respects custom TTL', async () => {
    const mockData = { result: 'test data' };
    (getCached as any).mockResolvedValue(mockData);

    renderHook(() =>
      useCache('test-key', async () => mockData, { ttl: 3600 })
    );

    await waitFor(() => {
      expect(getCached).toHaveBeenCalledWith('test-key', expect.any(Function), 3600);
    });
  });

  it('skips fetch when disabled', async () => {
    const mockData = { result: 'test data' };
    (getCached as any).mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useCache('test-key', async () => mockData, { enabled: false })
    );

    expect(result.current.data).toBeNull();
    expect(getCached).not.toHaveBeenCalled();
  });
});
