/**
 * Build Artifact Browser
 * Browse and download build artifacts
 */

'use client';

import React from "react";
import { useBuildStore } from "./BuildStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";
import { Button } from "@/design-system/primitives/Button";

export interface ArtifactBrowserProps {
  className?: string;
  style?: React.CSSProperties;
}

export function ArtifactBrowser({ className, style }: ArtifactBrowserProps) {
  const theme = useTheme();
  const lastBuild = useBuildStore((state) => state.lastBuild);
  const releases = useBuildStore((state) => state.releases);

  const artifacts = lastBuild?.artifacts || [];

  const handleDownload = (artifact: any) => {
    if (artifact.url) {
      window.open(artifact.url, "_blank");
    } else if (artifact.path) {
      // Create download link
      const link = document.createElement("a");
      link.href = artifact.path;
      link.download = artifact.name;
      link.click();
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  return (
    <div
      className={className}
      style={{
        height: "100%",
        overflow: "auto",
        padding: theme.spacing.md,
        background: theme.colors.bg0,
        ...style
      }}
    >
      {/* Last Build Artifacts */}
      {lastBuild && (
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
            Last Build Artifacts ({lastBuild.version})
          </h3>
          {artifacts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
              {artifacts.map((artifact, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: theme.spacing.sm,
                    background: theme.colors.bg2,
                    borderRadius: theme.radii.sm
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: theme.typography.size.sm,
                        fontWeight: theme.typography.weight.medium,
                        color: theme.colors.text0,
                        marginBottom: theme.spacing.xs
                      }}
                    >
                      {artifact.name}
                    </div>
                    <div
                      style={{
                        fontSize: theme.typography.size.xs,
                        color: theme.colors.text2
                      }}
                    >
                      {formatSize(artifact.size)} • {artifact.type}
                    </div>
                  </div>
                  <Button variant="accent" onClick={() => handleDownload(artifact)}>
                    Download
                  </Button>
                </div>
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
              No artifacts available
            </div>
          )}
        </Card>
      )}

      {/* Release History */}
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
          Release History
        </h3>
        {releases.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
            {releases.slice(0, 10).map((release, i) => (
              <div
                key={i}
                style={{
                  padding: theme.spacing.sm,
                  background: theme.colors.bg2,
                  borderRadius: theme.radii.sm,
                  fontSize: theme.typography.size.sm
                }}
              >
                <div
                  style={{
                    fontWeight: theme.typography.weight.semibold,
                    color: theme.colors.text0,
                    marginBottom: theme.spacing.xs
                  }}
                >
                  {release.version} • {release.target} • {release.profile}
                </div>
                {release.changelog && (
                  <div
                    style={{
                      color: theme.colors.text2,
                      fontSize: theme.typography.size.xs,
                      marginTop: theme.spacing.xs
                    }}
                  >
                    {release.changelog}
                  </div>
                )}
                {release.deploymentUrl && (
                  <a
                    href={release.deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: theme.colors.accent || theme.colors.text0,
                      fontSize: theme.typography.size.xs,
                      marginTop: theme.spacing.xs,
                      display: "block"
                    }}
                  >
                    View Deployment →
                  </a>
                )}
              </div>
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
            No releases yet
          </div>
        )}
      </Card>
    </div>
  );
}

