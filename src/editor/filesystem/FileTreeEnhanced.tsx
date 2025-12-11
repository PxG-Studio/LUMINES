/**
 * File Tree Component
 * 
 * Advanced file tree with context menu, drag & drop, keyboard navigation, and file icons
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FileIcon, FolderIcon, FolderOpenIcon } from 'lucide-react';
import { useWissilFS } from '@/wis2l/runtime/fs/wissilFs';

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path?: string;
}

export interface FileTreeProps {
  files?: FileNode[];
  onFileSelect?: (path: string) => void;
  onFileCreate?: (path: string, type: 'file' | 'folder') => void;
  onFileDelete?: (path: string) => void;
  onFileRename?: (oldPath: string, newPath: string) => void;
  expandedPaths?: Set<string>;
  defaultExpanded?: string[];
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  path: string;
  type: 'file' | 'folder';
}

/**
 * Get file icon based on extension
 */
function getFileIcon(fileName: string): React.ReactNode {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const iconMap: Record<string, string> = {
    ts: '📘',
    tsx: '⚛️',
    js: '📜',
    jsx: '⚛️',
    json: '📋',
    md: '📝',
    mdx: '📝',
    css: '🎨',
    scss: '🎨',
    html: '🌐',
    yaml: '⚙️',
    yml: '⚙️',
    png: '🖼️',
    jpg: '🖼️',
    jpeg: '🖼️',
    gif: '🖼️',
    svg: '🖼️',
  };
  return iconMap[ext || ''] || '📄';
}

export const FileTree: React.FC<FileTreeProps> = ({
  files = [],
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  defaultExpanded = [],
}) => {
  const fs = useWissilFS();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [draggedPath, setDraggedPath] = useState<string | null>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!treeRef.current?.contains(document.activeElement)) return;

      if (e.key === 'ArrowRight' && selectedPath) {
        if (!expanded.has(selectedPath)) {
          setExpanded((prev) => new Set([...prev, selectedPath]));
        }
      } else if (e.key === 'ArrowLeft' && selectedPath) {
        if (expanded.has(selectedPath)) {
          setExpanded((prev) => {
            const next = new Set(prev);
            next.delete(selectedPath);
            return next;
          });
        }
      } else if (e.key === 'Enter' && selectedPath) {
        onFileSelect?.(selectedPath);
      } else if (e.key === 'Delete' && selectedPath) {
        handleDelete(selectedPath);
      } else if (e.key === 'F2' && selectedPath) {
        handleRename(selectedPath);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPath, expanded, onFileSelect]);

  // Focus rename input when renaming
  useEffect(() => {
    if (renamingPath && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingPath]);

  const toggle = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleContextMenu = (e: React.MouseEvent, path: string, type: 'file' | 'folder') => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      path,
      type,
    });
    setSelectedPath(path);
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleNewFile = () => {
    if (!contextMenu) return;
    const parentPath = contextMenu.path;
    const newPath = `${parentPath}/new-file.txt`;
    onFileCreate?.(newPath, 'file');
    fs.writeFile(newPath, '');
    closeContextMenu();
  };

  const handleNewFolder = () => {
    if (!contextMenu) return;
    const parentPath = contextMenu.path;
    const newPath = `${parentPath}/new-folder`;
    onFileCreate?.(newPath, 'folder');
    fs.createFolder(newPath);
    closeContextMenu();
  };

  const handleDelete = (path: string) => {
    if (window.confirm(`Delete ${path}?`)) {
      onFileDelete?.(path);
      if (fs.exists(path)) {
        if (path.endsWith('/')) {
          fs.deleteFolder(path);
        } else {
          fs.deleteFile(path);
        }
      }
    }
    closeContextMenu();
  };

  const handleRename = (path: string) => {
    setRenamingPath(path);
    setRenameValue(path.split('/').pop() || '');
    closeContextMenu();
  };

  const handleRenameSubmit = () => {
    if (!renamingPath || !renameValue) return;

    const parts = renamingPath.split('/');
    parts.pop();
    const newPath = `${parts.join('/')}/${renameValue}`;

    if (renamingPath !== newPath) {
      onFileRename?.(renamingPath, newPath);
      // Update in filesystem
      const content = fs.readFile(renamingPath);
      if (content !== null) {
        fs.writeFile(newPath, content);
        fs.deleteFile(renamingPath);
      }
    }

    setRenamingPath(null);
    setRenameValue('');
  };

  const handleCopyPath = () => {
    if (!contextMenu) return;
    navigator.clipboard.writeText(contextMenu.path);
    closeContextMenu();
  };

  const handleDragStart = (e: React.DragEvent, path: string) => {
    setDraggedPath(path);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPath: string) => {
    e.preventDefault();
    if (!draggedPath || draggedPath === targetPath) return;

    // Move file/folder
    const content = fs.readFile(draggedPath);
    if (content !== null) {
      const newPath = `${targetPath}/${draggedPath.split('/').pop()}`;
      fs.writeFile(newPath, content);
      fs.deleteFile(draggedPath);
      onFileRename?.(draggedPath, newPath);
    }

    setDraggedPath(null);
  };

  const renderNode = (node: FileNode, depth = 0): React.ReactNode => {
    const path = node.path || `/${node.name}`;
    const isExpanded = expanded.has(path);
    const isFolder = node.type === 'folder';
    const isSelected = selectedPath === path;
    const isRenaming = renamingPath === path;

    return (
      <div key={path}>
        <div
          draggable={!isRenaming}
          onDragStart={(e) => handleDragStart(e, path)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, path)}
          onClick={() => {
            if (isRenaming) return;
            setSelectedPath(path);
            if (isFolder) {
              toggle(path);
            } else {
              onFileSelect?.(path);
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, path, node.type)}
          onDoubleClick={() => {
            if (isFolder) {
              toggle(path);
            } else {
              onFileSelect?.(path);
            }
          }}
          tabIndex={0}
          style={{
            padding: '4px 8px',
            paddingLeft: `${depth * 16 + 8}px`,
            cursor: 'pointer',
            color: isSelected ? '#FFFFFF' : 'var(--slate-text, #e4e7eb)',
            background: isSelected ? 'rgba(166, 77, 255, 0.2)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontFamily: 'var(--font-mono, monospace)',
            transition: 'background 0.15s',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {isRenaming ? (
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameSubmit();
                } else if (e.key === 'Escape') {
                  setRenamingPath(null);
                  setRenameValue('');
                }
              }}
              style={{
                flex: 1,
                padding: '2px 4px',
                background: 'var(--slate-bg, #0f1115)',
                border: '1px solid var(--slate-accent, #3f8cff)',
                borderRadius: 2,
                color: 'var(--slate-text, #e4e7eb)',
                fontSize: 12,
                fontFamily: 'var(--font-mono, monospace)',
                outline: 'none',
              }}
            />
          ) : (
            <>
              <span style={{ fontSize: 14, display: 'flex', alignItems: 'center' }}>
                {isFolder ? (
                  isExpanded ? (
                    <FolderOpenIcon size={14} color="#F5B914" />
                  ) : (
                    <FolderIcon size={14} color="#F5B914" />
                  )
                ) : (
                  <span>{getFileIcon(node.name)}</span>
                )}
              </span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {node.name}
              </span>
            </>
          )}
        </div>
        {isFolder && isExpanded && node.children?.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div
      ref={treeRef}
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--slate-panel, #16181d)',
        overflow: 'auto',
        padding: 8,
        position: 'relative',
      }}
      onClick={closeContextMenu}
    >
      {files.map((file) => renderNode(file))}

      {/* Context Menu */}
      {contextMenu?.visible && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: 'var(--slate-panel, #16181d)',
            border: '1px solid var(--slate-border, #26292f)',
            borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            minWidth: 180,
            padding: 4,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === 'folder' && (
            <>
              <div
                onClick={handleNewFile}
                style={{
                  padding: '6px 12px',
                  cursor: 'pointer',
                  color: 'var(--slate-text, #e4e7eb)',
                  fontSize: 12,
                  borderRadius: 2,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                New File
              </div>
              <div
                onClick={handleNewFolder}
                style={{
                  padding: '6px 12px',
                  cursor: 'pointer',
                  color: 'var(--slate-text, #e4e7eb)',
                  fontSize: 12,
                  borderRadius: 2,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                New Folder
              </div>
              <div
                style={{
                  height: 1,
                  background: 'var(--slate-border, #26292f)',
                  margin: '4px 0',
                }}
              />
            </>
          )}
          <div
            onClick={() => handleRename(contextMenu.path)}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              color: 'var(--slate-text, #e4e7eb)',
              fontSize: 12,
              borderRadius: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Rename
          </div>
          <div
            onClick={() => handleDelete(contextMenu.path)}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              color: '#EF4444',
              fontSize: 12,
              borderRadius: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Delete
          </div>
          <div
            style={{
              height: 1,
              background: 'var(--slate-border, #26292f)',
              margin: '4px 0',
            }}
          />
          <div
            onClick={handleCopyPath}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              color: 'var(--slate-text, #e4e7eb)',
              fontSize: 12,
              borderRadius: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Copy Path
          </div>
        </div>
      )}
    </div>
  );
};

export default FileTree;

