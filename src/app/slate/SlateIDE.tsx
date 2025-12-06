'use client';

import React, { useEffect } from 'react';
import { SplitView } from '@/design-system/primitives';
import { Panel } from '@/design-system/primitives';
import { FileTree } from '@/editor/panels/FileTree';
import { TabBar } from '@/editor/panels/TabBar';
import { CodeEditor } from '@/editor/CodeEditor';
import { useEditorState } from '@/state/editorState';
import { useUIState } from '@/state/uiState';

/**
 * Slate IDE Shell
 * Main IDE interface with sidebar, editor, and panels
 */
export const SlateIDE: React.FC = () => {
  const { files, activeFile, setFiles } = useEditorState();
  const { sidebarOpen, sidebarWidth } = useUIState();

  // Initialize default project structure
  useEffect(() => {
    if (Object.keys(files).length === 0) {
      const defaultFiles = {
        '/App.tsx': `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--nv-bg-0)] text-[var(--nv-text-1)] p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to WISSIL</h1>
      <p className="text-[var(--nv-text-2)]">
        Start coding in the editor. Changes will sync automatically.
      </p>
    </div>
  );
}`,
        '/package.json': `{
  "name": "wissil-project",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  }
}`,
        '/README.md': `# WISSIL Project

This is your WISSIL project. Edit files in the sidebar and see changes in real-time.

## Getting Started

1. Open \`App.tsx\` to edit the main component
2. Make changes and see them update automatically
3. Add new files using the file tree

## Features

- ⚡ Hot reload
- 🎨 Beautiful editor
- 📁 File management
- 🔄 Real-time sync
`,
      };

      // Convert to SandpackFiles format
      const sandpackFiles: Record<string, string> = {};
      Object.entries(defaultFiles).forEach(([path, content]) => {
        sandpackFiles[path] = content;
      });

      setFiles(sandpackFiles);
    }
  }, [files, setFiles]);

  return (
    <div className="w-full h-screen flex flex-col bg-[var(--nv-bg-0)]">
      {/* Header */}
      <header className="h-12 border-b border-[var(--nv-border)] bg-[var(--nv-bg-1)] flex items-center px-4">
        <h1 className="text-lg font-semibold text-[var(--nv-text-1)]">Slate IDE</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <SplitView
          direction="horizontal"
          initial={sidebarOpen ? 250 : 0}
          min={200}
          max={400}
        >
          {/* Sidebar */}
          <div className="h-full bg-[var(--nv-bg-1)] border-r border-[var(--nv-border)]">
            <Panel title="Explorer" className="h-full">
              <FileTree onFileSelect={(path) => console.log('Selected:', path)} />
            </Panel>
          </div>

          {/* Editor Area */}
          <div className="flex flex-col h-full bg-[var(--nv-bg-0)]">
            {/* Tab Bar */}
            <TabBar />

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              {activeFile ? (
                <CodeEditor
                  path={activeFile}
                  language="typescript"
                  theme="dark"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--nv-text-2)]">
                  <div className="text-center">
                    <p className="text-lg mb-2">No file open</p>
                    <p className="text-sm">Select a file from the explorer to start editing</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SplitView>
      </div>
    </div>
  );
};

