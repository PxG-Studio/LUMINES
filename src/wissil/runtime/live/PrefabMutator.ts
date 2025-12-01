/**
 * Prefab Mutation Layer
 * Modifies prefab YAML and updates instantiated objects in real-time
 */

import { UnityMessagingBus } from "../unityBridge/UnityMessagingBus";

/**
 * Prefab Mutator
 * Provides live prefab mutation and object updates
 */
export const PrefabMutator = {
  /**
   * Mutate prefab from file path and YAML content
   */
  mutatePrefab: (path: string, yamlContent: string): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[PrefabMutator] Unity not connected");
      return;
    }

    try {
      const prefabName = path.split("/").pop()?.replace(/\.prefab$/, "") || "Prefab";

      UnityMessagingBus.send("mutatePrefab", {
        path,
        prefabName,
        yamlContent,
        timestamp: Date.now()
      });
    } catch (err: any) {
      console.error(`[PrefabMutator] Error mutating prefab ${path}:`, err);
      UnityMessagingBus.send("assetDiff", {
        path,
        type: "error",
        error: `Prefab mutation failed: ${err?.message || String(err)}`
      });
    }
  },

  /**
   * Update specific GameObject instance from prefab
   */
  updateInstance: (instanceName: string, prefabPath: string, yamlContent: string): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[PrefabMutator] Unity not connected");
      return;
    }

    UnityMessagingBus.send("updatePrefabInstance", {
      instanceName,
      prefabPath,
      yamlContent,
      timestamp: Date.now()
    });
  },

  /**
   * Destroy and respawn prefab instance
   */
  respawnPrefab: (instanceName: string, prefabName: string): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[PrefabMutator] Unity not connected");
      return;
    }

    UnityMessagingBus.send("respawnPrefab", {
      instanceName,
      prefabName,
      timestamp: Date.now()
    });
  }
};

