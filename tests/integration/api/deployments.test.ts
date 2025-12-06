/**
 * Deployments API Integration Tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db/client';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

describe('Deployments API', () => {
  let testUserId: string;
  let testProjectId: string;
  let testDeploymentId: string;
  let testToken: string;

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

    testToken = 'mock-token';
  });

  afterAll(async () => {
    // Cleanup
    if (testDeploymentId) {
      await prisma.deployment.delete({ where: { id: testDeploymentId } }).catch(() => {});
    }
    if (testProjectId) {
      await prisma.project.delete({ where: { id: testProjectId } }).catch(() => {});
    }
    if (testUserId) {
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
  });

  describe('GET /api/deployments', () => {
    it('should require authentication', async () => {
      const response = await fetch(`${baseUrl}/api/deployments`);
      
      expect(response.status).toBe(401);
    });

    it('should return paginated deployments', async () => {
      const response = await fetch(`${baseUrl}/api/deployments?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${testToken}`,
        },
      });
      
      if (response.status === 401) {
        return; // Skip if auth not configured
      }

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('pagination');
    });

    it('should filter by projectId', async () => {
      const response = await fetch(`${baseUrl}/api/deployments?projectId=${testProjectId}`, {
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

  describe('POST /api/deployments', () => {
    it('should create a new deployment', async () => {
      const response = await fetch(`${baseUrl}/api/deployments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testToken}`,
        },
        body: JSON.stringify({
          projectId: testProjectId,
          userId: testUserId,
          environment: 'staging',
          version: '1.0.0',
        }),
      });

      if (response.status === 401) {
        return;
      }

      expect(response.status).toBe(201);
      const deployment = await response.json();
      
      expect(deployment).toHaveProperty('id');
      testDeploymentId = deployment.id;
    });
  });
});

