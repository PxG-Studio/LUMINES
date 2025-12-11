import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';

describe('Workspaces API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/workspaces', () => {
    it('should return workspaces for valid userId', async () => {
      const request = new NextRequest('http://localhost:3000/api/workspaces?userId=user1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('userId', 'user1');
    });

    it('should return workspaces without userId filter', async () => {
      const request = new NextRequest('http://localhost:3000/api/workspaces');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it('should return workspaces with proper structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/workspaces?userId=user1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      data.forEach((workspace: any) => {
        expect(workspace).toHaveProperty('id');
        expect(workspace).toHaveProperty('name');
        expect(workspace).toHaveProperty('description');
        expect(workspace).toHaveProperty('projects');
        expect(workspace).toHaveProperty('members');
        expect(workspace).toHaveProperty('storage');
        expect(workspace).toHaveProperty('userId');
      });
    });

    it('should handle special characters in userId', async () => {
      const userId = 'user@test.com';
      const request = new NextRequest(`http://localhost:3000/api/workspaces?userId=${encodeURIComponent(userId)}`);
      const response = await GET(request);

      expect(response.status).toBe(200);
    });

    it('should return consistent workspace data', async () => {
      const request1 = new NextRequest('http://localhost:3000/api/workspaces?userId=user1');
      const response1 = await GET(request1);
      const data1 = await response1.json();

      const request2 = new NextRequest('http://localhost:3000/api/workspaces?userId=user1');
      const response2 = await GET(request2);
      const data2 = await response2.json();

      expect(data1).toEqual(data2);
    });
  });

  describe('POST /api/workspaces', () => {
    it('should create workspace with valid data', async () => {
      const request = new NextRequest('http://localhost:3000/api/workspaces', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Workspace',
          description: 'Test workspace',
          userId: 'user1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('name', 'New Workspace');
      expect(data).toHaveProperty('description', 'Test workspace');
    });

    it('should create workspace without description', async () => {
      const request = new NextRequest('http://localhost:3000/api/workspaces', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Workspace',
          userId: 'user1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('name', 'New Workspace');
    });

    it('should create workspace without userId', async () => {
      const request = new NextRequest('http://localhost:3000/api/workspaces', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Workspace',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('name', 'New Workspace');
    });

    it('should return 400 when name is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/workspaces', {
        method: 'POST',
        body: JSON.stringify({
          description: 'Test workspace',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should return 400 when name is empty string', async () => {
      const request = new NextRequest('http://localhost:3000/api/workspaces', {
        method: 'POST',
        body: JSON.stringify({
          name: '',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should handle very long workspace names', async () => {
      const longName = 'A'.repeat(1000);
      const request = new NextRequest('http://localhost:3000/api/workspaces', {
        method: 'POST',
        body: JSON.stringify({
          name: longName,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should handle special characters in workspace name', async () => {
      const specialName = 'Workspace@#$%^&*()';
      const request = new NextRequest('http://localhost:3000/api/workspaces', {
        method: 'POST',
        body: JSON.stringify({
          name: specialName,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should handle very long descriptions', async () => {
      const longDescription = 'A'.repeat(5000);
      const request = new NextRequest('http://localhost:3000/api/workspaces', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Workspace',
          description: longDescription,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should handle empty body', async () => {
      const request = new NextRequest('http://localhost:3000/api/workspaces', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should handle invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/workspaces', {
        method: 'POST',
        body: 'invalid json',
      });

      // Next.js will handle JSON parsing, but we should test error handling
      await expect(POST(request)).rejects.toThrow();
    });
  });
});
