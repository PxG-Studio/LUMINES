/**
 * Selection Sync
 * Bidirectional selection sync between Unity and WISSIL
 * Unity ↔ WISSIL selection synchronization
 */

import { useSceneGraph } from "./SceneGraphStore";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";

/**
 * Initialize Selection Sync
 * Sets up bidirectional selection synchronization
 */
export function initializeSelectionSync(): () => void {
  // Listen for Unity selection changes
  UnityMessagingBus.on("scene/select", (payload: any) => {
    const id = payload.id || payload.instanceId;
    if (id) {
      useSceneGraph.getState().select(String(id));
    }
  });

  // Listen for WISSIL selection changes and forward to Unity
  const handler = (e: CustomEvent) => {
    const id = e.detail.id;
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("scene/select", {
        instanceId: id
      });
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scenegraph-selection", handler as EventListener);
    window.addEventListener("scenegraph-hover", (e: CustomEvent) => {
      const id = e.detail.id;
      if (UnityMessagingBus.isConnected()) {
        UnityMessagingBus.send("scene/hover", {
          instanceId: id
        });
      }
    } as EventListener);

    return () => {
      window.removeEventListener("scenegraph-selection", handler as EventListener);
    };
  }

  return () => {};
}

/**
 * Select object in Unity
 */
export function selectInUnity(id: string): void {
  useSceneGraph.getState().select(id);
}

/**
 * Hover object in Unity
 */
export function hoverInUnity(id: string): void {
  useSceneGraph.getState().hover(id);
}

