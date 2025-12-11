/**
 * Light Inspector Panel
 * Editable fields for light properties
 */

'use client';

import React, { useState } from "react";
import { useLightStore } from "./LightStore";
import { LightPatcher } from "./LightPatcher";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface LightInspectorProps {
  className?: string;
  style?: React.CSSProperties;
}

export function LightInspector({ className, style }: LightInspectorProps) {
  const theme = useTheme();
  const selected = useLightStore((state) => state.selected);
  const light = useLightStore((state) => (selected ? state.getLight(selected) : undefined));
  const updateLight = useLightStore((state) => state.updateLight);

  const [localColor, setLocalColor] = useState<{ r: number; g: number; b: number; a: number } | null>(null);

  if (!light) {
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
        Select a light to inspect
      </div>
    );
  }

  const color = localColor || light.color;
  const hexValue = rgbToHex(color);

  const handleUpdate = (field: string, value: any) => {
    updateLight(light.id, { [field]: value });
    LightPatcher.patch(light.id, field, value);
  };

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
          {light.name}
        </h3>
        <div
          style={{
            fontSize: theme.typography.size.xs,
            color: theme.colors.text2,
            marginTop: theme.spacing.xs
          }}
        >
          {light.type} Light
        </div>
      </div>

      {/* Color */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <label
          style={{
            display: "block",
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.medium,
            color: theme.colors.text0,
            marginBottom: theme.spacing.sm
          }}
        >
          Color
        </label>
        <div style={{ display: "flex", gap: theme.spacing.sm, alignItems: "center" }}>
          <input
            type="color"
            value={hexValue}
            onChange={(e) => {
              const rgba = hexToRGBA(e.target.value);
              setLocalColor(rgba);
              handleUpdate("color", rgba);
            }}
            style={{
              width: 60,
              height: 32,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii.sm,
              cursor: "pointer"
            }}
          />
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: theme.spacing.xs
            }}
          >
            {(["r", "g", "b"] as const).map((channel) => (
              <input
                key={channel}
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={color[channel]}
                onChange={(e) => {
                  const newColor = {
                    ...color,
                    [channel]: parseFloat(e.target.value) || 0
                  };
                  setLocalColor(newColor);
                  handleUpdate("color", newColor);
                }}
                style={{
                  width: "100%",
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  background: theme.colors.bg2,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radii.sm,
                  color: theme.colors.text0,
                  fontSize: theme.typography.size.xs,
                  fontFamily: "monospace"
                }}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Intensity */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.sm
          }}
        >
          <label
            style={{
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.medium,
              color: theme.colors.text0
            }}
          >
            Intensity
          </label>
          <span
            style={{
              fontSize: theme.typography.size.sm,
              color: theme.colors.text1,
              fontFamily: "monospace"
            }}
          >
            {light.intensity.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={0.05}
          value={light.intensity}
          onChange={(e) => handleUpdate("intensity", parseFloat(e.target.value) || 0)}
          style={{
            width: "100%",
            height: 6,
            background: theme.colors.bg2,
            borderRadius: theme.radii.sm,
            outline: "none",
            cursor: "pointer"
          }}
        />
      </Card>

      {/* Range (Point/Spot only) */}
      {(light.type === "Point" || light.type === "Spot") && light.range !== undefined && (
        <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: theme.spacing.sm
            }}
          >
            <label
              style={{
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.medium,
                color: theme.colors.text0
              }}
            >
              Range
            </label>
            <span
              style={{
                fontSize: theme.typography.size.sm,
                color: theme.colors.text1,
                fontFamily: "monospace"
              }}
            >
              {light.range.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={0.1}
            value={light.range}
            onChange={(e) => handleUpdate("range", parseFloat(e.target.value) || 0)}
            style={{
              width: "100%",
              height: 6,
              background: theme.colors.bg2,
              borderRadius: theme.radii.sm,
              outline: "none",
              cursor: "pointer"
            }}
          />
        </Card>
      )}

      {/* Spot Angle (Spot only) */}
      {light.type === "Spot" && light.spotAngle !== undefined && (
        <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: theme.spacing.sm
            }}
          >
            <label
              style={{
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.medium,
                color: theme.colors.text0
              }}
            >
              Spot Angle
            </label>
            <span
              style={{
                fontSize: theme.typography.size.sm,
                color: theme.colors.text1,
                fontFamily: "monospace"
              }}
            >
              {light.spotAngle.toFixed(0)}°
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={179}
            step={1}
            value={light.spotAngle}
            onChange={(e) => handleUpdate("spotAngle", parseFloat(e.target.value) || 1)}
            style={{
              width: "100%",
              height: 6,
              background: theme.colors.bg2,
              borderRadius: theme.radii.sm,
              outline: "none",
              cursor: "pointer"
            }}
          />
        </Card>
      )}

      {/* Shadows */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <label
          style={{
            display: "block",
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.medium,
            color: theme.colors.text0,
            marginBottom: theme.spacing.sm
          }}
        >
          Shadows
        </label>
        <select
          value={light.shadows}
          onChange={(e) => handleUpdate("shadows", e.target.value)}
          style={{
            width: "100%",
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            background: theme.colors.bg2,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.sm,
            color: theme.colors.text0,
            fontSize: theme.typography.size.sm,
            marginBottom: theme.spacing.sm
          }}
        >
          <option value="None">None</option>
          <option value="Hard">Hard</option>
          <option value="Soft">Soft</option>
        </select>
        {light.shadows !== "None" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing.sm
              }}
            >
              <label
                style={{
                  fontSize: theme.typography.size.sm,
                  fontWeight: theme.typography.weight.medium,
                  color: theme.colors.text0
                }}
              >
                Shadow Strength
              </label>
              <span
                style={{
                  fontSize: theme.typography.size.sm,
                  color: theme.colors.text1,
                  fontFamily: "monospace"
                }}
              >
                {light.shadowStrength.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={light.shadowStrength}
              onChange={(e) => handleUpdate("shadowStrength", parseFloat(e.target.value) || 0)}
              style={{
                width: "100%",
                height: 6,
                background: theme.colors.bg2,
                borderRadius: theme.radii.sm,
                outline: "none",
                cursor: "pointer"
              }}
            />
          </>
        )}
      </Card>
    </div>
  );
}

function rgbToHex(color: { r: number; g: number; b: number }): string {
  const r = Math.round(Math.max(0, Math.min(1, color.r)) * 255);
  const g = Math.round(Math.max(0, Math.min(1, color.g)) * 255);
  const b = Math.round(Math.max(0, Math.min(1, color.b)) * 255);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRGBA(hex: string): { r: number; g: number; b: number; a: number } {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return { r, g, b, a: 1 };
}

