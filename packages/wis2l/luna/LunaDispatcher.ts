/**
 * LUNA Hot Reload Dispatcher
 * Orchestrates the entire AI-assisted debugging pipeline
 * Analyzes events → Generates intents → Suggests fixes → Applies patches
 */

import { LunaAnalyzer, LunaIntent } from "./LunaAnalyzer";
import { LunaHeuristics, RuleFix, PrefabFix, CodeFix } from "./LunaHeuristics";
import { LunaPatchGenerator } from "./LunaPatchGenerator";
import { useLunaStream } from "./LunaEventStream";
import { useWissilFS } from "../runtime/fs/wissilFs";
import { useEditorState } from "@/state/editorState";

let dispatcherActive = false;
let lastProcessedEventId: string | null = null;

/**
 * Initialize LUNA Dispatcher
 * Starts the AI-assisted debugging pipeline
 */
export function initLunaDispatcher(): () => void {
  if (dispatcherActive) {
    console.warn("[LUNA] Dispatcher already active");
    return () => {};
  }

  dispatcherActive = true;
  const pushMessage = useEditorState.getState().pushMessage;
  pushMessage("[LUNA] 🚀 Dispatcher initialized");

  // Subscribe to LUNA event stream
  const unsubscribe = useLunaStream.subscribe((state) => {
    const events = state.events;
    if (events.length === 0) return;

    const lastEvent = events[events.length - 1];
    
    // Skip if already processed
    if (lastEvent.id === lastProcessedEventId) {
      return;
    }

    lastProcessedEventId = lastEvent.id;

    // Only process errors and warnings by default
    if (lastEvent.severity !== "error" && lastEvent.severity !== "warning") {
      // Also process important gameplay events
      if (
        lastEvent.type !== "gameplay.capture" &&
        lastEvent.type !== "gameplay.score" &&
        lastEvent.type !== "asset.diff"
      ) {
        return;
      }
    }

    // Process event
    processEvent(lastEvent);
  });

  // Also listen to window events
  let windowHandler: ((e: CustomEvent) => void) | null = null;

  if (typeof window !== "undefined") {
    windowHandler = (e: CustomEvent) => {
      processEvent(e.detail);
    };

    window.addEventListener("luna-event", windowHandler as EventListener);
  }

  return () => {
    dispatcherActive = false;
    unsubscribe();
    if (windowHandler && typeof window !== "undefined") {
      window.removeEventListener("luna-event", windowHandler as EventListener);
    }
    pushMessage("[LUNA] Dispatcher stopped");
  };
}

/**
 * Process a single event through the LUNA pipeline
 */
function processEvent(event: any): void {
  const pushMessage = useEditorState.getState().pushMessage;
  const memory = LunaAnalyzer.getMemory();

  // Step 1: Analyze event
  const intent = LunaAnalyzer.analyze(event, memory);

  if (!intent) {
    return; // No actionable intent
  }

  pushMessage(`[LUNA] 🔍 Analyzed: ${intent.reason} (${intent.action}, confidence: ${(intent.confidence * 100).toFixed(0)}%)`);

  // Step 2: Generate fixes based on intent
  const fs = useWissilFS.getState();

  // Try rule fixes first
  if (intent.action.includes("rule") || intent.action.includes("score") || intent.action.includes("threshold")) {
    const configContent = fs.readFile("GameConfig/card_rules.json");
    let config = null;

    if (configContent) {
      try {
        config = JSON.parse(configContent);
      } catch (err) {
        console.error("[LUNA] Error parsing config:", err);
      }
    }

    const ruleFix = LunaHeuristics.suggestRuleFix(intent, config);

    if (ruleFix) {
      const confidence = LunaHeuristics.getFixConfidence(intent, ruleFix);

      if (confidence > 0.6) {
        pushMessage(`[LUNA] 💡 Suggested fix: Update ${ruleFix.file}`);
        
        // Auto-apply high confidence fixes
        if (confidence > 0.8 || intent.priority === "critical") {
          const success = LunaPatchGenerator.applyJSONPatch(ruleFix);
          if (success) {
            LunaAnalyzer.recordFix(intent.metadata?.errorType || intent.action, "rule_fix");
          }
        }

        return;
      }
    }
  }

  // Try prefab fixes
  if (intent.action === "validate_asset") {
    const prefabFix = LunaHeuristics.suggestPrefabFix(intent);

    if (prefabFix) {
      const confidence = LunaHeuristics.getFixConfidence(intent, prefabFix);

      if (confidence > 0.6) {
        pushMessage(`[LUNA] 💡 Suggested fix: Rebuild prefab ${prefabFix.prefab}`);
        
        if (confidence > 0.8) {
          const success = LunaPatchGenerator.rebuildPrefab(prefabFix);
          if (success) {
            LunaAnalyzer.recordFix(intent.metadata?.errorType || intent.action, "prefab_fix");
          }
        }

        return;
      }
    }
  }

  // Try code fixes
  if (intent.action.includes("fix_")) {
    const codeFix = LunaHeuristics.suggestCodeFix(intent);

    if (codeFix) {
      const confidence = LunaHeuristics.getFixConfidence(intent, codeFix);

      if (confidence > 0.6) {
        pushMessage(`[LUNA] 💡 Suggested fix: ${codeFix.type} for ${codeFix.method || "method"}`);
        
        if (confidence > 0.8 || intent.priority === "critical") {
          const success = LunaPatchGenerator.patchCSharp(codeFix);
          if (success) {
            LunaAnalyzer.recordFix(intent.metadata?.errorType || intent.action, "code_fix");
          }
        }

        return;
      }
    }
  }

  // Build fixes
  if (intent.action === "fix_build" || intent.action === "fix_compilation") {
    pushMessage(`[LUNA] 🔧 Triggering rebuild...`);
    LunaPatchGenerator.triggerBuild().then((success) => {
      if (success) {
        LunaAnalyzer.recordFix(intent.metadata?.errorType || intent.action, "build_fix");
      }
    });
    return;
  }

  // Log unhandled intent
  pushMessage(`[LUNA] ⚠️ Unhandled intent: ${intent.action} (${intent.reason})`);
}

/**
 * Enable/disable LUNA dispatcher
 */
export function setLunaDispatcherEnabled(enabled: boolean): void {
  dispatcherActive = enabled;
  const pushMessage = useEditorState.getState().pushMessage;
  pushMessage(`[LUNA] Dispatcher ${enabled ? "enabled" : "disabled"}`);
}

/**
 * Check if dispatcher is active
 */
export function isLunaDispatcherActive(): boolean {
  return dispatcherActive;
}

