/**
 * Shadow Settings Editor
 * Global shadow configuration
 */

'use client';

import React from "react";
import { useLightStore } from "./LightStore";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface ShadowSettingsPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function ShadowSettingsPanel({ className, style }: ShadowSettingsPanelProps) {
  const theme = useTheme();
  const shadows = useLightStore((state) => state.shadows);
  const setShadows = useLightStore((state) => state.setShadows);

  const handleUpdate = (field: string, value: any) => {
    const updated = shadows
      ? { ...shadows, [field]: value }
      : {
          shadowDistance: 50,
          shadowResolution: "High",
          shadowCascades: 2,
          shadowBias: 0.05,
          shadowNormalBias: 0.4
        };
    setShadows(updated as any);

    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("lighting/shadows", {
        [field]: value
      });
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
          Shadow Settings
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
          {/* Shadow Distance */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing.xs
              }}
            >
              <label
                style={{
                  fontSize: theme.typography.size.sm,
                  fontWeight: theme.typography.weight.medium,
                  color: theme.colors.text0
                }}
              >
                Shadow Distance
              </label>
              <span
                style={{
                  fontSize: theme.typography.size.sm,
                  color: theme.colors.text1,
                  fontFamily: "monospace"
                }}
              >
                {(shadows?.shadowDistance || 50).toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={500}
              step={1}
              value={shadows?.shadowDistance || 50}
              onChange={(e) => handleUpdate("shadowDistance", parseFloat(e.target.value) || 50)}
              style={{
                width: "100%",
                height: 6,
                background: theme.colors.bg2,
                borderRadius: theme.radii.sm,
                outline: "none",
                cursor: "pointer"
              }}
            />
          </div>

          {/* Shadow Resolution */}
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
              Shadow Resolution
            </label>
            <select
              value={shadows?.shadowResolution || "High"}
              onChange={(e) => handleUpdate("shadowResolution", e.target.value)}
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
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="VeryHigh">Very High</option>
            </select>
          </div>

          {/* Shadow Cascades */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing.xs
              }}
            >
              <label
                style={{
                  fontSize: theme.typography.size.sm,
                  fontWeight: theme.typography.weight.medium,
                  color: theme.colors.text0
                }}
              >
                Shadow Cascades
              </label>
              <span
                style={{
                  fontSize: theme.typography.size.sm,
                  color: theme.colors.text1,
                  fontFamily: "monospace"
                }}
              >
                {shadows?.shadowCascades || 2}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={shadows?.shadowCascades || 2}
              onChange={(e) => handleUpdate("shadowCascades", parseInt(e.target.value, 10) || 2)}
              style={{
                width: "100%",
                height: 6,
                background: theme.colors.bg2,
                borderRadius: theme.radii.sm,
                outline: "none",
                cursor: "pointer"
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

