import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { buildQueries } from '@/lib/db/queries';

// Mock dependencies
vi.mock('@/lib/db/queries', () => ({
  buildQueries: {
    findByProjectId: vi.fn(),
    create: vi.fn(),
  },
  eventQueries: {
    create: vi.fn(),
  },
}));

vi.mock('@/lib/events/publishers', () => ({
  buildEvents: {
    created: vi.fn(),
  },
}));

vi.mock('@/lib/db/client', () => ({
  prisma: {
    build: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe('Builds API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/builds', () => {
    it('should return builds for valid projectId', async () => {
      const mockBuilds = [
        { id: '1', projectId: 'proj1', status: 'completed', target: 'webgl' },
        { id: '2', projectId: 'proj1', status: 'building', target: 'webgl' },
      ];

      vi.mocked(buildQueries.findByProjectId).mockResolvedValue(mockBuilds as any);

      const request = new NextRequest('http://localhost:3000/api/builds?projectId=proj1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockBuilds);
      expect(buildQueries.findByProjectId).toHaveBeenCalledWith('proj1');
    });

    it('should handle pagination', async () => {
      const { prisma } = await import('@/lib/db/client');
      const mockBuilds = [
        { id: '1', projectId: 'proj1', status: 'completed' },
      ];

      vi.mocked(prisma.build.count).mockResolvedValue(10);
      vi.mocked(prisma.build.findMany).mockResolvedValue(mockBuilds as any);

      const request = new NextRequest('http://localhost:3000/api/builds?page=1&limit=5');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockBuilds);
    });

    it('should handle filtering by status', async () => {
      const { prisma } = await import('@/lib/db/client');
      const mockBuilds = [
        { id: '1', projectId: 'proj1', status: 'completed' },
      ];

      vi.mocked(prisma.build.count).mockResolvedValue(1);
      vi.mocked(prisma.build.findMany).mockResolvedValue(mockBuilds as any);

      const request = new NextRequest('http://localhost:3000/api/builds?filter[status]=completed');
      const response = await GET(request);

      expect(response.status).toBe(200);
    });

    it('should return 400 for invalid filter parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/builds?filter[invalidField]=value');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid filter parameters');
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(buildQueries.findByProjectId).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/builds?projectId=proj1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/builds', () => {
    it('should create build with valid data', async () => {
      const mockBuild = {
        id: '1',
        projectId: 'proj1',
        userId: 'user1',
        target: 'webgl',
        configuration: 'development',
        status: 'pending',
      };

      vi.mocked(buildQueries.create).mockResolvedValue(mockBuild as any);

      const request = new NextRequest('http://localhost:3000/api/builds', {
        method: 'POST',
        body: JSON.stringify({
          projectId: 'proj1',
          userId: 'user1',
          target: 'webgl',
          configuration: 'development',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockBuild);
    });

    it('should use default values when optional fields missing', async () => {
      const mockBuild = {
        id: '1',
        projectId: 'proj1',
        userId: 'user1',
        target: 'webgl',
        configuration: 'development',
      };

      vi.mocked(buildQueries.create).mockResolvedValue(mockBuild as any);

      const request = new NextRequest('http://localhost:3000/api/builds', {
        method: 'POST',
        body: JSON.stringify({
          projectId: 'proj1',
          userId: 'user1',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should return 400 when projectId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/builds', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });

    it('should return 400 when userId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/builds', {
        method: 'POST',
        body: JSON.stringify({
          projectId: 'proj1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(buildQueries.create).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/builds', {
        method: 'POST',
        body: JSON.stringify({
          projectId: 'proj1',
          userId: 'user1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
