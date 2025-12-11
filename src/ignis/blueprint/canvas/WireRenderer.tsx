/**
 * Wire Renderer
 * Bezier curve connections between sockets
 */

'use client';

import React, { useMemo } from "react";
import { Connection, Socket } from "../schema/NodeSchema";
import { Node } from "../schema/NodeSchema";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface WireRendererProps {
  connection: Connection;
  fromNode: Node;
  toNode: Node;
  fromSocket: Socket;
  toSocket: Socket;
  active?: boolean;
  selected?: boolean;
  onClick?: (connectionId: string) => void;
}

/**
 * Calculate Bezier control points for wire
 */
function calculateBezierPath(
  fromPos: { x: number; y: number },
  toPos: { x: number; y: number }
): string {
  const dx = toPos.x - fromPos.x;
  const offsetX = Math.max(50, Math.abs(dx) * 0.5);

  const cp1x = fromPos.x + offsetX;
  const cp1y = fromPos.y;
  const cp2x = toPos.x - offsetX;
  const cp2y = toPos.y;

  return `M ${fromPos.x} ${fromPos.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toPos.x} ${toPos.y}`;
}

/**
 * Get socket screen position
 */
function getSocketPosition(
  node: Node,
  socket: Socket,
  nodeBounds?: DOMRect
): { x: number; y: number } {
  if (!nodeBounds) {
    // Fallback: estimate position
    const socketIndex =
      socket.direction === "input"
        ? node.inputs.findIndex((s) => s.id === socket.id)
        : node.outputs.findIndex((s) => s.id === socket.id);
    const offsetY = socketIndex * 24 + 40; // Rough estimate

    return {
      x: socket.direction === "input" ? node.position.x : node.position.x + 200,
      y: node.position.y + offsetY
    };
  }

  // Calculate based on actual node position
  const socketIndex =
    socket.direction === "input"
      ? node.inputs.findIndex((s) => s.id === socket.id)
      : node.outputs.findIndex((s) => s.id === socket.id);

  const titleBarHeight = 32;
  const socketSpacing = 24;
  const socketSize = 12;
  const socketOffset = socket.direction === "input" ? 0 : nodeBounds.width;

  return {
    x: nodeBounds.left + socketOffset,
    y: nodeBounds.top + titleBarHeight + socketIndex * socketSpacing + socketSize / 2
  };
}

export function WireRenderer({
  connection,
  fromNode,
  toNode,
  fromSocket,
  toSocket,
  active = false,
  selected = false,
  onClick
}: WireRendererProps) {
  const theme = useTheme();

  // Get socket positions (simplified - would use refs in full implementation)
  const fromPos = getSocketPosition(fromNode, fromSocket);
  const toPos = getSocketPosition(toNode, toSocket);

  const path = useMemo(() => calculateBezierPath(fromPos, toPos), [fromPos, toPos]);

  const getWireColor = (): string => {
    if (active) return "#FFD700"; // Gold for active execution
    if (selected) return theme.colors.accent || "#4A90E2";
    if (fromSocket.type === "exec") return "#FFD700";
    return theme.colors.text2 || "#666";
  };

  const strokeWidth = active || selected ? 3 : 2;

  return (
    <g
      onClick={() => onClick?.(connection.id)}
      style={{ cursor: "pointer" }}
    >
      {/* Wire path */}
      <path
        d={path}
        fill="none"
        stroke={getWireColor()}
        strokeWidth={strokeWidth}
        strokeDasharray={active ? "5,5" : "0"}
        opacity={active ? 1 : 0.8}
      />
      {/* Hit area (wider invisible path for easier clicking) */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={strokeWidth + 8}
        style={{ pointerEvents: "all" }}
      />
    </g>
  );
}

