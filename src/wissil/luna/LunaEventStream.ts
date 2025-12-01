/**
 * LUNA Event Stream
 * Captures Unity logs, errors, gameplay events, build events, asset diffs
 * Provides complete telemetry feed for LUNA AI agent
 */

import { create } from "zustand";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useUnityEvents } from "../runtime/unityBridge/RuntimeEvents";
import { useEditorState } from "@/state/editorState";

export interface LunaEvent {
  id: string;
  type: string;
  timestamp: number;
  source: "unity" | "build" | "asset" | "runtime" | "user";
  severity: "info" | "warning" | "error" | "debug";
  message?: string;
  payload?: any;
  stackTrace?: string;
  file?: string;
  line?: number;
}

interface LunaEventStreamState {
  events: LunaEvent[];
  maxEvents: number;
  
  // Actions
  push: (event: Omit<LunaEvent, "id" | "timestamp">) => void;
  clear: () => void;
  getEvents: (filter?: (event: LunaEvent) => boolean) => LunaEvent[];
  getErrors: () => LunaEvent[];
  getWarnings: () => LunaEvent[];
}

/**
 * LUNA Event Stream Store
 */
export const useLunaStream = create<LunaEventStreamState>((set, get) => ({
  events: [],
  maxEvents: 1000,

  push: (event) => {
    const newEvent: LunaEvent = {
      ...event,
      id: `luna-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    set((state) => {
      const events = [...state.events, newEvent];
      // Keep only last maxEvents
      if (events.length > state.maxEvents) {
        events.splice(0, events.length - state.maxEvents);
      }
      return { events };
    });

    // Dispatch custom event for other systems
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("luna-event", {
          detail: newEvent
        })
      );
    }
  },

  clear: () => {
    set({ events: [] });
  },

  getEvents: (filter) => {
    const events = get().events;
    if (!filter) return events;
    return events.filter(filter);
  },

  getErrors: () => {
    return get().events.filter((e) => e.severity === "error");
  },

  getWarnings: () => {
    return get().events.filter((e) => e.severity === "warning");
  }
}));

/**
 * Initialize LUNA Event Stream subscriptions
 * Subscribes to all relevant event sources
 */
export function initializeLunaEventStream(): () => void {
  const unsubscribers: (() => void)[] = [];

  // Subscribe to Unity runtime events
  // Subscribe to Unity runtime events via UnityMessagingBus
  UnityMessagingBus.on("log", (payload) => {
    const level = (payload as any).level || "info";
    useLunaStream.getState().push({
      type: "unity.log",
      source: "unity",
      severity: level === "error" ? "error" : level === "warning" ? "warning" : "info",
      message: (payload as any).message || String(payload),
      payload
    });
  });

  UnityMessagingBus.on("error", (payload) => {
    useLunaStream.getState().push({
      type: "unity.error",
      source: "unity",
      severity: "error",
      message: (payload as any).message || String(payload),
      stackTrace: (payload as any).stackTrace || (payload as any).stack,
      file: (payload as any).file,
      line: (payload as any).line,
      payload
    });
  });

  UnityMessagingBus.on("capture", (payload) => {
    useLunaStream.getState().push({
      type: "gameplay.capture",
      source: "runtime",
      severity: "info",
      message: `Card capture: ${payload.attackerId} vs ${payload.defenderId}`,
      payload
    });
  });

  UnityMessagingBus.on("scoreUpdate", (payload) => {
    useLunaStream.getState().push({
      type: "gameplay.score",
      source: "runtime",
      severity: "info",
      message: `Score update: Player ${payload.playerId} = ${payload.score}`,
      payload
    });
  });

  // Subscribe to build events
  const buildUnsub = useEditorState.subscribe(
    (state) => {
      if (state.buildError) {
        useLunaStream.getState().push({
          type: "build.error",
          source: "build",
          severity: "error",
          message: state.buildError,
          payload: { buildError: state.buildError }
        });
      }
    }
  );

  // Subscribe to asset diff events
  if (typeof window !== "undefined") {
    const assetDiffHandler = (e: CustomEvent) => {
      useLunaStream.getState().push({
        type: "asset.diff",
        source: "asset",
        severity: "info",
        message: `Asset changed: ${e.detail.path}`,
        payload: e.detail
      });
    };

    window.addEventListener("asset-diff", assetDiffHandler as EventListener);
    unsubscribers.push(() => {
      window.removeEventListener("asset-diff", assetDiffHandler as EventListener);
    });
  }

  unsubscribers.push(buildUnsub);

  return () => {
    unsubscribers.forEach((unsub) => unsub());
  };
}

