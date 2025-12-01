/**
 * UI Gizmos Overlay
 * Visual handles and bounding rects for selected UI elements
 */

'use client';

import React from "react";
import { useCanvasStore } from "./CanvasStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface UIRectGizmosProps {
  className?: string;
  style?: React.CSSProperties;
}

export function UIRectGizmos({ className, style }: UIRectGizmosProps) {
  const theme = useTheme();
  const selected = useCanvasStore((state) => state.selected);
  const rect = useCanvasStore((state) => (selected ? state.getRect(selected) : undefined));

  if (!rect) return null;

  // For now, we'll render a simple bounding box overlay
  // In a real implementation, this would project Unity screen coordinates to canvas coordinates
  // This is a placeholder that shows the concept

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        pointerEvents: "none",
        zIndex: 1000,
        ...style
      }}
    >
      {/* This would be positioned based on Unity screen space coordinates */}
      <div
        style={{
          border: `2px solid ${theme.colors.accent || "#00ffff"}`,
          borderRadius: theme.radii.sm,
          boxShadow: `0 0 8px ${theme.colors.accent || "#00ffff"}40`,
          position: "absolute"
        }}
      >
        {/* Resize handles would go here */}
      </div>
    </div>
  );
}

