/**
 * Regression Snapshot System
 * Records rule, config, and scene snapshots at test time
 * Enables regression testing and comparison
 */

import { useWissilFS } from "../runtime/fs/wissilFs";
import { useSceneGraph } from "../scenegraph/SceneGraphStore";
import { ValidationResult } from "./TestValidator";
import { ParsedTestScript } from "./TestDSL";

export interface RegressionSnapshot {
  id: string;
  timestamp: number;
  testName?: string;
  scene: Record<string, any>;
  config: any;
  result: ValidationResult;
  script?: ParsedTestScript;
  metadata?: {
    buildVersion?: string;
    unityVersion?: string;
    author?: string;
  };
}

const SNAPSHOTS_PATH = "Tests/snapshots.json";

/**
 * Regression Snapshot System
 * Stores and retrieves test snapshots for regression analysis
 */
export class RegressionSnapshots {
  /**
   * Store test result snapshot
   */
  static store(
    result: ValidationResult,
    script?: ParsedTestScript
  ): RegressionSnapshot {
    const fs = useWissilFS.getState();

    // Read existing snapshots
    const existingContent = fs.readFile(SNAPSHOTS_PATH) || "[]";
    let snapshots: RegressionSnapshot[] = [];

    try {
      snapshots = JSON.parse(existingContent);
    } catch (err) {
      console.error("[RegressionSnapshots] Error parsing snapshots:", err);
      snapshots = [];
    }

    // Read current state
    const scene = useSceneGraph.getState().nodes;
    let config = {};
    const configContent = fs.readFile("GameConfig/card_rules.json");
    if (configContent) {
      try {
        config = JSON.parse(configContent);
      } catch (err) {
        console.error("[RegressionSnapshots] Error parsing config:", err);
      }
    }

    // Create snapshot
    const snapshot: RegressionSnapshot = {
      id: `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      testName: script?.metadata?.name,
      scene: { ...scene }, // Copy scene state
      config: JSON.parse(JSON.stringify(config)), // Deep clone config
      result: { ...result }, // Copy result
      script: script ? { ...script } : undefined,
      metadata: {
        author: script?.metadata?.author || "WISSIL"
      }
    };

    // Add to snapshots
    snapshots.push(snapshot);

    // Keep only last 100 snapshots
    if (snapshots.length > 100) {
      snapshots = snapshots.slice(-100);
    }

    // Save
    fs.writeFile(SNAPSHOTS_PATH, JSON.stringify(snapshots, null, 2));

    return snapshot;
  }

  /**
   * Load all snapshots
   */
  static loadAll(): RegressionSnapshot[] {
    const fs = useWissilFS.getState();
    const content = fs.readFile(SNAPSHOTS_PATH);

    if (!content) {
      return [];
    }

    try {
      return JSON.parse(content) as RegressionSnapshot[];
    } catch (err) {
      console.error("[RegressionSnapshots] Error loading snapshots:", err);
      return [];
    }
  }

  /**
   * Load snapshot by ID
   */
  static load(id: string): RegressionSnapshot | null {
    const snapshots = this.loadAll();
    return snapshots.find((s) => s.id === id) || null;
  }

  /**
   * Compare two snapshots
   */
  static compare(
    snapshot1: RegressionSnapshot,
    snapshot2: RegressionSnapshot
  ): {
    configChanged: boolean;
    sceneChanged: boolean;
    resultChanged: boolean;
    differences: string[];
  } {
    const differences: string[] = [];

    // Compare config
    const configChanged =
      JSON.stringify(snapshot1.config) !== JSON.stringify(snapshot2.config);
    if (configChanged) {
      differences.push("Configuration changed");
    }

    // Compare scene
    const sceneChanged =
      JSON.stringify(snapshot1.scene) !== JSON.stringify(snapshot2.scene);
    if (sceneChanged) {
      differences.push("Scene state changed");
    }

    // Compare results
    const resultChanged =
      snapshot1.result.passed !== snapshot2.result.passed;
    if (resultChanged) {
      differences.push(
        `Test result changed: ${snapshot1.result.passed ? "PASS" : "FAIL"} → ${snapshot2.result.passed ? "PASS" : "FAIL"}`
      );
    }

    return {
      configChanged,
      sceneChanged,
      resultChanged,
      differences
    };
  }

  /**
   * Find regression (test that passed before but fails now)
   */
  static findRegressions(): Array<{
    snapshot: RegressionSnapshot;
    previousSnapshot: RegressionSnapshot | null;
    type: "new_failure" | "fixed_test";
  }> {
    const snapshots = this.loadAll();
    const regressions: Array<{
      snapshot: RegressionSnapshot;
      previousSnapshot: RegressionSnapshot | null;
      type: "new_failure" | "fixed_test";
    }> = [];

    // Sort by timestamp
    const sorted = [...snapshots].sort((a, b) => a.timestamp - b.timestamp);

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const previous = sorted[i - 1];

      // Check if same test
      if (current.testName === previous.testName) {
        // Regression: passed before, fails now
        if (previous.result.passed && !current.result.passed) {
          regressions.push({
            snapshot: current,
            previousSnapshot: previous,
            type: "new_failure"
          });
        }

        // Fixed: failed before, passes now
        if (!previous.result.passed && current.result.passed) {
          regressions.push({
            snapshot: current,
            previousSnapshot: previous,
            type: "fixed_test"
          });
        }
      }
    }

    return regressions;
  }

  /**
   * Clear all snapshots
   */
  static clear(): void {
    const fs = useWissilFS.getState();
    fs.writeFile(SNAPSHOTS_PATH, "[]");
  }
}

