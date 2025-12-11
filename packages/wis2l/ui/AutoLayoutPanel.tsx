/**
 * Auto-Layout System
 * Horizontal/Vertical/Grid layout configuration
 */

'use client';

import React from "react";
import { useCanvasStore } from "./CanvasStore";
import { CanvasPatcher } from "./CanvasPatcher";
import { LayoutConfig } from "./UITypes";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";
import { Button } from "@/design-system/primitives/Button";

export interface AutoLayoutPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function AutoLayoutPanel({ className, style }: AutoLayoutPanelProps) {
  const theme = useTheme();
  const selected = useCanvasStore((state) => state.selected);
  const layoutConfigs = useCanvasStore((state) => state.layoutConfigs);
  const setLayoutConfig = useCanvasStore((state) => state.setLayoutConfig);

  const currentConfig = selected ? layoutConfigs[selected] : null;

  const handleSetLayout = (type: LayoutConfig["type"]) => {
    if (!selected) return;

    const config: LayoutConfig = {
      type,
      spacing: type !== "None" ? 8 : undefined,
      padding: {
        left: 8,
        right: 8,
        top: 8,
        bottom: 8
      }
    };

    setLayoutConfig(selected, config);
    CanvasPatcher.applyLayout(selected, config);
  };

  const handleUpdateConfig = (updates: Partial<LayoutConfig>) => {
    if (!selected || !currentConfig) return;

    const updated = { ...currentConfig, ...updates };
    setLayoutConfig(selected, updated);
    CanvasPatcher.applyLayout(selected, updated);
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
        Select a UI element to configure layout
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
          Layout Type
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
          <Button
            variant={currentConfig?.type === "Horizontal" ? "accent" : "ghost"}
            onClick={() => handleSetLayout("Horizontal")}
          >
            Horizontal
          </Button>
          <Button
            variant={currentConfig?.type === "Vertical" ? "accent" : "ghost"}
            onClick={() => handleSetLayout("Vertical")}
          >
            Vertical
          </Button>
          <Button
            variant={currentConfig?.type === "Grid" ? "accent" : "ghost"}
            onClick={() => handleSetLayout("Grid")}
          >
            Grid
          </Button>
          <Button
            variant={currentConfig?.type === "None" || !currentConfig ? "accent" : "ghost"}
            onClick={() => handleSetLayout("None")}
          >
            None
          </Button>
        </div>
      </Card>

      {currentConfig && currentConfig.type !== "None" && (
        <Card style={{ padding: theme.spacing.md, marginTop: theme.spacing.md }}>
          <h3
            style={{
              margin: 0,
              marginBottom: theme.spacing.md,
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0
            }}
          >
            Layout Settings
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
            {/* Spacing */}
            {(currentConfig.type === "Horizontal" || currentConfig.type === "Vertical") && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: theme.typography.size.sm,
                    color: theme.colors.text0,
                    marginBottom: theme.spacing.xs
                  }}
                >
                  Spacing
                </label>
                <input
                  type="number"
                  value={currentConfig.spacing || 0}
                  onChange={(e) => handleUpdateConfig({ spacing: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: "100%",
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    background: theme.colors.bg2,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radii.sm,
                    color: theme.colors.text0,
                    fontSize: theme.typography.size.sm
                  }}
                />
              </div>
            )}

            {/* Grid spacing */}
            {currentConfig.type === "Grid" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: theme.typography.size.sm,
                    color: theme.colors.text0,
                    marginBottom: theme.spacing.xs
                  }}
                >
                  Spacing X
                </label>
                <input
                  type="number"
                  value={currentConfig.spacingX || 0}
                  onChange={(e) =>
                    handleUpdateConfig({ spacingX: parseFloat(e.target.value) || 0 })
                  }
                  style={{
                    width: "100%",
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    background: theme.colors.bg2,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radii.sm,
                    color: theme.colors.text0,
                    fontSize: theme.typography.size.sm
                  }}
                />
                <label
                  style={{
                    display: "block",
                    fontSize: theme.typography.size.sm,
                    color: theme.colors.text0,
                    marginTop: theme.spacing.sm,
                    marginBottom: theme.spacing.xs
                  }}
                >
                  Spacing Y
                </label>
                <input
                  type="number"
                  value={currentConfig.spacingY || 0}
                  onChange={(e) =>
                    handleUpdateConfig({ spacingY: parseFloat(e.target.value) || 0 })
                  }
                  style={{
                    width: "100%",
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    background: theme.colors.bg2,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radii.sm,
                    color: theme.colors.text0,
                    fontSize: theme.typography.size.sm
                  }}
                />
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

