/**
 * Material Preview Store
 * Stores material preview thumbnails (Unity camera → texture → base64)
 */

import { create } from "zustand";

interface MaterialPreviewState {
  previews: Record<string, string>; // objectId -> base64 image
  setPreview: (objectId: string, base64: string) => void;
  getPreview: (objectId: string) => string | null;
  clear: () => void;
}

/**
 * Material Preview Store
 * Stores material preview thumbnails
 */
export const useMaterialPreview = create<MaterialPreviewState>((set, get) => ({
  previews: {},

  setPreview: (objectId: string, base64: string) => {
    set((state) => ({
      previews: {
        ...state.previews,
        [objectId]: base64
      }
    }));
  },

  getPreview: (objectId: string) => {
    return get().previews[objectId] || null;
  },

  clear: () => {
    set({ previews: {} });
  }
}));

