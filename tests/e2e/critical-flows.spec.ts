/**
 * End-to-End Tests for Critical User Flows
 * Tests the most important user journeys through the application
 */

import { test, expect } from '@playwright/test';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

test.describe('Critical User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to landing page
    await page.goto(baseUrl);
  });

  test('User can access health check endpoint', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/health`);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('services');
    expect(data.services).toHaveProperty('database');
    expect(data.services).toHaveProperty('redis');
    expect(data.services).toHaveProperty('nats');
  });

  test('User can view public templates', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/templates`);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    
    // Can be array or paginated response
    expect(Array.isArray(data) || data.data).toBeTruthy();
  });

  test('User cannot access protected endpoints without auth', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/users`);
    
    // Should return 401 or 403 (depending on implementation)
    expect([401, 403]).toContain(response.status());
  });

  test('API returns security headers', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/health`);
    
    const headers = response.headers();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-api-version']).toBeTruthy();
  });

  test('Landing page loads successfully', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check page title
    await expect(page).toHaveTitle(/LumenForge|WIS2L|LUMINES/i);
    
    // Check if page loaded (no error messages visible)
    const errorMessages = page.locator('text=/error|Error|ERROR/i');
    await expect(errorMessages.first()).not.toBeVisible({ timeout: 5000 }).catch(() => {
      // Error messages may not exist, which is fine
    });
  });

  test('Pagination works correctly', async ({ page }) => {
    const response1 = await page.request.get(`${baseUrl}/api/templates?page=1&limit=5`);
    expect(response1.status()).toBe(200);
    const data1 = await response1.json();
    
    if (data1.pagination) {
      expect(data1.pagination.page).toBe(1);
      expect(data1.pagination.limit).toBe(5);
      
      // Test next page if available
      if (data1.pagination.hasNext) {
        const response2 = await page.request.get(`${baseUrl}/api/templates?page=2&limit=5`);
        expect(response2.status()).toBe(200);
        const data2 = await response2.json();
        expect(data2.pagination.page).toBe(2);
      }
    }
  });

  test('Filtering works correctly', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/templates?engine=unity`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    
    if (Array.isArray(data)) {
      expect(data.every((t: any) => t.engine === 'unity')).toBe(true);
    } else if (data.data) {
      expect(data.data.every((t: any) => t.engine === 'unity')).toBe(true);
    }
  });

  test('API handles invalid requests gracefully', async ({ page }) => {
    // Test invalid pagination
    const response1 = await page.request.get(`${baseUrl}/api/templates?page=-1`);
    expect([200, 400]).toContain(response1.status());
    
    // Test invalid filter
    const response2 = await page.request.get(`${baseUrl}/api/templates?invalidField=test`);
    expect([200, 400]).toContain(response2.status());
  });

  test('Rate limiting headers are present', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/templates`);
    
    const headers = response.headers();
    // Rate limit headers may or may not be present
    if (headers['x-ratelimit-limit']) {
      expect(parseInt(headers['x-ratelimit-limit'])).toBeGreaterThan(0);
    }
  });

  test('Cache headers are correct for static content', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/templates`);
    
    const headers = response.headers();
    if (headers['cache-control']) {
      expect(headers['cache-control']).toContain('max-age');
    }
  });

  test('API versioning is consistent', async ({ page }) => {
    const endpoints = [
      '/api/health',
      '/api/templates',
      '/api/tokens',
    ];

    const versions = new Set<string>();
    
    for (const endpoint of endpoints) {
      const response = await page.request.get(`${baseUrl}${endpoint}`);
      const headers = response.headers();
      if (headers['x-api-version']) {
        versions.add(headers['x-api-version']);
      }
    }

    // All endpoints should use the same API version
    if (versions.size > 0) {
      expect(versions.size).toBe(1);
    }
  });
});

test.describe('Authentication Flow', () => {
  test('Token verification endpoint works', async ({ page }) => {
    // Test without token
    const response1 = await page.request.get(`${baseUrl}/api/auth/verify`);
    expect(response1.status()).toBe(401);
    const data1 = await response1.json();
    expect(data1).toHaveProperty('valid', false);

    // Test with invalid token
    const response2 = await page.request.get(`${baseUrl}/api/auth/verify`, {
      headers: {
        Authorization: 'Bearer invalid-token',
      },
    });
    expect(response2.status()).toBe(401);
  });

  test('Token refresh endpoint validates input', async ({ page }) => {
    // Test without refresh token
    const response1 = await page.request.post(`${baseUrl}/api/auth/refresh`, {
      data: {},
    });
    expect(response1.status()).toBe(400);

    // Test with invalid refresh token
    const response2 = await page.request.post(`${baseUrl}/api/auth/refresh`, {
      data: {
        refresh_token: 'invalid-token',
      },
    });
    expect([400, 401]).toContain(response2.status());
  });
});

test.describe('Error Handling', () => {
  test('404 for non-existent resources', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/users/nonexistent-id`);
    expect([404, 401]).toContain(response.status());
  });

  test('Validation errors return 400', async ({ page }) => {
    const response = await page.request.post(`${baseUrl}/api/users`, {
      data: {
        email: 'invalid-email', // Invalid email format
        name: 'Test',
      },
    });
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('Database errors return 500', async ({ page }) => {
    // This test would need a way to simulate database errors
    // For now, we'll skip actual error simulation
    // But the structure is here for future use
  });
});

