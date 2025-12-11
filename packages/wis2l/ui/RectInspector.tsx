/**
 * RectTransform Inspector
 * Position, size, anchors, pivot controls
 */

'use client';

import React from "react";
import { useCanvasStore } from "./CanvasStore";
import { CanvasPatcher } from "./CanvasPatcher";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface RectInspectorProps {
  className?: string;
  style?: React.CSSProperties;
}

export function RectInspector({ className, style }: RectInspectorProps) {
  const theme = useTheme();
  const selected = useCanvasStore((state) => state.selected);
  const rect = useCanvasStore((state) => (selected ? state.getRect(selected) : undefined));
  const updateRect = useCanvasStore((state) => state.updateRect);

  if (!rect) {
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
        Select a UI element to inspect
      </div>
    );
  }

  const handleUpdate = (field: string, value: any) => {
    updateRect(rect.id, { [field]: value });
    CanvasPatcher.patch(rect.id, field, value);
  };

  const Vector2Input = ({
    label,
    x,
    y,
    onUpdate
  }: {
    label: string;
    x: number;
    y: number;
    onUpdate: (x: number, y: number) => void;
  }) => (
    <div style={{ marginBottom: theme.spacing.md }}>
      <label
        style={{
          display: "block",
          fontSize: theme.typography.size.sm,
          fontWeight: theme.typography.weight.medium,
          color: theme.colors.text0,
          marginBottom: theme.spacing.xs
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", gap: theme.spacing.xs }}>
        <input
          type="number"
          value={x}
          onChange={(e) => onUpdate(parseFloat(e.target.value) || 0, y)}
          style={{
            flex: 1,
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            background: theme.colors.bg2,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.sm,
            color: theme.colors.text0,
            fontSize: theme.typography.size.sm
          }}
        />
        <input
          type="number"
          value={y}
          onChange={(e) => onUpdate(x, parseFloat(e.target.value) || 0)}
          style={{
            flex: 1,
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            background: theme.colors.bg2,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.sm,
            color: theme.colors.text0,
            fontSize: theme.typography.size.sm
          }}
        />
      </div>
    </div>
  );

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
          {rect.name}
        </h3>
      </div>

      {/* Position */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div
          style={{
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginBottom: theme.spacing.sm
          }}
        >
          Position
        </div>
        <Vector2Input
          label=""
          x={rect.position.x}
          y={rect.position.y}
          onUpdate={(x, y) => handleUpdate("position", { x, y })}
        />
      </Card>

      {/* Size */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div
          style={{
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginBottom: theme.spacing.sm
          }}
        >
          Size
        </div>
        <Vector2Input
          label=""
          x={rect.size.x}
          y={rect.size.y}
          onUpdate={(x, y) => handleUpdate("size", { x, y })}
        />
      </Card>

      {/* Anchors Min */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div
          style={{
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginBottom: theme.spacing.sm
          }}
        >
          Anchor Min
        </div>
        <div style={{ display: "flex", gap: theme.spacing.xs }}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={rect.anchorMin.x}
            onChange={(e) =>
              handleUpdate("anchorMin", {
                x: parseFloat(e.target.value) || 0,
                y: rect.anchorMin.y
              })
            }
            style={{ flex: 1 }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={rect.anchorMin.y}
            onChange={(e) =>
              handleUpdate("anchorMin", {
                x: rect.anchorMin.x,
                y: parseFloat(e.target.value) || 0
              })
            }
            style={{ flex: 1 }}
          />
        </div>
        <div
          style={{
            fontSize: theme.typography.size.xs,
            color: theme.colors.text2,
            marginTop: theme.spacing.xs
          }}
        >
          ({rect.anchorMin.x.toFixed(2)}, {rect.anchorMin.y.toFixed(2)})
        </div>
      </Card>

      {/* Anchors Max */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div
          style={{
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginBottom: theme.spacing.sm
          }}
        >
          Anchor Max
        </div>
        <div style={{ display: "flex", gap: theme.spacing.xs }}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={rect.anchorMax.x}
            onChange={(e) =>
              handleUpdate("anchorMax", {
                x: parseFloat(e.target.value) || 0,
                y: rect.anchorMax.y
              })
            }
            style={{ flex: 1 }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={rect.anchorMax.y}
            onChange={(e) =>
              handleUpdate("anchorMax", {
                x: rect.anchorMax.x,
                y: parseFloat(e.target.value) || 0
              })
            }
            style={{ flex: 1 }}
          />
        </div>
        <div
          style={{
            fontSize: theme.typography.size.xs,
            color: theme.colors.text2,
            marginTop: theme.spacing.xs
          }}
        >
          ({rect.anchorMax.x.toFixed(2)}, {rect.anchorMax.y.toFixed(2)})
        </div>
      </Card>

      {/* Pivot */}
      <Card style={{ padding: theme.spacing.md }}>
        <div
          style={{
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginBottom: theme.spacing.sm
          }}
        >
          Pivot
        </div>
        <div style={{ display: "flex", gap: theme.spacing.xs }}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={rect.pivot.x}
            onChange={(e) =>
              handleUpdate("pivot", {
                x: parseFloat(e.target.value) || 0.5,
                y: rect.pivot.y
              })
            }
            style={{ flex: 1 }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={rect.pivot.y}
            onChange={(e) =>
              handleUpdate("pivot", {
                x: rect.pivot.x,
                y: parseFloat(e.target.value) || 0.5
              })
            }
            style={{ flex: 1 }}
          />
        </div>
        <div
          style={{
            fontSize: theme.typography.size.xs,
            color: theme.colors.text2,
            marginTop: theme.spacing.xs
          }}
        >
          ({rect.pivot.x.toFixed(2)}, {rect.pivot.y.toFixed(2)})
        </div>
      </Card>
    </div>
  );
}

