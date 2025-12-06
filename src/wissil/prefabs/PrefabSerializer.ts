/**
 * Prefab Asset Serialization
 * YAML / JSON serialization for prefabs
 */

import { PrefabData } from "./PrefabTypes";

/**
 * Prefab Serializer
 * Serializes prefabs to JSON/YAML formats
 */
export class PrefabSerializer {
  /**
   * Serialize prefab to JSON
   */
  static toJSON(prefab: PrefabData, pretty: boolean = true): string {
    return JSON.stringify(prefab, null, pretty ? 2 : 0);
  }

  /**
   * Deserialize prefab from JSON
   */
  static fromJSON(json: string): PrefabData {
    try {
      return JSON.parse(json) as PrefabData;
    } catch (error: any) {
      throw new Error(`Failed to parse prefab JSON: ${error.message}`);
    }
  }

  /**
   * Serialize prefab to YAML
   * Note: Requires yaml package
   */
  static toYAML(prefab: PrefabData): string {
    try {
      // Dynamic import for yaml package
      const yaml = require("yaml");
      return yaml.stringify(prefab);
    } catch (error) {
      console.warn("[PrefabSerializer] YAML package not available, falling back to JSON");
      return this.toJSON(prefab);
    }
  }

  /**
   * Deserialize prefab from YAML
   */
  static fromYAML(yamlString: string): PrefabData {
    try {
      const yaml = require("yaml");
      return yaml.parse(yamlString) as PrefabData;
    } catch (error: any) {
      throw new Error(`Failed to parse prefab YAML: ${error.message}`);
    }
  }

  /**
   * Export prefab to file system
   */
  static export(prefab: PrefabData, format: "json" | "yaml" = "json"): string {
    if (format === "yaml") {
      return this.toYAML(prefab);
    }
    return this.toJSON(prefab);
  }
}

