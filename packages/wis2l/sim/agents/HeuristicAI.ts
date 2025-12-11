/**
 * Heuristic AI Agent
 * Positional/synergy scoring based AI
 */

import { SimState, SimCard, SimMove } from "../SimTypes";
import { SimEngine } from "../SimEngine";

/**
 * Heuristic AI
 * Evaluates moves based on potential captures and board position
 */
export class HeuristicAI {
  /**
   * Choose best move based on heuristics
   */
  static chooseMove(state: SimState, hand: SimCard[]): SimMove {
    let bestMove: SimMove | null = null;
    let bestScore = -999;

    const availableMoves = SimEngine.getAvailableMoves(state, hand);

    for (const move of availableMoves) {
      const score = this.evaluateMove(state, move);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    if (!bestMove) {
      // Fallback to random if no move found
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      return availableMoves[randomIndex];
    }

    return bestMove;
  }

  /**
   * Evaluate a potential move
   */
  private static evaluateMove(state: SimState, move: SimMove): number {
    let score = 0;

    // Simulate placing the card
    const neighbors = SimEngine.getNeighbors(move.tileIndex);

    // Reward potential captures
    neighbors.forEach((neighborIndex) => {
      const neighbor = state.board[neighborIndex];
      if (!neighbor) return;

      const facingDirection = SimEngine.facing(neighborIndex, move.tileIndex);
      const neighborFacingDirection = SimEngine.facing(
        move.tileIndex,
        neighborIndex
      );

      if (
        move.card.values[facingDirection] >
        neighbor.values[neighborFacingDirection]
      ) {
        // Potential capture
        score += 5;

        // Bonus if capturing opponent's card
        if (neighbor.owner !== state.currentPlayer) {
          score += 3;
        }
      }
    });

    // Reward center position (more neighbors = more potential captures)
    if (move.tileIndex === 4) {
      score += 2;
    }

    // Reward corner positions (harder to flip back)
    if ([0, 2, 6, 8].includes(move.tileIndex)) {
      score += 1;
    }

    // Penalize using low-value cards early
    const totalValue =
      move.card.values.up +
      move.card.values.right +
      move.card.values.down +
      move.card.values.left;
    if (state.turn < 3 && totalValue < 8) {
      score -= 2;
    }

    return score;
  }

  /**
   * Get AI name
   */
  static getName(): string {
    return "HeuristicAI";
  }
}

