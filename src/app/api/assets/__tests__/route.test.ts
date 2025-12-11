import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import * as assetOps from '@/lib/database/operations/assets';

// Mock the database operations
vi.mock('@/lib/database/operations/assets', () => ({
  listAssets: vi.fn(),
  createAsset: vi.fn(),
}));

describe('Assets API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/assets', () => {
    it('should return assets for valid projectId', async () => {
      const mockAssets = [
        { id: '1', project_id: 'proj1', name: 'PlayerSprite', type: 'sprite', metadata: {}, guid: 'guid1' },
        { id: '2', project_id: 'proj1', name: 'EnemySprite', type: 'sprite', metadata: {}, guid: 'guid2' },
      ];

      vi.mocked(assetOps.listAssets).mockResolvedValue(mockAssets as any);

      const request = new NextRequest('http://localhost:3000/api/assets?projectId=proj1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockAssets);
      expect(assetOps.listAssets).toHaveBeenCalledWith('proj1');
    });

    it('should return 400 when projectId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/assets');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('projectId query parameter is required');
      expect(assetOps.listAssets).not.toHaveBeenCalled();
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(assetOps.listAssets).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/assets?projectId=proj1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch assets');
    });

    it('should handle empty assets list', async () => {
      vi.mocked(assetOps.listAssets).mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/assets?projectId=proj1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should handle special characters in projectId', async () => {
      const projectId = 'proj@test.com';
      vi.mocked(assetOps.listAssets).mockResolvedValue([]);

      const request = new NextRequest(`http://localhost:3000/api/assets?projectId=${encodeURIComponent(projectId)}`);
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(assetOps.listAssets).toHaveBeenCalledWith(projectId);
    });
  });

  describe('POST /api/assets', () => {
    it('should create asset with valid data', async () => {
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
      };

      vi.mocked(assetOps.createAsset).mockResolvedValue(mockAsset as any);

      const request = new NextRequest('http://localhost:3000/api/assets', {
        method: 'POST',
        body: JSON.stringify({
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
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockAsset);
      expect(assetOps.createAsset).toHaveBeenCalledWith({
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
    });

    it('should create asset with minimal required fields', async () => {
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

      vi.mocked(assetOps.createAsset).mockResolvedValue(mockAsset as any);

      const request = new NextRequest('http://localhost:3000/api/assets', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          name: 'SimpleAsset',
          type: 'texture',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(assetOps.createAsset).toHaveBeenCalledWith({
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
      });
    });

    it('should return 400 when project_id is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/assets', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Asset',
          type: 'sprite',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('project_id, name, and type are required');
      expect(assetOps.createAsset).not.toHaveBeenCalled();
    });

    it('should return 400 when name is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/assets', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          type: 'sprite',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('project_id, name, and type are required');
      expect(assetOps.createAsset).not.toHaveBeenCalled();
    });

    it('should return 400 when type is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/assets', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          name: 'Asset',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('project_id, name, and type are required');
      expect(assetOps.createAsset).not.toHaveBeenCalled();
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(assetOps.createAsset).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/assets', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          name: 'Asset',
          type: 'sprite',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create asset');
    });

    it('should handle very long asset names', async () => {
      const longName = 'A'.repeat(1000);
      const mockAsset = {
        id: '1',
        project_id: 'proj1',
        name: longName,
        type: 'sprite',
        metadata: {},
        file_path: null,
        registry_path: null,
        guid: null,
        file_id: null,
        size: 0,
        mime_type: null,
      };

      vi.mocked(assetOps.createAsset).mockResolvedValue(mockAsset as any);

      const request = new NextRequest('http://localhost:3000/api/assets', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          name: longName,
          type: 'sprite',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should handle special characters in asset name', async () => {
      const specialName = 'Asset@#$%^&*()';
      const mockAsset = {
        id: '1',
        project_id: 'proj1',
        name: specialName,
        type: 'sprite',
        metadata: {},
        file_path: null,
        registry_path: null,
        guid: null,
        file_id: null,
        size: 0,
        mime_type: null,
      };

      vi.mocked(assetOps.createAsset).mockResolvedValue(mockAsset as any);

      const request = new NextRequest('http://localhost:3000/api/assets', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          name: specialName,
          type: 'sprite',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should handle complex metadata', async () => {
      const complexMetadata = {
        width: 64,
        height: 64,
        format: 'PNG',
        compression: { type: 'DXT1', quality: 'high' },
        tags: ['player', 'character', 'sprite'],
        custom: { author: 'John Doe', version: '1.0.0' },
      };

      const mockAsset = {
        id: '1',
        project_id: 'proj1',
        name: 'ComplexAsset',
        type: 'sprite',
        metadata: complexMetadata,
        file_path: null,
        registry_path: null,
        guid: null,
        file_id: null,
        size: 0,
        mime_type: null,
      };

      vi.mocked(assetOps.createAsset).mockResolvedValue(mockAsset as any);

      const request = new NextRequest('http://localhost:3000/api/assets', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          name: 'ComplexAsset',
          type: 'sprite',
          metadata: complexMetadata,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
      expect(assetOps.createAsset).toHaveBeenCalledWith({
        project_id: 'proj1',
        name: 'ComplexAsset',
        type: 'sprite',
        metadata: complexMetadata,
        file_path: null,
        registry_path: null,
        guid: null,
        file_id: null,
        size: 0,
        mime_type: null,
      });
    });

    it('should handle empty body', async () => {
      const request = new NextRequest('http://localhost:3000/api/assets', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('project_id, name, and type are required');
    });
  });
});
