/**
 * Performance and Load Tests
 * Tests for response times, throughput, and resource usage
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

// Performance thresholds
const THRESHOLDS = {
  healthCheck: 200, // ms
  apiResponse: 500, // ms
  pageLoad: 2000, // ms
  throughput: 100, // requests/second
};

test.describe('Performance Tests', () => {
  test('health endpoint should respond quickly', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(`${API_BASE}/health`);
    const duration = Date.now() - startTime;

    expect(response.ok()).toBeTruthy();
    expect(duration).toBeLessThan(THRESHOLDS.healthCheck);
  });

  test('metrics endpoint should respond quickly', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(`${API_BASE}/metrics`);
    const duration = Date.now() - startTime;

    expect(response.ok()).toBeTruthy();
    expect(duration).toBeLessThan(THRESHOLDS.apiResponse);
  });

  test('home page should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(THRESHOLDS.pageLoad);
  });

  test('concurrent requests should handle load', async ({ request }) => {
    const concurrentRequests = 50;
    const startTime = Date.now();

    const promises = Array.from({ length: concurrentRequests }, () =>
      request.get(`${API_BASE}/health`)
    );

    const responses = await Promise.all(promises);
    const duration = Date.now() - startTime;

    // All requests should succeed
    responses.forEach(response => {
      expect(response.ok()).toBeTruthy();
    });

    // Calculate throughput
    const throughput = (concurrentRequests / duration) * 1000;
    expect(throughput).toBeGreaterThan(THRESHOLDS.throughput);
  });

  test('API should handle sustained load', async ({ request }) => {
    const requests = 100;
    const startTime = Date.now();
    const durations: number[] = [];

    for (let i = 0; i < requests; i++) {
      const reqStart = Date.now();
      const response = await request.get(`${API_BASE}/health`);
      const reqDuration = Date.now() - reqStart;
      
      expect(response.ok()).toBeTruthy();
      durations.push(reqDuration);
    }

    const totalDuration = Date.now() - startTime;
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const p95Duration = durations.sort((a, b) => a - b)[Math.floor(durations.length * 0.95)];

    // Average should be reasonable
    expect(avgDuration).toBeLessThan(THRESHOLDS.apiResponse);
    
    // P95 should be reasonable
    expect(p95Duration).toBeLessThan(THRESHOLDS.apiResponse * 2);
  });

  test('rate limiting should not degrade performance', async ({ request }) => {
    // Make requests up to but not exceeding rate limit
    const requests = 90; // Below 100 limit
    const startTime = Date.now();

    const promises = Array.from({ length: requests }, () =>
      request.get(`${API_BASE}/health`)
    );

    const responses = await Promise.all(promises);
    const duration = Date.now() - startTime;

    // All should succeed
    responses.forEach(response => {
      expect(response.ok()).toBeTruthy();
    });

    // Should complete in reasonable time
    expect(duration).toBeLessThan(5000); // 5 seconds for 90 requests
  });
});

