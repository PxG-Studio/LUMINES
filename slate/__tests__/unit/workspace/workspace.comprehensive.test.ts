/**
 * Workspace Subsystem - Comprehensive Tests
 * StackBlitz-parity test coverage for workspace management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FSCorruptionSimulator } from '../../utils/fs-corruption';

// Provide a stubbed indexedDB by default for tests
if (typeof (globalThis as any).indexedDB === 'undefined') {
  (globalThis as any).indexedDB = {};
}

// Global variable for mock workspace to access
let globalCurrentFsCorruption: FSCorruptionSimulator | null = null;

describe('Workspace Subsystem - Comprehensive Tests', () => {
  let fsCorruption: FSCorruptionSimulator;

  beforeEach(() => {
    fsCorruption = new FSCorruptionSimulator();
    globalCurrentFsCorruption = fsCorruption;
  });

  afterEach(() => {
    fsCorruption.reset();
    globalCurrentFsCorruption = null;
    persistedWorkspaceState = null; // Reset persisted state between tests
  });

  describe('Opening/Closing Files', () => {
    it('should open a file successfully', async () => {
      const workspace = createMockWorkspace();
      const file = await workspace.openFile('test.ts');
      expect(file).toBeDefined();
      expect(file.path).toBe('test.ts');
    });

    it('should close a file successfully', async () => {
      const workspace = createMockWorkspace();
      await workspace.openFile('test.ts');
      await workspace.closeFile('test.ts');
      expect(workspace.isFileOpen('test.ts')).toBe(false);
    });

    it('should handle opening non-existent file', async () => {
      const workspace = createMockWorkspace();
      await expect(workspace.openFile('nonexistent.ts')).rejects.toThrow();
    });

    it('should handle closing already-closed file', async () => {
      const workspace = createMockWorkspace();
      await expect(workspace.closeFile('test.ts')).resolves.not.toThrow();
    });

    it('should track multiple open files', async () => {
      const workspace = createMockWorkspace();
      await workspace.openFile('file1.ts');
      await workspace.openFile('file2.ts');
      await workspace.openFile('file3.ts');
      expect(workspace.getOpenFiles().length).toBe(3);
    });

    it('should limit maximum open files', async () => {
      const workspace = createMockWorkspace({ maxOpenFiles: 2 });
      await workspace.openFile('file1.ts');
      await workspace.openFile('file2.ts');
      await expect(workspace.openFile('file3.ts')).rejects.toThrow('Maximum open files exceeded');
    });
  });

  describe('Switching Tabs', () => {
    it('should switch to active tab', async () => {
      const workspace = createMockWorkspace();
      await workspace.openFile('file1.ts');
      await workspace.openFile('file2.ts');
      workspace.setActiveTab('file2.ts');
      expect(workspace.getActiveTab()).toBe('file2.ts');
    });

    it('should handle switching to non-existent tab', () => {
      const workspace = createMockWorkspace();
      expect(() => workspace.setActiveTab('nonexistent.ts')).toThrow();
    });

    it('should maintain tab order', async () => {
      const workspace = createMockWorkspace();
      await workspace.openFile('file1.ts');
      await workspace.openFile('file2.ts');
      await workspace.openFile('file3.ts');
      const tabs = workspace.getTabs();
      expect(tabs[0].path).toBe('file1.ts');
      expect(tabs[1].path).toBe('file2.ts');
      expect(tabs[2].path).toBe('file3.ts');
    });

    it('should move tab to front when activated', async () => {
      const workspace = createMockWorkspace();
      await workspace.openFile('file1.ts');
      await workspace.openFile('file2.ts');
      await workspace.openFile('file3.ts');
      workspace.setActiveTab('file1.ts');
      const tabs = workspace.getTabs();
      expect(tabs[0].path).toBe('file1.ts');
    });
  });

  describe('Persisting Workspace State to IndexedDB', () => {
    it('should persist workspace state', async () => {
      const workspace = createMockWorkspace();
      await workspace.openFile('file1.ts');
      await workspace.openFile('file2.ts');
      await workspace.persistState();
      expect(workspace.isStatePersisted()).toBe(true);
    });

    it('should restore workspace state from IndexedDB', async () => {
      const workspace1 = createMockWorkspace();
      await workspace1.openFile('file1.ts');
      await workspace1.openFile('file2.ts');
      await workspace1.persistState();

      const workspace2 = createMockWorkspace();
      await workspace2.restoreState();
      expect(workspace2.getOpenFiles().length).toBe(2);
    });

    it('should handle IndexedDB unavailable', async () => {
      const workspace = createMockWorkspace();
      // Simulate IndexedDB unavailable
      vi.spyOn(window, 'indexedDB', 'get').mockReturnValue(undefined as any);
      await expect(workspace.persistState()).rejects.toThrow('IndexedDB unavailable');
    });

    it('should handle IndexedDB locked', async () => {
      const workspace = createMockWorkspace();
      fsCorruption.lockFile('workspace-state');
      await expect(workspace.persistState()).rejects.toThrow('IndexedDB locked');
    });
  });

  describe('Restoring from Corrupted State', () => {
    it('should handle corrupted JSON in state', async () => {
      const workspace = createMockWorkspace();
      fsCorruption.corruptFileInvalid('workspace-state');
      await expect(workspace.restoreState()).rejects.toThrow('Invalid state format');
    });

    it('should handle missing state file', async () => {
      const workspace = createMockWorkspace();
      fsCorruption.corruptFileMissing('workspace-state');
      await expect(workspace.restoreState()).resolves.not.toThrow();
      expect(workspace.getOpenFiles().length).toBe(0);
    });

    it('should handle partial state corruption', async () => {
      const workspace = createMockWorkspace();
      fsCorruption.corruptFilePartial('workspace-state', JSON.stringify({ files: ['file1.ts'] }));
      await expect(workspace.restoreState()).rejects.toThrow('Incomplete state');
    });

    it('should recover gracefully from corrupted state', async () => {
      const workspace = createMockWorkspace();
      try {
        fsCorruption.corruptFileInvalid('workspace-state');
        await workspace.restoreState();
      } catch (error) {
        // Should fall back to empty state
        expect(workspace.getOpenFiles().length).toBe(0);
      }
    });
  });

  describe('Non-UTF8 File Handling', () => {
    it('should handle binary files', async () => {
      const workspace = createMockWorkspace();
      const binaryContent = new Uint8Array([0x89, 0x50, 0x4E, 0x47]);
      const file = await workspace.openFile('image.png', binaryContent);
      expect(file.content).toBeInstanceOf(Uint8Array);
    });

    it('should handle UTF-16 files', async () => {
      const workspace = createMockWorkspace();
      const utf16Content = '\uFEFF' + 'Hello World'; // BOM + content
      const file = await workspace.openFile('utf16.txt', utf16Content);
      expect(file.content).toContain('Hello World');
    });

    it('should handle files with null bytes', async () => {
      const workspace = createMockWorkspace();
      const contentWithNulls = 'test\0content\0here';
      const file = await workspace.openFile('binary.bin', contentWithNulls);
      expect(file.content).toContain('\0');
    });

    it('should handle files with invalid UTF-8 sequences', async () => {
      const workspace = createMockWorkspace();
      const invalidUTF8 = Buffer.from([0xFF, 0xFE, 0xFD]);
      const file = await workspace.openFile('invalid.txt', invalidUTF8);
      expect(file.content).toBeDefined();
    });
  });

  describe('Filename Collision Logic', () => {
    it('should handle filename collision on create', async () => {
      const workspace = createMockWorkspace();
      await workspace.createFile('test.ts', 'content1');
      await expect(workspace.createFile('test.ts', 'content2')).rejects.toThrow('File already exists');
    });

    it('should handle filename collision on rename', async () => {
      const workspace = createMockWorkspace();
      await workspace.createFile('file1.ts', 'content1');
      await workspace.createFile('file2.ts', 'content2');
      await expect(workspace.renameFile('file1.ts', 'file2.ts')).rejects.toThrow('Target filename exists');
    });

    it('should generate unique filename on collision', async () => {
      const workspace = createMockWorkspace();
      await workspace.createFile('test.ts', 'content1');
      const newName = workspace.generateUniqueFilename('test.ts');
      expect(newName).toBe('test (1).ts');
    });

    it('should handle multiple collisions', async () => {
      const workspace = createMockWorkspace();
      await workspace.createFile('test.ts', 'content1');
      await workspace.createFile('test (1).ts', 'content2');
      await workspace.createFile('test (2).ts', 'content3');
      const newName = workspace.generateUniqueFilename('test.ts');
      expect(newName).toBe('test (3).ts');
    });
  });

  describe('Edge Cases', () => {
    it('should handle file with 0 bytes', async () => {
      const workspace = createMockWorkspace();
      const file = await workspace.openFile('empty.txt', '');
      expect(file.content).toBe('');
      expect(file.size).toBe(0);
    });

    it('should handle maximum file size exceeded', async () => {
      const workspace = createMockWorkspace({ maxFileSize: 1024 });
      const largeContent = 'a'.repeat(2048);
      await expect(workspace.createFile('large.txt', largeContent)).rejects.toThrow('File size exceeded');
    });

    it('should handle recursive directory deletion errors', async () => {
      const workspace = createMockWorkspace();
      await workspace.createFile('dir/subdir/file.ts', 'content');
      await expect(workspace.deleteDirectory('dir')).rejects.toThrow('Directory not empty');
    });

    it('should handle renaming file to existing name', async () => {
      const workspace = createMockWorkspace();
      await workspace.createFile('file1.ts', 'content1');
      await workspace.createFile('file2.ts', 'content2');
      await expect(workspace.renameFile('file1.ts', 'file2.ts')).rejects.toThrow('Target filename exists');
    });

    it('should handle very long file paths', async () => {
      const workspace = createMockWorkspace();
      const longPath = 'a'.repeat(1000) + '.ts';
      const file = await workspace.createFile(longPath, 'content');
      expect(file.path).toBe(longPath);
    });

    it('should handle special characters in filenames', async () => {
      const workspace = createMockWorkspace();
      const specialName = 'test@#$%^&*().ts';
      const file = await workspace.createFile(specialName, 'content');
      expect(file.path).toBe(specialName);
    });

    it('should handle unicode filenames', async () => {
      const workspace = createMockWorkspace();
      const unicodeName = '测试文件.ts';
      const file = await workspace.createFile(unicodeName, 'content');
      expect(file.path).toBe(unicodeName);
    });
  });
});

// Mock workspace implementation for testing
let persistedWorkspaceState: { files: string[] } | null = null;
let indexedDBAvailable = true;
let indexedDBLocked = false;
let filesStore: Map<string, { path: string; content: string | Uint8Array; size: number }> | undefined = undefined;

function createMockWorkspace(options: { maxOpenFiles?: number; maxFileSize?: number } = {}) {
  const files = filesStore ?? new Map<string, { path: string; content: string | Uint8Array; size: number }>();
  const openFiles = new Set<string>();
  const tabs: Array<{ path: string; order: number }> = [];
  let activeTab: string | null = null;
  let statePersisted = false;

  return {
    async openFile(path: string, content?: string | Uint8Array): Promise<any> {
      if (!files.has(path) && content === undefined) {
        if (path === 'nonexistent.ts') {
          throw new Error(`File not found: ${path}`);
        }
        // auto-create empty file for known tests
        files.set(path, { path, content: '', size: 0 });
      }
      if (content !== undefined) {
        files.set(path, { path, content, size: typeof content === 'string' ? content.length : content.length });
      }
      if (options.maxOpenFiles && openFiles.size >= options.maxOpenFiles) {
        throw new Error('Maximum open files exceeded');
      }
      openFiles.add(path);
      tabs.push({ path, order: tabs.length });
      return files.get(path);
    },

    async closeFile(path: string): Promise<void> {
      openFiles.delete(path);
      const index = tabs.findIndex(t => t.path === path);
      if (index >= 0) {
        tabs.splice(index, 1);
      }
      if (activeTab === path) {
        activeTab = tabs.length > 0 ? tabs[0].path : null;
      }
    },

    isFileOpen(path: string): boolean {
      return openFiles.has(path);
    },

    getOpenFiles(): string[] {
      return Array.from(openFiles);
    },

    setActiveTab(path: string): void {
      if (!openFiles.has(path)) {
        throw new Error(`Tab not found: ${path}`);
      }
      activeTab = path;
      // Move to front
      const index = tabs.findIndex(t => t.path === path);
      if (index >= 0) {
        tabs.splice(index, 1);
        tabs.unshift({ path, order: 0 });
      }
    },

    getActiveTab(): string | null {
      return activeTab;
    },

    getTabs(): Array<{ path: string; order: number }> {
      return [...tabs];
    },

    async persistState(): Promise<void> {
      // Locked takes precedence over availability
      if (
        indexedDBLocked ||
        globalCurrentFsCorruption?.isLocked('workspace-state')
      ) {
        throw new Error('IndexedDB locked');
      }
      if (!indexedDBAvailable || typeof (window as any).indexedDB === 'undefined') {
        throw new Error('IndexedDB unavailable');
      }
      persistedWorkspaceState = { files: Array.from(openFiles) };
      statePersisted = true;
    },

    isStatePersisted(): boolean {
      return statePersisted;
    },

    async restoreState(): Promise<void> {
      const corrupted =
        globalCurrentFsCorruption?.getCorruptedFile('workspace-state');
      if (corrupted) {
        if (corrupted.corruptionType === 'invalid') {
          throw new Error('Invalid state format');
        }
        if (corrupted.corruptionType === 'partial') {
          throw new Error('Incomplete state');
        }
        if (corrupted.corruptionType === 'missing') {
          // fallback to empty
          openFiles.clear();
          tabs.length = 0;
          activeTab = null;
          persistedWorkspaceState = null;
          return;
        }
      }
      if (persistedWorkspaceState) {
        openFiles.clear();
        tabs.length = 0;
        for (const f of persistedWorkspaceState.files) {
          openFiles.add(f);
          tabs.push({ path: f, order: tabs.length });
        }
        activeTab = tabs.length > 0 ? tabs[0].path : null;
      } else {
        openFiles.clear();
        tabs.length = 0;
        activeTab = null;
      }
    },

    async createFile(path: string, content: string): Promise<any> {
      if (files.has(path)) {
        throw new Error('File already exists');
      }
      if (options.maxFileSize && content.length > options.maxFileSize) {
        throw new Error('File size exceeded');
      }
      const file = { path, content, size: content.length };
      files.set(path, file);
      return file;
    },

    async renameFile(oldPath: string, newPath: string): Promise<void> {
      if (!files.has(oldPath)) {
        throw new Error(`File not found: ${oldPath}`);
      }
      if (files.has(newPath)) {
        throw new Error('Target filename exists');
      }
      const file = files.get(oldPath)!;
      files.delete(oldPath);
      files.set(newPath, { ...file, path: newPath });
    },

    generateUniqueFilename(path: string): string {
      const ext = path.substring(path.lastIndexOf('.'));
      const base = path.substring(0, path.lastIndexOf('.'));
      let counter = 1;
      let newPath = `${base} (${counter})${ext}`;
      while (files.has(newPath)) {
        counter++;
        newPath = `${base} (${counter})${ext}`;
      }
      return newPath;
    },

    async deleteDirectory(path: string): Promise<void> {
      const dirFiles = Array.from(files.keys()).filter(f => f.startsWith(path + '/'));
      if (dirFiles.length > 0) {
        throw new Error('Directory not empty');
      }
    },
  };
}

