/**
 * Build Dashboard Panel
 * Complete build and deployment dashboard (Phase Z)
 */

'use client';

import React, { useState } from "react";
import { BUILD_TARGETS, getAllBuildTargets } from "./BuildTargets";
import { BUILD_PROFILES, getAllBuildProfiles } from "./BuildProfiles";
import { BuildRunner } from "./BuildRunner";
import { PreflightValidator } from "./PreflightValidator";
import { LunaBuildDoctor } from "../luna/LunaBuildDoctor";
import { useBuildStore } from "./BuildStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";
import { Button } from "@/design-system/primitives/Button";
import { ArtifactBrowser } from "./ArtifactBrowser";
import { DeployPanel } from "./deploy/DeployPanel";
import { ReleaseManager } from "./ReleaseManager";
import { BuildLog } from "./BuildTypes";

export function BuildDashboardPanel() {
  const theme = useTheme();
  const [target, setTarget] = useState("webgl");
  const [profile, setProfile] = useState("development");
  const [activeTab, setActiveTab] = useState<"build" | "deploy" | "artifacts" | "logs">("build");
  const [preflightIssues, setPreflightIssues] = useState<any[]>([]);

  const isBuilding = useBuildStore((state) => state.isBuilding);
  const buildProgress = useBuildStore((state) => state.buildProgress);
  const buildMessage = useBuildStore((state) => state.buildMessage);
  const buildError = useBuildStore((state) => state.buildError);
  const logs = useBuildStore((state) => state.logs);
  const lastBuild = useBuildStore((state) => state.lastBuild);
  const setIsBuilding = useBuildStore((state) => state.setIsBuilding);
  const setBuildProgress = useBuildStore((state) => state.setBuildProgress);

  const handlePreflight = () => {
    const issues = PreflightValidator.validate(target, profile);
    setPreflightIssues(issues);

    if (issues.length > 0) {
      const fixes = LunaBuildDoctor.analyze(issues);
      if (fixes.length > 0) {
        console.log("[Build Dashboard] Preflight issues found:", fixes);
      }
    }
  };

  const handleAutoFix = () => {
    LunaBuildDoctor.autoFix(preflightIssues);
    // Re-validate
    setTimeout(() => {
      handlePreflight();
    }, 500);
  };

  const handleStartBuild = async () => {
    // Preflight check
    const issues = PreflightValidator.validate(target, profile);
    const errors = issues.filter((i) => i.type === "error");
    if (errors.length > 0) {
      alert(`Cannot build:\n${errors.map((e) => e.message).join("\n")}`);
      return;
    }

    setIsBuilding(true);
    setBuildProgress(0, "Starting build...");

    try {
      const result = await BuildRunner.run({
        target,
        profile,
        onLog: (log: BuildLog) => {
          // Logs are handled by BuildLogStreamer
        },
        onProgress: (progress: number, message: string) => {
          setBuildProgress(progress, message);
        },
        onComplete: (result) => {
          setIsBuilding(false);
          setBuildProgress(100, "Build complete!");
          ReleaseManager.createRelease(
            result.version,
            result.target,
            result.profile,
            result.buildTime
          );
        },
        onError: (error) => {
          setIsBuilding(false);
          console.error("[Build Dashboard] Build error:", error);
        }
      });
    } catch (error: any) {
      setIsBuilding(false);
      console.error("[Build Dashboard] Build failed:", error);
    }
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
          Build & Deploy
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: theme.spacing.xs }}>
          <Button
            variant="ghost"
            onClick={handlePreflight}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.xs
            }}
          >
            Validate
          </Button>
          {preflightIssues.length > 0 && (
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
            { id: "build", label: "Build" },
            { id: "deploy", label: "Deploy" },
            { id: "artifacts", label: "Artifacts" },
            { id: "logs", label: "Logs" }
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
        {activeTab === "build" && (
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
                Build Configuration
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
                {/* Target Selection */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: theme.typography.size.sm,
                      fontWeight: theme.typography.weight.medium,
                      color: theme.colors.text0,
                      marginBottom: theme.spacing.xs
                    }}
                  >
                    Build Target
                  </label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    disabled={isBuilding}
                    style={{
                      width: "100%",
                      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                      background: theme.colors.bg2,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.radii.sm,
                      color: theme.colors.text0,
                      fontSize: theme.typography.size.sm
                    }}
                  >
                    {getAllBuildTargets().map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Profile Selection */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: theme.typography.size.sm,
                      fontWeight: theme.typography.weight.medium,
                      color: theme.colors.text0,
                      marginBottom: theme.spacing.xs
                    }}
                  >
                    Build Profile
                  </label>
                  <select
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    disabled={isBuilding}
                    style={{
                      width: "100%",
                      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                      background: theme.colors.bg2,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.radii.sm,
                      color: theme.colors.text0,
                      fontSize: theme.typography.size.sm
                    }}
                  >
                    {getAllBuildProfiles().map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Build Button */}
                <Button
                  variant="accent"
                  onClick={handleStartBuild}
                  disabled={isBuilding}
                  style={{
                    width: "100%",
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`
                  }}
                >
                  {isBuilding ? `Building... ${buildProgress}%` : "Start Build"}
                </Button>

                {/* Progress */}
                {isBuilding && (
                  <div>
                    <div
                      style={{
                        width: "100%",
                        height: 8,
                        background: theme.colors.bg2,
                        borderRadius: theme.radii.sm,
                        overflow: "hidden",
                        marginBottom: theme.spacing.xs
                      }}
                    >
                      <div
                        style={{
                          width: `${buildProgress}%`,
                          height: "100%",
                          background: theme.colors.accent || theme.colors.text0,
                          transition: "width 0.3s ease"
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: theme.typography.size.xs,
                        color: theme.colors.text2
                      }}
                    >
                      {buildMessage}
                    </div>
                  </div>
                )}

                {/* Error */}
                {buildError && (
                  <div
                    style={{
                      padding: theme.spacing.sm,
                      background: theme.colors.error + "20",
                      border: `1px solid ${theme.colors.error}`,
                      borderRadius: theme.radii.sm,
                      fontSize: theme.typography.size.sm,
                      color: theme.colors.error
                    }}
                  >
                    {buildError}
                  </div>
                )}
              </div>
            </Card>

            {/* Preflight Issues */}
            {preflightIssues.length > 0 && (
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
                  Preflight Issues ({preflightIssues.length})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
                  {preflightIssues.map((issue, i) => (
                    <div
                      key={i}
                      style={{
                        padding: theme.spacing.sm,
                        background: theme.colors.bg2,
                        borderRadius: theme.radii.sm,
                        fontSize: theme.typography.size.xs,
                        border:
                          issue.type === "error"
                            ? `1px solid ${theme.colors.error}`
                            : `1px solid ${theme.colors.border}`
                      }}
                    >
                      <div
                        style={{
                          fontWeight: theme.typography.weight.medium,
                          color: theme.colors.text0,
                          marginBottom: theme.spacing.xs
                        }}
                      >
                        [{issue.severity.toUpperCase()}] {issue.message}
                      </div>
                      {issue.fix && (
                        <div
                          style={{
                            color: theme.colors.text2,
                            fontSize: theme.typography.size.xs
                          }}
                        >
                          💡 {issue.fix}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === "deploy" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <DeployPanel buildResult={lastBuild} />
          </div>
        )}

        {activeTab === "artifacts" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <ArtifactBrowser />
          </div>
        )}

        {activeTab === "logs" && (
          <div
            style={{
              height: "100%",
              overflow: "auto",
              padding: theme.spacing.md,
              fontFamily: "monospace",
              fontSize: theme.typography.size.xs,
              background: theme.colors.bg0
            }}
          >
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div
                  key={i}
                  style={{
                    color:
                      log.level === "error"
                        ? theme.colors.error
                        : log.level === "warning"
                        ? theme.colors.warning
                        : theme.colors.text1,
                    marginBottom: theme.spacing.xs
                  }}
                >
                  [{new Date(log.timestamp).toLocaleTimeString()}] [{log.level.toUpperCase()}]{" "}
                  {log.message}
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: theme.spacing.md,
                  textAlign: "center",
                  color: theme.colors.text2,
                  opacity: 0.6
                }}
              >
                No logs yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

