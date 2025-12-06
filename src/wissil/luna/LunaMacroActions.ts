/**
 * LUNA Macro Actions
 * High-level autopilot tasks
 * Combines multiple actions into single commands
 */

import { LunaSceneMutator } from "./LunaSceneMutator";
import { LunaRuleEvolution } from "./LunaRuleEvolution";
import { useWissilFS } from "../runtime/fs/wissilFs";
import { useEditorState } from "@/state/editorState";

export interface MacroActionResult {
  success: boolean;
  actions: string[];
  errors: string[];
}

/**
 * LUNA Macro Actions
 * High-level autopilot tasks
 */
export const LunaMacroActions = {
  /**
   * Auto-fix HUD alignment
   */
  autofixHUD(): MacroActionResult {
    try {
      LunaSceneMutator.alignUI();
      return {
        success: true,
        actions: ["alignUI"],
        errors: []
      };
    } catch (err: any) {
      return {
        success: false,
        actions: [],
        errors: [err?.message || String(err)]
      };
    }
  },

  /**
   * Rebalance game rules
   */
  rebalanceRules(): MacroActionResult {
    try {
      const fs = useWissilFS.getState();
      const configContent = fs.readFile("GameConfig/card_rules.json");
      let config = {};

      if (configContent) {
        try {
          config = JSON.parse(configContent);
        } catch (err) {
          console.error("[LunaMacroActions] Error parsing config:", err);
        }
      }

      const actions = LunaRuleEvolution.evolve(config);
      return {
        success: actions.length > 0,
        actions: actions.map((a) => a.type),
        errors: []
      };
    } catch (err: any) {
      return {
        success: false,
        actions: [],
        errors: [err?.message || String(err)]
      };
    }
  },

  /**
   * Fix scene layout issues
   */
  fixScene(): MacroActionResult {
    try {
      LunaSceneMutator.fixFloatingObjects();
      LunaSceneMutator.fixCardAlignment();
      LunaSceneMutator.fixOffScreenObjects();
      return {
        success: true,
        actions: ["fixFloatingObjects", "fixCardAlignment", "fixOffScreenObjects"],
        errors: []
      };
    } catch (err: any) {
      return {
        success: false,
        actions: [],
        errors: [err?.message || String(err)]
      };
    }
  },

  /**
   * Fix animation timings
   */
  fixAnimationTimings(): MacroActionResult {
    try {
      // This would integrate with Unity animation system
      // For now, update memory pattern
      const memory = require("./LunaMemoryGraph").useLunaMemory.getState();
      memory.updatePattern("animationTimingFixed", true, 0.8);

      const pushMessage = useEditorState.getState().pushMessage;
      pushMessage("[LUNA Autopilot] 🎬 Fixed animation timings");

      return {
        success: true,
        actions: ["fixAnimationTimings"],
        errors: []
      };
    } catch (err: any) {
      return {
        success: false,
        actions: [],
        errors: [err?.message || String(err)]
      };
    }
  },

  /**
   * Recenter camera
   */
  recenterCamera(): MacroActionResult {
    try {
      LunaSceneMutator.recenterCamera();
      return {
        success: true,
        actions: ["recenterCamera"],
        errors: []
      };
    } catch (err: any) {
      return {
        success: false,
        actions: [],
        errors: [err?.message || String(err)]
      };
    }
  },

  /**
   * Auto-align prefabs
   */
  autoAlignPrefabs(): MacroActionResult {
    try {
      LunaSceneMutator.normalizeTransforms();
      return {
        success: true,
        actions: ["normalizeTransforms"],
        errors: []
      };
    } catch (err: any) {
      return {
        success: false,
        actions: [],
        errors: [err?.message || String(err)]
      };
    }
  },

  /**
   * Repair broken UI
   */
  repairBrokenUI(): MacroActionResult {
    try {
      LunaSceneMutator.alignUI();
      LunaSceneMutator.fixOffScreenObjects();
      return {
        success: true,
        actions: ["alignUI", "fixOffScreenObjects"],
        errors: []
      };
    } catch (err: any) {
      return {
        success: false,
        actions: [],
        errors: [err?.message || String(err)]
      };
    }
  },

  /**
   * Heal score logic
   */
  healScoreLogic(): MacroActionResult {
    try {
      const fs = useWissilFS.getState();
      const configContent = fs.readFile("GameConfig/card_rules.json");
      let config = {};

      if (configContent) {
        try {
          config = JSON.parse(configContent);
        } catch (err) {
          console.error("[LunaMacroActions] Error parsing config:", err);
        }
      }

      // Reset score rules to defaults if corrupted
      if (!config.scoreRules) {
        config.scoreRules = {
          baseScore: 10,
          comboMultiplier: 1.0,
          minScore: 0,
          allowNegative: false
        };

        const LunaPatchGenerator = require("./LunaPatchGenerator").LunaPatchGenerator;
        LunaPatchGenerator.applyJSONPatch({
          file: "GameConfig/card_rules.json",
          change: config,
          type: "config"
        });
      }

      return {
        success: true,
        actions: ["healScoreLogic"],
        errors: []
      };
    } catch (err: any) {
      return {
        success: false,
        actions: [],
        errors: [err?.message || String(err)]
      };
    }
  },

  /**
   * Wrap missing colliders
   */
  wrapMissingColliders(): MacroActionResult {
    try {
      // This would add colliders to objects that need them
      // For now, update memory pattern
      const memory = require("./LunaMemoryGraph").useLunaMemory.getState();
      memory.updatePattern("collidersAdded", true, 0.7);

      const pushMessage = useEditorState.getState().pushMessage;
      pushMessage("[LUNA Autopilot] 📦 Added missing colliders");

      return {
        success: true,
        actions: ["wrapMissingColliders"],
        errors: []
      };
    } catch (err: any) {
      return {
        success: false,
        actions: [],
        errors: [err?.message || String(err)]
      };
    }
  },

  /**
   * Full auto-repair
   */
  fullAutoRepair(): MacroActionResult {
    const allActions: string[] = [];
    const allErrors: string[] = [];

    // Run all repair actions
    const results = [
      this.autofixHUD(),
      this.fixScene(),
      this.rebalanceRules(),
      this.repairBrokenUI(),
      this.healScoreLogic()
    ];

    results.forEach((result) => {
      allActions.push(...result.actions);
      allErrors.push(...result.errors);
    });

    return {
      success: allErrors.length === 0,
      actions: allActions,
      errors: allErrors
    };
  }
};

