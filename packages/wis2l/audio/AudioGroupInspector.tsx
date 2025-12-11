/**
 * Mixer Group Inspector Panel
 * Volume, Pitch, Sends, Routing, Effects
 */

'use client';

import React from "react";
import { useAudioMixerStore } from "./AudioMixerStore";
import { AudioPatcher } from "./AudioPatcher";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface AudioGroupInspectorProps {
  className?: string;
  style?: React.CSSProperties;
}

export function AudioGroupInspector({ className, style }: AudioGroupInspectorProps) {
  const theme = useTheme();
  const selected = useAudioMixerStore((state) => state.selected);
  const group = useAudioMixerStore((state) => (selected ? state.getGroup(selected) : undefined));
  const updateGroup = useAudioMixerStore((state) => state.updateGroup);

  if (!group) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.md,
          color: theme.colors.text2,
          fontSize: theme.typography.size.sm,
          textAlign: "center",
          ...style
        }}
      >
        Select an audio group to inspect
      </div>
    );
  }

  const handleUpdate = (field: string, value: any) => {
    updateGroup(group.id, { [field]: value });
    AudioPatcher.patch(group.id, group.name, field, value);
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
      {/* Header */}
      <div
        style={{
          marginBottom: theme.spacing.md,
          paddingBottom: theme.spacing.sm,
          borderBottom: `1px solid ${theme.colors.border}`
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: theme.typography.size.md,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          {group.name}
        </h3>
      </div>

      {/* Volume */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.sm
          }}
        >
          <label
            style={{
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.medium,
              color: theme.colors.text0
            }}
          >
            Volume (dB)
          </label>
          <span
            style={{
              fontSize: theme.typography.size.sm,
              color: theme.colors.text1,
              fontFamily: "monospace"
            }}
          >
            {group.volume.toFixed(1)} dB
          </span>
        </div>
        <input
          type="range"
          min={-80}
          max={20}
          step={0.1}
          value={group.volume}
          onChange={(e) => handleUpdate("volume", parseFloat(e.target.value) || 0)}
          style={{
            width: "100%",
            height: 6,
            background: theme.colors.bg2,
            borderRadius: theme.radii.sm,
            outline: "none",
            cursor: "pointer"
          }}
        />
      </Card>

      {/* Pitch */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.sm
          }}
        >
          <label
            style={{
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.medium,
              color: theme.colors.text0
            }}
          >
            Pitch
          </label>
          <span
            style={{
              fontSize: theme.typography.size.sm,
              color: theme.colors.text1,
              fontFamily: "monospace"
            }}
          >
            {group.pitch.toFixed(2)}x
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={3}
          step={0.01}
          value={group.pitch}
          onChange={(e) => handleUpdate("pitch", parseFloat(e.target.value) || 1)}
          style={{
            width: "100%",
            height: 6,
            background: theme.colors.bg2,
            borderRadius: theme.radii.sm,
            outline: "none",
            cursor: "pointer"
          }}
        />
      </Card>

      {/* Effects */}
      {group.effects && group.effects.length > 0 && (
        <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
          <div
            style={{
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0,
              marginBottom: theme.spacing.sm
            }}
          >
            Effects ({group.effects.length})
          </div>
          {group.effects.map((effect, i) => (
            <div
              key={i}
              style={{
                padding: theme.spacing.sm,
                marginBottom: theme.spacing.xs,
                background: theme.colors.bg2,
                borderRadius: theme.radii.sm,
                fontSize: theme.typography.size.xs
              }}
            >
              <div style={{ color: theme.colors.text0, fontWeight: theme.typography.weight.medium }}>
                {effect.type}
              </div>
              {effect.enabled !== undefined && (
                <div style={{ color: theme.colors.text2 }}>
                  {effect.enabled ? "Enabled" : "Disabled"}
                </div>
              )}
            </div>
          ))}
        </Card>
      )}

      {/* Sends */}
      {group.sends && group.sends.length > 0 && (
        <Card style={{ padding: theme.spacing.md }}>
          <div
            style={{
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0,
              marginBottom: theme.spacing.sm
            }}
          >
            Sends ({group.sends.length})
          </div>
          {group.sends.map((send, i) => (
            <div
              key={i}
              style={{
                padding: theme.spacing.sm,
                marginBottom: theme.spacing.xs,
                background: theme.colors.bg2,
                borderRadius: theme.radii.sm,
                fontSize: theme.typography.size.xs
              }}
            >
              <div style={{ color: theme.colors.text0 }}>
                → {send.targetGroup}: {(send.level * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

