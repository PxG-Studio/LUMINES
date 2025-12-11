import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import * as fileOps from '@/lib/database/operations/files';

// Mock the database operations
vi.mock('@/lib/database/operations/files', () => ({
  listFiles: vi.fn(),
  createFile: vi.fn(),
}));

describe('Files API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/files', () => {
    it('should return files for valid projectId', async () => {
      const mockFiles = [
        { id: '1', project_id: 'proj1', path: 'src/Main.cs', content: 'code', type: 'file', encoding: 'utf-8' },
        { id: '2', project_id: 'proj1', path: 'src/Player.cs', content: 'code', type: 'file', encoding: 'utf-8' },
      ];

      vi.mocked(fileOps.listFiles).mockResolvedValue(mockFiles as any);

      const request = new NextRequest('http://localhost:3000/api/files?projectId=proj1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockFiles);
      expect(fileOps.listFiles).toHaveBeenCalledWith('proj1');
    });

    it('should return 400 when projectId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/files');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('projectId query parameter is required');
      expect(fileOps.listFiles).not.toHaveBeenCalled();
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(fileOps.listFiles).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/files?projectId=proj1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch files');
    });

    it('should handle empty files list', async () => {
      vi.mocked(fileOps.listFiles).mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/files?projectId=proj1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should handle special characters in projectId', async () => {
      const projectId = 'proj@test.com';
      vi.mocked(fileOps.listFiles).mockResolvedValue([]);

      const request = new NextRequest(`http://localhost:3000/api/files?projectId=${encodeURIComponent(projectId)}`);
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(fileOps.listFiles).toHaveBeenCalledWith(projectId);
    });
  });

  describe('POST /api/files', () => {
    it('should create file with valid data', async () => {
      const mockFile = {
        id: '1',
        project_id: 'proj1',
        path: 'src/Main.cs',
        content: 'using System;',
        type: 'file',
        encoding: 'utf-8',
      };

      vi.mocked(fileOps.createFile).mockResolvedValue(mockFile as any);

      const request = new NextRequest('http://localhost:3000/api/files', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          path: 'src/Main.cs',
          content: 'using System;',
          type: 'file',
          encoding: 'utf-8',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockFile);
      expect(fileOps.createFile).toHaveBeenCalledWith({
        project_id: 'proj1',
        path: 'src/Main.cs',
        content: 'using System;',
        type: 'file',
        encoding: 'utf-8',
      });
    });

    it('should create file without content', async () => {
      const mockFile = {
        id: '1',
        project_id: 'proj1',
        path: 'src/Empty.cs',
        content: null,
        type: 'file',
        encoding: 'utf-8',
      };

      vi.mocked(fileOps.createFile).mockResolvedValue(mockFile as any);

      const request = new NextRequest('http://localhost:3000/api/files', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          path: 'src/Empty.cs',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(fileOps.createFile).toHaveBeenCalledWith({
        project_id: 'proj1',
        path: 'src/Empty.cs',
        content: null,
        type: null,
        encoding: 'utf-8',
      });
    });

    it('should return 400 when project_id is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/files', {
        method: 'POST',
        body: JSON.stringify({
          path: 'src/Main.cs',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('project_id and path are required');
      expect(fileOps.createFile).not.toHaveBeenCalled();
    });

    it('should return 400 when path is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/files', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('project_id and path are required');
      expect(fileOps.createFile).not.toHaveBeenCalled();
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(fileOps.createFile).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/files', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          path: 'src/Main.cs',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create file');
    });

    it('should handle very long file paths', async () => {
      const longPath = 'src/' + 'deep/'.repeat(100) + 'file.cs';
      const mockFile = {
        id: '1',
        project_id: 'proj1',
        path: longPath,
        content: null,
        type: 'file',
        encoding: 'utf-8',
      };

      vi.mocked(fileOps.createFile).mockResolvedValue(mockFile as any);

      const request = new NextRequest('http://localhost:3000/api/files', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          path: longPath,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should handle special characters in path', async () => {
      const specialPath = 'src/file@#$%^&*().cs';
      const mockFile = {
        id: '1',
        project_id: 'proj1',
        path: specialPath,
        content: null,
        type: 'file',
        encoding: 'utf-8',
      };

      vi.mocked(fileOps.createFile).mockResolvedValue(mockFile as any);

      const request = new NextRequest('http://localhost:3000/api/files', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          path: specialPath,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should handle very large file content', async () => {
      const largeContent = 'A'.repeat(1000000); // 1MB
      const mockFile = {
        id: '1',
        project_id: 'proj1',
        path: 'src/Large.cs',
        content: largeContent,
        type: 'file',
        encoding: 'utf-8',
      };

      vi.mocked(fileOps.createFile).mockResolvedValue(mockFile as any);

      const request = new NextRequest('http://localhost:3000/api/files', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          path: 'src/Large.cs',
          content: largeContent,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should handle different encoding types', async () => {
      const mockFile = {
        id: '1',
        project_id: 'proj1',
        path: 'src/Binary.bin',
        content: 'binary data',
        type: 'file',
        encoding: 'base64',
      };

      vi.mocked(fileOps.createFile).mockResolvedValue(mockFile as any);

      const request = new NextRequest('http://localhost:3000/api/files', {
        method: 'POST',
        body: JSON.stringify({
          project_id: 'proj1',
          path: 'src/Binary.bin',
          encoding: 'base64',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
      expect(fileOps.createFile).toHaveBeenCalledWith({
        project_id: 'proj1',
        path: 'src/Binary.bin',
        content: null,
        type: null,
        encoding: 'base64',
      });
    });

    it('should handle empty body', async () => {
      const request = new NextRequest('http://localhost:3000/api/files', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('project_id and path are required');
    });
  });
});
