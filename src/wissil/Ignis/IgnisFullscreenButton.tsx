/**
 * IgnisFullscreenButton Component
 * Fullscreen toggle (placeholder until Phase 4 wires real canvas fullscreen)
 */

'use client';

import React from "react";
import { Button } from "@/design-system/primitives/Button";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface IgnisFullscreenButtonProps {
  onFullscreen?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function IgnisFullscreenButton({
  onFullscreen,
  className,
  style
}: IgnisFullscreenButtonProps) {
  const theme = useTheme();

  const handleClick = () => {
    if (onFullscreen) {
      onFullscreen();
    } else {
      // Placeholder until Phase 4
      alert("Fullscreen placeholder - will be wired to Unity canvas in Phase 4");
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={className}
      style={{
        padding: "4px 10px",
        fontSize: theme.typography.size.sm,
        ...style
      }}
    >
      Fullscreen
    </Button>
  );
}

