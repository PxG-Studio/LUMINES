/**
 * Gizmos Overlay
 * Draws Unity-style gizmos on top of WebGL canvas
 * Selection boxes, position handles, axis lines
 */

'use client';

import React from "react";
import { useSceneGraph } from "./SceneGraphStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface GizmosOverlayProps {
  canvasRef?: React.RefObject<HTMLDivElement>;
  className?: string;
  style?: React.CSSProperties;
}

export function GizmosOverlay({
  canvasRef,
  className,
  style
}: GizmosOverlayProps) {
  const theme = useTheme();
  const selectedId = useSceneGraph((state) => state.selectedId);
  const hoveredId = useSceneGraph((state) => state.hoveredId);

  // Gizmos are rendered as HTML overlays
  // In a full implementation, these would be positioned based on Unity world coordinates
  // For now, this is a placeholder structure

  if (!selectedId && !hoveredId) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 1000,
        ...style
      }}
    >
      {/* Selection Box */}
      {selectedId && (
        <div
          style={{
            position: "absolute",
            border: `2px solid ${theme.colors.accent || "#3b82f6"}`,
            borderRadius: theme.radii.sm,
            pointerEvents: "none"
          }}
        >
          {/* Axis Lines */}
          <div
            style={{
              position: "absolute",
              width: "1px",
              height: "20px",
              background: theme.colors.error || "#ef4444",
              opacity: 0.8
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "20px",
              height: "1px",
              background: theme.colors.success || "#4ade80",
              opacity: 0.8
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              background: theme.colors.accent || "#3b82f6",
              opacity: 0.8
            }}
          />
        </div>
      )}

      {/* Hover Highlight */}
      {hoveredId && hoveredId !== selectedId && (
        <div
          style={{
            position: "absolute",
            border: `1px dashed ${theme.colors.text2 || "#6b7280"}`,
            borderRadius: theme.radii.sm,
            pointerEvents: "none",
            opacity: 0.5
          }}
        />
      )}
    </div>
  );
}

/**
 * Transform Gizmo Component
 * Unity-style transform handles (Move, Rotate, Scale)
 * This is a placeholder for future implementation
 */
export function TransformGizmo({
  nodeId,
  position
}: {
  nodeId: string;
  position: { x: number; y: number; z: number };
}) {
  const theme = useTheme();

  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        userSelect: "none"
      }}
    >
      {/* Move Handle X */}
      <div
        style={{
          position: "absolute",
          width: "40px",
          height: "2px",
          background: theme.colors.error || "#ef4444",
          cursor: "move",
          pointerEvents: "auto"
        }}
      />

      {/* Move Handle Y */}
      <div
        style={{
          position: "absolute",
          width: "2px",
          height: "40px",
          background: theme.colors.success || "#4ade80",
          cursor: "move",
          pointerEvents: "auto"
        }}
      />

      {/* Move Handle Z */}
      <div
        style={{
          position: "absolute",
          width: "2px",
          height: "40px",
          background: theme.colors.accent || "#3b82f6",
          cursor: "move",
          pointerEvents: "auto"
        }}
      />
    </div>
  );
}

