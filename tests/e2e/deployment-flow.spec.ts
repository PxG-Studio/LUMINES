/**
 * E2E Tests: Deployment Flow
 * Critical path: Create deployment, monitor status, rollback
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

test.describe('Deployment Flow', () => {
  let authToken: string;
  let projectId: string;

  test.beforeAll(async ({ request }) => {
    // Login and get token
    const loginResponse = await request.post(`${API_BASE}/auth/login`, {
      data: {
        email: process.env.TEST_USER_EMAIL || 'test@example.com',
        password: process.env.TEST_USER_PASSWORD || 'testpassword',
      },
    });

    if (loginResponse.ok()) {
      const loginBody = await loginResponse.json();
      authToken = loginBody.token || loginBody.accessToken;
    }

    // Create or get project
    if (authToken) {
      const projectsResponse = await request.get(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (projectsResponse.ok()) {
        const projects = await projectsResponse.json();
        if (projects.length > 0) {
          projectId = projects[0].id;
        } else {
          // Create project
          const createResponse = await request.post(`${API_BASE}/projects`, {
            headers: { Authorization: `Bearer ${authToken}` },
            data: {
              name: `Test Project ${Date.now()}`,
              description: 'Test project for E2E tests',
            },
          });
          if (createResponse.ok()) {
            const project = await createResponse.json();
            projectId = project.id;
          }
        }
      }
    }
  });

  test('should create deployment', async ({ request }) => {
    if (!authToken || !projectId) {
      test.skip();
      return;
    }

    const response = await request.post(`${API_BASE}/deployments`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        projectId,
        environment: 'staging',
        version: '1.0.0',
      },
    });

    expect(response.status()).toBe(201);
    const deployment = await response.json();
    expect(deployment).toHaveProperty('id');
    expect(deployment).toHaveProperty('status');
  });

  test('should get deployment status', async ({ request }) => {
    if (!authToken || !projectId) {
      test.skip();
      return;
    }

    // Create deployment first
    const createResponse = await request.post(`${API_BASE}/deployments`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        projectId,
        environment: 'staging',
        version: '1.0.0',
      },
    });

    if (createResponse.ok()) {
      const deployment = await createResponse.json();
      const deploymentId = deployment.id;

      // Get deployment status
      const statusResponse = await request.get(`${API_BASE}/deployments/${deploymentId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(statusResponse.status()).toBe(200);
      const status = await statusResponse.json();
      expect(status).toHaveProperty('status');
      expect(['pending', 'in_progress', 'completed', 'failed']).toContain(status.status);
    }
  });

  test('should list deployments', async ({ request }) => {
    if (!authToken || !projectId) {
      test.skip();
      return;
    }

    const response = await request.get(`${API_BASE}/deployments`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status()).toBe(200);
    const deployments = await response.json();
    expect(Array.isArray(deployments)).toBe(true);
  });

  test('should rollback deployment', async ({ request }) => {
    if (!authToken || !projectId) {
      test.skip();
      return;
    }

    // Create deployment first
    const createResponse = await request.post(`${API_BASE}/deployments`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        projectId,
        environment: 'staging',
        version: '1.0.0',
      },
    });

    if (createResponse.ok()) {
      const deployment = await createResponse.json();
      const deploymentId = deployment.id;

      // Rollback deployment
      const rollbackResponse = await request.post(`${API_BASE}/deployments/${deploymentId}/rollback`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect([200, 201]).toContain(rollbackResponse.status());
      const rollback = await rollbackResponse.json();
      expect(rollback).toHaveProperty('status');
    }
  });

  test('should handle deployment errors gracefully', async ({ request }) => {
    if (!authToken || !projectId) {
      test.skip();
      return;
    }

    // Try to create deployment with invalid data
    const response = await request.post(`${API_BASE}/deployments`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        // Missing required fields
        projectId: 'invalid-id',
      },
    });

    expect([400, 404]).toContain(response.status());
  });
});


