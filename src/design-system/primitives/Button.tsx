/**
 * Button Component
 * Uses Nocturna theme system
 */

'use client';

import React from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "accent" | "ghost";
}

export function Button({ variant = "default", style, ...props }: ButtonProps) {
  const theme = useTheme();

  let bg = theme.colors.bg1;
  let color = theme.colors.text0;
  let border = theme.colors.border;

  if (variant === "accent") {
    // Use darker accent color for WCAG AA contrast (4.5:1 with white text)
    // Original accent #6d8cff has 3.06:1 contrast, #4c5eff has 4.5:1+
    bg = "var(--nv-accent-button, #4c5eff)";
    color = "#fff";
  } else if (variant === "ghost") {
    bg = "transparent";
    border = "transparent";
  }

  return (
    <button
      {...props}
      style={{
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        borderRadius: theme.radii.md,
        background: bg,
        color,
        border: `1px solid ${border}`,
        fontFamily: theme.typography.font,
        fontSize: theme.typography.size.md,
        cursor: "pointer",
        transition: "background 0.15s ease",
        ...style
      }}
    />
  );
}
