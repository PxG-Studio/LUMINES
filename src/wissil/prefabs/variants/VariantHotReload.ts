/**
 * Variant Apply/Revert System
 * Runtime patching for prefab variants
 */

import { UnityMessagingBus } from "../../runtime/unityBridge/UnityMessagingBus";
import { PrefabVariant } from "./PrefabVariantSchema";
import { OverrideDiffEngine } from "./OverrideDiffEngine";
import { PrefabVariantResolver } from "./PrefabVariantResolver";
import { useVariantRegistry } from "./VariantRegistry";
import { usePrefabStore } from "../PrefabStore";
import { useEditorState } from "@/state/editorState";

/**
 * Variant Hot Reload
 * Applies variant overrides to Unity runtime
 */
export class VariantHotReload {
  /**
   * Apply variant to runtime
   */
  static apply(variantId: string): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[VariantHotReload] Unity not connected");
      return;
    }

    const variant = useVariantRegistry.getState().getVariant(variantId);
    if (!variant) {
      console.warn(`[VariantHotReload] Variant ${variantId} not found`);
      return;
    }

    // Get chain and resolve
    const chain = useVariantRegistry.getState().getVariantChain(variantId);
    const resolved = PrefabVariantResolver.resolve(chain);

    // Get base resolved (for diff)
    let baseResolved;
    if (variant.base) {
      const baseChain = useVariantRegistry.getState().getVariantChain(variant.base);
      baseResolved = PrefabVariantResolver.resolve(baseChain);
    } else {
      // Base prefab
      const basePrefab = usePrefabStore.getState().prefabs[variant.base || ""];
      baseResolved = basePrefab || resolved;
    }

    // Compute overrides
    const overrides = OverrideDiffEngine.computeOverrides(baseResolved, resolved);
    const diffs = OverrideDiffEngine.overridesToDiffs(overrides, baseResolved);

    // Send to Unity
    UnityMessagingBus.send("prefab/variant/apply", {
      variantId,
      prefabId: chain.variants[0].id, // Base prefab ID
      overrides,
      diffs
    });

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Variant] Applied variant ${variant.name} with ${Object.keys(overrides).length} overrides`);
  }

  /**
   * Revert variant (clear overrides)
   */
  static revert(variantId: string): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[VariantHotReload] Unity not connected");
      return;
    }

    const variant = useVariantRegistry.getState().getVariant(variantId);
    if (!variant) {
      console.warn(`[VariantHotReload] Variant ${variantId} not found`);
      return;
    }

    // Clear overrides
    useVariantRegistry.getState().update(variantId, {
      overrides: {}
    });

    // Revert in Unity
    UnityMessagingBus.send("prefab/variant/revert", {
      variantId,
      prefabId: variant.base || variantId
    });

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Variant] Reverted variant ${variant.name}`);
  }

  /**
   * Apply specific override
   */
  static applyOverride(variantId: string, path: string, value: any): void {
    const variant = useVariantRegistry.getState().getVariant(variantId);
    if (!variant) return;

    // Update override
    const newOverrides = { ...variant.overrides, [path]: value };
    useVariantRegistry.getState().update(variantId, {
      overrides: newOverrides
    });

    // Apply immediately
    this.apply(variantId);
  }

  /**
   * Remove override (revert to base)
   */
  static removeOverride(variantId: string, path: string): void {
    const variant = useVariantRegistry.getState().getVariant(variantId);
    if (!variant) return;

    // Remove override
    const newOverrides = { ...variant.overrides };
    delete newOverrides[path];
    useVariantRegistry.getState().update(variantId, {
      overrides: newOverrides
    });

    // Apply changes
    this.apply(variantId);
  }
}

