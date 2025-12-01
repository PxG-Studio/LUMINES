/**
 * Spatial Audio Editor
 * 3D attenuation, spread, doppler, rolloff
 */

'use client';

import React from "react";
import { useAudioMixerStore } from "./AudioMixerStore";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface SpatialAudioPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SpatialAudioPanel({ className, style }: SpatialAudioPanelProps) {
  const theme = useTheme();
  const spatial = useAudioMixerStore((state) => state.spatial);
  const setSpatial = useAudioMixerStore((state) => state.setSpatial);

  const handleUpdate = (field: string, value: any) => {
    const updated = spatial
      ? { ...spatial, [field]: value }
      : {
          minDistance: 1,
          maxDistance: 500,
          spread: 0,
          dopplerLevel: 1,
          rolloffMode: "Logarithmic" as const,
          spatialBlend: 1
        };
    setSpatial(updated as any);

    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("audio/spatial", {
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
          3D Sound Settings
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
          {/* Min Distance */}
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
                Min Distance
              </label>
              <span
                style={{
                  fontSize: theme.typography.size.sm,
                  color: theme.colors.text1,
                  fontFamily: "monospace"
                }}
              >
                {(spatial?.minDistance || 1).toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={0.1}
              value={spatial?.minDistance || 1}
              onChange={(e) => handleUpdate("minDistance", parseFloat(e.target.value) || 1)}
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

          {/* Max Distance */}
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
                Max Distance
              </label>
              <span
                style={{
                  fontSize: theme.typography.size.sm,
                  color: theme.colors.text1,
                  fontFamily: "monospace"
                }}
              >
                {(spatial?.maxDistance || 500).toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1000}
              step={1}
              value={spatial?.maxDistance || 500}
              onChange={(e) => handleUpdate("maxDistance", parseFloat(e.target.value) || 500)}
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

          {/* Spread */}
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
                Spread
              </label>
              <span
                style={{
                  fontSize: theme.typography.size.sm,
                  color: theme.colors.text1,
                  fontFamily: "monospace"
                }}
              >
                {(spatial?.spread || 0).toFixed(0)}°
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={spatial?.spread || 0}
              onChange={(e) => handleUpdate("spread", parseFloat(e.target.value) || 0)}
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

          {/* Doppler */}
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
                Doppler Level
              </label>
              <span
                style={{
                  fontSize: theme.typography.size.sm,
                  color: theme.colors.text1,
                  fontFamily: "monospace"
                }}
              >
                {(spatial?.dopplerLevel || 1).toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={spatial?.dopplerLevel || 1}
              onChange={(e) => handleUpdate("dopplerLevel", parseFloat(e.target.value) || 1)}
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

          {/* Spatial Blend */}
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
                Spatial Blend (2D ↔ 3D)
              </label>
              <span
                style={{
                  fontSize: theme.typography.size.sm,
                  color: theme.colors.text1,
                  fontFamily: "monospace"
                }}
              >
                {(spatial?.spatialBlend || 1).toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={spatial?.spatialBlend || 1}
              onChange={(e) => handleUpdate("spatialBlend", parseFloat(e.target.value) || 1)}
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

          {/* Rolloff Mode */}
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
              Rolloff Mode
            </label>
            <select
              value={spatial?.rolloffMode || "Logarithmic"}
              onChange={(e) => handleUpdate("rolloffMode", e.target.value)}
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
              <option value="Linear">Linear</option>
              <option value="Logarithmic">Logarithmic</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}

