/**
 * Editor Group Component
 * 
 * Manages multiple editor groups/panels (like VS Code)
 */

'use client';

import React, { useState } from 'react';
import { MonacoEditor } from '../monaco/MonacoEditor';
import { SplitPane } from '../shell/SplitPane';
import { useWissilFS } from '@/wissil/runtime/fs/wissilFs';
import { TabManager } from '../tabs/TabManager';
import { useEditorStore } from '../monaco/editorStore';

export interface EditorGroup {
  id: string;
  activeFilePath: string | null;
  openFiles: string[];
}

export interface EditorGroupProps {
  groups?: EditorGroup[];
  onGroupAdd?: () => void;
  onGroupRemove?: (groupId: string) => void;
  onGroupSplit?: (groupId: string, direction: 'horizontal' | 'vertical') => void;
}

export const EditorGroups: React.FC<EditorGroupProps> = ({
  groups: initialGroups,
  onGroupAdd,
  onGroupRemove,
  onGroupSplit,
}) => {
  const fs = useWissilFS();
  const { openFiles, activeFilePath, setActiveFile } = useEditorStore();
  const [groups, setGroups] = useState<EditorGroup[]>(
    initialGroups || [
      {
        id: 'group-1',
        activeFilePath: activeFilePath,
        openFiles: openFiles.map((f) => f.path),
      },
    ]
  );
  const [activeGroupId, setActiveGroupId] = useState<string>(groups[0]?.id || 'group-1');

  const activeGroup = groups.find((g) => g.id === activeGroupId);

  const handleTabSelect = (path: string) => {
    setActiveFile(path);
    setGroups((prev) =>
      prev.map((g) =>
        g.id === activeGroupId
          ? { ...g, activeFilePath: path }
          : g
      )
    );
  };

  const handleTabClose = (path: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === activeGroupId
          ? {
              ...g,
              openFiles: g.openFiles.filter((p) => p !== path),
              activeFilePath: g.activeFilePath === path ? g.openFiles[g.openFiles.length - 2] || null : g.activeFilePath,
            }
          : g
      )
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab Manager for Active Group */}
      {activeGroup && (
        <TabManager
          onTabSelect={handleTabSelect}
          onTabClose={handleTabClose}
        />
      )}

      {/* Editor Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeGroup?.activeFilePath ? (
          <MonacoEditor
            filePath={activeGroup.activeFilePath}
            height="100%"
            onSave={(content) => {
              fs.writeFile(activeGroup.activeFilePath!, content);
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: 'var(--slate-bg, #0f1115)',
              color: 'var(--slate-text-muted, #9ba1aa)',
              fontSize: 14,
            }}
          >
            No file open in this group
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorGroups;

