/**
 * Build Orchestrator
 * Unity CLI build engine (Node wrapper)
 */

import { BuildOptions, BuildResult } from "./BuildTypes";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";

/**
 * Unity Build Runner
 * Orchestrates Unity CLI builds
 */
export class UnityBuildRunner {
  /**
   * Run a Unity build
   */
  static async build(options: BuildOptions): Promise<BuildResult> {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const buildId = `build_${Date.now()}`;

      // Send build request to Unity
      if (UnityMessagingBus.isConnected()) {
        UnityMessagingBus.send("build/start", {
          buildId,
          target: options.target,
          profile: options.profile,
          outputPath: options.outputPath || `Builds/${options.target}/${Date.now()}`,
          scenes: options.scenes || [],
          options: options.options || {}
        });
      } else {
        // Fallback: simulate build for browser-only mode
        console.warn("[UnityBuildRunner] Unity not connected, simulating build");
        setTimeout(() => {
          resolve({
            success: true,
            outputPath: options.outputPath || `Builds/${options.target}/${Date.now()}`,
            buildTime: Date.now() - startTime,
            size: 0,
            version: "1.0.0",
            target: options.target,
            profile: options.profile
          });
        }, 2000);
        return;
      }

      // Listen for build progress
      const unsubscribe = UnityMessagingBus.on("build/progress", (payload: any) => {
        if (payload.buildId === buildId) {
          options.onProgress?.(payload.progress, payload.message);
        }
      });

      // Listen for build complete
      const unsubscribeComplete = UnityMessagingBus.on("build/complete", (payload: any) => {
        if (payload.buildId === buildId) {
          unsubscribe();
          unsubscribeComplete();

          if (payload.success) {
            resolve({
              success: true,
              outputPath: payload.outputPath,
              buildTime: Date.now() - startTime,
              size: payload.size || 0,
              version: payload.version || "1.0.0",
              target: options.target,
              profile: options.profile,
              artifacts: payload.artifacts || []
            });
          } else {
            reject(new Error(payload.error || "Build failed"));
          }
        }
      });

      // Listen for build error
      const unsubscribeError = UnityMessagingBus.on("build/error", (payload: any) => {
        if (payload.buildId === buildId) {
          unsubscribe();
          unsubscribeComplete();
          unsubscribeError();

          reject(new Error(payload.error || "Build error"));
        }
      });

      // Timeout after 30 minutes
      setTimeout(() => {
        unsubscribe();
        unsubscribeComplete();
        unsubscribeError();
        reject(new Error("Build timeout"));
      }, 30 * 60 * 1000);
    });
  }

  /**
   * Cancel a running build
   */
  static cancel(buildId: string): void {
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("build/cancel", { buildId });
    }
  }
}

