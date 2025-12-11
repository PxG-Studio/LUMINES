/**
 * File Tree Component
 * 
 * Tree navigation and file operations UI using IndexedDB
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getIndexedDBFileSystem } from '@/lib/filesystem/indexeddb';

interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  expanded?: boolean;
}

interface FileTreeProps {
  rootPath?: string;
  onFileSelect?: (path: string) => void;
  onFileCreate?: (path: string, type: 'file' | 'directory') => void;
  onFileDelete?: (path: string) => void;
  selectedPath?: string;
}

export function FileTree({
  rootPath = '/',
  onFileSelect,
  onFileCreate,
  onFileDelete,
  selectedPath,
}: FileTreeProps) {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fs = getIndexedDBFileSystem();

  useEffect(() => {
    fs.init().catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, [fs]);

  const loadTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const children = await fs.listDirectory(rootPath);
      const nodes: FileNode[] = await Promise.all(
        children.map(async (child) => {
          const fullPath = `${rootPath}${child}`;
          const isDir = await fs.directoryExists(fullPath);

          return {
            path: fullPath,
            name: child,
            type: isDir ? 'directory' : 'file',
            expanded: false,
          };
        })
      );

      setTree(nodes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file tree');
    } finally {
      setLoading(false);
    }
  }, [rootPath, fs]);

  useEffect(() => {
    loadTree();
  }, [loadTree]);

  const toggleExpand = async (node: FileNode) => {
    if (node.type === 'directory') {
      try {
        const children = await fs.listDirectory(node.path);
        const childNodes: FileNode[] = await Promise.all(
          children.map(async (child) => {
            const fullPath = `${node.path}${child}`;
            const isDir = await fs.directoryExists(fullPath);

            return {
              path: fullPath,
              name: child,
              type: isDir ? 'directory' : 'file',
              expanded: false,
            };
          })
        );

        setTree((prev) =>
          prev.map((n) =>
            n.path === node.path
              ? { ...n, expanded: !n.expanded, children: childNodes }
              : n
          )
        );
      } catch (err) {
        console.error('Failed to load directory:', err);
      }
    }
  };

  const handleFileClick = (node: FileNode) => {
    if (node.type === 'file') {
      onFileSelect?.(node.path);
    } else {
      toggleExpand(node);
    }
  };

  const handleCreate = async (type: 'file' | 'directory') => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;

    const path = `${rootPath}${name}`;
    try {
      if (type === 'directory') {
        await fs.createDirectory(path);
      } else {
        await fs.writeFile(path, '');
      }
      onFileCreate?.(path, type);
      loadTree();
    } catch (err) {
      alert(`Failed to create ${type}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (path: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const isDir = await fs.directoryExists(path);
      if (isDir) {
        await fs.deleteDirectory(path);
      } else {
        await fs.deleteFile(path);
      }
      onFileDelete?.(path);
      loadTree();
    } catch (err) {
      alert(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const renderNode = (node: FileNode, depth: number = 0): JSX.Element => {
    const isSelected = node.path === selectedPath;
    const indent = depth * 20;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 ${
            isSelected ? 'bg-blue-100 border-l-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${indent + 8}px` }}
          onClick={() => handleFileClick(node)}
        >
          <span className="mr-2">
            {node.type === 'directory' ? (
              node.expanded ? '📂' : '📁'
            ) : (
              '📄'
            )}
          </span>
          <span className="flex-1 text-sm">{node.name}</span>
          <div className="flex gap-1">
            <button
              className="text-xs px-2 py-1 hover:bg-gray-200 rounded"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(node.path);
              }}
            >
              Delete
            </button>
          </div>
        </div>
        {node.expanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading file tree...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">Error: {error}</div>;
  }

  return (
    <div className="file-tree border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-2 border-b border-gray-200 flex gap-2">
        <button
          className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => handleCreate('file')}
        >
          + File
        </button>
        <button
          className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => handleCreate('directory')}
        >
          + Folder
        </button>
        <button
          className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={loadTree}
        >
          Refresh
        </button>
      </div>
      <div className="p-2">
        {tree.length === 0 ? (
          <div className="text-sm text-gray-500 p-4 text-center">
            No files or directories
          </div>
        ) : (
          tree.map((node) => renderNode(node))
        )}
      </div>
    </div>
  );
}

