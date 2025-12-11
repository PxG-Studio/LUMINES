/**
 * Precompiled WebGL Loader Cache
 * Caches Unity WebGL loader files to avoid unnecessary rebuilds
 */

import { CacheManager } from "./CacheManager";
import { useWissilFS } from "../runtime/fs/wissilFs";

export interface WebGLTemplate {
  indexHtml: string;
  unityLoader: string;
  version: string;
  timestamp: number;
}

/**
 * WebGL Template Loader
 * Manages cached Unity WebGL loader files
 */
export const WebGLTemplateLoader = {
  /**
   * Get cached template path
   */
  getCachedTemplatePath(): string {
    return `${CacheManager.getCachePath()}/template`;
  },

  /**
   * Load cached template
   */
  loadCachedTemplate(): WebGLTemplate | null {
    const fs = useWissilFS.getState();
    const templatePath = this.getCachedTemplatePath();

    const indexHtml = fs.readFile(`${templatePath}/index.html`);
    const unityLoader = fs.readFile(`${templatePath}/UnityLoader.js`);

    if (!indexHtml || !unityLoader) {
      return null;
    }

    const manifest = CacheManager.loadManifest();
    return {
      indexHtml,
      unityLoader,
      version: manifest?.version || "1.0.0",
      timestamp: manifest?.timestamp || Date.now()
    };
  },

  /**
   * Save template to cache
   */
  saveTemplate(template: WebGLTemplate): void {
    const fs = useWissilFS.getState();
    const templatePath = this.getCachedTemplatePath();

    fs.writeFile(`${templatePath}/index.html`, template.indexHtml);
    fs.writeFile(`${templatePath}/UnityLoader.js`, template.unityLoader);
  },

  /**
   * Check if template cache is valid
   */
  isCacheValid(requiredVersion?: string): boolean {
    const template = this.loadCachedTemplate();
    if (!template) return false;

    if (requiredVersion && template.version !== requiredVersion) {
      return false;
    }

    // Check if files are not too old (e.g., 7 days)
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    return Date.now() - template.timestamp < maxAge;
  },

  /**
   * Get cached index.html path for serving
   */
  getCachedIndexHtmlPath(): string {
    return `${this.getCachedTemplatePath()}/index.html`;
  },

  /**
   * Get cached UnityLoader.js path for serving
   */
  getCachedUnityLoaderPath(): string {
    return `${this.getCachedTemplatePath()}/UnityLoader.js`;
  },

  /**
   * Clear template cache
   */
  clearCache(): void {
    const fs = useWissilFS.getState();
    const templatePath = this.getCachedTemplatePath();

    const files = ["index.html", "UnityLoader.js"];
    for (const file of files) {
      const fullPath = `${templatePath}/${file}`;
      if (fs.exists(fullPath)) {
        fs.deleteFile(fullPath);
      }
    }
  }
};

