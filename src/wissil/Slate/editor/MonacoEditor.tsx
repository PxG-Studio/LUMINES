/**
 * Monaco Editor Component
 * Full-featured code editor with FS binding and HMR
 */

'use client';

import React, { useEffect, useState, useRef } from "react";
import Editor, { type OnMount, type OnChange, type BeforeMount } from "@monaco-editor/react";
import { useWissilFS } from "@/wissil/runtime/fs/wissilFs";
import { useEditorTabs } from "./useEditorTabs";
import { useEditorState } from "@/state/editorState";
import { triggerHMR } from "./hmrHooks";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import type * as monaco from "monaco-editor";

export function MonacoEditor() {
  const theme = useTheme();
  const activeFile = useEditorTabs((s) => s.activeFile);
  const fs = useWissilFS.getState();
  const setCursor = useEditorState((s) => s.setCursorPosition);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [value, setValue] = useState("");

  // Load file content when activeFile changes
  useEffect(() => {
    if (!activeFile) {
      setValue("");
      return;
    }

    const code = fs.readFile(activeFile) ?? "";
    setValue(code);
  }, [activeFile, fs]);

  // Handle editor mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Track cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      setCursor(e.position.lineNumber, e.position.column);
    });

    // Configure Monaco theme
    monaco.editor.defineTheme("nocturna-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#161923",
        "editor.foreground": "#d4d7e0",
        "editor.lineHighlightBackground": "#1e2230",
        "editorCursor.foreground": "#6d8cff",
        "editor.selectionBackground": "#2a3441",
        "editor.inactiveSelectionBackground": "#1e2230",
        "editorLineNumber.foreground": "#4a5568",
        "editorLineNumber.activeForeground": "#6d8cff"
      }
    });

    monaco.editor.setTheme("nocturna-dark");
  };

  // Handle editor before mount (configure options)
  const handleEditorWillMount: BeforeMount = (monaco) => {
    // Configure TypeScript defaults
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      typeRoots: ["node_modules/@types"]
    });

    // Enable diagnostics
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    });
  };

  // Handle content changes
  const handleEditorChange: OnChange = (newValue) => {
    if (!activeFile || newValue == null) return;

    // Write to virtual FS
    fs.writeFile(activeFile, newValue);
    setValue(newValue);

    // Trigger HMR (debounced)
    triggerHMR();
  };

  // No file selected
  if (!activeFile) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.4,
          fontSize: 14,
          color: theme.colors.text2
        }}
      >
        Select a file to start editing.
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      theme="nocturna-dark"
      path={activeFile}
      defaultLanguage={detectLanguage(activeFile)}
      value={value}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      beforeMount={handleEditorWillMount}
      options={{
        fontSize: 14,
        fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: "on",
        lineNumbers: "on",
        renderLineHighlight: "all",
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        smoothScrolling: true,
        formatOnPaste: true,
        formatOnType: true
      }}
    />
  );
}

/**
 * Detect language from file extension
 */
function detectLanguage(path: string): string {
  if (path.endsWith(".ts")) return "typescript";
  if (path.endsWith(".tsx")) return "typescript";
  if (path.endsWith(".js")) return "javascript";
  if (path.endsWith(".jsx")) return "javascript";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".html")) return "html";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".md")) return "markdown";
  if (path.endsWith(".mdx")) return "markdown";
  return "plaintext";
}

