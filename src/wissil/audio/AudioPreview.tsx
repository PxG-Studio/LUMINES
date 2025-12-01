/**
 * Live Audio Preview Panel
 * Preview sound effects and music
 */

'use client';

import React from "react";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";
import { Button } from "@/design-system/primitives/Button";

export interface AudioPreviewProps {
  className?: string;
  style?: React.CSSProperties;
}

export function AudioPreview({ className, style }: AudioPreviewProps) {
  const theme = useTheme();

  const handlePlay = (soundId: string) => {
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("audio/preview", {
        id: soundId
      });
    }
  };

  const previewSounds = [
    { id: "sfx_card_flip", label: "Card Flip" },
    { id: "sfx_capture", label: "Capture" },
    { id: "sfx_place", label: "Place Card" },
    { id: "music_theme", label: "Theme Music" },
    { id: "music_victory", label: "Victory" }
  ];

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
          Audio Preview
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
          {previewSounds.map((sound) => (
            <Button
              key={sound.id}
              variant="ghost"
              onClick={() => handlePlay(sound.id)}
              style={{
                width: "100%",
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                fontSize: theme.typography.size.sm,
                justifyContent: "flex-start"
              }}
            >
              ▶ {sound.label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}

