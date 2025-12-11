import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import * as projectOps from '@/lib/database/operations/projects';

// Mock the database operations
vi.mock('@/lib/database/operations/projects', () => ({
  listProjects: vi.fn(),
  createProject: vi.fn(),
}));

describe('Projects API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/projects', () => {
    it('should return projects for valid userId', async () => {
      const mockProjects = [
        { id: '1', user_id: 'user1', name: 'Project 1', description: 'Test', metadata: {} },
        { id: '2', user_id: 'user1', name: 'Project 2', description: 'Test', metadata: {} },
      ];

      vi.mocked(projectOps.listProjects).mockResolvedValue(mockProjects as any);

      const request = new NextRequest('http://localhost:3000/api/projects?userId=user1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockProjects);
      expect(projectOps.listProjects).toHaveBeenCalledWith('user1');
    });

    it('should return 400 when userId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/projects');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('userId query parameter is required');
      expect(projectOps.listProjects).not.toHaveBeenCalled();
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(projectOps.listProjects).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/projects?userId=user1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch projects');
    });

    it('should handle empty projects list', async () => {
      vi.mocked(projectOps.listProjects).mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/projects?userId=user1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should handle special characters in userId', async () => {
      const userId = 'user@test.com';
      vi.mocked(projectOps.listProjects).mockResolvedValue([]);

      const request = new NextRequest(`http://localhost:3000/api/projects?userId=${encodeURIComponent(userId)}`);
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(projectOps.listProjects).toHaveBeenCalledWith(userId);
    });
  });

  describe('POST /api/projects', () => {
    it('should create project with valid data', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'New Project',
        description: 'Test project',
        metadata: {},
      };

      vi.mocked(projectOps.createProject).mockResolvedValue(mockProject as any);

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          user_id: 'user1',
          name: 'New Project',
          description: 'Test project',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockProject);
      expect(projectOps.createProject).toHaveBeenCalledWith({
        user_id: 'user1',
        name: 'New Project',
        description: 'Test project',
        metadata: {},
      });
    });

    it('should create project without description', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'New Project',
        description: null,
        metadata: {},
      };

      vi.mocked(projectOps.createProject).mockResolvedValue(mockProject as any);

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          user_id: 'user1',
          name: 'New Project',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(projectOps.createProject).toHaveBeenCalledWith({
        user_id: 'user1',
        name: 'New Project',
        description: null,
        metadata: {},
      });
    });

    it('should return 400 when user_id is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Project',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('user_id and name are required');
      expect(projectOps.createProject).not.toHaveBeenCalled();
    });

    it('should return 400 when name is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          user_id: 'user1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('user_id and name are required');
      expect(projectOps.createProject).not.toHaveBeenCalled();
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(projectOps.createProject).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          user_id: 'user1',
          name: 'New Project',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create project');
    });

    it('should handle custom metadata', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'New Project',
        description: null,
        metadata: { custom: 'value' },
      };

      vi.mocked(projectOps.createProject).mockResolvedValue(mockProject as any);

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          user_id: 'user1',
          name: 'New Project',
          metadata: { custom: 'value' },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(projectOps.createProject).toHaveBeenCalledWith({
        user_id: 'user1',
        name: 'New Project',
        description: null,
        metadata: { custom: 'value' },
      });
    });

    it('should handle very long project names', async () => {
      const longName = 'a'.repeat(1000);
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: longName,
        description: null,
        metadata: {},
      };

      vi.mocked(projectOps.createProject).mockResolvedValue(mockProject as any);

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          user_id: 'user1',
          name: longName,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should handle special characters in project name', async () => {
      const specialName = 'Project@#$%^&*()';
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: specialName,
        description: null,
        metadata: {},
      };

      vi.mocked(projectOps.createProject).mockResolvedValue(mockProject as any);

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          user_id: 'user1',
          name: specialName,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should handle invalid JSON body', async () => {
      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: 'invalid json',
      });

      // Next.js request.json() will throw, which gets caught and returns 500
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create project');
    });

    it('should handle empty body', async () => {
      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('user_id and name are required');
    });
  });
});

