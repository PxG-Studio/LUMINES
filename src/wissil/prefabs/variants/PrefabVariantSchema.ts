/**
 * Prefab Variant Schema
 * Defines inheritance structure + override maps
 */

import { PrefabData } from "../PrefabTypes";

export interface PrefabVariant {
  id: string;
  name: string;
  base: string | null; // Parent prefab/variant ID
  tree: PrefabData; // Serialized prefab (same structure as PrefabData)
  overrides: PrefabOverride; // Only modified values
  createdAt: number;
  updatedAt: number;
}

export interface PrefabOverride {
  [path: string]: any; // e.g. "transform.pos.x" → 2.5, "components[0].json.someField" → value
}

export interface VariantChain {
  variants: PrefabVariant[];
  resolved: PrefabData;
  conflicts?: OverrideConflict[];
}

export interface OverrideConflict {
  path: string;
  values: Array<{ variantId: string; value: any }>;
  severity: "low" | "medium" | "high";
}

export interface OverrideDiff {
  path: string;
  original: any;
  modified: any;
  variantId?: string;
}

