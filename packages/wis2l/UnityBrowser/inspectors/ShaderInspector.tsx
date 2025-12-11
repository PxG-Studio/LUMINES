/**
 * Shader Inspector Component
 * Displays Unity shader source code with syntax highlighting
 */

'use client';

import React from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface ShaderInspectorProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ShaderInspector({ content, className, style }: ShaderInspectorProps) {
  const theme = useTheme();

  return (
    <div
      className={className}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...style
      }}
    >
      <div
        style={{
          padding: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.bg1
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: theme.typography.size.lg,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Shader Source
        </h2>
      </div>

      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          defaultLanguage="hlsl"
          value={content}
          theme="nocturna-dark"
          options={{
            readOnly: true,
            minimap: { enabled: true },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on"
          }}
        />
      </div>
    </div>
  );
}

