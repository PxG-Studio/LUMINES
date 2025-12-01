/**
 * Live Shader Patcher
 * Hot-patches shader parameters into Unity WebGL runtime
 * Integrates with Phase F/G hot-reload pipeline
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useMaterialStore } from "./MaterialStore";
import { useEditorState } from "@/state/editorState";

/**
 * Live Shader Patcher
 * Real-time shader parameter updates
 */
export const LiveShaderPatcher = {
  /**
   * Patch shader parameter
   */
  patch(
    objectId: string,
    paramName: string,
    paramType: string,
    value: any
  ): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[LiveShaderPatcher] Unity not connected");
      return;
    }

    // Update local store immediately for instant UI feedback
    useMaterialStore.getState().updateParameter(objectId, paramName, value);

    // Prepare value for Unity
    let unityValue: any = value;

    // Convert color/vector to Unity format
    if (paramType === "Color" && typeof value === "object") {
      unityValue = {
        r: value.r || 0,
        g: value.g || 0,
        b: value.b || 0,
        a: value.a !== undefined ? value.a : 1
      };
    }

    if (paramType === "Vector" && typeof value === "object") {
      unityValue = {
        x: value.x || 0,
        y: value.y || 0,
        z: value.z || 0,
        w: value.w !== undefined ? value.w : 0
      };
    }

    // Send to Unity
    UnityMessagingBus.send("material/patch", {
      objectId,
      paramName,
      paramType,
      value: unityValue
    });

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(
      `[Material] Updated ${paramName}: ${typeof value === "object" ? JSON.stringify(value) : value}`
    );
  },

  /**
   * Batch patch multiple parameters
   */
  patchBatch(objectId: string, patches: Array<{ name: string; type: string; value: any }>): void {
    for (const patch of patches) {
      this.patch(objectId, patch.name, patch.type, patch.value);
    }
  },

  /**
   * Reset parameter to default
   */
  resetParameter(objectId: string, paramName: string): void {
    const material = useMaterialStore.getState().getMaterial(objectId);
    if (!material) return;

    const param = material.parameters.find((p) => p.name === paramName);
    if (!param) return;

    // Get default value based on type
    let defaultValue: any;
    switch (param.type) {
      case "Float":
      case "Range":
        defaultValue = 0;
        break;
      case "Color":
        defaultValue = { r: 1, g: 1, b: 1, a: 1 };
        break;
      case "Vector":
        defaultValue = { x: 0, y: 0, z: 0, w: 0 };
        break;
      default:
        defaultValue = null;
    }

    if (defaultValue !== null) {
      this.patch(objectId, paramName, param.type, defaultValue);
    }
  }
};

