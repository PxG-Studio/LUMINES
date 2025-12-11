/**
 * Deployment Panel UI
 * Deploy builds to various providers
 */

'use client';

import React, { useState } from "react";
import { DeploymentProviders, getAllDeploymentProviders } from "./DeploymentProviders";
import { DeploymentConfig } from "../BuildTypes";
import { useBuildStore } from "../BuildStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";
import { Button } from "@/design-system/primitives/Button";

export interface DeployPanelProps {
  buildFile?: File | Blob;
  buildResult?: any;
  className?: string;
  style?: React.CSSProperties;
}

export function DeployPanel({
  buildFile,
  buildResult,
  className,
  style
}: DeployPanelProps) {
  const theme = useTheme();
  const lastBuild = useBuildStore((state) => state.lastBuild);
  const [provider, setProvider] = useState("r2");
  const [status, setStatus] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState("");

  const providers = getAllDeploymentProviders();

  const handleDeploy = async () => {
    if (!buildFile && !lastBuild) {
      setStatus("No build file available");
      return;
    }

    setIsDeploying(true);
    setStatus("Uploading...");

    try {
      const deployProvider = DeploymentProviders[provider];
      if (!deployProvider) {
        throw new Error(`Unknown provider: ${provider}`);
      }

      // Get deployment config (would come from settings)
      const config: DeploymentConfig = {
        provider,
        endpoint: "", // Would be configured in settings
        accessKeyId: "", // Would be configured in settings
        ...(window as any).WISSIL?.deployConfig?.[provider] || {}
      };

      // Validate config
      if (deployProvider.validate) {
        const isValid = await deployProvider.validate(config);
        if (!isValid) {
          throw new Error(`Invalid deployment configuration for ${provider}`);
        }
      }

      // Upload
      const file = buildFile || (await fetch(lastBuild?.outputPath || "").then((r) => r.blob()));
      const url = await deployProvider.upload(file, config);

      setDeploymentUrl(url);
      setStatus("Deployment complete!");
    } catch (error: any) {
      setStatus(`Deployment failed: ${error.message}`);
      console.error("[DeployPanel] Deployment error:", error);
    } finally {
      setIsDeploying(false);
    }
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
          Deploy Build
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
          {/* Provider Selection */}
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
              Deployment Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
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
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            {providers.find((p) => p.id === provider)?.description && (
              <div
                style={{
                  fontSize: theme.typography.size.xs,
                  color: theme.colors.text2,
                  marginTop: theme.spacing.xs
                }}
              >
                {providers.find((p) => p.id === provider)?.description}
              </div>
            )}
          </div>

          {/* Deploy Button */}
          <Button
            variant="accent"
            onClick={handleDeploy}
            disabled={isDeploying || !buildFile && !lastBuild}
            style={{
              width: "100%",
              padding: `${theme.spacing.sm} ${theme.spacing.md}`
            }}
          >
            {isDeploying ? "Deploying..." : "Deploy"}
          </Button>

          {/* Status */}
          {status && (
            <div
              style={{
                padding: theme.spacing.sm,
                background: theme.colors.bg2,
                borderRadius: theme.radii.sm,
                fontSize: theme.typography.size.sm,
                color: status.includes("failed") ? theme.colors.error : theme.colors.text0
              }}
            >
              {status}
            </div>
          )}

          {/* Deployment URL */}
          {deploymentUrl && (
            <div>
              <a
                href={deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: theme.colors.accent || theme.colors.text0,
                  fontSize: theme.typography.size.sm,
                  textDecoration: "underline"
                }}
              >
                View Deployment →
              </a>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

