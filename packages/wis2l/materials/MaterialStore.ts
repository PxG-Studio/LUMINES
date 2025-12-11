/**
 * Material Store
 * Zustand database for Unity material/shader snapshots
 * Stores material properties and shader parameters
 */

import { create } from "zustand";

export interface MaterialParam {
  name: string;
  type: "Float" | "Range" | "Color" | "Vector" | "TexEnv" | "Int";
  value: any;
}

export interface MaterialSnapshot {
  objectId: string;
  materialName: string;
  shaderName: string;
  parameters: MaterialParam[];
  timestamp?: number;
}

interface MaterialStoreState {
  materials: Record<string, MaterialSnapshot>;
  selectedId: string | null;

  // Actions
  setSnapshot: (snapshot: MaterialSnapshot) => void;
  updateParameter: (objectId: string, paramName: string, value: any) => void;
  select: (objectId: string | null) => void;
  clear: () => void;
  getMaterial: (objectId: string) => MaterialSnapshot | undefined;
}

/**
 * Material Store
 * Global state for Unity materials
 */
export const useMaterialStore = create<MaterialStoreState>((set, get) => ({
  materials: {},
  selectedId: null,

  setSnapshot: (snapshot: MaterialSnapshot) => {
    set((state) => {
      const existing = state.materials[snapshot.objectId];
      const updated: MaterialSnapshot = {
        ...snapshot,
        timestamp: Date.now()
      };

      // Preserve existing parameter values if material already exists
      if (existing) {
        updated.parameters = snapshot.parameters.map((newParam) => {
          const existingParam = existing.parameters.find(
            (p) => p.name === newParam.name
          );
          // Preserve existing value if parameter hasn't changed type
          if (
            existingParam &&
            existingParam.type === newParam.type &&
            existingParam.value !== undefined
          ) {
            return { ...newParam, value: existingParam.value };
          }
          return newParam;
        });
      }

      return {
        materials: {
          ...state.materials,
          [snapshot.objectId]: updated
        }
      };
    });
  },

  updateParameter: (objectId: string, paramName: string, value: any) => {
    set((state) => {
      const material = state.materials[objectId];
      if (!material) return state;

      const updatedParameters = material.parameters.map((param) =>
        param.name === paramName ? { ...param, value } : param
      );

      return {
        materials: {
          ...state.materials,
          [objectId]: {
            ...material,
            parameters: updatedParameters,
            timestamp: Date.now()
          }
        }
      };
    });
  },

  select: (objectId: string | null) => {
    set({ selectedId: objectId });
  },

  clear: () => {
    set({
      materials: {},
      selectedId: null
    });
  },

  getMaterial: (objectId: string) => {
    return get().materials[objectId];
  }
}));

