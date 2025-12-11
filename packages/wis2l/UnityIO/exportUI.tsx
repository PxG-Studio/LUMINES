/**
 * Unity Export UI
 * UI component for Unity export options
 */

'use client';

import React, { useState } from "react";
import { exportUnityScenes } from "./exportUnityScenes";
import { exportUnityBuild } from "./exportUnityBuild";
import { exportUnityHybrid } from "./exportUnityHybrid";
import { Button } from "@/design-system/primitives/Button";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { useEditorState } from "@/state/editorState";

export interface UnityExportUIProps {
  className?: string;
  style?: React.CSSProperties;
}

export function UnityExportUI({ className, style }: UnityExportUIProps) {
  const theme = useTheme();
  const pushMessage = useEditorState.getState().pushMessage;
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (
    type: "scenes" | "build" | "hybrid",
    exportFn: () => Promise<void>
  ) => {
    setExporting(type);
    pushMessage(`[Unity] Starting ${type} export...`);

    try {
      await exportFn();
      pushMessage(`[Unity] ${type} export completed successfully`);
    } catch (err: any) {
      pushMessage(`❌ [Unity] ${type} export failed: ${err?.message || String(err)}`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div
      className={className}
      style={{
        padding: theme.spacing.xl,
        ...style
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: theme.spacing.lg,
          fontSize: theme.typography.size.xl,
          fontWeight: theme.typography.weight.semibold,
          color: theme.colors.text0
        }}
      >
        Unity Export Options
      </h2>

      <p
        style={{
          marginBottom: theme.spacing.lg,
          color: theme.colors.text2,
          fontSize: theme.typography.size.sm
        }}
      >
        Export your WISSIL project as Unity-compatible packages
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.md
        }}
      >
        <div
          style={{
            padding: theme.spacing.lg,
            background: theme.colors.bg1,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.md
          }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: theme.spacing.sm,
              fontSize: theme.typography.size.md,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0
            }}
          >
            Export Scenes & Assets
          </h3>
          <p
            style={{
              margin: 0,
              marginBottom: theme.spacing.md,
              color: theme.colors.text2,
              fontSize: theme.typography.size.sm
            }}
          >
            Export Unity scenes, scripts, and assets from your filesystem. Creates a .unityscene.zip file that Unity can import.
          </p>
          <Button
            variant="accent"
            onClick={() => handleExport("scenes", exportUnityScenes)}
            disabled={exporting !== null}
            style={{ padding: "8px 16px" }}
          >
            {exporting === "scenes" ? "Exporting..." : "Export Scenes & Assets (.unityscene.zip)"}
          </Button>
        </div>

        <div
          style={{
            padding: theme.spacing.lg,
            background: theme.colors.bg1,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.md
          }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: theme.spacing.sm,
              fontSize: theme.typography.size.md,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0
            }}
          >
            Export WebGL Build
          </h3>
          <p
            style={{
              margin: 0,
              marginBottom: theme.spacing.md,
              color: theme.colors.text2,
              fontSize: theme.typography.size.sm
            }}
          >
            Export the Unity WebGL build currently loaded in Ignis. Creates a .unitybuild.zip file ready for deployment.
          </p>
          <Button
            variant="accent"
            onClick={() => handleExport("build", exportUnityBuild)}
            disabled={exporting !== null}
            style={{ padding: "8px 16px" }}
          >
            {exporting === "build" ? "Exporting..." : "Export WebGL Build (.unitybuild.zip)"}
          </Button>
        </div>

        <div
          style={{
            padding: theme.spacing.lg,
            background: theme.colors.bg1,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.md
          }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: theme.spacing.sm,
              fontSize: theme.typography.size.md,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0
            }}
          >
            Export Hybrid Bundle
          </h3>
          <p
            style={{
              margin: 0,
              marginBottom: theme.spacing.md,
              color: theme.colors.text2,
              fontSize: theme.typography.size.sm
            }}
          >
            Export a complete Unity package with assets, scenes, WebGL build, and metadata. Creates a .unitybundle.zip that Unity Hub can open.
          </p>
          <Button
            variant="accent"
            onClick={() => handleExport("hybrid", () => exportUnityHybrid())}
            disabled={exporting !== null}
            style={{ padding: "8px 16px" }}
          >
            {exporting === "hybrid" ? "Exporting..." : "Export Hybrid Bundle (.unitybundle.zip)"}
          </Button>
        </div>
      </div>
    </div>
  );
}

