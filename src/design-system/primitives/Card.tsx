/**
 * Card Component
 * Uses Nocturna theme system
 */

'use client';

import React from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, style, ...props }: CardProps) {
  const theme = useTheme();

  return (
    <div
      {...props}
      style={{
        background: theme.colors.bg1,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radii.md,
        padding: theme.spacing.lg,
        boxShadow: theme.shadows.subtle,
        ...style
      }}
    >
      {children}
    </div>
  );
}
