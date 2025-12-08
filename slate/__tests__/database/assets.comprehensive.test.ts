// @ts-nocheck
/**
 * Assets Database Operations - Comprehensive Tests
 * Complete coverage for asset CRUD, components, and dependencies
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as assetOps from '@/lib/database/operations/assets';
import { query, queryReplica } from '@/lib/database/client';

vi.mock('@/lib/database/client', () => ({
  query: vi.fn(),
  queryReplica: vi.fn(),
}));

describe('Assets Database Operations - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createAsset', () => {
    it('should create asset successfully', async () => {
      const mockAsset = {
        id: '1',
        project_id: 'p1',
        name: 'test.prefab',
        type: 'prefab',
        metadata: {},
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockAsset],
      } as any);

      const result = await assetOps.createAsset({
        project_id: 'p1',
        name: 'test.prefab',
        type: 'prefab',
      });

      expect(result).toEqual(mockAsset);
    });

    it('should serialize metadata as JSON', async () => {
      const metadata = { unityVersion: '2022.3', custom: 'data' };
      vi.mocked(query).mockResolvedValue({
        rows: [{ id: '1', metadata: JSON.stringify(metadata) }],
      } as any);

      await assetOps.createAsset({
        project_id: 'p1',
        name: 'test.prefab',
        type: 'prefab',
        metadata,
      });

      expect(query).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([JSON.stringify(metadata)])
      );
    });
  });

  describe('getAsset', () => {
    it('should get asset by ID', async () => {
      const mockAsset = { id: '1', name: 'test.prefab' };
      vi.mocked(query).mockResolvedValue({
        rows: [mockAsset],
      } as any);

      const result = await assetOps.getAsset('1');
      expect(result).toEqual(mockAsset);
    });

    it('should return null for non-existent asset', async () => {
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      const result = await assetOps.getAsset('999');
      expect(result).toBeNull();
    });
  });

  describe('listAssets', () => {
    it('should list all assets for project', async () => {
      const mockAssets = [
        { id: '1', project_id: 'p1', name: 'asset1.prefab' },
        { id: '2', project_id: 'p1', name: 'asset2.prefab' },
      ];

      vi.mocked(queryReplica).mockResolvedValue({
        rows: mockAssets,
      } as any);

      const result = await assetOps.listAssets('p1');
      expect(result).toEqual(mockAssets);
    });
  });

  describe('updateAsset', () => {
    it('should update asset', async () => {
      const mockAsset = { id: '1', name: 'updated.prefab' };
      vi.mocked(query).mockResolvedValue({
        rows: [mockAsset],
      } as any);

      const result = await assetOps.updateAsset('1', {
        name: 'updated.prefab',
      });

      expect(result).toEqual(mockAsset);
    });
  });

  describe('deleteAsset', () => {
    it('should soft delete asset', async () => {
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      await assetOps.deleteAsset('1');
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE slate_assets SET deleted_at'),
        ['1']
      );
    });
  });

  describe('Asset Components', () => {
    it('should create asset component', async () => {
      const mockComponent = {
        id: '1',
        asset_id: 'a1',
        component_type: 'Transform',
        properties: {},
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockComponent],
      } as any);

      const result = await assetOps.createAssetComponent({
        asset_id: 'a1',
        component_type: 'Transform',
        properties: {},
      });

      expect(result).toEqual(mockComponent);
    });

    it('should list asset components', async () => {
      const mockComponents = [
        { id: '1', asset_id: 'a1', component_type: 'Transform' },
        { id: '2', asset_id: 'a1', component_type: 'Renderer' },
      ];

      vi.mocked(queryReplica).mockResolvedValue({
        rows: mockComponents,
      } as any);

      const result = await assetOps.listAssetComponents('a1');
      expect(result).toEqual(mockComponents);
    });

    it('should update asset component', async () => {
      const mockComponent = { id: '1', properties: { x: 1, y: 2 } };
      vi.mocked(query).mockResolvedValue({
        rows: [mockComponent],
      } as any);

      const result = await assetOps.updateAssetComponent('1', { x: 1, y: 2 });
      expect(result).toEqual(mockComponent);
    });

    it('should delete asset component', async () => {
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      await assetOps.deleteAssetComponent('1');
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM slate_asset_components'),
        ['1']
      );
    });
  });

  describe('Asset Dependencies', () => {
    it('should create asset dependency', async () => {
      const mockDependency = {
        id: '1',
        asset_id: 'a1',
        dependency_asset_id: 'a2',
        dependency_type: 'reference',
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockDependency],
      } as any);

      const result = await assetOps.createAssetDependency({
        asset_id: 'a1',
        dependency_asset_id: 'a2',
        dependency_type: 'reference',
      });

      expect(result).toEqual(mockDependency);
    });

    it('should list asset dependencies', async () => {
      const mockDependencies = [
        { id: '1', asset_id: 'a1', dependency_asset_id: 'a2' },
      ];

      vi.mocked(queryReplica).mockResolvedValue({
        rows: mockDependencies,
      } as any);

      const result = await assetOps.listAssetDependencies('a1');
      expect(result).toEqual(mockDependencies);
    });

    it('should delete asset dependency', async () => {
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      await assetOps.deleteAssetDependency('1');
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM slate_asset_dependencies'),
        ['1']
      );
    });
  });

  describe('getAssetWithComponents', () => {
    it('should get asset with components and dependencies', async () => {
      const mockAsset = { id: '1', name: 'test.prefab' };
      const mockComponents = [{ id: 'c1', component_type: 'Transform' }];
      const mockDependencies = [{ id: 'd1', dependency_asset_id: 'a2' }];

      vi.mocked(query).mockResolvedValue({
        rows: [mockAsset],
      } as any);
      vi.mocked(queryReplica)
        .mockResolvedValueOnce({ rows: mockComponents } as any)
        .mockResolvedValueOnce({ rows: mockDependencies } as any);

      const result = await assetOps.getAssetWithComponents('1');
      expect(result?.components).toEqual(mockComponents);
      expect(result?.dependencies).toEqual(mockDependencies);
    });
  });
});

