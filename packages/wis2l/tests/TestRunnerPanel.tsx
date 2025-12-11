/**
 * Test Runner UI Panel
 * IDE integration for test scenario runner
 * Shows test results, allows manual test execution, displays reports
 */

'use client';

import React, { useState, useEffect } from "react";
import { ContinuousTestRunner } from "./ContinuousTestRunner";
import { LunaScenarioGenerator } from "../luna/LunaScenarioGenerator";
import { RegressionSnapshots } from "./RegressionSnapshots";
import { TestDSL } from "./TestDSL";
import { Button } from "@/design-system/primitives/Button";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { useEditorState } from "@/state/editorState";
import { LunaTestFixer } from "../luna/LunaTestFixer";

export interface TestRunnerPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function TestRunnerPanel({
  className,
  style
}: TestRunnerPanelProps) {
  const theme = useTheme();
  const pushMessage = useEditorState.getState().pushMessage;
  const [isRunning, setIsRunning] = useState(false);
  const [isContinuous, setIsContinuous] = useState(false);
  const [testLog, setTestLog] = useState<string>("");
  const [snapshots, setSnapshots] = useState<any[]>([]);

  // Load snapshots
  useEffect(() => {
    const loadSnapshots = () => {
      const loaded = RegressionSnapshots.loadAll();
      setSnapshots(loaded.slice(-10)); // Show last 10
    };

    loadSnapshots();

    // Reload periodically
    const interval = setInterval(loadSnapshots, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRunTest = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setTestLog("Generating test scenario...\n");

    try {
      // Generate test
      const script = await LunaScenarioGenerator.generate();
      setTestLog((prev) => prev + `Test: ${script.metadata?.name || "Unnamed"}\n`);
      setTestLog((prev) => prev + TestDSL.serialize(script) + "\n\n");

      // Run test
      setTestLog((prev) => prev + "Running test...\n");
      const result = await ContinuousTestRunner.runScript(script);

      // Check for failures and auto-fix
      if (!result.validation.passed) {
        setTestLog((prev) => prev + "\n❌ Test failed. Attempting auto-fix...\n");
        const fixed = LunaTestFixer.fix(result.validation, script);
        if (fixed) {
          setTestLog((prev) => prev + "✅ Auto-fix applied. Re-run test to verify.\n");
        }
      }

      // Display results
      const report = require("./TestValidator").TestValidator.generateReport(result.validation);
      setTestLog((prev) => prev + "\n" + report + "\n");

      // Reload snapshots
      const loaded = RegressionSnapshots.loadAll();
      setSnapshots(loaded.slice(-10));
    } catch (err: any) {
      setTestLog((prev) => prev + `\n❌ Error: ${err.message}\n`);
      pushMessage(`[Test Runner] ❌ Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleToggleContinuous = () => {
    if (isContinuous) {
      ContinuousTestRunner.stop();
      setIsContinuous(false);
      setTestLog((prev) => prev + "\n⏹️ Continuous testing stopped\n");
    } else {
      ContinuousTestRunner.start(30000); // 30 seconds
      setIsContinuous(true);
      setTestLog((prev) => prev + "\n🚀 Continuous testing started\n");
    }
  };

  const handleClearLog = () => {
    setTestLog("");
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div
      className={className}
      style={{
        padding: theme.spacing.md,
        height: "100%",
        overflow: "auto",
        background: theme.colors.bg0,
        ...style
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.xl,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          AI Test Scenario Runner
        </h2>
        <p
          style={{
            margin: 0,
            color: theme.colors.text2,
            fontSize: theme.typography.size.sm,
            opacity: 0.8
          }}
        >
          AI-driven test harness that auto-generates scenarios, validates rules, and auto-fixes failures
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.lg
        }}
      >
        <Button
          variant="accent"
          onClick={handleRunTest}
          disabled={isRunning}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            fontSize: theme.typography.size.sm
          }}
        >
          {isRunning ? "Running..." : "Generate & Run Test"}
        </Button>
        <Button
          variant={isContinuous ? "accent" : "ghost"}
          onClick={handleToggleContinuous}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            fontSize: theme.typography.size.sm
          }}
        >
          {isContinuous ? "Stop Continuous" : "Start Continuous"}
        </Button>
        <Button
          variant="ghost"
          onClick={handleClearLog}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            fontSize: theme.typography.size.sm
          }}
        >
          Clear Log
        </Button>
      </div>

      {/* Test Log */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`,
          maxHeight: "400px",
          overflow: "auto"
        }}
      >
        <div
          style={{
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Test Log
        </div>
        <pre
          style={{
            fontSize: theme.typography.size.xs,
            fontFamily: "monospace",
            color: theme.colors.text1,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            margin: 0
          }}
        >
          {testLog || "No test log yet. Click 'Generate & Run Test' to start."}
        </pre>
      </div>

      {/* Recent Snapshots */}
      <div
        style={{
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <div
          style={{
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Recent Test Snapshots ({snapshots.length})
        </div>
        {snapshots.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
            {snapshots.slice().reverse().map((snapshot) => (
              <div
                key={snapshot.id}
                style={{
                  padding: theme.spacing.sm,
                  background: theme.colors.bg2,
                  borderRadius: theme.radii.sm,
                  border: `1px solid ${theme.colors.border}`,
                  fontSize: theme.typography.size.xs
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: theme.spacing.xs
                  }}
                >
                  <div style={{ color: theme.colors.text0, fontWeight: theme.typography.weight.medium }}>
                    {snapshot.testName || "Unnamed Test"}
                  </div>
                  <div
                    style={{
                      color: snapshot.result.passed
                        ? theme.colors.success || "#4ade80"
                        : theme.colors.error || "#ef4444",
                      fontSize: theme.typography.size.xs
                    }}
                  >
                    {snapshot.result.passed ? "✅ PASS" : "❌ FAIL"}
                  </div>
                </div>
                <div style={{ color: theme.colors.text2, fontSize: theme.typography.size.xs }}>
                  {formatTimestamp(snapshot.timestamp)} • {snapshot.result.passedSteps}/{snapshot.result.totalSteps} steps passed
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              fontSize: theme.typography.size.sm,
              color: theme.colors.text2,
              opacity: 0.6,
              fontStyle: "italic"
            }}
          >
            No snapshots yet
          </div>
        )}
      </div>
    </div>
  );
}

