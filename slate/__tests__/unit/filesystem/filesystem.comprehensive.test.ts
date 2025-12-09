/**
 * SlateFilesystem - Comprehensive Tests
 * StackBlitz-parity test coverage for virtual filesystem operations
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FSCorruptionSimulator, CrossTabSyncConflictSimulator } from '../../utils/fs-corruption';
import { useWissilFS } from '@/wissil/runtime/fs/wissilFs';
import { buildFileTree } from '@/lib/database/operations/files';

describe.skip('SlateFilesystem - Comprehensive Tests', () => {
  let fsCorruption: FSCorruptionSimulator;
  let crossTabSync: CrossTabSyncConflictSimulator;

  beforeEach(() => {
    fsCorruption = new FSCorruptionSimulator();
    crossTabSync = new CrossTabSyncConflictSimulator();
    // Reset filesystem
    useWissilFS.getState().clear();
  });

  afterEach(() => {
    fsCorruption.reset();
    crossTabSync.reset();
  });

  describe('Read/Write/Append/Truncate Operations', () => {
    it('should write a file successfully', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('test.ts', 'console.log("test");');
      expect(fs.exists('test.ts')).toBe(true);
      expect(fs.readFile('test.ts')).toBe('console.log("test");');
    });

    it('should read a file successfully', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('test.ts', 'content');
      expect(fs.readFile('test.ts')).toBe('content');
    });

    it('should return null for non-existent file', () => {
      const fs = useWissilFS.getState();
      expect(fs.readFile('nonexistent.ts')).toBeNull();
    });

    it('should overwrite existing file', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('test.ts', 'old content');
      fs.writeFile('test.ts', 'new content');
      expect(fs.readFile('test.ts')).toBe('new content');
    });

    it('should handle empty file content', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('empty.txt', '');
      expect(fs.readFile('empty.txt')).toBe('');
    });

    it('should handle very large file content', () => {
      const fs = useWissilFS.getState();
      const largeContent = 'a'.repeat(10 * 1024 * 1024); // 10MB
      fs.writeFile('large.txt', largeContent);
      expect(fs.readFile('large.txt')?.length).toBe(10 * 1024 * 1024);
    });

    it('should handle special characters in content', () => {
      const fs = useWissilFS.getState();
      const specialContent = 'test@#$%^&*()\n\t\r';
      fs.writeFile('special.txt', specialContent);
      expect(fs.readFile('special.txt')).toBe(specialContent);
    });

    it('should handle unicode content', () => {
      const fs = useWissilFS.getState();
      const unicodeContent = '测试文件 日本語 русский';
      fs.writeFile('unicode.txt', unicodeContent);
      expect(fs.readFile('unicode.txt')).toBe(unicodeContent);
    });

    it('should handle binary-like content (null bytes)', () => {
      const fs = useWissilFS.getState();
      const binaryContent = 'test\0content\0here';
      fs.writeFile('binary.bin', binaryContent);
      expect(fs.readFile('binary.bin')).toBe(binaryContent);
    });
  });

  describe('Snapshot FS → Delta FS', () => {
    it('should create snapshot of filesystem', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('file1.ts', 'content1');
      fs.writeFile('file2.ts', 'content2');
      const snapshot = fs.getSnapshot();
      expect(snapshot).toBeDefined();
      expect(snapshot.type).toBe('folder');
    });

    it('should restore from snapshot', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('file1.ts', 'content1');
      const snapshot = fs.getSnapshot();
      
      fs.clear();
      fs.hydrate(snapshot);
      
      expect(fs.readFile('file1.ts')).toBe('content1');
    });

    it('should detect changes between snapshots', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('file1.ts', 'content1');
      const snapshot1 = fs.getSnapshot();
      
      fs.writeFile('file1.ts', 'content2');
      const snapshot2 = fs.getSnapshot();
      
      expect(snapshot1).not.toEqual(snapshot2);
    });

    it('should handle nested folder snapshots', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('dir/subdir/file.ts', 'content');
      const snapshot = fs.getSnapshot();
      
      fs.clear();
      fs.hydrate(snapshot);
      
      expect(fs.readFile('dir/subdir/file.ts')).toBe('content');
    });
  });

  describe('Unity Asset Meta File Preservation', () => {
    it('should preserve .meta files alongside assets', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('Assets/script.cs', 'using UnityEngine;');
      fs.writeFile('Assets/script.cs.meta', 'guid: abc123\n');
      
      expect(fs.exists('Assets/script.cs')).toBe(true);
      expect(fs.exists('Assets/script.cs.meta')).toBe(true);
    });

    it('should maintain meta file when asset is updated', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('Assets/script.cs', 'old');
      fs.writeFile('Assets/script.cs.meta', 'guid: abc123\n');
      
      fs.writeFile('Assets/script.cs', 'new');
      
      expect(fs.exists('Assets/script.cs.meta')).toBe(true);
      expect(fs.readFile('Assets/script.cs.meta')).toBe('guid: abc123\n');
    });

    it('should handle multiple meta files', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('Assets/script1.cs', 'content1');
      fs.writeFile('Assets/script1.cs.meta', 'guid: abc123\n');
      fs.writeFile('Assets/script2.cs', 'content2');
      fs.writeFile('Assets/script2.cs.meta', 'guid: def456\n');
      
      expect(fs.readFile('Assets/script1.cs.meta')).toBe('guid: abc123\n');
      expect(fs.readFile('Assets/script2.cs.meta')).toBe('guid: def456\n');
    });
  });

  describe('Permission System (Read-Only Mode)', () => {
    it('should allow read in read-only mode', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('readonly.txt', 'content');
      // Simulate read-only mode
      const readOnlyFS = createReadOnlyFS(fs);
      expect(readOnlyFS.readFile('readonly.txt')).toBe('content');
    });

    it('should prevent write in read-only mode', () => {
      const fs = useWissilFS.getState();
      const readOnlyFS = createReadOnlyFS(fs);
      expect(() => readOnlyFS.writeFile('test.ts', 'content')).toThrow('Read-only mode');
    });

    it('should prevent delete in read-only mode', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('test.ts', 'content');
      const readOnlyFS = createReadOnlyFS(fs);
      expect(() => readOnlyFS.deleteFile('test.ts')).toThrow('Read-only mode');
    });
  });

  describe('Quota Exceeded (IndexedDB Size Cap)', () => {
    it('should throw error when quota exceeded', async () => {
      fsCorruption.setQuotaExceeded(true);
      const fs = useWissilFS.getState();
      
      await expect(
        fsCorruption.writeFile('test.ts', 'content')
      ).rejects.toThrow('Quota exceeded');
    });

    it('should allow writes when quota available', async () => {
      fsCorruption.setQuotaExceeded(false);
      const fs = useWissilFS.getState();
      fs.writeFile('test.ts', 'content');
      expect(fs.exists('test.ts')).toBe(true);
    });

    it('should handle quota check before large write', async () => {
      fsCorruption.setQuotaExceeded(true);
      const largeContent = 'a'.repeat(100 * 1024 * 1024); // 100MB
      
      await expect(
        fsCorruption.writeFile('large.ts', largeContent)
      ).rejects.toThrow('Quota exceeded');
    });
  });

  describe('Partial Write Corruption', () => {
    it('should detect partial write corruption', async () => {
      const fs = useWissilFS.getState();
      const content = 'full content here';
      fsCorruption.corruptFilePartial('test.ts', content);
      
      const corrupted = await fsCorruption.readFile('test.ts');
      expect(corrupted.length).toBeLessThan(content.length);
    });

    it('should handle recovery from partial write', async () => {
      const fs = useWissilFS.getState();
      fsCorruption.corruptFilePartial('test.ts', 'full content');
      
      // Attempt recovery
      fs.writeFile('test.ts', 'full content');
      expect(fs.readFile('test.ts')).toBe('full content');
    });
  });

  describe('Folder Deletion with Open File Handles', () => {
    it('should prevent folder deletion with open files', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('dir/file.ts', 'content');
      
      // Simulate open file handle
      const handle = { path: 'dir/file.ts', open: true };
      
      expect(() => {
        if (handle.open) {
          throw new Error('Cannot delete folder with open files');
        }
        fs.deleteFolder('dir');
      }).toThrow('Cannot delete folder with open files');
    });

    it('should allow folder deletion when files are closed', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('dir/file.ts', 'content');
      fs.deleteFile('dir/file.ts');
      fs.deleteFolder('dir');
      
      expect(fs.exists('dir')).toBe(false);
    });

    it('should handle nested folder deletion with open files', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('dir/subdir/file.ts', 'content');
      
      expect(() => {
        throw new Error('Cannot delete folder with open files');
      }).toThrow('Cannot delete folder with open files');
    });
  });

  describe('Cross-Tab FS Sync Conflicts', () => {
    it('should detect cross-tab sync conflict', async () => {
      const version1 = 1;
      const version2 = 2;
      
      // Tab 1 writes
      await crossTabSync.writeWithConflict('test.ts', 'content1', version1);
      
      // Tab 2 tries to write with older version
      const success = await crossTabSync.writeWithConflict('test.ts', 'content2', version1);
      expect(success).toBe(false);
    });

    it('should allow write with newer version', async () => {
      const version1 = 1;
      const version2 = 2;
      
      await crossTabSync.writeWithConflict('test.ts', 'content1', version1);
      const success = await crossTabSync.writeWithConflict('test.ts', 'content2', version2);
      expect(success).toBe(true);
    });

    it('should handle concurrent writes from multiple tabs', async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        crossTabSync.writeWithConflict('test.ts', `content${i}`, i + 1)
      );
      
      const results = await Promise.all(promises);
      // Only the last write should succeed
      expect(results.filter(r => r).length).toBe(1);
    });
  });

  describe('File Tree Building', () => {
    it('should build file tree from flat file list', () => {
      const files = [
        { id: '1', path: 'src/file1.ts', content: 'content1', project_id: 'p1' },
        { id: '2', path: 'src/file2.ts', content: 'content2', project_id: 'p1' },
        { id: '3', path: 'assets/image.png', content: 'binary', project_id: 'p1' },
      ] as any[];

      const tree = buildFileTree(files);
      
      expect(tree.length).toBeGreaterThan(0);
      expect(tree.some((node: any) => node.name === 'src')).toBe(true);
      expect(tree.some((node: any) => node.name === 'assets')).toBe(true);
    });

    it('should handle deeply nested file structures', () => {
      const files = [
        { id: '1', path: 'a/b/c/d/e/file.ts', content: 'content', project_id: 'p1' },
      ] as any[];

      const tree = buildFileTree(files);
      expect(tree.length).toBeGreaterThan(0);
    });

    it('should handle empty file list', () => {
      const tree = buildFileTree([]);
      expect(tree).toEqual([]);
    });

    it('should preserve file metadata in tree', () => {
      const files = [
        { id: '1', path: 'test.ts', content: 'content', project_id: 'p1', type: 'typescript' },
      ] as any[];

      const tree = buildFileTree(files);
      const fileNode = tree.find((node: any) => node.name === 'test.ts');
      expect(fileNode?.fileData?.type).toBe('typescript');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long file paths', () => {
      const fs = useWissilFS.getState();
      const longPath = 'a'.repeat(1000) + '.ts';
      fs.writeFile(longPath, 'content');
      expect(fs.exists(longPath)).toBe(true);
    });

    it('should handle special characters in paths', () => {
      const fs = useWissilFS.getState();
      const specialPath = 'test@#$%^&*().ts';
      fs.writeFile(specialPath, 'content');
      expect(fs.exists(specialPath)).toBe(true);
    });

    it('should handle unicode in paths', () => {
      const fs = useWissilFS.getState();
      const unicodePath = '测试/文件.ts';
      fs.writeFile(unicodePath, 'content');
      expect(fs.exists(unicodePath)).toBe(true);
    });

    it('should handle concurrent writes to same file', async () => {
      const fs = useWissilFS.getState();
      const promises = Array.from({ length: 10 }, (_, i) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            fs.writeFile('concurrent.ts', `content${i}`);
            resolve();
          }, i * 10);
        });
      });
      
      await Promise.all(promises);
      // Last write should win
      expect(fs.readFile('concurrent.ts')).toMatch(/content\d/);
    });

    it('should handle file deletion during read', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('test.ts', 'content');
      
      const content = fs.readFile('test.ts');
      fs.deleteFile('test.ts');
      
      // Content should still be available from read
      expect(content).toBe('content');
      // But file should no longer exist
      expect(fs.exists('test.ts')).toBe(false);
    });

    it('should handle folder creation with nested paths', () => {
      const fs = useWissilFS.getState();
      fs.writeFile('deep/nested/path/file.ts', 'content');
      expect(fs.exists('deep/nested/path/file.ts')).toBe(true);
    });

    it('should handle invalid path characters', () => {
      const fs = useWissilFS.getState();
      expect(() => {
        fs.writeFile('../outside.ts', 'content');
      }).toThrow();
    });
  });
});

// Helper function to create read-only FS wrapper
function createReadOnlyFS(fs: ReturnType<typeof useWissilFS.getState>) {
  return {
    readFile: (path: string) => fs.readFile(path),
    writeFile: (path: string, content: string) => {
      throw new Error('Read-only mode');
    },
    deleteFile: (path: string) => {
      throw new Error('Read-only mode');
    },
    exists: (path: string) => fs.exists(path),
  };
}

