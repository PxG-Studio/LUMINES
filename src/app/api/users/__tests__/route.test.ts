import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';

// Mock user queries
vi.mock('@/lib/db/queries', () => ({
  userQueries: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  },
}));

describe('Users API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const { userQueries } = await import('@/lib/db/queries');
      const mockUsers = [
        { id: '1', email: 'user1@example.com', name: 'User 1' },
        { id: '2', email: 'user2@example.com', name: 'User 2' },
      ];

      vi.mocked(userQueries.findAll).mockResolvedValue(mockUsers as any);

      const request = new NextRequest('http://localhost:3000/api/users');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockUsers);
    });

    it('should handle empty users list', async () => {
      const { userQueries } = await import('@/lib/db/queries');
      vi.mocked(userQueries.findAll).mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/users');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should return 500 when database operation fails', async () => {
      const { userQueries } = await import('@/lib/db/queries');
      vi.mocked(userQueries.findAll).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/users');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/users', () => {
    it('should create user with valid data', async () => {
      const { userQueries } = await import('@/lib/db/queries');
      const mockUser = {
        id: '1',
        email: 'newuser@example.com',
        name: 'New User',
      };

      vi.mocked(userQueries.create).mockResolvedValue(mockUser as any);

      const request = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify({
          email: 'newuser@example.com',
          name: 'New User',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockUser);
    });

    it('should return 400 when validation fails', async () => {
      const request = new NextRequest('http://localhost:3000/api/users', {
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
      const { userQueries } = await import('@/lib/db/queries');
      vi.mocked(userQueries.create).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          name: 'User',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
