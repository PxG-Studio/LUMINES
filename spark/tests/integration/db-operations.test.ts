/**
 * Database Integration Tests
 * 
 * Tests API routes with real database operations
 * Requires: Test database connection configured
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { query } from '@/lib/database/postgres-client';
import * as projectOps from '@/lib/database/operations/slate-projects';
import * as fileOps from '@/lib/database/operations/slate-files';
import * as assetOps from '@/lib/database/operations/slate-assets';

const TEST_USER_ID = 'test-user-' + Date.now();
const TEST_PROJECT_ID = 'test-project-' + Date.now();

describe('Database Integration Tests', () => {
  beforeAll(async () => {
    // Verify database connection
    try {
      await query('SELECT 1');
    } catch (error) {
      throw new Error('Database connection failed. Please ensure test database is configured.');
    }
  });

  afterAll(async () => {
    // Cleanup test data
    try {
      await query('DELETE FROM slate_files WHERE project_id = $1', [TEST_PROJECT_ID]);
      await query('DELETE FROM slate_assets WHERE project_id = $1', [TEST_PROJECT_ID]);
      await query('DELETE FROM slate_projects WHERE id = $1', [TEST_PROJECT_ID]);
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }
  });

  describe('Projects CRUD Operations', () => {
    it('creates a project', async () => {
      const project = await projectOps.createProject({
        user_id: TEST_USER_ID,
        name: 'Test Project',
        description: 'Integration test project',
        metadata: { test: true },
      });

      expect(project).toBeDefined();
      expect(project.name).toBe('Test Project');
      expect(project.user_id).toBe(TEST_USER_ID);
    });

    it('retrieves a project', async () => {
      const project = await projectOps.createProject({
        user_id: TEST_USER_ID,
        name: 'Retrieve Test',
      });

      const retrieved = await projectOps.getProject(project.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(project.id);
      expect(retrieved?.name).toBe('Retrieve Test');
    });

    it('lists projects for a user', async () => {
      await projectOps.createProject({
        user_id: TEST_USER_ID,
        name: 'List Test 1',
      });
      await projectOps.createProject({
        user_id: TEST_USER_ID,
        name: 'List Test 2',
      });

      const projects = await projectOps.listProjects(TEST_USER_ID);
      expect(projects.length).toBeGreaterThanOrEqual(2);
      expect(projects.some((p) => p.name === 'List Test 1')).toBe(true);
      expect(projects.some((p) => p.name === 'List Test 2')).toBe(true);
    });

    it('updates a project', async () => {
      const project = await projectOps.createProject({
        user_id: TEST_USER_ID,
        name: 'Update Test',
      });

      const updated = await projectOps.updateProject(project.id, {
        name: 'Updated Name',
        description: 'Updated description',
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.description).toBe('Updated description');
    });

    it('soft deletes a project', async () => {
      const project = await projectOps.createProject({
        user_id: TEST_USER_ID,
        name: 'Delete Test',
      });

      await projectOps.deleteProject(project.id);

      const retrieved = await projectOps.getProject(project.id);
      expect(retrieved).toBeNull();
    });
  });

  describe('Files CRUD Operations', () => {
    let testProjectId: string;

    beforeEach(async () => {
      const project = await projectOps.createProject({
        user_id: TEST_USER_ID,
        name: 'File Test Project',
      });
      testProjectId = project.id;
    });

    it('creates a file', async () => {
      const file = await fileOps.createFile({
        project_id: testProjectId,
        path: 'test.cs',
        content: 'using UnityEngine;',
        type: 'csharp',
      });

      expect(file).toBeDefined();
      expect(file.path).toBe('test.cs');
      expect(file.content).toBe('using UnityEngine;');
    });

    it('retrieves a file by ID', async () => {
      const file = await fileOps.createFile({
        project_id: testProjectId,
        path: 'retrieve.cs',
        content: 'test content',
      });

      const retrieved = await fileOps.getFile(file.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(file.id);
    });

    it('retrieves a file by path', async () => {
      await fileOps.createFile({
        project_id: testProjectId,
        path: 'path-test.cs',
        content: 'content',
      });

      const retrieved = await fileOps.getFileByPath(testProjectId, 'path-test.cs');
      expect(retrieved).toBeDefined();
      expect(retrieved?.path).toBe('path-test.cs');
    });

    it('lists files for a project', async () => {
      await fileOps.createFile({
        project_id: testProjectId,
        path: 'file1.cs',
        content: 'content1',
      });
      await fileOps.createFile({
        project_id: testProjectId,
        path: 'file2.cs',
        content: 'content2',
      });

      const files = await fileOps.listFiles(testProjectId);
      expect(files.length).toBeGreaterThanOrEqual(2);
    });

    it('updates a file', async () => {
      const file = await fileOps.createFile({
        project_id: testProjectId,
        path: 'update.cs',
        content: 'old content',
      });

      const updated = await fileOps.updateFile(file.id, {
        content: 'new content',
      });

      expect(updated.content).toBe('new content');
      expect(updated.version).toBe(file.version + 1);
    });

    it('searches files', async () => {
      await fileOps.createFile({
        project_id: testProjectId,
        path: 'searchable.cs',
        content: 'unique search term',
      });

      const results = await fileOps.searchFiles(testProjectId, 'unique');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((f) => f.path.includes('searchable'))).toBe(true);
    });
  });

  describe('Assets CRUD Operations', () => {
    let testProjectId: string;

    beforeEach(async () => {
      const project = await projectOps.createProject({
        user_id: TEST_USER_ID,
        name: 'Asset Test Project',
      });
      testProjectId = project.id;
    });

    it('creates an asset', async () => {
      const asset = await assetOps.createAsset({
        project_id: testProjectId,
        name: 'Test Asset',
        type: 'Prefab',
        metadata: { test: true },
      });

      expect(asset).toBeDefined();
      expect(asset.name).toBe('Test Asset');
      expect(asset.type).toBe('Prefab');
    });

    it('creates asset components', async () => {
      const asset = await assetOps.createAsset({
        project_id: testProjectId,
        name: 'Component Test',
        type: 'Prefab',
      });

      const component = await assetOps.createAssetComponent({
        asset_id: asset.id,
        component_type: 'Transform',
        component_name: 'Transform',
        properties: { position: { x: 0, y: 0, z: 0 } },
      });

      expect(component).toBeDefined();
      expect(component.component_type).toBe('Transform');
    });

    it('lists asset components', async () => {
      const asset = await assetOps.createAsset({
        project_id: testProjectId,
        name: 'List Components',
        type: 'Prefab',
      });

      await assetOps.createAssetComponent({
        asset_id: asset.id,
        component_type: 'Transform',
        component_name: 'Transform',
        properties: {},
      });

      const components = await assetOps.listAssetComponents(asset.id);
      expect(components.length).toBeGreaterThan(0);
    });
  });

  describe('Concurrency Tests', () => {
    it('handles concurrent project creation', async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        projectOps.createProject({
          user_id: TEST_USER_ID,
          name: `Concurrent ${i}`,
        })
      );

      const projects = await Promise.all(promises);
      expect(projects.length).toBe(5);
      expect(new Set(projects.map((p) => p.id)).size).toBe(5); // All unique IDs
    });

    it('handles concurrent file updates', async () => {
      const project = await projectOps.createProject({
        user_id: TEST_USER_ID,
        name: 'Concurrency Test',
      });

      const file = await fileOps.createFile({
        project_id: project.id,
        path: 'concurrent.cs',
        content: 'initial',
      });

      const promises = Array.from({ length: 3 }, (_, i) =>
        fileOps.updateFile(file.id, {
          content: `update ${i}`,
        })
      );

      const updates = await Promise.all(promises);
      expect(updates.length).toBe(3);
      // Last update should have highest version
      const versions = updates.map((u) => u.version);
      expect(Math.max(...versions)).toBeGreaterThan(file.version);
    });
  });

  describe('Error Handling', () => {
    it('handles invalid project ID gracefully', async () => {
      const project = await projectOps.getProject('non-existent-id');
      expect(project).toBeNull();
    });

    it('handles invalid file ID gracefully', async () => {
      const file = await fileOps.getFile('non-existent-id');
      expect(file).toBeNull();
    });

    it('throws error when updating non-existent project', async () => {
      await expect(
        projectOps.updateProject('non-existent-id', { name: 'test' })
      ).rejects.toThrow();
    });
  });
});

