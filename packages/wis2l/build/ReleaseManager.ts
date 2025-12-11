/**
 * Release Manager
 * Versioning and changelog management
 */

import { ReleaseInfo } from "./BuildTypes";
import { useBuildStore } from "./BuildStore";
import { useWissilFS } from "../runtime/fs/wissilFs";

/**
 * Release Manager
 * Handles versioning and release management
 */
export class ReleaseManager {
  private static readonly VERSION_FILE = "ProjectSettings/version.json";

  /**
   * Get current version
   */
  static getCurrentVersion(): string {
    const fs = useWissilFS.getState();
    try {
      const versionContent = fs.readFile(this.VERSION_FILE);
      if (versionContent) {
        const version = JSON.parse(versionContent);
        return version.version || "0.1.0";
      }
    } catch {
      // File doesn't exist or invalid
    }

    // Default version
    return "0.1.0";
  }

  /**
   * Get next version
   */
  static nextVersion(type: "patch" | "minor" | "major" = "patch"): string {
    const current = this.getCurrentVersion();
    const [major, minor, patch] = current.split(".").map(Number);

    let nextVersion: string;
    if (type === "major") {
      nextVersion = `${major + 1}.0.0`;
    } else if (type === "minor") {
      nextVersion = `${major}.${minor + 1}.0`;
    } else {
      nextVersion = `${major}.${minor}.${patch + 1}`;
    }

    // Save new version
    const fs = useWissilFS.getState();
    fs.writeFile(
      this.VERSION_FILE,
      JSON.stringify(
        {
          version: nextVersion,
          updatedAt: Date.now()
        },
        null,
        2
      )
    );

    return nextVersion;
  }

  /**
   * Create release
   */
  static createRelease(
    version: string,
    target: string,
    profile: string,
    buildTime: number,
    changelog?: string
  ): ReleaseInfo {
    const release: ReleaseInfo = {
      version,
      target,
      profile,
      buildTime,
      changelog,
      deployedAt: Date.now()
    };

    useBuildStore.getState().addRelease(release);
    return release;
  }

  /**
   * Get release history
   */
  static getReleaseHistory(): ReleaseInfo[] {
    return useBuildStore.getState().releases;
  }

  /**
   * Format version for display
   */
  static formatVersion(version: string): string {
    return `v${version}`;
  }
}

