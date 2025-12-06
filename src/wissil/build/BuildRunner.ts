/**
 * Build Runner
 * Main build execution interface
 */

import { BuildOptions, BuildResult, BuildLog } from "./BuildTypes";
import { UnityBuildRunner } from "./UnityBuildRunner";
import { PreflightValidator } from "./PreflightValidator";
import { BuildCacheManager } from "./BuildCacheManager";
import { BuildLogStreamer } from "./BuildLogStreamer";
import { ReleaseManager } from "./ReleaseManager";
import { useBuildStore } from "./BuildStore";

export interface BuildRunnerOptions extends BuildOptions {
  onLog?: (log: BuildLog) => void;
  onProgress?: (progress: number, message: string) => void;
  onComplete?: (result: BuildResult) => void;
  onError?: (error: Error) => void;
  skipCache?: boolean;
}

/**
 * Build Runner
 * Coordinates build execution with validation, caching, and logging
 */
export class BuildRunner {
  private static currentBuild: {
    buildId: string;
    cancel: () => void;
  } | null = null;

  /**
   * Run a build
   */
  static async run(options: BuildRunnerOptions): Promise<BuildResult> {
    // Validate preflight
    const issues = PreflightValidator.validate(options.target, options.profile);
    const errors = issues.filter((i) => i.type === "error");
    if (errors.length > 0) {
      const error = new Error(`Preflight validation failed:\n${errors.map((e) => e.message).join("\n")}`);
      options.onError?.(error);
      throw error;
    }

    // Check cache
    if (!options.skipCache && BuildCacheManager.isCacheValid(options.target, options.profile)) {
      const cached = BuildCacheManager.getCachedBuild(options.target, options.profile);
      if (cached) {
        options.onLog?.({
          level: "info",
          message: "Using cached build",
          timestamp: Date.now()
        });
        options.onComplete?.(cached);
        return cached;
      }
    }

    // Setup logging
    BuildLogStreamer.start((log) => {
      options.onLog?.(log);
      useBuildStore.getState().addLog(log);
    });

    // Get version
    const version = ReleaseManager.nextVersion();

    // Run build
    try {
      const buildId = `build_${Date.now()}`;
      const result = await UnityBuildRunner.build({
        ...options,
        options: {
          ...options.options,
          version,
          buildId
        }
      });

      // Store cache
      BuildCacheManager.storeCache(options.target, options.profile, result);

      // Stop logging
      BuildLogStreamer.stop();

      options.onComplete?.(result);
      useBuildStore.getState().setLastBuild(result);

      return result;
    } catch (error: any) {
      BuildLogStreamer.stop();
      options.onError?.(error);
      useBuildStore.getState().setBuildError(error.message);
      throw error;
    }
  }

  /**
   * Cancel current build
   */
  static cancel(): void {
    if (this.currentBuild) {
      this.currentBuild.cancel();
      this.currentBuild = null;
      BuildLogStreamer.stop();
    }
  }
}

