/**
 * File Tree Component
 * 
 * Recursive file/folder tree with expand/collapse
 */

import React, { useState } from 'react';

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path?: string;
}

export interface FileTreeProps {
  files?: FileNode[];
  onFileSelect?: (path: string) => void;
  expandedPaths?: Set<string>;
  defaultExpanded?: string[];
}

export const FileTree: React.FC<FileTreeProps> = ({
  files = [
    {
      name: 'Blueprints',
      type: 'folder',
      path: '/Blueprints',
      children: [
        { name: 'TurnSystem.json', type: 'file', path: '/Blueprints/TurnSystem.json' },
        { name: 'CardLogic.json', type: 'file', path: '/Blueprints/CardLogic.json' },
      ],
    },
    {
      name: 'Templates',
      type: 'folder',
      path: '/Templates',
      children: [],
    },
    {
      name: 'Assets',
      type: 'folder',
      path: '/Assets',
      children: [
        {
          name: 'Sprites',
          type: 'folder',
          path: '/Assets/Sprites',
          children: [],
        },
      ],
    },
  ],
  onFileSelect,
  defaultExpanded = ['/Blueprints'],
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));

  const toggle = (path: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };

  const renderNode = (node: FileNode, depth = 0): React.ReactNode => {
    const path = node.path || `/${node.name}`;
    const isExpanded = expanded.has(path);
    const isFolder = node.type === 'folder';

    return (
      <div key={path}>
        <div
          onClick={() => {
            if (isFolder) {
              toggle(path);
            } else {
              onFileSelect?.(path);
            }
          }}
          style={{
            padding: '4px 8px',
            paddingLeft: `${depth * 16 + 8}px`,
            cursor: 'pointer',
            color: 'var(--slate-text, #e4e7eb)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontFamily: 'var(--font-mono, monospace)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--slate-bg, #0f1115)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <span style={{ fontSize: 14 }}>
            {isFolder ? (isExpanded ? '📂' : '📁') : '📄'}
          </span>
          <span>{node.name}</span>
        </div>
        {isFolder && isExpanded && node.children?.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--slate-panel, #16181d)',
        overflow: 'auto',
        padding: 8,
      }}
    >
      {files.map((file) => renderNode(file))}
    </div>
  );
};

export default FileTree;

