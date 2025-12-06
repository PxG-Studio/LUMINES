/**
 * IgnisFPSMeter Component
 * Simple FPS display (simulated for now, will connect to Unity in Phase 4)
 */

'use client';

import React, { useEffect, useState } from "react";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface IgnisFPSMeterProps {
  className?: string;
  style?: React.CSSProperties;
}

export function IgnisFPSMeter({ className, style }: IgnisFPSMeterProps) {
  const theme = useTheme();
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate FPS variation (55-65 range)
      setFps(55 + Math.round(Math.random() * 10));
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={className}
      style={{
        fontSize: theme.typography.size.sm,
        color: theme.colors.text2,
        fontFamily: theme.typography.font,
        ...style
      }}
    >
      {fps} FPS
    </div>
  );
}

