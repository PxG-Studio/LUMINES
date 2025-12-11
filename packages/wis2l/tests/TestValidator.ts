/**
 * Test Validator Engine
 * Validates test results and produces pass/fail reports
 * Rule-based and AI-enhanced validation
 */

import { ExecutionResult } from "./ScenarioExecutor";

export interface ValidationResult {
  passed: boolean;
  totalSteps: number;
  passedSteps: number;
  failedSteps: number;
  details: ExecutionResult[];
  summary: string;
  errors: string[];
}

/**
 * Test Validator Engine
 * Validates test execution results
 */
export class TestValidator {
  /**
   * Validate test results
   */
  static validate(results: ExecutionResult[]): ValidationResult {
    const passedSteps = results.filter((r) => r.success).length;
    const failedSteps = results.filter((r) => !r.success).length;
    const errors = results.filter((r) => !r.success).map((r) => r.error || "Unknown error");

    const passed = results.length > 0 && failedSteps === 0;

    let summary = "";
    if (passed) {
      summary = `✅ All ${passedSteps} steps passed`;
    } else {
      summary = `❌ ${failedSteps} of ${results.length} steps failed`;
    }

    return {
      passed,
      totalSteps: results.length,
      passedSteps,
      failedSteps,
      details: results,
      summary,
      errors
    };
  }

  /**
   * Validate specific condition result
   */
  static validateCondition(condition: string, result: any): boolean {
    // Parse condition and validate
    if (condition.includes("capture")) {
      return result.captured === true || result.ok === true;
    }

    if (condition.includes("score")) {
      return this.validateScoreCondition(condition, result);
    }

    if (condition.includes(">")) {
      const [left, right] = condition.split(">").map((s) => s.trim());
      const leftVal = this.extractValue(left, result);
      const rightVal = this.extractValue(right, result);
      return leftVal > rightVal;
    }

    if (condition.includes("<")) {
      const [left, right] = condition.split("<").map((s) => s.trim());
      const leftVal = this.extractValue(left, result);
      const rightVal = this.extractValue(right, result);
      return leftVal < rightVal;
    }

    if (condition.includes("==") || condition.includes("=")) {
      const [left, right] = condition.split(/[==]/).map((s) => s.trim());
      const leftVal = this.extractValue(left, result);
      const rightVal = this.extractValue(right, result);
      return leftVal === rightVal;
    }

    // Default: check if result.ok is true
    return result?.ok === true || result?.result === true;
  }

  /**
   * Validate score condition
   */
  private static validateScoreCondition(condition: string, result: any): boolean {
    if (condition.includes("Player1 > Player2")) {
      const p1Score = result.player1Score || result.scores?.player1 || 0;
      const p2Score = result.player2Score || result.scores?.player2 || 0;
      return p1Score > p2Score;
    }

    if (condition.includes("Player2 > Player1")) {
      const p1Score = result.player1Score || result.scores?.player1 || 0;
      const p2Score = result.player2Score || result.scores?.player2 || 0;
      return p2Score > p1Score;
    }

    return false;
  }

  /**
   * Extract value from condition
   */
  private static extractValue(expr: string, result: any): number {
    // Try to extract numeric value
    const numMatch = expr.match(/(\d+)/);
    if (numMatch) {
      return parseInt(numMatch[1], 10);
    }

    // Try to extract from result object
    if (expr.includes("Player1")) {
      return result.player1Score || result.scores?.player1 || 0;
    }

    if (expr.includes("Player2")) {
      return result.player2Score || result.scores?.player2 || 0;
    }

    return 0;
  }

  /**
   * Generate detailed report
   */
  static generateReport(validation: ValidationResult): string {
    const lines: string[] = [];

    lines.push("=== Test Validation Report ===");
    lines.push("");
    lines.push(`Status: ${validation.passed ? "PASSED" : "FAILED"}`);
    lines.push(`Summary: ${validation.summary}`);
    lines.push("");
    lines.push(`Total Steps: ${validation.totalSteps}`);
    lines.push(`Passed: ${validation.passedSteps}`);
    lines.push(`Failed: ${validation.failedSteps}`);
    lines.push("");

    if (validation.errors.length > 0) {
      lines.push("Errors:");
      validation.errors.forEach((error, i) => {
        lines.push(`  ${i + 1}. ${error}`);
      });
      lines.push("");
    }

    lines.push("Step Details:");
    validation.details.forEach((detail, i) => {
      const icon = detail.success ? "✅" : "❌";
      lines.push(`  ${i + 1}. ${icon} ${detail.step.type}`);
      if (detail.error) {
        lines.push(`     Error: ${detail.error}`);
      }
    });

    return lines.join("\n");
  }
}

