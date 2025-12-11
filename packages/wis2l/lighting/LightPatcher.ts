/**
 * Light Patcher
 * Sends light property edits back to Unity
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useEditorState } from "@/state/editorState";

/**
 * Light Patcher
 * Patches light properties in Unity runtime
 */
export class LightPatcher {
  /**
   * Patch a light property
   */
  static patch(lightId: string, field: string, value: any): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[LightPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("light/patch", {
      id: lightId,
      field,
      value
    });

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Light] Updated ${field}: ${typeof value === "object" ? JSON.stringify(value) : value}`);
  }

  /**
   * Create a new light
   */
  static create(type: "Directional" | "Point" | "Spot", position?: { x: number; y: number; z: number }): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[LightPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("light/create", {
      type,
      position: position || { x: 0, y: 0, z: 0 }
    });
  }

  /**
   * Delete a light
   */
  static delete(lightId: string): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[LightPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("light/delete", {
      id: lightId
    });
  }
}

