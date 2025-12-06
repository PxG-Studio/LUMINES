/**
 * Unity Browser Panel Component
 * Main panel for Unity asset browsing and inspection
 */

'use client';

import React from "react";
import { FilePreviewRouter } from "./FilePreviewRouter";
import { useEditorState } from "@/state/editorState";
import { useWissilFS } from "@/wissil/runtime/fs/wissilFs";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface UnityBrowserPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function UnityBrowserPanel({ className, style }: UnityBrowserPanelProps) {
  const theme = useTheme();
  const selectedFile = useEditorState((s) => s.selectedFile);
  const fs = useWissilFS.getState();

  if (!selectedFile) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.xl,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.text2,
          opacity: 0.6,
          ...style
        }}
      >
        Select a Unity asset file to inspect
      </div>
    );
  }

  const fileContent = fs.readFile(selectedFile);

  if (fileContent === null) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.xl,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.error,
          ...style
        }}
      >
        File not found: {selectedFile}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        height: "100%",
        overflow: "hidden",
        background: theme.colors.bg0,
        ...style
      }}
    >
      <FilePreviewRouter path={selectedFile} content={fileContent} />
    </div>
  );
}

