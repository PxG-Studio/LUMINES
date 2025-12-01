/**
 * Audio Mixer Editor Panel
 * Complete UI for audio mixer (Unity Audio Mixer window equivalent)
 */

'use client';

import React, { useState } from "react";
import { AudioGroupList } from "./AudioGroupList";
import { AudioGroupInspector } from "./AudioGroupInspector";
import { EffectsPanel } from "./EffectsPanel";
import { SoundGraph } from "./SoundGraph";
import { AudioPreview } from "./AudioPreview";
import { SpatialAudioPanel } from "./SpatialAudioPanel";
import { MixerPresetSystem } from "./MixerPresetSystem";
import { LunaAudioAssistant } from "../luna/LunaAudioAssistant";
import { useAudioMixerStore } from "./AudioMixerStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Button } from "@/design-system/primitives/Button";
import { SplitView } from "@/design-system/primitives/SplitView";
import { Card } from "@/design-system/primitives/Card";

export function AudioMixerEditorPanel() {
  const theme = useTheme();
  const groups = useAudioMixerStore((state) => state.groups);
  const presets = useAudioMixerStore((state) => state.presets);
  const [activeTab, setActiveTab] = useState<
    "groups" | "effects" | "graph" | "spatial" | "preview" | "presets" | "luna"
  >("groups");
  const [lunaIssues, setLunaIssues] = useState<any[]>([]);
  const [presetName, setPresetName] = useState("");

  const handleAnalyze = () => {
    const issues = LunaAudioAssistant.analyze(groups);
    setLunaIssues(issues);
  };

  const handleAutoBalance = () => {
    LunaAudioAssistant.autoBalance();
    handleAnalyze(); // Refresh issues
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      alert("Please enter a preset name");
      return;
    }
    MixerPresetSystem.savePreset(presetName.trim());
    setPresetName("");
  };

  const handleLoadPreset = (name: string) => {
    MixerPresetSystem.loadPreset(name);
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
          Audio Mixer
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
          background: theme.colors.bg1,
          overflowX: "auto"
        }}
      >
        {(
          [
            { id: "groups", label: "Groups" },
            { id: "effects", label: "Effects" },
            { id: "graph", label: "SoundGraph" },
            { id: "spatial", label: "3D Audio" },
            { id: "preview", label: "Preview" },
            { id: "presets", label: "Presets" },
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
        {activeTab === "groups" && (
          <SplitView direction="vertical" initial={250}>
            <div style={{ height: "100%", overflow: "auto", borderRight: `1px solid ${theme.colors.border}` }}>
              <AudioGroupList />
            </div>
            <div style={{ height: "100%", overflow: "auto" }}>
              <AudioGroupInspector />
            </div>
          </SplitView>
        )}

        {activeTab === "effects" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <EffectsPanel />
          </div>
        )}

        {activeTab === "graph" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <SoundGraph />
          </div>
        )}

        {activeTab === "spatial" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <SpatialAudioPanel />
          </div>
        )}

        {activeTab === "preview" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <AudioPreview />
          </div>
        )}

        {activeTab === "presets" && (
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
                Save Preset
              </h3>
              <div style={{ display: "flex", gap: theme.spacing.xs }}>
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Preset name"
                  style={{
                    flex: 1,
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    background: theme.colors.bg2,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radii.sm,
                    color: theme.colors.text0,
                    fontSize: theme.typography.size.sm
                  }}
                />
                <Button
                  variant="accent"
                  onClick={handleSavePreset}
                  style={{
                    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                    fontSize: theme.typography.size.sm
                  }}
                >
                  Save
                </Button>
              </div>
            </Card>

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
                Load Preset
              </h3>
              {Object.keys(presets).length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
                  {Object.keys(presets).map((name) => (
                    <Button
                      key={name}
                      variant="ghost"
                      onClick={() => handleLoadPreset(name)}
                      style={{
                        width: "100%",
                        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                        fontSize: theme.typography.size.sm,
                        justifyContent: "flex-start"
                      }}
                    >
                      {name}
                    </Button>
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
                  No presets saved yet
                </div>
              )}
            </Card>
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
                LUNA Audio Analysis
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
                  Click "Analyze" to check audio mixing setup
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

