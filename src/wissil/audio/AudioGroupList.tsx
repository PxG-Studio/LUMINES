/**
 * MixerGroup Hierarchy Panel
 * List of all audio mixer groups
 */

'use client';

import React from "react";
import { useAudioMixerStore } from "./AudioMixerStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface AudioGroupListProps {
  className?: string;
  style?: React.CSSProperties;
}

export function AudioGroupList({ className, style }: AudioGroupListProps) {
  const theme = useTheme();
  const groups = useAudioMixerStore((state) => state.groups);
  const selected = useAudioMixerStore((state) => state.selected);
  const select = useAudioMixerStore((state) => state.select);

  const groupList = Object.values(groups);

  return (
    <div
      className={className}
      style={{
        height: "100%",
        overflow: "auto",
        background: theme.colors.bg0,
        ...style
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.bg1
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
          Mix Groups ({groupList.length})
        </h3>
      </div>

      {/* Group List */}
      <div style={{ padding: theme.spacing.md }}>
        {groupList.length === 0 ? (
          <div
            style={{
              padding: theme.spacing.md,
              textAlign: "center",
              color: theme.colors.text2,
              fontSize: theme.typography.size.sm,
              opacity: 0.6
            }}
          >
            No audio mixer groups found
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
            {groupList.map((group) => (
              <Card
                key={group.id}
                onClick={() => select(group.id)}
                style={{
                  padding: theme.spacing.sm,
                  background: selected === group.id ? theme.colors.bg2 : theme.colors.bg1,
                  border: `1px solid ${
                    selected === group.id ? theme.colors.accent || theme.colors.border : theme.colors.border
                  }`,
                  cursor: "pointer",
                  transition: "background 0.15s ease"
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.size.sm,
                    fontWeight:
                      selected === group.id
                        ? theme.typography.weight.semibold
                        : theme.typography.weight.regular,
                    color: theme.colors.text0,
                    marginBottom: theme.spacing.xs
                  }}
                >
                  {group.name}
                </div>
                <div
                  style={{
                    fontSize: theme.typography.size.xs,
                    color: theme.colors.text2
                  }}
                >
                  Volume: {group.volume.toFixed(1)} dB
                </div>
                {group.effects && group.effects.length > 0 && (
                  <div
                    style={{
                      fontSize: theme.typography.size.xs,
                      color: theme.colors.text2,
                      marginTop: theme.spacing.xs
                    }}
                  >
                    {group.effects.length} effect{group.effects.length !== 1 ? "s" : ""}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

