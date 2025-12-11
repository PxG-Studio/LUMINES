/**
 * Sequence Editor
 * Stack and chain animation clips
 */

'use client';

import React, { useState } from "react";
import { useAnimationStore } from "./AnimationStore";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Button } from "@/design-system/primitives/Button";

export interface SequenceEditorProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SequenceEditor({
  className,
  style
}: SequenceEditorProps) {
  const theme = useTheme();
  const clips = useAnimationStore((state) => state.clips);
  const [sequence, setSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddClip = (clipName: string) => {
    setSequence([...sequence, clipName]);
  };

  const handleRemoveClip = (index: number) => {
    setSequence(sequence.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSequence = [...sequence];
    [newSequence[index - 1], newSequence[index]] = [
      newSequence[index],
      newSequence[index - 1]
    ];
    setSequence(newSequence);
  };

  const handleMoveDown = (index: number) => {
    if (index === sequence.length - 1) return;
    const newSequence = [...sequence];
    [newSequence[index], newSequence[index + 1]] = [
      newSequence[index + 1],
      newSequence[index]
    ];
    setSequence(newSequence);
  };

  const handlePlaySequence = () => {
    if (sequence.length === 0) return;

    setIsPlaying(true);

    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("animation/sequence", {
        clips: sequence,
        loop: false
      });
    }

    // Reset playing state after sequence completes
    const totalDuration = sequence.reduce((sum, clipName) => {
      const clip = clips[clipName];
      return sum + (clip?.length || 0);
    }, 0);

    setTimeout(() => {
      setIsPlaying(false);
    }, totalDuration * 1000);
  };

  const handleStopSequence = () => {
    setIsPlaying(false);

    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("animation/stopSequence", {});
    }
  };

  const handleClearSequence = () => {
    setSequence([]);
    setIsPlaying(false);
  };

  return (
    <div
      className={className}
      style={{
        padding: theme.spacing.md,
        height: "100%",
        overflow: "auto",
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
          Animation Sequencer
        </h3>
        <div
          style={{
            fontSize: theme.typography.size.xs,
            color: theme.colors.text2,
            marginTop: theme.spacing.xs
          }}
        >
          Chain clips into sequences
        </div>
      </div>

      {/* Available Clips */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <div
          style={{
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginBottom: theme.spacing.sm
          }}
        >
          Available Clips
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: theme.spacing.xs
          }}
        >
          {Object.keys(clips).map((name) => (
            <Button
              key={name}
              variant="ghost"
              onClick={() => handleAddClip(name)}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                fontSize: theme.typography.size.sm
              }}
            >
              + {name}
            </Button>
          ))}
          {Object.keys(clips).length === 0 && (
            <div
              style={{
                fontSize: theme.typography.size.xs,
                color: theme.colors.text2,
                opacity: 0.6,
                fontStyle: "italic"
              }}
            >
              No clips available
            </div>
          )}
        </div>
      </div>

      {/* Sequence List */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: theme.spacing.sm
          }}
        >
          <div
            style={{
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0
            }}
          >
            Sequence ({sequence.length} clips)
          </div>
          {sequence.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleClearSequence}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                fontSize: theme.typography.size.xs
              }}
            >
              Clear
            </Button>
          )}
        </div>

        {sequence.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
            {sequence.map((clipName, index) => {
              const clip = clips[clipName];
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.xs,
                    padding: theme.spacing.sm,
                    background: theme.colors.bg2,
                    borderRadius: theme.radii.sm,
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  <div
                    style={{
                      fontSize: theme.typography.size.xs,
                      color: theme.colors.text2,
                      minWidth: 24
                    }}
                  >
                    {index + 1}.
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: theme.typography.size.sm,
                        color: theme.colors.text0
                      }}
                    >
                      {clipName}
                    </div>
                    {clip && (
                      <div
                        style={{
                          fontSize: theme.typography.size.xs,
                          color: theme.colors.text2
                        }}
                      >
                        {clip.length.toFixed(2)}s
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: theme.spacing.xs }}>
                    <Button
                      variant="ghost"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      style={{
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        fontSize: theme.typography.size.xs
                      }}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sequence.length - 1}
                      style={{
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        fontSize: theme.typography.size.xs
                      }}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleRemoveClip(index)}
                      style={{
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        fontSize: theme.typography.size.xs
                      }}
                      aria-label={`Remove clip ${clipName}`}
                    >
                      <span aria-hidden="true">✕</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: theme.spacing.md,
              textAlign: "center",
              color: theme.colors.text2,
              fontSize: theme.typography.size.sm,
              opacity: 0.6,
              fontStyle: "italic"
            }}
          >
            Sequence is empty. Add clips from above.
          </div>
        )}
      </div>

      {/* Sequence Controls */}
      <div style={{ display: "flex", gap: theme.spacing.sm }}>
        <Button
          variant="accent"
          onClick={handlePlaySequence}
          disabled={sequence.length === 0 || isPlaying}
          style={{
            flex: 1,
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            fontSize: theme.typography.size.sm
          }}
        >
          ▶ Play Sequence
        </Button>
        {isPlaying && (
          <Button
            variant="ghost"
            onClick={handleStopSequence}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              fontSize: theme.typography.size.sm
            }}
          >
            ⏹ Stop
          </Button>
        )}
      </div>
    </div>
  );
}

