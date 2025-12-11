/**
 * Sandpack File System Abstraction
 * Provides file system operations for the Ignition runtime
 */

import type { SandpackFile, SandpackFiles } from '@codesandbox/sandpack-react';

export interface SandpackFS {
  files: SandpackFiles;
  readFile: (path: string) => string | null;
  writeFile: (path: string, content: string) => void;
  deleteFile: (path: string) => void;
  createDirectory: (path: string) => void;
  listFiles: (path?: string) => string[];
  exists: (path: string) => boolean;
}

export class SandpackFileSystem implements SandpackFS {
  private _files: SandpackFiles;

  constructor(initialFiles: SandpackFiles = {}) {
    this._files = { ...initialFiles };
  }

  get files(): SandpackFiles {
    return this._files;
  }

  readFile(path: string): string | null {
    const file = this._files[path];
    if (!file) return null;
    
    if (typeof file === 'string') {
      return file;
    }
    
    if ('code' in file) {
      return file.code;
    }
    
    return null;
  }

  writeFile(path: string, content: string): void {
    this._files[path] = content;
  }

  deleteFile(path: string): void {
    delete this._files[path];
  }

  createDirectory(path: string): void {
    // In Sandpack, directories are implicit
    // This method exists for API consistency
    if (!path.endsWith('/')) {
      path += '/';
    }
    // No-op, directories are created automatically
  }

  listFiles(path: string = '/'): string[] {
    const prefix = path === '/' ? '' : path;
    return Object.keys(this._files).filter((filePath) => {
      if (prefix) {
        return filePath.startsWith(prefix) && filePath !== prefix;
      }
      return !filePath.includes('/') || filePath.split('/').length === 1;
    });
  }

  exists(path: string): boolean {
    return path in this._files;
  }

  updateFiles(files: SandpackFiles): void {
    this._files = { ...this._files, ...files };
  }
}

