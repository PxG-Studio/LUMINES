/**
 * Files Database Operations - Comprehensive Tests
 * StackBlitz-parity test coverage for file database operations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SlateFile } from '@/lib/database/types';
import * as fileOps from '@/lib/database/operations/files';
import { query, queryReplica } from '@/lib/database/client';
import { FSCorruptionSimulator } from '../../utils/fs-corruption';

// Type-safe fixture helper for SlateFile
const fileFixture = (partial: Partial<SlateFile>): SlateFile => ({
  id: 'file-default',
  project_id: 'project-default',
  path: 'default',
  content: null,
  type: null,
  size: 0,
  version: 1,
  encoding: 'utf-8',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  ...partial,
});

// Mock database client
vi.mock('@/lib/database/client', () => ({
  query: vi.fn(),
  queryReplica: vi.fn(),
  transaction: vi.fn(),
}));

describe('Files Database Operations - Comprehensive Tests', () => {
  let fsCorruption: FSCorruptionSimulator;

  beforeEach(() => {
    vi.clearAllMocks();
    fsCorruption = new FSCorruptionSimulator();
  });

  describe('createFile', () => {
    it('should create a file successfully', async () => {
      const mockFile = fileFixture({
        id: '1',
        project_id: 'p1',
        path: 'test.ts',
        content: 'console.log("test");',
        type: 'typescript',
        size: 20,
        encoding: 'utf-8',
      });

      vi.mocked(query).mockResolvedValue({
        rows: [mockFile],
      } as any);

      const result = await fileOps.createFile({
        project_id: 'p1',
        path: 'test.ts',
        content: 'console.log("test");',
        type: 'typescript',
        encoding: 'utf-8',
      });

      expect(result).toEqual(mockFile);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO slate_files'),
        ['p1', 'test.ts', 'console.log("test");', 'typescript', 20, 'utf-8']
      );
    });

    it('should calculate file size correctly', async () => {
      const content = 'a'.repeat(1000);
      const mockFile = fileFixture({
        id: '1',
        project_id: 'p1',
        path: 'large.ts',
        content,
        size: 1000,
        encoding: 'utf-8',
      });

      vi.mocked(query).mockResolvedValue({
        rows: [mockFile],
      } as any);

      const result = await fileOps.createFile({
        project_id: 'p1',
        path: 'large.ts',
        content,
      });

      expect(result.size).toBe(1000);
    });

    it('should handle null content', async () => {
      const mockFile = fileFixture({
        id: '1',
        project_id: 'p1',
        path: 'empty.ts',
        content: null,
        size: 0,
        encoding: 'utf-8',
      });

      vi.mocked(query).mockResolvedValue({
        rows: [mockFile],
      } as any);

      const result = await fileOps.createFile({
        project_id: 'p1',
        path: 'empty.ts',
        content: null,
      });

      expect(result.size).toBe(0);
    });

    it('should handle default encoding', async () => {
      const mockFile = fileFixture({
        id: '1',
        project_id: 'p1',
        path: 'test.ts',
        encoding: 'utf-8',
      });

      vi.mocked(query).mockResolvedValue({
        rows: [mockFile],
      } as any);

      await fileOps.createFile({
        project_id: 'p1',
        path: 'test.ts',
      });

      expect(query).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(['utf-8'])
      );
    });
  });

  describe('getFile', () => {
    it('should get file by ID', async () => {
      const mockFile = {
        id: '1',
        project_id: 'p1',
        path: 'test.ts',
        content: 'content',
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockFile],
      } as any);

      const result = await fileOps.getFile('1');

      expect(result).toEqual(mockFile);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM slate_files'),
        ['1']
      );
    });

    it('should return null for non-existent file', async () => {
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      const result = await fileOps.getFile('999');

      expect(result).toBeNull();
    });

    it('should exclude deleted files', async () => {
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      await fileOps.getFile('1');

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('deleted_at IS NULL'),
        ['1']
      );
    });
  });

  describe('getFileByPath', () => {
    it('should get file by path', async () => {
      const mockFile = {
        id: '1',
        project_id: 'p1',
        path: 'test.ts',
        content: 'content',
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockFile],
      } as any);

      const result = await fileOps.getFileByPath('p1', 'test.ts');

      expect(result).toEqual(mockFile);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('project_id = $1 AND path = $2'),
        ['p1', 'test.ts']
      );
    });

    it('should return null for non-existent path', async () => {
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      const result = await fileOps.getFileByPath('p1', 'nonexistent.ts');

      expect(result).toBeNull();
    });
  });

  describe('listFiles', () => {
    it('should list all files for project', async () => {
      const mockFiles = [
        { id: '1', project_id: 'p1', path: 'file1.ts' },
        { id: '2', project_id: 'p1', path: 'file2.ts' },
      ];

      vi.mocked(queryReplica).mockResolvedValue({
        rows: mockFiles,
      } as any);

      const result = await fileOps.listFiles('p1');

      expect(result).toEqual(mockFiles);
      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM slate_files'),
        ['p1']
      );
    });

    it('should order files by path', async () => {
      vi.mocked(queryReplica).mockResolvedValue({
        rows: [],
      } as any);

      await fileOps.listFiles('p1');

      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY path ASC'),
        ['p1']
      );
    });

    it('should exclude deleted files', async () => {
      vi.mocked(queryReplica).mockResolvedValue({
        rows: [],
      } as any);

      await fileOps.listFiles('p1');

      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('deleted_at IS NULL'),
        ['p1']
      );
    });
  });

  describe('updateFile', () => {
    it('should update file content', async () => {
      const mockFile = {
        id: '1',
        project_id: 'p1',
        path: 'test.ts',
        content: 'new content',
        size: 12,
        version: 2,
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockFile],
      } as any);

      const result = await fileOps.updateFile('1', {
        content: 'new content',
      });

      expect(result).toEqual(mockFile);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE slate_files'),
        expect.arrayContaining(['new content', 12, '1'])
      );
    });

    it('should increment version on content update', async () => {
      const mockFile = {
        id: '1',
        version: 2,
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockFile],
      } as any);

      await fileOps.updateFile('1', {
        content: 'new content',
      });

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('version = version + 1'),
        expect.any(Array)
      );
    });

    it('should update file path', async () => {
      const mockFile = {
        id: '1',
        path: 'renamed.ts',
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockFile],
      } as any);

      const result = await fileOps.updateFile('1', {
        path: 'renamed.ts',
      });

      expect(result.path).toBe('renamed.ts');
    });

    it('should update file type', async () => {
      const mockFile = {
        id: '1',
        type: 'javascript',
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockFile],
      } as any);

      const result = await fileOps.updateFile('1', {
        type: 'javascript',
      });

      expect(result.type).toBe('javascript');
    });

    it('should return existing file if no updates', async () => {
      const mockFile = {
        id: '1',
        path: 'test.ts',
      };

      vi.mocked(fileOps.getFile).mockResolvedValue(mockFile as any);

      const result = await fileOps.updateFile('1', {});

      expect(result).toEqual(mockFile);
      expect(query).not.toHaveBeenCalled();
    });

    it('should throw error if file not found', async () => {
      vi.mocked(fileOps.getFile).mockResolvedValue(null);
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      await expect(
        fileOps.updateFile('999', { content: 'new' })
      ).rejects.toThrow('File not found');
    });
  });

  describe('deleteFile', () => {
    it('should soft delete file', async () => {
      vi.mocked(query).mockResolvedValue({
        rows: [],
      } as any);

      await fileOps.deleteFile('1');

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE slate_files SET deleted_at'),
        ['1']
      );
    });
  });

  describe('searchFiles', () => {
    it('should search files by path', async () => {
      const mockFiles = [
        { id: '1', path: 'test.ts', content: 'test content' },
      ];

      vi.mocked(queryReplica).mockResolvedValue({
        rows: mockFiles,
      } as any);

      const result = await fileOps.searchFiles('p1', 'test');

      expect(result).toEqual(mockFiles);
      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('path ILIKE'),
        ['p1', '%test%']
      );
    });

    it('should search files by content', async () => {
      const mockFiles = [
        { id: '1', path: 'file.ts', content: 'test content' },
      ];

      vi.mocked(queryReplica).mockResolvedValue({
        rows: mockFiles,
      } as any);

      const result = await fileOps.searchFiles('p1', 'content');

      expect(result).toEqual(mockFiles);
      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('content ILIKE'),
        ['p1', '%content%']
      );
    });

    it('should search case-insensitively', async () => {
      vi.mocked(queryReplica).mockResolvedValue({
        rows: [],
      } as any);

      await fileOps.searchFiles('p1', 'TEST');

      expect(queryReplica).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.any(Array)
      );
    });
  });

  describe('buildFileTree', () => {
    it('should build tree from flat file list', () => {
      const files: SlateFile[] = [
        fileFixture({ id: '1', path: 'src/file1.ts', project_id: 'p1', size: 1, version: 1 }),
        fileFixture({ id: '2', path: 'src/file2.ts', project_id: 'p1', size: 1, version: 1 }),
        fileFixture({ id: '3', path: 'assets/image.png', project_id: 'p1', size: 1, version: 1 }),
      ];

      const tree = fileOps.buildFileTree(files);

      expect(tree.length).toBeGreaterThan(0);
      const srcNode = tree.find((node: any) => node.name === 'src');
      expect(srcNode).toBeDefined();
      expect(srcNode?.type).toBe('folder');
      expect(srcNode?.children?.length).toBe(2);
    });

    it('should handle deeply nested paths', () => {
      const files: SlateFile[] = [
        fileFixture({ id: '1', path: 'a/b/c/d/e/file.ts', project_id: 'p1', size: 1, version: 1 }),
      ];

      const tree = fileOps.buildFileTree(files);
      expect(tree.length).toBeGreaterThan(0);
    });

    it('should preserve file data in tree nodes', () => {
      const files: SlateFile[] = [
        fileFixture({ id: '1', path: 'test.ts', project_id: 'p1', type: 'typescript', size: 1, version: 1 }),
      ];

      const tree = fileOps.buildFileTree(files);
      const fileNode = tree.find((node: any) => node.name === 'test.ts');
      expect(fileNode?.fileData).toBeDefined();
      expect(fileNode?.fileData?.type).toBe('typescript');
    });

    it('should handle empty file list', () => {
      const tree = fileOps.buildFileTree([]);
      expect(tree).toEqual([]);
    });

    it('should generate unique folder IDs', () => {
      const files: SlateFile[] = [
        fileFixture({ id: '1', path: 'dir/file1.ts', project_id: 'p1', size: 1, version: 1 }),
        fileFixture({ id: '2', path: 'dir/file2.ts', project_id: 'p1', size: 1, version: 1 }),
      ];

      const tree = fileOps.buildFileTree(files);
      const dirNode = tree.find((node: any) => node.name === 'dir');
      expect(dirNode?.id).toBe('folder-dir');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long file paths', async () => {
      const longPath = 'a'.repeat(1000) + '.ts';
      const mockFile = {
        id: '1',
        project_id: 'p1',
        path: longPath,
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockFile],
      } as any);

      const result = await fileOps.createFile({
        project_id: 'p1',
        path: longPath,
        content: 'content',
      });

      expect(result.path).toBe(longPath);
    });

    it('should handle special characters in paths', async () => {
      const specialPath = 'test@#$%^&*().ts';
      const mockFile = {
        id: '1',
        project_id: 'p1',
        path: specialPath,
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockFile],
      } as any);

      const result = await fileOps.createFile({
        project_id: 'p1',
        path: specialPath,
        content: 'content',
      });

      expect(result.path).toBe(specialPath);
    });

    it('should handle concurrent updates', async () => {
      const mockFile = {
        id: '1',
        version: 3,
      };

      vi.mocked(query).mockResolvedValue({
        rows: [mockFile],
      } as any);

      const promises = Array.from({ length: 5 }, () =>
        fileOps.updateFile('1', { content: 'new' })
      );

      await Promise.all(promises);
      expect(query).toHaveBeenCalledTimes(5);
    });
  });
});

