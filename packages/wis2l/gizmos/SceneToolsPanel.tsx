/**
 * Scene Tools Panel
 * Unity toolbar equivalent for scene manipulation tools
 */

'use client';

import React, { useState } from "react";
import { useTransformStore } from "../scene/TransformStore";
import { Snapping } from "./Snapping";
import { ViewportCamera } from "./ViewportCamera";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Button } from "@/design-system/primitives/Button";
import { Card } from "@/design-system/primitives/Card";

export function SceneToolsPanel() {
  const theme = useTheme();
  const gizmoMode = useTransformStore((state) => state.gizmoMode);
  const setGizmoMode = useTransformStore((state) => state.setGizmoMode);
  const selected = useTransformStore((state) => state.selected);

  const snappingConfig = Snapping.getConfig();
  const [snapEnabled, setSnapEnabled] = useState(snappingConfig.enabled);
  const [gridSize, setGridSize] = useState(snappingConfig.grid);
  const [angleSnap, setAngleSnap] = useState(snappingConfig.angle);

  const handleSnapToggle = (enabled: boolean) => {
    setSnapEnabled(enabled);
    Snapping.setEnabled(enabled);
  };

  const handleGridSizeChange = (size: number) => {
    setGridSize(size);
    Snapping.setConfig({ grid: size });
  };

  const handleAngleSnapChange = (angle: number) => {
    setAngleSnap(angle);
    Snapping.setConfig({ angle });
  };

  const handleFocus = () => {
    if (selected) {
      ViewportCamera.focus(selected);
    }
  };

  const handleResetCamera = () => {
    ViewportCamera.reset();
  };

  return (
    <div
      style={{
        padding: theme.spacing.md,
        height: "100%",
        overflow: "auto",
        background: theme.colors.bg0
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: theme.spacing.md,
          paddingBottom: theme.spacing.sm,
          borderBottom: `1px solid ${theme.colors.border}`
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: theme.typography.size.md,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Scene Tools
        </h3>
      </div>

      {/* Gizmo Mode Selection */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div
          style={{
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginBottom: theme.spacing.sm
          }}
        >
          Gizmo Mode
        </div>
        <div style={{ display: "flex", gap: theme.spacing.xs }}>
          <Button
            variant={gizmoMode === "move" ? "accent" : "ghost"}
            onClick={() => setGizmoMode("move")}
            style={{
              flex: 1,
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Move
          </Button>
          <Button
            variant={gizmoMode === "rotate" ? "accent" : "ghost"}
            onClick={() => setGizmoMode("rotate")}
            style={{
              flex: 1,
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Rotate
          </Button>
          <Button
            variant={gizmoMode === "scale" ? "accent" : "ghost"}
            onClick={() => setGizmoMode("scale")}
            style={{
              flex: 1,
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Scale
          </Button>
        </div>
      </Card>

      {/* Snapping Controls */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div
          style={{
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginBottom: theme.spacing.sm
          }}
        >
          Snapping
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: theme.spacing.sm }}>
          <input
            type="checkbox"
            checked={snapEnabled}
            onChange={(e) => handleSnapToggle(e.target.checked)}
            style={{
              marginRight: theme.spacing.xs,
              cursor: "pointer"
            }}
          />
          <label
            style={{
              fontSize: theme.typography.size.sm,
              color: theme.colors.text1,
              cursor: "pointer"
            }}
          >
            Enable Snapping
          </label>
        </div>
        {snapEnabled && (
          <>
            <div style={{ marginBottom: theme.spacing.xs }}>
              <label
                style={{
                  display: "block",
                  fontSize: theme.typography.size.xs,
                  color: theme.colors.text2,
                  marginBottom: theme.spacing.xs
                }}
              >
                Grid Size: {gridSize}
              </label>
              <input
                type="number"
                min="0.01"
                max="10"
                step="0.05"
                value={gridSize}
                onChange={(e) => handleGridSizeChange(parseFloat(e.target.value) || 0.25)}
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
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: theme.typography.size.xs,
                  color: theme.colors.text2,
                  marginBottom: theme.spacing.xs
                }}
              >
                Angle Snap: {angleSnap}°
              </label>
              <input
                type="number"
                min="1"
                max="90"
                step="1"
                value={angleSnap}
                onChange={(e) => handleAngleSnapChange(parseFloat(e.target.value) || 15)}
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
          </>
        )}
      </Card>

      {/* Camera Controls */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div
          style={{
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginBottom: theme.spacing.sm
          }}
        >
          Camera
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
          <Button
            variant="ghost"
            onClick={handleFocus}
            disabled={!selected}
            style={{
              width: "100%",
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Focus Selected
          </Button>
          <Button
            variant="ghost"
            onClick={handleResetCamera}
            style={{
              width: "100%",
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Reset Camera
          </Button>
        </div>
        <div
          style={{
            marginTop: theme.spacing.sm,
            padding: theme.spacing.xs,
            background: theme.colors.bg2,
            borderRadius: theme.radii.sm,
            fontSize: theme.typography.size.xs,
            color: theme.colors.text2
          }}
        >
          <div>Middle Mouse: Orbit</div>
          <div>Right Mouse: Pan</div>
          <div>Wheel: Zoom</div>
        </div>
      </Card>

      {/* Selection Info */}
      {selected && (
        <Card style={{ padding: theme.spacing.md }}>
          <div
            style={{
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0,
              marginBottom: theme.spacing.sm
            }}
          >
            Selected Object
          </div>
          <div
            style={{
              fontSize: theme.typography.size.xs,
              color: theme.colors.text2,
              fontFamily: "monospace"
            }}
          >
            ID: {selected}
          </div>
        </Card>
      )}
    </div>
  );
}

