import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as buildOps from '../builds';
import { query, queryReplica } from '../../client';
import { getCached, setCached } from '../../../cache/strategies';
import { publishBuildEvent } from '../../../messaging/events';

// Mock dependencies
vi.mock('../../client', () => ({
  query: vi.fn(),
  queryReplica: vi.fn(),
}));

vi.mock('../../../cache/strategies', () => ({
  getCached: vi.fn(),
  setCached: vi.fn(),
}));

vi.mock('../../../messaging/events', () => ({
  publishBuildEvent: vi.fn(),
}));

describe('Builds Database Operations - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createBuildJob', () => {
    it('creates build job with all fields', async () => {
      const mockJob = {
        id: '1',
        project_id: 'proj1',
        user_id: 'user1',
        build_type: 'development',
        target_platform: 'windows',
        source_commit: 'abc123',
        metadata: { version: '1.0.0' },
        status: 'pending',
        created_at: new Date(),
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockJob] } as any);
      vi.mocked(setCached).mockResolvedValue(undefined);
      vi.mocked(publishBuildEvent).mockResolvedValue(undefined);

      const result = await buildOps.createBuildJob({
        project_id: 'proj1',
        user_id: 'user1',
        build_type: 'development',
        target_platform: 'windows',
        source_commit: 'abc123',
        metadata: { version: '1.0.0' },
      });

      expect(result).toEqual(mockJob);
      expect(setCached).toHaveBeenCalled();
      expect(publishBuildEvent).toHaveBeenCalled();
    });

    it('creates build job without optional fields', async () => {
      const mockJob = {
        id: '1',
        project_id: 'proj1',
        user_id: 'user1',
        build_type: 'production',
        target_platform: 'linux',
        source_commit: null,
        metadata: {},
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockJob] } as any);
      vi.mocked(setCached).mockResolvedValue(undefined);
      vi.mocked(publishBuildEvent).mockResolvedValue(undefined);

      const result = await buildOps.createBuildJob({
        project_id: 'proj1',
        user_id: 'user1',
        build_type: 'production',
        target_platform: 'linux',
      });

      expect(result).toEqual(mockJob);
    });

    it('publishes build started event', async () => {
      const mockJob = {
        id: '1',
        project_id: 'proj1',
        user_id: 'user1',
        build_type: 'development',
        target_platform: 'windows',
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockJob] } as any);
      vi.mocked(setCached).mockResolvedValue(undefined);
      vi.mocked(publishBuildEvent).mockResolvedValue(undefined);

      await buildOps.createBuildJob({
        project_id: 'proj1',
        user_id: 'user1',
        build_type: 'development',
        target_platform: 'windows',
      });

      expect(publishBuildEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'started',
          projectId: 'proj1',
        })
      );
    });
  });

  describe('getBuildJob', () => {
    it('returns cached job when available', async () => {
      const cachedJob = {
        id: '1',
        project_id: 'proj1',
        status: 'completed',
      };

      vi.mocked(getCached).mockResolvedValue(cachedJob as any);

      const result = await buildOps.getBuildJob('1');

      expect(result).toEqual(cachedJob);
      expect(query).not.toHaveBeenCalled();
    });

    it('fetches from database on cache miss', async () => {
      const mockJob = {
        id: '1',
        project_id: 'proj1',
        status: 'pending',
      };

      vi.mocked(getCached).mockImplementation(async (key, fetcher) => fetcher());
      vi.mocked(query).mockResolvedValue({ rows: [mockJob] } as any);

      const result = await buildOps.getBuildJob('1');

      expect(result).toEqual(mockJob);
      expect(query).toHaveBeenCalled();
    });

    it('returns null when job not found', async () => {
      vi.mocked(getCached).mockImplementation(async (key, fetcher) => fetcher());
      vi.mocked(query).mockResolvedValue({ rows: [] } as any);

      const result = await buildOps.getBuildJob('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('listBuildJobs', () => {
    it('returns cached jobs when available', async () => {
      const cachedJobs = [
        { id: '1', project_id: 'proj1' },
        { id: '2', project_id: 'proj1' },
      ];

      vi.mocked(getCached).mockResolvedValue(cachedJobs as any);

      const result = await buildOps.listBuildJobs('proj1');

      expect(result).toEqual(cachedJobs);
      expect(queryReplica).not.toHaveBeenCalled();
    });

    it('fetches from replica on cache miss', async () => {
      const mockJobs = [
        { id: '1', project_id: 'proj1', status: 'completed' },
        { id: '2', project_id: 'proj1', status: 'pending' },
      ];

      vi.mocked(getCached).mockImplementation(async (key, fetcher) => fetcher());
      vi.mocked(queryReplica).mockResolvedValue({ rows: mockJobs } as any);

      const result = await buildOps.listBuildJobs('proj1');

      expect(result).toEqual(mockJobs);
      expect(queryReplica).toHaveBeenCalled();
    });

    it('orders by created_at DESC', async () => {
      vi.mocked(getCached).mockImplementation(async (key, fetcher) => fetcher());
      vi.mocked(queryReplica).mockResolvedValue({ rows: [] } as any);

      await buildOps.listBuildJobs('proj1');

      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY created_at DESC'),
        ['proj1']
      );
    });
  });

  describe('updateBuildJob', () => {
    it('updates job status', async () => {
      const updatedJob = {
        id: '1',
        status: 'running',
        progress: 50,
      };

      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any)
        .mockResolvedValueOnce({ rows: [updatedJob] } as any);

      const result = await buildOps.updateBuildJob('1', {
        status: 'running',
        progress: 50,
      });

      expect(result.status).toBe('running');
      expect(result.progress).toBe(50);
    });

    it('updates output path when completed', async () => {
      const updatedJob = {
        id: '1',
        status: 'completed',
        output_path: '/builds/output.exe',
        completed_at: new Date(),
      };

      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any)
        .mockResolvedValueOnce({ rows: [updatedJob] } as any);

      const result = await buildOps.updateBuildJob('1', {
        status: 'completed',
        output_path: '/builds/output.exe',
        completed_at: new Date(),
      });

      expect(result.status).toBe('completed');
      expect(result.output_path).toBe('/builds/output.exe');
    });

    it('updates error message on failure', async () => {
      const updatedJob = {
        id: '1',
        status: 'failed',
        error_message: 'Build failed: compilation error',
      };

      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any)
        .mockResolvedValueOnce({ rows: [updatedJob] } as any);

      const result = await buildOps.updateBuildJob('1', {
        status: 'failed',
        error_message: 'Build failed: compilation error',
      });

      expect(result.status).toBe('failed');
      expect(result.error_message).toBe('Build failed: compilation error');
    });

    it('throws error when job not found', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [] } as any);

      await expect(
        buildOps.updateBuildJob('nonexistent', { status: 'running' })
      ).rejects.toThrow('Build job not found');
    });
  });
});
