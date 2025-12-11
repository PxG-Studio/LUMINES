import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from '../route';
import * as projectOps from '@/lib/database/operations/projects';

// Mock the database operations
vi.mock('@/lib/database/operations/projects', () => ({
  getProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}));

describe('Projects [id] API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/projects/[id]', () => {
    it('should return project when found', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'Test Project',
        description: 'Test description',
      };

      vi.mocked(projectOps.getProject).mockResolvedValue(mockProject as any);

      const request = new NextRequest('http://localhost:3000/api/projects/1');
      const response = await GET(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockProject);
      expect(projectOps.getProject).toHaveBeenCalledWith('1');
    });

    it('should return 404 when project not found', async () => {
      vi.mocked(projectOps.getProject).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/projects/nonexistent');
      const response = await GET(request, { params: { id: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Project not found');
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(projectOps.getProject).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/projects/1');
      const response = await GET(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch project');
    });
  });

  describe('PUT /api/projects/[id]', () => {
    it('should update project with valid data', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'Updated Project',
        description: 'Updated description',
      };

      vi.mocked(projectOps.updateProject).mockResolvedValue(mockProject as any);

      const request = new NextRequest('http://localhost:3000/api/projects/1', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Project',
          description: 'Updated description',
        }),
      });

      const response = await PUT(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockProject);
      expect(projectOps.updateProject).toHaveBeenCalledWith('1', {
        name: 'Updated Project',
        description: 'Updated description',
      });
    });

    it('should update project with partial data', async () => {
      const mockProject = {
        id: '1',
        name: 'Updated Name',
      };

      vi.mocked(projectOps.updateProject).mockResolvedValue(mockProject as any);

      const request = new NextRequest('http://localhost:3000/api/projects/1', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Name',
        }),
      });

      const response = await PUT(request, { params: { id: '1' } });
      expect(response.status).toBe(200);
    });

    it('should return 404 when project not found', async () => {
      vi.mocked(projectOps.updateProject).mockRejectedValue(new Error('Project not found'));

      const request = new NextRequest('http://localhost:3000/api/projects/nonexistent', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated',
        }),
      });

      const response = await PUT(request, { params: { id: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Project not found');
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(projectOps.updateProject).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/projects/1', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated',
        }),
      });

      const response = await PUT(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update project');
    });
  });

  describe('DELETE /api/projects/[id]', () => {
    it('should delete project successfully', async () => {
      vi.mocked(projectOps.deleteProject).mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/projects/1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(projectOps.deleteProject).toHaveBeenCalledWith('1');
    });

    it('should return 404 when project not found', async () => {
      vi.mocked(projectOps.deleteProject).mockRejectedValue(new Error('Project not found'));

      const request = new NextRequest('http://localhost:3000/api/projects/nonexistent', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Project not found');
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(projectOps.deleteProject).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/projects/1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to delete project');
    });
  });
});
