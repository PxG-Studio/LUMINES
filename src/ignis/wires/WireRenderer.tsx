/**
 * Wire Renderer Component
 * 
 * Renders Bezier SVG paths for node connections
 */

import React from 'react';

export interface Connection {
  id: string;
  fromNode: string;
  fromSocket: string;
  toNode: string;
  toSocket: string;
}

export interface WireRendererProps {
  connection: Connection;
  fromCoords: { x: number; y: number };
  toCoords: { x: number; y: number };
  socketType?: string;
  onRemove?: (connectionId: string) => void;
}

export const WireRenderer: React.FC<WireRendererProps> = ({
  connection,
  fromCoords,
  toCoords,
  socketType = 'exec',
  onRemove,
}) => {
  const { x: x1, y: y1 } = fromCoords;
  const { x: x2, y: y2 } = toCoords;

  const curveFactor = 50;
  const ctrlX1 = x1 + curveFactor;
  const ctrlY1 = y1;
  const ctrlX2 = x2 - curveFactor;
  const ctrlY2 = y2;

  const d = `M${x1},${y1} C${ctrlX1},${ctrlY1} ${ctrlX2},${ctrlY2} ${x2},${y2}`;

  const getWireColor = (type: string) => {
    switch (type) {
      case 'exec':
        return 'var(--wire-exec, #55aaff)';
      case 'float':
      case 'int':
        return 'var(--wire-number, #ffaa44)';
      case 'string':
        return 'var(--wire-string, #88ddff)';
      case 'bool':
        return 'var(--wire-bool, #ff5577)';
      case 'vector3':
        return 'var(--wire-vector, #77ee99)';
      case 'object':
        return 'var(--wire-object, #c09cff)';
      default:
        return 'var(--slate-text-muted, #9ba1aa)';
    }
  };

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={getWireColor(socketType)}
        strokeWidth="3"
        onClick={() => onRemove?.(connection.id)}
        style={{ cursor: 'pointer' }}
      />
      {/* Invisible wider path for easier clicking */}
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth="10"
        onClick={() => onRemove?.(connection.id)}
        style={{ cursor: 'pointer' }}
      />
    </g>
  );
};

export default WireRenderer;

