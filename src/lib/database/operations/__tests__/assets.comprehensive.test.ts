import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as assetOps from '../assets';
import { query, queryReplica } from '../../client';

// Mock database client
vi.mock('../../client', () => ({
  query: vi.fn(),
  queryReplica: vi.fn(),
}));

describe('Assets Database Operations - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createAsset', () => {
    it('creates asset with all fields', async () => {
      const mockAsset = {
        id: '1',
        project_id: 'proj1',
        name: 'PlayerSprite',
        type: 'sprite',
        metadata: { width: 64, height: 64 },
        file_path: 'Assets/Sprites/Player.png',
        registry_path: 'Assets/Sprites/Player',
        guid: 'guid-123',
        file_id: 'file-1',
        size: 1024,
        mime_type: 'image/png',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockAsset] } as any);

      const result = await assetOps.createAsset({
        project_id: 'proj1',
        name: 'PlayerSprite',
        type: 'sprite',
        metadata: { width: 64, height: 64 },
        file_path: 'Assets/Sprites/Player.png',
        registry_path: 'Assets/Sprites/Player',
        guid: 'guid-123',
        file_id: 'file-1',
        size: 1024,
        mime_type: 'image/png',
      });

      expect(result).toEqual(mockAsset);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO slate_assets'),
        expect.arrayContaining(['proj1', 'PlayerSprite', 'sprite'])
      );
    });

    it('creates asset with minimal required fields', async () => {
      const mockAsset = {
        id: '1',
        project_id: 'proj1',
        name: 'SimpleAsset',
        type: 'texture',
        metadata: {},
        file_path: null,
        registry_path: null,
        guid: null,
        file_id: null,
        size: 0,
        mime_type: null,
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockAsset] } as any);

      const result = await assetOps.createAsset({
        project_id: 'proj1',
        name: 'SimpleAsset',
        type: 'texture',
      });

      expect(result).toEqual(mockAsset);
    });

    it('handles complex metadata', async () => {
      const complexMetadata = {
        width: 64,
        height: 64,
        format: 'PNG',
        compression: { type: 'DXT1', quality: 'high' },
        tags: ['player', 'character'],
      };

      const mockAsset = {
        id: '1',
        project_id: 'proj1',
        name: 'ComplexAsset',
        type: 'sprite',
        metadata: complexMetadata,
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockAsset] } as any);

      const result = await assetOps.createAsset({
        project_id: 'proj1',
        name: 'ComplexAsset',
        type: 'sprite',
        metadata: complexMetadata,
      });

      expect(result.metadata).toEqual(complexMetadata);
    });
  });

  describe('getAsset', () => {
    it('returns asset when found', async () => {
      const mockAsset = {
        id: '1',
        project_id: 'proj1',
        name: 'Asset',
        type: 'sprite',
        deleted_at: null,
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockAsset] } as any);

      const result = await assetOps.getAsset('1');

      expect(result).toEqual(mockAsset);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM slate_assets'),
        ['1']
      );
    });

    it('returns null when asset not found', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [] } as any);

      const result = await assetOps.getAsset('nonexistent');

      expect(result).toBeNull();
    });

    it('excludes deleted assets', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [] } as any);

      await assetOps.getAsset('deleted-id');

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('deleted_at IS NULL'),
        ['deleted-id']
      );
    });
  });

  describe('listAssets', () => {
    it('returns all assets for project', async () => {
      const mockAssets = [
        { id: '1', project_id: 'proj1', name: 'Asset1', type: 'sprite' },
        { id: '2', project_id: 'proj1', name: 'Asset2', type: 'texture' },
      ];

      vi.mocked(queryReplica).mockResolvedValue({ rows: mockAssets } as any);

      const result = await assetOps.listAssets('proj1');

      expect(result).toEqual(mockAssets);
      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM slate_assets'),
        ['proj1']
      );
    });

    it('returns empty array when no assets', async () => {
      vi.mocked(queryReplica).mockResolvedValue({ rows: [] } as any);

      const result = await assetOps.listAssets('proj1');

      expect(result).toEqual([]);
    });

    it('orders by created_at DESC', async () => {
      vi.mocked(queryReplica).mockResolvedValue({ rows: [] } as any);

      await assetOps.listAssets('proj1');

      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY created_at DESC'),
        ['proj1']
      );
    });

    it('excludes deleted assets', async () => {
      vi.mocked(queryReplica).mockResolvedValue({ rows: [] } as any);

      await assetOps.listAssets('proj1');

      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('deleted_at IS NULL'),
        ['proj1']
      );
    });
  });

  describe('updateAsset', () => {
    it('updates asset name', async () => {
      const updatedAsset = {
        id: '1',
        name: 'UpdatedName',
        type: 'sprite',
      };

      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any) // getAsset check
        .mockResolvedValueOnce({ rows: [updatedAsset] } as any);

      const result = await assetOps.updateAsset('1', { name: 'UpdatedName' });

      expect(result.name).toBe('UpdatedName');
    });

    it('updates asset metadata', async () => {
      const newMetadata = { width: 128, height: 128 };
      const updatedAsset = {
        id: '1',
        metadata: newMetadata,
      };

      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any)
        .mockResolvedValueOnce({ rows: [updatedAsset] } as any);

      const result = await assetOps.updateAsset('1', { metadata: newMetadata });

      expect(result.metadata).toEqual(newMetadata);
    });

    it('updates multiple fields', async () => {
      const updatedAsset = {
        id: '1',
        name: 'NewName',
        type: 'texture',
        file_path: 'new/path.png',
      };

      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any)
        .mockResolvedValueOnce({ rows: [updatedAsset] } as any);

      const result = await assetOps.updateAsset('1', {
        name: 'NewName',
        type: 'texture',
        file_path: 'new/path.png',
      });

      expect(result.name).toBe('NewName');
      expect(result.type).toBe('texture');
    });

    it('returns existing asset when no updates provided', async () => {
      const existingAsset = {
        id: '1',
        name: 'Existing',
        type: 'sprite',
      };

      vi.mocked(query).mockResolvedValue({ rows: [existingAsset] } as any);

      const result = await assetOps.updateAsset('1', {});

      expect(result).toEqual(existingAsset);
    });

    it('throws error when asset not found', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [] } as any);

      await expect(assetOps.updateAsset('nonexistent', { name: 'New' })).rejects.toThrow(
        'Asset not found'
      );
    });
  });

  describe('deleteAsset', () => {
    it('soft deletes asset', async () => {
      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any)
        .mockResolvedValueOnce({ rowCount: 1 } as any);

      const result = await assetOps.deleteAsset('1');

      expect(result).toBe(true);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE slate_assets SET deleted_at'),
        expect.arrayContaining(['1'])
      );
    });

    it('throws error when asset not found', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [] } as any);

      await expect(assetOps.deleteAsset('nonexistent')).rejects.toThrow('Asset not found');
    });
  });
});
