/**
 * Prefab Component Inspector
 * Displays and edits prefab components
 */

'use client';

import React, { useState } from "react";
import { usePrefabStore } from "./PrefabStore";
import { PrefabData } from "./PrefabTypes";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface PrefabInspectorProps {
  prefabId?: string | null;
  nodeId?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export function PrefabInspector({
  prefabId,
  nodeId,
  className,
  style
}: PrefabInspectorProps) {
  const theme = useTheme();
  const selectedPrefab = usePrefabStore((state) => state.selected);
  const prefab = usePrefabStore((state) =>
    (prefabId || selectedPrefab) ? state.getPrefab(prefabId || selectedPrefab || "") : undefined
  );

  if (!prefab) {
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
        Select a prefab to inspect
      </div>
    );
  }

  // Find specific node if nodeId is provided
  const findNode = (data: PrefabData, id: string): PrefabData | null => {
    if (data.id === id) return data;
    for (const child of data.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  const node = nodeId ? findNode(prefab, nodeId) : prefab;

  if (!node) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.md,
          color: theme.colors.text2,
          fontSize: theme.typography.size.sm,
          ...style
        }}
      >
        Node not found
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
          {node.name}
        </h3>
        {node.id && (
          <div
            style={{
              fontSize: theme.typography.size.xs,
              color: theme.colors.text2,
              marginTop: theme.spacing.xs,
              fontFamily: "monospace"
            }}
          >
            ID: {node.id}
          </div>
        )}
      </div>

      {/* Transform */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div
          style={{
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginBottom: theme.spacing.sm
          }}
        >
          Transform
        </div>
        <div
          style={{
            fontSize: theme.typography.size.xs,
            fontFamily: "monospace",
            color: theme.colors.text1
          }}
        >
          <div style={{ marginBottom: theme.spacing.xs }}>
            <strong>Position:</strong> X: {node.transform.pos.x.toFixed(2)}, Y:{" "}
            {node.transform.pos.y.toFixed(2)}, Z: {node.transform.pos.z.toFixed(2)}
          </div>
          <div style={{ marginBottom: theme.spacing.xs }}>
            <strong>Rotation:</strong> X: {node.transform.rot.x.toFixed(2)}°, Y:{" "}
            {node.transform.rot.y.toFixed(2)}°, Z: {node.transform.rot.z.toFixed(2)}°
          </div>
          <div>
            <strong>Scale:</strong> X: {node.transform.scale.x.toFixed(2)}, Y:{" "}
            {node.transform.scale.y.toFixed(2)}, Z: {node.transform.scale.z.toFixed(2)}
          </div>
        </div>
      </Card>

      {/* Components */}
      {node.components && node.components.length > 0 && (
        <Card style={{ padding: theme.spacing.md }}>
          <div
            style={{
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0,
              marginBottom: theme.spacing.sm
            }}
          >
            Components ({node.components.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.sm }}>
            {node.components.map((component, i) => (
              <Card
                key={i}
                style={{
                  padding: theme.spacing.sm,
                  background: theme.colors.bg1,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.size.sm,
                    fontWeight: theme.typography.weight.medium,
                    color: theme.colors.text0,
                    marginBottom: theme.spacing.xs
                  }}
                >
                  {component.type}
                </div>
                <pre
                  style={{
                    fontSize: theme.typography.size.xs,
                    fontFamily: "monospace",
                    background: theme.colors.bg2,
                    padding: theme.spacing.xs,
                    borderRadius: theme.radii.sm,
                    overflow: "auto",
                    maxHeight: 200,
                    color: theme.colors.text1
                  }}
                >
                  {component.json ? JSON.stringify(JSON.parse(component.json), null, 2) : "No data"}
                </pre>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

