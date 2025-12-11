/**
 * AssetDiff Engine
 * Watches filesystem changes and computes deltas for live asset updates
 * Similar to StackBlitz's file diff push system
 */

import { useWissilFS } from "@/wis2l/runtime/fs/wissilFs";
import { UnityMessagingBus } from "../unityBridge/UnityMessagingBus";
import { TextureInjector } from "./TextureInjector";
import { MaterialInjector } from "./MaterialInjector";
import { PrefabMutator } from "./PrefabMutator";
import { UIPatcher } from "./UIPatcher";

type FileSnapshot = Record<string, string>;

let previousSnapshot: FileSnapshot = {};
let isEnabled = true;

/**
 * Initialize asset diff engine
 * Watches FS changes and pushes deltas to Unity
 */
export function initializeAssetDiffEngine(): () => void {
  const fs = useWissilFS.getState();

  // Get initial snapshot
  previousSnapshot = flattenSnapshot(fs.getSnapshot());

  // Subscribe to FS changes using Zustand's subscribe pattern
  const unsubscribe = useWissilFS.subscribe(
    (state) => {
      if (!isEnabled) return;

      const currentSnapshot = flattenSnapshot(state.root);
      const diffs = computeDiff(previousSnapshot, currentSnapshot);

      if (diffs.length > 0) {
        processDiffs(diffs);
        previousSnapshot = { ...currentSnapshot };
      }
    }
  );

  // Return cleanup function
  return () => {
    unsubscribe();
    previousSnapshot = {};
  };
}

/**
 * Enable or disable asset diff engine
 */
export function setAssetDiffEnabled(enabled: boolean): void {
  isEnabled = enabled;
}

/**
 * Get current enabled state
 */
export function isAssetDiffEnabled(): boolean {
  return isEnabled;
}

/**
 * Flatten filesystem snapshot to flat key-value map
 */
function flattenSnapshot(
  folder: any,
  prefix = ""
): FileSnapshot {
  const out: FileSnapshot = {};

  if (!folder || !folder.children) {
    return out;
  }

  for (const name in folder.children) {
    const node = folder.children[name];
    const path = prefix ? `${prefix}/${name}` : name;

    if (node.type === "folder") {
      const nested = flattenSnapshot(node, path);
      Object.assign(out, nested);
    } else if (node.type === "file") {
      out[path] = node.content || "";
    }
  }

  return out;
}

/**
 * Compute differences between two snapshots
 */
function computeDiff(
  prev: FileSnapshot,
  curr: FileSnapshot
): Array<{ path: string; content: string; type: "added" | "modified" | "deleted" }> {
  const diffs: Array<{ path: string; content: string; type: "added" | "modified" | "deleted" }> = [];

  // Find added and modified files
  for (const path in curr) {
    if (!prev[path]) {
      diffs.push({ path, content: curr[path], type: "added" });
    } else if (prev[path] !== curr[path]) {
      diffs.push({ path, content: curr[path], type: "modified" });
    }
  }

  // Find deleted files
  for (const path in prev) {
    if (!curr[path]) {
      diffs.push({ path, content: "", type: "deleted" });
    }
  }

  return diffs;
}

/**
 * Process file diffs and route to appropriate injector
 */
function processDiffs(
  diffs: Array<{ path: string; content: string; type: "added" | "modified" | "deleted" }>
): void {
  if (!UnityMessagingBus.isConnected()) {
    console.warn("[AssetDiff] Unity not connected, skipping asset updates");
    return;
  }

  for (const diff of diffs) {
    try {
      // Route based on file extension
      if (diff.path.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
        if (diff.type !== "deleted") {
          TextureInjector.patchTexture(diff.path, diff.content);
        }
      } else if (diff.path.endsWith(".mat")) {
        // Material files - parse and update
        if (diff.type !== "deleted") {
          MaterialInjector.patchMaterialFromYAML(diff.path, diff.content);
        }
      } else if (diff.path.endsWith(".prefab")) {
        // Prefab files - trigger mutation
        if (diff.type !== "deleted") {
          PrefabMutator.mutatePrefab(diff.path, diff.content);
        }
      } else if (diff.path.endsWith(".cs")) {
        // C# scripts - log but don't hot-reload (requires rebuild)
        console.info(`[AssetDiff] C# script changed: ${diff.path} (requires rebuild)`);
        UnityMessagingBus.send("assetDiff", {
          path: diff.path,
          type: "script",
          note: "C# scripts require rebuild"
        });
      } else if (diff.path.match(/\.(unity)$/i)) {
        // Scene files - log but don't hot-reload
        console.info(`[AssetDiff] Scene file changed: ${diff.path} (requires reload)`);
        UnityMessagingBus.send("assetDiff", {
          path: diff.path,
          type: "scene",
          note: "Scene files require reload"
        });
      } else if (diff.path.match(/UI.*\.(png|jpg|jpeg)$/i)) {
        // UI textures
        if (diff.type !== "deleted") {
          UIPatcher.patchSprite(diff.path, diff.content);
        }
      }

      // Send general asset diff event
      UnityMessagingBus.send("assetDiff", {
        path: diff.path,
        type: diff.type,
        timestamp: Date.now()
      });
    } catch (err: any) {
      console.error(`[AssetDiff] Error processing ${diff.path}:`, err);
      UnityMessagingBus.send("assetDiff", {
        path: diff.path,
        type: "error",
        error: err?.message || String(err)
      });
    }
  }
}

/**
 * Manually trigger asset update (useful for testing)
 */
export function triggerAssetUpdate(path: string): void {
  const fs = useWissilFS.getState();
  const content = fs.readFile(path);

  if (content === null) {
    console.warn(`[AssetDiff] File not found: ${path}`);
    return;
  }

  processDiffs([{ path, content, type: "modified" }]);
}

