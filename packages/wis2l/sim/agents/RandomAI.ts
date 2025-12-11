/**
 * Random AI Agent
 * Baseline AI that makes random valid moves
 */

import { SimState, SimCard, SimMove } from "../SimTypes";
import { SimEngine } from "../SimEngine";

/**
 * Random AI
 * Makes random moves from available options
 */
export class RandomAI {
  /**
   * Choose a move randomly
   */
  static chooseMove(state: SimState, hand: SimCard[]): SimMove {
    const availableMoves = SimEngine.getAvailableMoves(state, hand);

    if (availableMoves.length === 0) {
      throw new Error("No available moves");
    }

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  /**
   * Get AI name
   */
  static getName(): string {
    return "RandomAI";
  }
}

