/**
 * Responsive Anchor Presets
 * Common anchor configurations
 */

'use client';

import React from "react";
import { useCanvasStore } from "./CanvasStore";
import { CanvasPatcher } from "./CanvasPatcher";
import { AnchorPreset } from "./UITypes";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";
import { Button } from "@/design-system/primitives/Button";

export interface AnchorPresetsProps {
  className?: string;
  style?: React.CSSProperties;
}

const ANCHOR_PRESETS: AnchorPreset[] = [
  {
    name: "Stretch All",
    anchorMin: { x: 0, y: 0 },
    anchorMax: { x: 1, y: 1 },
    pivot: { x: 0.5, y: 0.5 },
    offsetMin: { x: 0, y: 0 },
    offsetMax: { x: 0, y: 0 }
  },
  {
    name: "Top Left",
    anchorMin: { x: 0, y: 1 },
    anchorMax: { x: 0, y: 1 },
    pivot: { x: 0, y: 1 }
  },
  {
    name: "Top Right",
    anchorMin: { x: 1, y: 1 },
    anchorMax: { x: 1, y: 1 },
    pivot: { x: 1, y: 1 }
  },
  {
    name: "Bottom Left",
    anchorMin: { x: 0, y: 0 },
    anchorMax: { x: 0, y: 0 },
    pivot: { x: 0, y: 0 }
  },
  {
    name: "Bottom Right",
    anchorMin: { x: 1, y: 0 },
    anchorMax: { x: 1, y: 0 },
    pivot: { x: 1, y: 0 }
  },
  {
    name: "Full Center",
    anchorMin: { x: 0.5, y: 0.5 },
    anchorMax: { x: 0.5, y: 0.5 },
    pivot: { x: 0.5, y: 0.5 }
  },
  {
    name: "Left Stretch",
    anchorMin: { x: 0, y: 0 },
    anchorMax: { x: 0, y: 1 },
    pivot: { x: 0, y: 0.5 }
  },
  {
    name: "Right Stretch",
    anchorMin: { x: 1, y: 0 },
    anchorMax: { x: 1, y: 1 },
    pivot: { x: 1, y: 0.5 }
  },
  {
    name: "Top Stretch",
    anchorMin: { x: 0, y: 1 },
    anchorMax: { x: 1, y: 1 },
    pivot: { x: 0.5, y: 1 }
  },
  {
    name: "Bottom Stretch",
    anchorMin: { x: 0, y: 0 },
    anchorMax: { x: 1, y: 0 },
    pivot: { x: 0.5, y: 0 }
  }
];

export function AnchorPresets({ className, style }: AnchorPresetsProps) {
  const theme = useTheme();
  const selected = useCanvasStore((state) => state.selected);

  const handleApplyPreset = (preset: AnchorPreset) => {
    if (!selected) return;
    CanvasPatcher.applyAnchorPreset(selected, preset);
  };

  if (!selected) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.md,
          color: theme.colors.text2,
          fontSize: theme.typography.size.sm,
          textAlign: "center",
          ...style
        }}
      >
        Select a UI element to apply anchor preset
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        height: "100%",
        overflow: "auto",
        padding: theme.spacing.md,
        background: theme.colors.bg0,
        ...style
      }}
    >
      <Card style={{ padding: theme.spacing.md }}>
        <h3
          style={{
            margin: 0,
            marginBottom: theme.spacing.md,
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Anchor Presets
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
          {ANCHOR_PRESETS.map((preset) => (
            <Button
              key={preset.name}
              variant="ghost"
              onClick={() => handleApplyPreset(preset)}
              style={{
                width: "100%",
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                fontSize: theme.typography.size.sm,
                justifyContent: "flex-start"
              }}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}

