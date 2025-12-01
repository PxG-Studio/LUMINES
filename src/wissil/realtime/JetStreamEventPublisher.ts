/**
 * JetStream Event Publisher
 * 
 * Publishes IDE events to NATS JetStream streams
 */

import { NatsConnection, JetStreamClient } from "nats";

export interface IDEEvent {
  sessionId: string;
  userId: string;
  timestamp: number;
  event: {
    type: string;
    subsystem: 'ignis' | 'unity' | 'spark' | 'ignition' | 'waypoint';
    payload: any;
  };
  metadata?: {
    version?: string;
    branch?: string;
    parentEventId?: string;
  };
}

export class JetStreamEventPublisher {
  private js: JetStreamClient | null = null;
  private sessionId: string;
  private userId: string;

  constructor(nc: NatsConnection, sessionId: string, userId: string) {
    this.js = nc.jetstream();
    this.sessionId = sessionId;
    this.userId = userId;
  }

  async publishEvent(event: Omit<IDEEvent, 'sessionId' | 'userId' | 'timestamp'>): Promise<void> {
    if (!this.js) {
      throw new Error("JetStream client not initialized");
    }

    const fullEvent: IDEEvent = {
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now(),
      ...event
    };

    const subject = `WISSIL.${event.event.subsystem.toUpperCase()}.${this.getEventCategory(event.event.type)}`;
    const data = JSON.stringify(fullEvent);

    try {
      await this.js.publish(subject, new TextEncoder().encode(data), {
        headers: {
          sessionId: this.sessionId,
          userId: this.userId,
          eventType: event.event.type,
          subsystem: event.event.subsystem,
        }
      });
    } catch (error) {
      console.error(`Error publishing event to ${subject}:`, error);
      throw error;
    }
  }

  private getEventCategory(eventType: string): string {
    // Map event types to JetStream subject categories
    if (eventType.startsWith('node.') || eventType.startsWith('wire.') || eventType.startsWith('graph.')) {
      return 'GRAPH';
    }
    if (eventType.startsWith('shader.')) {
      return 'SHADER';
    }
    if (eventType.startsWith('scenegraph.') || eventType.startsWith('prefab.')) {
      return 'SCENEGRAPH';
    }
    if (eventType.startsWith('timeline.')) {
      return 'TIMELINE';
    }
    if (eventType.startsWith('template.')) {
      return 'TEMPLATES';
    }
    if (eventType.startsWith('runtime.') || eventType.startsWith('log.')) {
      return 'RUNTIME';
    }
    if (eventType.startsWith('ai.') || eventType.startsWith('assistant.')) {
      return 'AI';
    }
    return 'DEBUG';
  }

  // Convenience methods for common events
  async publishNodeAdd(nodeId: string, node: any): Promise<void> {
    await this.publishEvent({
      event: {
        type: 'node.add',
        subsystem: 'ignis',
        payload: { nodeId, node }
      }
    });
  }

  async publishNodeMove(nodeId: string, position: { x: number; y: number }): Promise<void> {
    await this.publishEvent({
      event: {
        type: 'node.move',
        subsystem: 'ignis',
        payload: { nodeId, position }
      }
    });
  }

  async publishNodeDelete(nodeId: string): Promise<void> {
    await this.publishEvent({
      event: {
        type: 'node.delete',
        subsystem: 'ignis',
        payload: { nodeId }
      }
    });
  }

  async publishWireCreate(connId: string, connection: any): Promise<void> {
    await this.publishEvent({
      event: {
        type: 'wire.create',
        subsystem: 'ignis',
        payload: { connId, connection }
      }
    });
  }

  async publishSceneGraphSelect(objectId: string): Promise<void> {
    await this.publishEvent({
      event: {
        type: 'scenegraph.select',
        subsystem: 'unity',
        payload: { objectId }
      }
    });
  }

  async publishShaderParamChange(paramName: string, value: any): Promise<void> {
    await this.publishEvent({
      event: {
        type: 'shader.param.change',
        subsystem: 'unity',
        payload: { paramName, value }
      }
    });
  }

  async publishTimelineScrub(time: number): Promise<void> {
    await this.publishEvent({
      event: {
        type: 'timeline.scrub',
        subsystem: 'unity',
        payload: { time }
      }
    });
  }

  async publishRuntimeLog(level: string, message: string, data?: any): Promise<void> {
    await this.publishEvent({
      event: {
        type: 'log',
        subsystem: 'ignition',
        payload: { level, message, data }
      }
    });
  }

  async publishAISuggestion(suggestion: string, context?: any): Promise<void> {
    await this.publishEvent({
      event: {
        type: 'ai.suggestion',
        subsystem: 'waypoint',
        payload: { suggestion, context }
      }
    });
  }
}

