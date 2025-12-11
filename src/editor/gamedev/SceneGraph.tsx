/**
 * Scene Graph Component
 * 
 * Visual representation of Unity scene hierarchy
 * Similar to Unity's Hierarchy panel
 */

'use client';

import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronDown, Box, Camera, Sun, Layers } from 'lucide-react';

export interface SceneNode {
  id: string;
  name: string;
  type: 'GameObject' | 'Camera' | 'Light' | 'Mesh' | 'Empty';
  children?: SceneNode[];
  active: boolean;
  selected?: boolean;
}

export interface SceneGraphProps {
  root?: SceneNode;
  onNodeSelect?: (node: SceneNode) => void;
  onNodeToggle?: (node: SceneNode) => void;
}

const SceneNodeComponent: React.FC<{
  node: SceneNode;
  level: number;
  expanded: Set<string>;
  onToggle: (node: SceneNode) => void;
  onSelect: (node: SceneNode) => void;
}> = ({ node, level, expanded, onToggle, onSelect }) => {
  const isExpanded = expanded.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  const getIcon = () => {
    switch (node.type) {
      case 'Camera':
        return <Camera size={14} />;
      case 'Light':
        return <Sun size={14} />;
      case 'Mesh':
        return <Layers size={14} />;
      default:
        return <Box size={14} />;
    }
  };

  return (
    <div>
      <div
        onClick={() => onSelect(node)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 8px',
          paddingLeft: `${level * 16 + 8}px`,
          background: node.selected
            ? 'rgba(63, 140, 255, 0.2)'
            : 'transparent',
          cursor: 'pointer',
          fontSize: 12,
          color: node.active
            ? 'var(--slate-text, #e4e7eb)'
            : 'var(--slate-text-muted, #9ba1aa)',
        }}
        onMouseEnter={(e) => {
          if (!node.selected) {
            e.currentTarget.style.background = 'var(--slate-panel-hover, #1e2127)';
          }
        }}
        onMouseLeave={(e) => {
          if (!node.selected) {
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              color: 'var(--slate-text-muted, #9ba1aa)',
            }}
          >
            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        ) : (
          <div style={{ width: 12 }} />
        )}
        <div style={{ color: 'var(--slate-text-muted, #9ba1aa)' }}>
          {getIcon()}
        </div>
        <span
          style={{
            opacity: node.active ? 1 : 0.5,
            textDecoration: node.active ? 'none' : 'line-through',
          }}
        >
          {node.name}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <SceneNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const SceneGraph: React.FC<SceneGraphProps> = ({
  root,
  onNodeSelect,
  onNodeToggle,
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<SceneNode | null>(null);

  const handleToggle = useCallback(
    (node: SceneNode) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
        return next;
      });
      onNodeToggle?.(node);
    },
    [onNodeToggle]
  );

  const handleSelect = useCallback(
    (node: SceneNode) => {
      setSelectedNode(node);
      onNodeSelect?.(node);
    },
    [onNodeSelect]
  );

  if (!root) {
    return (
      <div
        style={{
          padding: 16,
          textAlign: 'center',
          color: 'var(--slate-text-muted, #9ba1aa)',
          fontSize: 12,
        }}
      >
        No scene loaded
      </div>
    );
  }

  // Mark selected node
  const markSelected = (node: SceneNode): SceneNode => ({
    ...node,
    selected: node.id === selectedNode?.id,
    children: node.children?.map(markSelected),
  });

  const rootWithSelection = markSelected(root);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--slate-panel, #16181d)',
        border: '1px solid var(--slate-border, #26292f)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid var(--slate-border, #26292f)',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--slate-text, #e4e7eb)',
        }}
      >
        Hierarchy
      </div>

      {/* Scene Tree */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 4,
        }}
      >
        <SceneNodeComponent
          node={rootWithSelection}
          level={0}
          expanded={expanded}
          onToggle={handleToggle}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
};

export default SceneGraph;

