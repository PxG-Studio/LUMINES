/**
 * Blueprint Graph Canvas
 * Main pan/zoom workspace with drag & drop
 */

'use client';

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useBPGraphStore } from "../store/BPGraphStore";
import { NodeRenderer } from "./NodeRenderer";
import { WireRenderer } from "./WireRenderer";
import { NodeLibrary } from "../library/NodeLibrary";
import { Node, Connection, Socket } from "../schema/NodeSchema";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { NodePalette } from "../palette/NodePalette";
import { SplitView } from "@/design-system/primitives/SplitView";

export interface BPGraphCanvasProps {
  graphId?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function BPGraphCanvas({ graphId, className, style }: BPGraphCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const currentGraphId = useBPGraphStore((state) => state.currentGraphId || graphId);
  const graph = useBPGraphStore((state) => state.getCurrentGraph());
  const selectedNodes = useBPGraphStore((state) => state.selectedNodes);
  const addNode = useBPGraphStore((state) => state.addNode);
  const updateNode = useBPGraphStore((state) => state.updateNode);
  const moveNode = useBPGraphStore((state) => state.moveNode);
  const removeNode = useBPGraphStore((state) => state.removeNode);
  const addConnection = useBPGraphStore((state) => state.addConnection);
  const removeConnection = useBPGraphStore((state) => state.removeConnection);
  const selectNode = useBPGraphStore((state) => state.selectNode);
  const clearSelection = useBPGraphStore((state) => state.clearSelection);
  const duplicateNode = useBPGraphStore((state) => state.duplicateNode);

  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<{
    fromNodeId: string;
    fromSocketId: string;
    toPos: { x: number; y: number };
  } | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        selectedNodes.forEach((nodeId) => {
          if (currentGraphId) {
            removeNode(currentGraphId, nodeId);
          }
        });
      } else if (e.key === "d" && (e.ctrlKey || e.metaKey)) {
        selectedNodes.forEach((nodeId) => {
          if (currentGraphId && selectedNodes.size === 1) {
            duplicateNode(currentGraphId, nodeId);
          }
        });
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodes, currentGraphId, removeNode, duplicateNode]);

  // Handle panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      // Middle mouse or Shift+Left click for panning
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewOffset.x, y: e.clientY - viewOffset.y });
      e.preventDefault();
    } else if (e.button === 0 && e.target === canvasRef.current) {
      // Left click on empty space
      clearSelection();
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      setViewOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (isPanning) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isPanning, handleMouseMove, handleMouseUp]);

  // Handle zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.1, Math.min(3, prev * delta)));
  };

  // Handle node creation from palette
  const handlePaletteNodeSelect = (nodeType: string) => {
    if (!currentGraphId) return;

    const nodeDef = NodeLibrary.get(nodeType);
    if (!nodeDef) return;

    const newNode = nodeDef.create();
    newNode.id = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    newNode.position = {
      x: 100 - viewOffset.x / zoom,
      y: 100 - viewOffset.y / zoom
    };

    addNode(currentGraphId, newNode);
    selectNode(newNode.id, false);
  };

  // Handle node dragging
  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    setDraggingNode(nodeId);
    if (!selectedNodes.has(nodeId)) {
      selectNode(nodeId, false);
    }
  };

  const handleNodeDrag = (nodeId: string, e: MouseEvent) => {
    if (!currentGraphId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = (e.clientX - rect.left - viewOffset.x) / zoom;
    const newY = (e.clientY - rect.top - viewOffset.y) / zoom;

    // Snap to grid
    const gridSize = 10;
    const snappedX = Math.round(newX / gridSize) * gridSize;
    const snappedY = Math.round(newY / gridSize) * gridSize;

    moveNode(currentGraphId, nodeId, { x: snappedX, y: snappedY });
  };

  const handleNodeDragEnd = () => {
    setDraggingNode(null);
  };

  // Handle socket connections
  const handleSocketClick = (nodeId: string, socketId: string, direction: "input" | "output") => {
    if (!currentGraphId || !graph) return;

    const node = graph.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const socket = [...node.inputs, ...node.outputs].find((s) => s.id === socketId);
    if (!socket) return;

    if (connecting) {
      // Completing connection
      if (
        connecting.fromNodeId !== nodeId &&
        ((direction === "input" && connecting.fromSocketId !== socketId) ||
          (direction === "output" && connecting.fromSocketId === socketId))
      ) {
        // Valid connection
        const fromNode = graph.nodes.find((n) => n.id === connecting.fromNodeId);
        const fromSocket = fromNode?.outputs.find((s) => s.id === connecting.fromSocketId);

        if (fromNode && fromSocket && direction === "input") {
          // Type compatibility check (simplified)
          if (socket.type === "any" || fromSocket.type === "any" || socket.type === fromSocket.type) {
            const connection: Connection = {
              id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              fromNodeId: connecting.fromNodeId,
              fromSocketId: connecting.fromSocketId,
              toNodeId: nodeId,
              toSocketId: socketId
            };
            addConnection(currentGraphId, connection);
          }
        }
      }
      setConnecting(null);
    } else if (direction === "output") {
      // Starting connection
      setConnecting({
        fromNodeId: nodeId,
        fromSocketId: socketId,
        toPos: { x: 0, y: 0 } // Will be updated on mouse move
      });
    }
  };

  if (!graph) {
    return (
      <div
        style={{
          padding: theme.spacing.md,
          textAlign: "center",
          color: theme.colors.text2,
          ...style
        }}
      >
        No graph loaded. Create a new blueprint graph.
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "row",
        background: theme.colors.bg0,
        ...style
      }}
    >
      {/* Node Palette Sidebar */}
      <div style={{ width: 250, borderRight: `1px solid ${theme.colors.border}` }}>
        <NodePalette onSelectNode={handlePaletteNodeSelect} />
      </div>

      {/* Main Canvas */}
      <div
        ref={canvasRef}
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background: `repeating-linear-gradient(
            0deg,
            ${theme.colors.bg1}00,
            ${theme.colors.bg1}00 19px,
            ${theme.colors.border}40 19px,
            ${theme.colors.border}40 20px
          ),
          repeating-linear-gradient(
            90deg,
            ${theme.colors.bg1}00,
            ${theme.colors.bg1}00 19px,
            ${theme.colors.border}40 19px,
            ${theme.colors.border}40 20px
          )`,
          cursor: isPanning ? "grabbing" : draggingNode ? "grabbing" : "default"
        }}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* SVG layer for wires (behind nodes) */}
        <svg
          ref={svgRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0
          }}
        >
          <g transform={`translate(${viewOffset.x}, ${viewOffset.y}) scale(${zoom})`}>
            {/* Render wires */}
            {graph.connections.map((conn) => {
              const fromNode = graph.nodes.find((n) => n.id === conn.fromNodeId);
              const toNode = graph.nodes.find((n) => n.id === conn.toNodeId);
              if (!fromNode || !toNode) return null;

              const fromSocket = fromNode.outputs.find((s) => s.id === conn.fromSocketId);
              const toSocket = toNode.inputs.find((s) => s.id === conn.toSocketId);
              if (!fromSocket || !toSocket) return null;

              return (
                <WireRenderer
                  key={conn.id}
                  connection={conn}
                  fromNode={fromNode}
                  toNode={toNode}
                  fromSocket={fromSocket}
                  toSocket={toSocket}
                />
              );
            })}
          </g>
        </svg>

        {/* Nodes layer (on top) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: `translate(${viewOffset.x}px, ${viewOffset.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            zIndex: 1
          }}
        >
          {graph.nodes.map((node) => (
            <NodeRenderer
              key={node.id}
              node={node}
              selected={selectedNodes.has(node.id)}
              onDragStart={handleNodeDragStart}
              onDrag={handleNodeDrag}
              onDragEnd={handleNodeDragEnd}
              onSocketClick={handleSocketClick}
              onNodeClick={(nodeId, e: React.MouseEvent<Element>) => {
                if (e.shiftKey) {
                  selectNode(nodeId, true);
                } else {
                  selectNode(nodeId, false);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

