/**
 * Override Diff Engine 2.0
 * Hierarchical comparison for variant overrides
 */

import { PrefabData } from "../PrefabTypes";
import { OverrideDiff } from "./PrefabVariantSchema";
import { PrefabVariantResolver } from "./PrefabVariantResolver";

/**
 * Override Diff Engine
 * Computes overrides between base and modified prefab trees
 */
export class OverrideDiffEngine {
  /**
   * Compute overrides between base and modified prefab trees
   */
  static computeOverrides(baseTree: PrefabData, modifiedTree: PrefabData): Record<string, any> {
    const overrides: Record<string, any> = {};

    function walk(baseNode: any, modNode: any, path: string = "") {
      // If both are primitives, compare values
      if (
        (baseNode === null || typeof baseNode !== "object") &&
        (modNode === null || typeof modNode !== "object")
      ) {
        if (baseNode !== modNode && path) {
          overrides[path] = modNode;
        }
        return;
      }

      // If one is null/undefined and other isn't, it's an override
      if (
        (baseNode === null || baseNode === undefined) &&
        (modNode !== null && modNode !== undefined) &&
        path
      ) {
        overrides[path] = modNode;
        return;
      }

      if (
        (modNode === null || modNode === undefined) &&
        (baseNode !== null && baseNode !== undefined) &&
        path
      ) {
        overrides[path] = null; // Removal
        return;
      }

      // Both are objects/arrays
      if (typeof baseNode === "object" && typeof modNode === "object") {
        // Check for array
        if (Array.isArray(baseNode) || Array.isArray(modNode)) {
          const baseArr = Array.isArray(baseNode) ? baseNode : [];
          const modArr = Array.isArray(modNode) ? modNode : [];

          // Compare arrays element by element
          const maxLen = Math.max(baseArr.length, modArr.length);
          for (let i = 0; i < maxLen; i++) {
            const itemPath = path ? `${path}[${i}]` : `[${i}]`;
            if (i < baseArr.length && i < modArr.length) {
              walk(baseArr[i], modArr[i], itemPath);
            } else if (i < modArr.length) {
              // Added item
              overrides[itemPath] = modArr[i];
            } else {
              // Removed item
              overrides[itemPath] = null;
            }
          }
          return;
        }

        // Object comparison
        const allKeys = new Set([
          ...Object.keys(baseNode || {}),
          ...Object.keys(modNode || {})
        ]);

        for (const key of allKeys) {
          const keyPath = path ? `${path}.${key}` : key;
          const baseValue = baseNode?.[key];
          const modValue = modNode?.[key];

          if (key in baseNode && key in modNode) {
            // Both exist, recurse
            walk(baseValue, modValue, keyPath);
          } else if (key in modNode && !(key in baseNode)) {
            // Added in modified
            overrides[keyPath] = modValue;
          } else if (key in baseNode && !(key in modNode)) {
            // Removed in modified
            overrides[keyPath] = null;
          }
        }
      }
    }

    walk(baseTree, modifiedTree);
    return overrides;
  }

  /**
   * Convert overrides to diff format
   */
  static overridesToDiffs(overrides: Record<string, any>, baseTree: PrefabData): OverrideDiff[] {
    const diffs: OverrideDiff[] = [];

    for (const [path, modifiedValue] of Object.entries(overrides)) {
      const originalValue = PrefabVariantResolver.getPath(baseTree, path);

      diffs.push({
        path,
        original: originalValue,
        modified: modifiedValue,
        type:
          originalValue === undefined
            ? "add"
            : modifiedValue === null
            ? "remove"
            : "modify"
      });
    }

    return diffs;
  }

  /**
   * Detect conflicts in variant chain
   */
  static detectConflicts(
    overrides1: Record<string, any>,
    overrides2: Record<string, any>
  ): string[] {
    const conflicts: string[] = [];
    const paths1 = new Set(Object.keys(overrides1));
    const paths2 = new Set(Object.keys(overrides2));

    // Check for paths that exist in both but have different values
    for (const path of paths1) {
      if (paths2.has(path)) {
        if (JSON.stringify(overrides1[path]) !== JSON.stringify(overrides2[path])) {
          conflicts.push(path);
        }
      }
    }

    return conflicts;
  }

  /**
   * Merge two override sets (later variant wins)
   */
  static mergeOverrides(
    baseOverrides: Record<string, any>,
    newOverrides: Record<string, any>
  ): Record<string, any> {
    const merged = { ...baseOverrides };

    for (const [path, value] of Object.entries(newOverrides)) {
      merged[path] = value;
      // If value is null, remove from merged (revert to base)
      if (value === null) {
        delete merged[path];
      }
    }

    return merged;
  }
}

