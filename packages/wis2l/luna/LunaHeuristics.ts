/**
 * Rule Heuristics Layer
 * Infers gameplay fixes based on patterns
 * Suggests rule adjustments, prefab fixes, config changes
 */

import { LunaIntent } from "./LunaAnalyzer";
import { LunaAnalyzer } from "./LunaAnalyzer";
import { useWissilFS } from "../runtime/fs/wissilFs";

export interface RuleFix {
  file: string;
  change: any;
  type: "config" | "rule" | "threshold";
}

export interface PrefabFix {
  type: "rebuild_prefab" | "update_prefab" | "refresh_prefab";
  prefab: string;
  path?: string;
}

export interface CodeFix {
  type: "patch_method" | "add_guard" | "fix_null_check";
  method?: string;
  file?: string;
  patch?: string;
}

/**
 * LUNA Heuristics
 * Provides natural rule-learning behavior
 */
export class LunaHeuristics {
  /**
   * Suggest rule fix based on intent
   */
  static suggestRuleFix(intent: LunaIntent, config?: any): RuleFix | null {
    if (intent.action !== "adjust_rule" && intent.action !== "validate_rule") {
      return null;
    }

    // Read config if not provided
    if (!config) {
      const fs = useWissilFS.getState();
      const configContent = fs.readFile("GameConfig/card_rules.json");
      if (configContent) {
        try {
          config = JSON.parse(configContent);
        } catch (err) {
          console.error("[LunaHeuristics] Error parsing config:", err);
          return null;
        }
      } else {
        // Create default config
        config = {
          captureRules: {
            threshold: 1
          }
        };
      }
    }

    const metadata = intent.metadata || {};

    // Capture threshold adjustment
    if (metadata.rule === "capture.threshold") {
      const currentThreshold = config.captureRules?.threshold || 1;
      const attackerValue = metadata.attackerValue || 0;
      const defenderValue = metadata.defenderValue || 0;

      // Suggest lowering threshold if capture failed with valid values
      if (attackerValue > defenderValue && intent.action === "adjust_rule") {
        const newThreshold = Math.max(0, currentThreshold - 1);
        
        return {
          file: "GameConfig/card_rules.json",
          change: {
            ...config,
            captureRules: {
              ...config.captureRules,
              threshold: newThreshold
            }
          },
          type: "threshold"
        };
      }

      // Suggest raising threshold if capture succeeded unexpectedly
      if (attackerValue <= defenderValue && intent.action === "validate_rule") {
        const newThreshold = currentThreshold + 1;
        
        return {
          file: "GameConfig/card_rules.json",
          change: {
            ...config,
            captureRules: {
              ...config.captureRules,
              threshold: newThreshold
            }
          },
          type: "threshold"
        };
      }
    }

    // Score calculation fix
    if (intent.action === "fix_score") {
      return {
        file: "GameConfig/card_rules.json",
        change: {
          ...config,
          scoreRules: {
            ...config.scoreRules,
            minScore: 0,
            allowNegative: false
          }
        },
        type: "config"
      };
    }

    return null;
  }

  /**
   * Suggest prefab fix based on intent
   */
  static suggestPrefabFix(intent: LunaIntent): PrefabFix | null {
    if (intent.action !== "validate_asset") {
      return null;
    }

    const metadata = intent.metadata || {};
    const assetPath = metadata.assetPath || "";

    if (assetPath.endsWith(".prefab")) {
      const prefabName = assetPath.replace(".prefab", "").split("/").pop() || "";

      return {
        type: "rebuild_prefab",
        prefab: prefabName,
        path: assetPath
      };
    }

    if (metadata.assetType === "material") {
      return {
        type: "refresh_prefab",
        prefab: assetPath.replace(/\.(mat|shader)$/, ""),
        path: assetPath
      };
    }

    return null;
  }

  /**
   * Suggest code fix based on intent
   */
  static suggestCodeFix(intent: LunaIntent): CodeFix | null {
    const metadata = intent.metadata || {};

    // Null reference fix
    if (intent.action === "fix_null_reference") {
      return {
        type: "add_guard",
        method: metadata.methodName,
        file: metadata.file,
        patch: `
          if (${metadata.target} == null) {
            return;
          }
        `
      };
    }

    // Missing component fix
    if (intent.action === "fix_missing_component") {
      return {
        type: "fix_null_check",
        method: metadata.methodName,
        file: metadata.file,
        patch: `
          var component = GetComponent<${metadata.componentType}>();
          if (component == null) {
            component = gameObject.AddComponent<${metadata.componentType}>();
          }
        `
      };
    }

    // Index out of bounds fix
    if (intent.action === "fix_index_bounds") {
      return {
        type: "add_guard",
        method: metadata.methodName,
        file: metadata.file,
        patch: `
          if (index < 0 || index >= array.Length) {
            return;
          }
        `
      };
    }

    // Division by zero fix
    if (intent.action === "fix_division_by_zero") {
      return {
        type: "add_guard",
        method: metadata.methodName,
        file: metadata.file,
        patch: `
          if (divisor == 0) {
            return 0;
          }
        `
      };
    }

    return null;
  }

  /**
   * Get confidence score for fix suggestion
   */
  static getFixConfidence(intent: LunaIntent, fix: RuleFix | PrefabFix | CodeFix): number {
    // Base confidence from intent
    let confidence = intent.confidence || 0.5;

    // Increase confidence based on past fixes
    const memory = LunaAnalyzer.getMemory();
    const errorType = intent.metadata?.errorType || "";

    if (errorType && memory.pastFixes[errorType]) {
      const pastFixes = memory.pastFixes[errorType];
      const fixType = fix.type || "";
      
      // If this fix was successful before, increase confidence
      if (pastFixes.includes(fixType)) {
        confidence = Math.min(0.95, confidence + 0.2);
      }
    }

    // Decrease confidence for low priority intents
    if (intent.priority === "low") {
      confidence *= 0.8;
    }

    return confidence;
  }
}

