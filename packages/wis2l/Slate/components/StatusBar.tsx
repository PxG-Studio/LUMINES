/**
 * StatusBar Component
 * Enhanced IDE-style footer bar with build status, cursor position, and file type
 */

'use client';

import React from "react";
import { useEditorState } from "@/state/editorState";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface StatusBarProps {
  className?: string;
  style?: React.CSSProperties;
}

export function StatusBar({ className, style }: StatusBarProps) {
  const theme = useTheme();
  const selectedFile = useEditorState((s) => s.selectedFile);
  const buildStatus = useEditorState((s) => s.buildStatus);
  const cursorLine = useEditorState((s) => s.cursorLine);
  const cursorCol = useEditorState((s) => s.cursorCol);

  const statusColor =
    buildStatus === "running"
      ? theme.colors.accent
      : buildStatus === "error"
      ? theme.colors.error
      : theme.colors.text2;

  const getFileMode = (path: string | null): string => {
    if (!path) return "Plain Text";
    
    if (path.endsWith(".ts") || path.endsWith(".tsx")) return "TypeScript";
    if (path.endsWith(".js") || path.endsWith(".jsx")) return "JavaScript";
    if (path.endsWith(".css")) return "CSS";
    if (path.endsWith(".html") || path.endsWith(".htm")) return "HTML";
    if (path.endsWith(".json")) return "JSON";
    if (path.endsWith(".md")) return "Markdown";
    if (path.endsWith(".py")) return "Python";
    if (path.endsWith(".rs")) return "Rust";
    if (path.endsWith(".go")) return "Go";
    
    return "Plain Text";
  };

  return (
    <div
      className={className}
      style={{
        height: 28,
        width: "100%",
        background: theme.colors.bg1,
        borderTop: `1px solid ${theme.colors.border}`,
        display: "flex",
        alignItems: "center",
        fontSize: theme.typography.size.sm,
        color: theme.colors.text2,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        fontFamily: theme.typography.font,
        ...style
      }}
    >
      {/* BUILD STATUS */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: theme.spacing.lg,
          color: statusColor,
          fontWeight: theme.typography.weight.medium
        }}
      >
        <span style={{ marginRight: theme.spacing.xs }}>●</span>
        {buildStatus.toUpperCase()}
      </div>

      {/* FILE PATH */}
      <div
        style={{
          marginRight: "auto",
          color: theme.colors.text1,
          fontFamily: "monospace",
          fontSize: theme.typography.size.sm,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "40%"
        }}
      >
        {selectedFile || "No file selected"}
      </div>

      {/* CURSOR POSITION */}
      <div
        style={{
          marginRight: theme.spacing.lg,
          color: theme.colors.text2
        }}
      >
        Ln {cursorLine}, Col {cursorCol}
      </div>

      {/* FILE MODE */}
      <div style={{ color: theme.colors.text2 }}>
        {getFileMode(selectedFile)}
      </div>
    </div>
  );
}
