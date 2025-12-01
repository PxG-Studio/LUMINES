/**
 * Live Animator Patcher
 * Runtime hot edit for animation parameters
 * Modify animation speed, blend weights, crossfade durations, loop settings
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useEditorState } from "@/state/editorState";

/**
 * Animator Patcher
 * Live animation parameter updates
 */
export const AnimatorPatcher = {
  /**
   * Set animation playback speed
   */
  setSpeed(speed: number): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[AnimatorPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("animation/setSpeed", { speed });

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Animation] Speed set to ${speed}x`);
  },

  /**
   * Crossfade to animation clip
   */
  crossfade(clipName: string, duration: number = 0.3): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[AnimatorPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("animation/crossfade", {
      clip: clipName,
      duration
    });

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Animation] Crossfading to ${clipName} over ${duration}s`);
  },

  /**
   * Set blend weight for animation layer
   */
  setBlendWeight(layerIndex: number, weight: number): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[AnimatorPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("animation/setBlendWeight", {
      layerIndex,
      weight
    });
  },

  /**
   * Set animation loop state
   */
  setLoop(clipName: string, loop: boolean): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[AnimatorPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("animation/setLoop", {
      clip: clipName,
      loop
    });

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Animation] Loop ${loop ? "enabled" : "disabled"} for ${clipName}`);
  },

  /**
   * Trigger animation parameter (bool, trigger, float)
   */
  setParameter(paramName: string, value: any, paramType: "Bool" | "Trigger" | "Float" | "Int"): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[AnimatorPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("animation/setParameter", {
      paramName,
      value,
      paramType
    });
  }
};

