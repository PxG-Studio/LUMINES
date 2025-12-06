/**
 * Material Sync
 * Synchronizes Unity material snapshots with WISSIL store
 */

import { useMaterialStore, MaterialSnapshot } from "./MaterialStore";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useSceneGraph } from "../scenegraph/SceneGraphStore";

/**
 * Initialize Material Sync
 * Sets up Unity → WISSIL material synchronization
 */
export function initializeMaterialSync(): () => void {
  // Listen for Unity material snapshots
  UnityMessagingBus.on("material/snapshot", (payload: any) => {
    try {
      const snapshot: MaterialSnapshot = {
        objectId: String(payload.objectId || payload.id),
        materialName: payload.materialName || "Unnamed Material",
        shaderName: payload.shaderName || "Unknown Shader",
        parameters: payload.parameters || [],
        timestamp: Date.now()
      };

      useMaterialStore.getState().setSnapshot(snapshot);
    } catch (err: any) {
      console.error("[MaterialSync] Error processing material snapshot:", err);
    }
  });

  // Listen for material preview images
  UnityMessagingBus.on("material/preview", (payload: any) => {
    const { useMaterialPreview } = require("./MaterialPreviewStore");
    useMaterialPreview.getState().setPreview(payload);
  });

  // Request material snapshot when object is selected in scene graph
  if (typeof window !== "undefined") {
    const handler = (e: CustomEvent) => {
      const objectId = e.detail.id;
      if (objectId) {
        requestMaterialSnapshot(objectId);
      }
    };

    window.addEventListener("scenegraph-selection", handler as EventListener);

    return () => {
      window.removeEventListener("scenegraph-selection", handler as EventListener);
    };
  }

  return () => {};
}

/**
 * Request material snapshot from Unity
 */
export function requestMaterialSnapshot(objectId: string): void {
  if (UnityMessagingBus.isConnected()) {
    UnityMessagingBus.send("material/request", {
      objectId
    });
  }
}

/**
 * Request material preview from Unity
 */
export function requestMaterialPreview(objectId: string): void {
  if (UnityMessagingBus.isConnected()) {
    UnityMessagingBus.send("material/requestPreview", {
      objectId
    });
  }
}

