/**
 * Meta Inspector Component
 * Displays Unity .meta file information
 */

'use client';

import React from "react";
import { parseUnityYAML } from "../parsers/yamlParser";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface MetaInspectorProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MetaInspector({ content, className, style }: MetaInspectorProps) {
  const theme = useTheme();
  const docs = parseUnityYAML(content);

  // Meta files typically have a single document with guid and importer info
  const metaData = docs[0] || {};

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
        Unity Meta File
      </h2>

      {Object.keys(metaData).length === 0 ? (
        <div
          style={{
            padding: theme.spacing.md,
            color: theme.colors.text2,
            opacity: 0.6
          }}
        >
          No metadata found
        </div>
      ) : (
        <div>
          {metaData.guid && (
            <div
              style={{
                marginBottom: theme.spacing.md,
                padding: theme.spacing.md,
                background: theme.colors.bg1,
                borderRadius: theme.radii.md,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <div style={{ marginBottom: theme.spacing.xs }}>
                <strong style={{ color: theme.colors.text0 }}>GUID:</strong>{" "}
                <code
                  style={{
                    background: theme.colors.bg2,
                    padding: "2px 6px",
                    borderRadius: theme.radii.sm,
                    fontFamily: "monospace",
                    fontSize: theme.typography.size.sm
                  }}
                >
                  {metaData.guid}
                </code>
              </div>
              {metaData.fileFormatVersion && (
                <div style={{ marginBottom: theme.spacing.xs }}>
                  <strong style={{ color: theme.colors.text0 }}>Format Version:</strong>{" "}
                  {metaData.fileFormatVersion}
                </div>
              )}
            </div>
          )}

          <h3
            style={{
              marginTop: theme.spacing.lg,
              marginBottom: theme.spacing.md,
              fontSize: theme.typography.size.md,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0
            }}
          >
            Full Metadata
          </h3>

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
            {JSON.stringify(metaData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

