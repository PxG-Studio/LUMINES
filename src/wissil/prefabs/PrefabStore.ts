/**
 * Prefab Store
 * Zustand database for Unity prefab metadata
 */

import { create } from "zustand";
import { PrefabData } from "./PrefabTypes";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useWissilFS } from "../runtime/fs/wissilFs";

interface PrefabStoreState {
  prefabs: Record<string, PrefabData>;
  selected: string | null;
  overrides: Record<string, PrefabData>; // Modified versions

  // Actions
  register: (id: string, data: PrefabData) => void;
  select: (id: string | null) => void;
  update: (id: string, updates: Partial<PrefabData>) => void;
  markOverride: (id: string, overridden: PrefabData) => void;
  clearOverrides: (id: string) => void;
  clear: () => void;
  getPrefab: (id: string) => PrefabData | undefined;
}

/**
 * Prefab Store
 * Global state for prefab metadata
 */
export const usePrefabStore = create<PrefabStoreState>((set, get) => ({
  prefabs: {},
  selected: null,
  overrides: {},

  register: (id: string, data: PrefabData) => {
    set((state) => ({
      prefabs: {
        ...state.prefabs,
        [id]: data
      }
    }));
  },

  select: (id: string | null) => {
    set({ selected: id });

    // Request prefab snapshot when selecting
    if (id && UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("prefab/request", { id });
    }
  },

  update: (id: string, updates: Partial<PrefabData>) => {
    set((state) => {
      const existing = state.prefabs[id];
      if (!existing) return state;

      const updated = {
        ...existing,
        ...updates
      };

      return {
        prefabs: {
          ...state.prefabs,
          [id]: updated
        }
      };
    });
  },

  markOverride: (id: string, overridden: PrefabData) => {
    set((state) => ({
      overrides: {
        ...state.overrides,
        [id]: overridden
      }
    }));
  },

  clearOverrides: (id: string) => {
    set((state) => {
      const overrides = { ...state.overrides };
      delete overrides[id];
      return { overrides };
    });
  },

  clear: () => {
    set({
      prefabs: {},
      selected: null,
      overrides: {}
    });
  },

  getPrefab: (id: string) => {
    return get().prefabs[id];
  }
}));

/**
 * Initialize Prefab Sync
 * Listens for Unity prefab snapshots
 */
export function initializePrefabSync(): () => void {
  // Listen for Unity prefab snapshots
  UnityMessagingBus.on("prefab/snapshot", (payload: any) => {
    try {
      const prefabData: PrefabData = {
        id: String(payload.id),
        name: payload.name || "Unnamed Prefab",
        transform: {
          pos: {
            x: payload.transform?.pos?.x || payload.transform?.position?.x || 0,
            y: payload.transform?.pos?.y || payload.transform?.position?.y || 0,
            z: payload.transform?.pos?.z || payload.transform?.position?.z || 0
          },
          rot: {
            x: payload.transform?.rot?.x || payload.transform?.rotation?.x || 0,
            y: payload.transform?.rot?.y || payload.transform?.rotation?.y || 0,
            z: payload.transform?.rot?.z || payload.transform?.rotation?.z || 0
          },
          scale: {
            x: payload.transform?.scale?.x || payload.transform?.localScale?.x || 1,
            y: payload.transform?.scale?.y || payload.transform?.localScale?.y || 1,
            z: payload.transform?.scale?.z || payload.transform?.localScale?.z || 1
          }
        },
        components: payload.components || [],
        children: payload.children || [],
        prefabPath: payload.prefabPath,
        guid: payload.guid
      };

      usePrefabStore.getState().register(prefabData.id, prefabData);
    } catch (err: any) {
      console.error("[PrefabSync] Error processing prefab snapshot:", err);
    }
  });

  return () => {};
}

