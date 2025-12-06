/**
 * Unity Console Component
 * StackBlitz-style console for Unity runtime logs, errors, and events
 */

'use client';

import React, { useRef, useEffect } from "react";
import { useUnityEvents } from "@/wissil/runtime/unityBridge/RuntimeEvents";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { ScrollArea } from "@/design-system/layouts/ScrollArea";

export interface UnityConsoleProps {
  className?: string;
  style?: React.CSSProperties;
  maxLines?: number;
  showTimestamps?: boolean;
}

export function UnityConsole({
  className,
  style,
  maxLines = 1000,
  showTimestamps = false
}: UnityConsoleProps) {
  const theme = useTheme();
  const { events, getRecentEvents } = useUnityEvents();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight;
    }
  }, [events]);

  const recentEvents = getRecentEvents(maxLines);

  const getEventColor = (type: string) => {
    switch (type) {
      case "error":
        return theme.colors.error;
      case "warning":
        return theme.colors.warning || "#ffaa00";
      case "event":
        return theme.colors.accent;
      case "debug":
        return theme.colors.text2;
      default:
        return theme.colors.text1;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  if (recentEvents.length === 0) {
    return (
      <ScrollArea
        ref={scrollRef}
        className={className}
        style={{
          height: "100%",
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          ...style
        }}
      >
        <div
          style={{
            fontSize: theme.typography.size.sm,
            color: theme.colors.text2,
            opacity: 0.6,
            textAlign: "center",
            padding: theme.spacing.xl
          }}
        >
          No Unity events yet. Start the runtime to see logs and events.
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea
      ref={scrollRef}
      className={className}
      style={{
        height: "100%",
        background: theme.colors.bg1,
        ...style
      }}
    >
      <div
        style={{
          padding: theme.spacing.sm,
          fontSize: theme.typography.size.sm,
          fontFamily: "monospace",
          lineHeight: 1.5
        }}
      >
        {recentEvents.map((event) => (
          <div
            key={event.id}
            style={{
              marginBottom: theme.spacing.xs,
              padding: theme.spacing.xs,
              paddingLeft: theme.spacing.sm,
              borderLeft: `3px solid ${getEventColor(event.type)}`,
              background: theme.colors.bg2,
              borderRadius: theme.radii.sm,
              color: getEventColor(event.type),
              wordBreak: "break-word"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: theme.spacing.xs }}>
              {showTimestamps && (
                <span
                  style={{
                    color: theme.colors.text2,
                    fontSize: theme.typography.size.xs,
                    flexShrink: 0,
                    opacity: 0.6
                  }}
                >
                  {formatTimestamp(event.timestamp)}
                </span>
              )}
              <span
                style={{
                  color: getEventColor(event.type),
                  fontWeight: theme.typography.weight.medium,
                  flexShrink: 0
                }}
              >
                [{event.type.toUpperCase()}]
              </span>
              <span style={{ color: theme.colors.text1, flex: 1 }}>{event.message}</span>
            </div>

            {event.data && Object.keys(event.data).length > 0 && (
              <pre
                style={{
                  marginTop: theme.spacing.xs,
                  marginLeft: showTimestamps ? theme.spacing.xl : 0,
                  padding: theme.spacing.xs,
                  background: theme.colors.bg0,
                  borderRadius: theme.radii.sm,
                  fontSize: theme.typography.size.xs,
                  color: theme.colors.text2,
                  overflowX: "auto"
                }}
              >
                {JSON.stringify(event.data, null, 2)}
              </pre>
            )}

            {event.stack && (
              <pre
                style={{
                  marginTop: theme.spacing.xs,
                  marginLeft: showTimestamps ? theme.spacing.xl : 0,
                  padding: theme.spacing.xs,
                  background: theme.colors.bg0,
                  borderRadius: theme.radii.sm,
                  fontSize: theme.typography.size.xs,
                  color: theme.colors.error,
                  overflowX: "auto",
                  whiteSpace: "pre-wrap"
                }}
              >
                {event.stack}
              </pre>
            )}

            {event.file && (
              <div
                style={{
                  marginTop: theme.spacing.xs,
                  marginLeft: showTimestamps ? theme.spacing.xl : 0,
                  fontSize: theme.typography.size.xs,
                  color: theme.colors.text2,
                  opacity: 0.7
                }}
              >
                {event.file}
                {event.line && `:${event.line}`}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

