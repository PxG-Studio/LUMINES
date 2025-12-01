/**
 * Monaco Editor Component
 * 
 * Full-featured code editor with WISSIL-FS integration
 * Based on VS Code's Monaco Editor
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Editor, { OnChange, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useWissilFS } from '@/wissil/runtime/fs/wissilFs';
import { useEditorStore } from './editorStore';
import { SearchReplace } from './SearchReplace';
import { formatCode, formatSelection } from './CodeFormatter';
import '@/styles/editor.css';

export interface MonacoEditorProps {
  filePath?: string;
  language?: string;
  theme?: 'vs-dark' | 'light' | 'slate-dark';
  options?: editor.IStandaloneEditorConstructionOptions;
  onChange?: (value: string | undefined) => void;
  onSave?: (value: string) => void;
  height?: string;
  width?: string;
  showSearchReplace?: boolean;
  formatOnSave?: boolean;
  enableIntelliSense?: boolean;
}

/**
 * Detect language from file extension
 */
function detectLanguage(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    md: 'markdown',
    mdx: 'markdown',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    html: 'html',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    py: 'python',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    php: 'php',
    rb: 'ruby',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    sql: 'sql',
    vue: 'vue',
    svelte: 'svelte',
  };
  return languageMap[ext || ''] || 'plaintext';
}

/**
 * Create SLATE dark theme for Monaco
 */
function createSlateTheme(): void {
  if (typeof window === 'undefined') return;
  
  // Monaco is loaded dynamically, so we need to check if it's available
  const monaco = (window as any).monaco;
  if (!monaco || !monaco.editor) return;

  monaco.editor.defineTheme('slate-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'A64DFF', fontStyle: 'bold' },
      { token: 'string', foreground: '47E0FF' },
      { token: 'number', foreground: 'F5B914' },
      { token: 'type', foreground: 'FF6B35' },
      { token: 'function', foreground: '10B981' },
      { token: 'variable', foreground: 'E5E7EB' },
    ],
    colors: {
      'editor.background': '#0A0A0A',
      'editor.foreground': '#FFFFFF',
      'editor.lineHighlightBackground': '#1A1A1A',
      'editor.selectionBackground': '#A64DFF40',
      'editor.selectionHighlightBackground': '#A64DFF20',
      'editorCursor.foreground': '#47E0FF',
      'editorWhitespace.foreground': '#2A2A2A',
      'editorIndentGuide.activeBackground': '#2A2A2A',
      'editorIndentGuide.background': '#1A1A1A',
      'editorLineNumber.foreground': '#6B7280',
      'editorLineNumber.activeForeground': '#9CA3AF',
      'editorGutter.background': '#0A0A0A',
      'editorWidget.background': '#1A1A1A',
      'editorWidget.border': '#2A2A2A',
      'editorSuggestWidget.background': '#1A1A1A',
      'editorSuggestWidget.border': '#2A2A2A',
      'editorSuggestWidget.selectedBackground': '#A64DFF40',
      'editorHoverWidget.background': '#1A1A1A',
      'editorHoverWidget.border': '#2A2A2A',
    },
  });
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  filePath,
  language: propLanguage,
  theme = 'slate-dark',
  options,
  onChange,
  onSave,
  height = '100%',
  width = '100%',
  showSearchReplace = true,
  formatOnSave = true,
  enableIntelliSense = true,
}) => {
  const fs = useWissilFS();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchReplaceVisible, setSearchReplaceVisible] = useState(false);
  const { setActiveEditor, markDirty, markClean } = useEditorStore();

  // Detect language from file path
  const language = propLanguage || (filePath ? detectLanguage(filePath) : 'typescript');

  // Load file content from WISSIL-FS
  useEffect(() => {
    if (!filePath) {
      setValue('');
      setIsLoading(false);
      return;
    }

    const content = fs.readFile(filePath);
    if (content !== null) {
      setValue(content);
      setIsLoading(false);
    } else {
      // File doesn't exist, create empty file
      setValue('');
      setIsLoading(false);
    }
  }, [filePath, fs]);

  // Register editor instance
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    setActiveEditor(editor, filePath || '');

    // Register SLATE theme
    createSlateTheme();
    // Set theme after a small delay to ensure Monaco is fully loaded
    setTimeout(() => {
      try {
        monaco.editor.setTheme(theme);
      } catch (e) {
        // Theme might not be registered yet, try again
        createSlateTheme();
        monaco.editor.setTheme(theme);
      }
    }, 100);

    // Set up keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    // Search & Replace (Ctrl+F / Cmd+F)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      setSearchReplaceVisible(true);
    });

    // Format Document (Shift+Alt+F / Shift+Option+F)
    editor.addCommand(
      monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
      async () => {
        await handleFormatDocument();
      }
    );

    // Format Selection (Ctrl+K Ctrl+F / Cmd+K Cmd+F)
    // Note: Monaco doesn't support chord commands directly, so we use Shift+Alt+F for format selection
    editor.addCommand(
      monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
      async () => {
        const selection = editor.getSelection();
        if (selection && !selection.isEmpty()) {
          await handleFormatSelection();
        } else {
          await handleFormatDocument();
        }
      }
    );

    // Configure IntelliSense
    if (enableIntelliSense) {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types'],
      });

      // Enable all features
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
        noSuggestionDiagnostics: false,
      });

      // Configure editor for IntelliSense
      editor.updateOptions({
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true,
        },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: 'on',
        tabCompletion: 'on',
        wordBasedSuggestions: 'matchingDocuments',
      });
    }

    // Focus editor
    editor.focus();
  };

  // Handle content changes
  const handleChange: OnChange = (newValue) => {
    setValue(newValue || '');
    if (filePath) {
      markDirty(filePath);
    }
    onChange?.(newValue);
  };

  // Format entire document
  const handleFormatDocument = async () => {
    if (!editorRef.current) return;

    try {
      await formatCode(editorRef.current);
    } catch (error) {
      console.error('Format error:', error);
    }
  };

  // Format selection
  const handleFormatSelection = async () => {
    if (!editorRef.current) return;

    try {
      await formatSelection(editorRef.current);
    } catch (error) {
      console.error('Format selection error:', error);
    }
  };

  // Save file to WISSIL-FS
  const handleSave = async () => {
    if (!filePath || !editorRef.current) return;

    // Format on save if enabled
    if (formatOnSave) {
      try {
        await formatCode(editorRef.current);
      } catch (error) {
        console.error('Format on save error:', error);
        // Continue with unformatted content if formatting fails
      }
    }

    const content = editorRef.current.getValue();
    fs.writeFile(filePath, content);
    markClean(filePath);
    onSave?.(content);
  };

  // Default editor options
  const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
    lineNumbers: 'on',
    lineNumbersMinChars: 3,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on',
    formatOnPaste: true,
    formatOnType: true,
    // IntelliSense options
    suggestOnTriggerCharacters: enableIntelliSense,
    acceptSuggestionOnCommitCharacter: enableIntelliSense,
    acceptSuggestionOnEnter: enableIntelliSense ? 'on' : 'off',
    quickSuggestions: enableIntelliSense
      ? {
          other: true,
          comments: true,
          strings: true,
        }
      : false,
    quickSuggestionsDelay: 100,
    parameterHints: { enabled: enableIntelliSense },
    hover: { enabled: enableIntelliSense },
    // Code navigation
    gotoLocation: {
      multiple: 'goto',
      multipleDefinitions: 'goto',
      multipleDeclarations: 'goto',
      multipleImplementations: 'goto',
      multipleReferences: 'goto',
    },
    // Additional features
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      indentation: true,
    },
    // Code actions
    codeActionsOnSave: {
      'source.fixAll': 'explicit',
      'source.organizeImports': 'explicit',
    },
    ...options,
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          width,
          background: '#0A0A0A',
          color: '#FFFFFF',
        }}
      >
        Loading editor...
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height, width }}>
      <Editor
        height={height}
        width={width}
        language={language}
        theme={theme}
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={defaultOptions}
        loading={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: '#0A0A0A',
              color: '#FFFFFF',
            }}
          >
            Loading Monaco Editor...
          </div>
        }
      />
      {showSearchReplace && (
        <SearchReplace
          editor={editorRef.current}
          visible={searchReplaceVisible}
          onClose={() => setSearchReplaceVisible(false)}
        />
      )}
    </div>
  );
};

export default MonacoEditor;

