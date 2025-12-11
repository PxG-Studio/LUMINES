/**
 * LUNA Light Assistant
 * AI evaluates lighting and suggests fixes
 */

import { LightSnapshot } from "../lighting/LightTypes";
import { useLightStore } from "../lighting/LightStore";
import { LightPatcher } from "../lighting/LightPatcher";
import { useEditorState } from "@/state/editorState";

export interface LightingIssue {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  suggestion: string;
  fix?: () => void;
}

/**
 * LUNA Light Assistant
 * Analyzes lighting and provides suggestions
 */
export class LunaLightAssistant {
  /**
   * Analyze lighting setup
   */
  static analyze(lights: Record<string, LightSnapshot>): LightingIssue[] {
    const issues: LightingIssue[] = [];
    const lightList = Object.values(lights);

    // Calculate total intensity
    const totalIntensity = lightList.reduce((sum, light) => sum + light.intensity, 0);

    // Check for too dark scene
    if (totalIntensity < 0.5) {
      issues.push({
        type: "scene_too_dark",
        severity: "high",
        description: "Scene is too dark",
        suggestion: "Consider increasing main light intensity or adding more lights",
        fix: () => {
          const mainLight = lightList.find((l) => l.type === "Directional");
          if (mainLight) {
            LightPatcher.patch(mainLight.id, "intensity", Math.max(1, mainLight.intensity * 1.5));
          }
        }
      });
    }

    // Check for overexposed scene
    if (totalIntensity > 8) {
      issues.push({
        type: "scene_overexposed",
        severity: "medium",
        description: "Scene is overexposed",
        suggestion: "Reduce directional light intensity or lower exposure",
        fix: () => {
          const mainLight = lightList.find((l) => l.type === "Directional");
          if (mainLight) {
            LightPatcher.patch(mainLight.id, "intensity", Math.min(2, mainLight.intensity * 0.7));
          }
        }
      });
    }

    // Check for no directional light
    const hasDirectional = lightList.some((l) => l.type === "Directional");
    if (!hasDirectional) {
      issues.push({
        type: "no_directional_light",
        severity: "medium",
        description: "No directional light found",
        suggestion: "Add a directional light for main scene lighting",
        fix: () => {
          LightPatcher.create("Directional", { x: 0, y: 5, z: 0 });
        }
      });
    }

    // Check for too many lights
    if (lightList.length > 10) {
      issues.push({
        type: "too_many_lights",
        severity: "low",
        description: `Many lights detected (${lightList.length})`,
        suggestion: "Consider reducing light count for better performance",
        fix: undefined
      });
    }

    // Check for lights with no shadows enabled
    const lightsWithoutShadows = lightList.filter((l) => l.shadows === "None");
    if (lightsWithoutShadows.length === lightList.length && lightList.length > 0) {
      issues.push({
        type: "no_shadows",
        severity: "low",
        description: "No shadows enabled on any lights",
        suggestion: "Consider enabling shadows for better visual depth",
        fix: undefined
      });
    }

    // Check for very low shadow strength
    const weakShadows = lightList.filter((l) => l.shadows !== "None" && l.shadowStrength < 0.3);
    if (weakShadows.length > 0) {
      issues.push({
        type: "weak_shadows",
        severity: "low",
        description: "Some lights have very weak shadows",
        suggestion: "Increase shadow strength for better contrast",
        fix: () => {
          weakShadows.forEach((light) => {
            LightPatcher.patch(light.id, "shadowStrength", Math.min(1, light.shadowStrength * 1.5));
          });
        }
      });
    }

    return issues;
  }

  /**
   * Auto-balance lighting
   */
  static autoBalance(): void {
    const lights = useLightStore.getState().lights;
    const issues = this.analyze(lights);
    const pushMessage = useEditorState.getState().pushMessage;

    // Auto-fix high priority issues
    for (const issue of issues) {
      if (issue.severity === "high" && issue.fix) {
        issue.fix();
        pushMessage(`[LUNA Light] Auto-fixed: ${issue.description}`);
      }
    }
  }

  /**
   * Suggest light placement
   */
  static suggestPlacement(): Array<{ type: string; position: { x: number; y: number; z: number }; reason: string }> {
    const lights = useLightStore.getState().lights;
    const lightList = Object.values(lights);
    const suggestions: Array<{ type: string; position: { x: number; y: number; z: number }; reason: string }> = [];

    const hasDirectional = lightList.some((l) => l.type === "Directional");
    if (!hasDirectional) {
      suggestions.push({
        type: "Directional",
        position: { x: 0, y: 10, z: -5 },
        reason: "Add main directional light for scene illumination"
      });
    }

    // Suggest fill lights
    const pointLights = lightList.filter((l) => l.type === "Point");
    if (pointLights.length < 2) {
      suggestions.push({
        type: "Point",
        position: { x: 5, y: 3, z: 0 },
        reason: "Add fill light to reduce harsh shadows"
      });
    }

    return suggestions;
  }
}

