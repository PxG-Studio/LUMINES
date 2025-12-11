/**
 * Runtime Event Stream
 * StackBlitz-style event stream for Unity runtime events
 * Captures logs, errors, warnings, and gameplay events
 */

import { create } from "zustand";
import { UnityMessagingBus } from "./UnityMessagingBus";
import { useEditorState } from "@/state/editorState";

export type UnityEventType = "log" | "error" | "warning" | "event" | "debug";

export interface UnityEvent {
  id: string;
  type: UnityEventType;
  message: string;
  timestamp: number;
  data?: any;
  stack?: string;
  source?: string;
  file?: string;
  line?: number;
}

interface UnityEventsState {
  events: UnityEvent[];
  maxEvents: number;
  addEvent: (event: Omit<UnityEvent, "id" | "timestamp">) => void;
  clearEvents: () => void;
  setMaxEvents: (max: number) => void;
  getEventsByType: (type: UnityEventType) => UnityEvent[];
  getRecentEvents: (count: number) => UnityEvent[];
}

/**
 * Zustand store for Unity runtime events
 * Similar to StackBlitz's VM event stream
 */
export const useUnityEvents = create<UnityEventsState>((set, get) => ({
  events: [],
  maxEvents: 1000,

  addEvent: (event) => {
    const newEvent: UnityEvent = {
      ...event,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    set((state) => {
      const events = [...state.events, newEvent];
      
      // Trim to maxEvents if needed
      const trimmedEvents = events.length > state.maxEvents
        ? events.slice(-state.maxEvents)
        : events;

      // Also forward to editor state for console/logs panel
      const editorState = useEditorState.getState();
      if (newEvent.type === "log") {
        editorState.pushMessage(`[Unity] ${newEvent.message}`);
      } else if (newEvent.type === "error") {
        editorState.setRuntimeError(newEvent.message);
        editorState.pushMessage(`❌ [Unity] ${newEvent.message}`);
      } else if (newEvent.type === "warning") {
        editorState.pushMessage(`⚠️ [Unity] ${newEvent.message}`);
      }

      return { events: trimmedEvents };
    });
  },

  clearEvents: () => set({ events: [] }),

  setMaxEvents: (max: number) => set({ maxEvents: max }),

  getEventsByType: (type: UnityEventType) => {
    return get().events.filter((e) => e.type === type);
  },

  getRecentEvents: (count: number) => {
    const events = get().events;
    return events.slice(-count);
  }
}));

/**
 * Set up Unity event listeners
 * Called when Unity instance is ready
 */
export function setupUnityEventListeners(): void {
  // Log events
  UnityMessagingBus.on("log", (payload) => {
    useUnityEvents.getState().addEvent({
      type: "log",
      message: payload.message || String(payload),
      data: payload,
      source: payload.source,
      file: payload.file,
      line: payload.line
    });
  });

  // Error events
  UnityMessagingBus.on("error", (payload) => {
    useUnityEvents.getState().addEvent({
      type: "error",
      message: payload.message || String(payload),
      data: payload,
      stack: payload.stack,
      source: payload.source,
      file: payload.file,
      line: payload.line
    });
  });

  // Warning events
  UnityMessagingBus.on("warning", (payload) => {
    useUnityEvents.getState().addEvent({
      type: "warning",
      message: payload.message || String(payload),
      data: payload,
      source: payload.source,
      file: payload.file,
      line: payload.line
    });
  });

  // Gameplay events (card selected, tile hovered, etc.)
  UnityMessagingBus.on("event", (payload) => {
    useUnityEvents.getState().addEvent({
      type: "event",
      message: payload.event || payload.message || "Gameplay event",
      data: payload,
      source: payload.source
    });
  });

  // Debug events
  UnityMessagingBus.on("debug", (payload) => {
    useUnityEvents.getState().addEvent({
      type: "debug",
      message: payload.message || String(payload),
      data: payload,
      source: payload.source
    });
  });
}

/**
 * Clean up event listeners
 */
export function cleanupUnityEventListeners(): void {
  UnityMessagingBus.removeAllListeners();
}

