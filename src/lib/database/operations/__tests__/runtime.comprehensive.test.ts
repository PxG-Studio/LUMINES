import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as runtimeOps from '../runtime';
import { query, queryReplica } from '../../client';
import { getCached, setCached } from '../../../cache/strategies';
import { publishRuntimeEvent } from '../../../messaging/events';

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
  publishRuntimeEvent: vi.fn(),
}));

describe('Runtime Database Operations - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createRuntimeSession', () => {
    it('creates runtime session with all fields', async () => {
      const mockSession = {
        id: '1',
        project_id: 'proj1',
        user_id: 'user1',
        runtime_type: 'unity',
        container_config: { image: 'unity:2022.3' },
        metadata: { version: '1.0.0' },
        status: 'starting',
        created_at: new Date(),
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockSession] } as any);
      vi.mocked(setCached).mockResolvedValue(undefined);
      vi.mocked(publishRuntimeEvent).mockResolvedValue(undefined);

      const result = await runtimeOps.createRuntimeSession({
        project_id: 'proj1',
        user_id: 'user1',
        runtime_type: 'unity',
        container_config: { image: 'unity:2022.3' },
        metadata: { version: '1.0.0' },
      });

      expect(result).toEqual(mockSession);
      expect(setCached).toHaveBeenCalled();
      expect(publishRuntimeEvent).toHaveBeenCalled();
    });

    it('creates session without optional metadata', async () => {
      const mockSession = {
        id: '1',
        project_id: 'proj1',
        user_id: 'user1',
        runtime_type: 'godot',
        container_config: {},
        metadata: {},
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockSession] } as any);
      vi.mocked(setCached).mockResolvedValue(undefined);
      vi.mocked(publishRuntimeEvent).mockResolvedValue(undefined);

      const result = await runtimeOps.createRuntimeSession({
        project_id: 'proj1',
        user_id: 'user1',
        runtime_type: 'godot',
        container_config: {},
      });

      expect(result).toEqual(mockSession);
    });

    it('publishes runtime started event', async () => {
      const mockSession = {
        id: '1',
        project_id: 'proj1',
        user_id: 'user1',
        runtime_type: 'unity',
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockSession] } as any);
      vi.mocked(setCached).mockResolvedValue(undefined);
      vi.mocked(publishRuntimeEvent).mockResolvedValue(undefined);

      await runtimeOps.createRuntimeSession({
        project_id: 'proj1',
        user_id: 'user1',
        runtime_type: 'unity',
        container_config: {},
      });

      expect(publishRuntimeEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'started',
          projectId: 'proj1',
        })
      );
    });
  });

  describe('getRuntimeSession', () => {
    it('returns cached session when available', async () => {
      const cachedSession = {
        id: '1',
        project_id: 'proj1',
        status: 'running',
      };

      vi.mocked(getCached).mockResolvedValue(cachedSession as any);

      const result = await runtimeOps.getRuntimeSession('1');

      expect(result).toEqual(cachedSession);
      expect(query).not.toHaveBeenCalled();
    });

    it('fetches from database on cache miss', async () => {
      const mockSession = {
        id: '1',
        project_id: 'proj1',
        status: 'starting',
      };

      vi.mocked(getCached).mockImplementation(async (key, fetcher) => fetcher());
      vi.mocked(query).mockResolvedValue({ rows: [mockSession] } as any);

      const result = await runtimeOps.getRuntimeSession('1');

      expect(result).toEqual(mockSession);
      expect(query).toHaveBeenCalled();
    });

    it('returns null when session not found', async () => {
      vi.mocked(getCached).mockImplementation(async (key, fetcher) => fetcher());
      vi.mocked(query).mockResolvedValue({ rows: [] } as any);

      const result = await runtimeOps.getRuntimeSession('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('listRuntimeSessions', () => {
    it('returns cached sessions when available', async () => {
      const cachedSessions = [
        { id: '1', project_id: 'proj1', status: 'running' },
        { id: '2', project_id: 'proj1', status: 'stopped' },
      ];

      vi.mocked(getCached).mockResolvedValue(cachedSessions as any);

      const result = await runtimeOps.listRuntimeSessions('proj1');

      expect(result).toEqual(cachedSessions);
      expect(queryReplica).not.toHaveBeenCalled();
    });

    it('fetches from replica on cache miss', async () => {
      const mockSessions = [
        { id: '1', project_id: 'proj1', status: 'running' },
        { id: '2', project_id: 'proj1', status: 'stopped' },
      ];

      vi.mocked(getCached).mockImplementation(async (key, fetcher) => fetcher());
      vi.mocked(queryReplica).mockResolvedValue({ rows: mockSessions } as any);

      const result = await runtimeOps.listRuntimeSessions('proj1');

      expect(result).toEqual(mockSessions);
      expect(queryReplica).toHaveBeenCalled();
    });

    it('orders by created_at DESC', async () => {
      vi.mocked(getCached).mockImplementation(async (key, fetcher) => fetcher());
      vi.mocked(queryReplica).mockResolvedValue({ rows: [] } as any);

      await runtimeOps.listRuntimeSessions('proj1');

      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY created_at DESC'),
        ['proj1']
      );
    });
  });

  describe('updateRuntimeSession', () => {
    it('updates session status', async () => {
      const updatedSession = {
        id: '1',
        status: 'running',
        container_id: 'container-123',
      };

      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any)
        .mockResolvedValueOnce({ rows: [updatedSession] } as any);

      const result = await runtimeOps.updateRuntimeSession('1', {
        status: 'running',
        container_id: 'container-123',
      });

      expect(result.status).toBe('running');
      expect(result.container_id).toBe('container-123');
    });

    it('updates started_at timestamp', async () => {
      const startedAt = new Date();
      const updatedSession = {
        id: '1',
        status: 'running',
        started_at: startedAt,
      };

      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any)
        .mockResolvedValueOnce({ rows: [updatedSession] } as any);

      const result = await runtimeOps.updateRuntimeSession('1', {
        started_at: startedAt,
      });

      expect(result.started_at).toEqual(startedAt);
    });

    it('updates stopped_at timestamp', async () => {
      const stoppedAt = new Date();
      const updatedSession = {
        id: '1',
        status: 'stopped',
        stopped_at: stoppedAt,
      };

      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any)
        .mockResolvedValueOnce({ rows: [updatedSession] } as any);

      const result = await runtimeOps.updateRuntimeSession('1', {
        stopped_at: stoppedAt,
      });

      expect(result.stopped_at).toEqual(stoppedAt);
    });

    it('updates error message on failure', async () => {
      const updatedSession = {
        id: '1',
        status: 'error',
        error_message: 'Container failed to start',
      };

      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any)
        .mockResolvedValueOnce({ rows: [updatedSession] } as any);

      const result = await runtimeOps.updateRuntimeSession('1', {
        error_message: 'Container failed to start',
      });

      expect(result.error_message).toBe('Container failed to start');
    });

    it('throws error when session not found', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [] } as any);

      await expect(
        runtimeOps.updateRuntimeSession('nonexistent', { status: 'running' })
      ).rejects.toThrow('Runtime session not found');
    });
  });
});
