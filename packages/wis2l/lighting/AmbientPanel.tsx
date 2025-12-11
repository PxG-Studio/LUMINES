/**
 * Ambient / Skybox / HDR Controls
 * Environment lighting settings
 */

'use client';

import React, { useState } from "react";
import { useLightStore } from "./LightStore";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface AmbientPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function AmbientPanel({ className, style }: AmbientPanelProps) {
  const theme = useTheme();
  const ambient = useLightStore((state) => state.ambient);
  const skybox = useLightStore((state) => state.skybox);
  const setAmbient = useLightStore((state) => state.setAmbient);
  const setSkybox = useLightStore((state) => state.setSkybox);

  const handleUpdateAmbient = (field: string, value: any) => {
    const updated = ambient ? { ...ambient, [field]: value } : { ambientIntensity: 1, ambientColor: { r: 0.5, g: 0.5, b: 0.5 }, ambientMode: "Skybox" };
    setAmbient(updated as any);
    
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("lighting/ambient", {
        [field]: value
      });
    }
  };

  const handleUpdateSkybox = (field: string, value: any) => {
    const updated = skybox ? { ...skybox, [field]: value } : { tint: { r: 1, g: 1, b: 1 }, exposure: 1, rotation: 0 };
    setSkybox(updated as any);
    
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("lighting/skybox", {
        [field]: value
      });
    }
  };

  const skyboxTint = skybox?.tint || { r: 1, g: 1, b: 1 };
  const skyboxHex = rgbToHex(skyboxTint);

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
      {/* Ambient Settings */}
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
          Ambient Lighting
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
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
                Ambient Intensity
              </label>
              <span
                style={{
                  fontSize: theme.typography.size.sm,
                  color: theme.colors.text1,
                  fontFamily: "monospace"
                }}
              >
                {(ambient?.ambientIntensity || 1).toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={0.01}
              value={ambient?.ambientIntensity || 1}
              onChange={(e) => handleUpdateAmbient("ambientIntensity", parseFloat(e.target.value) || 1)}
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

      {/* Skybox Settings */}
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
          Skybox
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
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
              Skybox Tint
            </label>
            <input
              type="color"
              value={skyboxHex}
              onChange={(e) => {
                const rgba = hexToRGBA(e.target.value);
                handleUpdateSkybox("tint", rgba);
              }}
              style={{
                width: "100%",
                height: 32,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii.sm,
                cursor: "pointer"
              }}
            />
          </div>
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
                {(skybox?.exposure || 1).toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={-5}
              max={5}
              step={0.1}
              value={skybox?.exposure || 1}
              onChange={(e) => handleUpdateSkybox("exposure", parseFloat(e.target.value) || 1)}
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

function rgbToHex(color: { r: number; g: number; b: number }): string {
  const r = Math.round(Math.max(0, Math.min(1, color.r)) * 255);
  const g = Math.round(Math.max(0, Math.min(1, color.g)) * 255);
  const b = Math.round(Math.max(0, Math.min(1, color.b)) * 255);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRGBA(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return { r, g, b };
}

