/**
 * Unity Panel Component
 * Main Unity integration panel for WISSIL
 */

'use client';

import React from "react";
import { UnityExportUI } from "@/wissil/UnityIO/exportUI";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface UnityPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function UnityPanel({ className, style }: UnityPanelProps) {
  const theme = useTheme();

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: theme.colors.bg0,
        color: theme.colors.text0,
        overflow: "auto",
        ...style
      }}
    >
      <UnityExportUI />
    </div>
  );
}

