/**
 * Node Renderer
 * UI component for rendering individual nodes
 */

'use client';

import React, { useRef, useState } from "react";
import { Node, Socket } from "../schema/NodeSchema";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { NodeLibrary } from "../library/NodeLibrary";

export interface NodeRendererProps {
  node: Node;
  selected?: boolean;
  onDragStart?: (nodeId: string, e: React.MouseEvent) => void;
  onDrag?: (nodeId: string, e: React.MouseEvent) => void;
  onDragEnd?: (nodeId: string) => void;
  onSocketClick?: (nodeId: string, socketId: string, direction: "input" | "output") => void;
  onNodeClick?: (nodeId: string, e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function NodeRenderer({
  node,
  selected = false,
  onDragStart,
  onDrag,
  onDragEnd,
  onSocketClick,
  onNodeClick,
  className,
  style
}: NodeRendererProps) {
  const theme = useTheme();
  const nodeDef = NodeLibrary.get(node.type);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only

    const rect = nodeRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    onDragStart?.(node.id, e);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      onDrag?.(node.id, moveEvent as any);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd?.(node.id);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const getSocketColor = (socket: Socket): string => {
    const colors: Record<string, string> = {
      exec: "#FFD700",
      bool: "#FF6B6B",
      int: "#4ECDC4",
      float: "#45B7D1",
      string: "#96CEB4",
      vector3: "#FFEAA7",
      object: "#DDA0DD",
      any: "#95A5A6"
    };
    return colors[socket.type] || colors.any;
  };

  const nodeColor = nodeDef?.color || node.color || theme.colors.accent || "#4A90E2";

  return (
    <div
      ref={nodeRef}
      className={className}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        if (!isDragging) {
          onNodeClick?.(node.id, e);
        }
      }}
      style={{
        position: "absolute",
        left: node.position.x,
        top: node.position.y,
        minWidth: 200,
        background: theme.colors.bg2,
        border: `2px solid ${selected ? nodeColor : theme.colors.border}`,
        borderRadius: theme.radii.md,
        boxShadow: selected
          ? `0 0 0 2px ${nodeColor}40, 0 4px 12px rgba(0,0,0,0.3)`
          : "0 2px 8px rgba(0,0,0,0.2)",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        ...style
      }}
    >
      {/* Title Bar */}
      <div
        style={{
          background: nodeColor,
          color: "#fff",
          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
          borderRadius: `${theme.radii.md}px ${theme.radii.md}px 0 0`,
          fontSize: theme.typography.size.sm,
          fontWeight: theme.typography.weight.semibold
        }}
      >
        {node.title}
      </div>

      {/* Content */}
      <div style={{ padding: theme.spacing.sm }}>
        {/* Inputs */}
        {node.inputs.map((socket, index) => (
          <div
            key={socket.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.xs,
              marginBottom: index < node.inputs.length - 1 ? theme.spacing.xs : 0
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSocketClick?.(node.id, socket.id, "input");
              }}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: getSocketColor(socket),
                border: `2px solid ${theme.colors.bg2}`,
                cursor: "pointer",
                flexShrink: 0
              }}
              title={`${socket.name} (${socket.type})`}
            />
            <div
              style={{
                fontSize: theme.typography.size.sm,
                color: theme.colors.text1,
                flex: 1
              }}
            >
              {socket.name}
            </div>
          </div>
        ))}

        {/* Outputs */}
        {node.outputs.map((socket, index) => (
          <div
            key={socket.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.xs,
              marginTop: index > 0 ? theme.spacing.xs : theme.spacing.sm,
              justifyContent: "flex-end"
            }}
          >
            <div
              style={{
                fontSize: theme.typography.size.xs,
                color: theme.colors.text1,
                flex: 1,
                textAlign: "right"
              }}
            >
              {socket.name}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSocketClick?.(node.id, socket.id, "output");
              }}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: getSocketColor(socket),
                border: `2px solid ${theme.colors.bg2}`,
                cursor: "pointer",
                flexShrink: 0
              }}
              title={`${socket.name} (${socket.type})`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

