/**
 * Override Indicators
 * Visual indicators for overridden properties (like Unity's blue dots)
 */

'use client';

import React from "react";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface OverrideIndicatorProps {
  isOverridden: boolean;
  variantId?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function OverrideIndicator({
  isOverridden,
  variantId,
  className,
  style
}: OverrideIndicatorProps) {
  const theme = useTheme();

  if (!isOverridden) return null;

  return (
    <div
      className={className}
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "#4FA6FF", // Unity's override blue
        marginLeft: 6,
        display: "inline-block",
        boxShadow: "0 0 4px rgba(79, 166, 255, 0.5)",
        ...style
      }}
      title={variantId ? `Overridden in variant: ${variantId}` : "This property is overridden"}
    />
  );
}

