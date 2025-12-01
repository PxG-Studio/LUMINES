/**
 * AI Animation Assistant (LUNA Integration)
 * Auto-correct, auto-smooth, detect jitter, adjust timing
 */

import { AnimationClip } from "../animation/AnimationStore";
import { useLunaMemory } from "./LunaMemoryGraph";
import { AnimatorPatcher } from "../animation/AnimatorPatcher";
import { useEditorState } from "@/state/editorState";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";

export interface AnimationIssue {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  suggestion: string;
  clip?: string;
  time?: number;
}

/**
 * LUNA Animation Assistant
 * AI-assisted animation analysis and correction
 */
export class LunaAnimationAssistant {
  /**
   * Analyze animation for issues
   */
  static analyze(clip: AnimationClip): AnimationIssue[] {
    const issues: AnimationIssue[] = [];

    // Check for frame jitter
    if (clip.currentTime > 0) {
      const frameTime = 1.0 / clip.frameRate;
      const timeRemainder = clip.currentTime % frameTime;

      if (timeRemainder > frameTime * 0.1) {
        issues.push({
          type: "frame_jitter",
          severity: "medium",
          description: "Frame timing jitter detected",
          suggestion: "Adjust playback speed or frame rate",
          clip: clip.clipName,
          time: clip.currentTime
        });
      }
    }

    // Check for inconsistent playback speed
    if (clip.speed && (clip.speed < 0.5 || clip.speed > 2.0)) {
      issues.push({
        type: "extreme_speed",
        severity: "low",
        description: `Playback speed is extreme: ${clip.speed}x`,
        suggestion: "Consider normalizing playback speed",
        clip: clip.clipName
      });
    }

    // Check for long animations
    if (clip.length > 10) {
      issues.push({
        type: "long_animation",
        severity: "low",
        description: `Animation is very long: ${clip.length.toFixed(2)}s`,
        suggestion: "Consider breaking into shorter clips",
        clip: clip.clipName
      });
    }

    // Check for very short animations
    if (clip.length < 0.1) {
      issues.push({
        type: "short_animation",
        severity: "medium",
        description: `Animation is very short: ${clip.length.toFixed(3)}s`,
        suggestion: "Consider combining with other clips",
        clip: clip.clipName
      });
    }

    return issues;
  }

  /**
   * Fix animation issues
   */
  static fix(issues: AnimationIssue[]): void {
    const pushMessage = useEditorState.getState().pushMessage;
    const memory = useLunaMemory.getState();

    for (const issue of issues) {
      switch (issue.type) {
        case "frame_jitter":
          // Slightly adjust speed to smooth out jitter
          const currentSpeed = 1.0;
          const adjustedSpeed = 0.98;
          AnimatorPatcher.setSpeed(adjustedSpeed);
          pushMessage(`[LUNA Animation] ⚙️ Adjusted speed to ${adjustedSpeed}x to reduce jitter`);
          memory.updatePattern("animation_jitter_fixed", true, 0.7);
          break;

        case "extreme_speed":
          // Normalize speed
          AnimatorPatcher.setSpeed(1.0);
          pushMessage(`[LUNA Animation] 🔧 Normalized playback speed to 1.0x`);
          break;

        default:
          pushMessage(`[LUNA Animation] 💡 Suggestion: ${issue.suggestion}`);
      }
    }
  }

  /**
   * Smooth animation transitions
   */
  static smoothTransition(fromClip: string, toClip: string): void {
    const pushMessage = useEditorState.getState().pushMessage;

    // Use crossfade for smooth transition
    AnimatorPatcher.crossfade(toClip, 0.3);
    pushMessage(`[LUNA Animation] ✨ Smooth transition: ${fromClip} → ${toClip}`);
  }

  /**
   * Detect animation timing mismatches
   */
  static detectTimingMismatch(clips: AnimationClip[]): AnimationIssue[] {
    const issues: AnimationIssue[] = [];

    // Check for clips with mismatched frame rates
    const frameRates = clips.map((c) => c.frameRate);
    const uniqueFrameRates = [...new Set(frameRates)];

    if (uniqueFrameRates.length > 1) {
      issues.push({
        type: "frame_rate_mismatch",
        severity: "medium",
        description: `Multiple frame rates detected: ${uniqueFrameRates.join(", ")}`,
        suggestion: "Normalize all clips to the same frame rate",
        clip: clips[0]?.clipName
      });
    }

    return issues;
  }

  /**
   * Auto-align event markers
   */
  static alignEventMarkers(
    events: Array<{ time: number; functionName: string }>,
    snapInterval: number = 0.1
  ): Array<{ time: number; functionName: string }> {
    return events.map((event) => ({
      ...event,
      time: Math.round(event.time / snapInterval) * snapInterval
    }));
  }

  /**
   * Propose curve easing
   */
  static proposeEasing(curveType: "linear" | "easeIn" | "easeOut" | "easeInOut"): {
    inTangent: number;
    outTangent: number;
  } {
    switch (curveType) {
      case "easeIn":
        return { inTangent: 0, outTangent: 1 };
      case "easeOut":
        return { inTangent: 1, outTangent: 0 };
      case "easeInOut":
        return { inTangent: 0, outTangent: 0 };
      default:
        return { inTangent: 1, outTangent: 1 };
    }
  }
}

