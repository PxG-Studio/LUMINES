/**
 * LUNA Balance Fixer
 * Auto-patching of game rules based on balance analysis
 * Connects to Phase L/M (Rule Evolution Engine)
 */

import { BalanceIssue } from "./LunaBalanceAnalyzer";
import { LunaPatchGenerator } from "./LunaPatchGenerator";
import { useWissilFS } from "../runtime/fs/wissilFs";
import { useEditorState } from "@/state/editorState";

/**
 * LUNA Balance Fixer
 * Automatically fixes balance issues by patching game rules
 */
export class LunaBalanceFixer {
  /**
   * Fix balance issues
   */
  static fix(issues: BalanceIssue[], config?: any): void {
    const pushMessage = useEditorState.getState().pushMessage;
    const fs = useWissilFS.getState();

    let configData = config;
    if (!configData) {
      try {
        const configContent = fs.readFile("GameConfig/card_rules.json");
        if (configContent) {
          configData = JSON.parse(configContent);
        }
      } catch (error) {
        pushMessage("[LUNA Balance Fixer] Could not load game config");
        return;
      }
    }

    for (const issue of issues) {
      if (issue.severity === "low") continue; // Skip low severity issues

      switch (issue.type) {
        case "major_imbalance":
        case "extreme_win_rate":
          this.fixImbalance(issue, configData, pushMessage);
          break;

        case "high_tie_rate":
          this.fixTieRate(issue, configData, pushMessage);
          break;

        case "short_matches":
          this.fixShortMatches(issue, configData, pushMessage);
          break;

        case "long_matches":
          this.fixLongMatches(issue, configData, pushMessage);
          break;
      }
    }
  }

  /**
   * Fix imbalance between players
   */
  private static fixImbalance(
    issue: BalanceIssue,
    config: any,
    pushMessage: (msg: string) => void
  ): void {
    // Adjust capture threshold to make captures easier/harder
    if (config.captureRules?.threshold !== undefined) {
      const newThreshold = Math.max(0, config.captureRules.threshold - 1);
      LunaPatchGenerator.applyJSONPatch("GameConfig/card_rules.json", {
        captureRules: { threshold: newThreshold }
      });
      pushMessage(
        `[LUNA Balance Fixer] ⚖️ Adjusted capture threshold to ${newThreshold}`
      );
    }

    // Adjust balance factor
    if (config.balance?.factor !== undefined) {
      const newFactor = config.balance.factor * 0.9;
      LunaPatchGenerator.applyJSONPatch("GameConfig/card_rules.json", {
        balance: { factor: newFactor }
      });
      pushMessage(`[LUNA Balance Fixer] ⚖️ Adjusted balance factor to ${newFactor.toFixed(2)}`);
    }
  }

  /**
   * Fix high tie rate
   */
  private static fixTieRate(
    issue: BalanceIssue,
    config: any,
    pushMessage: (msg: string) => void
  ): void {
    // Reduce capture threshold to make captures more likely
    if (config.captureRules?.threshold !== undefined) {
      const newThreshold = Math.max(0, config.captureRules.threshold - 1);
      LunaPatchGenerator.applyJSONPatch("GameConfig/card_rules.json", {
        captureRules: { threshold: newThreshold }
      });
      pushMessage(
        `[LUNA Balance Fixer] 🎯 Reduced capture threshold to ${newThreshold} to reduce ties`
      );
    }
  }

  /**
   * Fix short matches
   */
  private static fixShortMatches(
    issue: BalanceIssue,
    config: any,
    pushMessage: (msg: string) => void
  ): void {
    // Increase capture threshold to make matches last longer
    if (config.captureRules?.threshold !== undefined) {
      const newThreshold = (config.captureRules.threshold || 0) + 1;
      LunaPatchGenerator.applyJSONPatch("GameConfig/card_rules.json", {
        captureRules: { threshold: newThreshold }
      });
      pushMessage(
        `[LUNA Balance Fixer] ⏱️ Increased capture threshold to ${newThreshold} to extend matches`
      );
    }
  }

  /**
   * Fix long matches
   */
  private static fixLongMatches(
    issue: BalanceIssue,
    config: any,
    pushMessage: (msg: string) => void
  ): void {
    // Decrease capture threshold to make matches faster
    if (config.captureRules?.threshold !== undefined) {
      const newThreshold = Math.max(0, (config.captureRules.threshold || 0) - 1);
      LunaPatchGenerator.applyJSONPatch("GameConfig/card_rules.json", {
        captureRules: { threshold: newThreshold }
      });
      pushMessage(
        `[LUNA Balance Fixer] ⏱️ Decreased capture threshold to ${newThreshold} to speed up matches`
      );
    }
  }
}

