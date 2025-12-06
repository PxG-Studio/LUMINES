/**
 * LUNA Variant Assistant
 * AI automatically resolves variant conflicts
 */

import { PrefabVariant, VariantChain, OverrideConflict } from "../prefabs/variants/PrefabVariantSchema";
import { OverrideDiffEngine } from "../prefabs/variants/OverrideDiffEngine";
import { useVariantRegistry } from "../prefabs/variants/VariantRegistry";
import { VariantHotReload } from "../prefabs/variants/VariantHotReload";
import { useEditorState } from "@/state/editorState";

export interface VariantIssue {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  suggestion: string;
  fix?: () => void;
}

/**
 * LUNA Variant Assistant
 * Analyzes variant chains and provides suggestions
 */
export class LunaVariantAssistant {
  /**
   * Detect conflicts and issues in variant chain
   */
  static detectConflicts(chain: VariantChain): VariantIssue[] {
    const issues: VariantIssue[] = [];

    // Check for too many overrides
    for (const variant of chain.variants) {
      const overrideCount = Object.keys(variant.overrides || {}).length;
      if (overrideCount > 50) {
        issues.push({
          type: "too_many_overrides",
          severity: "medium",
          description: `Variant ${variant.name} has ${overrideCount} overrides`,
          suggestion: "Consider refactoring into smaller variants or creating a new base prefab",
          fix: undefined
        });
      }
    }

    // Check for conflicting overrides in chain
    for (let i = 1; i < chain.variants.length; i++) {
      const prev = chain.variants[i - 1];
      const current = chain.variants[i];

      const conflicts = OverrideDiffEngine.detectConflicts(
        prev.overrides || {},
        current.overrides || {}
      );

      if (conflicts.length > 0) {
        issues.push({
          type: "override_conflicts",
          severity: "high",
          description: `${conflicts.length} conflicting override(s) detected`,
          suggestion: "Resolve conflicts manually or use auto-resolve",
          fix: () => {
            // Auto-resolve by keeping later variant's values (already the case)
            console.log("[LUNA] Conflicts resolved - later variant values kept");
          }
        });
      }
    }

    // Check for circular dependencies
    const visited = new Set<string>();
    for (const variant of chain.variants) {
      if (visited.has(variant.id)) {
        issues.push({
          type: "circular_dependency",
          severity: "high",
          description: `Circular dependency detected in variant chain`,
          suggestion: "Break circular reference",
          fix: undefined
        });
        break;
      }
      visited.add(variant.id);
    }

    // Check for deep inheritance chains (may cause performance issues)
    if (chain.variants.length > 5) {
      issues.push({
        type: "deep_inheritance",
        severity: "low",
        description: `Deep inheritance chain (${chain.variants.length} levels)`,
        suggestion: "Consider flattening the inheritance structure",
        fix: undefined
      });
    }

    // Check for null overrides (removals)
    for (const variant of chain.variants) {
      const nullOverrides = Object.entries(variant.overrides || {}).filter(([, v]) => v === null);
      if (nullOverrides.length > 0) {
        issues.push({
          type: "null_overrides",
          severity: "low",
          description: `${nullOverrides.length} property removal(s) in ${variant.name}`,
          suggestion: "Consider if removals are intentional",
          fix: () => {
            // Clean up null overrides
            const cleaned = { ...variant.overrides };
            for (const [path] of nullOverrides) {
              delete cleaned[path];
            }
            useVariantRegistry.getState().update(variant.id, { overrides: cleaned });
          }
        });
      }
    }

    return issues;
  }

  /**
   * Auto-resolve variant conflicts
   */
  static resolveAutomatically(variantId: string): void {
    const variant = useVariantRegistry.getState().getVariant(variantId);
    if (!variant) return;

    const pushMessage = useEditorState.getState().pushMessage;

    // Remove null overrides
    const cleaned: Record<string, any> = {};
    for (const [path, value] of Object.entries(variant.overrides || {})) {
      if (value !== null) {
        cleaned[path] = value;
      }
    }

    if (Object.keys(cleaned).length !== Object.keys(variant.overrides || {}).length) {
      useVariantRegistry.getState().update(variantId, { overrides: cleaned });
      pushMessage(`[LUNA Variant] Cleaned ${Object.keys(variant.overrides || {}).length - Object.keys(cleaned).length} null overrides`);
    }

    // Auto-apply if Unity connected
    VariantHotReload.apply(variantId);
  }

  /**
   * Suggest variant structure improvements
   */
  static suggestImprovements(chain: VariantChain): string[] {
    const suggestions: string[] = [];

    // Suggest shared base for common variants
    if (chain.variants.length > 3) {
      suggestions.push("Consider creating a shared base variant for common properties");
    }

    // Suggest splitting large variants
    for (const variant of chain.variants) {
      if (Object.keys(variant.overrides || {}).length > 30) {
        suggestions.push(`Variant "${variant.name}" could be split into smaller variants`);
      }
    }

    return suggestions;
  }
}

