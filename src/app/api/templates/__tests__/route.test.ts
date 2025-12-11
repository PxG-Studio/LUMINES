import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';

// Mock template queries
vi.mock('@/lib/db/queries', () => ({
  templateQueries: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  },
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
      const { templateQueries } = await import('@/lib/db/queries');
      const mockTemplates = [
        { id: '1', name: 'Unity Basic', type: 'unity' },
        { id: '2', name: 'Godot Basic', type: 'godot' },
      ];

      vi.mocked(templateQueries.findAll).mockResolvedValue(mockTemplates as any);

      const request = new NextRequest('http://localhost:3000/api/templates');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockTemplates);
    });

    it('should handle empty templates list', async () => {
      const { templateQueries } = await import('@/lib/db/queries');
      vi.mocked(templateQueries.findAll).mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/templates');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should return 500 when database operation fails', async () => {
      const { templateQueries } = await import('@/lib/db/queries');
      vi.mocked(templateQueries.findAll).mockRejectedValue(new Error('Database error'));

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
        type: 'unity',
        content: 'template content',
      };

      vi.mocked(templateQueries.create).mockResolvedValue(mockTemplate as any);

      const request = new NextRequest('http://localhost:3000/api/templates', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Template',
          type: 'unity',
          content: 'template content',
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
      vi.mocked(templateQueries.create).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/templates', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Template',
          type: 'unity',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
