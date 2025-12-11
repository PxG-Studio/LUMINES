/**
 * File Preview Router
 * Routes Unity asset files to appropriate inspector component
 */

'use client';

import React from "react";
import { SceneInspector } from "../inspectors/SceneInspector";
import { PrefabInspector } from "../inspectors/PrefabInspector";
import { MaterialInspector } from "../inspectors/MaterialInspector";
import { ShaderInspector } from "../inspectors/ShaderInspector";
import { ScriptInspector } from "../inspectors/ScriptInspector";
import { TextureInspector } from "../inspectors/TextureInspector";
import { MetaInspector } from "../inspectors/MetaInspector";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface FilePreviewRouterProps {
  path: string;
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export function FilePreviewRouter({
  path,
  content,
  className,
  style
}: FilePreviewRouterProps) {
  const theme = useTheme();

  // Route based on file extension
  if (path.endsWith(".unity")) {
    return <SceneInspector content={content} className={className} style={style} />;
  }

  if (path.endsWith(".prefab")) {
    return <PrefabInspector content={content} className={className} style={style} />;
  }

  if (path.endsWith(".mat")) {
    return <MaterialInspector content={content} className={className} style={style} />;
  }

  if (path.endsWith(".shader")) {
    return <ShaderInspector content={content} className={className} style={style} />;
  }

  if (path.endsWith(".cs")) {
    return <ScriptInspector content={content} className={className} style={style} />;
  }

  if (path.endsWith(".meta")) {
    return <MetaInspector content={content} className={className} style={style} />;
  }

  if (
    path.endsWith(".png") ||
    path.endsWith(".jpg") ||
    path.endsWith(".jpeg") ||
    path.endsWith(".gif") ||
    path.endsWith(".webp")
  ) {
    return <TextureInspector filePath={path} className={className} style={style} />;
  }

  // Fallback: raw file viewer
  return (
    <div
      className={className}
      style={{
        padding: theme.spacing.md,
        height: "100%",
        overflow: "auto",
        ...style
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: theme.spacing.md,
          fontSize: theme.typography.size.lg,
          fontWeight: theme.typography.weight.semibold,
          color: theme.colors.text0
        }}
      >
        Raw File: {path.split("/").pop()}
      </h2>
      <pre
        style={{
          background: theme.colors.bg2,
          padding: theme.spacing.md,
          borderRadius: theme.radii.md,
          overflowX: "auto",
          fontSize: theme.typography.size.sm,
          color: theme.colors.text1,
          fontFamily: "monospace",
          border: `1px solid ${theme.colors.border}`
        }}
      >
        {content}
      </pre>
    </div>
  );
}

