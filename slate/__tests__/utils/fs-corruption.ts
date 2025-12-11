/**
 * Filesystem Corruption Simulator
 * Simulates various filesystem corruption scenarios
 */

export interface CorruptedFile {
  path: string;
  content: string | null;
  corrupted: boolean;
  corruptionType: 'partial' | 'invalid' | 'missing' | 'locked';
}

export class FSCorruptionSimulator {
  private corruptedFiles = new Map<string, CorruptedFile>();
  private lockedFiles = new Set<string>();
  private quotaExceeded = false;

  /**
   * Corrupt a file with partial write
   */
  corruptFilePartial(path: string, originalContent: string): void {
    const partialContent = originalContent.substring(0, Math.floor(originalContent.length / 2));
    this.corruptedFiles.set(path, {
      path,
      content: partialContent,
      corrupted: true,
      corruptionType: 'partial',
    });
  }

  /**
   * Corrupt a file with invalid JSON
   */
  corruptFileInvalid(path: string): void {
    this.corruptedFiles.set(path, {
      path,
      content: '{ invalid json }',
      corrupted: true,
      corruptionType: 'invalid',
    });
  }

  /**
   * Mark file as missing
   */
  corruptFileMissing(path: string): void {
    this.corruptedFiles.set(path, {
      path,
      content: null,
      corrupted: true,
      corruptionType: 'missing',
    });
  }

  /**
   * Lock a file (simulate IndexedDB lock)
   */
  lockFile(path: string): void {
    this.lockedFiles.add(path);
  }

  /**
   * Unlock a file
   */
  unlockFile(path: string): void {
    this.lockedFiles.delete(path);
  }

  /**
   * Check if file is locked
   */
  isLocked(path: string): boolean {
    return this.lockedFiles.has(path);
  }

  /**
   * Simulate quota exceeded
   */
  setQuotaExceeded(exceeded: boolean): void {
    this.quotaExceeded = exceeded;
  }

  /**
   * Check if quota is exceeded
   */
  isQuotaExceeded(): boolean {
    return this.quotaExceeded;
  }

  /**
   * Read file with corruption simulation
   */
  async readFile(path: string): Promise<string> {
    const corrupted = this.corruptedFiles.get(path);
    
    if (corrupted) {
      if (corrupted.corruptionType === 'missing') {
        throw new Error(`File not found: ${path}`);
      }
      if (corrupted.corruptionType === 'invalid') {
        throw new Error(`Invalid file format: ${path}`);
      }
      return corrupted.content || '';
    }

    if (this.isLocked(path)) {
      throw new Error(`File locked: ${path}`);
    }

    return 'file content';
  }

  /**
   * Write file with corruption simulation
   */
  async writeFile(path: string, content: string): Promise<void> {
    if (this.quotaExceeded) {
      throw new Error('Quota exceeded');
    }

    if (this.isLocked(path)) {
      throw new Error(`File locked: ${path}`);
    }

    // Simulate partial write corruption
    const corrupted = this.corruptedFiles.get(path);
    if (corrupted && corrupted.corruptionType === 'partial') {
      // Recovery path: treat subsequent write as full recovery
      this.corruptedFiles.delete(path);
      return;
    }

    // Normal write
    this.corruptedFiles.delete(path);
  }

  /**
   * Delete file with corruption simulation
   */
  async deleteFile(path: string): Promise<void> {
    if (this.isLocked(path)) {
      throw new Error(`File locked: ${path}`);
    }

    this.corruptedFiles.delete(path);
  }

  /**
   * Reset all corruption
   */
  reset(): void {
    this.corruptedFiles.clear();
    this.lockedFiles.clear();
    this.quotaExceeded = false;
  }

  /**
   * Get corrupted file info
   */
  getCorruptedFile(path: string): CorruptedFile | undefined {
    return this.corruptedFiles.get(path);
  }
}

/**
 * Cross-tab FS sync conflict simulator
 */
export class CrossTabSyncConflictSimulator {
  private conflicts = new Map<string, { version: number; content: string }>();
  private tabId = Math.random().toString(36);

  /**
   * Simulate conflict on file write
   */
  async writeWithConflict(path: string, content: string, version: number): Promise<boolean> {
    const existing = this.conflicts.get(path);
    
    if (existing && existing.version > version) {
      // Conflict: another tab has newer version
      return false;
    }

    this.conflicts.set(path, { version, content });
    return true;
  }

  /**
   * Get file version
   */
  getVersion(path: string): number {
    return this.conflicts.get(path)?.version || 0;
  }

  /**
   * Reset conflicts
   */
  reset(): void {
    this.conflicts.clear();
  }
}

