/**
 * Spark Unity Panel Component
 * UI for selecting and loading Unity starter templates
 */

'use client';

import React, { useState } from "react";
import { UnityTemplates, UnityTemplateMeta } from "./TemplateRegistry";
import { loadUnityTemplate } from "./loadUnityTemplate";
import { Button } from "@/design-system/primitives/Button";
import { Card } from "@/design-system/primitives/Card";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { useEditorState } from "@/state/editorState";

export interface SparkUnityPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SparkUnityPanel({ className, style }: SparkUnityPanelProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState<string | null>(null);
  const pushMessage = useEditorState.getState().pushMessage;

  const handleLoadTemplate = async (template: UnityTemplateMeta) => {
    setLoading(template.id);
    pushMessage(`[Spark] Loading Unity template: ${template.name}...`);

    try {
      await loadUnityTemplate(template);
    } catch (err: any) {
      pushMessage(`❌ [Spark] Failed to load template: ${err?.message || String(err)}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className={className}
      style={{
        padding: theme.spacing.xl,
        height: "100%",
        overflow: "auto",
        background: theme.colors.bg0,
        ...style
      }}
    >
      <div
        style={{
          marginBottom: theme.spacing.xl
        }}
      >
        <h1
          style={{
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontSize: "32px",
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Unity Starter Templates
        </h1>
        <p
          style={{
            margin: 0,
            color: theme.colors.text2,
            fontSize: theme.typography.size.md
          }}
        >
          Choose a Unity template to start building your game. Each template includes assets, scenes, and scripts ready to use.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: theme.spacing.lg
        }}
      >
        {UnityTemplates.map((template) => {
          const isLoading = loading === template.id;
          const hasWebGL = template.includesWebGL;

          return (
            <Card
              key={template.id}
              style={{
                padding: theme.spacing.lg,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                background: theme.colors.bg1,
                border: `1px solid ${theme.colors.border}`,
                opacity: isLoading ? 0.6 : 1,
                transition: "opacity 0.2s ease"
              }}
            >
              <div
                style={{
                  marginBottom: theme.spacing.md
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: theme.spacing.sm
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: theme.typography.size.lg,
                      fontWeight: theme.typography.weight.semibold,
                      color: theme.colors.text0
                    }}
                  >
                    {template.name}
                  </h3>
                  {hasWebGL && (
                    <span
                      style={{
                        fontSize: theme.typography.size.xs,
                        padding: "4px 8px",
                        background: theme.colors.accent + "20",
                        color: theme.colors.accent,
                        borderRadius: theme.radii.sm,
                        fontWeight: theme.typography.weight.medium
                      }}
                    >
                      WebGL
                    </span>
                  )}
                </div>

                <p
                  style={{
                    margin: 0,
                    marginBottom: theme.spacing.md,
                    color: theme.colors.text2,
                    fontSize: theme.typography.size.sm,
                    lineHeight: 1.5
                  }}
                >
                  {template.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: theme.spacing.xs,
                    marginBottom: theme.spacing.md
                  }}
                >
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: theme.typography.size.xs,
                        padding: "2px 6px",
                        background: theme.colors.bg2,
                        color: theme.colors.text2,
                        borderRadius: theme.radii.sm,
                        border: `1px solid ${theme.colors.border}`
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    fontSize: theme.typography.size.xs,
                    color: theme.colors.text2,
                    marginBottom: theme.spacing.md
                  }}
                >
                  Unity {template.unityVersion}
                </div>
              </div>

              <div style={{ marginTop: "auto" }}>
                <Button
                  variant="accent"
                  onClick={() => handleLoadTemplate(template)}
                  disabled={isLoading || loading !== null}
                  style={{
                    width: "100%",
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    fontSize: theme.typography.size.md
                  }}
                >
                  {isLoading ? "Loading..." : "Create Project"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

