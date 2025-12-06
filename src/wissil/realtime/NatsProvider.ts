/**
 * NATS JetStream Provider for Y.js
 * 
 * Replaces y-webrtc with NATS for distributed, persistent real-time sync
 */

import * as Y from "yjs";
import { connect, NatsConnection, JetStreamClient, JetStreamSubscription } from "nats";
import { encodeStateAsUpdate, applyUpdate } from "yjs";

export interface NatsProviderConfig {
  serverUrl?: string;
  sessionId: string;
  userId: string;
  token?: string;
}

export class NatsProvider {
  private nc: NatsConnection | null = null;
  private js: JetStreamClient | null = null;
  private doc: Y.Doc;
  private sessionId: string;
  private userId: string;
  private subscriptions: JetStreamSubscription[] = [];
  private updateHandler: ((update: Uint8Array, origin: any) => void) | null = null;
  private connected = false;

  constructor(doc: Y.Doc, config: NatsProviderConfig) {
    this.doc = doc;
    this.sessionId = config.sessionId;
    this.userId = config.userId;
  }

  async connect(config: NatsProviderConfig) {
    if (this.connected) {
      console.warn("NatsProvider already connected");
      return;
    }

    try {
      // Connect to NATS server
      this.nc = await connect({
        servers: config.serverUrl || "nats://localhost:4222",
        token: config.token,
        reconnect: true,
        maxReconnectAttempts: -1,
      });

      this.js = this.nc.jetstream();

      // Subscribe to Y.js updates for this session
      const sub = await this.js.subscribe(`WISSIL.IGNIS.GRAPH.${this.sessionId}`, {
        callback: (err, msg) => {
          if (err) {
            console.error("NATS subscription error:", err);
            return;
          }
          if (msg) {
            try {
              const update = msg.data;
              // Apply update to Y.js document
              applyUpdate(this.doc, update, this);
              msg.ack();
            } catch (error) {
              console.error("Error applying Y.js update:", error);
            }
          }
        },
        maxDeliver: 10,
      });

      this.subscriptions.push(sub);

      // Publish Y.js updates
      this.updateHandler = (update: Uint8Array, origin: any) => {
        // Don't publish updates that came from NATS
        if (origin === this) return;

        // Publish to JetStream
        this.js?.publish(`WISSIL.IGNIS.GRAPH.${this.sessionId}`, update, {
          headers: {
            userId: this.userId,
            timestamp: Date.now().toString(),
          }
        }).catch(err => {
          console.error("Error publishing to NATS:", err);
        });
      };

      this.doc.on('update', this.updateHandler);

      // Send initial state
      const initialState = encodeStateAsUpdate(this.doc);
      await this.js.publish(`WISSIL.IGNIS.GRAPH.${this.sessionId}`, initialState, {
        headers: {
          userId: this.userId,
          timestamp: Date.now().toString(),
          initial: "true"
        }
      });

      this.connected = true;
      console.log(`NatsProvider connected for session ${this.sessionId}`);
    } catch (error) {
      console.error("Failed to connect to NATS:", error);
      throw error;
    }
  }

  async disconnect() {
    if (!this.connected) return;

    // Remove update handler
    if (this.updateHandler) {
      this.doc.off('update', this.updateHandler);
      this.updateHandler = null;
    }

    // Unsubscribe from all streams
    for (const sub of this.subscriptions) {
      await sub.drain();
    }
    this.subscriptions = [];

    // Close connection
    await this.nc?.close();
    this.nc = null;
    this.js = null;
    this.connected = false;

    console.log(`NatsProvider disconnected for session ${this.sessionId}`);
  }

  isConnected(): boolean {
    return this.connected;
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

