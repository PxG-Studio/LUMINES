import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  mockQuery,
  mockQueryReplica,
  mockTransaction,
  mockClient,
  resetDatabaseMocks,
} from '../mocks/database';
import {
  mockRequireAuth,
  mockRequireProjectAccess,
  mockAuthUser,
  resetAuthMocks,
} from '../mocks/auth';
import {
  mockGetCached,
  mockSetCached,
  mockInvalidateCache,
  resetCacheMocks,
} from '../mocks/cache';

vi.mock('../../lib/cache/strategies');
vi.mock('../../lib/auth/middleware');
vi.mock('../../lib/database/client');

describe('File Workflow Integration', () => {
  const projectId = 'test-project';
  const userId = 'test-user';

  beforeEach(() => {
    resetDatabaseMocks();
    resetAuthMocks();
    resetCacheMocks();

    mockRequireAuth.mockResolvedValue(mockAuthUser);
    mockRequireProjectAccess.mockResolvedValue(mockAuthUser);
    mockGetCached.mockImplementation(async (key, fetcher) => fetcher());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('complete file CRUD workflow', async () => {
    const { createFile, updateFile, getFileContent, deleteFile } = await import(
      '../../lib/database/operations/files'
    );

    const filePath = 'src/Test.cs';
    const initialContent = 'using UnityEngine;';
    const updatedContent = 'using UnityEngine;\n// Updated';

    mockTransaction.mockImplementation(async (callback) => {
      mockClient.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'file-1',
            project_id: projectId,
            path: filePath,
            content: initialContent,
            type: 'cs',
            size: initialContent.length,
          },
        ],
      });
      return callback(mockClient);
    });

    const createdFile = await createFile(projectId, filePath, initialContent, 'cs');
    expect(createdFile.id).toBe('file-1');
    expect(createdFile.content).toBe(initialContent);
    expect(mockInvalidateCache).toHaveBeenCalled();

    mockQueryReplica.mockResolvedValueOnce({
      rows: [{ id: 'file-1', content: initialContent }],
    });

    const content = await getFileContent('file-1');
    expect(content).toBe(initialContent);

    mockQuery
      .mockResolvedValueOnce({ rows: [{ project_id: projectId }] })
      .mockResolvedValueOnce({
        rows: [{ id: 'file-1', content: updatedContent }],
      });

    const updated = await updateFile('file-1', updatedContent);
    expect(updated.content).toBe(updatedContent);

    mockQuery
      .mockResolvedValueOnce({ rows: [{ id: 'file-1', project_id: projectId }] })
      .mockResolvedValueOnce({ rowCount: 1 });

    const deleted = await deleteFile('file-1');
    expect(deleted).toBe(true);
  });

  it('handles file creation with cache', async () => {
    const { createFile, getFilesByProject } = await import(
      '../../lib/database/operations/files'
    );

    mockTransaction.mockImplementation(async (callback) => {
      mockClient.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'file-1',
            project_id: projectId,
            path: 'test.cs',
            content: 'test',
            type: 'cs',
            size: 4,
          },
        ],
      });
      return callback(mockClient);
    });

    await createFile(projectId, 'test.cs', 'test', 'cs');

    expect(mockInvalidateCache).toHaveBeenCalledWith(`slate:files:${projectId}:*`);

    mockQueryReplica.mockResolvedValueOnce({
      rows: [
        {
          id: 'file-1',
          project_id: projectId,
          path: 'test.cs',
          content: 'test',
          type: 'cs',
          size: 4,
        },
      ],
    });

    const files = await getFilesByProject(projectId);
    expect(files).toHaveLength(1);
    expect(mockSetCached).toHaveBeenCalled();
  });

  it('handles concurrent file updates', async () => {
    const { updateFile } = await import('../../lib/database/operations/files');

    mockQuery
      .mockResolvedValue({ rows: [{ project_id: projectId }] })
      .mockResolvedValue({ rows: [{ id: 'file-1', content: 'content1' }] });

    const [result1, result2] = await Promise.all([
      updateFile('file-1', 'content1'),
      updateFile('file-1', 'content2'),
    ]);

    expect(mockInvalidateCache).toHaveBeenCalledTimes(2);
  });

  it('handles error during file creation', async () => {
    const { createFile } = await import('../../lib/database/operations/files');

    mockTransaction.mockRejectedValueOnce(new Error('Database error'));

    await expect(createFile(projectId, 'test.cs', 'test', 'cs')).rejects.toThrow(
      'Database error'
    );

    expect(mockInvalidateCache).not.toHaveBeenCalled();
  });

  it('handles file tree building with nested paths', async () => {
    const { getFilesByProject } = await import('../../lib/database/operations/files');

    const mockFiles = [
      { id: '1', path: 'src/Test.cs', type: 'cs' },
      { id: '2', path: 'src/Utils/Helper.cs', type: 'cs' },
      { id: '3', path: 'src/Utils/Math.cs', type: 'cs' },
      { id: '4', path: 'Assets/Prefabs/Player.prefab', type: 'prefab' },
    ];

    mockQueryReplica.mockResolvedValueOnce({ rows: mockFiles });

    const files = await getFilesByProject(projectId);

    expect(files).toHaveLength(4);
  });
});
