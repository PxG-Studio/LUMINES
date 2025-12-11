/**
 * EditorToolbar Component
 * Top toolbar with Ignition runtime controls
 */

'use client';

import React from "react";
import { IgnitionRuntimeBar } from "@/wis2l/Ignition/IgnitionRuntimeBar";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface EditorToolbarProps {
  onRun?: () => void;
  onRestart?: () => void;
  onStop?: () => void;
}

export function EditorToolbar({
  onRun,
  onRestart,
  onStop
}: EditorToolbarProps) {
  const theme = useTheme();

  return (
    <div
      style={{
        height: 44,
        borderBottom: `1px solid ${theme.colors.border}`,
        background: theme.colors.bg1,
        display: "flex",
        alignItems: "center",
        paddingLeft: theme.spacing.md
      }}
    >
      <IgnitionRuntimeBar
        onRun={onRun}
        onRestart={onRestart}
        onStop={onStop}
      />
    </div>
  );
}

