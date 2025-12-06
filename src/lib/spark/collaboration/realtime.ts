/**
 * Real-time Collaboration System
 * 
 * Provides real-time collaboration features: share via link, team workspaces, comments
 */

export interface CollaborationSession {
  id: string;
  projectId: string;
  ownerId: string;
  participants: Array<{
    userId: string;
    name: string;
    role: 'owner' | 'editor' | 'viewer';
    cursor?: { line: number; column: number };
  }>;
  shareToken?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CollaborationMessage {
  type: 'cursor' | 'edit' | 'comment' | 'presence';
  userId: string;
  data: any;
  timestamp: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  line: number;
  column: number;
  content: string;
  replies?: Comment[];
  createdAt: number;
  resolved?: boolean;
}

class CollaborationManager {
  private sessions: Map<string, CollaborationSession> = new Map();
  private shareTokens: Map<string, string> = new Map(); // token -> sessionId
  private listeners: Map<string, Set<(message: CollaborationMessage) => void>> = new Map();

  /**
   * Create a collaboration session
   */
  createSession(projectId: string, ownerId: string): CollaborationSession {
    const session: CollaborationSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      projectId,
      ownerId,
      participants: [
        {
          userId: ownerId,
          name: 'Owner',
          role: 'owner',
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Generate share link
   */
  generateShareLink(sessionId: string, permissions: 'view' | 'edit' = 'view'): string {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const token = `share-${Date.now()}-${Math.random().toString(36).slice(2, 16)}`;
    session.shareToken = token;
    this.shareTokens.set(token, sessionId);

    // In production, this would be the actual domain
    return `${window.location.origin}/share/${token}?permissions=${permissions}`;
  }

  /**
   * Join session via share token
   */
  joinSession(token: string, userId: string, userName: string, role: 'editor' | 'viewer' = 'viewer'): CollaborationSession | null {
    const sessionId = this.shareTokens.get(token);
    if (!sessionId) {
      return null;
    }

    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    // Check if user already in session
    const existing = session.participants.find((p) => p.userId === userId);
    if (existing) {
      return session;
    }

    // Add participant
    session.participants.push({
      userId,
      name: userName,
      role,
    });

    session.updatedAt = Date.now();
    this.broadcast(sessionId, {
      type: 'presence',
      userId: 'system',
      data: { action: 'join', userId, userName },
      timestamp: Date.now(),
    });

    return session;
  }

  /**
   * Leave session
   */
  leaveSession(sessionId: string, userId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.participants = session.participants.filter((p) => p.userId !== userId);
    session.updatedAt = Date.now();

    this.broadcast(sessionId, {
      type: 'presence',
      userId: 'system',
      data: { action: 'leave', userId },
      timestamp: Date.now(),
    });
  }

  /**
   * Update cursor position
   */
  updateCursor(sessionId: string, userId: string, line: number, column: number): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const participant = session.participants.find((p) => p.userId === userId);
    if (participant) {
      participant.cursor = { line, column };
    }

    this.broadcast(sessionId, {
      type: 'cursor',
      userId,
      data: { line, column },
      timestamp: Date.now(),
    });
  }

  /**
   * Send edit operation
   */
  sendEdit(sessionId: string, userId: string, edit: {
    type: 'insert' | 'delete' | 'replace';
    position: { line: number; column: number };
    content?: string;
    length?: number;
  }): void {
    this.broadcast(sessionId, {
      type: 'edit',
      userId,
      data: edit,
      timestamp: Date.now(),
    });
  }

  /**
   * Add comment
   */
  addComment(sessionId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Comment {
    const fullComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: Date.now(),
    };

    this.broadcast(sessionId, {
      type: 'comment',
      userId: comment.userId,
      data: fullComment,
      timestamp: Date.now(),
    });

    return fullComment;
  }

  /**
   * Subscribe to session updates
   */
  subscribe(sessionId: string, callback: (message: CollaborationMessage) => void): () => void {
    if (!this.listeners.has(sessionId)) {
      this.listeners.set(sessionId, new Set());
    }

    this.listeners.get(sessionId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(sessionId);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Broadcast message to all session subscribers
   */
  private broadcast(sessionId: string, message: CollaborationMessage): void {
    const listeners = this.listeners.get(sessionId);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error in collaboration listener:', error);
        }
      });
    }
  }

  /**
   * Get session
   */
  getSession(sessionId: string): CollaborationSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get session by share token
   */
  getSessionByToken(token: string): CollaborationSession | null {
    const sessionId = this.shareTokens.get(token);
    if (!sessionId) return null;
    return this.sessions.get(sessionId) || null;
  }
}

// Singleton instance
let collaborationInstance: CollaborationManager | null = null;

/**
 * Get the global collaboration manager
 */
export function getCollaborationManager(): CollaborationManager {
  if (!collaborationInstance) {
    collaborationInstance = new CollaborationManager();
  }
  return collaborationInstance;
}

