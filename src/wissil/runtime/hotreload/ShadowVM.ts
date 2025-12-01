/**
 * Shadow VM (JS Gameplay Logic Mirror)
 * Simulates changed C# gameplay logic entirely in JS
 * Sends results back to Unity for runtime behavior
 * Useful for: card comparisons, capture logic, scoring, AI, combos
 */

import { UnityMessagingBus } from "../unityBridge/UnityMessagingBus";
import { useWissilFS } from "../fs/wissilFs";

export interface Card {
  id: string;
  top: number;
  bottom: number;
  left: number;
  right: number;
  name?: string;
  [key: string]: any;
}

export interface CaptureRules {
  threshold: number;
  method: "higher" | "total" | "any";
  allowTies?: boolean;
}

export interface ScoringRules {
  basePoints: number;
  multiplier: number;
  comboBonus: number;
  maxCombo: number;
}

export interface GameplayRules {
  captureRules: CaptureRules;
  scoringRules: ScoringRules;
  [key: string]: any;
}

/**
 * Shadow VM - JavaScript gameplay logic mirror
 * Evaluates gameplay logic and sends results to Unity
 */
export const ShadowVM = {
  rules: {} as GameplayRules,
  isEnabled: true,

  /**
   * Load gameplay rules from JSON
   */
  loadRules(json: string | GameplayRules): void {
    try {
      if (typeof json === "string") {
        this.rules = JSON.parse(json);
      } else {
        this.rules = json;
      }
      console.log("[ShadowVM] Rules loaded:", this.rules);
    } catch (err: any) {
      console.error("[ShadowVM] Error loading rules:", err);
    }
  },

  /**
   * Load rules from WISSIL FS file
   */
  loadRulesFromFile(path: string = "GameConfig/gameplay_rules.json"): void {
    const fs = useWissilFS.getState();
    const content = fs.readFile(path);

    if (content) {
      this.loadRules(content);
    } else {
      console.warn(`[ShadowVM] Rules file not found: ${path}`);
    }
  },

  /**
   * Evaluate card capture logic
   * Returns true if card A can capture card B
   */
  evaluateCardCapture(cardA: Card, cardB: Card, side: "top" | "bottom" | "left" | "right"): boolean {
    if (!this.isEnabled) return false;

    const rules = this.rules.captureRules as CaptureRules;
    if (!rules) return false;

    const valueA = cardA[side] || 0;
    const valueB = cardB[side] || 0;

    switch (rules.method) {
      case "higher":
        return valueA > valueB + (rules.threshold || 0);
      
      case "total":
        const totalA = cardA.top + cardA.bottom + cardA.left + cardA.right;
        const totalB = cardB.top + cardB.bottom + cardB.left + cardB.right;
        return totalA > totalB + (rules.threshold || 0);
      
      case "any":
        return valueA > valueB;
      
      default:
        return valueA > valueB;
    }
  },

  /**
   * Calculate score for a capture
   */
  calculateScore(captures: number, combos: number = 0): number {
    if (!this.isEnabled) return 0;

    const rules = this.rules.scoringRules as ScoringRules;
    if (!rules) return captures;

    const comboBonus = Math.min(combos, rules.maxCombo || 10) * (rules.comboBonus || 0);
    const baseScore = captures * (rules.basePoints || 1);
    const multiplier = rules.multiplier || 1;

    return Math.floor((baseScore + comboBonus) * multiplier);
  },

  /**
   * Evaluate AI decision (simple example)
   */
  evaluateAIMove(cards: Card[], boardState: any): Card | null {
    if (!this.isEnabled || cards.length === 0) return null;

    // Simple AI: play highest value card
    return cards.reduce((best, card) => {
      const bestValue = best.top + best.bottom + best.left + best.right;
      const cardValue = card.top + card.bottom + card.left + card.right;
      return cardValue > bestValue ? card : best;
    });
  },

  /**
   * Evaluate combo chain
   */
  evaluateCombo(cards: Card[]): number {
    if (!this.isEnabled || cards.length < 2) return 0;

    // Simple combo: consecutive cards with matching values
    let combo = 0;
    for (let i = 1; i < cards.length; i++) {
      const prev = cards[i - 1];
      const curr = cards[i];
      
      if (
        prev.top === curr.bottom ||
        prev.bottom === curr.top ||
        prev.left === curr.right ||
        prev.right === curr.left
      ) {
        combo++;
      }
    }

    return combo;
  },

  /**
   * Send capture result to Unity
   */
  sendCaptureResult(cardAId: string, cardBId: string, side: string, canCapture: boolean): void {
    UnityMessagingBus.send("captureResult", {
      cardA: cardAId,
      cardB: cardBId,
      side,
      canCapture,
      timestamp: Date.now()
    });
  },

  /**
   * Send score update to Unity
   */
  sendScoreUpdate(playerId: string, score: number): void {
    UnityMessagingBus.send("scoreUpdate", {
      playerId,
      score,
      timestamp: Date.now()
    });
  },

  /**
   * Send AI move to Unity
   */
  sendAIMove(cardId: string, position: { x: number; y: number }): void {
    UnityMessagingBus.send("aiMove", {
      cardId,
      position,
      timestamp: Date.now()
    });
  },

  /**
   * Enable/disable Shadow VM
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    UnityMessagingBus.send("shadowVMEnabled", {
      enabled,
      timestamp: Date.now()
    });
  }
};

/**
 * Auto-load rules from FS when ShadowVM is imported
 */
if (typeof window !== "undefined") {
  // Wait for FS to be ready, then load rules
  setTimeout(() => {
    ShadowVM.loadRulesFromFile();
  }, 1000);
}

