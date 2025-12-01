/**
 * Monte Carlo AI Agent
 * MCTS (Monte Carlo Tree Search) rollout agent
 * Very strong AI using random simulations
 */

import { SimState, SimCard, SimMove } from "../SimTypes";
import { SimEngine } from "../SimEngine";
import { RandomAI } from "./RandomAI";

/**
 * Monte Carlo AI
 * Uses MCTS rollouts to evaluate moves
 */
export class MonteCarloAI {
  private static readonly ROLLOUTS = 200;

  /**
   * Choose best move using Monte Carlo rollouts
   */
  static chooseMove(state: SimState, hand: SimCard[]): SimMove {
    const availableMoves = SimEngine.getAvailableMoves(state, hand);

    if (availableMoves.length === 0) {
      throw new Error("No available moves");
    }

    let bestMove: SimMove | null = null;
    let bestWinRate = -1;

    // Evaluate each move with rollouts
    for (const move of availableMoves) {
      const winRate = this.evaluateMove(state, move, hand);
      if (winRate > bestWinRate) {
        bestWinRate = winRate;
        bestMove = move;
      }
    }

    if (!bestMove) {
      // Fallback to random
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      return availableMoves[randomIndex];
    }

    return bestMove;
  }

  /**
   * Evaluate a move using Monte Carlo rollouts
   */
  private static evaluateMove(
    state: SimState,
    move: SimMove,
    hand: SimCard[]
  ): number {
    let wins = 0;

    for (let r = 0; r < this.ROLLOUTS; r++) {
      // Create new state with move applied
      const newHand = hand.filter((c) => c.id !== move.card.id);
      let simState = SimEngine.playCard(state, move.card, move.tileIndex);

      // Determine winner through random rollout
      const winner = this.rollout(simState, newHand, state.currentPlayer);
      if (winner === state.currentPlayer) {
        wins++;
      }
    }

    return wins / this.ROLLOUTS;
  }

  /**
   * Rollout simulation until game end
   */
  private static rollout(
    state: SimState,
    remainingHand: SimCard[],
    originalPlayer: 1 | 2
  ): 1 | 2 | null {
    let simState = JSON.parse(JSON.stringify(state));
    let p1Hand = [...remainingHand];
    let p2Hand = [...remainingHand]; // Simplified: same deck for both

    // Random playout until game over
    while (!SimEngine.isGameOver(simState)) {
      const currentHand = simState.currentPlayer === 1 ? p1Hand : p2Hand;
      if (currentHand.length === 0) break;

      // Make random move
      try {
        const move = RandomAI.chooseMove(simState, currentHand);
        simState = SimEngine.playCard(simState, move.card, move.tileIndex);

        // Remove card from hand
        if (simState.currentPlayer === 2) {
          // Just switched, so we used player 1's hand
          p1Hand = p1Hand.filter((c) => c.id !== move.card.id);
        } else {
          // Just switched, so we used player 2's hand
          p2Hand = p2Hand.filter((c) => c.id !== move.card.id);
        }
      } catch (error) {
        // No valid moves, break
        break;
      }
    }

    // Determine winner
    const finalWinner = SimEngine.getWinner(simState);
    return finalWinner;
  }

  /**
   * Get AI name
   */
  static getName(): string {
    return "MonteCarloAI";
  }
}

