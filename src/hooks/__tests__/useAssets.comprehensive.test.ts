import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAsset, useAssets } from '../useAssets';

// Mock API calls
global.fetch = vi.fn();

describe('useAssets Hook - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useAsset', () => {
    it('should fetch asset when assetId is provided', async () => {
      const mockAsset = {
        id: 'asset1',
        name: 'PlayerSprite',
        type: 'sprite',
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAsset,
      } as Response);

      const { result } = renderHook(() => useAsset('asset1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.asset).toEqual(mockAsset);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/assets/asset1'));
    });

    it('should not fetch when assetId is null', () => {
      const { result } = renderHook(() => useAsset(null));

      expect(result.current.asset).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should handle fetch errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useAsset('asset1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useAssets', () => {
    it('should fetch assets for project', async () => {
      const mockAssets = [
        { id: '1', name: 'Asset1', type: 'sprite' },
        { id: '2', name: 'Asset2', type: 'texture' },
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAssets,
      } as Response);

      const { result } = renderHook(() => useAssets('proj1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.assets).toEqual(mockAssets);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/assets?projectId=proj1'));
    });

    it('should handle empty assets list', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      const { result } = renderHook(() => useAssets('proj1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.assets).toEqual([]);
    });

    it('should create new asset', async () => {
      const newAsset = {
        id: 'new1',
        name: 'NewAsset',
        type: 'sprite',
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => newAsset,
      } as Response);

      const { result } = renderHook(() => useAssets('proj1'));

      await result.current.createAsset({
        project_id: 'proj1',
        name: 'NewAsset',
        type: 'sprite',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/assets'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });
});
