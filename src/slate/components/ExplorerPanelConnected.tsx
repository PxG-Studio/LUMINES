import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Search, Upload as UploadIcon, Plus, Trash } from 'lucide-react';
import { lumenForgeColors, transitions } from '../../design-system/tokens';
import { useFiles } from '../../hooks/useFiles';
import { useProjectContext } from '../context/ProjectContext';
import type { FileTreeNode } from '../../lib/database/operations/files';

interface ExplorerPanelConnectedProps {
  onFileSelect?: (fileId: string, path: string) => void;
  selectedPath?: string;
  onShowAssetManager?: () => void;
}

export const ExplorerPanelConnected: React.FC<ExplorerPanelConnectedProps> = ({
  onFileSelect,
  selectedPath,
  onShowAssetManager,
}) => {
  const { projectId } = useProjectContext();
  const { fileTree, createFile, deleteFile, loading } = useFiles(projectId);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['Assets', 'Scripts']));
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [newFilePath, setNewFilePath] = useState('');

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

  const handleCreateFile = async () => {
    if (!projectId || !newFilePath.trim()) return;

    try {
      await createFile({
        project_id: projectId,
        path: newFilePath,
        content: '// New file\n',
        type: newFilePath.endsWith('.cs') ? 'csharp' : 'text',
      });
      setNewFilePath('');
      setShowNewFileInput(false);
    } catch (error) {
      console.error('Failed to create file:', error);
    }
  };

  const handleDeleteFile = async (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this file?')) {
      try {
        await deleteFile(fileId);
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
  };

  const TreeNode: React.FC<{ node: FileTreeNode; depth: number }> = ({ node, depth }) => {
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
            } else if (node.fileData) {
              onFileSelect?.(node.fileData.id, node.path);
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
              flex: 1,
            }}
          >
            {node.name}
          </span>

          {!isFolder && node.fileData && (
            <button
              onClick={(e) => handleDeleteFile(node.fileData!.id, e)}
              style={{
                background: 'none',
                border: 'none',
                color: lumenForgeColors.text.tertiary,
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Trash size={14} />
            </button>
          )}
        </div>

        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNode key={child.path} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!projectId) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: lumenForgeColors.background.primary,
          padding: '2rem',
        }}
      >
        <p style={{ color: lumenForgeColors.text.secondary, textAlign: 'center' }}>
          No project selected. Create or select a project to view files.
        </p>
      </div>
    );
  }

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

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setShowNewFileInput(!showNewFileInput)}
            style={{
              flex: 1,
              padding: '0.5rem',
              background: lumenForgeColors.background.tertiary,
              color: lumenForgeColors.text.primary,
              border: `1px solid ${lumenForgeColors.border.subtle}`,
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <Plus size={14} />
            New File
          </button>

          {onShowAssetManager && (
            <button
              onClick={onShowAssetManager}
              style={{
                flex: 1,
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
              }}
            >
              <UploadIcon size={14} />
              Assets
            </button>
          )}
        </div>

        {showNewFileInput && (
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Assets/Scripts/MyFile.cs"
              value={newFilePath}
              onChange={(e) => setNewFilePath(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFile();
                if (e.key === 'Escape') setShowNewFileInput(false);
              }}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: lumenForgeColors.background.tertiary,
                border: `1px solid ${lumenForgeColors.border.subtle}`,
                borderRadius: '0.375rem',
                color: lumenForgeColors.text.primary,
                fontSize: '0.75rem',
                outline: 'none',
              }}
            />
            <button
              onClick={handleCreateFile}
              style={{
                padding: '0.5rem 0.75rem',
                background: lumenForgeColors.accent.primary,
                color: lumenForgeColors.text.primary,
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Create
            </button>
          </div>
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
        {loading ? (
          <p style={{ padding: '1rem', color: lumenForgeColors.text.secondary, textAlign: 'center' }}>
            Loading files...
          </p>
        ) : fileTree.length === 0 ? (
          <p style={{ padding: '1rem', color: lumenForgeColors.text.secondary, textAlign: 'center' }}>
            No files in this project. Click &quot;New File&quot; to create one.
          </p>
        ) : (
          fileTree.map((node) => <TreeNode key={node.path} node={node} depth={0} />)
        )}
      </div>

      <div
        style={{
          padding: '0.75rem',
          borderTop: `1px solid ${lumenForgeColors.border.subtle}`,
          color: lumenForgeColors.text.tertiary,
          fontSize: '0.75rem',
        }}
      >
        {fileTree.length} {fileTree.length === 1 ? 'item' : 'items'}
      </div>
    </div>
  );
};
