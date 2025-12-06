/**
 * Prefab Diff Engine
 * Tracks changes between original and modified prefabs
 */

import { PrefabData, PrefabDiff as PrefabDiffType } from "./PrefabTypes";

/**
 * Prefab Diff
 * Compares prefab states and tracks overrides
 */
export class PrefabDiff {
  /**
   * Compare two prefab data structures and find differences
   */
  static diff(original: PrefabData, modified: PrefabData, path: string = ""): PrefabDiffType[] {
    const diffs: PrefabDiffType[] = [];

    // Compare basic properties
    if (original.name !== modified.name) {
      diffs.push({
        path: path ? `${path}.name` : "name",
        original: original.name,
        modified: modified.name,
        type: "modify"
      });
    }

    // Compare transform
    const transformDiffs = this.diffTransform(
      original.transform,
      modified.transform,
      path ? `${path}.transform` : "transform"
    );
    diffs.push(...transformDiffs);

    // Compare components
    const componentDiffs = this.diffComponents(
      original.components,
      modified.components,
      path ? `${path}.components` : "components"
    );
    diffs.push(...componentDiffs);

    // Compare children recursively
    const childDiffs = this.diffChildren(original.children, modified.children, path);
    diffs.push(...childDiffs);

    return diffs;
  }

  /**
   * Compare transform properties
   */
  private static diffTransform(
    original: PrefabData["transform"],
    modified: PrefabData["transform"],
    path: string
  ): PrefabDiffType[] {
    const diffs: PrefabDiffType[] = [];

    // Position
    if (original.pos.x !== modified.pos.x) {
      diffs.push({
        path: `${path}.pos.x`,
        original: original.pos.x,
        modified: modified.pos.x,
        type: "modify"
      });
    }
    if (original.pos.y !== modified.pos.y) {
      diffs.push({
        path: `${path}.pos.y`,
        original: original.pos.y,
        modified: modified.pos.y,
        type: "modify"
      });
    }
    if (original.pos.z !== modified.pos.z) {
      diffs.push({
        path: `${path}.pos.z`,
        original: original.pos.z,
        modified: modified.pos.z,
        type: "modify"
      });
    }

    // Rotation
    if (original.rot.x !== modified.rot.x) {
      diffs.push({
        path: `${path}.rot.x`,
        original: original.rot.x,
        modified: modified.rot.x,
        type: "modify"
      });
    }
    if (original.rot.y !== modified.rot.y) {
      diffs.push({
        path: `${path}.rot.y`,
        original: original.rot.y,
        modified: modified.rot.y,
        type: "modify"
      });
    }
    if (original.rot.z !== modified.rot.z) {
      diffs.push({
        path: `${path}.rot.z`,
        original: original.rot.z,
        modified: modified.rot.z,
        type: "modify"
      });
    }

    // Scale
    if (original.scale.x !== modified.scale.x) {
      diffs.push({
        path: `${path}.scale.x`,
        original: original.scale.x,
        modified: modified.scale.x,
        type: "modify"
      });
    }
    if (original.scale.y !== modified.scale.y) {
      diffs.push({
        path: `${path}.scale.y`,
        original: original.scale.y,
        modified: modified.scale.y,
        type: "modify"
      });
    }
    if (original.scale.z !== modified.scale.z) {
      diffs.push({
        path: `${path}.scale.z`,
        original: original.scale.z,
        modified: modified.scale.z,
        type: "modify"
      });
    }

    return diffs;
  }

  /**
   * Compare components
   */
  private static diffComponents(
    original: PrefabData["components"],
    modified: PrefabData["components"],
    path: string
  ): PrefabDiffType[] {
    const diffs: PrefabDiffType[] = [];

    // Compare by index and type
    const maxLength = Math.max(original.length, modified.length);

    for (let i = 0; i < maxLength; i++) {
      const orig = original[i];
      const mod = modified[i];

      if (!orig && mod) {
        // Component added
        diffs.push({
          path: `${path}[${i}]`,
          original: null,
          modified: mod,
          type: "add"
        });
      } else if (orig && !mod) {
        // Component removed
        diffs.push({
          path: `${path}[${i}]`,
          original: orig,
          modified: null,
          type: "remove"
        });
      } else if (orig && mod && orig.json !== mod.json) {
        // Component modified
        diffs.push({
          path: `${path}[${i}]`,
          original: orig,
          modified: mod,
          type: "modify"
        });
      }
    }

    return diffs;
  }

  /**
   * Compare children recursively
   */
  private static diffChildren(
    original: PrefabData["children"],
    modified: PrefabData["children"],
    path: string
  ): PrefabDiffType[] {
    const diffs: PrefabDiffType[] = [];

    // Create maps by ID for easier comparison
    const origMap = new Map<string, PrefabData>();
    const modMap = new Map<string, PrefabData>();

    original.forEach((child) => origMap.set(child.id, child));
    modified.forEach((child) => modMap.set(child.id, child));

    // Check for removed children
    origMap.forEach((child, id) => {
      if (!modMap.has(id)) {
        diffs.push({
          path: path ? `${path}.children[${id}]` : `children[${id}]`,
          original: child,
          modified: null,
          type: "remove"
        });
      }
    });

    // Check for added children
    modMap.forEach((child, id) => {
      if (!origMap.has(id)) {
        diffs.push({
          path: path ? `${path}.children[${id}]` : `children[${id}]`,
          original: null,
          modified: child,
          type: "add"
        });
      } else {
        // Recursively compare existing children
        const origChild = origMap.get(id)!;
        const childDiffs = this.diff(
          origChild,
          child,
          path ? `${path}.children[${id}]` : `children[${id}]`
        );
        diffs.push(...childDiffs);
      }
    });

    return diffs;
  }

  /**
   * Apply diffs to a prefab
   */
  static applyDiffs(prefab: PrefabData, diffs: PrefabDiffType[]): PrefabData {
    const modified = JSON.parse(JSON.stringify(prefab)) as PrefabData;

    for (const diff of diffs) {
      this.applyDiff(modified, diff);
    }

    return modified;
  }

  /**
   * Apply a single diff to a prefab
   */
  private static applyDiff(prefab: PrefabData, diff: PrefabDiffType): void {
    const parts = diff.path.split(".");
    let current: any = prefab;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      
      // Handle array indices
      const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, arrayName, index] = arrayMatch;
        current = current[arrayName]?.[parseInt(index, 10)];
      } else {
        current = current[part];
      }

      if (!current) return;
    }

    const lastPart = parts[parts.length - 1];
    current[lastPart] = diff.modified;
  }
}

