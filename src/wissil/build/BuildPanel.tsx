/**
 * WISSIL Build Panel
 * Bolt.new-style UI for incremental Unity WebGL builds
 */

'use client';

import React, { useState, useEffect } from "react";
import {
  runIncrementalBuild,
  runFullBuild,
  needsRebuild,
  getBuildStats
} from "./BuildOrchestrator";
import { Button } from "@/design-system/primitives/Button";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { useEditorState } from "@/state/editorState";
import { CacheManager } from "./CacheManager";

export interface BuildPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function BuildPanel({ className, style }: BuildPanelProps) {
  const theme = useTheme();
  const pushMessage = useEditorState.getState().pushMessage;
  const [buildResult, setBuildResult] = useState<any>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [stats, setStats] = useState(getBuildStats());
  const [needsBuild, setNeedsBuild] = useState(false);

  // Check if rebuild is needed periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNeedsBuild(needsRebuild());
      setStats(getBuildStats());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleIncrementalBuild = async () => {
    setIsBuilding(true);
    setBuildResult(null);

    try {
      const result = await runIncrementalBuild();
      setBuildResult(result);
      setStats(getBuildStats());
      setNeedsBuild(false);
    } catch (err: any) {
      setBuildResult({
        success: false,
        error: err?.message || String(err)
      });
    } finally {
      setIsBuilding(false);
    }
  };

  const handleFullBuild = async () => {
    setIsBuilding(true);
    setBuildResult(null);

    try {
      const result = await runFullBuild();
      setBuildResult(result);
      setStats(getBuildStats());
      setNeedsBuild(false);
    } catch (err: any) {
      setBuildResult({
        success: false,
        error: err?.message || String(err)
      });
    } finally {
      setIsBuilding(false);
    }
  };

  const handleClearCache = () => {
    CacheManager.clearCache();
    setStats(getBuildStats());
    pushMessage("[Build] Cache cleared");
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
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
      {/* Header */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.xl,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          WISSIL Build Pipeline
        </h2>
        <p
          style={{
            margin: 0,
            color: theme.colors.text2,
            fontSize: theme.typography.size.sm,
            opacity: 0.8
          }}
        >
          Bolt.new-style instant rebuilds for Unity WebGL
        </p>
      </div>

      {/* Build Status */}
      {needsBuild && (
        <div
          style={{
            marginBottom: theme.spacing.md,
            padding: theme.spacing.sm,
            background: theme.colors.warning + "20" || theme.colors.bg2,
            border: `1px solid ${theme.colors.warning || theme.colors.border}`,
            borderRadius: theme.radii.md,
            fontSize: theme.typography.size.sm,
            color: theme.colors.warning || theme.colors.text1
          }}
        >
          ⚠️ Changes detected - rebuild recommended
        </div>
      )}

      {/* Build Controls */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.sm
        }}
      >
        <div style={{ display: "flex", gap: theme.spacing.sm }}>
          <Button
            variant="accent"
            onClick={handleIncrementalBuild}
            disabled={isBuilding}
            style={{
              flex: 1,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              fontSize: theme.typography.size.md
            }}
          >
            {isBuilding ? "Building..." : "Incremental Build"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleFullBuild}
            disabled={isBuilding}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              fontSize: theme.typography.size.md
            }}
          >
            Full Build
          </Button>
        </div>
        <Button
          variant="ghost"
          onClick={handleClearCache}
          style={{
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            fontSize: theme.typography.size.sm
          }}
        >
          Clear Cache
        </Button>
      </div>

      {/* Build Result */}
      {buildResult && (
        <div
          style={{
            marginBottom: theme.spacing.lg,
            padding: theme.spacing.md,
            background: buildResult.success
              ? theme.colors.bg1
              : theme.colors.bg2,
            border: `1px solid ${
              buildResult.success
                ? theme.colors.success || theme.colors.border
                : theme.colors.error
            }`,
            borderRadius: theme.radii.md
          }}
        >
          <div
            style={{
              marginBottom: theme.spacing.sm,
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.semibold,
              color: buildResult.success
                ? theme.colors.success || theme.colors.text0
                : theme.colors.error
            }}
          >
            {buildResult.success ? "✓ Build Complete" : "Build Failed"}
          </div>
          <div style={{ fontSize: theme.typography.size.sm, color: theme.colors.text1 }}>
            <div>Type: {buildResult.type}</div>
            <div>Duration: {formatDuration(buildResult.duration)}</div>
            {buildResult.changed && (
              <div>Changed: {buildResult.changed.length} files</div>
            )}
            {buildResult.bundles && (
              <div>Bundles: {buildResult.bundles.length}</div>
            )}
            {buildResult.patches && (
              <div>Patches: {buildResult.patches}</div>
            )}
            {buildResult.message && (
              <div style={{ marginTop: theme.spacing.xs, opacity: 0.8 }}>
                {buildResult.message}
              </div>
            )}
            {buildResult.error && (
              <div
                style={{
                  marginTop: theme.spacing.xs,
                  color: theme.colors.error
                }}
              >
                Error: {buildResult.error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cache Statistics */}
      <div
        style={{
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`
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
          Cache Statistics
        </h3>
        <div
          style={{
            fontSize: theme.typography.size.sm,
            color: theme.colors.text2
          }}
        >
          <div>Last Build: {stats.lastBuildType || "None"}</div>
          <div>Cache Size: {formatSize(stats.cacheSize)}</div>
          <div>Cached Artifacts: {stats.cachedArtifacts}</div>
        </div>
      </div>

      {/* Build Info */}
      <div
        style={{
          marginTop: theme.spacing.lg,
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`,
          fontSize: theme.typography.size.xs,
          color: theme.colors.text2,
          opacity: 0.7
        }}
      >
        <div style={{ marginBottom: theme.spacing.xs }}>
          <strong>Build Types:</strong>
        </div>
        <ul style={{ margin: 0, paddingLeft: theme.spacing.lg }}>
          <li>
            <strong>noop:</strong> No rebuild needed
          </li>
          <li>
            <strong>patch:</strong> IL2CPP method patches (~instant)
          </li>
          <li>
            <strong>asset:</strong> Asset bundle rebuild (~2-4s)
          </li>
          <li>
            <strong>full:</strong> Complete Unity rebuild (~10-20s)
          </li>
        </ul>
      </div>
    </div>
  );
}

