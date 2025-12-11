import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Search, Upload as UploadIcon } from 'lucide-react';
import { lumenForgeColors, transitions } from '../../design-system/tokens';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
}

interface ExplorerPanelProps {
  files?: FileNode[];
  onFileSelect?: (path: string) => void;
  selectedPath?: string;
  onShowAssetManager?: () => void;
}

const defaultFiles: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    path: 'src',
    children: [
      { name: 'Main.cs', type: 'file', path: 'src/Main.cs' },
      { name: 'GameManager.cs', type: 'file', path: 'src/GameManager.cs' },
      {
        name: 'Components',
        type: 'folder',
        path: 'src/Components',
        children: [
          { name: 'Player.cs', type: 'file', path: 'src/Components/Player.cs' },
          { name: 'Enemy.cs', type: 'file', path: 'src/Components/Enemy.cs' },
        ],
      },
    ],
  },
  {
    name: 'Assets',
    type: 'folder',
    path: 'Assets',
    children: [
      { name: 'player.prefab', type: 'file', path: 'Assets/player.prefab' },
      { name: 'main_material.mat', type: 'file', path: 'Assets/main_material.mat' },
    ],
  },
];

export const ExplorerPanel: React.FC<ExplorerPanelProps> = ({
  files = defaultFiles,
  onFileSelect,
  selectedPath,
  onShowAssetManager,
}) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['src', 'Assets']));
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpand = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const FileTreeNode: React.FC<{ node: FileNode; depth: number }> = ({ node, depth }) => {
    const isExpanded = expandedPaths.has(node.path);
    const isSelected = selectedPath === node.path;
    const isFolder = node.type === 'folder';

    if (searchTerm && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return null;
    }

    return (
      <div>
        <div
          onClick={() => {
            if (isFolder) {
              toggleExpand(node.path);
            } else {
              onFileSelect?.(node.path);
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            paddingLeft: `${depth * 1 + 0.5}rem`,
            cursor: 'pointer',
            background: isSelected ? lumenForgeColors.accent.primary + '20' : 'transparent',
            borderLeft: isSelected ? `2px solid ${lumenForgeColors.accent.primary}` : '2px solid transparent',
            transition: transitions.fast,
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = lumenForgeColors.background.tertiary;
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {isFolder ? (
            isExpanded ? (
              <ChevronDown size={16} style={{ color: lumenForgeColors.text.secondary }} />
            ) : (
              <ChevronRight size={16} style={{ color: lumenForgeColors.text.secondary }} />
            )
          ) : (
            <div style={{ width: '16px' }} />
          )}

          {isFolder ? (
            <Folder size={16} style={{ color: lumenForgeColors.accent.secondary }} />
          ) : (
            <File size={16} style={{ color: lumenForgeColors.text.tertiary }} />
          )}

          <span
            style={{
              color: isSelected ? lumenForgeColors.accent.primary : lumenForgeColors.text.primary,
              fontSize: '0.875rem',
              fontWeight: isSelected ? 600 : 400,
            }}
          >
            {node.name}
          </span>
        </div>

        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.map((child) => (
              <FileTreeNode key={child.path} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: lumenForgeColors.background.primary,
      }}
      role="region"
      aria-label="file explorer"
    >
      <div
        style={{
          padding: '1rem',
          borderBottom: `1px solid ${lumenForgeColors.border.subtle}`,
        }}
      >
        <h3
          style={{
            color: lumenForgeColors.text.primary,
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Explorer
        </h3>

        <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: lumenForgeColors.text.tertiary,
            }}
          />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.5rem',
              background: lumenForgeColors.background.tertiary,
              border: `1px solid ${lumenForgeColors.border.subtle}`,
              borderRadius: '0.375rem',
              color: lumenForgeColors.text.primary,
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>

        {onShowAssetManager && (
          <button
            onClick={onShowAssetManager}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: `linear-gradient(135deg, ${lumenForgeColors.accent.primary}, ${lumenForgeColors.accent.secondary})`,
              color: lumenForgeColors.text.primary,
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: transitions.normal,
            }}
          >
            <UploadIcon size={14} />
            Unity Assets
          </button>
        )}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
        role="tree"
        aria-label="file explorer"
      >
        {files.map((node) => (
          <FileTreeNode key={node.path} node={node} depth={0} />
        ))}
      </div>

      <div
        style={{
          padding: '0.75rem',
          borderTop: `1px solid ${lumenForgeColors.border.subtle}`,
          color: lumenForgeColors.text.tertiary,
          fontSize: '0.75rem',
        }}
      >
        Inspector
      </div>
    </div>
  );
};
