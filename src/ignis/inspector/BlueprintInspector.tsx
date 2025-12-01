/**
 * Blueprint Inspector Component
 * 
 * Right-hand panel for editing node properties
 */

import React from 'react';

export interface BlueprintInspectorProps {
  selectedNode?: {
    id: string;
    type: string;
    props?: Record<string, any>;
  };
}

export const BlueprintInspector: React.FC<BlueprintInspectorProps> = ({
  selectedNode,
}) => {
  if (!selectedNode) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--slate-panel, #16181d)',
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--slate-text-muted, #9ba1aa)',
          fontSize: 13,
        }}
      >
        Select a node to edit properties
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--slate-panel, #16181d)',
        overflow: 'auto',
        padding: 16,
      }}
    >
      <div
        style={{
          color: 'var(--slate-text, #e4e7eb)',
          fontWeight: 'bold',
          fontSize: 14,
          marginBottom: 16,
        }}
      >
        Inspector
      </div>

      {/* Node Type */}
      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            display: 'block',
            color: 'var(--slate-text-muted, #9ba1aa)',
            fontSize: 11,
            marginBottom: 4,
            textTransform: 'uppercase',
          }}
        >
          Node Type
        </label>
        <div
          style={{
            padding: '8px 12px',
            background: 'var(--slate-bg, #0f1115)',
            borderRadius: 4,
            color: 'var(--slate-text, #e4e7eb)',
            fontSize: 12,
          }}
        >
          {selectedNode.type}
        </div>
      </div>

      {/* Properties */}
      {selectedNode.props && Object.keys(selectedNode.props).length > 0 && (
        <div>
          <label
            style={{
              display: 'block',
              color: 'var(--slate-text-muted, #9ba1aa)',
              fontSize: 11,
              marginBottom: 8,
              textTransform: 'uppercase',
            }}
          >
            Properties
          </label>
          {Object.entries(selectedNode.props).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <label
                style={{
                  display: 'block',
                  color: 'var(--slate-text, #e4e7eb)',
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                {key}
              </label>
              <input
                type="text"
                defaultValue={String(value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: 'var(--slate-bg, #0f1115)',
                  border: '1px solid var(--slate-border, #26292f)',
                  borderRadius: 4,
                  color: 'var(--slate-text, #e4e7eb)',
                  fontSize: 12,
                  outline: 'none',
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlueprintInspector;

