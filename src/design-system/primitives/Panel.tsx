/**
 * Panel Component
 * Uses Nocturna theme system
 */

'use client';

import React from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function Panel({ children, title, collapsible, defaultCollapsed = false, style, ...props }: PanelProps) {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <div
      {...props}
      style={{
        background: theme.colors.bg2,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radii.md,
        padding: theme.spacing.md,
        display: "flex",
        flexDirection: "column",
        ...style
      }}
    >
      {title && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: theme.spacing.md,
            color: theme.colors.text1,
            fontSize: theme.typography.size.md,
            fontWeight: theme.typography.weight.semibold
          }}
        >
          <span>{title}</span>
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                background: "transparent",
                border: "none",
                color: theme.colors.text2,
                cursor: "pointer",
                fontSize: theme.typography.size.sm
              }}
            >
              {isCollapsed ? "▼" : "▲"}
            </button>
          )}
        </div>
      )}
      {!isCollapsed && children}
    </div>
  );
}
