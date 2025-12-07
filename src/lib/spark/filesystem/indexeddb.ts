/**
 * IndexedDB File System
 * 
 * Provides file and directory operations using IndexedDB for browser-side persistence
 */

interface FileEntry {
  path: string;
  content: string;
  type: 'file' | 'directory';
  createdAt: number;
  updatedAt: number;
  size: number;
}

interface DirectoryEntry {
  path: string;
  children: string[];
  createdAt: number;
  updatedAt: number;
}

class IndexedDBFileSystem {
  private dbName = 'spark-filesystem';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  /**
   * Initialize the database
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('files')) {
          const fileStore = db.createObjectStore('files', { keyPath: 'path' });
          fileStore.createIndex('type', 'type', { unique: false });
          fileStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('directories')) {
          const dirStore = db.createObjectStore('directories', { keyPath: 'path' });
          dirStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });
  }

  /**
   * Ensure database is initialized
   */
  private async ensureInit(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
  }

  /**
   * Write a file
   */
  async writeFile(path: string, content: string): Promise<void> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');

      const entry: FileEntry = {
        path,
        content,
        type: 'file',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        size: new Blob([content]).size,
      };

      const request = store.put(entry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // Update parent directory
        this.updateDirectory(path).then(resolve).catch(reject);
      };
    });
  }

  /**
   * Read a file
   */
  async readFile(path: string): Promise<string> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.get(path);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entry = request.result as FileEntry | undefined;
        if (!entry) {
          reject(new Error(`File not found: ${path}`));
        } else {
          resolve(entry.content);
        }
      };
    });
  }

  /**
   * Check if file exists
   */
  async fileExists(path: string): Promise<boolean> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.get(path);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(!!request.result);
      };
    });
  }

  /**
   * Delete a file
   */
  async deleteFile(path: string): Promise<void> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.delete(path);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // Update parent directory
        this.updateDirectory(path, true).then(resolve).catch(reject);
      };
    });
  }

  /**
   * Create a directory
   */
  async createDirectory(path: string): Promise<void> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    // Normalize path
    const normalizedPath = path.endsWith('/') ? path : `${path}/`;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['directories'], 'readwrite');
      const store = transaction.objectStore('directories');

      const entry: DirectoryEntry = {
        path: normalizedPath,
        children: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const request = store.put(entry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // Update parent directory
        this.updateDirectory(normalizedPath).then(resolve).catch(reject);
      };
    });
  }

  /**
   * List directory contents
   */
  async listDirectory(path: string): Promise<string[]> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    const normalizedPath = path.endsWith('/') ? path : `${path}/`;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['directories'], 'readonly');
      const store = transaction.objectStore('directories');
      const request = store.get(normalizedPath);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entry = request.result as DirectoryEntry | undefined;
        if (!entry) {
          resolve([]);
        } else {
          resolve(entry.children);
        }
      };
    });
  }

  /**
   * Delete a directory
   */
  async deleteDirectory(path: string): Promise<void> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    const normalizedPath = path.endsWith('/') ? path : `${path}/`;

    // List all files in directory and subdirectories
    const files = await this.listFilesRecursive(normalizedPath);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files', 'directories'], 'readwrite');
      const fileStore = transaction.objectStore('files');
      const dirStore = transaction.objectStore('directories');

      // Delete all files
      let completed = 0;
      const total = files.length + 1; // +1 for directory itself

      if (files.length === 0) {
        completed = 1;
      } else {
        files.forEach((filePath) => {
          const request = fileStore.delete(filePath);
          request.onsuccess = () => {
            completed++;
            if (completed === total) {
              const dirRequest = dirStore.delete(normalizedPath);
              dirRequest.onsuccess = () => resolve();
              dirRequest.onerror = () => reject(dirRequest.error);
            }
          };
          request.onerror = () => reject(request.error);
        });
      }

      // Delete directory
      if (completed === total - 1) {
        const dirRequest = dirStore.delete(normalizedPath);
        dirRequest.onsuccess = () => resolve();
        dirRequest.onerror = () => reject(dirRequest.error);
      }
    });
  }

  /**
   * List all files recursively
   */
  private async listFilesRecursive(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    const dirs = [dirPath];

    while (dirs.length > 0) {
      const currentDir = dirs.shift()!;
      const children = await this.listDirectory(currentDir);

      for (const child of children) {
        const fullPath = `${currentDir}${child}`;
        const isDir = await this.directoryExists(fullPath);

        if (isDir) {
          dirs.push(fullPath);
        } else {
          files.push(fullPath);
        }
      }
    }

    return files;
  }

  /**
   * Check if directory exists
   */
  async directoryExists(path: string): Promise<boolean> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    const normalizedPath = path.endsWith('/') ? path : `${path}/`;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['directories'], 'readonly');
      const store = transaction.objectStore('directories');
      const request = store.get(normalizedPath);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(!!request.result);
      };
    });
  }

  /**
   * Update directory entry (add/remove child)
   */
  private async updateDirectory(path: string, isDelete: boolean = false): Promise<void> {
    const parts = path.split('/').filter((p) => p);
    if (parts.length === 0) return;

    parts.pop(); // Remove filename
    if (parts.length === 0) return;

    const dirPath = `${parts.join('/')}/`;
    const fileName = path.split('/').pop()!;

    await this.ensureInit();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['directories'], 'readwrite');
      const store = transaction.objectStore('directories');
      const request = store.get(dirPath);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entry = request.result as DirectoryEntry | undefined;
        if (!entry) {
          // Create directory if it doesn't exist
          const newEntry: DirectoryEntry = {
            path: dirPath,
            children: isDelete ? [] : [fileName],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          const putRequest = store.put(newEntry);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          if (isDelete) {
            entry.children = entry.children.filter((c) => c !== fileName);
          } else if (!entry.children.includes(fileName)) {
            entry.children.push(fileName);
          }
          entry.updatedAt = Date.now();
          const putRequest = store.put(entry);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        }
      };
    });
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(path: string): Promise<FileEntry | null> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.get(path);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve((request.result as FileEntry) || null);
      };
    });
  }

  /**
   * Clear all data
   */
  async clear(): Promise<void> {
    await this.ensureInit();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files', 'directories'], 'readwrite');
      const fileStore = transaction.objectStore('files');
      const dirStore = transaction.objectStore('directories');

      const fileRequest = fileStore.clear();
      const dirRequest = dirStore.clear();

      let completed = 0;
      const checkComplete = () => {
        completed++;
        if (completed === 2) {
          resolve();
        }
      };

      fileRequest.onsuccess = checkComplete;
      fileRequest.onerror = () => reject(fileRequest.error);
      dirRequest.onsuccess = checkComplete;
      dirRequest.onerror = () => reject(dirRequest.error);
    });
  }
}

// Singleton instance
let fsInstance: IndexedDBFileSystem | null = null;

/**
 * Get the global IndexedDB file system instance
 */
export function getIndexedDBFileSystem(): IndexedDBFileSystem {
  if (!fsInstance) {
    fsInstance = new IndexedDBFileSystem();
  }
  return fsInstance;
}

