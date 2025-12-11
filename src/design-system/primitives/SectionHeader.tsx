/**
 * SectionHeader Component
 * Uses Nocturna theme system
 */

'use client';

import React from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface SectionHeaderProps {
  title: string;
  style?: React.CSSProperties;
}

export function SectionHeader({ title, style }: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <div
      style={{
        marginBottom: theme.spacing.md,
        color: theme.colors.text1,
        fontSize: theme.typography.size.lg,
        fontWeight: theme.typography.weight.semibold,
        ...style
      }}
    >
      {title}
    </div>
  );
}

