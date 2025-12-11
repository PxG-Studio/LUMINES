/**
 * Virtualized File Tree Component
 * 
 * Performance-optimized file tree with virtual scrolling
 * For large project directories in game development
 */

'use client';

import React, { useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FileTree, FileNode } from '../filesystem/FileTree';

export interface VirtualizedFileTreeProps {
  files: FileNode[];
  onFileSelect?: (path: string) => void;
  height?: number;
  itemHeight?: number;
}

interface FileTreeItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: FileNode[];
    onFileSelect?: (path: string) => void;
  };
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ index, style, data }) => {
  const item = data.items[index];
  
  if (!item) return null;

  return (
    <div style={style}>
      <div
        onClick={() => item.type === 'file' && data.onFileSelect?.(item.path)}
        style={{
          padding: '4px 8px',
          cursor: item.type === 'file' ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 12,
          color: 'var(--slate-text, #e4e7eb)',
        }}
        onMouseEnter={(e) => {
          if (item.type === 'file') {
            e.currentTarget.style.background = 'var(--slate-panel-hover, #1e2127)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <span>{item.type === 'folder' ? '📁' : '📄'}</span>
        <span>{item.name}</span>
      </div>
    </div>
  );
};

export const VirtualizedFileTree: React.FC<VirtualizedFileTreeProps> = ({
  files,
  onFileSelect,
  height = 600,
  itemHeight = 28,
}) => {
  // Flatten tree for virtualization
  const flattenedItems = useMemo(() => {
    const flatten = (nodes: FileNode[], level = 0): FileNode[] => {
      const result: FileNode[] = [];
      for (const node of nodes) {
        result.push({ ...node, level });
        if (node.children && node.children.length > 0) {
          result.push(...flatten(node.children, level + 1));
        }
      }
      return result;
    };
    return flatten(files);
  }, [files]);

  if (flattenedItems.length === 0) {
    return (
      <div
        style={{
          padding: 16,
          textAlign: 'center',
          color: 'var(--slate-text-muted, #9ba1aa)',
          fontSize: 12,
        }}
      >
        No files
      </div>
    );
  }

  return (
    <div style={{ height, width: '100%' }}>
      <AutoSizer>
        {({ height: autoHeight, width }) => (
          <FixedSizeList
            height={autoHeight}
            width={width}
            itemCount={flattenedItems.length}
            itemSize={itemHeight}
            itemData={{
              items: flattenedItems,
              onFileSelect,
            }}
          >
            {FileTreeItem}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};

export default VirtualizedFileTree;

