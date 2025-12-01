/**
 * EditorArea Component
 * Main panel where Monaco Editor will mount later
 */

'use client';

import React from "react";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface EditorAreaProps {
  className?: string;
  style?: React.CSSProperties;
}

export function EditorArea({ className, style }: EditorAreaProps) {
  const theme = useTheme();

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: theme.colors.bg2,
        position: "relative",
        fontSize: theme.typography.size.md,
        color: theme.colors.text1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        ...style
      }}
    >
      <div style={{ opacity: 0.4, color: theme.colors.text2 }}>
        Editor will mount here
      </div>
    </div>
  );
}

