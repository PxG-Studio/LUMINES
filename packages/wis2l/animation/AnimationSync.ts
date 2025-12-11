/**
 * Animation Sync
 * Synchronizes Unity animation state with WISSIL store
 */

import { useAnimationStore, AnimationClip } from "./AnimationStore";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useEditorState } from "@/state/editorState";

/**
 * Initialize Animation Sync
 * Sets up Unity → WISSIL animation synchronization
 */
export function initializeAnimationSync(): () => void {
  // Listen for Unity animation updates
  UnityMessagingBus.on("animation/update", (payload: any) => {
    try {
      const clips = Array.isArray(payload) ? payload : payload.clips || [];
      const animationClips: AnimationClip[] = clips.map((c: any) => ({
        clipName: c.clipName || c.name,
        length: c.length || 1.0,
        frameRate: c.frameRate || 30,
        currentTime: c.currentTime || 0,
        isPlaying: c.isPlaying,
        loop: c.loop,
        speed: c.speed || 1.0
      }));

      useAnimationStore.getState().setClips(animationClips);

      // Update current time if only one clip
      if (animationClips.length > 0) {
        const currentClip = animationClips[0];
        useAnimationStore.getState().setCurrentTime(currentClip.currentTime);
        useAnimationStore.getState().setPlaying(currentClip.isPlaying || false);
      }
    } catch (err: any) {
      console.error("[AnimationSync] Error processing animation update:", err);
    }
  });

  // Listen for animation events
  UnityMessagingBus.on("animation/event", (payload: any) => {
    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Animation] Event: ${payload.functionName || payload.eventName} at ${payload.time || 0}s`);
  });

  // Request initial animation state
  requestAnimationState();

  // Periodically request updates (fallback if Unity doesn't auto-emit)
  const interval = setInterval(() => {
    requestAnimationState();
  }, 100); // Every 100ms for smooth timeline updates

  return () => {
    clearInterval(interval);
  };
}

/**
 * Request animation state from Unity
 */
export function requestAnimationState(): void {
  if (UnityMessagingBus.isConnected()) {
    UnityMessagingBus.send("animation/request", {});
  }
}

/**
 * Request keyframes for a clip
 */
export function requestKeyframes(clipName: string): void {
  if (UnityMessagingBus.isConnected()) {
    UnityMessagingBus.send("animation/requestKeyframes", { clipName });
  }
}

