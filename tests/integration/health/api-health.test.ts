/**
 * Health Check API Integration Tests
 * Tests the /api/health endpoint
 */

import { describe, it, expect, beforeAll } from 'vitest';

describe('Health Check API', () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await fetch(`${baseUrl}/api/health`);
      
      expect(response.status).toBeOneOf([200, 503]); // 200 if healthy, 503 if degraded/unhealthy
      
      const health = await response.json();
      
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('timestamp');
      expect(health).toHaveProperty('services');
      expect(health.status).toBeOneOf(['ok', 'degraded', 'unhealthy', 'error']);
      
      // Service health checks
      expect(health.services).toHaveProperty('database');
      expect(health.services).toHaveProperty('redis');
      expect(health.services).toHaveProperty('nats');
    });

    it('should include uptime in response', async () => {
      const response = await fetch(`${baseUrl}/api/health`);
      const health = await response.json();
      
      expect(health).toHaveProperty('uptime');
      expect(typeof health.uptime).toBe('number');
    });

    it('should return service-specific status', async () => {
      const response = await fetch(`${baseUrl}/api/health`);
      const health = await response.json();
      
      // Each service should have status and message
      expect(health.services.database).toHaveProperty('status');
      expect(health.services.redis).toHaveProperty('status');
      expect(health.services.nats).toHaveProperty('status');
    });
  });
});

