/**
 * Divider Layout Component
 */

'use client';

import React from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Divider({ orientation = "horizontal", style, ...props }: DividerProps) {
  const theme = useTheme();

  return (
    <div
      {...props}
      style={{
        [orientation === "horizontal" ? "height" : "width"]: "1px",
        [orientation === "horizontal" ? "width" : "height"]: "100%",
        background: theme.colors.border,
        margin: orientation === "horizontal" 
          ? `${theme.spacing.md} 0` 
          : `0 ${theme.spacing.md}`,
        ...style
      }}
    />
  );
}

