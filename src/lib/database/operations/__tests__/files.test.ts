import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mockQuery,
  mockQueryReplica,
  mockTransaction,
  mockClient,
  resetDatabaseMocks,
} from '../../../../__tests__/mocks/database';
import {
  mockRequireAuth,
  mockRequireProjectAccess,
  mockAuthUser,
  resetAuthMocks,
} from '../../../../__tests__/mocks/auth';
import {
  mockGetCached,
  mockSetCached,
  mockInvalidateCache,
  resetCacheMocks,
} from '../../../../__tests__/mocks/cache';

vi.mock('../../../cache/strategies');
vi.mock('../../../auth/middleware');
vi.mock('../../../database/client');

const { getFilesByProject, createFile, updateFile, deleteFile, getFileContent } = await import('../files');

describe('File Operations', () => {
  const projectId = 'test-project-id';
  const userId = 'test-user-id';

  beforeEach(() => {
    resetDatabaseMocks();
    resetAuthMocks();
    resetCacheMocks();

    mockRequireAuth.mockResolvedValue(mockAuthUser);
    mockRequireProjectAccess.mockResolvedValue(mockAuthUser);
  });

  describe('getFilesByProject', () => {
    it('fetches files from replica', async () => {
      const mockFiles = [
        {
          id: 'file-1',
          project_id: projectId,
          path: 'src/Test.cs',
          content: 'test',
          type: 'cs',
          size: 4,
        },
      ];

      mockQueryReplica.mockResolvedValue({ rows: mockFiles });
      mockGetCached.mockImplementation(async (key, fetcher) => fetcher());

      const files = await getFilesByProject(projectId);

      expect(files).toEqual(mockFiles);
      expect(mockQueryReplica).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [projectId]
      );
    });

    it('uses cache when available', async () => {
      const cachedFiles = [{ id: 'file-1', path: 'cached.cs' }];
      mockGetCached.mockResolvedValue(cachedFiles);

      const files = await getFilesByProject(projectId);

      expect(files).toEqual(cachedFiles);
      expect(mockQueryReplica).not.toHaveBeenCalled();
    });

    it('filters out deleted files', async () => {
      const mockFiles = [
        { id: 'file-1', path: 'active.cs', deleted_at: null },
        { id: 'file-2', path: 'deleted.cs', deleted_at: new Date() },
      ];

      mockQueryReplica.mockResolvedValue({ rows: mockFiles });
      mockGetCached.mockImplementation(async (key, fetcher) => fetcher());

      const files = await getFilesByProject(projectId);

      expect(files).toHaveLength(1);
      expect(files[0].path).toBe('active.cs');
    });

    it('throws error if no project access', async () => {
      mockRequireProjectAccess.mockRejectedValue(new Error('Access denied'));

      await expect(getFilesByProject(projectId)).rejects.toThrow('Access denied');
    });
  });

  describe('createFile', () => {
    it('creates new file', async () => {
      const path = 'src/NewFile.cs';
      const content = 'using UnityEngine;';
      const type = 'cs';

      const newFile = {
        id: 'file-new',
        project_id: projectId,
        path,
        content,
        type,
        size: content.length,
      };

      mockTransaction.mockImplementation(async (callback) => {
        mockClient.query.mockResolvedValueOnce({ rows: [newFile] });
        return callback(mockClient);
      });

      const file = await createFile(projectId, path, content, type);

      expect(file).toEqual(newFile);
      expect(mockInvalidateCache).toHaveBeenCalled();
    });

    it('calculates file size', async () => {
      const content = 'test content';
      const expectedSize = Buffer.byteLength(content, 'utf8');

      mockTransaction.mockImplementation(async (callback) => {
        mockClient.query.mockResolvedValueOnce({
          rows: [{ id: 'file-1', size: expectedSize }],
        });
        return callback(mockClient);
      });

      const file = await createFile(projectId, 'test.cs', content, 'cs');

      expect(file.size).toBe(expectedSize);
    });

    it('throws error if project access denied', async () => {
      mockRequireProjectAccess.mockRejectedValue(new Error('Access denied'));

      await expect(
        createFile(projectId, 'test.cs', 'content', 'cs')
      ).rejects.toThrow('Access denied');
    });
  });

  describe('updateFile', () => {
    it('updates file content', async () => {
      const fileId = 'file-1';
      const newContent = 'updated content';

      const updatedFile = {
        id: fileId,
        content: newContent,
        size: newContent.length,
      };

      mockQuery.mockResolvedValueOnce({ rows: [{ project_id: projectId }] });
      mockQuery.mockResolvedValueOnce({ rows: [updatedFile] });

      const file = await updateFile(fileId, newContent);

      expect(file.content).toBe(newContent);
      expect(mockInvalidateCache).toHaveBeenCalled();
    });

    it('throws error if file not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await expect(updateFile('nonexistent', 'content')).rejects.toThrow();
    });
  });

  describe('deleteFile', () => {
    it('soft deletes file', async () => {
      const fileId = 'file-1';

      mockQuery
        .mockResolvedValueOnce({ rows: [{ id: fileId, project_id: projectId }] })
        .mockResolvedValueOnce({ rowCount: 1 });

      const result = await deleteFile(fileId);

      expect(result).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE slate_files SET deleted_at'),
        [fileId]
      );
      expect(mockInvalidateCache).toHaveBeenCalled();
    });

    it('throws error if file not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await expect(deleteFile('nonexistent')).rejects.toThrow();
    });
  });

  describe('getFileContent', () => {
    it('fetches file content', async () => {
      const fileId = 'file-1';
      const content = 'file content';

      mockQueryReplica.mockResolvedValue({
        rows: [{ id: fileId, content }],
      });
      mockGetCached.mockImplementation(async (key, fetcher) => fetcher());

      const result = await getFileContent(fileId);

      expect(result).toBe(content);
    });

    it('uses cache when available', async () => {
      const cachedContent = 'cached content';
      mockGetCached.mockResolvedValue(cachedContent);

      const result = await getFileContent('file-1');

      expect(result).toBe(cachedContent);
      expect(mockQueryReplica).not.toHaveBeenCalled();
    });

    it('throws error if file not found', async () => {
      mockQueryReplica.mockResolvedValue({ rows: [] });
      mockGetCached.mockImplementation(async (key, fetcher) => fetcher());

      await expect(getFileContent('nonexistent')).rejects.toThrow();
    });
  });
});
