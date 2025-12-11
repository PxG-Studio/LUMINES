/**
 * Variant Registry Store
 * Zustand database for prefab variants
 */

import { create } from "zustand";
import { PrefabVariant, VariantChain, OverrideConflict } from "./PrefabVariantSchema";
import { UnityMessagingBus } from "../../runtime/unityBridge/UnityMessagingBus";

interface VariantRegistryState {
  variants: Record<string, PrefabVariant>;
  selected: string | null;

  // Actions
  register: (variant: PrefabVariant) => void;
  update: (id: string, updates: Partial<PrefabVariant>) => void;
  select: (id: string | null) => void;
  getVariant: (id: string) => PrefabVariant | undefined;
  getVariantChain: (id: string) => VariantChain;
  delete: (id: string) => void;
  clear: () => void;
}

/**
 * Variant Registry Store
 * Global state for prefab variants
 */
export const useVariantRegistry = create<VariantRegistryState>((set, get) => ({
  variants: {},
  selected: null,

  register: (variant: PrefabVariant) => {
    set((state) => ({
      variants: {
        ...state.variants,
        [variant.id]: {
          ...variant,
          updatedAt: Date.now()
        }
      }
    }));
  },

  update: (id: string, updates: Partial<PrefabVariant>) => {
    set((state) => {
      const variant = state.variants[id];
      if (!variant) return state;

      return {
        variants: {
          ...state.variants,
          [id]: {
            ...variant,
            ...updates,
            updatedAt: Date.now()
          }
        }
      };
    });
  },

  select: (id: string | null) => {
    set({ selected: id });
  },

  getVariant: (id: string) => {
    return get().variants[id];
  },

  getVariantChain: (id: string): VariantChain => {
    const variants: PrefabVariant[] = [];
    const visited = new Set<string>();
    let current: PrefabVariant | undefined = get().variants[id];

    // Build chain (base to variant)
    while (current && !visited.has(current.id)) {
      visited.add(current.id);
      variants.unshift(current); // Add to beginning
      current = current.base ? get().variants[current.base] : undefined;
    }

    return {
      variants,
      resolved: {} as any, // Will be resolved by PrefabVariantResolver
      conflicts: []
    };
  },

  delete: (id: string) => {
    set((state) => {
      const variants = { ...state.variants };
      delete variants[id];
      return { variants };
    });
  },

  clear: () => {
    set({
      variants: {},
      selected: null
    });
  }
}));

/**
 * Initialize Variant Sync
 * Listens for Unity variant updates
 */
export function initializeVariantSync(): () => void {
  // Listen for Unity variant snapshots
  UnityMessagingBus.on("prefab/variant/snapshot", (payload: any) => {
    try {
      const variant: PrefabVariant = {
        id: payload.id || payload.variantId,
        name: payload.name || "Unnamed Variant",
        base: payload.base || null,
        tree: payload.tree || payload.prefabData,
        overrides: payload.overrides || {},
        createdAt: payload.createdAt || Date.now(),
        updatedAt: payload.updatedAt || Date.now()
      };

      useVariantRegistry.getState().register(variant);
    } catch (err: any) {
      console.error("[VariantSync] Error processing variant snapshot:", err);
    }
  });

  return () => {};
}

