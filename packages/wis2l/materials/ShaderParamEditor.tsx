/**
 * Shader Param Editor
 * Edits shader parameters: float, color, vector, texture
 */

'use client';

import React, { useState } from "react";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { LiveShaderPatcher } from "./LiveShaderPatcher";
import { MaterialParam } from "./MaterialStore";

export interface ShaderParamEditorProps {
  objectId: string;
  param: MaterialParam;
}

export function ShaderParamEditor({ objectId, param }: ShaderParamEditorProps) {
  const theme = useTheme();
  const [localValue, setLocalValue] = useState<any>(param.value);

  const handleUpdate = (newValue: any) => {
    setLocalValue(newValue);
    LiveShaderPatcher.patch(objectId, param.name, param.type, newValue);
  };

  switch (param.type) {
    case "Float":
    case "Range":
      return (
        <div
          style={{
            marginBottom: theme.spacing.sm,
            padding: theme.spacing.sm,
            background: theme.colors.bg1,
            borderRadius: theme.radii.sm,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: theme.typography.size.xs,
              fontWeight: theme.typography.weight.medium,
              color: theme.colors.text1,
              marginBottom: theme.spacing.xs
            }}
          >
            {param.name} ({param.type})
          </label>
          <input
            type="number"
            step="0.01"
            value={localValue}
            onChange={(e) => setLocalValue(parseFloat(e.target.value) || 0)}
            onBlur={(e) => handleUpdate(parseFloat(e.target.value) || 0)}
            style={{
              width: "100%",
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              background: theme.colors.bg2,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii.sm,
              color: theme.colors.text0,
              fontSize: theme.typography.size.sm,
              fontFamily: "monospace"
            }}
          />
        </div>
      );

    case "Color":
      const colorValue =
        typeof localValue === "object"
          ? localValue
          : { r: 1, g: 1, b: 1, a: 1 };
      const hexValue = rgbToHex(colorValue);

      return (
        <div
          style={{
            marginBottom: theme.spacing.sm,
            padding: theme.spacing.sm,
            background: theme.colors.bg1,
            borderRadius: theme.radii.sm,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: theme.typography.size.xs,
              fontWeight: theme.typography.weight.medium,
              color: theme.colors.text1,
              marginBottom: theme.spacing.xs
            }}
          >
            {param.name} (Color)
          </label>
          <div style={{ display: "flex", gap: theme.spacing.xs, alignItems: "center" }}>
            <input
              type="color"
              value={hexValue}
              onChange={(e) => {
                const rgba = hexToRGBA(e.target.value);
                setLocalValue(rgba);
                handleUpdate(rgba);
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
              {["r", "g", "b", "a"].map((channel) => (
                <input
                  key={channel}
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={colorValue[channel as keyof typeof colorValue] || 0}
                  onChange={(e) => {
                    const newValue = {
                      ...colorValue,
                      [channel]: parseFloat(e.target.value) || 0
                    };
                    setLocalValue(newValue);
                    handleUpdate(newValue);
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
        </div>
      );

    case "Vector":
      const vectorValue =
        typeof localValue === "object"
          ? localValue
          : { x: 0, y: 0, z: 0, w: 0 };

      return (
        <div
          style={{
            marginBottom: theme.spacing.sm,
            padding: theme.spacing.sm,
            background: theme.colors.bg1,
            borderRadius: theme.radii.sm,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: theme.typography.size.xs,
              fontWeight: theme.typography.weight.medium,
              color: theme.colors.text1,
              marginBottom: theme.spacing.xs
            }}
          >
            {param.name} (Vector4)
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: theme.spacing.xs
            }}
          >
            {["x", "y", "z", "w"].map((axis) => (
              <div key={axis}>
                <div
                  style={{
                    fontSize: theme.typography.size.xs,
                    color: theme.colors.text2,
                    marginBottom: 2
                  }}
                >
                  {axis.toUpperCase()}
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={vectorValue[axis as keyof typeof vectorValue] || 0}
                  onChange={(e) => {
                    const newValue = {
                      ...vectorValue,
                      [axis]: parseFloat(e.target.value) || 0
                    };
                    setLocalValue(newValue);
                  }}
                  onBlur={(e) => {
                    const newValue = {
                      ...vectorValue,
                      [axis]: parseFloat(e.target.value) || 0
                    };
                    handleUpdate(newValue);
                  }}
                  style={{
                    width: "100%",
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    background: theme.colors.bg2,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radii.sm,
                    color: theme.colors.text0,
                    fontSize: theme.typography.size.sm,
                    fontFamily: "monospace"
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      );

    case "TexEnv":
      return (
        <div
          style={{
            marginBottom: theme.spacing.sm,
            padding: theme.spacing.sm,
            background: theme.colors.bg1,
            borderRadius: theme.radii.sm,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: theme.typography.size.xs,
              fontWeight: theme.typography.weight.medium,
              color: theme.colors.text1,
              marginBottom: theme.spacing.xs
            }}
          >
            {param.name} (Texture)
          </label>
          <div
            style={{
              fontSize: theme.typography.size.sm,
              color: theme.colors.text2,
              fontStyle: "italic"
            }}
          >
            {localValue || "No texture assigned"}
          </div>
        </div>
      );

    case "Int":
      return (
        <div
          style={{
            marginBottom: theme.spacing.sm,
            padding: theme.spacing.sm,
            background: theme.colors.bg1,
            borderRadius: theme.radii.sm,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: theme.typography.size.xs,
              fontWeight: theme.typography.weight.medium,
              color: theme.colors.text1,
              marginBottom: theme.spacing.xs
            }}
          >
            {param.name} (Int)
          </label>
          <input
            type="number"
            step="1"
            value={localValue}
            onChange={(e) => setLocalValue(parseInt(e.target.value, 10) || 0)}
            onBlur={(e) => handleUpdate(parseInt(e.target.value, 10) || 0)}
            style={{
              width: "100%",
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              background: theme.colors.bg2,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii.sm,
              color: theme.colors.text0,
              fontSize: theme.typography.size.sm,
              fontFamily: "monospace"
            }}
          />
        </div>
      );

    default:
      return (
        <div
          style={{
            marginBottom: theme.spacing.sm,
            padding: theme.spacing.sm,
            background: theme.colors.bg1,
            borderRadius: theme.radii.sm,
            border: `1px solid ${theme.colors.border}`,
            fontSize: theme.typography.size.sm,
            color: theme.colors.text2
          }}
        >
          {param.name}: <em>Unsupported type ({param.type})</em>
        </div>
      );
  }
}

/**
 * Helper: Convert RGB object to hex string
 */
function rgbToHex(color: { r: number; g: number; b: number; a?: number }): string {
  const r = Math.round(Math.max(0, Math.min(1, color.r)) * 255);
  const g = Math.round(Math.max(0, Math.min(1, color.g)) * 255);
  const b = Math.round(Math.max(0, Math.min(1, color.b)) * 255);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Helper: Convert hex string to RGBA object
 */
function hexToRGBA(hex: string): { r: number; g: number; b: number; a: number } {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return { r, g, b, a: 1 };
}

