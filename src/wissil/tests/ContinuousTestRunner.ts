/**
 * Continuous Testing Loop
 * Runs tests at fixed intervals, after config changes, after rule evolution, etc.
 */

import { TestDSL, ParsedTestScript } from "./TestDSL";
import { ScenarioExecutor, ExecutionResult } from "./ScenarioExecutor";
import { TestValidator, ValidationResult } from "./TestValidator";
import { RegressionSnapshots } from "./RegressionSnapshots";
import { useEditorState } from "@/state/editorState";
import { useWissilFS } from "../runtime/fs/wissilFs";

export interface TestRunResult {
  script: ParsedTestScript;
  validation: ValidationResult;
  snapshot: RegressionSnapshot;
  duration: number;
}

let testRunnerActive = false;
let testInterval: any = null;
const DEFAULT_INTERVAL_MS = 30000; // 30 seconds

/**
 * Continuous Test Runner
 * Runs tests continuously based on triggers
 */
export class ContinuousTestRunner {
  /**
   * Run a test script
   */
  static async runScript(script: ParsedTestScript | string): Promise<TestRunResult> {
    const pushMessage = useEditorState.getState().pushMessage;
    const startTime = Date.now();

    // Parse if string
    const parsedScript =
      typeof script === "string" ? TestDSL.parse(script) : script;

    pushMessage(`[Test Runner] 🧪 Running test: ${parsedScript.metadata?.name || "Unnamed"}`);

    // Clear executor context
    ScenarioExecutor.clearContext();

    // Execute steps
    const executionResults: ExecutionResult[] = [];

    for (const step of parsedScript.steps) {
      if (step.type === "end") {
        break;
      }

      const result = await ScenarioExecutor.runStep(step);
      if (result) {
        executionResults.push(result);
        ScenarioExecutor.addResult(result);
      }
    }

    // Validate results
    const validation = TestValidator.validate(executionResults);

    // Store snapshot
    const snapshot = RegressionSnapshots.store(validation, parsedScript);

    const duration = Date.now() - startTime;

    pushMessage(
      `[Test Runner] ${validation.passed ? "✅ PASSED" : "❌ FAILED"}: ${validation.summary} (${duration}ms)`
    );

    return {
      script: parsedScript,
      validation,
      snapshot,
      duration
    };
  }

  /**
   * Run multiple test scripts
   */
  static async runBatch(scripts: (ParsedTestScript | string)[]): Promise<TestRunResult[]> {
    const results: TestRunResult[] = [];

    for (const script of scripts) {
      const result = await this.runScript(script);
      results.push(result);

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return results;
  }

  /**
   * Start continuous testing loop
   */
  static start(intervalMs: number = DEFAULT_INTERVAL_MS): void {
    if (testRunnerActive) {
      console.warn("[ContinuousTestRunner] Already running");
      return;
    }

    testRunnerActive = true;
    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Test Runner] 🚀 Starting continuous testing (interval: ${intervalMs}ms)`);

    // Run immediately
    this.runNextTest();

    // Schedule periodic runs
    testInterval = setInterval(() => {
      if (testRunnerActive) {
        this.runNextTest();
      }
    }, intervalMs);
  }

  /**
   * Stop continuous testing loop
   */
  static stop(): void {
    if (!testRunnerActive) {
      return;
    }

    testRunnerActive = false;
    if (testInterval) {
      clearInterval(testInterval);
      testInterval = null;
    }

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage("[Test Runner] ⏹️ Stopped continuous testing");
  }

  /**
   * Run next test (generates or loads from queue)
   */
  private static async runNextTest(): Promise<void> {
    // Generate new test scenario
    const { LunaScenarioGenerator } = await import("../luna/LunaScenarioGenerator");
    const script = await LunaScenarioGenerator.generate();

    // Run it
    await this.runScript(script);
  }

  /**
   * Check if runner is active
   */
  static isActive(): boolean {
    return testRunnerActive;
  }
}

// Import RegressionSnapshot type
import type { RegressionSnapshot } from "./RegressionSnapshots";

