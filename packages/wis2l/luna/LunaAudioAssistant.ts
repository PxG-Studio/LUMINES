/**
 * LUNA Audio Mixing Assistant
 * AI analyzes sound + fixes issues
 */

import { AudioGroupSnapshot } from "../audio/AudioTypes";
import { AudioPatcher } from "../audio/AudioPatcher";
import { useAudioMixerStore } from "../audio/AudioMixerStore";
import { useEditorState } from "@/state/editorState";

export interface AudioIssue {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  suggestion: string;
  fix?: () => void;
}

/**
 * LUNA Audio Assistant
 * Analyzes audio mixing and provides suggestions
 */
export class LunaAudioAssistant {
  /**
   * Analyze audio mixer setup
   */
  static analyze(groups: Record<string, AudioGroupSnapshot>): AudioIssue[] {
    const issues: AudioIssue[] = [];
    const groupList = Object.values(groups);

    // Check for master group
    const master = groupList.find((g) => g.name.toLowerCase() === "master");
    if (master) {
      // Check master volume
      if (master.volume < -20) {
        issues.push({
          type: "master_too_quiet",
          severity: "medium",
          description: "Master output is too quiet",
          suggestion: "Raise master volume for better audibility",
          fix: () => {
            AudioPatcher.patch(master.id, master.name, "volume", Math.max(-10, master.volume + 10));
          }
        });
      }

      if (master.volume > 5) {
        issues.push({
          type: "master_clipping",
          severity: "high",
          description: "Master volume may cause clipping",
          suggestion: "Lower master volume to prevent distortion",
          fix: () => {
            AudioPatcher.patch(master.id, master.name, "volume", Math.min(0, master.volume - 5));
          }
        });
      }
    }

    // Check for groups with very high volume
    const loudGroups = groupList.filter((g) => g.volume > 10);
    if (loudGroups.length > 0) {
      issues.push({
        type: "loud_groups",
        severity: "medium",
        description: `${loudGroups.length} group(s) have very high volume`,
        suggestion: "Consider lowering individual group volumes",
        fix: () => {
          loudGroups.forEach((group) => {
            AudioPatcher.patch(group.id, group.name, "volume", Math.max(0, group.volume - 5));
          });
        }
      });
    }

    // Check for groups with very low volume (might be unused)
    const quietGroups = groupList.filter((g) => g.volume < -60 && g.name.toLowerCase() !== "master");
    if (quietGroups.length > 0) {
      issues.push({
        type: "very_quiet_groups",
        severity: "low",
        description: `${quietGroups.length} group(s) are very quiet`,
        suggestion: "Consider removing or adjusting quiet groups",
        fix: undefined
      });
    }

    // Check for missing effects on SFX groups
    const sfxGroups = groupList.filter((g) =>
      g.name.toLowerCase().includes("sfx") || g.name.toLowerCase().includes("sound")
    );
    const sfxWithoutReverb = sfxGroups.filter(
      (g) => !g.effects || !g.effects.some((e) => e.type === "Reverb")
    );
    if (sfxWithoutReverb.length > 0 && sfxGroups.length > 0) {
      issues.push({
        type: "sfx_no_reverb",
        severity: "low",
        description: "Some SFX groups lack reverb",
        suggestion: "Consider adding reverb to SFX groups for spatial depth",
        fix: undefined
      });
    }

    // Check for extreme pitch values
    const extremePitch = groupList.filter((g) => g.pitch < 0.5 || g.pitch > 2);
    if (extremePitch.length > 0) {
      issues.push({
        type: "extreme_pitch",
        severity: "medium",
        description: `${extremePitch.length} group(s) have extreme pitch values`,
        suggestion: "Extreme pitch may cause audio artifacts",
        fix: () => {
          extremePitch.forEach((group) => {
            const normalizedPitch = Math.max(0.5, Math.min(2, group.pitch));
            AudioPatcher.patch(group.id, group.name, "pitch", normalizedPitch);
          });
        }
      });
    }

    return issues;
  }

  /**
   * Auto-balance mixer
   */
  static autoBalance(): void {
    const groups = useAudioMixerStore.getState().groups;
    const issues = this.analyze(groups);
    const pushMessage = useEditorState.getState().pushMessage;

    // Auto-fix high priority issues
    for (const issue of issues) {
      if (issue.severity === "high" && issue.fix) {
        issue.fix();
        pushMessage(`[LUNA Audio] Auto-fixed: ${issue.description}`);
      }
    }
  }

  /**
   * Suggest mixer preset style
   */
  static suggestPresetStyle(style: string): void {
    const pushMessage = useEditorState.getState().pushMessage;
    
    // Example preset suggestions (would be expanded with actual presets)
    switch (style.toLowerCase()) {
      case "persona 5":
        pushMessage("[LUNA Audio] Suggested: Bright highs, warm mids, subtle reverb");
        break;
      case "genshin":
        pushMessage("[LUNA Audio] Suggested: Clear vocals, spatial depth, layered reverb");
        break;
      case "ffxiv":
        pushMessage("[LUNA Audio] Suggested: Orchestral balance, wide stereo, minimal compression");
        break;
      case "elden ring":
        pushMessage("[LUNA Audio] Suggested: Atmospheric, heavy reverb, dynamic range");
        break;
      default:
        pushMessage("[LUNA Audio] Preset style suggestions coming soon");
    }
  }
}

