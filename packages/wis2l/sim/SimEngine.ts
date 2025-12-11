/**
 * Simulation Engine
 * Deterministic headless game logic
 * Mirrors Unity capture logic, board logic, and card rules
 */

import { SimState, SimCard, SimMove } from "./SimTypes";

/**
 * Simulation Engine
 * Pure TypeScript game logic for headless simulation
 */
export class SimEngine {
  /**
   * Play a card on the board
   */
  static playCard(state: SimState, card: SimCard, tileIndex: number): SimState {
    const newState: SimState = JSON.parse(JSON.stringify(state));

    if (newState.board[tileIndex] !== null) {
      throw new Error(`Tile ${tileIndex} is already occupied`);
    }

    // Place card
    const placedCard: SimCard = {
      ...card,
      owner: state.currentPlayer
    };
    newState.board[tileIndex] = placedCard;

    // Capture logic
    const neighbors = this.getNeighbors(tileIndex);
    neighbors.forEach((neighborIndex) => {
      const neighbor = newState.board[neighborIndex];
      if (!neighbor) return;

      // Check if we can capture this neighbor
      const facingDirection = this.facing(neighborIndex, tileIndex);
      const neighborFacingDirection = this.facing(tileIndex, neighborIndex);

      if (
        placedCard.values[facingDirection] >
        neighbor.values[neighborFacingDirection]
      ) {
        // Capture successful
        neighbor.owner = placedCard.owner;
      }
    });

    // Recount scores
    this.recount(newState);

    // Switch player
    newState.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
    newState.turn = state.turn + 1;

    return newState;
  }

  /**
   * Recount scores based on board ownership
   */
  static recount(state: SimState): void {
    let p1 = 0;
    let p2 = 0;

    state.board.forEach((card) => {
      if (!card) return;
      if (card.owner === 1) p1++;
      if (card.owner === 2) p2++;
    });

    state.score = { p1, p2 };
  }

  /**
   * Get neighbor tile indices for a given tile
   */
  static getNeighbors(tileIndex: number): number[] {
    // 3x3 grid: indices 0-8
    // 0 1 2
    // 3 4 5
    // 6 7 8
    const neighbors: number[] = [];
    const row = Math.floor(tileIndex / 3);
    const col = tileIndex % 3;

    // Up
    if (row > 0) neighbors.push(tileIndex - 3);

    // Down
    if (row < 2) neighbors.push(tileIndex + 3);

    // Left
    if (col > 0) neighbors.push(tileIndex - 1);

    // Right
    if (col < 2) neighbors.push(tileIndex + 1);

    return neighbors;
  }

  /**
   * Determine which direction tile B is facing from tile A
   */
  static facing(fromIndex: number, toIndex: number): "up" | "right" | "down" | "left" {
    const diff = toIndex - fromIndex;

    if (diff === -3) return "up";
    if (diff === 3) return "down";
    if (diff === 1 && fromIndex % 3 !== 2) return "right";
    if (diff === -1 && fromIndex % 3 !== 0) return "left";

    throw new Error(`Invalid facing: ${fromIndex} -> ${toIndex}`);
  }

  /**
   * Check if game is over (all tiles filled)
   */
  static isGameOver(state: SimState): boolean {
    return state.board.every((tile) => tile !== null);
  }

  /**
   * Get winner from final state
   */
  static getWinner(state: SimState): 1 | 2 | null {
    if (state.score.p1 > state.score.p2) return 1;
    if (state.score.p2 > state.score.p1) return 2;
    return null; // Tie
  }

  /**
   * Get available moves for a player
   */
  static getAvailableMoves(state: SimState, hand: SimCard[]): SimMove[] {
    const moves: SimMove[] = [];
    const emptyTiles = state.board
      .map((tile, index) => (tile === null ? index : null))
      .filter((index): index is number => index !== null);

    for (const card of hand) {
      for (const tileIndex of emptyTiles) {
        moves.push({ card, tileIndex });
      }
    }

    return moves;
  }

  /**
   * Create initial game state
   */
  static createInitialState(): SimState {
    return {
      board: Array(9).fill(null),
      currentPlayer: 1,
      score: { p1: 0, p2: 0 },
      turn: 0
    };
  }
}

