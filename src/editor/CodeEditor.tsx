'use client';

import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';
import { useEditorState } from '@/state/editorState';
import { useSandpackBridge } from '@/hooks/useSandpackBridge';

export interface CodeEditorProps {
  path: string;
  language?: string;
  theme?: 'dark' | 'light';
  readOnly?: boolean;
  onContentChange?: (content: string) => void;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  path,
  language = 'typescript',
  theme = 'dark',
  readOnly = false,
  onContentChange,
  height = '100%',
}) => {
  const { files, updateFile, markDirty } = useEditorState();
  const { sendCodeChange } = useSandpackBridge();
  const file = files[path];
  const editorRef = useRef<any>(null);

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'Monaco, "Courier New", monospace',
      tabSize: 2,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on' as const,
      lineNumbers: 'on' as const,
      renderWhitespace: 'selection' as const,
      cursorBlinking: 'smooth' as const,
      smoothScrolling: true,
    });

    // Define Nocturna theme (defineTheme is idempotent)
    try {
      monaco.editor.defineTheme('nocturna-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '7a84a9', fontStyle: 'italic' },
          { token: 'keyword', foreground: '6d8cff', fontStyle: 'bold' },
          { token: 'string', foreground: '33ffaa' },
          { token: 'number', foreground: 'ffcc33' },
          { token: 'type', foreground: '8ba4ff' },
        ],
        colors: {
          'editor.background': '#0c0f1a',
          'editor.foreground': '#c7cdf5',
          'editor.lineHighlightBackground': '#111421',
          'editor.selectionBackground': '#1f233480',
          'editorCursor.foreground': '#6d8cff',
          'editorLineNumber.foreground': '#4d5468',
          'editorLineNumber.activeForeground': '#7a84a9',
          'editorIndentGuide.background': '#1f2334',
          'editorIndentGuide.activeBackground': '#2a2e42',
        },
      });
    } catch (e) {
      // Theme already defined, ignore
    }

    // Set theme
    monaco.editor.setTheme('nocturna-dark');

    // Focus editor
    editor.focus();
  };

  // Handle content change
  const handleChange = (value: string | undefined) => {
    if (!value) return;

    // Update state
    updateFile(path, value);
    markDirty(path, true);

    // Send to runtime via bridge
    sendCodeChange(path, value);

    // Callback
    onContentChange?.(value);
  };

  // Get language from file extension
  const getLanguage = () => {
    if (language !== 'typescript') return language;
    
    const ext = path.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      json: 'json',
      css: 'css',
      html: 'html',
      md: 'markdown',
      yml: 'yaml',
      yaml: 'yaml',
    };
    
    return langMap[ext || ''] || 'typescript';
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--nv-text-2)]">
        <p>No file selected</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Editor
        height={height}
        language={getLanguage()}
        theme={theme === 'dark' ? 'nocturna-dark' : 'vs'}
        value={file.content}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          wordBasedSuggestions: 'allDocuments',
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnCommitCharacter: true,
          acceptSuggestionOnEnter: 'on',
          snippetSuggestions: 'top',
          tabCompletion: 'on',
          wordWrap: 'on',
          automaticLayout: true,
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--nv-accent)] mx-auto mb-2" />
              <p className="text-[var(--nv-text-2)] text-sm">Loading editor...</p>
            </div>
          </div>
        }
      />
    </div>
  );
};

