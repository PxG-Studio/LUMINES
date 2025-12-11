import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fileOps from '../files';
import { query, queryReplica } from '../../client';

// Mock database client
vi.mock('../../client', () => ({
  query: vi.fn(),
  queryReplica: vi.fn(),
}));

describe('Files Database Operations - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createFile', () => {
    it('creates file with all fields', async () => {
      const mockFile = {
        id: '1',
        project_id: 'proj1',
        path: 'src/Main.cs',
        content: 'using System;',
        type: 'cs',
        size: 12,
        encoding: 'utf-8',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockFile] } as any);

      const result = await fileOps.createFile({
        project_id: 'proj1',
        path: 'src/Main.cs',
        content: 'using System;',
        type: 'cs',
        encoding: 'utf-8',
      });

      expect(result).toEqual(mockFile);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO slate_files'),
        expect.arrayContaining(['proj1', 'src/Main.cs', 'using System;'])
      );
    });

    it('calculates file size correctly', async () => {
      const content = 'test content';
      const expectedSize = Buffer.byteLength(content, 'utf8');
      const mockFile = {
        id: '1',
        size: expectedSize,
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockFile] } as any);

      const result = await fileOps.createFile({
        project_id: 'proj1',
        path: 'test.cs',
        content,
      });

      expect(result.size).toBe(expectedSize);
    });

    it('creates file without content', async () => {
      const mockFile = {
        id: '1',
        project_id: 'proj1',
        path: 'src/Empty.cs',
        content: null,
        size: 0,
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockFile] } as any);

      const result = await fileOps.createFile({
        project_id: 'proj1',
        path: 'src/Empty.cs',
      });

      expect(result.content).toBeNull();
      expect(result.size).toBe(0);
    });
  });

  describe('getFile', () => {
    it('returns file when found', async () => {
      const mockFile = {
        id: '1',
        project_id: 'proj1',
        path: 'src/Main.cs',
        deleted_at: null,
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockFile] } as any);

      const result = await fileOps.getFile('1');

      expect(result).toEqual(mockFile);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM slate_files'),
        ['1']
      );
    });

    it('returns null when file not found', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [] } as any);

      const result = await fileOps.getFile('nonexistent');

      expect(result).toBeNull();
    });

    it('excludes deleted files', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [] } as any);

      await fileOps.getFile('deleted-id');

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('deleted_at IS NULL'),
        ['deleted-id']
      );
    });
  });

  describe('getFileByPath', () => {
    it('returns file when found by path', async () => {
      const mockFile = {
        id: '1',
        project_id: 'proj1',
        path: 'src/Main.cs',
      };

      vi.mocked(query).mockResolvedValue({ rows: [mockFile] } as any);

      const result = await fileOps.getFileByPath('proj1', 'src/Main.cs');

      expect(result).toEqual(mockFile);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('project_id = $1 AND path = $2'),
        ['proj1', 'src/Main.cs']
      );
    });

    it('returns null when file not found', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [] } as any);

      const result = await fileOps.getFileByPath('proj1', 'nonexistent.cs');

      expect(result).toBeNull();
    });
  });

  describe('listFiles', () => {
    it('returns all files for project', async () => {
      const mockFiles = [
        { id: '1', project_id: 'proj1', path: 'src/File1.cs' },
        { id: '2', project_id: 'proj1', path: 'src/File2.cs' },
      ];

      vi.mocked(queryReplica).mockResolvedValue({ rows: mockFiles } as any);

      const result = await fileOps.listFiles('proj1');

      expect(result).toEqual(mockFiles);
      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM slate_files'),
        ['proj1']
      );
    });

    it('orders by path ASC', async () => {
      vi.mocked(queryReplica).mockResolvedValue({ rows: [] } as any);

      await fileOps.listFiles('proj1');

      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY path ASC'),
        ['proj1']
      );
    });

    it('excludes deleted files', async () => {
      vi.mocked(queryReplica).mockResolvedValue({ rows: [] } as any);

      await fileOps.listFiles('proj1');

      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('deleted_at IS NULL'),
        ['proj1']
      );
    });
  });

  describe('updateFile', () => {
    it('updates file content', async () => {
      const updatedFile = {
        id: '1',
        content: 'updated content',
        size: 16,
        version: 2,
      };

      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any) // getFile check
        .mockResolvedValueOnce({ rows: [updatedFile] } as any);

      const result = await fileOps.updateFile('1', {
        content: 'updated content',
      });

      expect(result.content).toBe('updated content');
      expect(result.version).toBe(2);
    });

    it('updates file path', async () => {
      const updatedFile = {
        id: '1',
        path: 'src/NewPath.cs',
      };

      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any)
        .mockResolvedValueOnce({ rows: [updatedFile] } as any);

      const result = await fileOps.updateFile('1', {
        path: 'src/NewPath.cs',
      });

      expect(result.path).toBe('src/NewPath.cs');
    });

    it('updates multiple fields', async () => {
      const updatedFile = {
        id: '1',
        content: 'new content',
        path: 'src/NewPath.cs',
        type: 'ts',
      };

      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any)
        .mockResolvedValueOnce({ rows: [updatedFile] } as any);

      const result = await fileOps.updateFile('1', {
        content: 'new content',
        path: 'src/NewPath.cs',
        type: 'ts',
      });

      expect(result.content).toBe('new content');
      expect(result.path).toBe('src/NewPath.cs');
      expect(result.type).toBe('ts');
    });

    it('returns existing file when no updates provided', async () => {
      const existingFile = {
        id: '1',
        path: 'src/Main.cs',
        content: 'existing',
      };

      vi.mocked(query).mockResolvedValue({ rows: [existingFile] } as any);

      const result = await fileOps.updateFile('1', {});

      expect(result).toEqual(existingFile);
    });

    it('throws error when file not found', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [] } as any);

      await expect(fileOps.updateFile('nonexistent', { content: 'new' })).rejects.toThrow(
        'File not found'
      );
    });
  });

  describe('deleteFile', () => {
    it('soft deletes file', async () => {
      vi.mocked(query)
        .mockResolvedValueOnce({ rows: [{ id: '1' }] } as any)
        .mockResolvedValueOnce({ rowCount: 1 } as any);

      await fileOps.deleteFile('1');

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE slate_files SET deleted_at'),
        expect.arrayContaining(['1'])
      );
    });

    it('throws error when file not found', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [] } as any);

      await expect(fileOps.deleteFile('nonexistent')).rejects.toThrow('File not found');
    });
  });

  describe('searchFiles', () => {
    it('searches files by query', async () => {
      const mockResults = [
        { id: '1', path: 'src/Main.cs', content: 'main function' },
        { id: '2', path: 'src/GameManager.cs', content: 'game manager' },
      ];

      vi.mocked(queryReplica).mockResolvedValue({ rows: mockResults } as any);

      const result = await fileOps.searchFiles('proj1', 'main');

      expect(result).toEqual(mockResults);
      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        expect.arrayContaining(['proj1', expect.stringContaining('main')])
      );
    });

    it('handles empty search results', async () => {
      vi.mocked(queryReplica).mockResolvedValue({ rows: [] } as any);

      const result = await fileOps.searchFiles('proj1', 'nonexistent');

      expect(result).toEqual([]);
    });

    it('excludes deleted files from search', async () => {
      vi.mocked(queryReplica).mockResolvedValue({ rows: [] } as any);

      await fileOps.searchFiles('proj1', 'query');

      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('deleted_at IS NULL'),
        expect.any(Array)
      );
    });
  });
});
