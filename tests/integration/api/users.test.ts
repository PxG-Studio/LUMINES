/**
 * Users API Integration Tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db/client';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

describe('Users API', () => {
  let testUserId: string;
  let testUserEmail: string;

  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        roles: ['user'],
      },
    });
    testUserId = user.id;
    testUserEmail = user.email;
  });

  afterAll(async () => {
    // Cleanup
    if (testUserId) {
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
  });

  describe('GET /api/users', () => {
    it('should return paginated users list', async () => {
      const response = await fetch(`${baseUrl}/api/users?page=1&limit=10`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.pagination).toHaveProperty('page');
      expect(data.pagination).toHaveProperty('limit');
      expect(data.pagination).toHaveProperty('total');
    });

    it('should filter users by email', async () => {
      const response = await fetch(`${baseUrl}/api/users?email=${encodeURIComponent(testUserEmail)}`);
      
      expect(response.status).toBe(200);
      const user = await response.json();
      
      expect(user).toHaveProperty('email', testUserEmail);
    });

    it('should support pagination', async () => {
      const response = await fetch(`${baseUrl}/api/users?page=1&limit=5`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(5);
      expect(data.data.length).toBeLessThanOrEqual(5);
    });

    it('should support sorting', async () => {
      const response = await fetch(`${baseUrl}/api/users?sort=createdAt&order=desc`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      if (data.data.length > 1) {
        const dates = data.data.map((u: any) => new Date(u.createdAt).getTime());
        expect(dates).toEqual([...dates].sort((a, b) => b - a));
      }
    });

    it('should include pagination headers', async () => {
      const response = await fetch(`${baseUrl}/api/users?page=1&limit=10`);
      
      expect(response.headers.get('X-Page')).toBe('1');
      expect(response.headers.get('X-Limit')).toBe('10');
      expect(response.headers.get('X-Total')).toBeTruthy();
    });

    it('should include security headers', async () => {
      const response = await fetch(`${baseUrl}/api/users?page=1&limit=10`);
      
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('X-API-Version')).toBeTruthy();
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newEmail = `test-create-${Date.now()}@example.com`;
      const response = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newEmail,
          name: 'New Test User',
          roles: ['user'],
        }),
      });

      expect(response.status).toBe(201);
      const user = await response.json();
      
      expect(user).toHaveProperty('id');
      expect(user.email).toBe(newEmail);

      // Cleanup
      await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
    });

    it('should reject duplicate email', async () => {
      const response = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUserEmail,
          name: 'Duplicate User',
          roles: ['user'],
        }),
      });

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    it('should validate input', async () => {
      const response = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'invalid-email',
          name: 'Test',
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });
  });
});

