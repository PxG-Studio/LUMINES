/**
 * JetStream Replay System
 * 
 * Replays IDE sessions from JetStream event logs
 */

import { NatsConnection, JetStreamClient, JetStreamSubscription } from "nats";
import { IDEEvent } from './JetStreamEventPublisher';

export interface ReplayConfig {
  sessionId: string;
  startTime?: number;
  endTime?: number;
  speed?: number; // Playback speed multiplier
  onEvent?: (event: IDEEvent) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export class JetStreamReplay {
  private js: JetStreamClient | null = null;
  private isPlaying = false;
  private isPaused = false;
  private currentSubscription: JetStreamSubscription | null = null;
  private playbackSpeed = 1.0;
  private lastEventTime = 0;
  private playbackTimer: NodeJS.Timeout | null = null;

  constructor(nc: NatsConnection) {
    this.js = nc.jetstream();
  }

  async startReplay(config: ReplayConfig): Promise<void> {
    if (this.isPlaying) {
      await this.stopReplay();
    }

    this.isPlaying = true;
    this.isPaused = false;
    this.playbackSpeed = config.speed || 1.0;
    this.lastEventTime = config.startTime || 0;

    try {
      // Subscribe to session events
      const subject = `WISSIL.*.*.${config.sessionId}`;
      this.currentSubscription = await this.js.subscribe(subject, {
        callback: async (err, msg) => {
          if (err) {
            config.onError?.(err);
            return;
          }

          if (!msg || this.isPaused) {
            if (msg) msg.ack();
            return;
          }

          try {
            const event: IDEEvent = JSON.parse(msg.data.toString());

            // Filter by time range
            if (config.startTime && event.timestamp < config.startTime) {
              msg.ack();
              return;
            }
            if (config.endTime && event.timestamp > config.endTime) {
              await this.stopReplay();
              config.onComplete?.();
              msg.ack();
              return;
            }

            // Calculate delay based on playback speed
            if (this.lastEventTime > 0) {
              const delay = (event.timestamp - this.lastEventTime) / this.playbackSpeed;
              if (delay > 0) {
                await new Promise(resolve => {
                  this.playbackTimer = setTimeout(resolve, delay);
                });
              }
            }

            // Apply event
            config.onEvent?.(event);
            this.lastEventTime = event.timestamp;

            msg.ack();
          } catch (error) {
            console.error("Error processing replay event:", error);
            config.onError?.(error as Error);
            msg.ack();
          }
        },
        maxDeliver: 1, // Only deliver once
      });

      console.log(`Started replay for session ${config.sessionId}`);
    } catch (error) {
      this.isPlaying = false;
      config.onError?.(error as Error);
      throw error;
    }
  }

  pauseReplay(): void {
    this.isPaused = true;
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  resumeReplay(): void {
    this.isPaused = false;
  }

  async stopReplay(): Promise<void> {
    this.isPlaying = false;
    this.isPaused = false;

    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer);
      this.playbackTimer = null;
    }

    if (this.currentSubscription) {
      await this.currentSubscription.drain();
      this.currentSubscription = null;
    }

    this.lastEventTime = 0;
  }

  setSpeed(speed: number): void {
    this.playbackSpeed = speed;
  }

  isReplaying(): boolean {
    return this.isPlaying;
  }

  isPausedReplay(): boolean {
    return this.isPaused;
  }
}

