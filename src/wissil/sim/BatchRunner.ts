/**
 * Batch Runner
 * Runs multiple matches and aggregates results
 */

import { SimCard, SimBatchResult, SimMatchResult } from "./SimTypes";
import { MatchRunner } from "./MatchRunner";
import { RandomAI } from "./agents/RandomAI";
import { HeuristicAI } from "./agents/HeuristicAI";
import { MonteCarloAI } from "./agents/MonteCarloAI";

export type AIAgent = {
  chooseMove: (state: any, hand: SimCard[]) => { card: SimCard; tileIndex: number };
};

/**
 * Batch Runner
 * Runs hundreds or thousands of matches in parallel
 */
export class BatchRunner {
  /**
   * Run a batch of matches
   */
  static async runBatch(
    deck1: SimCard[],
    deck2: SimCard[],
    ai1: AIAgent = RandomAI,
    ai2: AIAgent = RandomAI,
    count: number = 1000
  ): Promise<SimBatchResult> {
    let p1wins = 0;
    let p2wins = 0;
    let ties = 0;
    let totalTurns = 0;
    const matchResults: SimMatchResult[] = [];

    // Run matches in parallel batches
    const batchSize = 100;
    const batches = Math.ceil(count / batchSize);

    for (let batch = 0; batch < batches; batch++) {
      const batchCount = Math.min(batchSize, count - batch * batchSize);
      const results = await MatchRunner.runMatchesParallel(
        deck1,
        deck2,
        ai1,
        ai2,
        batchCount
      );

      for (const result of results) {
        matchResults.push(result);

        if (result.winner === 1) {
          p1wins++;
        } else if (result.winner === 2) {
          p2wins++;
        } else {
          ties++;
        }

        totalTurns += result.turns;
      }
    }

    return {
      p1wins,
      p2wins,
      ties,
      totalMatches: count,
      averageTurns: totalTurns / count,
      matchResults
    };
  }

  /**
   * Run batch with different AI combinations
   */
  static async runBatchWithAIs(
    deck1: SimCard[],
    deck2: SimCard[],
    ai1Name: string = "Random",
    ai2Name: string = "Random",
    count: number = 1000
  ): Promise<SimBatchResult> {
    const aiMap: Record<string, AIAgent> = {
      Random: RandomAI,
      Heuristic: HeuristicAI,
      MonteCarlo: MonteCarloAI
    };

    const ai1 = aiMap[ai1Name] || RandomAI;
    const ai2 = aiMap[ai2Name] || RandomAI;

    return this.runBatch(deck1, deck2, ai1, ai2, count);
  }
}

