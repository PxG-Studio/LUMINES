/**
 * Session Store Service
 * Redis-based session storage
 */

import { cache } from '../client';

const SESSION_PREFIX = 'session:';
const SESSION_TTL = 24 * 60 * 60; // 24 hours

export class SessionStore {
  /**
   * Get session data
   */
  static async get(sessionId: string): Promise<any | null> {
    const key = `${SESSION_PREFIX}${sessionId}`;
    const data = await cache.get(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Set session data
   */
  static async set(sessionId: string, data: any, ttl: number = SESSION_TTL): Promise<void> {
    const key = `${SESSION_PREFIX}${sessionId}`;
    await cache.set(key, JSON.stringify(data), ttl);
  }

  /**
   * Delete session
   */
  static async delete(sessionId: string): Promise<void> {
    const key = `${SESSION_PREFIX}${sessionId}`;
    await cache.del(key);
  }

  /**
   * Check if session exists
   */
  static async exists(sessionId: string): Promise<boolean> {
    const key = `${SESSION_PREFIX}${sessionId}`;
    const data = await cache.get(key);
    return data !== null;
  }
}

