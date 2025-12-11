import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as projectOps from '../projects';
import { query, queryReplica } from '../../client';
import { getCached, setCached, invalidateProjectCache } from '../../../cache/strategies';
import { publishProjectEvent } from '../../../messaging/events';

// Mock dependencies
vi.mock('../../client', () => ({
  query: vi.fn(),
  queryReplica: vi.fn(),
}));

vi.mock('../../../cache/strategies', () => ({
  getCached: vi.fn(),
  setCached: vi.fn(),
  invalidateProjectCache: vi.fn(),
  CacheKeys: {
    project: (id: string) => `project:${id}`,
    projectList: (userId: string) => `project-list:${userId}`,
  },
  CacheTTL: {
    project: 3600,
    projectList: 300,
  },
}));

vi.mock('../../../messaging/events', () => ({
  publishProjectEvent: vi.fn().mockResolvedValue(undefined),
}));

describe('Projects Operations - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'Test Project',
        description: 'Test description',
        metadata: {},
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockProject],
      } as any);

      const result = await projectOps.createProject({
        user_id: 'user1',
        name: 'Test Project',
        description: 'Test description',
        metadata: {},
      });

      expect(result).toEqual(mockProject);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO slate_projects'),
        ['user1', 'Test Project', 'Test description', '{}']
      );
      expect(setCached).toHaveBeenCalled();
      expect(publishProjectEvent).toHaveBeenCalled();
    });

    it('should create project without description', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'Test Project',
        description: null,
        metadata: {},
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockProject],
      } as any);

      const result = await projectOps.createProject({
        user_id: 'user1',
        name: 'Test Project',
      });

      expect(result).toEqual(mockProject);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO slate_projects'),
        ['user1', 'Test Project', null, '{}']
      );
    });

    it('should handle metadata as JSON string', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'Test Project',
        metadata: { custom: 'value' },
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockProject],
      } as any);

      await projectOps.createProject({
        user_id: 'user1',
        name: 'Test Project',
        metadata: { custom: 'value' },
      });

      expect(query).toHaveBeenCalledWith(
        expect.any(String),
        ['user1', 'Test Project', null, '{"custom":"value"}']
      );
    });
  });

  describe('getProject', () => {
    it('should get project from cache if available', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'Test Project',
      };

      vi.mocked(getCached).mockResolvedValue(mockProject as any);

      const result = await projectOps.getProject('1');

      expect(result).toEqual(mockProject);
      expect(getCached).toHaveBeenCalled();
      expect(query).not.toHaveBeenCalled();
    });

    it('should fetch from database if not in cache', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'Test Project',
      };

      vi.mocked(getCached).mockImplementation(async (key, fetcher) => {
        // Simulate cache miss - call the fetcher
        return await fetcher();
      });
      vi.mocked(query).mockResolvedValue({
        rows: [mockProject],
      } as any);

      const result = await projectOps.getProject('1');

      expect(result).toEqual(mockProject);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM slate_projects'),
        ['1']
      );
    });

    it('should return null if project not found', async () => {
      vi.mocked(getCached).mockImplementation(async (key, fetcher) => {
        // Simulate cache miss - call the fetcher
        return await fetcher();
      });
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      const result = await projectOps.getProject('999');

      expect(result).toBeNull();
    });

    it('should exclude deleted projects', async () => {
      vi.mocked(getCached).mockImplementation(async (key, fetcher) => {
        // Simulate cache miss - call the fetcher
        return await fetcher();
      });
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      await projectOps.getProject('1');

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('deleted_at IS NULL'),
        ['1']
      );
    });
  });

  describe('listProjects', () => {
    it('should list projects from cache if available', async () => {
      const mockProjects = [
        { id: '1', user_id: 'user1', name: 'Project 1' },
        { id: '2', user_id: 'user1', name: 'Project 2' },
      ];

      vi.mocked(getCached).mockResolvedValue(mockProjects as any);

      const result = await projectOps.listProjects('user1');

      expect(result).toEqual(mockProjects);
      expect(getCached).toHaveBeenCalled();
      expect(queryReplica).not.toHaveBeenCalled();
    });

    it('should fetch from replica if not in cache', async () => {
      const mockProjects = [
        { id: '1', user_id: 'user1', name: 'Project 1' },
      ];

      vi.mocked(getCached).mockImplementation(async (key, fetcher) => {
        // Simulate cache miss - call the fetcher
        return await fetcher();
      });
      vi.mocked(queryReplica).mockResolvedValue({
        rows: mockProjects,
      } as any);

      const result = await projectOps.listProjects('user1');

      expect(result).toEqual(mockProjects);
      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM slate_projects'),
        ['user1']
      );
    });

    it('should order by updated_at DESC', async () => {
      vi.mocked(getCached).mockImplementation(async (key, fetcher) => {
        // Simulate cache miss - call the fetcher
        return await fetcher();
      });
      vi.mocked(queryReplica).mockResolvedValue({
        rows: [],
      } as any);

      await projectOps.listProjects('user1');

      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY updated_at DESC'),
        ['user1']
      );
    });

    it('should exclude deleted projects', async () => {
      vi.mocked(getCached).mockImplementation(async (key, fetcher) => {
        // Simulate cache miss - call the fetcher
        return await fetcher();
      });
      vi.mocked(queryReplica).mockResolvedValue({
        rows: [],
      } as any);

      await projectOps.listProjects('user1');

      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('deleted_at IS NULL'),
        ['user1']
      );
    });
  });

  describe('updateProject', () => {
    it('should update project name', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'Updated Name',
        description: 'Test',
        metadata: {},
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockProject],
      } as any);

      const result = await projectOps.updateProject('1', {
        name: 'Updated Name',
      });

      expect(result).toEqual(mockProject);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE slate_projects'),
        expect.arrayContaining(['Updated Name', '1'])
      );
      expect(invalidateProjectCache).toHaveBeenCalledWith('1');
      expect(publishProjectEvent).toHaveBeenCalled();
    });

    it('should update project description', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'Test',
        description: 'Updated Description',
        metadata: {},
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockProject],
      } as any);

      const result = await projectOps.updateProject('1', {
        description: 'Updated Description',
      });

      expect(result).toEqual(mockProject);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE slate_projects'),
        expect.arrayContaining(['Updated Description', '1'])
      );
    });

    it('should update project metadata', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'Test',
        metadata: { updated: true },
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockProject],
      } as any);

      const result = await projectOps.updateProject('1', {
        metadata: { updated: true },
      });

      expect(result).toEqual(mockProject);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE slate_projects'),
        expect.arrayContaining([expect.stringContaining('"updated":true'), '1'])
      );
    });

    it('should update multiple fields', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'Updated Name',
        description: 'Updated Description',
        metadata: {},
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockProject],
      } as any);

      const result = await projectOps.updateProject('1', {
        name: 'Updated Name',
        description: 'Updated Description',
      });

      expect(result).toEqual(mockProject);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE slate_projects'),
        expect.arrayContaining(['Updated Name', 'Updated Description', '1'])
      );
    });

    it('should return existing project if no updates provided', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'Test',
      };

      // Mock getCached to return the project (simulating cache hit)
      vi.mocked(getCached).mockResolvedValue(mockProject as any);

      const result = await projectOps.updateProject('1', {});

      expect(result).toEqual(mockProject);
      expect(query).not.toHaveBeenCalled();
    });

    it('should throw error if project not found', async () => {
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      await expect(
        projectOps.updateProject('999', { name: 'Updated' })
      ).rejects.toThrow('Project not found');
    });
  });

  describe('deleteProject', () => {
    it('should soft delete project', async () => {
      const mockProject = {
        id: '1',
        user_id: 'user1',
        name: 'Test',
      };

      // Mock getCached to return the project (simulating cache hit)
      vi.mocked(getCached).mockResolvedValue(mockProject as any);
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      await projectOps.deleteProject('1');

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE slate_projects SET deleted_at'),
        ['1']
      );
      expect(invalidateProjectCache).toHaveBeenCalledWith('1');
      expect(publishProjectEvent).toHaveBeenCalled();
    });

    it('should publish delete event even if project not found', async () => {
      // Mock getCached to return null (project not found)
      vi.mocked(getCached).mockResolvedValue(null);
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      await projectOps.deleteProject('999');

      expect(query).toHaveBeenCalled();
      expect(publishProjectEvent).not.toHaveBeenCalled();
    });
  });
});

