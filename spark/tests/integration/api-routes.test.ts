/**
 * API Routes Integration Tests
 * 
 * Tests API endpoints with real database
 * Requires: Test database and server running
 */

import { describe, it, expect, beforeAll } from 'vitest';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const TEST_USER_ID = 'test-user-' + Date.now();

describe('API Routes Integration Tests', () => {
  let authToken: string;
  let testProjectId: string;

  beforeAll(async () => {
    // In a real scenario, you would authenticate and get a token
    // For now, we'll use a mock token or API key
    authToken = process.env.TEST_API_KEY || 'test-token';
  });

  describe('Projects API', () => {
    it('creates a project via API', async () => {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: 'API Test Project',
          description: 'Created via API',
        }),
      });

      expect(response.status).toBe(201);
      const project = await response.json();
      expect(project.name).toBe('API Test Project');
      testProjectId = project.id;
    });

    it('lists projects via API', async () => {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      const projects = await response.json();
      expect(Array.isArray(projects)).toBe(true);
    });

    it('retrieves a project via API', async () => {
      if (!testProjectId) {
        // Create project first if not exists
        const createResponse = await fetch(`${API_BASE_URL}/api/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ name: 'Get Test' }),
        });
        testProjectId = (await createResponse.json()).id;
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/${testProjectId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      const project = await response.json();
      expect(project.id).toBe(testProjectId);
    });

    it('updates a project via API', async () => {
      if (!testProjectId) return;

      const response = await fetch(`${API_BASE_URL}/api/projects/${testProjectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: 'Updated Name',
        }),
      });

      expect(response.status).toBe(200);
      const project = await response.json();
      expect(project.name).toBe('Updated Name');
    });

    it('deletes a project via API', async () => {
      if (!testProjectId) return;

      const response = await fetch(`${API_BASE_URL}/api/projects/${testProjectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(204);
    });
  });

  describe('Files API', () => {
    let projectId: string;

    beforeAll(async () => {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name: 'File API Test' }),
      });
      projectId = (await response.json()).id;
    });

    it('creates a file via API', async () => {
      const response = await fetch(`${API_BASE_URL}/api/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          project_id: projectId,
          path: 'test.cs',
          content: 'using UnityEngine;',
          type: 'csharp',
        }),
      });

      expect(response.status).toBe(201);
      const file = await response.json();
      expect(file.path).toBe('test.cs');
    });

    it('lists files via API', async () => {
      const response = await fetch(`${API_BASE_URL}/api/files?projectId=${projectId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      const files = await response.json();
      expect(Array.isArray(files)).toBe(true);
    });

    it('searches files via API', async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/files/search?projectId=${projectId}&q=test`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      const files = await response.json();
      expect(Array.isArray(files)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('returns 400 for missing required fields', async () => {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
    });

    it('returns 404 for non-existent resource', async () => {
      const response = await fetch(`${API_BASE_URL}/api/projects/non-existent-id`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(404);
    });

    it('returns 401 for unauthorized requests', async () => {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'GET',
        // No authorization header
      });

      expect(response.status).toBe(401);
    });
  });
});

