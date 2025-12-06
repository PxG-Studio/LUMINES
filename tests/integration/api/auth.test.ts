/**
 * Authentication API Integration Tests
 */

import { describe, it, expect } from 'vitest';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

describe('Authentication API', () => {
  describe('GET /api/auth/verify', () => {
    it('should return 401 for missing token', async () => {
      const response = await fetch(`${baseUrl}/api/auth/verify`);
      
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toHaveProperty('valid', false);
    });

    it('should return 401 for invalid token', async () => {
      const response = await fetch(`${baseUrl}/api/auth/verify`, {
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      });
      
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toHaveProperty('valid', false);
    });

    it('should include security headers', async () => {
      const response = await fetch(`${baseUrl}/api/auth/verify`);
      
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should require refresh token', async () => {
      const response = await fetch(`${baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    it('should validate refresh token format', async () => {
      const response = await fetch(`${baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: 'invalid-token',
        }),
      });

      // Should return 401 for invalid token
      expect([400, 401]).toContain(response.status);
    });
  });
});

