/**
 * Prefab Variant Resolver
 * Resolves inheritance chain into final prefab
 */

import { PrefabVariant, VariantChain } from "./PrefabVariantSchema";
import { PrefabData } from "../PrefabTypes";

/**
 * Prefab Variant Resolver
 * Resolves multi-level variant inheritance chains
 */
export class PrefabVariantResolver {
  /**
   * Resolve a variant chain to final prefab data
   */
  static resolve(chain: VariantChain): PrefabData {
    if (chain.variants.length === 0) {
      throw new Error("Cannot resolve empty variant chain");
    }

    // Start with base prefab
    let resolved = JSON.parse(JSON.stringify(chain.variants[0].tree));

    // Apply overrides from each variant in the chain
    for (let i = 1; i < chain.variants.length; i++) {
      const variant = chain.variants[i];
      resolved = this.applyOverrides(resolved, variant.overrides);
    }

    return resolved;
  }

  /**
   * Apply overrides to a prefab tree
   */
  static applyOverrides(tree: PrefabData, overrides: Record<string, any>): PrefabData {
    const result = JSON.parse(JSON.stringify(tree));

    for (const [path, value] of Object.entries(overrides)) {
      this.setPath(result, path, value);
    }

    return result;
  }

  /**
   * Set a value at a path in an object
   */
  private static setPath(obj: any, path: string, value: any): void {
    const parts = path.split(".");
    let ref = obj;

    // Navigate to parent
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];

      // Handle array indices (e.g., "components[0]")
      if (part.includes("[")) {
        const [key, indexStr] = part.split("[");
        const index = parseInt(indexStr.replace("]", ""));
        if (!ref[key]) ref[key] = [];
        if (!ref[key][index]) ref[key][index] = {};
        ref = ref[key][index];
      } else {
        if (!ref[part]) ref[part] = {};
        ref = ref[part];
      }
    }

    // Set final value
    const finalPart = parts[parts.length - 1];
    if (finalPart.includes("[")) {
      const [key, indexStr] = finalPart.split("[");
      const index = parseInt(indexStr.replace("]", ""));
      if (!ref[key]) ref[key] = [];
      ref[key][index] = value;
    } else {
      ref[finalPart] = value;
    }
  }

  /**
   * Get a value at a path in an object
   */
  static getPath(obj: any, path: string): any {
    const parts = path.split(".");
    let ref = obj;

    for (const part of parts) {
      if (part.includes("[")) {
        const [key, indexStr] = part.split("[");
        const index = parseInt(indexStr.replace("]", ""));
        ref = ref[key]?.[index];
      } else {
        ref = ref[part];
      }
      if (ref === undefined) return undefined;
    }

    return ref;
  }
}

