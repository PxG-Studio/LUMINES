/**
 * Unity Asset Story Router
 * Routes Unity asset files to appropriate inspector components
 */

'use client';

import React from "react";
// Use relative imports for Storybook compatibility
import { SceneInspector } from "../wissil/UnityBrowser/inspectors/SceneInspector";
import { PrefabInspector } from "../wissil/UnityBrowser/inspectors/PrefabInspector";
import { TextureInspector } from "../wissil/UnityBrowser/inspectors/TextureInspector";
import { ShaderInspector } from "../wissil/UnityBrowser/inspectors/ShaderInspector";
import { ScriptInspector } from "../wissil/UnityBrowser/inspectors/ScriptInspector";
import { MaterialInspector } from "../wissil/UnityBrowser/inspectors/MaterialInspector";
import { MetaInspector } from "../wissil/UnityBrowser/inspectors/MetaInspector";

export interface UnityAssetStoryProps {
  path: string;
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Unity Asset Story Component
 * Automatically routes Unity assets to the appropriate inspector
 */
export function UnityAssetStory({
  path,
  content,
  className,
  style
}: UnityAssetStoryProps) {
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
    <pre
      style={{
        padding: 20,
        fontSize: 14,
        background: "#1e1e1e",
        color: "#d4d4d4",
        borderRadius: 8,
        overflow: "auto"
      }}
    >
      {content}
    </pre>
  );
}

