/**
 * LUNA Behavior Graph (Memory Core)
 * Stores past fixes, scene change histories, patterns, preferences
 * Long-term memory for autonomous learning
 */

import { create } from "zustand";

export interface MemoryEvent {
  id: string;
  type: string;
  timestamp: number;
  action?: string;
  result?: any;
  metadata?: any;
}

export interface Pattern {
  key: string;
  value: any;
  confidence: number;
  lastSeen: number;
  occurrences: number;
}

export interface Tendency {
  key: string;
  value: number;
  trend: "increasing" | "decreasing" | "stable";
  metadata?: any;
}

export interface StabilityMetric {
  key: string;
  value: number;
  threshold: number;
  status: "stable" | "unstable" | "critical";
}

export interface BalanceMetric {
  key: string;
  value: number;
  target: number;
  deviation: number;
}

interface LunaMemoryState {
  history: MemoryEvent[];
  patterns: Record<string, Pattern>;
  tendencies: Record<string, Tendency>;
  stabilityMetrics: Record<string, StabilityMetric>;
  balanceMetrics: Record<string, BalanceMetric>;
  userPreferences: Record<string, any>;
  hypotheses: Array<{
    id: string;
    description: string;
    confidence: number;
    timestamp: number;
  }>;

  // Actions
  push: (event: Omit<MemoryEvent, "id" | "timestamp">) => void;
  updatePattern: (key: string, value: any, confidence?: number) => void;
  updateTendency: (key: string, value: number, trend?: Tendency["trend"]) => void;
  updateStabilityMetric: (key: string, value: number, threshold?: number) => void;
  updateBalanceMetric: (key: string, value: number, target?: number) => void;
  addHypothesis: (description: string, confidence: number) => void;
  clear: () => void;
  getPattern: (key: string) => Pattern | undefined;
  getTrend: (key: string) => Tendency | undefined;
}

/**
 * LUNA Memory Graph Store
 * Long-term memory for autonomous learning
 */
export const useLunaMemory = create<LunaMemoryState>((set, get) => ({
  history: [],
  patterns: {},
  tendencies: {},
  stabilityMetrics: {},
  balanceMetrics: {},
  userPreferences: {},
  hypotheses: [],

  push: (event) => {
    const newEvent: MemoryEvent = {
      ...event,
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    set((state) => ({
      history: [...state.history, newEvent].slice(-1000) // Keep last 1000 events
    }));

    // Auto-update patterns based on event
    if (event.type === "fix_applied") {
      const patternKey = `fix_${event.action}`;
      const existing = get().patterns[patternKey];
      get().updatePattern(
        patternKey,
        event.result,
        existing ? existing.confidence + 0.1 : 0.5
      );
    }
  },

  updatePattern: (key, value, confidence = 0.7) => {
    set((state) => {
      const existing = state.patterns[key];
      const newPattern: Pattern = {
        key,
        value,
        confidence: confidence,
        lastSeen: Date.now(),
        occurrences: existing ? existing.occurrences + 1 : 1
      };

      return {
        patterns: {
          ...state.patterns,
          [key]: newPattern
        }
      };
    });
  },

  updateTendency: (key, value, trend = "stable") => {
    set((state) => {
      const existing = state.tendencies[key];
      let newTrend: Tendency["trend"] = trend;

      // Auto-detect trend if not provided
      if (existing && !trend) {
        const diff = value - existing.value;
        if (diff > 0.1) newTrend = "increasing";
        else if (diff < -0.1) newTrend = "decreasing";
        else newTrend = "stable";
      }

      return {
        tendencies: {
          ...state.tendencies,
          [key]: {
            key,
            value,
            trend: newTrend,
            metadata: existing?.metadata
          }
        }
      };
    });
  },

  updateStabilityMetric: (key, value, threshold = 1.0) => {
    set((state) => {
      const status: StabilityMetric["status"] =
        value > threshold * 1.5
          ? "critical"
          : value > threshold
          ? "unstable"
          : "stable";

      return {
        stabilityMetrics: {
          ...state.stabilityMetrics,
          [key]: {
            key,
            value,
            threshold,
            status
          }
        }
      };
    });
  },

  updateBalanceMetric: (key, value, target = 0) => {
    set((state) => {
      const deviation = Math.abs(value - target);

      return {
        balanceMetrics: {
          ...state.balanceMetrics,
          [key]: {
            key,
            value,
            target,
            deviation
          }
        }
      };
    });
  },

  addHypothesis: (description, confidence) => {
    set((state) => ({
      hypotheses: [
        ...state.hypotheses,
        {
          id: `hyp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          description,
          confidence,
          timestamp: Date.now()
        }
      ].slice(-100) // Keep last 100 hypotheses
    }));
  },

  clear: () => {
    set({
      history: [],
      patterns: {},
      tendencies: {},
      stabilityMetrics: {},
      balanceMetrics: {},
      hypotheses: []
    });
  },

  getPattern: (key) => {
    return get().patterns[key];
  },

  getTrend: (key) => {
    return get().tendencies[key];
  }
}));

