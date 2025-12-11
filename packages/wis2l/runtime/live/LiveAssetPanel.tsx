/**
 * Live Asset Editing Panel
 * StackBlitz/Bolt.new-style UI for monitoring live asset edits
 */

'use client';

import React, { useState, useEffect } from "react";
import { useUnityEvents } from "../unityBridge/RuntimeEvents";
import { isAssetDiffEnabled, setAssetDiffEnabled } from "./AssetDiffEngine";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Button } from "@/design-system/primitives/Button";

export interface LiveAssetPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function LiveAssetPanel({ className, style }: LiveAssetPanelProps) {
  const theme = useTheme();
  const { events } = useUnityEvents();
  const [enabled, setEnabled] = useState(isAssetDiffEnabled());

  // Filter asset diff events
  const assetDiffs = events.filter((e) => 
    e.type === "event" && e.data?.type === "assetDiff"
  );

  const recentDiffs = assetDiffs.slice(-20).reverse(); // Show last 20, newest first

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    setAssetDiffEnabled(newEnabled);
  };

  return (
    <div
      className={className}
      style={{
        padding: theme.spacing.md,
        height: "100%",
        overflow: "auto",
        background: theme.colors.bg0,
        ...style
      }}
    >
      <div
        style={{
          marginBottom: theme.spacing.md,
          paddingBottom: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.lg,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Live Asset Edits
        </h3>
        <p
          style={{
            margin: 0,
            marginBottom: theme.spacing.md,
            color: theme.colors.text2,
            fontSize: theme.typography.size.sm,
            opacity: 0.8
          }}
        >
          Unity is receiving runtime asset patches. Changes to textures, materials, prefabs, and UI update instantly.
        </p>

        <Button
          variant={enabled ? "accent" : "ghost"}
          onClick={handleToggle}
          style={{ padding: `${theme.spacing.xs} ${theme.spacing.md}`, fontSize: theme.typography.size.sm }}
        >
          {enabled ? "● Live Editing Enabled" : "○ Live Editing Disabled"}
        </Button>
      </div>

      {recentDiffs.length === 0 ? (
        <div
          style={{
            padding: theme.spacing.xl,
            textAlign: "center",
            color: theme.colors.text2,
            opacity: 0.6,
            fontSize: theme.typography.size.sm
          }}
        >
          No asset edits yet. Modify files in the editor to see live updates here.
        </div>
      ) : (
        <div>
          <div
            style={{
              marginBottom: theme.spacing.sm,
              fontSize: theme.typography.size.xs,
              color: theme.colors.text2,
              opacity: 0.7
            }}
          >
            Recent edits ({recentDiffs.length})
          </div>

          {recentDiffs.map((event, i) => {
            const diff = event.data;
            const path = diff?.path || "unknown";
            const diffType = diff?.type || "modified";
            const isError = diffType === "error";

            return (
              <div
                key={event.id || i}
                style={{
                  padding: theme.spacing.sm,
                  marginBottom: theme.spacing.xs,
                  background: isError ? theme.colors.bg2 : theme.colors.bg1,
                  border: `1px solid ${isError ? theme.colors.error : theme.colors.border}`,
                  borderRadius: theme.radii.sm,
                  fontSize: theme.typography.size.sm
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.xs }}>
                  <span
                    aria-hidden="true"
                    style={{
                      fontSize: "10px",
                      color: isError ? theme.colors.error : theme.colors.accent,
                      fontWeight: theme.typography.weight.semibold
                    }}
                  >
                    {isError ? "✕" : diffType === "added" ? "+" : diffType === "deleted" ? "-" : "~"}
                  </span>
                  <code
                    style={{
                      flex: 1,
                      color: isError ? theme.colors.error : theme.colors.text1,
                      fontFamily: "monospace",
                      fontSize: theme.typography.size.xs,
                      wordBreak: "break-all"
                    }}
                  >
                    {path}
                  </code>
                </div>

                {isError && diff?.error && (
                  <div
                    style={{
                      marginTop: theme.spacing.xs,
                      paddingLeft: theme.spacing.md,
                      color: theme.colors.error,
                      fontSize: theme.typography.size.xs,
                      opacity: 0.9
                    }}
                  >
                    {diff.error}
                  </div>
                )}

                {diff?.note && (
                  <div
                    style={{
                      marginTop: theme.spacing.xs,
                      paddingLeft: theme.spacing.md,
                      color: theme.colors.text2,
                      fontSize: theme.typography.size.xs,
                      fontStyle: "italic"
                    }}
                  >
                    {diff.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

