/**
 * UI State Management
 * Zustand store for general UI state
 */

import { create } from 'zustand';

export interface UIState {
  sidebarOpen: boolean;
  sidebarWidth: number;
  panelOpen: boolean;
  panelHeight: number;
  theme: 'dark' | 'light';
  
  // Actions
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  togglePanel: () => void;
  setPanelHeight: (height: number) => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIState = create<UIState>((set) => ({
  sidebarOpen: true,
  sidebarWidth: 250,
  panelOpen: true,
  panelHeight: 200,
  theme: 'dark',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  
  togglePanel: () => set((state) => ({ panelOpen: !state.panelOpen })),
  
  setPanelHeight: (height) => set({ panelHeight: height }),
  
  setTheme: (theme) => set({ theme }),
}));

