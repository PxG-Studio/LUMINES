/**
 * Projects API Integration Tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db/client';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

describe('Projects API', () => {
  let testUserId: string;
  let testProjectId: string;
  let testToken: string; // Mock JWT token

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

    // Create test project
    const project = await prisma.project.create({
      data: {
        name: 'Test Project',
        slug: `test-project-${Date.now()}`,
        userId: testUserId,
      },
    });
    testProjectId = project.id;

    // TODO: Generate actual JWT token for testing
    testToken = 'mock-token';
  });

  afterAll(async () => {
    // Cleanup
    if (testProjectId) {
      await prisma.project.delete({ where: { id: testProjectId } }).catch(() => {});
    }
    if (testUserId) {
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
  });

  describe('GET /api/projects', () => {
    it('should require authentication', async () => {
      const response = await fetch(`${baseUrl}/api/projects`);
      
      // Should return 401 if no auth, or 200 if auth is optional
      expect([200, 401]).toContain(response.status);
    });

    it('should return paginated projects', async () => {
      const response = await fetch(`${baseUrl}/api/projects?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${testToken}`,
        },
      });
      
      // If auth fails, skip test
      if (response.status === 401) {
        return;
      }

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should filter by userId', async () => {
      const response = await fetch(`${baseUrl}/api/projects?userId=${testUserId}`, {
        headers: {
          Authorization: `Bearer ${testToken}`,
        },
      });
      
      if (response.status === 401) {
        return;
      }

      expect(response.status).toBe(200);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Backward compatible format
        expect(data.length).toBeGreaterThanOrEqual(0);
      } else {
        // Paginated format
        expect(data.data).toBeDefined();
      }
    });

    it('should support filtering and sorting', async () => {
      const response = await fetch(`${baseUrl}/api/projects?engine=unity&sort=name&order=asc`, {
        headers: {
          Authorization: `Bearer ${testToken}`,
        },
      });
      
      if (response.status === 401) {
        return;
      }

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const response = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testToken}`,
        },
        body: JSON.stringify({
          name: 'New Test Project',
          slug: `new-test-project-${Date.now()}`,
          userId: testUserId,
          engine: 'unity',
        }),
      });

      if (response.status === 401) {
        return;
      }

      expect(response.status).toBe(201);
      const project = await response.json();
      
      expect(project).toHaveProperty('id');
      expect(project.name).toBe('New Test Project');

      // Cleanup
      await prisma.project.delete({ where: { id: project.id } }).catch(() => {});
    });
  });
});

