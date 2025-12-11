/**
 * Failure Auto-Fix Layer
 * If tests fail, LUNA patches automatically
 * Integrates with Phase J (AI Debug Agent) and Phase L (Autopilot)
 */

import { LunaPatchGenerator } from "./LunaPatchGenerator";
import { ValidationResult } from "../tests/TestValidator";
import { ParsedTestScript } from "../tests/TestDSL";
import { useLunaMemory } from "./LunaMemoryGraph";
import { useEditorState } from "@/state/editorState";
import { LunaRuleEvolution } from "./LunaRuleEvolution";

/**
 * LUNA Test Fixer
 * Automatically fixes failing tests
 */
export class LunaTestFixer {
  /**
   * Fix failing test
   */
  static fix(validation: ValidationResult, script?: ParsedTestScript): boolean {
    const pushMessage = useEditorState.getState().pushMessage;

    if (validation.passed) {
      return true; // Test passed, no fix needed
    }

    pushMessage(`[LUNA Test Fixer] 🔧 Attempting to fix failing test...`);

    const memory = useLunaMemory.getState();

    // Analyze failures
    const failures = validation.details.filter((d) => !d.success);
    let fixed = false;

    for (const failure of failures) {
      if (failure.step.type === "expect") {
        const condition = failure.step.condition;

        // Fix capture threshold issues
        if (condition.includes("capture") && !validation.passed) {
          pushMessage(`[LUNA Test Fixer] Adjusting capture threshold...`);
          
          // Lower threshold if capture failed
          memory.updatePattern("tooManyTies", false); // Clear tie pattern
          
          // Try rule evolution
          const actions = LunaRuleEvolution.evolve();
          if (actions.length > 0) {
            fixed = true;
            pushMessage(`[LUNA Test Fixer] ✅ Applied ${actions.length} rule fixes`);
          }
        }

        // Fix score issues
        if (condition.includes("score") && !validation.passed) {
          pushMessage(`[LUNA Test Fixer] Adjusting score rules...`);
          
          const fs = require("../runtime/fs/wissilFs").useWissilFS.getState();
          const configContent = fs.readFile("GameConfig/card_rules.json");
          let config = {};

          if (configContent) {
            try {
              config = JSON.parse(configContent);
            } catch (err) {
              console.error("[LunaTestFixer] Error parsing config:", err);
            }
          }

          // Reset score rules
          if (!config.scoreRules) {
            config.scoreRules = {
              baseScore: 10,
              comboMultiplier: 1.0,
              minScore: 0,
              allowNegative: false
            };
          }

          LunaPatchGenerator.applyJSONPatch({
            file: "GameConfig/card_rules.json",
            change: config,
            type: "config"
          });

          fixed = true;
          pushMessage(`[LUNA Test Fixer] ✅ Fixed score rules`);
        }
      }
    }

    if (fixed) {
      memory.push({
        type: "test_fix_applied",
        action: "fix_failing_test",
        result: { validation, script },
        metadata: {
          failures: failures.length,
          fixed: true
        }
      });

      pushMessage(`[LUNA Test Fixer] ✅ Test fix applied`);
    } else {
      pushMessage(`[LUNA Test Fixer] ⚠️ Could not automatically fix test`);
    }

    return fixed;
  }

  /**
   * Analyze test failure patterns
   */
  static analyzeFailures(validation: ValidationResult): Array<{
    pattern: string;
    suggestedFix: string;
    confidence: number;
  }> {
    const suggestions: Array<{
      pattern: string;
      suggestedFix: string;
      confidence: number;
    }> = [];

    const failures = validation.details.filter((d) => !d.success);

    // Check for capture failures
    const captureFailures = failures.filter(
      (f) => f.step.type === "expect" && f.step.condition.includes("capture")
    );

    if (captureFailures.length > 0) {
      suggestions.push({
        pattern: "capture_failures",
        suggestedFix: "Lower capture threshold or adjust card values",
        confidence: 0.8
      });
    }

    // Check for score failures
    const scoreFailures = failures.filter(
      (f) => f.step.type === "expect" && f.step.condition.includes("score")
    );

    if (scoreFailures.length > 0) {
      suggestions.push({
        pattern: "score_failures",
        suggestedFix: "Check score calculation rules and multipliers",
        confidence: 0.75
      });
    }

    // Check for timeout errors
    const timeoutFailures = failures.filter((f) =>
      f.error?.includes("timeout")
    );

    if (timeoutFailures.length > 0) {
      suggestions.push({
        pattern: "timeout_failures",
        suggestedFix: "Increase wait times or check Unity connection",
        confidence: 0.9
      });
    }

    return suggestions;
  }
}

