/**
 * Material Inspector Component
 * Displays Unity material properties
 */

'use client';

import React from "react";
import { parseUnityMaterial } from "../parsers/unityYaml";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface MaterialInspectorProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MaterialInspector({ content, className, style }: MaterialInspectorProps) {
  const theme = useTheme();
  const material = parseUnityMaterial(content);

  if (!material) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.md,
          color: theme.colors.text2,
          ...style
        }}
      >
        No material data found
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        padding: theme.spacing.md,
        height: "100%",
        overflow: "auto",
        ...style
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: theme.spacing.md,
          fontSize: theme.typography.size.lg,
          fontWeight: theme.typography.weight.semibold,
          color: theme.colors.text0
        }}
      >
        Material: {material.name}
      </h2>

      <div
        style={{
          marginBottom: theme.spacing.lg,
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <div style={{ marginBottom: theme.spacing.sm }}>
          <strong style={{ color: theme.colors.text0 }}>Shader:</strong>{" "}
          <span style={{ color: theme.colors.text1 }}>
            {material.shader || "Unknown"}
          </span>
        </div>
      </div>

      <h3
        style={{
          marginTop: theme.spacing.lg,
          marginBottom: theme.spacing.md,
          fontSize: theme.typography.size.md,
          fontWeight: theme.typography.weight.semibold,
          color: theme.colors.text0
        }}
      >
        Properties
      </h3>

      {Object.keys(material.properties).length === 0 ? (
        <div
          style={{
            padding: theme.spacing.md,
            color: theme.colors.text2,
            opacity: 0.6
          }}
        >
          No properties found
        </div>
      ) : (
        <pre
          style={{
            background: theme.colors.bg2,
            padding: theme.spacing.md,
            borderRadius: theme.radii.md,
            overflowX: "auto",
            fontSize: theme.typography.size.sm,
            color: theme.colors.text1,
            fontFamily: "monospace",
            border: `1px solid ${theme.colors.border}`
          }}
        >
          {JSON.stringify(material.properties, null, 2)}
        </pre>
      )}
    </div>
  );
}

