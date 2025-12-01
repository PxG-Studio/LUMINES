/**
 * LUNA Debug Console UI
 * IDE panel for AI-assisted debugging
 * Shows events, intents, fixes, and suggestions
 */

'use client';

import React, { useState, useEffect } from "react";
import { useLunaStream } from "./LunaEventStream";
import { LunaAnalyzer } from "./LunaAnalyzer";
import { initLunaDispatcher, isLunaDispatcherActive, setLunaDispatcherEnabled } from "./LunaDispatcher";
import { initializeLunaEventStream } from "./LunaEventStream";
import { Button } from "@/design-system/primitives/Button";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { LunaAnalyzer as Analyzer } from "./LunaAnalyzer";

export interface LunaPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function LunaPanel({ className, style }: LunaPanelProps) {
  const theme = useTheme();
  const events = useLunaStream((state) => state.events);
  const errors = useLunaStream((state) => state.getErrors());
  const warnings = useLunaStream((state) => state.getWarnings());
  const [isEnabled, setIsEnabled] = useState(isLunaDispatcherActive());
  const [filter, setFilter] = useState<"all" | "errors" | "warnings" | "intents">("all");
  const [analyzedIntents, setAnalyzedIntents] = useState<any[]>([]);

  // Initialize LUNA systems
  useEffect(() => {
    const cleanupStream = initializeLunaEventStream();
    const cleanupDispatcher = initLunaDispatcher();

    return () => {
      cleanupStream();
      cleanupDispatcher();
    };
  }, []);

  // Analyze events and generate intents
  useEffect(() => {
    if (events.length === 0) return;

    const lastEvent = events[events.length - 1];
    const intent = Analyzer.analyze(lastEvent);

    if (intent) {
      setAnalyzedIntents((prev) => {
        const filtered = prev.filter((i) => i.event.id !== intent.event.id);
        return [...filtered, intent].slice(-50); // Keep last 50
      });
    }
  }, [events]);

  const handleToggle = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    setLunaDispatcherEnabled(newEnabled);
  };

  const handleClear = () => {
    useLunaStream.getState().clear();
    setAnalyzedIntents([]);
  };

  const filteredEvents = filter === "all" 
    ? events 
    : filter === "errors"
    ? errors
    : filter === "warnings"
    ? warnings
    : [];

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return theme.colors.error || "#ef4444";
      case "warning":
        return theme.colors.warning || "#f59e0b";
      case "info":
        return theme.colors.accent || "#3b82f6";
      default:
        return theme.colors.text2 || "#6b7280";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "#ef4444";
      case "high":
        return "#f59e0b";
      case "medium":
        return "#3b82f6";
      default:
        return theme.colors.text2 || "#6b7280";
    }
  };

  return (
    <div
      className={className}
      style={{
        padding: theme.spacing.md,
        height: "100%",
        overflow: "auto",
        background: theme.colors.bg0,
        ...style
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: theme.spacing.sm
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: theme.typography.size.xl,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0
            }}
          >
            LUNA Debug Assistant
          </h2>
          <div style={{ display: "flex", gap: theme.spacing.xs, alignItems: "center" }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: isEnabled
                  ? theme.colors.success || "#4ade80"
                  : theme.colors.text2 || "#6b7280"
              }}
            />
            <Button
              variant={isEnabled ? "accent" : "ghost"}
              onClick={handleToggle}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                fontSize: theme.typography.size.sm
              }}
            >
              {isEnabled ? "Active" : "Inactive"}
            </Button>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            color: theme.colors.text2,
            fontSize: theme.typography.size.sm,
            opacity: 0.8
          }}
        >
          AI-assisted runtime debugging. Watches events, analyzes issues, fixes rules, patches prefabs, and updates logic live.
        </p>
      </div>

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.lg
        }}
      >
        <div
          style={{
            padding: theme.spacing.sm,
            background: theme.colors.bg1,
            borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.border}`,
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.semibold, color: theme.colors.text0 }}>
            {events.length}
          </div>
          <div style={{ fontSize: theme.typography.size.xs, color: theme.colors.text2 }}>Events</div>
        </div>
        <div
          style={{
            padding: theme.spacing.sm,
            background: theme.colors.bg1,
            borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.border}`,
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.semibold, color: theme.colors.error || "#ef4444" }}>
            {errors.length}
          </div>
          <div style={{ fontSize: theme.typography.size.xs, color: theme.colors.text2 }}>Errors</div>
        </div>
        <div
          style={{
            padding: theme.spacing.sm,
            background: theme.colors.bg1,
            borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.border}`,
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.semibold, color: theme.colors.warning || "#f59e0b" }}>
            {warnings.length}
          </div>
          <div style={{ fontSize: theme.typography.size.xs, color: theme.colors.text2 }}>Warnings</div>
        </div>
        <div
          style={{
            padding: theme.spacing.sm,
            background: theme.colors.bg1,
            borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.border}`,
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.semibold, color: theme.colors.accent || "#3b82f6" }}>
            {analyzedIntents.length}
          </div>
          <div style={{ fontSize: theme.typography.size.xs, color: theme.colors.text2 }}>Intents</div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: theme.spacing.xs,
          marginBottom: theme.spacing.md
        }}
      >
        {(["all", "errors", "warnings", "intents"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "accent" : "ghost"}
            onClick={() => setFilter(f)}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm,
              textTransform: "capitalize"
            }}
          >
            {f}
          </Button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <Button
            variant="ghost"
            onClick={handleClear}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Event/Intent List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.sm
        }}
      >
        {filter === "intents" ? (
          // Show analyzed intents
          analyzedIntents.slice().reverse().map((intent, i) => (
            <div
              key={i}
              style={{
                padding: theme.spacing.md,
                background: theme.colors.bg1,
                borderRadius: theme.radii.md,
                border: `1px solid ${getPriorityColor(intent.priority)}`,
                borderLeftWidth: 4
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: theme.spacing.xs
                }}
              >
                <div style={{ fontSize: theme.typography.size.sm, fontWeight: theme.typography.weight.semibold, color: theme.colors.text0 }}>
                  {intent.action}
                </div>
                <div style={{ fontSize: theme.typography.size.xs, color: getPriorityColor(intent.priority) }}>
                  {intent.priority} ({(intent.confidence * 100).toFixed(0)}%)
                </div>
              </div>
              <div style={{ fontSize: theme.typography.size.sm, color: theme.colors.text1, marginBottom: theme.spacing.xs }}>
                {intent.reason}
              </div>
              <div style={{ fontSize: theme.typography.size.xs, color: theme.colors.text2, opacity: 0.7 }}>
                {formatTimestamp(intent.event.timestamp)}
              </div>
            </div>
          ))
        ) : (
          // Show events
          filteredEvents.slice().reverse().map((event, i) => (
            <div
              key={event.id || i}
              style={{
                padding: theme.spacing.sm,
                background: theme.colors.bg1,
                borderRadius: theme.radii.md,
                border: `1px solid ${theme.colors.border}`,
                borderLeftWidth: 4,
                borderLeftColor: getSeverityColor(event.severity)
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: theme.spacing.xs
                }}
              >
                <div style={{ fontSize: theme.typography.size.sm, fontWeight: theme.typography.weight.medium, color: getSeverityColor(event.severity) }}>
                  {event.type}
                </div>
                <div style={{ fontSize: theme.typography.size.xs, color: theme.colors.text2 }}>
                  {formatTimestamp(event.timestamp)}
                </div>
              </div>
              {event.message && (
                <div style={{ fontSize: theme.typography.size.sm, color: theme.colors.text1 }}>
                  {event.message}
                </div>
              )}
              {event.file && (
                <div style={{ fontSize: theme.typography.size.xs, color: theme.colors.text2, marginTop: theme.spacing.xs }}>
                  {event.file}{event.line ? `:${event.line}` : ""}
                </div>
              )}
            </div>
          ))
        )}

        {filteredEvents.length === 0 && filter !== "intents" && (
          <div
            style={{
              padding: theme.spacing.lg,
              textAlign: "center",
              color: theme.colors.text2,
              opacity: 0.6
            }}
          >
            No {filter === "all" ? "" : filter} events yet
          </div>
        )}

        {analyzedIntents.length === 0 && filter === "intents" && (
          <div
            style={{
              padding: theme.spacing.lg,
              textAlign: "center",
              color: theme.colors.text2,
              opacity: 0.6
            }}
          >
            No analyzed intents yet
          </div>
        )}
      </div>
    </div>
  );
}

