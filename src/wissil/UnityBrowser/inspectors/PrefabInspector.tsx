/**
 * Prefab Inspector Component
 * Displays Unity prefab structure and components
 */

'use client';

import React, { useState } from "react";
import { parseUnityPrefab } from "../parsers/unityYaml";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface PrefabInspectorProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export function PrefabInspector({ content, className, style }: PrefabInspectorProps) {
  const theme = useTheme();
  const [expandedComponents, setExpandedComponents] = useState<Set<number>>(new Set());

  const prefabData = parseUnityPrefab(content);
  const { gameObjects, components } = prefabData;

  const toggleComponent = (index: number) => {
    const newExpanded = new Set(expandedComponents);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedComponents(newExpanded);
  };

  if (gameObjects.length === 0) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.md,
          color: theme.colors.text2,
          ...style
        }}
      >
        No GameObject found in Prefab
      </div>
    );
  }

  const mainObject = gameObjects[0];

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
        Prefab: {mainObject.name}
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
        <div style={{ marginBottom: theme.spacing.xs }}>
          <strong>Name:</strong> {mainObject.name}
        </div>
        <div style={{ marginBottom: theme.spacing.xs }}>
          <strong>Active:</strong> {mainObject.active ? "Yes" : "No"}
        </div>
        <div>
          <strong>ID:</strong> {String(mainObject.id)}
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
        Components ({components.length})
      </h3>

      {components.length === 0 ? (
        <div
          style={{
            padding: theme.spacing.md,
            color: theme.colors.text2,
            opacity: 0.6
          }}
        >
          No components found
        </div>
      ) : (
        components.map((comp, i) => {
          const type = Object.keys(comp)[0];
          const isExpanded = expandedComponents.has(i);

          return (
            <div
              key={i}
              style={{
                padding: theme.spacing.md,
                marginBottom: theme.spacing.sm,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii.md,
                background: theme.colors.bg1,
                cursor: "pointer"
              }}
              onClick={() => toggleComponent(i)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.colors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: isExpanded ? theme.spacing.sm : 0
                }}
              >
                <strong style={{ color: theme.colors.text0 }}>{type}</strong>
                <span
                  style={{
                    fontSize: theme.typography.size.xs,
                    color: theme.colors.text2
                  }}
                >
                  {isExpanded ? "▼" : "▶"}
                </span>
              </div>

              {isExpanded && (
                <pre
                  style={{
                    background: theme.colors.bg2,
                    padding: theme.spacing.sm,
                    borderRadius: theme.radii.sm,
                    overflowX: "auto",
                    fontSize: theme.typography.size.sm,
                    color: theme.colors.text1,
                    fontFamily: "monospace",
                    margin: 0
                  }}
                >
                  {JSON.stringify(comp[type], null, 2)}
                </pre>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

