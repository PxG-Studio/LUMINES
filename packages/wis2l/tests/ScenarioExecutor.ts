/**
 * Scenario Executor
 * Executes test instructions directly in Unity WebGL runtime
 */

import { TestStep } from "./TestDSL";
import { UnityRuntime } from "../runtime/unityBridge/UnityRuntime";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useEditorState } from "@/state/editorState";

export interface ExecutionResult {
  step: TestStep;
  success: boolean;
  result?: any;
  error?: string;
  timestamp: number;
}

export interface ExecutionContext {
  player1?: string;
  player2?: string;
  currentTurn?: string;
  gameState?: any;
}

/**
 * Scenario Executor
 * Runs test steps against Unity runtime
 */
export class ScenarioExecutor {
  private static executionContext: ExecutionContext = {};
  private static results: ExecutionResult[] = [];

  /**
   * Run a single test step
   */
  static async runStep(step: TestStep, context?: ExecutionContext): Promise<ExecutionResult | null> {
    const pushMessage = useEditorState.getState().pushMessage;

    if (context) {
      this.executionContext = { ...this.executionContext, ...context };
    }

    try {
      switch (step.type) {
        case "play":
          return await this.executePlay(step);
        case "expect":
          return await this.executeExpect(step);
        case "wait":
          return await this.executeWait(step);
        case "comment":
          pushMessage(`[Test] ${step.text}`);
          return null;
        case "end":
          pushMessage(`[Test] Test completed`);
          return null;
        default:
          return {
            step,
            success: false,
            error: `Unknown step type: ${(step as any).type}`,
            timestamp: Date.now()
          };
      }
    } catch (err: any) {
      return {
        step,
        success: false,
        error: err?.message || String(err),
        timestamp: Date.now()
      };
    }
  }

  /**
   * Execute play step
   */
  private static async executePlay(step: Extract<TestStep, { type: "play" }>): Promise<ExecutionResult> {
    const pushMessage = useEditorState.getState().pushMessage;

    if (!UnityRuntime || !UnityMessagingBus.isConnected()) {
      return {
        step,
        success: false,
        error: "Unity not connected",
        timestamp: Date.now()
      };
    }

    pushMessage(`[Test] Playing Card[${step.card}] at Tile[${step.tile}]`);

    // Send play command to Unity
    UnityMessagingBus.send("test/playCard", {
      cardId: step.card,
      tileIndex: step.tile,
      player: step.player || this.executionContext.player1 || "Player1"
    });

    // Wait for Unity to process
    await this.wait(300);

    return {
      step,
      success: true,
      timestamp: Date.now()
    };
  }

  /**
   * Execute expect step
   */
  private static async executeExpect(step: Extract<TestStep, { type: "expect" }>): Promise<ExecutionResult> {
    const pushMessage = useEditorState.getState().pushMessage;

    if (!UnityMessagingBus.isConnected()) {
      return {
        step,
        success: false,
        error: "Unity not connected",
        timestamp: Date.now()
      };
    }

    pushMessage(`[Test] Expecting: ${step.condition}`);

    // Send condition check to Unity
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({
          step,
          success: false,
          error: "Condition check timeout",
          timestamp: Date.now()
        });
      }, 5000);

      // Listen for condition result
      const handler = (payload: any) => {
        clearTimeout(timeout);
        UnityMessagingBus.off("test/conditionResult", handler);

        const success = payload.ok || payload.result === true;
        pushMessage(`[Test] ${success ? "✅ PASS" : "❌ FAIL"}: ${step.condition}`);

        resolve({
          step,
          success,
          result: payload,
          timestamp: Date.now()
        });
      };

      UnityMessagingBus.on("test/conditionResult", handler);

      // Request condition check
      UnityMessagingBus.send("test/checkCondition", {
        condition: step.condition
      });
    }) as Promise<ExecutionResult>;
  }

  /**
   * Execute wait step
   */
  private static async executeWait(step: Extract<TestStep, { type: "wait" }>): Promise<ExecutionResult> {
    await this.wait(step.duration);

    return {
      step,
      success: true,
      timestamp: Date.now()
    };
  }

  /**
   * Wait utility
   */
  private static wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Clear execution context
   */
  static clearContext(): void {
    this.executionContext = {};
    this.results = [];
  }

  /**
   * Get execution results
   */
  static getResults(): ExecutionResult[] {
    return [...this.results];
  }

  /**
   * Add result
   */
  static addResult(result: ExecutionResult): void {
    this.results.push(result);
  }
}

