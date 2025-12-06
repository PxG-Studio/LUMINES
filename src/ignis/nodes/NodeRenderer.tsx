/**
 * Node Renderer Component
 * 
 * Renders individual blueprint nodes
 */

import React from 'react';

export interface Socket {
  id: string;
  name: string;
  type: string;
  direction: 'input' | 'output';
}

export interface NodeData {
  id: string;
  type: string;
  position: { x: number; y: number };
  inputs?: Socket[];
  outputs?: Socket[];
  props?: Record<string, any>;
  nodeType?: 'exec' | 'data' | 'event';
}

export interface NodeRendererProps {
  node: NodeData;
  selected?: boolean;
  onDragStart?: (e: React.MouseEvent) => void;
  onSocketClick?: (socketId: string, direction: 'input' | 'output') => void;
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({
  node,
  selected = false,
  onDragStart,
  onSocketClick,
}) => {
  const getNodeColor = (nodeType?: string) => {
    switch (nodeType) {
      case 'exec':
        return 'var(--node-header-exec, #4A90E2)';
      case 'data':
        return 'var(--node-header-data, #7B68EE)';
      case 'event':
        return 'var(--node-header-event, #FFD700)';
      default:
        return 'var(--node-header, #23262d)';
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        minWidth: 150,
        background: 'var(--node-bg, #1b1e24)',
        border: selected
          ? '2px solid var(--slate-accent, #3f8cff)'
          : '1px solid var(--node-border, #2a2d35)',
        borderRadius: 8,
        boxShadow: selected
          ? '0 0 0 2px rgba(63, 140, 255, 0.2)'
          : 'var(--shadow-md, 0 4px 8px rgba(0,0,0,0.25))',
        cursor: 'grab',
        userSelect: 'none',
      }}
      onMouseDown={onDragStart}
    >
      {/* Header */}
      <div
        style={{
          background: getNodeColor(node.nodeType),
          padding: '8px 12px',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          color: 'white',
          fontWeight: 'bold',
          fontSize: 13,
        }}
      >
        {node.type}
      </div>

      {/* Content */}
      <div style={{ padding: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {/* Inputs */}
          <div>
            {node.inputs?.map((input) => (
              <div
                key={input.id}
                onClick={() => onSocketClick?.(input.id, 'input')}
                style={{
                  marginBottom: 4,
                  fontSize: 11,
                  color: 'var(--slate-text, #e4e7eb)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--wire-exec, #55aaff)',
                    border: '1px solid var(--node-border, #2a2d35)',
                  }}
                />
                {input.name}
              </div>
            ))}
          </div>

          {/* Outputs */}
          <div style={{ textAlign: 'right' }}>
            {node.outputs?.map((output) => (
              <div
                key={output.id}
                onClick={() => onSocketClick?.(output.id, 'output')}
                style={{
                  marginBottom: 4,
                  fontSize: 11,
                  color: 'var(--slate-text, #e4e7eb)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 4,
                }}
              >
                {output.name}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--wire-exec, #55aaff)',
                    border: '1px solid var(--node-border, #2a2d35)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Props */}
        {node.props && Object.keys(node.props).length > 0 && (
          <div
            style={{
              borderTop: '1px solid var(--node-border, #2a2d35)',
              paddingTop: 8,
              fontSize: 11,
              color: 'var(--slate-text-muted, #9ba1aa)',
            }}
          >
            {Object.entries(node.props).map(([key, value]) => (
              <div key={key} style={{ marginBottom: 4 }}>
                {key}: {String(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeRenderer;

