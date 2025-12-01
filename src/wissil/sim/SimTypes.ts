/**
 * Simulation Types
 * Core types for deterministic game simulation
 */

export interface SimCard {
  id: string;
  values: {
    up: number;
    right: number;
    down: number;
    left: number;
  };
  owner: 1 | 2;
}

export interface SimState {
  board: Array<SimCard | null>;
  currentPlayer: 1 | 2;
  score: { p1: number; p2: number };
  turn: number;
}

export interface SimMove {
  card: SimCard;
  tileIndex: number;
}

export interface SimMatchResult {
  finalState: SimState;
  winner: 1 | 2 | null; // null = tie
  turns: number;
  moves: SimMove[];
}

export interface SimBatchResult {
  p1wins: number;
  p2wins: number;
  ties: number;
  totalMatches: number;
  averageTurns: number;
  matchResults: SimMatchResult[];
}

export interface SimDeck {
  cards: SimCard[];
}

