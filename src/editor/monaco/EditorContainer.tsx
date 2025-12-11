/**
 * Editor Container Component
 * 
 * Wraps Monaco Editor in AppShell with FileTree, FileTabs, and editor
 */

'use client';

import React, { useState } from 'react';
import { AppShell } from '../shell/AppShell';
import { Sidebar } from '../shell/Sidebar';
import { TopBar } from '../shell/TopBar';
import { FileTree } from '../filesystem/FileTree';
import { TabManager } from '../tabs/TabManager';
import { MonacoEditor } from './MonacoEditor';
import { useEditorStore } from './editorStore';
import { useWissilFS } from '@/wis2l/runtime/fs/wissilFs';
import { RuntimeContainer } from '../runtime/RuntimeContainer';
import { SplitPane } from '../shell/SplitPane';
import { GitPanel } from '../git/GitPanel';
import { SplitEditor } from '../split/SplitEditor';

export interface EditorContainerProps {
  initialFiles?: Array<{ path: string; content: string }>;
  showRuntime?: boolean;
  runtimeLayout?: 'horizontal' | 'vertical';
  showGit?: boolean;
  showSplitEditor?: boolean;
}

export const EditorContainer: React.FC<EditorContainerProps> = ({
  initialFiles = [],
  showRuntime = true,
  runtimeLayout = 'horizontal',
  showGit = true,
  showSplitEditor = false,
}) => {
  const fs = useWissilFS();
  const { openFiles, activeFilePath, openFile, setActiveFile } = useEditorStore();
  const [showPreview, setShowPreview] = useState(true);
  const [showGitPanel, setShowGitPanel] = useState(false);

  // Initialize filesystem with initial files
  React.useEffect(() => {
    initialFiles.forEach(({ path, content }) => {
      if (!fs.exists(path)) {
        fs.writeFile(path, content);
      }
    });
  }, [initialFiles, fs]);

  // Convert WISSIL-FS tree to FileTree format
  const convertFSTree = (node: any, path = ''): any[] => {
    if (!node || node.type === 'file') {
      return [];
    }

    const children: any[] = [];
    for (const [name, child] of Object.entries(node.children || {})) {
      const childPath = path ? `${path}/${name}` : `/${name}`;
      if (child.type === 'file') {
        children.push({
          name,
          type: 'file' as const,
          path: childPath,
        });
      } else {
        children.push({
          name,
          type: 'folder' as const,
          path: childPath,
          children: convertFSTree(child, childPath),
        });
      }
    }
    return children;
  };

  const fsTree = React.useMemo(() => {
    const snapshot = fs.getSnapshot();
    return convertFSTree(snapshot);
  }, [fs]);

  const handleFileSelect = (path: string) => {
    openFile(path);
    setActiveFile(path);
  };

  const handleTabSelect = (tabId: string) => {
    setActiveFile(tabId);
  };

  const handleTabClose = (tabId: string) => {
    const { closeFile } = useEditorStore.getState();
    closeFile(tabId);
  };

  // Convert open files to tabs
  const tabs = openFiles.map((file) => ({
    id: file.path,
    label: file.path.split('/').pop() || file.path,
    dirty: file.isDirty,
  }));

  return (
    <AppShell
      sidebarVisible
      panelsVisible={false}
      sidebar={
        <FileTree
          files={fsTree}
          onFileSelect={handleFileSelect}
          defaultExpanded={['/src', '/components']}
        />
      }
      topBar={
        <TopBar
          title={activeFilePath ? activeFilePath.split('/').pop() || 'Editor' : 'WISSIL IDE'}
          showSaveIndicator={openFiles.some((f) => f.isDirty)}
          actions={
            showGit ? (
              <button
                onClick={() => setShowGitPanel(!showGitPanel)}
                style={{
                  padding: '6px 12px',
                  background: showGitPanel ? 'var(--slate-accent, #3f8cff)' : 'transparent',
                  border: '1px solid var(--slate-border, #26292f)',
                  borderRadius: 4,
                  color: showGitPanel ? '#FFFFFF' : 'var(--slate-text, #e4e7eb)',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                Git
              </button>
            ) : undefined
          }
        />
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Tab Manager */}
        <TabManager
          onTabSelect={handleTabSelect}
          onTabClose={handleTabClose}
        />

        {/* Editor Area */}
        <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
          {/* Editor and Runtime Split */}
          {showRuntime ? (
            <SplitPane
              direction={runtimeLayout}
              defaultSize={50}
              minSize={20}
              maxSize={80}
            >
              {/* Editor Area */}
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {showSplitEditor && openFiles.length >= 2 ? (
                  <SplitEditor
                    primaryFilePath={openFiles[0]?.path}
                    secondaryFilePath={openFiles[1]?.path}
                    direction={runtimeLayout === 'horizontal' ? 'vertical' : 'horizontal'}
                  />
                ) : activeFilePath ? (
                  <MonacoEditor
                    filePath={activeFilePath}
                    height="100%"
                    onSave={(content) => {
                      fs.writeFile(activeFilePath, content);
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      background: '#0A0A0A',
                      color: '#FFFFFF',
                      fontSize: 14,
                    }}
                  >
                    Select a file from the explorer to start editing
                  </div>
                )}
              </div>

              {/* Runtime Container */}
              <RuntimeContainer
                showPreview={showPreview}
                showConsole={true}
                showTerminal={true}
                showBuildStatus={true}
                layout={runtimeLayout === 'horizontal' ? 'vertical' : 'horizontal'}
              />
            </SplitPane>
          ) : (
            /* Editor Only */
            showSplitEditor && openFiles.length >= 2 ? (
              <SplitEditor
                primaryFilePath={openFiles[0]?.path}
                secondaryFilePath={openFiles[1]?.path}
                direction="horizontal"
              />
            ) : activeFilePath ? (
              <MonacoEditor
                filePath={activeFilePath}
                height="100%"
                onSave={(content) => {
                  fs.writeFile(activeFilePath, content);
                }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  background: '#0A0A0A',
                  color: '#FFFFFF',
                  fontSize: 14,
                }}
              >
                Select a file from the explorer to start editing
              </div>
            )
          )}

          {/* Git Panel (Right Side) */}
          {showGit && showGitPanel && (
            <div style={{ width: 400, height: '100%' }}>
              <GitPanel />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default EditorContainer;

