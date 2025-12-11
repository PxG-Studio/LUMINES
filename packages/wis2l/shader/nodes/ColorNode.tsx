/**
 * Color Node Renderer
 * Custom node component for color input
 */

'use client';

import React from "react";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Handle, Position } from "reactflow";

export interface ColorNodeProps {
  data: {
    value?: { r: number; g: number; b: number; a: number };
    onChange?: (value: { r: number; g: number; b: number; a: number }) => void;
    id?: string;
  };
  selected?: boolean;
}

export function ColorNode({ data, selected }: ColorNodeProps) {
  const theme = useTheme();
  const value = data.value || { r: 1, g: 1, b: 1, a: 1 };
  const hexValue = rgbToHex(value);

  const handleChange = (channel: "r" | "g" | "b" | "a", newValue: number) => {
    if (data.onChange) {
      data.onChange({
        ...value,
        [channel]: Math.max(0, Math.min(1, newValue))
      });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rgba = hexToRGBA(e.target.value);
    if (data.onChange) {
      data.onChange(rgba);
    }
  };

  return (
    <div
      style={{
        padding: theme.spacing.sm,
        background: selected ? theme.colors.bg2 : theme.colors.bg1,
        border: `2px solid ${selected ? theme.colors.accent : theme.colors.border}`,
        borderRadius: theme.radii.md,
        minWidth: 180,
        fontSize: theme.typography.size.sm
      }}
    >
      <div
        style={{
          fontWeight: theme.typography.weight.semibold,
          color: theme.colors.text0,
          marginBottom: theme.spacing.xs,
          fontSize: theme.typography.size.sm
        }}
      >
        Color
      </div>

      <div style={{ marginBottom: theme.spacing.xs }}>
        <input
          type="color"
          value={hexValue}
          onChange={handleColorChange}
          style={{
            width: "100%",
            height: 32,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.sm,
            cursor: "pointer"
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: theme.spacing.xs
        }}
      >
        {(["r", "g", "b", "a"] as const).map((channel) => (
          <div key={channel}>
            <div
              style={{
                fontSize: theme.typography.size.xs,
                color: theme.colors.text2,
                marginBottom: 2
              }}
            >
              {channel.toUpperCase()}
            </div>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={value[channel]}
              onChange={(e) => handleChange(channel, parseFloat(e.target.value) || 0)}
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
          </div>
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="rgba"
        style={{
          background: theme.colors.accent || theme.colors.border,
          width: 8,
          height: 8
        }}
      />
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

