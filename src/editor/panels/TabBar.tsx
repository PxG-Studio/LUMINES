'use client';

import React from 'react';
import { useEditorState } from '@/state/editorState';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

export const TabBar: React.FC = () => {
  const { openFiles, activeFile, setActiveFile, closeFile, files } = useEditorState();

  const handleClose = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    closeFile(path);
  };

  return (
    <div className="flex items-center gap-1 border-b border-[var(--nv-border)] bg-[var(--nv-bg-2)] overflow-x-auto">
      {openFiles.map((path) => {
        const file = files[path];
        const isActive = activeFile === path;
        const isDirty = file?.isDirty;

        return (
          <div
            key={path}
            className={cn(
              'flex items-center gap-2 px-3 py-2 cursor-pointer border-b-2 transition-colors',
              isActive
                ? 'border-[var(--nv-accent)] bg-[var(--nv-bg-1)] text-[var(--nv-accent)]'
                : 'border-transparent hover:bg-[var(--nv-bg-1)] text-[var(--nv-text-2)]'
            )}
            onClick={() => setActiveFile(path)}
          >
            <span className="text-sm truncate max-w-[200px]">
              {path.split('/').pop()}
              {isDirty && ' *'}
            </span>
            <button
              className="p-0.5 hover:bg-[var(--nv-bg-2)] rounded"
              onClick={(e) => handleClose(e, path)}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

