/**
 * IgnisCanvasPlaceholder Component
 * Gray placeholder where Unity WebGL canvas will mount
 */

'use client';

import React from "react";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface IgnisCanvasPlaceholderProps {
  className?: string;
  style?: React.CSSProperties;
}

export function IgnisCanvasPlaceholder({ className, style }: IgnisCanvasPlaceholderProps) {
  const theme = useTheme();

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: `repeating-linear-gradient(
          45deg,
          ${theme.colors.bg2},
          ${theme.colors.bg2} 10px,
          ${theme.colors.bg1} 10px,
          ${theme.colors.bg1} 20px
        )`,
        color: theme.colors.text2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: theme.typography.size.md,
        opacity: 0.25,
        ...style
      }}
    >
      Unity WebGL will render here
    </div>
  );
}

