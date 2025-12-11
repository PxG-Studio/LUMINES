/**
 * LUNA Analyzer Engine
 * Analyzes events and generates fix intents
 * Interprets patterns: failed captures, unexpected scores, broken UI, etc.
 */

import { LunaEvent } from "./LunaEventStream";

export interface LunaIntent {
  action: string;
  reason: string;
  event: LunaEvent;
  priority: "low" | "medium" | "high" | "critical";
  confidence: number; // 0-1
  suggestions?: string[];
  metadata?: any;
}

export interface LunaMemory {
  pastErrors: Record<string, number>; // error type -> count
  pastFixes: Record<string, string[]>; // error type -> fix actions
  patterns: Record<string, any>; // learned patterns
}

/**
 * LUNA Analyzer Engine
 * Analyzes events and produces "Intent Objects" - jobs for LUNA to execute
 */
export class LunaAnalyzer {
  private static memory: LunaMemory = {
    pastErrors: {},
    pastFixes: {},
    patterns: {}
  };

  /**
   * Analyze event and generate intent
   */
  static analyze(event: LunaEvent, memory: LunaMemory = this.memory): LunaIntent | null {
    // Update memory with event
    if (event.severity === "error") {
      const errorType = this.getErrorType(event);
      memory.pastErrors[errorType] = (memory.pastErrors[errorType] || 0) + 1;
    }

    // Analyze based on event type
    switch (event.type) {
      case "unity.error":
        return this.analyzeUnityError(event, memory);

      case "gameplay.capture":
        return this.analyzeCaptureEvent(event, memory);

      case "gameplay.score":
        return this.analyzeScoreEvent(event, memory);

      case "asset.diff":
        return this.analyzeAssetDiff(event, memory);

      case "build.error":
        return this.analyzeBuildError(event, memory);

      case "unity.log":
        return this.analyzeLogEvent(event, memory);

      default:
        return null;
    }
  }

  /**
   * Analyze Unity runtime error
   */
  private static analyzeUnityError(event: LunaEvent, memory: LunaMemory): LunaIntent | null {
    const message = (event.message || "").toLowerCase();
    let action = "fix_error";
    let reason = "Unity runtime error detected";
    let priority: LunaIntent["priority"] = "high";
    let confidence = 0.7;

    // Null reference errors
    if (message.includes("nullreference") || message.includes("null reference")) {
      action = "fix_null_reference";
      reason = "Null reference exception detected - missing initialization or null check needed";
      priority = "critical";
      confidence = 0.9;
    }

    // Missing component errors
    if (message.includes("missing component") || message.includes("getcomponent")) {
      action = "fix_missing_component";
      reason = "Missing component reference - prefab or script setup issue";
      priority = "high";
      confidence = 0.85;
    }

    // Index out of bounds
    if (message.includes("index") && message.includes("out of range")) {
      action = "fix_index_bounds";
      reason = "Array/List index out of bounds - needs bounds checking";
      priority = "high";
      confidence = 0.8;
    }

    // Divide by zero
    if (message.includes("divide by zero")) {
      action = "fix_division_by_zero";
      reason = "Division by zero detected - needs zero check";
      priority = "critical";
      confidence = 0.95;
    }

    return {
      action,
      reason,
      event,
      priority,
      confidence,
      metadata: {
        errorType: this.getErrorType(event),
        stackTrace: event.stackTrace,
        file: event.file,
        line: event.line
      }
    };
  }

  /**
   * Analyze capture event
   */
  private static analyzeCaptureEvent(event: LunaEvent, memory: LunaMemory): LunaIntent | null {
    const payload = event.payload || {};
    const attackerValue = payload.attackerValue || payload.attacker?.value;
    const defenderValue = payload.defenderValue || payload.defender?.value;
    const result = payload.result || payload.success;

    // Failed capture with invalid values
    if (result === false && (attackerValue <= 0 || defenderValue <= 0)) {
      return {
        action: "adjust_rule",
        reason: "Capture failed due to invalid card values - threshold may be too strict",
        event,
        priority: "medium",
        confidence: 0.75,
        metadata: {
          rule: "capture.threshold",
          attackerValue,
          defenderValue
        }
      };
    }

    // Unexpected capture result
    if (result === true && attackerValue <= defenderValue) {
      return {
        action: "validate_rule",
        reason: "Capture succeeded unexpectedly - rule logic may be incorrect",
        event,
        priority: "medium",
        confidence: 0.65,
        metadata: {
          rule: "capture.logic",
          attackerValue,
          defenderValue
        }
      };
    }

    return null;
  }

  /**
   * Analyze score event
   */
  private static analyzeScoreEvent(event: LunaEvent, memory: LunaMemory): LunaIntent | null {
    const payload = event.payload || {};
    const score = payload.score || payload.delta;

    // Negative score
    if (score < 0) {
      return {
        action: "fix_score",
        reason: "Negative score detected - score calculation may be incorrect",
        event,
        priority: "medium",
        confidence: 0.7,
        metadata: {
          score,
          playerId: payload.playerId
        }
      };
    }

    // Unexpectedly high score
    if (score > 1000) {
      return {
        action: "validate_score",
        reason: "Unusually high score detected - may indicate score multiplier bug",
        event,
        priority: "low",
        confidence: 0.6,
        metadata: {
          score,
          playerId: payload.playerId
        }
      };
    }

    return null;
  }

  /**
   * Analyze asset diff
   */
  private static analyzeAssetDiff(event: LunaEvent, memory: LunaMemory): LunaIntent | null {
    const payload = event.payload || {};
    const path = payload.path || "";

    if (path.endsWith(".prefab")) {
      return {
        action: "validate_asset",
        reason: "Prefab updated - may require runtime rebind or scene refresh",
        event,
        priority: "low",
        confidence: 0.8,
        metadata: {
          assetPath: path,
          assetType: "prefab"
        }
      };
    }

    if (path.endsWith(".mat") || path.endsWith(".shader")) {
      return {
        action: "validate_asset",
        reason: "Material/Shader updated - may require material reload",
        event,
        priority: "low",
        confidence: 0.75,
        metadata: {
          assetPath: path,
          assetType: "material"
        }
      };
    }

    return null;
  }

  /**
   * Analyze build error
   */
  private static analyzeBuildError(event: LunaEvent, memory: LunaMemory): LunaIntent | null {
    const message = (event.message || "").toLowerCase();

    if (message.includes("compilation")) {
      return {
        action: "fix_compilation",
        reason: "Build compilation error - check syntax and dependencies",
        event,
        priority: "high",
        confidence: 0.9,
        metadata: {
          buildError: event.message
        }
      };
    }

    if (message.includes("missing") || message.includes("not found")) {
      return {
        action: "fix_missing_asset",
        reason: "Build missing asset - check file paths and references",
        event,
        priority: "high",
        confidence: 0.85,
        metadata: {
          buildError: event.message
        }
      };
    }

    return {
      action: "fix_build",
      reason: "Build error detected",
      event,
      priority: "high",
      confidence: 0.7,
      metadata: {
        buildError: event.message
      }
    };
  }

  /**
   * Analyze log event
   */
  private static analyzeLogEvent(event: LunaEvent, memory: LunaMemory): LunaIntent | null {
    const message = (event.message || "").toLowerCase();

    // Warning patterns
    if (event.severity === "warning") {
      if (message.includes("deprecated")) {
        return {
          action: "update_deprecated",
          reason: "Deprecated API usage detected - should update to new API",
          event,
          priority: "low",
          confidence: 0.8
        };
      }
    }

    return null;
  }

  /**
   * Get error type from event
   */
  private static getErrorType(event: LunaEvent): string {
    const message = (event.message || "").toLowerCase();

    if (message.includes("nullreference")) return "NullReferenceException";
    if (message.includes("missing component")) return "MissingComponent";
    if (message.includes("index") && message.includes("out of range")) return "IndexOutOfRange";
    if (message.includes("divide by zero")) return "DivideByZero";

    return "UnknownError";
  }

  /**
   * Get memory
   */
  static getMemory(): LunaMemory {
    return { ...this.memory };
  }

  /**
   * Update memory with fix result
   */
  static recordFix(errorType: string, fixAction: string): void {
    if (!this.memory.pastFixes[errorType]) {
      this.memory.pastFixes[errorType] = [];
    }
    this.memory.pastFixes[errorType].push(fixAction);
  }

  /**
   * Clear memory
   */
  static clearMemory(): void {
    this.memory = {
      pastErrors: {},
      pastFixes: {},
      patterns: {}
    };
  }
}

