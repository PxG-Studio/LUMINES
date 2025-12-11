import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { componentQueries } from '@/lib/db/queries';

// Mock dependencies
vi.mock('@/lib/db/queries', () => ({
  componentQueries: {
    findByProjectId: vi.fn(),
    create: vi.fn(),
  },
  eventQueries: {
    create: vi.fn(),
  },
}));

vi.mock('@/lib/events/publishers', () => ({
  componentEvents: {
    created: vi.fn(),
  },
}));

vi.mock('@/lib/db/client', () => ({
  prisma: {
    component: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe('Components API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/components', () => {
    it('should return components for valid projectId', async () => {
      const mockComponents = [
        { id: '1', projectId: 'proj1', name: 'PlayerController', type: 'script' },
        { id: '2', projectId: 'proj1', name: 'EnemyAI', type: 'script' },
      ];

      vi.mocked(componentQueries.findByProjectId).mockResolvedValue(mockComponents as any);

      const request = new NextRequest('http://localhost:3000/api/components?projectId=proj1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockComponents);
      expect(componentQueries.findByProjectId).toHaveBeenCalledWith('proj1');
    });

    it('should handle pagination', async () => {
      const { prisma } = await import('@/lib/db/client');
      const mockComponents = [
        { id: '1', projectId: 'proj1', name: 'Component1' },
      ];

      vi.mocked(prisma.component.count).mockResolvedValue(10);
      vi.mocked(prisma.component.findMany).mockResolvedValue(mockComponents as any);

      const request = new NextRequest('http://localhost:3000/api/components?page=1&limit=5');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockComponents);
    });

    it('should handle filtering by type', async () => {
      const { prisma } = await import('@/lib/db/client');
      const mockComponents = [
        { id: '1', projectId: 'proj1', name: 'Component1', type: 'script' },
      ];

      vi.mocked(prisma.component.count).mockResolvedValue(1);
      vi.mocked(prisma.component.findMany).mockResolvedValue(mockComponents as any);

      const request = new NextRequest('http://localhost:3000/api/components?filter[type]=script');
      const response = await GET(request);

      expect(response.status).toBe(200);
    });

    it('should return 400 for invalid filter parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/components?filter[invalidField]=value');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid filter parameters');
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(componentQueries.findByProjectId).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/components?projectId=proj1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/components', () => {
    it('should create component with valid data', async () => {
      const mockComponent = {
        id: '1',
        name: 'PlayerController',
        type: 'script',
        content: 'using UnityEngine;',
        language: 'csharp',
        userId: 'user1',
        projectId: 'proj1',
      };

      vi.mocked(componentQueries.create).mockResolvedValue(mockComponent as any);

      const request = new NextRequest('http://localhost:3000/api/components', {
        method: 'POST',
        body: JSON.stringify({
          name: 'PlayerController',
          type: 'script',
          content: 'using UnityEngine;',
          language: 'csharp',
          userId: 'user1',
          projectId: 'proj1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockComponent);
    });

    it('should use default language when not provided', async () => {
      const mockComponent = {
        id: '1',
        name: 'Component',
        type: 'script',
        language: 'csharp',
      };

      vi.mocked(componentQueries.create).mockResolvedValue(mockComponent as any);

      const request = new NextRequest('http://localhost:3000/api/components', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Component',
          type: 'script',
          userId: 'user1',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should return 400 when name is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/components', {
        method: 'POST',
        body: JSON.stringify({
          type: 'script',
          userId: 'user1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });

    it('should return 400 when type is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/components', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Component',
          userId: 'user1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });

    it('should return 400 when userId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/components', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Component',
          type: 'script',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(componentQueries.create).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/components', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Component',
          type: 'script',
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
