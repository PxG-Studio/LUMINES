/**
 * SoundGraph Node Editor
 * FMOD/Wwise-style routing graph
 */

'use client';

import React, { useState } from "react";
import { useAudioMixerStore } from "./AudioMixerStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface SoundGraphProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SoundGraph({ className, style }: SoundGraphProps) {
  const theme = useTheme();
  const groups = useAudioMixerStore((state) => state.groups);
  const [dragging, setDragging] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  const groupList = Object.values(groups);

  // Initialize positions
  React.useEffect(() => {
    if (groupList.length > 0 && Object.keys(positions).length === 0) {
      const newPositions: Record<string, { x: number; y: number }> = {};
      groupList.forEach((group, i) => {
        newPositions[group.id] = {
          x: 100,
          y: 50 + i * 100
        };
      });
      setPositions(newPositions);
    }
  }, [groupList, positions]);

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPositions((prev) => ({
      ...prev,
      [dragging]: { x, y }
    }));
  };

  const handleMouseUp = () => {
    setDragging(null);
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
          SoundGraph
        </h3>
        <div
          style={{
            width: "100%",
            minHeight: 400,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.md,
            background: theme.colors.bg1,
            position: "relative",
            overflow: "auto"
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {groupList.map((group) => {
            const pos = positions[group.id] || { x: 100, y: 50 };
            return (
              <div
                key={group.id}
                onMouseDown={(e) => handleMouseDown(group.id, e)}
                style={{
                  position: "absolute",
                  left: pos.x,
                  top: pos.y,
                  padding: theme.spacing.sm,
                  border: `2px solid ${theme.colors.border}`,
                  borderRadius: theme.radii.md,
                  background: theme.colors.bg2,
                  cursor: dragging === group.id ? "grabbing" : "grab",
                  minWidth: 120,
                  userSelect: "none"
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.size.sm,
                    fontWeight: theme.typography.weight.medium,
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
                  {group.volume.toFixed(1)} dB
                </div>
                {group.effects && group.effects.length > 0 && (
                  <div
                    style={{
                      fontSize: theme.typography.size.xs,
                      color: theme.colors.accent || theme.colors.text1,
                      marginTop: theme.spacing.xs
                    }}
                  >
                    {group.effects.length} FX
                  </div>
                )}
              </div>
            );
          })}

          {/* Draw connection lines for sends */}
          {groupList.map((group) => {
            if (!group.sends || group.sends.length === 0) return null;

            const sourcePos = positions[group.id] || { x: 100, y: 50 };
            return group.sends.map((send, i) => {
              const targetGroup = groupList.find((g) => g.name === send.targetGroup);
              if (!targetGroup) return null;

              const targetPos = positions[targetGroup.id] || { x: 100, y: 50 };
              return (
                <svg
                  key={`${group.id}-${i}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 0
                  }}
                >
                  <line
                    x1={sourcePos.x + 60}
                    y1={sourcePos.y + 30}
                    x2={targetPos.x + 60}
                    y2={targetPos.y + 30}
                    stroke={theme.colors.accent || theme.colors.border}
                    strokeWidth={2}
                    strokeDasharray={send.level < 1 ? "5,5" : "0"}
                    opacity={send.level}
                  />
                </svg>
              );
            });
          })}
        </div>
      </Card>
    </div>
  );
}

