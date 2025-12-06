/**
 * Lighting Editor Panel
 * Complete UI for lighting editor (Unity Lighting window equivalent)
 */

'use client';

import React, { useState } from "react";
import { LightList } from "./LightList";
import { LightInspector } from "./LightInspector";
import { AmbientPanel } from "./AmbientPanel";
import { ShadowSettingsPanel } from "./ShadowSettingsPanel";
import { GISettingsPanel } from "./GISettingsPanel";
import { ToneMappingPanel } from "./ToneMappingPanel";
import { LunaLightAssistant } from "../luna/LunaLightAssistant";
import { useLightStore } from "./LightStore";
import { LightPatcher } from "./LightPatcher";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Button } from "@/design-system/primitives/Button";
import { SplitView } from "@/design-system/primitives/SplitView";
import { Card } from "@/design-system/primitives/Card";

export function LightingEditorPanel() {
  const theme = useTheme();
  const lights = useLightStore((state) => state.lights);
  const [activeTab, setActiveTab] = useState<
    "lights" | "ambient" | "shadows" | "gi" | "tonemap" | "luna"
  >("lights");
  const [lunaIssues, setLunaIssues] = useState<any[]>([]);

  const handleAnalyze = () => {
    const issues = LunaLightAssistant.analyze(lights);
    setLunaIssues(issues);
  };

  const handleAutoBalance = () => {
    LunaLightAssistant.autoBalance();
    handleAnalyze(); // Refresh issues
  };

  const handleCreateLight = (type: "Directional" | "Point" | "Spot") => {
    LightPatcher.create(type);
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
          Lighting Editor
        </div>
        <div style={{ display: "flex", gap: theme.spacing.xs }}>
          <Button
            variant="ghost"
            onClick={() => handleCreateLight("Directional")}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.xs
            }}
          >
            + Directional
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleCreateLight("Point")}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.xs
            }}
          >
            + Point
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleCreateLight("Spot")}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.xs
            }}
          >
            + Spot
          </Button>
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
              onClick={handleAutoBalance}
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
          background: theme.colors.bg1
        }}
      >
        {(
          [
            { id: "lights", label: "Lights" },
            { id: "ambient", label: "Ambient" },
            { id: "shadows", label: "Shadows" },
            { id: "gi", label: "GI" },
            { id: "tonemap", label: "Tone Mapping" },
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
              cursor: "pointer"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTab === "lights" && (
          <SplitView direction="vertical" initial={250}>
            <div style={{ height: "100%", overflow: "auto", borderRight: `1px solid ${theme.colors.border}` }}>
              <LightList />
            </div>
            <div style={{ height: "100%", overflow: "auto" }}>
              <LightInspector />
            </div>
          </SplitView>
        )}

        {activeTab === "ambient" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <AmbientPanel />
          </div>
        )}

        {activeTab === "shadows" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <ShadowSettingsPanel />
          </div>
        )}

        {activeTab === "gi" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <GISettingsPanel />
          </div>
        )}

        {activeTab === "tonemap" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <ToneMappingPanel />
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
            <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
              <h3
                style={{
                  margin: 0,
                  marginBottom: theme.spacing.md,
                  fontSize: theme.typography.size.sm,
                  fontWeight: theme.typography.weight.semibold,
                  color: theme.colors.text0
                }}
              >
                LUNA Lighting Analysis
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
                  Click "Analyze" to check lighting setup
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

