/**
 * ToneMapper + Exposure Controls
 * Post-processing tone mapping settings
 */

'use client';

import React from "react";
import { useLightStore } from "./LightStore";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface ToneMappingPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function ToneMappingPanel({ className, style }: ToneMappingPanelProps) {
  const theme = useTheme();
  const toneMapping = useLightStore((state) => state.toneMapping);
  const setToneMapping = useLightStore((state) => state.setToneMapping);

  const handleUpdate = (field: string, value: any) => {
    const updated = toneMapping
      ? { ...toneMapping, [field]: value }
      : {
          mode: "ACES" as const,
          exposure: 0
        };
    setToneMapping(updated as any);

    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("lighting/tonemap", {
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
          Tone Mapping
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
          {/* Tone Mapping Mode */}
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
              Mode
            </label>
            <select
              value={toneMapping?.mode || "ACES"}
              onChange={(e) => handleUpdate("mode", e.target.value)}
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
              <option value="None">None</option>
              <option value="ACES">ACES</option>
              <option value="Neutral">Neutral</option>
              <option value="Reinhard">Reinhard</option>
            </select>
          </div>

          {/* Exposure */}
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
                Exposure
              </label>
              <span
                style={{
                  fontSize: theme.typography.size.sm,
                  color: theme.colors.text1,
                  fontFamily: "monospace"
                }}
              >
                {(toneMapping?.exposure || 0).toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={-5}
              max={5}
              step={0.1}
              value={toneMapping?.exposure || 0}
              onChange={(e) => handleUpdate("exposure", parseFloat(e.target.value) || 0)}
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

