/**
 * Session Restoration System
 * 
 * Saves and restores session state to IndexedDB, handles conflicts
 */

import { getIndexedDBFileSystem } from '../filesystem/indexeddb';

export interface SessionState {
  id: string;
  projectId?: string;
  files: Array<{ path: string; content: string }>;
  selectedFile?: string;
  editorState?: {
    cursorPosition?: { line: number; column: number };
    scrollPosition?: number;
    selection?: { start: { line: number; column: number }; end: { line: number; column: number } };
  };
  metadata?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

interface ConflictResolution {
  strategy: 'local' | 'remote' | 'merge' | 'manual';
  resolvedState?: SessionState;
}

class SessionRestore {
  private fs = getIndexedDBFileSystem();
  private sessionStore = 'sessions';

  /**
   * Save session state
   */
  async saveSession(state: SessionState): Promise<void> {
    await this.fs.init();

    const sessionData = {
      ...state,
      updatedAt: Date.now(),
    };

    // Save to IndexedDB
    const sessionPath = `/${this.sessionStore}/${state.id}.json`;
    await this.fs.writeFile(sessionPath, JSON.stringify(sessionData, null, 2));

    // Also save to localStorage as backup
    try {
      localStorage.setItem(`session:${state.id}`, JSON.stringify(sessionData));
    } catch (err) {
      console.warn('Failed to save session to localStorage:', err);
    }
  }

  /**
   * Load session state
   */
  async loadSession(sessionId: string): Promise<SessionState | null> {
    await this.fs.init();

    try {
      // Try IndexedDB first
      const sessionPath = `/${this.sessionStore}/${sessionId}.json`;
      const exists = await this.fs.fileExists(sessionPath);

      if (exists) {
        const content = await this.fs.readFile(sessionPath);
        return JSON.parse(content) as SessionState;
      }

      // Fallback to localStorage
      const stored = localStorage.getItem(`session:${sessionId}`);
      if (stored) {
        return JSON.parse(stored) as SessionState;
      }

      return null;
    } catch (err) {
      console.error('Failed to load session:', err);
      return null;
    }
  }

  /**
   * List all saved sessions
   */
  async listSessions(): Promise<SessionState[]> {
    await this.fs.init();

    try {
      const sessionDir = `/${this.sessionStore}/`;
      const exists = await this.fs.directoryExists(sessionDir);

      if (!exists) {
        await this.fs.createDirectory(sessionDir);
        return [];
      }

      const files = await this.fs.listDirectory(sessionDir);
      const sessions: SessionState[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const sessionId = file.replace('.json', '');
          const session = await this.loadSession(sessionId);
          if (session) {
            sessions.push(session);
          }
        }
      }

      // Sort by updatedAt descending
      sessions.sort((a, b) => b.updatedAt - a.updatedAt);

      return sessions;
    } catch (err) {
      console.error('Failed to list sessions:', err);
      return [];
    }
  }

  /**
   * Delete session
   */
  async deleteSession(sessionId: string): Promise<void> {
    await this.fs.init();

    const sessionPath = `/${this.sessionStore}/${sessionId}.json`;
    await this.fs.deleteFile(sessionPath);

    // Also remove from localStorage
    try {
      localStorage.removeItem(`session:${sessionId}`);
    } catch (err) {
      console.warn('Failed to remove session from localStorage:', err);
    }
  }

  /**
   * Resolve conflict between local and remote session state
   */
  async resolveConflict(
    localState: SessionState,
    remoteState: SessionState,
    strategy: ConflictResolution['strategy'] = 'merge'
  ): Promise<ConflictResolution> {
    if (strategy === 'local') {
      return {
        strategy: 'local',
        resolvedState: localState,
      };
    }

    if (strategy === 'remote') {
      return {
        strategy: 'remote',
        resolvedState: remoteState,
      };
    }

    if (strategy === 'merge') {
      // Merge strategy: keep local changes, but update metadata from remote
      const mergedState: SessionState = {
        ...localState,
        metadata: {
          ...remoteState.metadata,
          ...localState.metadata,
          mergedAt: Date.now(),
          mergedFrom: [localState.id, remoteState.id],
        },
        updatedAt: Date.now(),
      };

      // Merge files: prefer local if modified more recently
      const mergedFiles = new Map<string, { path: string; content: string; updatedAt: number }>();

      // Add remote files
      remoteState.files.forEach((file) => {
        mergedFiles.set(file.path, {
          ...file,
          updatedAt: remoteState.updatedAt,
        });
      });

      // Override with local files if they're newer
      localState.files.forEach((file) => {
        const existing = mergedFiles.get(file.path);
        if (!existing || localState.updatedAt > existing.updatedAt) {
          mergedFiles.set(file.path, {
            ...file,
            updatedAt: localState.updatedAt,
          });
        }
      });

      mergedState.files = Array.from(mergedFiles.values()).map((f) => ({
        path: f.path,
        content: f.content,
      }));

      return {
        strategy: 'merge',
        resolvedState: mergedState,
      };
    }

    // Manual resolution - return both states for user to choose
    return {
      strategy: 'manual',
    };
  }

  /**
   * Auto-save session state periodically
   */
  startAutoSave(sessionId: string, getState: () => Partial<SessionState>, intervalMs: number = 30000): () => void {
    const interval = setInterval(async () => {
      try {
        const currentState = await this.loadSession(sessionId);
        if (currentState) {
          const updatedState: SessionState = {
            ...currentState,
            ...getState(),
            updatedAt: Date.now(),
          };
          await this.saveSession(updatedState);
        }
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }, intervalMs);

    // Return cleanup function
    return () => clearInterval(interval);
  }

  /**
   * Export session state as JSON
   */
  async exportSession(sessionId: string): Promise<string> {
    const session = await this.loadSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    return JSON.stringify(session, null, 2);
  }

  /**
   * Import session state from JSON
   */
  async importSession(jsonData: string, sessionId?: string): Promise<SessionState> {
    const importedState = JSON.parse(jsonData) as SessionState;

    const finalState: SessionState = {
      ...importedState,
      id: sessionId || importedState.id || `imported-${Date.now()}`,
      createdAt: importedState.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    await this.saveSession(finalState);
    return finalState;
  }
}

// Singleton instance
let sessionRestoreInstance: SessionRestore | null = null;

/**
 * Get the global session restore instance
 */
export function getSessionRestore(): SessionRestore {
  if (!sessionRestoreInstance) {
    sessionRestoreInstance = new SessionRestore();
  }
  return sessionRestoreInstance;
}

