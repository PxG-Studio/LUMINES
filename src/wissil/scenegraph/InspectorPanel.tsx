/**
 * Inspector Panel
 * Unity-style inspector for selected objects
 * Dynamic component editor with live updates
 */

'use client';

import React, { useEffect, useState } from "react";
import { useSceneGraph } from "./SceneGraphStore";
import { Vector3Editor } from "./Vector3Editor";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { ComponentPatchEngine } from "./ComponentPatchEngine";

export interface InspectorPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function InspectorPanel({ className, style }: InspectorPanelProps) {
  const theme = useTheme();
  const selectedId = useSceneGraph((state) => state.selectedId);
  const node = useSceneGraph((state) => (selectedId ? state.getNode(selectedId) : undefined));

  if (!node) {
    return (
      <div
        className={className}
        style={{
          height: "100%",
          padding: theme.spacing.md,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.text2,
          fontSize: theme.typography.size.sm,
          ...style
        }}
      >
        No selection
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        height: "100%",
        overflow: "auto",
        background: theme.colors.bg0,
        ...style
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.bg1
        }}
      >
        <div
          style={{
            fontSize: theme.typography.size.md,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginBottom: theme.spacing.xs
          }}
        >
          {node.name || "Unnamed"}
        </div>
        {node.tag && (
          <div
            style={{
              fontSize: theme.typography.size.xs,
              color: theme.colors.text2
            }}
          >
            Tag: {node.tag}
          </div>
        )}
      </div>

      {/* Transform Section */}
      <div
        style={{
          padding: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`
        }}
      >
        <div
          style={{
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text1,
            marginBottom: theme.spacing.sm,
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          Transform
        </div>

        <Vector3Editor
          label="Position"
          field="position"
          nodeId={node.id}
          value={node.position}
          onChange={(value) => {
            // Update handled by Vector3Editor
          }}
        />

        <Vector3Editor
          label="Rotation"
          field="rotation"
          nodeId={node.id}
          value={node.rotation}
          onChange={(value) => {
            // Update handled by Vector3Editor
          }}
        />

        <Vector3Editor
          label="Scale"
          field="scale"
          nodeId={node.id}
          value={node.scale}
          onChange={(value) => {
            // Update handled by Vector3Editor
          }}
        />
      </div>

      {/* Components Section */}
      {node.components && node.components.length > 0 && (
        <div
          style={{
            padding: theme.spacing.md
          }}
        >
          <div
            style={{
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text1,
              marginBottom: theme.spacing.sm,
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}
          >
            Components ({node.components.length})
          </div>

          {node.components.map((componentType, index) => (
            <div
              key={index}
              style={{
                padding: theme.spacing.sm,
                marginBottom: theme.spacing.xs,
                background: theme.colors.bg1,
                borderRadius: theme.radii.sm,
                border: `1px solid ${theme.colors.border}`,
                fontSize: theme.typography.size.sm,
                color: theme.colors.text1
              }}
            >
              <div style={{ fontWeight: theme.typography.weight.medium }}>
                {componentType}
              </div>
              <div
                style={{
                  fontSize: theme.typography.size.xs,
                  color: theme.colors.text2,
                  marginTop: theme.spacing.xs
                }}
              >
                Component properties would appear here
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {(!node.components || node.components.length === 0) && (
        <div
          style={{
            padding: theme.spacing.md,
            textAlign: "center",
            color: theme.colors.text2,
            fontSize: theme.typography.size.sm,
            opacity: 0.6
          }}
        >
          No components
        </div>
      )}
    </div>
  );
}

