/**
 * Session Manager
 * 
 * Manages IDE sessions with JetStream persistence
 */

import { NatsConnection, JetStreamClient } from "nats";
import { JetStreamEventPublisher } from './JetStreamEventPublisher';
import { JetStreamReplay } from './JetStreamReplay';

export interface SessionConfig {
  sessionId: string;
  userId: string;
  name?: string;
  description?: string;
  branch?: string;
  parentSessionId?: string;
}

export interface SessionMetadata {
  sessionId: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  branch?: string;
  parentSessionId?: string;
  eventCount: number;
  lastEventTime: number;
}

export class SessionManager {
  private js: JetStreamClient | null = null;
  private sessions: Map<string, SessionMetadata> = new Map();
  private publishers: Map<string, JetStreamEventPublisher> = new Map();
  private replays: Map<string, JetStreamReplay> = new Map();

  constructor(nc: NatsConnection) {
    this.js = nc.jetstream();
  }

  async createSession(config: SessionConfig): Promise<SessionMetadata> {
    const metadata: SessionMetadata = {
      sessionId: config.sessionId,
      userId: config.userId,
      name: config.name || `Session ${config.sessionId}`,
      description: config.description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      branch: config.branch || 'main',
      parentSessionId: config.parentSessionId,
      eventCount: 0,
      lastEventTime: Date.now()
    };

    this.sessions.set(config.sessionId, metadata);

    // Create publisher for this session
    const publisher = new JetStreamEventPublisher(
      this.js!.nc as NatsConnection,
      config.sessionId,
      config.userId
    );
    this.publishers.set(config.sessionId, publisher);

    // Publish session creation event
    await publisher.publishEvent({
      event: {
        type: 'session.create',
        subsystem: 'ignis',
        payload: { metadata }
      },
      metadata: {
        version: '1.0.0',
        branch: config.branch || 'main'
      }
    });

    return metadata;
  }

  async loadSession(sessionId: string): Promise<SessionMetadata | null> {
    // Try to get from cache
    if (this.sessions.has(sessionId)) {
      return this.sessions.get(sessionId)!;
    }

    // Load from JetStream (would need to query stream metadata)
    // For now, return null if not in cache
    return null;
  }

  async forkSession(sessionId: string, newSessionId: string, branchName: string): Promise<SessionMetadata> {
    const parentSession = await this.loadSession(sessionId);
    if (!parentSession) {
      throw new Error(`Parent session ${sessionId} not found`);
    }

    // Create new session as branch
    const forkedSession = await this.createSession({
      sessionId: newSessionId,
      userId: parentSession.userId,
      name: `${parentSession.name} (${branchName})`,
      description: `Forked from ${sessionId}`,
      branch: branchName,
      parentSessionId: sessionId
    });

    return forkedSession;
  }

  async createVersion(sessionId: string, versionName: string): Promise<string> {
    // Create a snapshot/version of the session
    // In JetStream, this would be done via consumer snapshots
    const versionId = `${sessionId}_${versionName}_${Date.now()}`;
    
    // Publish version creation event
    const publisher = this.publishers.get(sessionId);
    if (publisher) {
      await publisher.publishEvent({
        event: {
          type: 'version.create',
          subsystem: 'ignis',
          payload: { versionId, versionName }
        }
      });
    }

    return versionId;
  }

  async restoreVersion(sessionId: string, versionId: string): Promise<void> {
    // Restore session to a specific version
    // This would use JetStream consumer snapshots
    const publisher = this.publishers.get(sessionId);
    if (publisher) {
      await publisher.publishEvent({
        event: {
          type: 'version.restore',
          subsystem: 'ignis',
          payload: { versionId }
        }
      });
    }
  }

  getPublisher(sessionId: string): JetStreamEventPublisher | null {
    return this.publishers.get(sessionId) || null;
  }

  getReplay(sessionId: string): JetStreamReplay | null {
    if (!this.replays.has(sessionId)) {
      // Create replay instance if needed
      // Would need NATS connection
    }
    return this.replays.get(sessionId) || null;
  }

  async listSessions(userId?: string): Promise<SessionMetadata[]> {
    const sessions = Array.from(this.sessions.values());
    if (userId) {
      return sessions.filter(s => s.userId === userId);
    }
    return sessions;
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
    this.publishers.delete(sessionId);
    this.replays.delete(sessionId);
  }
}

