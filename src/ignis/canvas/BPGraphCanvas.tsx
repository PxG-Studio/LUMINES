/**
 * Blueprint Graph Canvas Component
 * 
 * Main canvas for node graph editing with pan/zoom/drag
 */

import React, { useState, useRef, useCallback } from 'react';
import { NodeRenderer, type NodeData } from '../nodes/NodeRenderer';
import { WireRenderer } from '../wires/WireRenderer';

export interface Graph {
  nodes: Record<string, NodeData>;
  connections: Array<{
    id: string;
    fromNode: string;
    fromSocket: string;
    toNode: string;
    toSocket: string;
  }>;
}

export interface BPGraphCanvasProps {
  graph?: Graph;
  onNodeDrag?: (nodeId: string, position: { x: number; y: number }) => void;
  onNodeSelect?: (nodeId: string) => void;
  selectedNodeId?: string;
}

export const BPGraphCanvas: React.FC<BPGraphCanvasProps> = ({
  graph = {
    nodes: {},
    connections: [],
  },
  onNodeDrag,
  onNodeSelect,
  selectedNodeId,
}) => {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
        setIsPanning(true);
        setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        e.preventDefault();
      }
    },
    [pan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
      }
    },
    [isPanning, startPan]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const scaleAmount = -e.deltaY * 0.001;
      const newZoom = Math.max(0.1, Math.min(3, zoom + scaleAmount));
      setZoom(newZoom);
    },
    [zoom]
  );

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--slate-bg, #0f1115)',
        position: 'relative',
        overflow: 'hidden',
        cursor: isPanning ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Grid Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(to right, var(--slate-border, #26292f) 1px, transparent 1px),
            linear-gradient(to bottom, var(--slate-border, #26292f) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
          opacity: 0.3,
        }}
      />

      {/* SVG Layer for Wires */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {graph.connections.map((connection) => {
          const fromNode = graph.nodes[connection.fromNode];
          const toNode = graph.nodes[connection.toNode];
          if (!fromNode || !toNode) return null;

          return (
            <WireRenderer
              key={connection.id}
              connection={connection}
              fromCoords={{
                x: fromNode.position.x + 140,
                y: fromNode.position.y + 40,
              }}
              toCoords={{
                x: toNode.position.x,
                y: toNode.position.y + 40,
              }}
            />
          );
        })}
      </svg>

      {/* Nodes Layer */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          pointerEvents: 'auto',
        }}
      >
        {Object.values(graph.nodes).map((node) => (
          <NodeRenderer
            key={node.id}
            node={node}
            selected={selectedNodeId === node.id}
            onDragStart={() => {
              // Handle drag start
            }}
            onSocketClick={(socketId, direction) => {
              // Handle socket click
            }}
          />
        ))}
      </div>

      {/* Empty State */}
      {Object.keys(graph.nodes).length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'var(--slate-text-muted, #9ba1aa)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 16, marginBottom: 8 }}>📋</div>
          <div>Drag nodes from palette</div>
        </div>
      )}
    </div>
  );
};

export default BPGraphCanvas;

