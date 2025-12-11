/**
 * Transform Store
 * Zustand database for Unity object transforms
 * Stores position, rotation, scale for selected objects
 */

import { create } from "zustand";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";

export interface TransformSnapshot {
  id: string;
  pos: { x: number; y: number; z: number };
  rot: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

interface TransformStoreState {
  selected: string | null;
  transforms: Record<string, TransformSnapshot>;
  gizmoMode: "move" | "rotate" | "scale";

  // Actions
  select: (id: string | null) => void;
  update: (snapshot: TransformSnapshot) => void;
  setGizmoMode: (mode: "move" | "rotate" | "scale") => void;
  clear: () => void;
  getTransform: (id: string) => TransformSnapshot | undefined;
}

/**
 * Transform Store
 * Global state for object transforms
 */
export const useTransformStore = create<TransformStoreState>((set, get) => ({
  selected: null,
  transforms: {},
  gizmoMode: "move",

  select: (id: string | null) => {
    set({ selected: id });

    // Request transform snapshot when selecting
    if (id) {
      if (UnityMessagingBus.isConnected()) {
        UnityMessagingBus.send("scene/requestTransform", { id });
      }
    }
  },

  update: (snapshot: TransformSnapshot) => {
    set((state) => ({
      transforms: {
        ...state.transforms,
        [snapshot.id]: snapshot
      }
    }));
  },

  setGizmoMode: (mode: "move" | "rotate" | "scale") => {
    set({ gizmoMode: mode });
  },

  clear: () => {
    set({
      selected: null,
      transforms: {},
      gizmoMode: "move"
    });
  },

  getTransform: (id: string) => {
    return get().transforms[id];
  }
}));

/**
 * Initialize Transform Sync
 * Listens for Unity transform updates
 */
export function initializeTransformSync(): () => void {
  // Listen for Unity transform snapshots
  UnityMessagingBus.on("scene/transform", (payload: any) => {
    try {
      const snapshot: TransformSnapshot = {
        id: String(payload.id || payload.objectId),
        pos: {
          x: payload.pos?.x || payload.position?.x || 0,
          y: payload.pos?.y || payload.position?.y || 0,
          z: payload.pos?.z || payload.position?.z || 0
        },
        rot: {
          x: payload.rot?.x || payload.rotation?.x || 0,
          y: payload.rot?.y || payload.rotation?.y || 0,
          z: payload.rot?.z || payload.rotation?.z || 0
        },
        scale: {
          x: payload.scale?.x || payload.localScale?.x || 1,
          y: payload.scale?.y || payload.localScale?.y || 1,
          z: payload.scale?.z || payload.localScale?.z || 1
        }
      };

      useTransformStore.getState().update(snapshot);
    } catch (err: any) {
      console.error("[TransformSync] Error processing transform snapshot:", err);
    }
  });

  // Listen for pick events
  UnityMessagingBus.on("scene/pick", (payload: any) => {
    const objectId = String(payload.id || payload.objectId || payload);
    useTransformStore.getState().select(objectId);
  });

  return () => {};
}

