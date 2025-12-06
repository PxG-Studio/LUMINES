/**
 * Unity Preview Panel
 * Storybook panel for browsing and loading Unity assets
 */

'use client';

import React, { useState, useEffect } from "react";
// Use relative imports for Storybook addon compatibility with esbuild
import { useWissilFS } from "../../src/wissil/runtime/fs/wissilFs";
import { UnityAssetStory } from "../../src/story-components/UnityAssetStory";
import { useTheme } from "../../src/design-system/themes/ThemeProvider";

export interface UnityPreviewPanelProps {
  active?: boolean;
  key?: string;
}

export function UnityPreviewPanel({ active }: UnityPreviewPanelProps) {
  const theme = useTheme();
  const fs = useWissilFS.getState();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileList, setFileList] = useState<string[]>([]);

  useEffect(() => {
    // Get list of Unity assets from filesystem
    const snapshot = fs.getSnapshot();
    const files: string[] = [];

    function walk(node: any, path: string = "") {
      if (!node || node.type === "file") {
        const fullPath = path;
        if (
          fullPath.endsWith(".unity") ||
          fullPath.endsWith(".prefab") ||
          fullPath.endsWith(".mat") ||
          fullPath.endsWith(".shader") ||
          fullPath.endsWith(".cs") ||
          fullPath.endsWith(".meta") ||
          fullPath.match(/\.(png|jpg|jpeg|gif|webp)$/i)
        ) {
          files.push(fullPath);
        }
        return;
      }

      if (node.children) {
        for (const [key, child] of Object.entries(node.children)) {
          const childPath = path ? `${path}/${key}` : key;
          walk(child, childPath);
        }
      }
    }

    walk(snapshot);
    setFileList(files);
  }, [fs]);

  if (!active) {
    return null;
  }

  const selectedContent = selectedFile ? fs.readFile(selectedFile) : null;

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: theme.colors.bg0,
        color: theme.colors.text0
      }}
    >
      <div
        style={{
          padding: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.bg1
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: theme.spacing.xs,
            fontSize: theme.typography.size.lg,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Unity Explorer
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: theme.typography.size.sm,
            color: theme.colors.text2
          }}
        >
          Browse Unity assets and load them directly in Storybook. Files from WISSIL FS appear here.
        </p>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* File List Sidebar */}
        <div
          style={{
            width: 250,
            borderRight: `1px solid ${theme.colors.border}`,
            overflowY: "auto",
            background: theme.colors.bg1
          }}
        >
          {fileList.length === 0 ? (
            <div
              style={{
                padding: theme.spacing.md,
                color: theme.colors.text2,
                fontSize: theme.typography.size.sm,
                opacity: 0.6
              }}
            >
              No Unity assets found. Load a Unity template first.
            </div>
          ) : (
            fileList.map((file) => (
              <div
                key={file}
                onClick={() => setSelectedFile(file)}
                style={{
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  cursor: "pointer",
                  background:
                    selectedFile === file ? theme.colors.bg2 : "transparent",
                  borderLeft:
                    selectedFile === file
                      ? `3px solid ${theme.colors.accent}`
                      : "3px solid transparent",
                  fontSize: theme.typography.size.sm,
                  color: theme.colors.text1,
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  if (selectedFile !== file) {
                    e.currentTarget.style.background = theme.colors.bg2;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFile !== file) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {file.split("/").pop()}
              </div>
            ))
          )}
        </div>

        {/* Asset Preview */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            background: theme.colors.bg0
          }}
        >
          {!selectedFile ? (
            <div
              style={{
                padding: theme.spacing.xl,
                textAlign: "center",
                color: theme.colors.text2,
                opacity: 0.6
              }}
            >
              Select an asset from the list to preview
            </div>
          ) : !selectedContent ? (
            <div
              style={{
                padding: theme.spacing.xl,
                textAlign: "center",
                color: theme.colors.error
              }}
            >
              Failed to load: {selectedFile}
            </div>
          ) : (
            <UnityAssetStory path={selectedFile} content={selectedContent} />
          )}
        </div>
      </div>
    </div>
  );
}

