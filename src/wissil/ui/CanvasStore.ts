/**
 * Canvas Store
 * Zustand database for Unity UI Canvas state
 */

import { create } from "zustand";
import { RectSnapshot, LayoutConfig, UIStyle, PreviewResolution } from "./UITypes";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";

interface CanvasStoreState {
  rects: Record<string, RectSnapshot>;
  selected: string | null;
  previewResolution: PreviewResolution | null;
  layoutConfigs: Record<string, LayoutConfig>;
  styles: Record<string, UIStyle>;

  // Actions
  registerRects: (rects: RectSnapshot[]) => void;
  updateRect: (id: string, updates: Partial<RectSnapshot>) => void;
  select: (id: string | null) => void;
  setPreviewResolution: (resolution: PreviewResolution) => void;
  setLayoutConfig: (id: string, config: LayoutConfig) => void;
  setStyle: (id: string, style: UIStyle) => void;
  getRect: (id: string) => RectSnapshot | undefined;
  clear: () => void;
}

/**
 * Canvas Store
 * Global state for Unity UI Canvas
 */
export const useCanvasStore = create<CanvasStoreState>((set, get) => ({
  rects: {},
  selected: null,
  previewResolution: null,
  layoutConfigs: {},
  styles: {},

  registerRects: (rectList: RectSnapshot[]) => {
    set((state) => {
      const rects: Record<string, RectSnapshot> = {};
      rectList.forEach((rect) => {
        rects[rect.id] = {
          ...state.rects[rect.id], // Preserve existing state
          ...rect
        };
      });
      return { rects };
    });
  },

  updateRect: (id: string, updates: Partial<RectSnapshot>) => {
    set((state) => {
      const rect = state.rects[id];
      if (!rect) return state;

      return {
        rects: {
          ...state.rects,
          [id]: {
            ...rect,
            ...updates
          }
        }
      };
    });
  },

  select: (id: string | null) => {
    set({ selected: id });
  },

  setPreviewResolution: (resolution: PreviewResolution) => {
    set({ previewResolution: resolution });
  },

  setLayoutConfig: (id: string, config: LayoutConfig) => {
    set((state) => ({
      layoutConfigs: {
        ...state.layoutConfigs,
        [id]: config
      }
    }));
  },

  setStyle: (id: string, style: UIStyle) => {
    set((state) => ({
      styles: {
        ...state.styles,
        [id]: style
      }
    }));
  },

  getRect: (id: string) => {
    return get().rects[id];
  },

  clear: () => {
    set({
      rects: {},
      selected: null,
      previewResolution: null,
      layoutConfigs: {},
      styles: {}
    });
  }
}));

/**
 * Initialize UI Canvas Sync
 * Listens for Unity UI updates
 */
export function initializeUICanvasSync(): () => void {
  // Listen for Unity UI rect snapshots
  UnityMessagingBus.on("ui/rectsnapshot", (payload: any) => {
    try {
      const rectList = Array.isArray(payload) ? payload : payload.rects || [];
      const rects: RectSnapshot[] = rectList.map((r: any) => ({
        id: String(r.id || r.rectId),
        name: r.name || "Unnamed",
        position: r.position || { x: 0, y: 0 },
        size: r.size || { x: 100, y: 100 },
        anchorMin: r.anchorMin || { x: 0, y: 0 },
        anchorMax: r.anchorMax || { x: 1, y: 1 },
        pivot: r.pivot || { x: 0.5, y: 0.5 },
        parent: r.parent || undefined,
        children: r.children || []
      }));

      useCanvasStore.getState().registerRects(rects);
    } catch (err: any) {
      console.error("[UICanvasSync] Error processing rect snapshot:", err);
    }
  });

  return () => {};
}

