/**
 * Ghost Cursor Component
 * Displays other users' cursors (Figma-style multiplayer cursors)
 */

'use client';

import React, { useState, useEffect } from "react";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface GhostCursorProps {
  clientId: string;
  x: number;
  y: number;
  userName?: string;
  color?: string;
}

const cursorColors = [
  "#00ffff",
  "#ff00ff",
  "#ffff00",
  "#00ff00",
  "#ff8800",
  "#0088ff"
];

function getColorForClient(clientId: string): string {
  // Consistent color per client
  const hash = clientId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return cursorColors[hash % cursorColors.length];
}

export function GhostCursor({
  clientId,
  x,
  y,
  userName,
  color
}: GhostCursorProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(true);
  const cursorColor = color || getColorForClient(clientId);

  // Hide cursor if not updated for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [x, y]);

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 10000,
        transform: "translate(-4px, -4px)"
      }}
    >
      {/* Cursor dot */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: cursorColor,
          border: `2px solid ${theme.colors.bg0 || "#000"}`,
          boxShadow: `0 0 8px ${cursorColor}`
        }}
      />

      {/* Client label */}
      {userName && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 0,
            padding: "2px 6px",
            background: cursorColor,
            color: theme.colors.bg0 || "#000",
            fontSize: theme.typography.size.xs,
            fontWeight: theme.typography.weight.semibold,
            borderRadius: theme.radii.sm,
            whiteSpace: "nowrap",
            pointerEvents: "none"
          }}
        >
          {userName}
        </div>
      )}
    </div>
  );
}

/**
 * Ghost Cursor Container
 * Manages all ghost cursors from connected peers
 */
export function GhostCursorContainer() {
  const theme = useTheme();
  const [cursors, setCursors] = useState<Array<{
    clientId: string;
    x: number;
    y: number;
    timestamp: number;
  }>>([]);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const cursor = e.detail;
      setCursors((prev) => {
        const filtered = prev.filter((c) => c.clientId !== cursor.clientId);
        return [...filtered, {
          clientId: cursor.clientId,
          x: cursor.x,
          y: cursor.y,
          timestamp: cursor.timestamp || Date.now()
        }];
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("wissil-cursor", handler as EventListener);

      return () => {
        window.removeEventListener("wissil-cursor", handler as EventListener);
      };
    }
  }, []);

  // Clean up old cursors (older than 2 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCursors((prev) =>
        prev.filter((c) => now - c.timestamp < 2000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999
      }}
    >
      {cursors.map((cursor) => (
        <GhostCursor
          key={cursor.clientId}
          clientId={cursor.clientId}
          x={cursor.x}
          y={cursor.y}
        />
      ))}
    </div>
  );
}

