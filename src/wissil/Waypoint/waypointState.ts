/**
 * Waypoint State Management
 * Zustand store for documentation browser state
 */

import { create } from "zustand";

type WaypointState = {
  currentDoc: string;
  setCurrentDoc: (id: string) => void;
  query: string;
  setQuery: (s: string) => void;
};

export const useWaypointState = create<WaypointState>((set) => ({
  currentDoc: "intro/getting-started",
  setCurrentDoc: (id) => set({ currentDoc: id }),
  query: "",
  setQuery: (s) => set({ query: s })
}));

