/**
 * Node Palette Component
 * 
 * Searchable node library for adding nodes to canvas
 */

import React, { useState } from 'react';

export interface NodeDefinition {
  type: string;
  title: string;
  category: string;
  description?: string;
  icon?: string;
}

export interface NodePaletteProps {
  nodes?: NodeDefinition[];
  onNodeSelect?: (nodeType: string) => void;
  searchPlaceholder?: string;
}

export const NodePalette: React.FC<NodePaletteProps> = ({
  nodes = [
    { type: 'Add', title: 'Add', category: 'Math', icon: '➕' },
    { type: 'Branch', title: 'Branch', category: 'Flow', icon: '🔀' },
    { type: 'Print', title: 'Print', category: 'Debug', icon: '📝' },
    { type: 'Delay', title: 'Delay', category: 'Flow', icon: '⏱️' },
    { type: 'Start', title: 'Start', category: 'Events', icon: '▶️' },
  ],
  onNodeSelect,
  searchPlaceholder = 'Search nodes...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodes = nodes.filter(
    (node) =>
      node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorizedNodes = filteredNodes.reduce(
    (acc, node) => {
      if (!acc[node.category]) {
        acc[node.category] = [];
      }
      acc[node.category].push(node);
      return acc;
    },
    {} as Record<string, NodeDefinition[]>
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--slate-panel, #16181d)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Search */}
      <div style={{ padding: 12, borderBottom: '1px solid var(--slate-border, #26292f)' }}>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Node List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {Object.entries(categorizedNodes).map(([category, categoryNodes]) => (
          <div key={category} style={{ marginBottom: 16 }}>
            <div
              style={{
                color: 'var(--slate-text-muted, #9ba1aa)',
                fontSize: 11,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: 8,
                padding: '0 8px',
              }}
            >
              {category}
            </div>
            {categoryNodes.map((node) => (
              <div
                key={node.type}
                onClick={() => onNodeSelect?.(node.type)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  color: 'var(--slate-text, #e4e7eb)',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 2,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--slate-bg, #0f1115)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {node.icon && <span>{node.icon}</span>}
                <div style={{ flex: 1 }}>
                  <div>{node.title}</div>
                  {node.description && (
                    <div
                      style={{
                        fontSize: 10,
                        color: 'var(--slate-text-muted, #9ba1aa)',
                      }}
                    >
                      {node.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodePalette;

