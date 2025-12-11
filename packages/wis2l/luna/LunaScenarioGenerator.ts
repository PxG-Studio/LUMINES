/**
 * LUNA Scenario Generator (LLM-based)
 * Generates test scripts based on card stats, rules, past failures, patterns
 */

import { useWissilFS } from "../runtime/fs/wissilFs";
import { useLunaMemory } from "./LunaMemoryGraph";
import { ParsedTestScript } from "../tests/TestDSL";
import { useEditorState } from "@/state/editorState";

export interface ScenarioContext {
  config?: any;
  patterns?: any;
  pastFailures?: any[];
  sceneState?: any;
}

/**
 * LUNA Scenario Generator
 * AI-powered test scenario generation
 */
export class LunaScenarioGenerator {
  /**
   * Generate test scenario
   */
  static async generate(context?: ScenarioContext): Promise<ParsedTestScript> {
    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage("[LUNA] 🤖 Generating test scenario...");

    // Gather context
    const fs = useWissilFS.getState();
    const memory = useLunaMemory.getState();

    // Read config
    let config = context?.config;
    if (!config) {
      const configContent = fs.readFile("GameConfig/card_rules.json");
      if (configContent) {
        try {
          config = JSON.parse(configContent);
        } catch (err) {
          console.error("[LunaScenarioGenerator] Error parsing config:", err);
          config = {};
        }
      }
    }

    // Get patterns from memory
    const patterns = context?.patterns || memory.patterns;

    // Generate based on patterns and config
    const scenario = this.generateFromPatterns(config, patterns, memory);

    pushMessage(`[LUNA] ✅ Generated test scenario: ${scenario.metadata?.name || "Unnamed"}`);

    return scenario;
  }

  /**
   * Generate scenario from patterns
   */
  private static generateFromPatterns(
    config: any,
    patterns: any,
    memory: any
  ): ParsedTestScript {
    // Check for common test scenarios based on patterns
    const steps: any[] = [];

    // Scenario 1: Basic capture test
    if (!patterns.hasBasicCaptureTest) {
      steps.push(
        { type: "comment", text: "Basic capture test" },
        { type: "play", card: "A", tile: 0 },
        { type: "play", card: "B", tile: 1 },
        { type: "wait", duration: 500 },
        { type: "expect", condition: "capture Card[B]" },
        { type: "expect", condition: "score Player1 > Player2" },
        { type: "end" }
      );

      return {
        steps,
        metadata: {
          name: "Basic Capture Test",
          description: "Tests basic card capture mechanics",
          author: "LUNA"
        }
      };
    }

    // Scenario 2: Tie detection test
    if (patterns.tooManyTies) {
      steps.push(
        { type: "comment", text: "Tie detection test" },
        { type: "play", card: "C", tile: 0 },
        { type: "play", card: "C", tile: 1 },
        { type: "wait", duration: 500 },
        { type: "expect", condition: "no capture" },
        { type: "end" }
      );

      return {
        steps,
        metadata: {
          name: "Tie Detection Test",
          description: "Tests tie detection when cards have equal values",
          author: "LUNA"
        }
      };
    }

    // Scenario 3: Overpower test
    if (patterns.cardOverpower) {
      steps.push(
        { type: "comment", text: "Overpowered card test" },
        { type: "play", card: "Strong", tile: 0 },
        { type: "play", card: "Weak", tile: 1 },
        { type: "wait", duration: 500 },
        { type: "expect", condition: "capture Card[Weak]" },
        { type: "expect", condition: "score Player1 > Player2" },
        { type: "end" }
      );

      return {
        steps,
        metadata: {
          name: "Overpower Test",
          description: "Tests capture with significantly stronger card",
          author: "LUNA"
        }
      };
    }

    // Default: Random scenario
    const threshold = config?.captureRules?.threshold || 1;
    steps.push(
      { type: "comment", text: "Random scenario" },
      { type: "play", card: "A", tile: 0, player: "Player1" },
      { type: "wait", duration: 300 },
      { type: "play", card: "B", tile: 1, player: "Player2" },
      { type: "wait", duration: 500 },
      { type: "expect", condition: `capture threshold >= ${threshold}` },
      { type: "end" }
    );

    return {
      steps,
      metadata: {
        name: "Random Scenario",
        description: "AI-generated test scenario",
        author: "LUNA"
      }
    };
  }

  /**
   * Generate multiple scenarios
   */
  static async generateBatch(count: number = 5): Promise<ParsedTestScript[]> {
    const scenarios: ParsedTestScript[] = [];

    for (let i = 0; i < count; i++) {
      const scenario = await this.generate();
      scenarios.push(scenario);
    }

    return scenarios;
  }

  /**
   * Generate scenario from failure analysis
   */
  static async generateFromFailure(failure: any): Promise<ParsedTestScript> {
    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[LUNA] 🔍 Generating regression test for failure: ${failure.type}`);

    // Generate a test that reproduces the failure
    const steps: any[] = [
      { type: "comment", text: `Regression test for: ${failure.type}` },
      ...(failure.steps || []),
      { type: "expect", condition: failure.expectedCondition || "test passes" },
      { type: "end" }
    ];

    return {
      steps,
      metadata: {
        name: `Regression: ${failure.type}`,
        description: `Reproduces and tests fix for: ${failure.type}`,
        author: "LUNA"
      }
    };
  }
}

