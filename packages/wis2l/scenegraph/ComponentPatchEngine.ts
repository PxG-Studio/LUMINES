/**
 * Component Patch Engine
 * Live updates to Unity components
 * Patches transform, material, component values in real-time
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useSceneGraph } from "./SceneGraphStore";

/**
 * Component Patch Engine
 * Provides live patching of Unity components
 */
export const ComponentPatchEngine = {
  /**
   * Set transform property
   */
  setTransform(
    nodeId: string,
    field: "position" | "rotation" | "scale",
    value: { x: number; y: number; z: number }
  ): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[ComponentPatchEngine] Unity not connected");
      return;
    }

    // Update local store immediately for instant UI feedback
    const node = useSceneGraph.getState().getNode(nodeId);
    if (node) {
      const fieldMap = {
        position: "position" as const,
        rotation: "rotation" as const,
        scale: "scale" as const
      };

      const newField = fieldMap[field];

      useSceneGraph.getState().updateNode({
        ...node,
        [newField]: value
      });
    }

    // Send to Unity
    UnityMessagingBus.send("patch/transform", {
      instanceId: nodeId,
      field,
      value: {
        x: value.x,
        y: value.y,
        z: value.z
      }
    });
  },

  /**
   * Set component property
   */
  setComponentProperty(
    nodeId: string,
    componentType: string,
    propertyName: string,
    value: any
  ): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[ComponentPatchEngine] Unity not connected");
      return;
    }

    UnityMessagingBus.send("patch/component", {
      instanceId: nodeId,
      componentType,
      propertyName,
      value
    });
  },

  /**
   * Add component to object
   */
  addComponent(nodeId: string, componentType: string): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[ComponentPatchEngine] Unity not connected");
      return;
    }

    UnityMessagingBus.send("add/component", {
      instanceId: nodeId,
      componentType
    });
  },

  /**
   * Remove component from object
   */
  removeComponent(nodeId: string, componentType: string): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[ComponentPatchEngine] Unity not connected");
      return;
    }

    UnityMessagingBus.send("remove/component", {
      instanceId: nodeId,
      componentType
    });
  },

  /**
   * Set material property
   */
  setMaterialProperty(
    nodeId: string,
    propertyName: string,
    value: any
  ): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[ComponentPatchEngine] Unity not connected");
      return;
    }

    UnityMessagingBus.send("patch/material", {
      instanceId: nodeId,
      propertyName,
      value
    });
  }
};

