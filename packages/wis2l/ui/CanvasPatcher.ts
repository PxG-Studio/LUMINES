/**
 * Canvas Patcher
 * Sends UI edits back to Unity
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { LayoutConfig, AnchorPreset } from "./UITypes";
import { useEditorState } from "@/state/editorState";

/**
 * Canvas Patcher
 * Patches UI Canvas properties in Unity runtime
 */
export class CanvasPatcher {
  /**
   * Patch a RectTransform property
   */
  static patch(rectId: string, field: string, value: any): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[CanvasPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("ui/patch", {
      id: rectId,
      field,
      value
    });

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(
      `[UI] Updated ${field}: ${typeof value === "object" ? JSON.stringify(value) : value}`
    );
  }

  /**
   * Apply anchor preset
   */
  static applyAnchorPreset(rectId: string, preset: string | AnchorPreset): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[CanvasPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("ui/applyAnchorPreset", {
      id: rectId,
      preset: typeof preset === "string" ? preset : preset.name,
      config: typeof preset === "object" ? preset : undefined
    });
  }

  /**
   * Apply layout configuration
   */
  static applyLayout(rectId: string, config: LayoutConfig): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[CanvasPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("ui/applyLayout", {
      id: rectId,
      config
    });
  }

  /**
   * Update UI style
   */
  static updateStyle(rectId: string, style: Record<string, any>): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[CanvasPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("ui/style", {
      rectId,
      style
    });
  }
}

