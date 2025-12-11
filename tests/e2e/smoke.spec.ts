/**
 * Smoke Tests for Staging Deployment
 * Quick validation tests to verify basic functionality after deployment
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

test.describe('Smoke Tests - Staging Deployment', () => {
  test('should have health endpoint responding', async ({ request }) => {
    const response = await request.get(`${API_BASE}/health`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('status');
    expect(body.status).toBe('healthy');
  });

  test('should have database health endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE}/health/db`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty('status');
  });

  test('should have metrics endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE}/metrics`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('# HELP');
    expect(body).toContain('# TYPE');
  });

  test('should serve home page', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/LUMINES|LumenForge/i);
  });

  test('should have API base responding', async ({ request }) => {
    const response = await request.get(API_BASE);
    // API base might return 404 or redirect, but should not be 500
    expect(response.status()).not.toBe(500);
  });

  test('should handle authentication endpoints', async ({ request }) => {
    // Test that auth endpoints exist (even if they require credentials)
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: { email: 'test@example.com', password: 'test' }
    });
    // Should return 401 (unauthorized) not 500 (server error)
    expect([200, 401, 400]).toContain(response.status());
  });

  test('should have response time < 1s', async ({ request }) => {
    const start = Date.now();
    await request.get(`${API_BASE}/health`);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000);
  });
});
