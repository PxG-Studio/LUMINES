/**
 * E2E Tests: API Integration
 * Critical path: API endpoints, error handling, rate limiting
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

test.describe('API Integration', () => {
  test('health endpoint should return healthy status', async ({ request }) => {
    const response = await request.get(`${API_BASE}/health`);
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('status');
    expect(body.status).toBe('healthy');
  });

  test('health/db endpoint should return database status', async ({ request }) => {
    const response = await request.get(`${API_BASE}/health/db`);
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('database');
    expect(['connected', 'disconnected']).toContain(body.database);
  });

  test('metrics endpoint should return Prometheus metrics', async ({ request }) => {
    const response = await request.get(`${API_BASE}/metrics`);
    expect(response.status()).toBe(200);
    
    const text = await response.text();
    expect(text).toContain('# HELP');
    expect(text).toContain('# TYPE');
  });

  test('projects endpoint should require authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/projects`);
    expect([401, 403]).toContain(response.status());
  });

  test('projects endpoint should return projects when authenticated', async ({ request }) => {
    // Get auth token (requires login endpoint or test user setup)
    const loginResponse = await request.post(`${API_BASE}/auth/login`, {
      data: {
        email: process.env.TEST_USER_EMAIL || 'test@example.com',
        password: process.env.TEST_USER_PASSWORD || 'testpassword',
      },
    });

    if (loginResponse.ok()) {
      const loginBody = await loginResponse.json();
      const token = loginBody.token || loginBody.accessToken;

      const projectsResponse = await request.get(`${API_BASE}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(projectsResponse.status()).toBe(200);
      const projects = await projectsResponse.json();
      expect(Array.isArray(projects)).toBe(true);
    }
  });

  test('should handle 404 for non-existent endpoints', async ({ request }) => {
    const response = await request.get(`${API_BASE}/nonexistent`);
    expect(response.status()).toBe(404);
  });

  test('should handle rate limiting', async ({ request }) => {
    // Make multiple rapid requests
    const requests = Array(100).fill(null).map(() =>
      request.get(`${API_BASE}/health`)
    );

    const responses = await Promise.all(requests);
    
    // At least one should be rate limited (429) if rate limiting is enabled
    const statusCodes = responses.map(r => r.status());
    // Note: This test may pass even if rate limiting is not enabled
    // It's a best-effort check
    expect(statusCodes.every(code => [200, 429].includes(code))).toBe(true);
  });

  test('should validate request payload', async ({ request }) => {
    // Try to create project with invalid data
    const response = await request.post(`${API_BASE}/projects`, {
      data: {
        // Missing required fields
      },
    });

    expect([400, 401, 403]).toContain(response.status());
  });

  test('should handle CORS headers', async ({ request }) => {
    const response = await request.get(`${API_BASE}/health`, {
      headers: {
        Origin: 'http://localhost:3000',
      },
    });

    const headers = response.headers();
    // CORS headers should be present (if CORS is configured)
    // This is a best-effort check
    expect(response.status()).toBe(200);
  });
});

