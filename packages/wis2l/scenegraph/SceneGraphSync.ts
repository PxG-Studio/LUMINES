/**
 * Scene Graph Sync
 * Synchronizes Unity scene graph with WISSIL store
 * Handles full and partial updates
 */

import { useSceneGraph, SceneNode } from "./SceneGraphStore";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { diffScene, applyDiff } from "./SceneDiff";

let lastGraph: Record<string, SceneNode> = {};

/**
 * Initialize Scene Graph Sync
 * Sets up Unity → WISSIL scene graph synchronization
 */
export function initializeSceneGraphSync(): () => void {
  // Listen for Unity scene graph updates
  UnityMessagingBus.on("scenegraph/update", (payload: any) => {
    try {
      // Parse scene nodes from Unity
      const nodes = Array.isArray(payload) ? payload : payload.nodes || [];

      if (nodes.length === 0) {
        return;
      }

      // Convert to SceneNode format
      const sceneNodes: SceneNode[] = nodes.map((node: any) => ({
        id: String(node.id || node.instanceId),
        name: node.name || "Unnamed",
        parent: node.parent ? String(node.parent) : null,
        position: node.pos || node.position || { x: 0, y: 0, z: 0 },
        rotation: node.rot || node.rotation || { x: 0, y: 0, z: 0 },
        scale: node.scale || { x: 1, y: 1, z: 1 },
        components: node.components || [],
        active: node.active !== false,
        layer: node.layer,
        tag: node.tag
      }));

      // Apply diff for efficient updates
      const currentGraph = useSceneGraph.getState().nodes;
      const newGraph: Record<string, SceneNode> = {};
      sceneNodes.forEach((node) => {
        newGraph[node.id] = node;
      });

      const diff = diffScene(lastGraph, newGraph);
      lastGraph = { ...newGraph };

      // Update store
      useSceneGraph.getState().updateNodes(sceneNodes);
    } catch (err: any) {
      console.error("[SceneGraphSync] Error processing scene graph update:", err);
    }
  });

  // Listen for partial updates (changed nodes only)
  UnityMessagingBus.on("scenegraph/partial", (payload: any) => {
    try {
      const nodes = Array.isArray(payload) ? payload : payload.nodes || [];
      const sceneNodes: SceneNode[] = nodes.map((node: any) => ({
        id: String(node.id || node.instanceId),
        name: node.name || "Unnamed",
        parent: node.parent ? String(node.parent) : null,
        position: node.pos || node.position || { x: 0, y: 0, z: 0 },
        rotation: node.rot || node.rotation || { x: 0, y: 0, z: 0 },
        scale: node.scale || { x: 1, y: 1, z: 1 },
        components: node.components || [],
        active: node.active !== false,
        layer: node.layer,
        tag: node.tag
      }));

      // Update only changed nodes
      useSceneGraph.getState().updateNodes(sceneNodes);

      // Update last graph
      sceneNodes.forEach((node) => {
        lastGraph[node.id] = node;
      });
    } catch (err: any) {
      console.error("[SceneGraphSync] Error processing partial update:", err);
    }
  });

  // Request initial scene graph from Unity
  requestSceneGraph();

  // Periodically request updates (fallback if Unity doesn't auto-emit)
  const interval = setInterval(() => {
    requestSceneGraph();
  }, 500); // Every 500ms

  return () => {
    clearInterval(interval);
  };
}

/**
 * Request scene graph from Unity
 */
export function requestSceneGraph(): void {
  if (UnityMessagingBus.isConnected()) {
    UnityMessagingBus.send("scenegraph/request", {});
  }
}

/**
 * Reset scene graph sync
 */
export function resetSceneGraphSync(): void {
  lastGraph = {};
  useSceneGraph.getState().clear();
}

