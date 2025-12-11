/**
 * Lock Manager
 * 
 * Manages collaborative locking to prevent editing conflicts
 */

import { yLocks, awareness } from './YProvider';

export type LockType = 'soft' | 'hard' | 'region';

interface Lock {
  type: LockType;
  userId: number;
  timestamp: number;
  expiresAt?: number;
  bounds?: { x: number; y: number; width: number; height: number };
}

export class LockManager {
  private userId: number;
  private readonly SOFT_LOCK_TIMEOUT = 8000; // 8 seconds
  private lockTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.userId = awareness.clientID;
  }

  // Soft Lock (Default) - Auto-unlocks after timeout
  lockNode(nodeId: string): boolean {
    const existingLock = yLocks.get(nodeId) as Lock | undefined;
    
    if (existingLock) {
      // Check if expired
      if (existingLock.expiresAt && Date.now() > existingLock.expiresAt) {
        this.unlockNode(nodeId);
      } else if (existingLock.userId !== this.userId) {
        return false; // Locked by another user
      }
    }

    yLocks.set(nodeId, {
      type: 'soft',
      userId: this.userId,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.SOFT_LOCK_TIMEOUT
    });

    // Clear existing timer
    const existingTimer = this.lockTimers.get(nodeId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Auto-unlock after timeout
    const timer = setTimeout(() => {
      const lock = yLocks.get(nodeId) as Lock | undefined;
      if (lock && lock.userId === this.userId) {
        this.unlockNode(nodeId);
      }
      this.lockTimers.delete(nodeId);
    }, this.SOFT_LOCK_TIMEOUT);

    this.lockTimers.set(nodeId, timer);

    return true;
  }

  // Hard Lock (Optional) - Manual unlock required
  hardLockNode(nodeId: string): boolean {
    const existingLock = yLocks.get(nodeId) as Lock | undefined;
    
    if (existingLock && existingLock.userId !== this.userId) {
      return false;
    }

    yLocks.set(nodeId, {
      type: 'hard',
      userId: this.userId,
      timestamp: Date.now()
    });

    return true;
  }

  unlockNode(nodeId: string) {
    const lock = yLocks.get(nodeId) as Lock | undefined;
    if (lock && lock.userId === this.userId) {
      yLocks.delete(nodeId);
      
      const timer = this.lockTimers.get(nodeId);
      if (timer) {
        clearTimeout(timer);
        this.lockTimers.delete(nodeId);
      }
    }
  }

  isLocked(nodeId: string): boolean {
    const lock = yLocks.get(nodeId) as Lock | undefined;
    if (!lock) return false;
    
    if (lock.expiresAt && Date.now() > lock.expiresAt) {
      this.unlockNode(nodeId);
      return false;
    }

    return lock.userId !== this.userId;
  }

  getLockOwner(nodeId: string): number | null {
    const lock = yLocks.get(nodeId) as Lock | undefined;
    if (!lock) return null;
    
    if (lock.expiresAt && Date.now() > lock.expiresAt) {
      return null;
    }
    
    return lock.userId;
  }

  // Region Locking - Lock a region of the canvas
  lockRegion(regionId: string, bounds: { x: number; y: number; width: number; height: number }) {
    yLocks.set(`region:${regionId}`, {
      type: 'region',
      userId: this.userId,
      timestamp: Date.now(),
      bounds
    } as any);
  }

  unlockRegion(regionId: string) {
    yLocks.delete(`region:${regionId}`);
  }

  isInLockedRegion(x: number, y: number): { locked: boolean; owner: number | null } {
    let locked = false;
    let owner: number | null = null;

    yLocks.forEach((lock, key) => {
      if (key.startsWith('region:') && lock.type === 'region') {
        const bounds = (lock as any).bounds;
        if (bounds && 
            x >= bounds.x && x <= bounds.x + bounds.width &&
            y >= bounds.y && y <= bounds.y + bounds.height) {
          locked = lock.userId !== this.userId;
          owner = lock.userId;
        }
      }
    });

    return { locked, owner };
  }
}

export const lockManager = new LockManager();

