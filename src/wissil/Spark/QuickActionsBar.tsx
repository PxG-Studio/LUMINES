/**
 * QuickActionsBar Component
 * Quick action buttons for Spark template gallery
 */

'use client';

import React from "react";
import { Button } from "@/design-system/primitives/Button";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface QuickActionsBarProps {
  onNewProject?: () => void;
  onImportRepo?: () => void;
  onOpenFilesystem?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function QuickActionsBar({
  onNewProject,
  onImportRepo,
  onOpenFilesystem,
  className,
  style
}: QuickActionsBarProps) {
  const theme = useTheme();

  return (
    <div
      className={className}
      style={{
        display: "flex",
        gap: theme.spacing.md,
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.md,
        ...style
      }}
    >
      <Button
        variant="accent"
        onClick={onNewProject || (() => alert("New Project placeholder - Phase 4"))}
        style={{ padding: "8px 16px" }}
      >
        New Project
      </Button>
      <Button
        variant="ghost"
        onClick={onImportRepo || (() => alert("Import Repo placeholder - Phase 4"))}
        style={{ padding: "8px 16px" }}
      >
        Import Repo
      </Button>
      <Button
        variant="ghost"
        onClick={onOpenFilesystem || (() => alert("Open Filesystem placeholder - Phase 4"))}
        style={{ padding: "8px 16px" }}
      >
        Open Filesystem
      </Button>
    </div>
  );
}

