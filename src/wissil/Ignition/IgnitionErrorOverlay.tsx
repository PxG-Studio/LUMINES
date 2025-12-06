/**
 * IgnitionErrorOverlay Component
 * Error overlay matching Vite's / Bolt's error overlay
 */

'use client';

import React from "react";
import { useEditorState } from "@/state/editorState";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface IgnitionErrorOverlayProps {
  className?: string;
  style?: React.CSSProperties;
}

export function IgnitionErrorOverlay({ className, style }: IgnitionErrorOverlayProps) {
  const theme = useTheme();
  const runtimeError = useEditorState((s) => s.runtimeError);
  const setRuntimeError = useEditorState((s) => s.setRuntimeError);

  if (!runtimeError) return null;

  return (
    <div
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        color: theme.colors.error,
        padding: theme.spacing.xl,
        zIndex: 9999,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        ...style
      }}
      onClick={() => setRuntimeError(null)}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: theme.spacing.lg,
          fontSize: theme.typography.size.xl,
          color: theme.colors.error,
          fontWeight: theme.typography.weight.semibold
        }}
      >
        Runtime Error
      </h2>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          fontSize: theme.typography.size.md,
          fontFamily: "monospace",
          background: theme.colors.bg1,
          padding: theme.spacing.lg,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors.text1,
          overflowX: "auto",
          flex: 1
        }}
      >
        {runtimeError}
      </pre>

      <div
        style={{
          opacity: 0.6,
          marginTop: theme.spacing.lg,
          fontSize: theme.typography.size.sm,
          color: theme.colors.text2,
          textAlign: "center"
        }}
      >
        (Click anywhere to dismiss)
      </div>
    </div>
  );
}

