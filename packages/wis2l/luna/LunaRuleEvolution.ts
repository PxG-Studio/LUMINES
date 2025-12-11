/**
 * Autonomous Rule Evolution Engine
 * LUNA monitors game behavior and adjusts rules pre-emptively
 * Evolves rules based on patterns and tendencies
 */

import { useLunaMemory } from "./LunaMemoryGraph";
import { LunaPatchGenerator } from "./LunaPatchGenerator";
import { useWissilFS } from "../runtime/fs/wissilFs";
import { useEditorState } from "@/state/editorState";

export interface EvolutionAction {
  type: string;
  description: string;
  confidence: number;
  change: any;
}

/**
 * Autonomous Rule Evolution Engine
 * Constantly mutates rules based on gameplay patterns
 */
export class LunaRuleEvolution {
  /**
   * Evolve rules based on memory patterns
   */
  static evolve(config?: any): EvolutionAction[] {
    const pushMessage = useEditorState.getState().pushMessage;
    const memory = useLunaMemory.getState();
    const actions: EvolutionAction[] = [];

    // Read config if not provided
    if (!config) {
      const fs = useWissilFS.getState();
      const configContent = fs.readFile("GameConfig/card_rules.json");
      if (configContent) {
        try {
          config = JSON.parse(configContent);
        } catch (err) {
          console.error("[LunaRuleEvolution] Error parsing config:", err);
          return actions;
        }
      } else {
        config = {
          captureRules: { threshold: 1 },
          balance: { factor: 1.0 }
        };
      }
    }

    // Pattern: Too many ties
    const tooManyTies = memory.getPattern("tooManyTies");
    if (tooManyTies && tooManyTies.value === true) {
      const currentThreshold = config.captureRules?.threshold || 1;
      const newThreshold = Math.max(0, currentThreshold - 1);

      actions.push({
        type: "adjust_threshold",
        description: `Lowering capture threshold from ${currentThreshold} to ${newThreshold} (too many ties)`,
        confidence: tooManyTies.confidence,
        change: {
          captureRules: {
            ...config.captureRules,
            threshold: newThreshold
          }
        }
      });

      LunaPatchGenerator.applyJSONPatch({
        file: "GameConfig/card_rules.json",
        change: {
          ...config,
          captureRules: {
            ...config.captureRules,
            threshold: newThreshold
          }
        },
        type: "threshold"
      });

      memory.updatePattern("tooManyTies", false);
      pushMessage(`[LUNA Autopilot] 🔄 Adjusted capture threshold: ${currentThreshold} → ${newThreshold}`);
    }

    // Pattern: Card overpowered
    const cardOverpower = memory.getPattern("cardOverpower");
    if (cardOverpower && cardOverpower.value === true) {
      const currentFactor = config.balance?.factor || 1.0;
      const newFactor = Math.max(0.1, currentFactor * 0.9);

      actions.push({
        type: "rebalance_factor",
        description: `Reducing balance factor from ${currentFactor} to ${newFactor} (cards too strong)`,
        confidence: cardOverpower.confidence,
        change: {
          balance: {
            ...config.balance,
            factor: newFactor
          }
        }
      });

      LunaPatchGenerator.applyJSONPatch({
        file: "GameConfig/card_rules.json",
        change: {
          ...config,
          balance: {
            ...config.balance,
            factor: newFactor
          }
        },
        type: "config"
      });

      memory.updatePattern("cardOverpower", false);
      pushMessage(`[LUNA Autopilot] ⚖️ Rebalanced factor: ${currentFactor.toFixed(2)} → ${newFactor.toFixed(2)}`);
    }

    // Pattern: Player advantage too high
    const playerAdvantage = memory.getTrend("playerAdvantage");
    if (playerAdvantage && playerAdvantage.trend === "increasing" && playerAdvantage.value > 0.7) {
      const currentMultiplier = config.scoreRules?.comboMultiplier || 1.0;
      const newMultiplier = Math.max(0.5, currentMultiplier * 0.95);

      actions.push({
        type: "adjust_combo_multiplier",
        description: `Reducing combo multiplier from ${currentMultiplier} to ${newMultiplier} (player advantage too high)`,
        confidence: 0.8,
        change: {
          scoreRules: {
            ...config.scoreRules,
            comboMultiplier: newMultiplier
          }
        }
      });

      LunaPatchGenerator.applyJSONPatch({
        file: "GameConfig/card_rules.json",
        change: {
          ...config,
          scoreRules: {
            ...config.scoreRules,
            comboMultiplier: newMultiplier
          }
        },
        type: "config"
      });

      pushMessage(`[LUNA Autopilot] 📊 Adjusted combo multiplier: ${currentMultiplier.toFixed(2)} → ${newMultiplier.toFixed(2)}`);
    }

    // Pattern: Too many captures
    const tooManyCaptures = memory.getPattern("tooManyCaptures");
    if (tooManyCaptures && tooManyCaptures.value === true) {
      const currentThreshold = config.captureRules?.threshold || 1;
      const newThreshold = currentThreshold + 1;

      actions.push({
        type: "increase_threshold",
        description: `Increasing capture threshold from ${currentThreshold} to ${newThreshold} (too many captures)`,
        confidence: tooManyCaptures.confidence,
        change: {
          captureRules: {
            ...config.captureRules,
            threshold: newThreshold
          }
        }
      });

      LunaPatchGenerator.applyJSONPatch({
        file: "GameConfig/card_rules.json",
        change: {
          ...config,
          captureRules: {
            ...config.captureRules,
            threshold: newThreshold
          }
        },
        type: "threshold"
      });

      memory.updatePattern("tooManyCaptures", false);
      pushMessage(`[LUNA Autopilot] 🎯 Increased capture threshold: ${currentThreshold} → ${newThreshold}`);
    }

    // Balance metrics
    const winRate = memory.balanceMetrics.winRate;
    if (winRate && winRate.deviation > 0.2) {
      // Win rate is too far from target (50%)
      const adjustment = winRate.value > winRate.target ? -0.05 : 0.05;
      const currentDifficulty = config.balance?.difficulty || 1.0;
      const newDifficulty = Math.max(0.5, Math.min(2.0, currentDifficulty + adjustment));

      actions.push({
        type: "adjust_difficulty",
        description: `Adjusting difficulty from ${currentDifficulty.toFixed(2)} to ${newDifficulty.toFixed(2)} (win rate: ${(winRate.value * 100).toFixed(1)}%)`,
        confidence: 0.75,
        change: {
          balance: {
            ...config.balance,
            difficulty: newDifficulty
          }
        }
      });

      LunaPatchGenerator.applyJSONPatch({
        file: "GameConfig/card_rules.json",
        change: {
          ...config,
          balance: {
            ...config.balance,
            difficulty: newDifficulty
          }
        },
        type: "config"
      });

      pushMessage(`[LUNA Autopilot] 🎚️ Adjusted difficulty: ${currentDifficulty.toFixed(2)} → ${newDifficulty.toFixed(2)}`);
    }

    return actions;
  }

  /**
   * Analyze gameplay patterns and update memory
   */
  static analyzePattern(event: any): void {
    const memory = useLunaMemory.getState();

    // Detect too many ties
    if (event.type === "event/capture" && event.result === false) {
      const tieCount = memory.getPattern("tieCount")?.value || 0;
      memory.updatePattern("tieCount", tieCount + 1, 0.5);

      if (tieCount > 5) {
        memory.updatePattern("tooManyTies", true, 0.8);
      }
    }

    // Detect overpowered cards
    if (event.type === "event/capture" && event.attackerValue > event.defenderValue * 2) {
      memory.updatePattern("cardOverpower", true, 0.7);
    }

    // Track captures
    if (event.type === "event/capture" && event.result === true) {
      const captureCount = memory.getPattern("captureCount")?.value || 0;
      memory.updatePattern("captureCount", captureCount + 1, 0.5);

      if (captureCount > 10) {
        memory.updatePattern("tooManyCaptures", true, 0.8);
      }
    }

    // Track player advantage
    if (event.type === "gameplay.score") {
      const currentAdvantage = memory.getTrend("playerAdvantage")?.value || 0.5;
      // Simplified: track score ratio
      memory.updateTendency("playerAdvantage", currentAdvantage, "stable");
    }
  }
}

