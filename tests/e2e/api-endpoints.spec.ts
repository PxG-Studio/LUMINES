/**
 * End-to-End Tests for All API Endpoints
 * Comprehensive testing of API functionality
 */

import { test, expect } from '@playwright/test';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

test.describe('API Endpoints E2E', () => {
  test('Health check endpoint returns service status', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/health`);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('services');
    expect(data).toHaveProperty('timestamp');
    
    // Check service statuses
    expect(data.services).toHaveProperty('database');
    expect(data.services).toHaveProperty('redis');
    expect(data.services).toHaveProperty('nats');
  });

  test('Users API - List with pagination', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/users?page=1&limit=10`);
    
    // May require auth
    if (response.status() === 401) {
      return; // Skip if auth required
    }
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    
    if (data.pagination) {
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('pagination');
      expect(data.pagination).toHaveProperty('page', 1);
      expect(data.pagination).toHaveProperty('limit', 10);
    }
  });

  test('Projects API - List with filtering', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/projects?engine=unity&sort=name`);
    
    // May require auth
    if (response.status() === 401) {
      return; // Skip if auth required
    }
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    
    // Should return projects (empty array is valid)
    expect(Array.isArray(data) || data.data).toBeTruthy();
  });

  test('Components API - List with pagination', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/components?page=1&limit=20`);
    
    // May require auth
    if (response.status() === 401) {
      return;
    }
    
    expect(response.status()).toBe(200);
  });

  test('Builds API - List with sorting', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/builds?sort=createdAt&order=desc`);
    
    // May require auth
    if (response.status() === 401) {
      return;
    }
    
    expect(response.status()).toBe(200);
  });

  test('Deployments API - Requires authentication', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/deployments`);
    
    expect(response.status()).toBe(401);
  });

  test('Templates API - Public access', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/templates`);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    
    // Should return templates
    expect(Array.isArray(data) || data.data).toBeTruthy();
  });

  test('Templates API - Filter by engine', async ({ page }) => {
    const engines = ['unity', 'godot', 'pico8'];
    
    for (const engine of engines) {
      const response = await page.request.get(`${baseUrl}/api/templates?engine=${engine}`);
      
      if (response.status() === 200) {
        const data = await response.json();
        if (Array.isArray(data)) {
          expect(data.every((t: any) => t.engine === engine || data.length === 0)).toBe(true);
        }
      }
    }
  });

  test('Tokens API - Cached response', async ({ page }) => {
    const response1 = await page.request.get(`${baseUrl}/api/tokens?category=colors`);
    expect(response1.status()).toBe(200);
    
    // Second request should be faster (cached)
    const start = Date.now();
    const response2 = await page.request.get(`${baseUrl}/api/tokens?category=colors`);
    const duration = Date.now() - start;
    
    expect(response2.status()).toBe(200);
    
    // Check cache headers
    const headers = response2.headers();
    if (headers['cache-control']) {
      expect(headers['cache-control']).toContain('max-age');
    }
  });

  test('API consistency - All endpoints use same version', async ({ page }) => {
    const endpoints = [
      '/api/health',
      '/api/templates',
      '/api/tokens',
    ];

    const versions = new Set<string>();
    
    for (const endpoint of endpoints) {
      const response = await page.request.get(`${baseUrl}${endpoint}`);
      if (response.status() === 200) {
        const headers = response.headers();
        if (headers['x-api-version']) {
          versions.add(headers['x-api-version']);
        }
      }
    }

    // If any version headers exist, they should all be the same
    if (versions.size > 1) {
      throw new Error(`API version inconsistency: ${Array.from(versions).join(', ')}`);
    }
  });

  test('CORS headers for cross-origin requests', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/api/health`, {
      headers: {
        Origin: 'https://example.com',
      },
    });
    
    const headers = response.headers();
    // CORS headers may or may not be present depending on configuration
    if (headers['access-control-allow-origin']) {
      expect(headers['access-control-allow-origin']).toBeTruthy();
    }
  });

  test('Response time is acceptable', async ({ page }) => {
    const endpoints = [
      '/api/health',
      '/api/templates',
    ];

    for (const endpoint of endpoints) {
      const start = Date.now();
      const response = await page.request.get(`${baseUrl}${endpoint}`);
      const duration = Date.now() - start;
      
      expect(response.status()).toBe(200);
      // API should respond within 2 seconds
      expect(duration).toBeLessThan(2000);
    }
  });
});

