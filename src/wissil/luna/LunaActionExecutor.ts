/**
 * LUNA Action Executor
 * Executes patches, scene edits, rule changes, prefab rebuilds
 * Binds all execution APIs (Phase F, G, K) into one decision engine
 */

import { ComponentPatchEngine } from "../scenegraph/ComponentPatchEngine";
import { LunaPatchGenerator } from "./LunaPatchGenerator";
import { LunaSceneMutator } from "./LunaSceneMutator";
import { UnityRuntime } from "../runtime/unityBridge/UnityRuntime";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { runIncrementalBuild } from "../build/BuildOrchestrator";
import { useEditorState } from "@/state/editorState";

export interface ActionExecutionResult {
  success: boolean;
  action: string;
  message: string;
  error?: string;
}

/**
 * LUNA Action Executor
 * Unified execution engine for all LUNA actions
 */
export class LunaActionExecutor {
  /**
   * Execute a planner decision
   */
  static async execute(decision: {
    action: string;
    macro?: string;
    params?: any;
    nodeId?: string;
    metadata?: any;
  }): Promise<ActionExecutionResult> {
    const pushMessage = useEditorState.getState().pushMessage;

    try {
      switch (decision.action) {
        // Scene mutations
        case "fix_ui_position":
        case "align_ui":
          const hudResult = LunaSceneMutator.alignUI();
          return {
            success: true,
            action: decision.action,
            message: "UI aligned"
          };

        case "fix_floating_object":
          if (decision.nodeId) {
            const scene = require("../scenegraph/SceneGraphStore").useSceneGraph.getState();
            const node = scene.getNode(decision.nodeId);
            if (node) {
              ComponentPatchEngine.setTransform(decision.nodeId, "position", {
                x: node.position.x,
                y: 0,
                z: node.position.z
              });
            }
          }
          return {
            success: true,
            action: decision.action,
            message: "Floating object fixed"
          };

        case "fix_card_scale":
          if (decision.nodeId) {
            ComponentPatchEngine.setTransform(decision.nodeId, "scale", {
              x: 1,
              y: 1,
              z: 1
            });
          }
          return {
            success: true,
            action: decision.action,
            message: "Card scale fixed"
          };

        // Rule evolutions
        case "rebalance_cards":
        case "rebalance_threshold":
        case "rebalance_factor":
          const actions = LunaRuleEvolution.evolve();
          return {
            success: actions.length > 0,
            action: decision.action,
            message: `Rebalanced rules (${actions.length} changes)`
          };

        // Config patches
        case "adjust_threshold":
        case "adjust_combo_multiplier":
          if (decision.metadata) {
            LunaPatchGenerator.applyJSONPatch({
              file: "GameConfig/card_rules.json",
              change: decision.metadata.change,
              type: "config"
            });
          }
          return {
            success: true,
            action: decision.action,
            message: "Config updated"
          };

        // Component patches
        case "add_missing_component":
          if (decision.nodeId && decision.metadata?.component) {
            ComponentPatchEngine.addComponent(
              decision.nodeId,
              decision.metadata.component
            );
          }
          return {
            success: true,
            action: decision.action,
            message: "Component added"
          };

        // Material patches
        case "patch_material":
          if (decision.nodeId && decision.metadata) {
            ComponentPatchEngine.setMaterialProperty(
              decision.nodeId,
              decision.metadata.propertyName,
              decision.metadata.value
            );
          }
          return {
            success: true,
            action: decision.action,
            message: "Material patched"
          };

        // Build triggers
        case "trigger_build":
          const buildResult = await runIncrementalBuild();
          return {
            success: buildResult.success,
            action: decision.action,
            message: buildResult.success ? "Build completed" : buildResult.error || "Build failed",
            error: buildResult.error
          };

        // Prefab rebuilds
        case "rebuild_prefab":
          if (decision.metadata?.prefab) {
            LunaPatchGenerator.rebuildPrefab({
              type: "rebuild_prefab",
              prefab: decision.metadata.prefab
            });
          }
          return {
            success: true,
            action: decision.action,
            message: "Prefab rebuilt"
          };

        // Animation fixes
        case "fix_animation_timing":
          if (UnityMessagingBus.isConnected()) {
            UnityMessagingBus.send("patch/animation", {
              timing: decision.metadata?.timing || {}
            });
          }
          return {
            success: true,
            action: decision.action,
            message: "Animation timing fixed"
          };

        // Macro actions
        default:
          if (decision.macro && decision.macro in LunaMacroActions) {
            const macroFn = (LunaMacroActions as any)[decision.macro];
            if (typeof macroFn === "function") {
              const result = macroFn();
              return {
                success: result.success,
                action: decision.action,
                message: `Executed macro: ${decision.macro}`,
                error: result.errors?.join(", ")
              };
            }
          }

          return {
            success: false,
            action: decision.action,
            message: `Unknown action: ${decision.action}`
          };
      }
    } catch (err: any) {
      pushMessage(`[LUNA ActionExecutor] ❌ Error executing ${decision.action}: ${err.message}`);
      return {
        success: false,
        action: decision.action,
        message: `Execution failed: ${err.message}`,
        error: err.message
      };
    }
  }

  /**
   * Execute multiple actions in sequence
   */
  static async executeBatch(decisions: Array<{ action: string; [key: string]: any }>): Promise<ActionExecutionResult[]> {
    const results: ActionExecutionResult[] = [];

    for (const decision of decisions) {
      const result = await this.execute(decision);
      results.push(result);

      // Small delay between actions
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
  }
}

