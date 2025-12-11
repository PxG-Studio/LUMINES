/**
 * Deep Clone Generator
 * Creates a variant from any prefab
 */

import { useVariantRegistry } from "./VariantRegistry";
import { PrefabVariant } from "./PrefabVariantSchema";
import { PrefabData } from "../PrefabTypes";
import { usePrefabStore } from "../PrefabStore";

/**
 * Variant Creator
 * Creates new prefab variants from base prefabs
 */
export class VariantCreator {
  /**
   * Create a variant from a base prefab
   */
  static create(basePrefabId: string, variantName?: string): string {
    const basePrefab = usePrefabStore.getState().prefabs[basePrefabId];
    if (!basePrefab) {
      throw new Error(`Base prefab ${basePrefabId} not found`);
    }

    const id = `variant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Deep clone the prefab tree
    const clonedTree: PrefabData = JSON.parse(JSON.stringify(basePrefab));

    const variant: PrefabVariant = {
      id,
      name: variantName || `${basePrefab.name} Variant`,
      base: basePrefabId,
      tree: clonedTree,
      overrides: {},
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    useVariantRegistry.getState().register(variant);
    return id;
  }

  /**
   * Create a variant from another variant
   */
  static createFromVariant(baseVariantId: string, variantName?: string): string {
    const baseVariant = useVariantRegistry.getState().getVariant(baseVariantId);
    if (!baseVariant) {
      throw new Error(`Base variant ${baseVariantId} not found`);
    }

    const id = `variant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Deep clone the variant tree
    const clonedTree: PrefabData = JSON.parse(JSON.stringify(baseVariant.tree));

    const variant: PrefabVariant = {
      id,
      name: variantName || `${baseVariant.name} Variant`,
      base: baseVariantId,
      tree: clonedTree,
      overrides: {},
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    useVariantRegistry.getState().register(variant);
    return id;
  }

  /**
   * Create a variant with initial overrides
   */
  static createWithOverrides(
    basePrefabId: string,
    overrides: Record<string, any>,
    variantName?: string
  ): string {
    const variantId = this.create(basePrefabId, variantName);
    const variant = useVariantRegistry.getState().getVariant(variantId);

    if (variant) {
      useVariantRegistry.getState().update(variantId, {
        overrides: { ...variant.overrides, ...overrides }
      });
    }

    return variantId;
  }
}

