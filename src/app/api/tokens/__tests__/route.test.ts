import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { tokenQueries } from '@/lib/db/queries';
import { TokenCache } from '@/lib/cache/services/TokenCache';

// Mock dependencies
vi.mock('@/lib/db/queries', () => ({
  tokenQueries: {
    findByCategory: vi.fn(),
    upsert: vi.fn(),
  },
  eventQueries: {
    create: vi.fn(),
  },
}));

vi.mock('@/lib/events/publishers', () => ({
  tokenEvents: {
    updated: vi.fn(),
  },
}));

vi.mock('@/lib/cache/services/TokenCache', () => ({
  TokenCache: {
    getTokens: vi.fn(),
    cacheTokens: vi.fn(),
    invalidate: vi.fn(),
  },
}));

vi.mock('@/lib/db/client', () => ({
  prisma: {
    designToken: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe('Tokens API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/tokens', () => {
    it('should return cached tokens when available', async () => {
      const mockTokens = [
        { id: '1', name: 'color-primary', category: 'colors', value: '#007bff', group: 'brand' },
        { id: '2', name: 'color-secondary', category: 'colors', value: '#6c757d', group: 'brand' },
      ];

      vi.mocked(TokenCache.getTokens).mockResolvedValue(mockTokens as any);

      const request = new NextRequest('http://localhost:3000/api/tokens?category=colors');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockTokens);
      expect(TokenCache.getTokens).toHaveBeenCalledWith('colors');
      expect(tokenQueries.findByCategory).not.toHaveBeenCalled();
    });

    it('should fetch from database when cache miss', async () => {
      const mockTokens = [
        { id: '1', name: 'color-primary', category: 'colors', value: '#007bff' },
      ];

      vi.mocked(TokenCache.getTokens).mockResolvedValue(null);
      vi.mocked(tokenQueries.findByCategory).mockResolvedValue(mockTokens as any);
      vi.mocked(TokenCache.cacheTokens).mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/tokens?category=colors');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockTokens);
      expect(tokenQueries.findByCategory).toHaveBeenCalledWith('colors');
      expect(TokenCache.cacheTokens).toHaveBeenCalledWith('colors', mockTokens);
    });

    it('should return all tokens when no category specified', async () => {
      const { prisma } = await import('@/lib/db/client');
      const mockTokens = [
        { id: '1', name: 'token1', category: 'colors', value: '#000' },
        { id: '2', name: 'token2', category: 'spacing', value: '16px' },
      ];

      vi.mocked(prisma.designToken.count).mockResolvedValue(2);
      vi.mocked(prisma.designToken.findMany).mockResolvedValue(mockTokens as any);

      const request = new NextRequest('http://localhost:3000/api/tokens');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockTokens);
      expect(data.pagination.total).toBe(2);
    });

    it('should handle pagination', async () => {
      const { prisma } = await import('@/lib/db/client');
      const mockTokens = [
        { id: '1', name: 'token1', category: 'colors', value: '#000' },
      ];

      vi.mocked(prisma.designToken.count).mockResolvedValue(10);
      vi.mocked(prisma.designToken.findMany).mockResolvedValue(mockTokens as any);

      const request = new NextRequest('http://localhost:3000/api/tokens?page=1&limit=5');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockTokens);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(5);
    });

    it('should handle filtering', async () => {
      const { prisma } = await import('@/lib/db/client');
      const mockTokens = [
        { id: '1', name: 'token1', category: 'colors', value: '#000', group: 'brand' },
      ];

      vi.mocked(prisma.designToken.count).mockResolvedValue(1);
      vi.mocked(prisma.designToken.findMany).mockResolvedValue(mockTokens as any);

      const request = new NextRequest('http://localhost:3000/api/tokens?filter[group]=brand');
      const response = await GET(request);

      expect(response.status).toBe(200);
    });

    it('should handle sorting', async () => {
      const { prisma } = await import('@/lib/db/client');
      const mockTokens = [
        { id: '2', name: 'token2', category: 'colors', value: '#fff' },
        { id: '1', name: 'token1', category: 'colors', value: '#000' },
      ];

      vi.mocked(prisma.designToken.count).mockResolvedValue(2);
      vi.mocked(prisma.designToken.findMany).mockResolvedValue(mockTokens as any);

      const request = new NextRequest('http://localhost:3000/api/tokens?sort=name&order=asc');
      const response = await GET(request);

      expect(response.status).toBe(200);
    });

    it('should return 400 for invalid filter parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/tokens?filter[invalidField]=value');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid filter parameters');
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(TokenCache.getTokens).mockResolvedValue(null);
      vi.mocked(tokenQueries.findByCategory).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/tokens?category=colors');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle empty tokens list', async () => {
      vi.mocked(TokenCache.getTokens).mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/tokens?category=colors');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });
  });

  describe('POST /api/tokens', () => {
    it('should create token with valid data', async () => {
      const mockToken = {
        id: '1',
        name: 'color-primary',
        category: 'colors',
        value: '#007bff',
        group: 'brand',
        description: 'Primary brand color',
      };

      vi.mocked(tokenQueries.upsert).mockResolvedValue(mockToken as any);
      vi.mocked(tokenQueries.findByCategory).mockResolvedValue([mockToken] as any);
      vi.mocked(TokenCache.invalidate).mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/tokens', {
        method: 'POST',
        body: JSON.stringify({
          name: 'color-primary',
          category: 'colors',
          value: '#007bff',
          group: 'brand',
          description: 'Primary brand color',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockToken);
      expect(tokenQueries.upsert).toHaveBeenCalled();
      expect(TokenCache.invalidate).toHaveBeenCalledWith('colors');
    });

    it('should create token without optional fields', async () => {
      const mockToken = {
        id: '1',
        name: 'spacing-sm',
        category: 'spacing',
        value: '8px',
        group: null,
        description: null,
      };

      vi.mocked(tokenQueries.upsert).mockResolvedValue(mockToken as any);
      vi.mocked(tokenQueries.findByCategory).mockResolvedValue([mockToken] as any);
      vi.mocked(TokenCache.invalidate).mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/tokens', {
        method: 'POST',
        body: JSON.stringify({
          name: 'spacing-sm',
          category: 'spacing',
          value: '8px',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should return 400 when name is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/tokens', {
        method: 'POST',
        body: JSON.stringify({
          category: 'colors',
          value: '#007bff',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });

    it('should return 400 when category is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/tokens', {
        method: 'POST',
        body: JSON.stringify({
          name: 'color-primary',
          value: '#007bff',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });

    it('should return 400 when value is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/tokens', {
        method: 'POST',
        body: JSON.stringify({
          name: 'color-primary',
          category: 'colors',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });

    it('should return 400 when name is empty string', async () => {
      const request = new NextRequest('http://localhost:3000/api/tokens', {
        method: 'POST',
        body: JSON.stringify({
          name: '',
          category: 'colors',
          value: '#007bff',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(tokenQueries.upsert).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/tokens', {
        method: 'POST',
        body: JSON.stringify({
          name: 'color-primary',
          category: 'colors',
          value: '#007bff',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle very long token names', async () => {
      const longName = 'A'.repeat(1000);
      const mockToken = {
        id: '1',
        name: longName,
        category: 'colors',
        value: '#007bff',
      };

      vi.mocked(tokenQueries.upsert).mockResolvedValue(mockToken as any);
      vi.mocked(tokenQueries.findByCategory).mockResolvedValue([mockToken] as any);
      vi.mocked(TokenCache.invalidate).mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/tokens', {
        method: 'POST',
        body: JSON.stringify({
          name: longName,
          category: 'colors',
          value: '#007bff',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should handle special characters in token value', async () => {
      const specialValue = '#007bff !important; /* comment */';
      const mockToken = {
        id: '1',
        name: 'color-primary',
        category: 'colors',
        value: specialValue,
      };

      vi.mocked(tokenQueries.upsert).mockResolvedValue(mockToken as any);
      vi.mocked(tokenQueries.findByCategory).mockResolvedValue([mockToken] as any);
      vi.mocked(TokenCache.invalidate).mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/tokens', {
        method: 'POST',
        body: JSON.stringify({
          name: 'color-primary',
          category: 'colors',
          value: specialValue,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should invalidate cache after creating token', async () => {
      const mockToken = {
        id: '1',
        name: 'color-primary',
        category: 'colors',
        value: '#007bff',
      };

      vi.mocked(tokenQueries.upsert).mockResolvedValue(mockToken as any);
      vi.mocked(tokenQueries.findByCategory).mockResolvedValue([mockToken] as any);
      vi.mocked(TokenCache.invalidate).mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/tokens', {
        method: 'POST',
        body: JSON.stringify({
          name: 'color-primary',
          category: 'colors',
          value: '#007bff',
        }),
      });

      await POST(request);

      expect(TokenCache.invalidate).toHaveBeenCalledWith('colors');
    });
  });
});
