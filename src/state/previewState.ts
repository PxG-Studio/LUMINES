/**
 * Preview State Management
 * Zustand store for Ignis preview state
 */

import { create } from 'zustand';

export interface PreviewState {
  isVisible: boolean;
  isLoading: boolean;
  unityLoaded: boolean;
  canvasSize: { width: number; height: number };
  fullscreen: boolean;
  
  // Actions
  show: () => void;
  hide: () => void;
  setLoading: (isLoading: boolean) => void;
  setUnityLoaded: (loaded: boolean) => void;
  setCanvasSize: (size: { width: number; height: number }) => void;
  toggleFullscreen: () => void;
}

export const usePreviewState = create<PreviewState>((set) => ({
  isVisible: true,
  isLoading: false,
  unityLoaded: false,
  canvasSize: { width: 1280, height: 720 },
  fullscreen: false,

  show: () => set({ isVisible: true }),
  
  hide: () => set({ isVisible: false }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setUnityLoaded: (unityLoaded) => set({ unityLoaded }),
  
  setCanvasSize: (canvasSize) => set({ canvasSize }),
  
  toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
}));

