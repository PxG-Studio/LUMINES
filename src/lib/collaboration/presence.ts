/**
 * Enhanced Presence Tracking
 * Track user presence, activity, and cursor positions in real-time
 */

import { publish } from '../messaging/events';
import { logger } from '../monitoring/logger';

export interface UserPresence {
  userId: string;
  userName: string;
  userAvatar?: string;
  status: 'active' | 'idle' | 'away' | 'offline';
  lastActive: number;
  currentFile?: string;
  cursorPosition?: { line: number; column: number };
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  metadata?: Record<string, any>;
}

const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const IDLE_THRESHOLD = 180000; // 3 minutes
const AWAY_THRESHOLD = 600000; // 10 minutes

class PresenceManager {
  private presences: Map<string, UserPresence> = new Map();

  startTracking(projectId: string, userId: string, userName: string, userAvatar?: string): void {
    const presence: UserPresence = {
      userId,
      userName,
      userAvatar,
      status: 'active',
      lastActive: Date.now(),
    };
    this.presences.set(userId, presence);
    logger.info('Presence tracking started', { projectId, userId });
  }

  updateCursor(projectId: string, userId: string, fileId: string, line: number, column: number): void {
    const presence = this.presences.get(userId);
    if (presence) {
      presence.currentFile = fileId;
      presence.cursorPosition = { line, column };
      presence.lastActive = Date.now();
    }
  }

  getPresences(): UserPresence[] {
    return Array.from(this.presences.values());
  }
}

let presenceManager: PresenceManager | null = null;

export function getPresenceManager(): PresenceManager {
  if (!presenceManager) {
    presenceManager = new PresenceManager();
  }
  return presenceManager;
}
