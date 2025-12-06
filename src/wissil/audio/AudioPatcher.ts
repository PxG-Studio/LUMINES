/**
 * Audio Patch Pusher
 * Sends audio edits back to Unity
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { AudioEffect } from "./AudioTypes";
import { useEditorState } from "@/state/editorState";

/**
 * Audio Patcher
 * Patches audio mixer properties in Unity runtime
 */
export class AudioPatcher {
  /**
   * Patch a mixer group property
   */
  static patch(groupId: string, groupName: string, field: string, value: any): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[AudioPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("audio/patch", {
      id: groupId,
      name: groupName,
      field,
      value
    });

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Audio] Updated ${groupName}.${field}: ${typeof value === "object" ? JSON.stringify(value) : value}`);
  }

  /**
   * Add effect to group
   */
  static addEffect(groupId: string, groupName: string, effectType: AudioEffect["type"]): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[AudioPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("audio/addEffect", {
      id: groupId,
      name: groupName,
      effectType
    });
  }

  /**
   * Toggle effect
   */
  static toggleEffect(groupId: string, groupName: string, effectIndex: number, enabled: boolean): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[AudioPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("audio/toggleEffect", {
      id: groupId,
      name: groupName,
      effectIndex,
      enabled
    });
  }

  /**
   * Remove effect
   */
  static removeEffect(groupId: string, groupName: string, effectIndex: number): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[AudioPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("audio/removeEffect", {
      id: groupId,
      name: groupName,
      effectIndex
    });
  }

  /**
   * Update effect parameter
   */
  static updateEffectParam(
    groupId: string,
    groupName: string,
    effectIndex: number,
    param: string,
    value: number
  ): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[AudioPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("audio/updateEffectParam", {
      id: groupId,
      name: groupName,
      effectIndex,
      param,
      value
    });
  }
}

