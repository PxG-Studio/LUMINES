/**
 * Unity Build Cache Directory Manager
 * Manages cached build artifacts for incremental rebuilds
 */

import { useWissilFS } from "../runtime/fs/wissilFs";

export interface CacheManifest {
  version: string;
  timestamp: number;
  fingerprints: Record<string, string>;
  buildType: "full" | "asset" | "code" | "patch";
  artifacts: string[];
}

/**
 * Cache Manager
 * Handles Unity build cache directory structure
 */
export const CacheManager = {
  /**
   * Get cache directory path
   */
  getCachePath(): string {
    return ".wissil/cache/unity-build";
  },

  /**
   * Get cache manifest path
   */
  getManifestPath(): string {
    return `${this.getCachePath()}/manifest.json`;
  },

  /**
   * Load cache manifest
   */
  loadManifest(): CacheManifest | null {
    const fs = useWissilFS.getState();
    const manifestPath = this.getManifestPath();
    const content = fs.readFile(manifestPath);

    if (!content) {
      return null;
    }

    try {
      return JSON.parse(content) as CacheManifest;
    } catch (err) {
      console.error("[CacheManager] Error parsing manifest:", err);
      return null;
    }
  },

  /**
   * Save cache manifest
   */
  saveManifest(manifest: CacheManifest): void {
    const fs = useWissilFS.getState();
    const manifestPath = this.getManifestPath();
    fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  },

  /**
   * Check if artifact exists in cache
   */
  hasArtifact(artifactPath: string): boolean {
    const fs = useWissilFS.getState();
    const fullPath = `${this.getCachePath()}/${artifactPath}`;
    return fs.exists(fullPath);
  },

  /**
   * Get artifact content
   */
  getArtifact(artifactPath: string): string | null {
    const fs = useWissilFS.getState();
    const fullPath = `${this.getCachePath()}/${artifactPath}`;
    return fs.readFile(fullPath);
  },

  /**
   * Save artifact to cache
   */
  saveArtifact(artifactPath: string, content: string): void {
    const fs = useWissilFS.getState();
    const fullPath = `${this.getCachePath()}/${artifactPath}`;
    fs.writeFile(fullPath, content);
  },

  /**
   * Clear cache
   */
  clearCache(): void {
    const fs = useWissilFS.getState();
    const cachePath = this.getCachePath();

    // Delete all files in cache (simplified - in production would recursively delete)
    const manifest = this.loadManifest();
    if (manifest) {
      for (const artifact of manifest.artifacts || []) {
        const fullPath = `${cachePath}/${artifact}`;
        if (fs.exists(fullPath)) {
          fs.deleteFile(fullPath);
        }
      }
    }

    // Delete manifest
    const manifestPath = this.getManifestPath();
    if (fs.exists(manifestPath)) {
      fs.deleteFile(manifestPath);
    }
  },

  /**
   * Get cache size (approximate)
   */
  getCacheSize(): number {
    const fs = useWissilFS.getState();
    const manifest = this.loadManifest();
    if (!manifest) return 0;

    let size = 0;
    for (const artifact of manifest.artifacts || []) {
      const fullPath = `${this.getCachePath()}/${artifact}`;
      const content = fs.readFile(fullPath);
      if (content) {
        size += content.length;
      }
    }

    return size;
  }
};

