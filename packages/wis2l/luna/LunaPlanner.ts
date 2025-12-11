/**
 * Runtime Planner (LLM-driven)
 * LUNA's brain: selects next actions based on analysis
 * Combines memory, logs, scene graph, config to decide actions
 */

import { LunaMacroActions } from "./LunaMacroActions";
import { LunaPredictiveDebugger } from "./LunaPredictiveDebugger";
import { useSceneGraph } from "../scenegraph/SceneGraphStore";
import { useLunaMemory } from "./LunaMemoryGraph";
import { useWissilFS } from "../runtime/fs/wissilFs";
import { useLunaStream } from "./LunaEventStream";
import { UnityRuntime } from "../runtime/unityBridge/UnityRuntime";
import { useEditorState } from "@/state/editorState";
import { LunaRuleEvolution } from "./LunaRuleEvolution";

export interface PlannerDecision {
  action: string;
  confidence: number;
  reason: string;
  macro?: keyof typeof LunaMacroActions;
  params?: any;
}

let plannerActive = false;
let lastPlanningTime = 0;
const PLANNING_INTERVAL_MS = 2000; // Plan every 2 seconds

/**
 * Run LUNA Planner
 * Analyzes current state and decides next actions
 */
export async function runLunaPlanner(event?: any): Promise<PlannerDecision | null> {
  // Cooldown check
  const now = Date.now();
  if (now - lastPlanningTime < PLANNING_INTERVAL_MS) {
    return null;
  }
  lastPlanningTime = now;

  if (!plannerActive) {
    return null;
  }

  const pushMessage = useEditorState.getState().pushMessage;

  try {
    // Gather state
    const scene = useSceneGraph.getState().nodes;
    const memory = useLunaMemory.getState();
    const fs = useWissilFS.getState();

    // Read config
    let config = {};
    const configContent = fs.readFile("GameConfig/card_rules.json");
    if (configContent) {
      try {
        config = JSON.parse(configContent);
      } catch (err) {
        console.error("[LunaPlanner] Error parsing config:", err);
      }
    }

    // Get latest event if not provided
    if (!event) {
      const events = useLunaStream.getState().events;
      event = events.length > 0 ? events[events.length - 1] : null;
    }

    // Step 1: Predictive analysis
    const prediction = LunaPredictiveDebugger.analyzeState(event, scene, config);

    if (prediction && prediction.confidence > 0.7) {
      // High confidence prediction - execute immediately
      return executePrediction(prediction);
    }

    // Step 2: Pattern-based decisions
    const patternDecision = analyzePatterns(memory, scene, config);
    if (patternDecision) {
      return patternDecision;
    }

    // Step 3: Stability checks
    const stabilityDecision = checkStability(memory);
    if (stabilityDecision) {
      return stabilityDecision;
    }

    // Step 4: Balance checks
    const balanceDecision = checkBalance(memory, config);
    if (balanceDecision) {
      return balanceDecision;
    }

    // No action needed
    return null;
  } catch (err: any) {
    console.error("[LunaPlanner] Error in planner:", err);
    pushMessage(`[LUNA Autopilot] ❌ Planner error: ${err.message}`);
    return null;
  }
}

/**
 * Execute prediction
 */
function executePrediction(prediction: any): PlannerDecision {
  const pushMessage = useEditorState.getState().pushMessage;

  switch (prediction.action) {
    case "rebalance_cards":
      pushMessage(`[LUNA Autopilot] 🔄 Rebalancing cards...`);
      LunaMacroActions.rebalanceRules();
      return {
        action: "rebalance_cards",
        confidence: prediction.confidence,
        reason: prediction.reason,
        macro: "rebalanceRules"
      };

    case "fix_card_scale":
      if (prediction.nodeId) {
        UnityRuntime.setValue("Transform/scale", {
          id: prediction.nodeId,
          value: { x: 1, y: 1, z: 1 }
        });
        pushMessage(`[LUNA Autopilot] 🔧 Fixed card scale`);
      }
      return {
        action: "fix_card_scale",
        confidence: prediction.confidence,
        reason: prediction.reason
      };

    case "fix_floating_object":
      if (prediction.nodeId) {
        const scene = useSceneGraph.getState();
        const node = scene.getNode(prediction.nodeId);
        if (node) {
          UnityRuntime.setValue("Transform/position", {
            id: prediction.nodeId,
            value: { x: node.position.x, y: 0, z: node.position.z }
          });
          pushMessage(`[LUNA Autopilot] 📐 Fixed floating object`);
        }
      }
      return {
        action: "fix_floating_object",
        confidence: prediction.confidence,
        reason: prediction.reason
      };

    case "fix_ui_position":
      LunaMacroActions.autofixHUD();
      return {
        action: "fix_ui_position",
        confidence: prediction.confidence,
        reason: prediction.reason,
        macro: "autofixHUD"
      };

    default:
      return null;
  }
}

/**
 * Analyze patterns and decide actions
 */
function analyzePatterns(
  memory: any,
  scene: Record<string, any>,
  config: any
): PlannerDecision | null {
  // Check for pattern-based issues
  const tooManyTies = memory.getPattern("tooManyTies");
  if (tooManyTies && tooManyTies.value === true) {
    LunaMacroActions.rebalanceRules();
    return {
      action: "rebalance_threshold",
      confidence: tooManyTies.confidence,
      reason: "Too many ties detected - adjusting threshold",
      macro: "rebalanceRules"
    };
  }

  const cardOverpower = memory.getPattern("cardOverpower");
  if (cardOverpower && cardOverpower.value === true) {
    LunaMacroActions.rebalanceRules();
    return {
      action: "rebalance_factor",
      confidence: cardOverpower.confidence,
      reason: "Cards too overpowered - reducing factor",
      macro: "rebalanceRules"
    };
  }

  // Check scene for layout issues
  const floatingObjects = Object.values(scene).filter(
    (node: any) => node.position.y > 100 || node.position.y < -100
  );

  if (floatingObjects.length > 0) {
    LunaMacroActions.fixScene();
    return {
      action: "fix_scene_layout",
      confidence: 0.8,
      reason: `${floatingObjects.length} floating objects detected`,
      macro: "fixScene"
    };
  }

  return null;
}

/**
 * Check stability metrics
 */
function checkStability(memory: any): PlannerDecision | null {
  const errorRate = memory.stabilityMetrics.errorRate;

  if (errorRate && errorRate.status === "critical") {
    LunaMacroActions.fullAutoRepair();
    return {
      action: "stabilize_runtime",
      confidence: 0.9,
      reason: `Critical error rate: ${errorRate.value}`,
      macro: "fullAutoRepair"
    };
  }

  return null;
}

/**
 * Check balance metrics
 */
function checkBalance(memory: any, config: any): PlannerDecision | null {
  const winRate = memory.balanceMetrics.winRate;

  if (winRate && winRate.deviation > 0.2) {
    LunaMacroActions.rebalanceRules();
    return {
      action: "rebalance_difficulty",
      confidence: 0.75,
      reason: `Win rate deviation: ${(winRate.deviation * 100).toFixed(1)}%`,
      macro: "rebalanceRules"
    };
  }

  return null;
}

/**
 * Enable/disable planner
 */
export function setLunaPlannerEnabled(enabled: boolean): void {
  plannerActive = enabled;
  const pushMessage = useEditorState.getState().pushMessage;
  pushMessage(`[LUNA Autopilot] Planner ${enabled ? "enabled" : "disabled"}`);
}

/**
 * Check if planner is active
 */
export function isLunaPlannerActive(): boolean {
  return plannerActive;
}

/**
 * Initialize planner loop
 */
export function initializeLunaPlanner(): () => void {
  setLunaPlannerEnabled(true);

  // Run planner periodically
  const interval = setInterval(() => {
    if (plannerActive) {
      runLunaPlanner();
    }
  }, PLANNING_INTERVAL_MS);

  // Also trigger on events
  if (typeof window !== "undefined") {
    const handler = () => {
      if (plannerActive) {
        runLunaPlanner();
      }
    };

    window.addEventListener("luna-event", handler as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener("luna-event", handler as EventListener);
      setLunaPlannerEnabled(false);
    };
  }

  return () => {
    clearInterval(interval);
    setLunaPlannerEnabled(false);
  };
}

