/**
 * Build Logs Streamer
 * Streams build logs from Unity
 */

import { BuildLog } from "./BuildTypes";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";

/**
 * Build Log Streamer
 * Handles streaming build logs
 */
export class BuildLogStreamer {
  private static subscribers: Set<(log: BuildLog) => void> = new Set();
  private static isStreaming: boolean = false;
  private static unsubscribe: (() => void)[] = [];

  /**
   * Start streaming logs
   */
  static start(callback: (log: BuildLog) => void): void {
    this.subscribers.add(callback);
    this.isStreaming = true;

    // Listen for Unity build logs
    const unsubInfo = UnityMessagingBus.on("build/log", (payload: any) => {
      const log: BuildLog = {
        level: payload.level || "info",
        message: payload.message || payload.text || "",
        timestamp: payload.timestamp || Date.now(),
        source: payload.source || "unity"
      };
      this.broadcast(log);
    });

    const unsubError = UnityMessagingBus.on("build/error", (payload: any) => {
      const log: BuildLog = {
        level: "error",
        message: payload.error || payload.message || "Build error",
        timestamp: Date.now(),
        source: "unity"
      };
      this.broadcast(log);
    });

    this.unsubscribe.push(unsubInfo, unsubError);
  }

  /**
   * Stop streaming logs
   */
  static stop(): void {
    this.isStreaming = false;
    this.unsubscribe.forEach((unsub) => unsub());
    this.unsubscribe = [];
    // Keep subscribers for reuse
  }

  /**
   * Broadcast log to all subscribers
   */
  private static broadcast(log: BuildLog): void {
    this.subscribers.forEach((callback) => callback(log));
  }

  /**
   * Remove subscriber
   */
  static remove(callback: (log: BuildLog) => void): void {
    this.subscribers.delete(callback);
  }
}

