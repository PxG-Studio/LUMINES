'use client';

import React, { useState } from 'react';
import { useEditorState } from '@/state/editorState';
import { cn } from '@/utils/cn';
import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react';

export interface FileTreeProps {
  rootPath?: string;
  onFileSelect?: (path: string) => void;
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

export const FileTree: React.FC<FileTreeProps> = ({
  rootPath = '/',
  onFileSelect,
}) => {
  const { files, activeFile, setActiveFile, openFile } = useEditorState();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([rootPath]));

  const buildTree = (): FileNode[] => {
    const tree: FileNode[] = [];
    const paths = Object.keys(files).sort();

    paths.forEach((filePath) => {
      // Handle paths starting with /
      const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      const parts = cleanPath.split('/').filter(Boolean);
      
      if (parts.length === 0) return;

      let current = tree;

      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const fullPath = '/' + parts.slice(0, index + 1).join('/');
        let node = current.find((n) => n.name === part && n.path === fullPath);

        if (!node) {
          node = {
            name: part,
            path: fullPath,
            type: isLast ? 'file' : 'folder',
            children: isLast ? undefined : [],
          };
          current.push(node);
        }

        if (!isLast && node.children) {
          current = node.children;
        }
      });
    });

    return tree.sort((a, b) => {
      // Folders first, then files
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleFileClick = (path: string) => {
    setActiveFile(path);
    openFile(path);
    onFileSelect?.(path);
  };

  const renderNode = (node: FileNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.path);
    const isActive = activeFile === node.path;

    if (node.type === 'folder') {
      return (
        <div key={node.path}>
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:bg-[var(--nv-bg-2)] text-[var(--nv-text-2)]',
              'pl-' + (level * 4 + 2)
            )}
            onClick={() => toggleFolder(node.path)}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <Folder className="w-4 h-4" />
            <span className="text-sm">{node.name}</span>
          </div>
          {isExpanded && node.children && (
            <div>
              {node.children.map((child) => renderNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        className={cn(
          'flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:bg-[var(--nv-bg-2)] text-[var(--nv-text-1)]',
          'pl-' + (level * 4 + 2),
          isActive && 'bg-[var(--nv-accent)]/20 text-[var(--nv-accent)]'
        )}
        onClick={() => handleFileClick(node.path)}
      >
        <File className="w-4 h-4" />
        <span className="text-sm">{node.name}</span>
      </div>
    );
  };

  const tree = buildTree();

  return (
    <div className="w-full h-full overflow-auto p-2">
      {tree.map((node) => renderNode(node))}
    </div>
  );
};

