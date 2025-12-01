/**
 * Playtesting Dashboard UI
 * Complete UI for running batch simulations and viewing results
 */

'use client';

import React, { useState } from "react";
import { BatchRunner } from "./BatchRunner";
import { Telemetry } from "./Telemetry";
import { LunaBalanceAnalyzer } from "../luna/LunaBalanceAnalyzer";
import { LunaBalanceFixer } from "../luna/LunaBalanceFixer";
import { useWissilFS } from "../runtime/fs/wissilFs";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Button } from "@/design-system/primitives/Button";
import { Card } from "@/design-system/primitives/Card";
import { SimCard, SimBatchResult, TelemetryStats } from "./SimTypes";

export function PlaytestPanel() {
  const theme = useTheme();
  const fs = useWissilFS.getState();

  const [isRunning, setIsRunning] = useState(false);
  const [matchCount, setMatchCount] = useState(500);
  const [ai1Name, setAi1Name] = useState("Heuristic");
  const [ai2Name, setAi2Name] = useState("Heuristic");
  const [batchResult, setBatchResult] = useState<SimBatchResult | null>(null);
  const [telemetryStats, setTelemetryStats] = useState<TelemetryStats | null>(null);
  const [balanceIssues, setBalanceIssues] = useState<any[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const getDefaultDeck = (): SimCard[] => {
    return [
      { id: "A", values: { up: 2, right: 5, down: 1, left: 3 }, owner: 1 },
      { id: "B", values: { up: 3, right: 2, down: 4, left: 1 }, owner: 1 },
      { id: "C", values: { up: 1, right: 4, down: 3, left: 2 }, owner: 1 },
      { id: "D", values: { up: 4, right: 1, down: 2, left: 5 }, owner: 1 },
      { id: "E", values: { up: 2, right: 3, down: 5, left: 1 }, owner: 1 }
    ];
  };

  const handleRun = async () => {
    setIsRunning(true);
    setLog([]);
    addLog(`Starting batch simulation: ${matchCount} matches`);

    try {
      const deck1 = getDefaultDeck();
      const deck2 = getDefaultDeck();

      addLog(`Running ${matchCount} matches with ${ai1Name} vs ${ai2Name}...`);

      // Run batch simulation
      const batch = await BatchRunner.runBatchWithAIs(
        deck1,
        deck2,
        ai1Name,
        ai2Name,
        matchCount
      );

      setBatchResult(batch);
      addLog(`Batch complete: P1 wins: ${batch.p1wins}, P2 wins: ${batch.p2wins}, Ties: ${batch.ties}`);

      // Analyze telemetry
      const stats = Telemetry.analyze(batch);
      setTelemetryStats(stats);
      addLog(`Balance analysis complete: Imbalance: ${(stats.imbalance * 100).toFixed(1)}%`);

      // Load game config
      let config = null;
      try {
        const configContent = fs.readFile("GameConfig/card_rules.json");
        if (configContent) {
          config = JSON.parse(configContent);
        }
      } catch (error) {
        addLog("Warning: Could not load game config");
      }

      // Analyze balance issues
      const issues = LunaBalanceAnalyzer.analyze(stats, config);
      setBalanceIssues(issues);
      addLog(`Found ${issues.length} balance issues`);

      // Auto-fix issues if any
      if (issues.length > 0) {
        addLog("Auto-fixing balance issues...");
        LunaBalanceFixer.fix(issues, config);
        addLog("Balance fixes applied");
      }
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const balanceScore = telemetryStats
    ? LunaBalanceAnalyzer.getBalanceScore(telemetryStats)
    : null;

  return (
    <div
      style={{
        padding: theme.spacing.md,
        height: "100%",
        overflow: "auto",
        background: theme.colors.bg0
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
            fontSize: theme.typography.size.lg,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          AI Playtesting Automaton
        </h2>
        <p
          style={{
            marginTop: theme.spacing.xs,
            fontSize: theme.typography.size.sm,
            color: theme.colors.text2
          }}
        >
          Simulate thousands of matches, detect imbalance, and auto-correct rules
        </p>
      </div>

      {/* Controls */}
      <Card
        style={{
          marginBottom: theme.spacing.md,
          padding: theme.spacing.md
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: theme.spacing.md,
            marginBottom: theme.spacing.md
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.size.sm,
                color: theme.colors.text1,
                marginBottom: theme.spacing.xs
              }}
            >
              Match Count
            </label>
            <input
              type="number"
              min="10"
              max="10000"
              value={matchCount}
              onChange={(e) => setMatchCount(parseInt(e.target.value, 10) || 500)}
              disabled={isRunning}
              style={{
                width: "100%",
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                background: theme.colors.bg2,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii.sm,
                color: theme.colors.text0,
                fontSize: theme.typography.size.sm
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.size.sm,
                color: theme.colors.text1,
                marginBottom: theme.spacing.xs
              }}
            >
              AI 1
            </label>
            <select
              value={ai1Name}
              onChange={(e) => setAi1Name(e.target.value)}
              disabled={isRunning}
              style={{
                width: "100%",
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                background: theme.colors.bg2,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii.sm,
                color: theme.colors.text0,
                fontSize: theme.typography.size.sm
              }}
            >
              <option value="Random">Random</option>
              <option value="Heuristic">Heuristic</option>
              <option value="MonteCarlo">Monte Carlo</option>
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.size.sm,
                color: theme.colors.text1,
                marginBottom: theme.spacing.xs
              }}
            >
              AI 2
            </label>
            <select
              value={ai2Name}
              onChange={(e) => setAi2Name(e.target.value)}
              disabled={isRunning}
              style={{
                width: "100%",
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                background: theme.colors.bg2,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii.sm,
                color: theme.colors.text0,
                fontSize: theme.typography.size.sm
              }}
            >
              <option value="Random">Random</option>
              <option value="Heuristic">Heuristic</option>
              <option value="MonteCarlo">Monte Carlo</option>
            </select>
          </div>
        </div>
        <Button
          variant="accent"
          onClick={handleRun}
          disabled={isRunning}
          style={{
            width: "100%",
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            fontSize: theme.typography.size.sm
          }}
        >
          {isRunning ? "Running..." : `Run ${matchCount} Matches`}
        </Button>
      </Card>

      {/* Results */}
      {telemetryStats && batchResult && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: theme.spacing.md,
            marginBottom: theme.spacing.md
          }}
        >
          {/* Win Rates */}
          <Card style={{ padding: theme.spacing.md }}>
            <h3
              style={{
                margin: 0,
                marginBottom: theme.spacing.sm,
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.semibold,
                color: theme.colors.text0
              }}
            >
              Win Rates
            </h3>
            <div style={{ marginBottom: theme.spacing.xs }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: theme.colors.text1 }}>Player 1:</span>
                <strong style={{ color: theme.colors.text0 }}>
                  {(telemetryStats.p1WinRate * 100).toFixed(1)}%
                </strong>
              </div>
            </div>
            <div style={{ marginBottom: theme.spacing.xs }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: theme.colors.text1 }}>Player 2:</span>
                <strong style={{ color: theme.colors.text0 }}>
                  {(telemetryStats.p2WinRate * 100).toFixed(1)}%
                </strong>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: theme.colors.text1 }}>Ties:</span>
                <strong style={{ color: theme.colors.text0 }}>
                  {(telemetryStats.tieRate * 100).toFixed(1)}%
                </strong>
              </div>
            </div>
          </Card>

          {/* Balance Score */}
          {balanceScore !== null && (
            <Card style={{ padding: theme.spacing.md }}>
              <h3
                style={{
                  margin: 0,
                  marginBottom: theme.spacing.sm,
                  fontSize: theme.typography.size.sm,
                  fontWeight: theme.typography.weight.semibold,
                  color: theme.colors.text0
                }}
              >
                Balance Score
              </h3>
              <div
                style={{
                  fontSize: theme.typography.size.xl,
                  fontWeight: theme.typography.weight.semibold,
                  color:
                    balanceScore >= 80
                      ? theme.colors.success
                      : balanceScore >= 60
                      ? theme.colors.warning
                      : theme.colors.error
                }}
              >
                {balanceScore}/100
              </div>
              <div
                style={{
                  fontSize: theme.typography.size.xs,
                  color: theme.colors.text2,
                  marginTop: theme.spacing.xs
                }}
              >
                Imbalance: {(telemetryStats.imbalance * 100).toFixed(1)}%
              </div>
            </Card>
          )}

          {/* Match Stats */}
          <Card style={{ padding: theme.spacing.md }}>
            <h3
              style={{
                margin: 0,
                marginBottom: theme.spacing.sm,
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.semibold,
                color: theme.colors.text0
              }}
            >
              Match Statistics
            </h3>
            <div style={{ marginBottom: theme.spacing.xs }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: theme.colors.text1 }}>Total Matches:</span>
                <strong style={{ color: theme.colors.text0 }}>
                  {batchResult.totalMatches}
                </strong>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: theme.colors.text1 }}>Avg Turns:</span>
                <strong style={{ color: theme.colors.text0 }}>
                  {telemetryStats.averageTurns.toFixed(1)}
                </strong>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Balance Issues */}
      {balanceIssues.length > 0 && (
        <Card
          style={{
            marginBottom: theme.spacing.md,
            padding: theme.spacing.md
          }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: theme.spacing.sm,
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0
            }}
          >
            Balance Issues ({balanceIssues.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
            {balanceIssues.map((issue, i) => (
              <div
                key={i}
                style={{
                  padding: theme.spacing.sm,
                  background: theme.colors.bg2,
                  borderRadius: theme.radii.sm,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.size.sm,
                    fontWeight: theme.typography.weight.medium,
                    color: theme.colors.text0,
                    marginBottom: theme.spacing.xs
                  }}
                >
                  [{issue.severity.toUpperCase()}] {issue.description}
                </div>
                <div
                  style={{
                    fontSize: theme.typography.size.xs,
                    color: theme.colors.text2
                  }}
                >
                  💡 {issue.suggestion}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Log */}
      <Card style={{ padding: theme.spacing.md }}>
        <h3
          style={{
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Log
        </h3>
        <div
          style={{
            maxHeight: 300,
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: theme.typography.size.xs,
            color: theme.colors.text1,
            background: theme.colors.bg2,
            padding: theme.spacing.sm,
            borderRadius: theme.radii.sm
          }}
        >
          {log.length === 0 ? (
            <div style={{ color: theme.colors.text2, fontStyle: "italic" }}>
              No log entries yet
            </div>
          ) : (
            log.map((entry, i) => (
              <div key={i} style={{ marginBottom: theme.spacing.xs }}>
                {entry}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

