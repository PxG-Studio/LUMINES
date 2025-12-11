import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';

// Mock template queries
vi.mock('@/lib/db/queries', () => ({
  templateQueries: {
    findAll: vi.fn(),
    findById: vi.fn(),
    findBySlug: vi.fn(),
    create: vi.fn(),
  },
  eventQueries: {
    create: vi.fn(),
  },
}));

// Mock Prisma client
vi.mock('@/lib/db/client', () => ({
  prisma: {
    template: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

// Mock auth middleware
vi.mock('@/lib/middleware', () => ({
  requireAuth: vi.fn().mockResolvedValue({ error: null, request: { user: { id: 'test-user' } } }),
  rateLimit: vi.fn().mockResolvedValue({ error: null }),
}));

describe('Templates API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/templates', () => {
    it('should return all templates', async () => {
      const { prisma } = await import('@/lib/db/client');
      const mockTemplates = [
        { id: '1', name: 'Unity Basic', engine: 'unity' },
        { id: '2', name: 'Godot Basic', engine: 'godot' },
      ];

      vi.mocked(prisma.template.count).mockResolvedValue(2);
      vi.mocked(prisma.template.findMany).mockResolvedValue(mockTemplates as any);

      const request = new NextRequest('http://localhost:3000/api/templates');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockTemplates);
      expect(data.pagination.total).toBe(2);
    });

    it('should handle empty templates list', async () => {
      const { prisma } = await import('@/lib/db/client');
      vi.mocked(prisma.template.count).mockResolvedValue(0);
      vi.mocked(prisma.template.findMany).mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/templates');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
      expect(data.pagination.total).toBe(0);
    });

    it('should return 500 when database operation fails', async () => {
      const { prisma } = await import('@/lib/db/client');
      vi.mocked(prisma.template.count).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/templates');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/templates', () => {
    it('should create template with valid data', async () => {
      const { templateQueries } = await import('@/lib/db/queries');
      const mockTemplate = {
        id: '1',
        name: 'New Template',
        slug: 'new-template',
        engine: 'unity',
        description: 'Test template',
        structure: {},
      };

      vi.mocked(templateQueries.findBySlug).mockResolvedValue(null);
      vi.mocked(templateQueries.create).mockResolvedValue(mockTemplate as any);

      const request = new NextRequest('http://localhost:3000/api/templates', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Template',
          slug: 'new-template',
          engine: 'unity',
          description: 'Test template',
          structure: {},
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockTemplate);
    });

    it('should return 400 when validation fails', async () => {
      const request = new NextRequest('http://localhost:3000/api/templates', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should return 500 when database operation fails', async () => {
      const { templateQueries } = await import('@/lib/db/queries');
      vi.mocked(templateQueries.findBySlug).mockResolvedValue(null);
      vi.mocked(templateQueries.create).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/templates', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Template',
          slug: 'template',
          engine: 'unity',
          structure: {},
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
