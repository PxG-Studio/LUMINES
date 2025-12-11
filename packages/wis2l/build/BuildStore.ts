/**
 * Build Store
 * Zustand database for build state
 */

import { create } from "zustand";
import { BuildResult, BuildLog, ReleaseInfo } from "./BuildTypes";

interface BuildStoreState {
  lastBuild: BuildResult | null;
  buildError: string | null;
  isBuilding: boolean;
  buildProgress: number;
  buildMessage: string;
  logs: BuildLog[];
  releases: ReleaseInfo[];

  // Actions
  setLastBuild: (build: BuildResult) => void;
  setBuildError: (error: string | null) => void;
  setIsBuilding: (isBuilding: boolean) => void;
  setBuildProgress: (progress: number, message: string) => void;
  addLog: (log: BuildLog) => void;
  clearLogs: () => void;
  addRelease: (release: ReleaseInfo) => void;
  clear: () => void;
}

/**
 * Build Store
 * Global state for build system
 */
export const useBuildStore = create<BuildStoreState>((set) => ({
  lastBuild: null,
  buildError: null,
  isBuilding: false,
  buildProgress: 0,
  buildMessage: "",
  logs: [],
  releases: [],

  setLastBuild: (build: BuildResult) => {
    set({ lastBuild: build, buildError: null });
  },

  setBuildError: (error: string | null) => {
    set({ buildError: error, isBuilding: false });
  },

  setIsBuilding: (isBuilding: boolean) => {
    set({ isBuilding });
  },

  setBuildProgress: (progress: number, message: string) => {
    set({ buildProgress: progress, buildMessage: message });
  },

  addLog: (log: BuildLog) => {
    set((state) => ({
      logs: [...state.logs, log].slice(-1000) // Keep last 1000 logs
    }));
  },

  clearLogs: () => {
    set({ logs: [] });
  },

  addRelease: (release: ReleaseInfo) => {
    set((state) => ({
      releases: [release, ...state.releases].slice(0, 50) // Keep last 50 releases
    }));
  },

  clear: () => {
    set({
      lastBuild: null,
      buildError: null,
      isBuilding: false,
      buildProgress: 0,
      buildMessage: "",
      logs: []
    });
  }
}));

