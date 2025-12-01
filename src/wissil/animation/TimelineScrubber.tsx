/**
 * Timeline Scrubber
 * UI for scrubbing animations, playback controls
 */

'use client';

import React, { useState, useEffect } from "react";
import { useAnimationStore } from "./AnimationStore";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Button } from "@/design-system/primitives/Button";

export interface TimelineScrubberProps {
  className?: string;
  style?: React.CSSProperties;
}

export function TimelineScrubber({
  className,
  style
}: TimelineScrubberProps) {
  const theme = useTheme();
  const clips = useAnimationStore((state) => state.clips);
  const selectedClip = useAnimationStore((state) => state.selectedClip);
  const isPlaying = useAnimationStore((state) => state.isPlaying);
  const currentTime = useAnimationStore((state) => state.currentTime);
  const playbackSpeed = useAnimationStore((state) => state.playbackSpeed);
  const setPlaying = useAnimationStore((state) => state.setPlaying);
  const setCurrentTime = useAnimationStore((state) => state.setCurrentTime);
  const setPlaybackSpeed = useAnimationStore((state) => state.setPlaybackSpeed);
  const selectClip = useAnimationStore((state) => state.selectClip);
  const updateClip = useAnimationStore((state) => state.updateClip);

  const clip = selectedClip ? clips[selectedClip] : null;

  // Auto-select first clip if none selected
  useEffect(() => {
    if (!selectedClip && Object.keys(clips).length > 0) {
      selectClip(Object.keys(clips)[0]);
    }
  }, [clips, selectedClip, selectClip]);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!clip) return;

    const time = parseFloat(e.target.value);
    setCurrentTime(time);

    // Send scrub command to Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("animation/scrub", {
        clip: selectedClip,
        time: time / clip.length // Normalized time
      });
    }
  };

  const handlePlay = () => {
    if (!selectedClip) return;

    setPlaying(true);
    updateClip(selectedClip, { isPlaying: true });

    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("animation/play", {
        clip: selectedClip
      });
    }
  };

  const handlePause = () => {
    setPlaying(false);
    updateClip(selectedClip || "", { isPlaying: false });

    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("animation/pause", {});
    }
  };

  const handleStop = () => {
    setPlaying(false);
    setCurrentTime(0);

    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("animation/stop", {});
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);

    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("animation/setSpeed", { speed });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(2);
    return `${minutes}:${seconds.padStart(5, "0")}`;
  };

  if (!clip) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.md,
          color: theme.colors.text2,
          fontSize: theme.typography.size.sm,
          ...style
        }}
      >
        No animation clip selected
      </div>
    );
  }

  const step = clip.length / (clip.frameRate * clip.length) || 0.01;

  return (
    <div
      className={className}
      style={{
        padding: theme.spacing.md,
        background: theme.colors.bg0,
        ...style
      }}
    >
      {/* Clip Selector */}
      <div
        style={{
          marginBottom: theme.spacing.md,
          padding: theme.spacing.sm,
          background: theme.colors.bg1,
          borderRadius: theme.radii.sm,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <select
          value={selectedClip || ""}
          onChange={(e) => selectClip(e.target.value || null)}
          style={{
            width: "100%",
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            background: theme.colors.bg2,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.sm,
            color: theme.colors.text0,
            fontSize: theme.typography.size.sm
          }}
        >
          {Object.keys(clips).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: theme.spacing.md }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: theme.spacing.xs
          }}
        >
          <div
            style={{
              fontSize: theme.typography.size.sm,
              color: theme.colors.text1,
              fontFamily: "monospace"
            }}
          >
            {formatTime(currentTime)} / {formatTime(clip.length)}
          </div>
          <div
            style={{
              fontSize: theme.typography.size.xs,
              color: theme.colors.text2
            }}
        >
            {clip.frameRate} fps
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={clip.length}
          value={currentTime}
          step={step}
          onChange={handleScrub}
          style={{
            width: "100%",
            height: 8,
            background: theme.colors.bg2,
            borderRadius: theme.radii.sm,
            outline: "none",
            cursor: "pointer"
          }}
        />
      </div>

      {/* Playback Controls */}
      <div
        style={{
          display: "flex",
          gap: theme.spacing.xs,
          alignItems: "center",
          marginBottom: theme.spacing.md
        }}
      >
        <Button
          variant={isPlaying ? "accent" : "ghost"}
          onClick={isPlaying ? handlePause : handlePlay}
          style={{
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            fontSize: theme.typography.size.sm
          }}
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </Button>
        <Button
          variant="ghost"
          onClick={handleStop}
          style={{
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            fontSize: theme.typography.size.sm
          }}
        >
          ⏹ Stop
        </Button>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: theme.spacing.xs }}>
          <span
            style={{
              fontSize: theme.typography.size.xs,
              color: theme.colors.text2
            }}
          >
            Speed:
          </span>
          <input
            type="number"
            min="0.1"
            max="3"
            step="0.1"
            value={playbackSpeed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value) || 1)}
            style={{
              width: 60,
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              background: theme.colors.bg2,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii.sm,
              color: theme.colors.text0,
              fontSize: theme.typography.size.sm,
              fontFamily: "monospace"
            }}
          />
        </div>
      </div>
    </div>
  );
}

