/**
 * Telemetry Pipeline
 * Statistical analysis and anomaly detection
 */

import { SimBatchResult } from "./SimTypes";

export interface TelemetryStats {
  p1WinRate: number;
  p2WinRate: number;
  tieRate: number;
  imbalance: number; // |p1WinRate - p2WinRate|
  averageTurns: number;
  totalMatches: number;
  anomalies: string[];
}

/**
 * Telemetry
 * Analyzes simulation batch results
 */
export class Telemetry {
  /**
   * Analyze batch results
   */
  static analyze(batch: SimBatchResult): TelemetryStats {
    const { p1wins, p2wins, ties, totalMatches, averageTurns } = batch;

    const total = p1wins + p2wins + ties;
    const p1WinRate = p1wins / total;
    const p2WinRate = p2wins / total;
    const tieRate = ties / total;
    const imbalance = Math.abs(p1WinRate - p2WinRate);

    // Detect anomalies
    const anomalies: string[] = [];

    if (imbalance > 0.15) {
      anomalies.push(
        `Major imbalance detected: Player ${p1WinRate > p2WinRate ? "1" : "2"} wins ${(Math.max(p1WinRate, p2WinRate) * 100).toFixed(1)}% of matches`
      );
    }

    if (tieRate > 0.4) {
      anomalies.push(`High tie rate: ${(tieRate * 100).toFixed(1)}% of matches end in ties`);
    }

    if (averageTurns < 5) {
      anomalies.push(`Very short matches: Average ${averageTurns.toFixed(1)} turns`);
    }

    if (averageTurns > 8.5) {
      anomalies.push(`Very long matches: Average ${averageTurns.toFixed(1)} turns`);
    }

    // Check for extreme win rates
    if (p1WinRate > 0.7 || p2WinRate > 0.7) {
      anomalies.push(
        `Extreme win rate: One player dominates (${Math.max(p1WinRate, p2WinRate) * 100}% win rate)`
      );
    }

    return {
      p1WinRate,
      p2WinRate,
      tieRate,
      imbalance,
      averageTurns,
      totalMatches,
      anomalies
    };
  }

  /**
   * Compare two batch results
   */
  static compare(
    before: SimBatchResult,
    after: SimBatchResult
  ): {
    improvement: boolean;
    p1Delta: number;
    p2Delta: number;
    imbalanceDelta: number;
    message: string;
  } {
    const statsBefore = this.analyze(before);
    const statsAfter = this.analyze(after);

    const p1Delta = statsAfter.p1WinRate - statsBefore.p1WinRate;
    const p2Delta = statsAfter.p2WinRate - statsBefore.p2WinRate;
    const imbalanceDelta = statsAfter.imbalance - statsBefore.imbalance;

    // Improvement = reduced imbalance
    const improvement = imbalanceDelta < 0;

    let message = "";
    if (improvement) {
      message = `Balance improved: Imbalance reduced by ${Math.abs(imbalanceDelta * 100).toFixed(1)}%`;
    } else {
      message = `Balance worsened: Imbalance increased by ${Math.abs(imbalanceDelta * 100).toFixed(1)}%`;
    }

    return {
      improvement,
      p1Delta,
      p2Delta,
      imbalanceDelta,
      message
    };
  }
}

