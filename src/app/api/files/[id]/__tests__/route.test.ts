import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from '../route';
import * as fileOps from '@/lib/database/operations/files';

// Mock the database operations
vi.mock('@/lib/database/operations/files', () => ({
  getFile: vi.fn(),
  updateFile: vi.fn(),
  deleteFile: vi.fn(),
}));

describe('Files [id] API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/files/[id]', () => {
    it('should return file when found', async () => {
      const mockFile = {
        id: '1',
        project_id: 'proj1',
        path: 'src/Main.cs',
        content: 'using System;',
        type: 'file',
      };

      vi.mocked(fileOps.getFile).mockResolvedValue(mockFile as any);

      const request = new NextRequest('http://localhost:3000/api/files/1');
      const response = await GET(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockFile);
      expect(fileOps.getFile).toHaveBeenCalledWith('1');
    });

    it('should return 404 when file not found', async () => {
      vi.mocked(fileOps.getFile).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/files/nonexistent');
      const response = await GET(request, { params: { id: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('File not found');
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(fileOps.getFile).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/files/1');
      const response = await GET(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch file');
    });
  });

  describe('PUT /api/files/[id]', () => {
    it('should update file with valid data', async () => {
      const mockFile = {
        id: '1',
        project_id: 'proj1',
        path: 'src/Main.cs',
        content: 'updated content',
        type: 'file',
      };

      vi.mocked(fileOps.updateFile).mockResolvedValue(mockFile as any);

      const request = new NextRequest('http://localhost:3000/api/files/1', {
        method: 'PUT',
        body: JSON.stringify({
          content: 'updated content',
          path: 'src/Main.cs',
          type: 'file',
        }),
      });

      const response = await PUT(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockFile);
      expect(fileOps.updateFile).toHaveBeenCalledWith('1', {
        content: 'updated content',
        path: 'src/Main.cs',
        type: 'file',
      });
    });

    it('should update file with partial data', async () => {
      const mockFile = {
        id: '1',
        project_id: 'proj1',
        path: 'src/Main.cs',
        content: 'new content',
        type: 'file',
      };

      vi.mocked(fileOps.updateFile).mockResolvedValue(mockFile as any);

      const request = new NextRequest('http://localhost:3000/api/files/1', {
        method: 'PUT',
        body: JSON.stringify({
          content: 'new content',
        }),
      });

      const response = await PUT(request, { params: { id: '1' } });
      expect(response.status).toBe(200);
    });

    it('should return 404 when file not found', async () => {
      vi.mocked(fileOps.updateFile).mockRejectedValue(new Error('File not found'));

      const request = new NextRequest('http://localhost:3000/api/files/nonexistent', {
        method: 'PUT',
        body: JSON.stringify({
          content: 'content',
        }),
      });

      const response = await PUT(request, { params: { id: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('File not found');
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(fileOps.updateFile).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/files/1', {
        method: 'PUT',
        body: JSON.stringify({
          content: 'content',
        }),
      });

      const response = await PUT(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update file');
    });
  });

  describe('DELETE /api/files/[id]', () => {
    it('should delete file successfully', async () => {
      vi.mocked(fileOps.deleteFile).mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/files/1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(fileOps.deleteFile).toHaveBeenCalledWith('1');
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(fileOps.deleteFile).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/files/1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to delete file');
    });
  });
});
