/**
 * Vector3 Editor
 * Edits Vector3 values (position, rotation, scale) in the Inspector
 */

'use client';

import React, { useState } from "react";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { ComponentPatchEngine } from "./ComponentPatchEngine";

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Vector3EditorProps {
  label: string;
  field: "position" | "rotation" | "scale";
  nodeId: string;
  value: Vector3;
  onChange?: (value: Vector3) => void;
}

export function Vector3Editor({
  label,
  field,
  nodeId,
  value,
  onChange
}: Vector3EditorProps) {
  const theme = useTheme();
  const [localValue, setLocalValue] = useState<Vector3>(value);

  const handleChange = (axis: "x" | "y" | "z", val: string) => {
    const numVal = parseFloat(val) || 0;
    const newValue = { ...localValue, [axis]: numVal };
    setLocalValue(newValue);

    // Update Unity immediately
    ComponentPatchEngine.setTransform(nodeId, field, newValue);

    // Call onChange callback
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleBlur = (axis: "x" | "y" | "z", e: React.FocusEvent<HTMLInputElement>) => {
    handleChange(axis, e.target.value);
  };

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
        {label}
      </label>
      <div style={{ display: "flex", gap: theme.spacing.xs }}>
        {/* X */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: theme.typography.size.xs,
              color: theme.colors.error || "#ef4444",
              marginBottom: 2
            }}
          >
            X
          </div>
          <input
            type="number"
            value={localValue.x}
            onChange={(e) => handleChange("x", e.target.value)}
            onBlur={(e) => handleBlur("x", e)}
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

        {/* Y */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: theme.typography.size.xs,
              color: theme.colors.success || "#4ade80",
              marginBottom: 2
            }}
          >
            Y
          </div>
          <input
            type="number"
            value={localValue.y}
            onChange={(e) => handleChange("y", e.target.value)}
            onBlur={(e) => handleBlur("y", e)}
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

        {/* Z */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: theme.typography.size.xs,
              color: theme.colors.accent || "#3b82f6",
              marginBottom: 2
            }}
          >
            Z
          </div>
          <input
            type="number"
            value={localValue.z}
            onChange={(e) => handleChange("z", e.target.value)}
            onBlur={(e) => handleBlur("z", e)}
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
      </div>
    </div>
  );
}

