/**
 * Runtime State Management
 * Zustand store for Ignition runtime state
 */

import { create } from 'zustand';

export interface RuntimeError {
  message: string;
  filename?: string;
  line?: number;
  column?: number;
  stack?: string;
}

export interface RuntimeState {
  isRunning: boolean;
  isCompiling: boolean;
  errors: RuntimeError[];
  warnings: string[];
  buildOutput: string;
  lastBuildTime: number | null;
  
  // Actions
  start: () => void;
  stop: () => void;
  setCompiling: (isCompiling: boolean) => void;
  addError: (error: RuntimeError) => void;
  clearErrors: () => void;
  addWarning: (warning: string) => void;
  clearWarnings: () => void;
  setBuildOutput: (output: string) => void;
  setLastBuildTime: (time: number) => void;
}

export const useRuntimeState = create<RuntimeState>((set) => ({
  isRunning: false,
  isCompiling: false,
  errors: [],
  warnings: [],
  buildOutput: '',
  lastBuildTime: null,

  start: () => set({ isRunning: true }),
  
  stop: () => set({ isRunning: false }),
  
  setCompiling: (isCompiling) => set({ isCompiling }),
  
  addError: (error) =>
    set((state) => ({
      errors: [...state.errors, error],
    })),
  
  clearErrors: () => set({ errors: [] }),
  
  addWarning: (warning) =>
    set((state) => ({
      warnings: [...state.warnings, warning],
    })),
  
  clearWarnings: () => set({ warnings: [] }),
  
  setBuildOutput: (output) => set({ buildOutput: output }),
  
  setLastBuildTime: (time) => set({ lastBuildTime: time }),
}));

