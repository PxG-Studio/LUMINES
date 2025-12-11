/**
 * Preflight Validator
 * Ensures build passes before starting
 */

import { PreflightIssue } from "./BuildTypes";
import { useWissilFS } from "../runtime/fs/wissilFs";

/**
 * Preflight Validator
 * Validates project state before building
 */
export class PreflightValidator {
  /**
   * Validate build readiness
   */
  static validate(target: string, profile: string): PreflightIssue[] {
    const issues: PreflightIssue[] = [];

    // Scene checks
    const scenes = this.getEnabledScenes();
    if (scenes.length === 0) {
      issues.push({
        type: "error",
        message: "No scenes included in build",
        fix: "Add at least one scene to Build Settings",
        severity: "high"
      });
    }

    // WebGL-specific checks
    if (target === "webgl") {
      // Check WebGL compression settings
      const webglConfig = this.getWebGLConfig();
      if (!webglConfig.compression) {
        issues.push({
          type: "warning",
          message: "WebGL compression not set",
          fix: "Enable compression for better performance",
          severity: "medium"
        });
      }

      // Check memory size
      if (webglConfig.memorySize > 1024) {
        issues.push({
          type: "warning",
          message: "WebGL memory size is large (>1GB)",
          fix: "Consider reducing memory size for better browser compatibility",
          severity: "medium"
        });
      }
    }

    // Android-specific checks
    if (target === "android") {
      const androidConfig = this.getAndroidConfig();
      if (!androidConfig.minSdkVersion) {
        issues.push({
          type: "error",
          message: "Android minimum SDK version not set",
          fix: "Set minimum SDK version in Player Settings",
          severity: "high"
        });
      }

      if (!androidConfig.targetSdkVersion) {
        issues.push({
          type: "warning",
          message: "Android target SDK version not set",
          fix: "Set target SDK version for compatibility",
          severity: "medium"
        });
      }
    }

    // iOS-specific checks
    if (target === "ios") {
      const iosConfig = this.getIOSConfig();
      if (!iosConfig.bundleIdentifier) {
        issues.push({
          type: "error",
          message: "iOS bundle identifier not set",
          fix: "Set bundle identifier in Player Settings",
          severity: "high"
        });
      }
    }

    // Check for missing assets
    const missingAssets = this.checkMissingAssets();
    if (missingAssets.length > 0) {
      issues.push({
        type: "warning",
        message: `${missingAssets.length} potentially missing asset(s) detected`,
        fix: "Check asset references",
        severity: "low"
      });
    }

    // Check build size
    const estimatedSize = this.estimateBuildSize(target);
    if (estimatedSize > 500 * 1024 * 1024) {
      issues.push({
        type: "warning",
        message: `Estimated build size is large (${(estimatedSize / 1024 / 1024).toFixed(1)}MB)`,
        fix: "Consider asset compression or stripping unused assets",
        severity: "medium"
      });
    }

    return issues;
  }

  /**
   * Get enabled scenes
   */
  private static getEnabledScenes(): string[] {
    // Check WISSIL FS for scene files
    const fs = useWissilFS.getState();
    const snapshot = fs.getSnapshot();
    const scenes: string[] = [];

    function walk(node: any, path: string = "") {
      if (node.type === "file" && node.path?.endsWith(".unity")) {
        scenes.push(node.path);
      }
      if (node.children) {
        Object.values(node.children).forEach((child: any) => {
          walk(child, node.path);
        });
      }
    }

    walk(snapshot);
    return scenes;
  }

  /**
   * Get WebGL config
   */
  private static getWebGLConfig(): {
    compression: boolean;
    memorySize: number;
  } {
    // Get from project settings or defaults
    return {
      compression: true,
      memorySize: 512
    };
  }

  /**
   * Get Android config
   */
  private static getAndroidConfig(): {
    minSdkVersion: number | null;
    targetSdkVersion: number | null;
  } {
    // Get from project settings or defaults
    return {
      minSdkVersion: 21,
      targetSdkVersion: 33
    };
  }

  /**
   * Get iOS config
   */
  private static getIOSConfig(): {
    bundleIdentifier: string | null;
  } {
    // Get from project settings or defaults
    return {
      bundleIdentifier: "com.wissil.game" || null
    };
  }

  /**
   * Check for missing assets
   */
  private static checkMissingAssets(): string[] {
    // Basic check - would be expanded in real implementation
    return [];
  }

  /**
   * Estimate build size
   */
  private static estimateBuildSize(target: string): number {
    // Basic estimation - would use actual asset sizes
    return 100 * 1024 * 1024; // 100MB default
  }
}

