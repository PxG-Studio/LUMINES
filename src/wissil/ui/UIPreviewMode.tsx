/**
 * UI Preview Mode
 * Resolution preview + safe area simulation
 */

'use client';

import React, { useState } from "react";
import { useCanvasStore } from "./CanvasStore";
import { PreviewResolution } from "./UITypes";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";
import { Button } from "@/design-system/primitives/Button";

export interface UIPreviewModeProps {
  className?: string;
  style?: React.CSSProperties;
}

const PREVIEW_RESOLUTIONS: PreviewResolution[] = [
  { width: 1920, height: 1080, name: "Full HD", aspectRatio: "16:9" },
  { width: 2560, height: 1440, name: "QHD", aspectRatio: "16:9" },
  { width: 3840, height: 2160, name: "4K", aspectRatio: "16:9" },
  { width: 1280, height: 720, name: "HD", aspectRatio: "16:9" },
  { width: 375, height: 667, name: "iPhone SE", aspectRatio: "9:16" },
  { width: 390, height: 844, name: "iPhone 12/13", aspectRatio: "9:19.5" },
  { width: 428, height: 926, name: "iPhone 12/13 Pro Max", aspectRatio: "9:19.5" },
  { width: 360, height: 640, name: "Android", aspectRatio: "9:16" }
];

export function UIPreviewMode({ className, style }: UIPreviewModeProps) {
  const theme = useTheme();
  const previewResolution = useCanvasStore((state) => state.previewResolution);
  const setPreviewResolution = useCanvasStore((state) => state.setPreviewResolution);
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);

  const handleSelectResolution = (resolution: PreviewResolution) => {
    setPreviewResolution(resolution);

    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("ui/preview", {
        resolution: `${resolution.width}x${resolution.height}`,
        width: resolution.width,
        height: resolution.height
      });
    }
  };

  const handleCustomResolution = () => {
    const custom: PreviewResolution = {
      width: customWidth,
      height: customHeight,
      name: "Custom",
      aspectRatio: `${customWidth / gcd(customWidth, customHeight)}:${customHeight / gcd(customWidth, customHeight)}`
    };
    handleSelectResolution(custom);
  };

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

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
          Preview Resolution
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.sm }}>
          {PREVIEW_RESOLUTIONS.map((res) => (
            <Button
              key={`${res.width}x${res.height}`}
              variant={
                previewResolution?.width === res.width && previewResolution?.height === res.height
                  ? "accent"
                  : "ghost"
              }
              onClick={() => handleSelectResolution(res)}
              style={{
                width: "100%",
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                fontSize: theme.typography.size.sm,
                justifyContent: "flex-start"
              }}
            >
              {res.name} ({res.width}×{res.height}) — {res.aspectRatio}
            </Button>
          ))}
        </div>
      </Card>

      <Card style={{ padding: theme.spacing.md, marginTop: theme.spacing.md }}>
        <h3
          style={{
            margin: 0,
            marginBottom: theme.spacing.md,
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Custom Resolution
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.sm }}>
          <div style={{ display: "flex", gap: theme.spacing.xs }}>
            <input
              type="number"
              value={customWidth}
              onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1920)}
              placeholder="Width"
              style={{
                flex: 1,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                background: theme.colors.bg2,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii.sm,
                color: theme.colors.text0,
                fontSize: theme.typography.size.sm
              }}
            />
            <input
              type="number"
              value={customHeight}
              onChange={(e) => setCustomHeight(parseInt(e.target.value) || 1080)}
              placeholder="Height"
              style={{
                flex: 1,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                background: theme.colors.bg2,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii.sm,
                color: theme.colors.text0,
                fontSize: theme.typography.size.sm
              }}
            />
          </div>
          <Button variant="accent" onClick={handleCustomResolution}>
            Apply Custom
          </Button>
        </div>
      </Card>

      {previewResolution && (
        <Card style={{ padding: theme.spacing.md, marginTop: theme.spacing.md }}>
          <div
            style={{
              fontSize: theme.typography.size.sm,
              color: theme.colors.text1
            }}
          >
            Current: {previewResolution.name} ({previewResolution.width}×{previewResolution.height})
          </div>
        </Card>
      )}
    </div>
  );
}

