/**
 * UI Canvas Editor Panel
 * Complete UI for Unity UI Canvas Editor
 */

'use client';

import React, { useState } from "react";
import { UIHierarchy } from "./UIHierarchy";
import { RectInspector } from "./RectInspector";
import { AutoLayoutPanel } from "./AutoLayoutPanel";
import { StyleInspector } from "./StyleInspector";
import { UIPreviewMode } from "./UIPreviewMode";
import { AnchorPresets } from "./AnchorPresets";
import { LunaUIAssistant } from "../luna/LunaUIAssistant";
import { useCanvasStore } from "./CanvasStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Button } from "@/design-system/primitives/Button";
import { SplitView } from "@/design-system/primitives/SplitView";
import { Card } from "@/design-system/primitives/Card";

export function UICanvasEditorPanel() {
  const theme = useTheme();
  const rects = useCanvasStore((state) => state.rects);
  const [activeTab, setActiveTab] = useState<
    "hierarchy" | "transform" | "layout" | "style" | "preview" | "anchors" | "luna"
  >("hierarchy");
  const [lunaIssues, setLunaIssues] = useState<any[]>([]);

  const handleAnalyze = () => {
    const issues = LunaUIAssistant.analyze(rects);
    setLunaIssues(issues);
  };

  const handleAutoFix = () => {
    LunaUIAssistant.autoFix();
    handleAnalyze(); // Refresh issues
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: theme.colors.bg0
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.bg1,
          display: "flex",
          gap: theme.spacing.sm,
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            fontSize: theme.typography.size.md,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginRight: theme.spacing.md
          }}
        >
          UI Canvas Editor
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: theme.spacing.xs }}>
          <Button
            variant="ghost"
            onClick={handleAnalyze}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.xs
            }}
          >
            Analyze
          </Button>
          {lunaIssues.length > 0 && (
            <Button
              variant="accent"
              onClick={handleAutoFix}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                fontSize: theme.typography.size.xs
              }}
            >
              Auto-Fix
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.bg1,
          overflowX: "auto"
        }}
      >
        {(
          [
            { id: "hierarchy", label: "Hierarchy" },
            { id: "transform", label: "Transform" },
            { id: "layout", label: "Layout" },
            { id: "style", label: "Style" },
            { id: "preview", label: "Preview" },
            { id: "anchors", label: "Anchors" },
            { id: "luna", label: "LUNA" }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              background: activeTab === tab.id ? theme.colors.bg0 : "transparent",
              border: "none",
              borderBottom:
                activeTab === tab.id
                  ? `2px solid ${theme.colors.accent || theme.colors.text0}`
                  : "2px solid transparent",
              color: activeTab === tab.id ? theme.colors.text0 : theme.colors.text2,
              fontSize: theme.typography.size.sm,
              fontWeight:
                activeTab === tab.id
                  ? theme.typography.weight.semibold
                  : theme.typography.weight.regular,
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTab === "hierarchy" && (
          <SplitView direction="vertical" initial={250}>
            <div style={{ height: "100%", overflow: "auto", borderRight: `1px solid ${theme.colors.border}` }}>
              <UIHierarchy />
            </div>
            <div style={{ height: "100%", overflow: "auto" }}>
              <RectInspector />
            </div>
          </SplitView>
        )}

        {activeTab === "transform" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <RectInspector />
          </div>
        )}

        {activeTab === "layout" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <AutoLayoutPanel />
          </div>
        )}

        {activeTab === "style" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <StyleInspector />
          </div>
        )}

        {activeTab === "preview" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <UIPreviewMode />
          </div>
        )}

        {activeTab === "anchors" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <AnchorPresets />
          </div>
        )}

        {activeTab === "luna" && (
          <div
            style={{
              height: "100%",
              overflow: "auto",
              padding: theme.spacing.md
            }}
          >
            <Card style={{ padding: theme.spacing.md }}>
              <h3
                style={{
                  margin: 0,
                  marginBottom: theme.spacing.md,
                  fontSize: theme.typography.size.sm,
                  fontWeight: theme.typography.weight.semibold,
                  color: theme.colors.text0
                }}
              >
                LUNA UI Analysis
              </h3>
              {lunaIssues.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.sm }}>
                  {lunaIssues.map((issue, i) => (
                    <Card
                      key={i}
                      style={{
                        padding: theme.spacing.sm,
                        background: theme.colors.bg2,
                        border: `1px solid ${theme.colors.border}`
                      }}
                    >
                      <div
                        style={{
                          fontSize: theme.typography.size.sm,
                          fontWeight: theme.typography.weight.medium,
                          color: theme.colors.text0,
                          marginBottom: theme.spacing.xs
                        }}
                      >
                        [{issue.severity.toUpperCase()}] {issue.description}
                      </div>
                      <div
                        style={{
                          fontSize: theme.typography.size.xs,
                          color: theme.colors.text2,
                          marginBottom: issue.fix ? theme.spacing.xs : 0
                        }}
                      >
                        💡 {issue.suggestion}
                      </div>
                      {issue.fix && (
                        <Button
                          variant="ghost"
                          onClick={issue.fix}
                          style={{
                            marginTop: theme.spacing.xs,
                            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                            fontSize: theme.typography.size.xs
                          }}
                        >
                          Apply Fix
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: theme.spacing.md,
                    textAlign: "center",
                    color: theme.colors.text2,
                    fontSize: theme.typography.size.sm,
                    opacity: 0.6
                  }}
                >
                  Click "Analyze" to check UI layout
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

