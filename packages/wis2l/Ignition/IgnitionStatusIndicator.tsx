/**
 * IgnitionStatusIndicator Component
 * Small runtime status light (like StackBlitz's indicator)
 */

'use client';

import React from "react";
import { useEditorState } from "@/state/editorState";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface IgnitionStatusIndicatorProps {
  className?: string;
  style?: React.CSSProperties;
}

export function IgnitionStatusIndicator({ className, style }: IgnitionStatusIndicatorProps) {
  const theme = useTheme();
  const buildStatus = useEditorState((s) => s.buildStatus);

  const color =
    buildStatus === "running"
      ? theme.colors.accent
      : buildStatus === "error"
      ? theme.colors.error
      : theme.colors.text2;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.xs,
        fontSize: theme.typography.size.sm,
        color: theme.colors.text2,
        ...style
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          transition: "background 0.2s ease"
        }}
      />
      <span>{buildStatus.toUpperCase()}</span>
    </div>
  );
}

