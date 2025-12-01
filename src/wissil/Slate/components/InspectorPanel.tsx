/**
 * InspectorPanel Component
 * Shows file/folder information and metadata
 */

'use client';

import React from "react";
import { useEditorState } from "@/state/editorState";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface InspectorPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function InspectorPanel({ className, style }: InspectorPanelProps) {
  const theme = useTheme();
  const selectedFile = useEditorState((s) => s.selectedFile);

  return (
    <div
      className={className}
      style={{
        height: "100%",
        width: "100%",
        background: theme.colors.bg1,
        padding: theme.spacing.md,
        borderRight: `1px solid ${theme.colors.border}`,
        color: theme.colors.text1,
        fontSize: theme.typography.size.sm,
        overflowY: "auto",
        ...style
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: theme.typography.size.md,
          color: theme.colors.text0,
          marginBottom: theme.spacing.sm,
          fontWeight: theme.typography.weight.semibold
        }}
      >
        Inspector
      </h3>

      {!selectedFile && (
        <div style={{ opacity: 0.4, color: theme.colors.text2, marginTop: theme.spacing.lg }}>
          Select a file to inspect
        </div>
      )}

      {selectedFile && (
        <div style={{ marginTop: theme.spacing.md }}>
          <div style={{ marginBottom: theme.spacing.sm }}>
            <strong style={{ color: theme.colors.text1 }}>Path:</strong>{" "}
            <span style={{ color: theme.colors.text2, fontFamily: "monospace" }}>{selectedFile}</span>
          </div>

          <div style={{ marginBottom: theme.spacing.sm }}>
            <strong style={{ color: theme.colors.text1 }}>Type:</strong>{" "}
            <span style={{ color: theme.colors.text2 }}>
              {selectedFile.includes(".") ? "File" : "Folder"}
            </span>
          </div>

          {selectedFile.includes(".") && (
            <div style={{ marginBottom: theme.spacing.sm }}>
              <strong style={{ color: theme.colors.text1 }}>Extension:</strong>{" "}
              <span style={{ color: theme.colors.text2 }}>
                {selectedFile.split(".").pop()?.toUpperCase() || "N/A"}
              </span>
            </div>
          )}

          <div
            style={{
              marginTop: theme.spacing.lg,
              padding: theme.spacing.md,
              background: theme.colors.bg2,
              borderRadius: theme.radii.sm,
              opacity: 0.6,
              color: theme.colors.text2,
              fontSize: theme.typography.size.sm
            }}
          >
            (Additional metadata / editor tools will show here in Phase 4)
          </div>
        </div>
      )}
    </div>
  );
}

