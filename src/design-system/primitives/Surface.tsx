/**
 * Surface Component
 * Uses Nocturna theme system
 */

'use client';

import React from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "glass" | "solid" | "blend";
  elevation?: 0 | 1 | 2 | 3;
}

export function Surface({ children, variant = "solid", elevation = 0, style, ...props }: SurfaceProps) {
  const theme = useTheme();

  let bg = theme.colors.bg1;
  if (variant === "glass") {
    bg = `${theme.colors.bg1}80`; // 80 = 50% opacity in hex
  } else if (variant === "blend") {
    bg = `${theme.colors.bg2}80`;
  }

  let shadow = "none";
  if (elevation === 1) {
    shadow = theme.shadows.subtle;
  } else if (elevation >= 2) {
    shadow = theme.shadows.strong;
  }

  return (
    <div
      {...props}
      style={{
        background: bg,
        padding: theme.spacing.lg,
        borderRadius: theme.radii.md,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: shadow,
        ...style
      }}
    >
      {children}
    </div>
  );
}
