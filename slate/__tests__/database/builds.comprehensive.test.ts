/**
 * Builds Database Operations - Comprehensive Tests
 * Complete coverage for build job CRUD and statistics
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as buildOps from '@/lib/database/operations/builds';
import { query, queryReplica } from '@/lib/database/client';

vi.mock('@/lib/database/client', () => ({
  query: vi.fn(),
  queryReplica: vi.fn(),
}));

vi.mock('@/lib/cache/strategies', () => ({
  getCached: vi.fn((key, fn) => fn()),
  setCached: vi.fn(),
}));

vi.mock('@/lib/messaging/events', () => ({
  publishBuildEvent: vi.fn(),
}));

describe('Builds Database Operations - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createBuildJob', () => {
    it('should create build job successfully', async () => {
      const mockJob = {
        id: '1',
        project_id: 'p1',
        user_id: 'u1',
        build_type: 'development',
        target_platform: 'webgl',
        status: 'queued',
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockJob],
      } as any);

      const result = await buildOps.createBuildJob({
        project_id: 'p1',
        user_id: 'u1',
        build_type: 'development',
        target_platform: 'webgl',
      });

      expect(result).toEqual(mockJob);
    });
  });

  describe('getBuildJob', () => {
    it('should get build job by ID', async () => {
      const mockJob = { id: '1', status: 'building' };
      vi.mocked(query).mockResolvedValue({
        rows: [mockJob],
      } as any);

      const result = await buildOps.getBuildJob('1');
      expect(result).toEqual(mockJob);
    });
  });

  describe('listBuildJobs', () => {
    it('should list all build jobs for project', async () => {
      const mockJobs = [
        { id: '1', project_id: 'p1', status: 'completed' },
        { id: '2', project_id: 'p1', status: 'failed' },
      ];

      vi.mocked(queryReplica).mockResolvedValue({
        rows: mockJobs,
      } as any);

      const result = await buildOps.listBuildJobs('p1');
      expect(result).toEqual(mockJobs);
    });
  });

  describe('updateBuildJob', () => {
    it('should update build job status', async () => {
      const mockJob = { id: '1', status: 'building' };
      vi.mocked(query).mockResolvedValue({
        rows: [mockJob],
      } as any);

      const result = await buildOps.updateBuildJob('1', {
        status: 'building',
      });

      expect(result).toEqual(mockJob);
    });

    it('should update build job progress', async () => {
      const mockJob = { id: '1', progress: 50 };
      vi.mocked(query).mockResolvedValue({
        rows: [mockJob],
      } as any);

      const result = await buildOps.updateBuildJob('1', {
        progress: 50,
      });

      expect(result).toEqual(mockJob);
    });
  });

  describe('getActiveBuildJobs', () => {
    it('should get active build jobs for user', async () => {
      const mockJobs = [
        { id: '1', user_id: 'u1', status: 'queued' },
        { id: '2', user_id: 'u1', status: 'building' },
      ];

      vi.mocked(queryReplica).mockResolvedValue({
        rows: mockJobs,
      } as any);

      const result = await buildOps.getActiveBuildJobs('u1');
      expect(result).toEqual(mockJobs);
    });
  });

  describe('getRecentBuildJobs', () => {
    it('should get recent build jobs with limit', async () => {
      const mockJobs = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        project_id: 'p1',
      }));

      vi.mocked(queryReplica).mockResolvedValue({
        rows: mockJobs,
      } as any);

      const result = await buildOps.getRecentBuildJobs('p1', 10);
      expect(result.length).toBe(10);
    });
  });

  describe('getBuildStatistics', () => {
    it('should get build statistics', async () => {
      const mockStats = {
        total: 100,
        completed: 80,
        failed: 20,
        average_duration: 120.5,
      };

      vi.mocked(queryReplica).mockResolvedValue({
        rows: [mockStats],
      } as any);

      const result = await buildOps.getBuildStatistics('p1');
      expect(result.total).toBe(100);
      expect(result.completed).toBe(80);
      expect(result.failed).toBe(20);
      expect(result.averageDuration).toBe(120.5);
    });
  });
});

