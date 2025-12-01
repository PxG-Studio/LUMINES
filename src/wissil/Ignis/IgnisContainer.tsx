/**
 * IgnisContainer Component
 * Main preview root container where Unity WebGL canvas will mount
 */

'use client';

import React, { useState } from "react";
import { IgnisDeviceSelector, type DeviceType } from "./IgnisDeviceSelector";
import { IgnisFPSMeter } from "./IgnisFPSMeter";
import { IgnisFullscreenButton } from "./IgnisFullscreenButton";
import { IgnisCanvasPlaceholder } from "./IgnisCanvasPlaceholder";
import { UnityMount } from "@/wissil/IgnisWebGL/unityMount";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface IgnisContainerProps {
  className?: string;
  style?: React.CSSProperties;
  unityEnabled?: boolean;
  unityBuildUrl?: string;
}

export function IgnisContainer({
  className,
  style,
  unityEnabled = false,
  unityBuildUrl = "/UnityBuild"
}: IgnisContainerProps) {
  const theme = useTheme();
  const [device, setDevice] = useState<DeviceType>("desktop");

  const deviceStyles = {
    desktop: { width: "100%", height: "100%" },
    tablet: { width: 820, height: 1180, maxWidth: "100%", maxHeight: "100%" },
    mobile: { width: 420, height: 800, maxWidth: "100%", maxHeight: "100%" }
  }[device];

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: theme.colors.bg1,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...style
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          height: 40,
          borderBottom: `1px solid ${theme.colors.border}`,
          display: "flex",
          alignItems: "center",
          paddingLeft: theme.spacing.md,
          paddingRight: theme.spacing.md,
          background: theme.colors.bg2
        }}
      >
        <IgnisDeviceSelector device={device} setDevice={setDevice} />
        
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: theme.spacing.md,
            alignItems: "center"
          }}
        >
          <IgnisFPSMeter />
          <IgnisFullscreenButton />
        </div>
      </div>

      {/* PREVIEW AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "auto",
          padding: theme.spacing.md
        }}
      >
        {/* Device frame */}
        <div
          style={{
            background: theme.colors.bg2,
            borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.border}`,
            overflow: "hidden",
            boxShadow: theme.shadows.strong,
            ...deviceStyles,
            position: "relative",
            minWidth: device === "desktop" ? "100%" : undefined,
            minHeight: device === "desktop" ? "100%" : undefined
          }}
        >
          {/* Unity WebGL canvas mounts here */}
          {unityEnabled ? (
            <UnityMount buildUrl={unityBuildUrl} enabled={unityEnabled} />
          ) : (
            <>
              <IgnisCanvasPlaceholder />
              <div
                id="ignis-canvas-root"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 1,
                  pointerEvents: "auto"
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

