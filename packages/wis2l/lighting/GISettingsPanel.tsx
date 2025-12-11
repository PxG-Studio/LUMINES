/**
 * GI / Lightmap Toggles
 * Global illumination settings
 */

'use client';

import React from "react";
import { useLightStore } from "./LightStore";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface GISettingsPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function GISettingsPanel({ className, style }: GISettingsPanelProps) {
  const theme = useTheme();
  const gi = useLightStore((state) => state.gi);
  const setGI = useLightStore((state) => state.setGI);

  const handleToggle = (field: "realtimeGI" | "bakedGI", value: boolean) => {
    const updated = gi
      ? { ...gi, [field]: value }
      : {
          realtimeGI: false,
          bakedGI: false
        };
    setGI(updated as any);

    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("lighting/gi", {
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
          Global Illumination
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label
              style={{
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.medium,
                color: theme.colors.text0
              }}
            >
              Realtime GI
            </label>
            <input
              type="checkbox"
              checked={gi?.realtimeGI || false}
              onChange={(e) => handleToggle("realtimeGI", e.target.checked)}
              style={{
                width: 20,
                height: 20,
                cursor: "pointer"
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label
              style={{
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.medium,
                color: theme.colors.text0
              }}
            >
              Baked GI
            </label>
            <input
              type="checkbox"
              checked={gi?.bakedGI || false}
              onChange={(e) => handleToggle("bakedGI", e.target.checked)}
              style={{
                width: 20,
                height: 20,
                cursor: "pointer"
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

