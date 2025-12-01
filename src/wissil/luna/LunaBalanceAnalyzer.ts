/**
 * LUNA Balance Analyzer
 * LLM + heuristics for detecting game balance issues
 */

import { TelemetryStats } from "../sim/Telemetry";

export interface BalanceIssue {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  suggestion: string;
}

/**
 * LUNA Balance Analyzer
 * Analyzes game balance using heuristics and patterns
 */
export class LunaBalanceAnalyzer {
  /**
   * Analyze balance statistics
   */
  static analyze(stats: TelemetryStats, rules?: any): BalanceIssue[] {
    const issues: BalanceIssue[] = [];

    // Check for major imbalance
    if (stats.imbalance > 0.15) {
      issues.push({
        type: "major_imbalance",
        severity: "high",
        description: `Major imbalance between players: ${(stats.imbalance * 100).toFixed(1)}% difference`,
        suggestion: "Adjust starting decks or card values to balance win rates"
      });
    }

    // Check for too many ties
    if (stats.tieRate > 0.4) {
      issues.push({
        type: "high_tie_rate",
        severity: "medium",
        description: `Too many ties: ${(stats.tieRate * 100).toFixed(1)}% of matches end in ties`,
        suggestion: "Reduce capture threshold or adjust card value distribution"
      });
    }

    // Check for very short matches
    if (stats.averageTurns < 5) {
      issues.push({
        type: "short_matches",
        severity: "medium",
        description: `Matches are too short: Average ${stats.averageTurns.toFixed(1)} turns`,
        suggestion: "Increase card values or add more strategic depth"
      });
    }

    // Check for very long matches
    if (stats.averageTurns > 8.5) {
      issues.push({
        type: "long_matches",
        severity: "low",
        description: `Matches are too long: Average ${stats.averageTurns.toFixed(1)} turns`,
        suggestion: "Reduce card values or increase capture thresholds"
      });
    }

    // Check for extreme win rates
    if (stats.p1WinRate > 0.7 || stats.p2WinRate > 0.7) {
      const dominantPlayer = stats.p1WinRate > stats.p2WinRate ? 1 : 2;
      issues.push({
        type: "extreme_win_rate",
        severity: "high",
        description: `Player ${dominantPlayer} dominates: ${(Math.max(stats.p1WinRate, stats.p2WinRate) * 100).toFixed(1)}% win rate`,
        suggestion: "Redistribute card values or adjust starting conditions"
      });
    }

    // Check for anomalies
    if (stats.anomalies && stats.anomalies.length > 0) {
      for (const anomaly of stats.anomalies) {
        issues.push({
          type: "anomaly",
          severity: "medium",
          description: anomaly,
          suggestion: "Review match results and adjust game parameters"
        });
      }
    }

    return issues;
  }

  /**
   * Get balance health score (0-100)
   */
  static getBalanceScore(stats: TelemetryStats): number {
    let score = 100;

    // Penalize imbalance
    score -= stats.imbalance * 50;

    // Penalize high tie rate
    if (stats.tieRate > 0.3) {
      score -= (stats.tieRate - 0.3) * 20;
    }

    // Penalize extreme win rates
    if (stats.p1WinRate > 0.65 || stats.p2WinRate > 0.65) {
      score -= 20;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }
}

