/**
 * Prefab Editing Panel
 * Complete UI for prefab editing (Unity Prefab window equivalent)
 */

'use client';

import React, { useState, useEffect } from "react";
import { usePrefabStore } from "./PrefabStore";
import { PrefabHierarchy } from "./PrefabHierarchy";
import { PrefabInspector } from "./PrefabInspector";
import { PrefabDiff } from "./PrefabDiff";
import { PrefabHotReload } from "./PrefabHotReload";
import { PrefabSerializer } from "./PrefabSerializer";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Button } from "@/design-system/primitives/Button";
import { SplitView } from "@/design-system/primitives/SplitView";
import { useWissilFS } from "../runtime/fs/wissilFs";

export function PrefabEditorPanel() {
  const theme = useTheme();
  const selected = usePrefabStore((state) => state.selected);
  const prefab = usePrefabStore((state) => (selected ? state.getPrefab(selected) : undefined));
  const overrides = usePrefabStore((state) => state.overrides);
  const [originalPrefab, setOriginalPrefab] = useState<any>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [diffs, setDiffs] = useState<any[]>([]);

  // Store original when prefab changes
  useEffect(() => {
    if (prefab && !originalPrefab) {
      setOriginalPrefab(JSON.parse(JSON.stringify(prefab)));
    }
  }, [prefab, originalPrefab]);

  // Calculate diffs when prefab or original changes
  useEffect(() => {
    if (prefab && originalPrefab) {
      const calculatedDiffs = PrefabDiff.diff(originalPrefab, prefab);
      setDiffs(calculatedDiffs);
    } else {
      setDiffs([]);
    }
  }, [prefab, originalPrefab]);

  const handleApply = () => {
    if (!selected || diffs.length === 0) return;
    PrefabHotReload.apply(selected, diffs);
    setOriginalPrefab(JSON.parse(JSON.stringify(prefab)));
  };

  const handleRevert = () => {
    if (!selected) return;
    PrefabHotReload.revert(selected);
    setOriginalPrefab(null);
    setDiffs([]);
  };

  const handleSave = () => {
    if (!selected || !prefab) return;
    PrefabHotReload.save(selected, prefab);
  };

  const handleExport = () => {
    if (!selected || !prefab) return;
    const json = PrefabSerializer.toJSON(prefab);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prefab.name || selected}.prefab.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!selected || !prefab) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.text2,
          fontSize: theme.typography.size.sm
        }}
      >
        Select a prefab to edit
      </div>
    );
  }

  const currentPrefab = overrides[selected] || prefab;

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
          alignItems: "center"
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
          {prefab.name || selected}
        </div>
        {diffs.length > 0 && (
          <div
            style={{
              fontSize: theme.typography.size.sm,
              color: theme.colors.warning,
              marginRight: theme.spacing.md
            }}
          >
            {diffs.length} override{diffs.length !== 1 ? "s" : ""}
          </div>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: theme.spacing.xs }}>
          <Button
            variant={diffs.length > 0 ? "accent" : "ghost"}
            onClick={handleApply}
            disabled={diffs.length === 0}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Apply
          </Button>
          <Button
            variant="ghost"
            onClick={handleRevert}
            disabled={diffs.length === 0}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Revert
          </Button>
          <Button
            variant="ghost"
            onClick={handleSave}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Save
          </Button>
          <Button
            variant="ghost"
            onClick={handleExport}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <SplitView direction="vertical" initial={250}>
          {/* Left: Hierarchy */}
          <div style={{ height: "100%", overflow: "auto", borderRight: `1px solid ${theme.colors.border}` }}>
            <PrefabHierarchy
              prefabId={selected}
              onNodeSelect={setSelectedNodeId}
              selectedNodeId={selectedNodeId}
            />
          </div>

          {/* Right: Split between Inspector and Overrides */}
          <SplitView direction="vertical" initial={400}>
            {/* Inspector */}
            <div style={{ height: "100%", overflow: "auto" }}>
              <PrefabInspector prefabId={selected} nodeId={selectedNodeId || undefined} />
            </div>

            {/* Overrides */}
            <div
              style={{
                height: "100%",
                overflow: "auto",
                borderTop: `1px solid ${theme.colors.border}`,
                padding: theme.spacing.md,
                background: theme.colors.bg1
              }}
            >
              <div
                style={{
                  fontSize: theme.typography.size.sm,
                  fontWeight: theme.typography.weight.semibold,
                  color: theme.colors.text0,
                  marginBottom: theme.spacing.sm
                }}
              >
                Overrides ({diffs.length})
              </div>
              {diffs.length > 0 ? (
                <div
                  style={{
                    fontSize: theme.typography.size.xs,
                    fontFamily: "monospace",
                    background: theme.colors.bg2,
                    padding: theme.spacing.sm,
                    borderRadius: theme.radii.sm,
                    overflow: "auto",
                    maxHeight: "100%"
                  }}
                >
                  <pre style={{ margin: 0, color: theme.colors.text1 }}>
                    {JSON.stringify(diffs, null, 2)}
                  </pre>
                </div>
              ) : (
                <div
                  style={{
                    fontSize: theme.typography.size.xs,
                    color: theme.colors.text2,
                    fontStyle: "italic",
                    textAlign: "center",
                    padding: theme.spacing.md
                  }}
                >
                  No overrides. Make changes to see them here.
                </div>
              )}
            </div>
          </SplitView>
        </SplitView>
      </div>
    </div>
  );
}

