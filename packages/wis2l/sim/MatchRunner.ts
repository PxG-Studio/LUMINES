/**
 * Match Runner
 * Orchestrates a single match simulation
 */

import { SimState, SimCard, SimMatchResult } from "./SimTypes";
import { SimEngine } from "./SimEngine";
import { RandomAI } from "./agents/RandomAI";

export type AIAgent = {
  chooseMove: (state: SimState, hand: SimCard[]) => { card: SimCard; tileIndex: number };
};

/**
 * Match Runner
 * Runs a single match between two AI players
 */
export class MatchRunner {
  /**
   * Run a single match
   */
  static runMatch(
    deck1: SimCard[],
    deck2: SimCard[],
    ai1: AIAgent = RandomAI,
    ai2: AIAgent = RandomAI
  ): SimMatchResult {
    let state = SimEngine.createInitialState();
    let hand1 = [...deck1];
    let hand2 = [...deck2];
    const moves: Array<{ card: SimCard; tileIndex: number }> = [];

    // Play until board is full (max 9 turns)
    for (let turn = 0; turn < 9 && !SimEngine.isGameOver(state); turn++) {
      try {
        let move: { card: SimCard; tileIndex: number };

        if (state.currentPlayer === 1) {
          move = ai1.chooseMove(state, hand1);
          state = SimEngine.playCard(state, move.card, move.tileIndex);
          hand1 = hand1.filter((c) => c.id !== move.card.id);
        } else {
          move = ai2.chooseMove(state, hand2);
          state = SimEngine.playCard(state, move.card, move.tileIndex);
          hand2 = hand2.filter((c) => c.id !== move.card.id);
        }

        moves.push(move);
      } catch (error) {
        // No valid moves, break
        break;
      }
    }

    const winner = SimEngine.getWinner(state);

    return {
      finalState: state,
      winner,
      turns: state.turn,
      moves
    };
  }

  /**
   * Run multiple matches in parallel
   */
  static async runMatchesParallel(
    deck1: SimCard[],
    deck2: SimCard[],
    ai1: AIAgent,
    ai2: AIAgent,
    count: number
  ): Promise<SimMatchResult[]> {
    const promises: Promise<SimMatchResult>[] = [];

    for (let i = 0; i < count; i++) {
      promises.push(
        Promise.resolve(this.runMatch(deck1, deck2, ai1, ai2))
      );
    }

    return Promise.all(promises);
  }
}

