/**
 * IgnisDeviceSelector Component
 * Simple toggle for preview device sizes
 */

'use client';

import React from "react";
import { Button } from "@/design-system/primitives/Button";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export type DeviceType = "desktop" | "tablet" | "mobile";

export interface IgnisDeviceSelectorProps {
  device: DeviceType;
  setDevice: (device: DeviceType) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function IgnisDeviceSelector({
  device,
  setDevice,
  className,
  style
}: IgnisDeviceSelectorProps) {
  const theme = useTheme();
  const types: DeviceType[] = ["desktop", "tablet", "mobile"];

  return (
    <div
      className={className}
      style={{
        display: "flex",
        gap: theme.spacing.xs,
        ...style
      }}
    >
      {types.map((t) => (
        <Button
          key={t}
          variant={device === t ? "accent" : "ghost"}
          onClick={() => setDevice(t)}
          style={{
            padding: "4px 10px",
            fontSize: theme.typography.size.sm,
            textTransform: "capitalize"
          }}
        >
          {t[0].toUpperCase() + t.slice(1)}
        </Button>
      ))}
    </div>
  );
}

