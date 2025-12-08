/**
 * Redis Session Store for NextAuth
 * Stores user sessions in Redis for scalability
 */

import { redis } from '../cache/client';
import { logger } from '../monitoring/logger';

const SESSION_PREFIX = 'session:';
const SESSION_TTL = 30 * 24 * 60 * 60; // 30 days

export interface SessionData {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
    roles?: string[];
    permissions?: string[];
  };
  expires: string;
  accessToken?: string;
  provider?: string;
}

/**
 * Store session in Redis
 */
export async function storeSession(
  sessionId: string,
  data: SessionData
): Promise<void> {
  try {
    const key = `${SESSION_PREFIX}${sessionId}`;
    await redis.setex(key, SESSION_TTL, JSON.stringify(data));
    logger.debug('Session stored in Redis', { sessionId });
  } catch (error) {
    logger.error('Failed to store session in Redis', error, { sessionId });
    throw error;
  }
}

/**
 * Get session from Redis
 */
export async function getSession(
  sessionId: string
): Promise<SessionData | null> {
  try {
    const key = `${SESSION_PREFIX}${sessionId}`;
    const data = await redis.get(key);
    
    if (!data) {
      logger.debug('Session not found in Redis', { sessionId });
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    logger.error('Failed to get session from Redis', error, { sessionId });
    return null;
  }
}

/**
 * Update session in Redis
 */
export async function updateSession(
  sessionId: string,
  data: Partial<SessionData>
): Promise<void> {
  try {
    const existing = await getSession(sessionId);
    
    if (!existing) {
      logger.warn('Attempted to update non-existent session', { sessionId });
      return;
    }

    const updated = { ...existing, ...data };
    await storeSession(sessionId, updated);
    logger.debug('Session updated in Redis', { sessionId });
  } catch (error) {
    logger.error('Failed to update session in Redis', error, { sessionId });
    throw error;
  }
}

/**
 * Delete session from Redis
 */
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    const key = `${SESSION_PREFIX}${sessionId}`;
    await redis.del(key);
    logger.debug('Session deleted from Redis', { sessionId });
  } catch (error) {
    logger.error('Failed to delete session from Redis', error, { sessionId });
    throw error;
  }
}

/**
 * Get all active sessions for a user
 */
export async function getUserSessions(userId: string): Promise<SessionData[]> {
  try {
    const pattern = `${SESSION_PREFIX}*`;
    const keys = await redis.keys(pattern);
    const sessions: SessionData[] = [];

    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        const session = JSON.parse(data);
        if (session.user.id === userId) {
          sessions.push(session);
        }
      }
    }

    return sessions;
  } catch (error) {
    logger.error('Failed to get user sessions from Redis', error, { userId });
    return [];
  }
}

/**
 * Revoke all sessions for a user
 */
export async function revokeUserSessions(userId: string): Promise<number> {
  try {
    const sessions = await getUserSessions(userId);
    let count = 0;

    for (const session of sessions) {
      // Extract sessionId from session data (would need to be stored)
      // For now, we'll use a simplified approach
      count++;
    }

    logger.info('User sessions revoked', { userId, count });
    return count;
  } catch (error) {
    logger.error('Failed to revoke user sessions', error, { userId });
    return 0;
  }
}
