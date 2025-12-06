/**
 * Event Marker System
 * Timeline events for sound triggers, VFX, gameplay events
 */

'use client';

import React, { useState } from "react";
import { useAnimationStore, AnimationEvent } from "./AnimationStore";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Button } from "@/design-system/primitives/Button";
import { TimelineScrubber } from "./TimelineScrubber";

export interface EventMarkerPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function EventMarkerPanel({
  className,
  style
}: EventMarkerPanelProps) {
  const theme = useTheme();
  const selectedClip = useAnimationStore((state) => state.selectedClip);
  const clips = useAnimationStore((state) => state.clips);
  const events = useAnimationStore((state) =>
    selectedClip ? state.events[selectedClip] || [] : []
  );
  const addEvent = useAnimationStore((state) => state.addEvent);
  const currentTime = useAnimationStore((state) => state.currentTime);

  const [newEventTime, setNewEventTime] = useState<string>("");
  const [newEventName, setNewEventName] = useState<string>("");

  const clip = selectedClip ? clips[selectedClip] : null;

  const handleAddEvent = () => {
    if (!selectedClip || !newEventName || !newEventTime) return;

    const time = parseFloat(newEventTime);
    if (isNaN(time) || time < 0 || (clip && time > clip.length)) {
      alert("Invalid time");
      return;
    }

    const event: AnimationEvent = {
      time,
      functionName: newEventName
    };

    addEvent(selectedClip, event);

    // Send to Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("animation/addEvent", {
        clip: selectedClip,
        event: {
          time,
          functionName: newEventName
        }
      });
    }

    // Reset form
    setNewEventTime("");
    setNewEventName("");
  };

  const handleAddEventAtCurrentTime = () => {
    if (!selectedClip) return;
    setNewEventTime(currentTime.toFixed(3));
  };

  const handleRemoveEvent = (index: number) => {
    if (!selectedClip) return;

    const updatedEvents = events.filter((_, i) => i !== index);
    // Note: We'd need a removeEvent action in the store for full implementation
    // For now, this is a placeholder
  };

  const handlePlayFromEvent = (event: AnimationEvent) => {
    if (!selectedClip) return;

    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("animation/scrub", {
        clip: selectedClip,
        time: event.time / (clip?.length || 1)
      });
    }
  };

  if (!selectedClip) {
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
        Select an animation clip to add events
      </div>
    );
  }

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
          Event Markers ({events.length})
        </h3>
        <div
          style={{
            fontSize: theme.typography.size.xs,
            color: theme.colors.text2,
            marginTop: theme.spacing.xs
          }}
        >
          {selectedClip}
        </div>
      </div>

      {/* Add Event Form */}
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
          Add Event
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.sm
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.size.xs,
                color: theme.colors.text1,
                marginBottom: theme.spacing.xs
              }}
            >
              Function Name
            </label>
            <input
              type="text"
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
              placeholder="e.g., VFX_Trigger, PlaySound, OnCardFlip"
              style={{
                width: "100%",
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                background: theme.colors.bg2,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii.sm,
                color: theme.colors.text0,
                fontSize: theme.typography.size.sm
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.size.xs,
                color: theme.colors.text1,
                marginBottom: theme.spacing.xs
              }}
            >
              Time (seconds)
            </label>
            <div style={{ display: "flex", gap: theme.spacing.xs }}>
              <input
                type="number"
                min="0"
                max={clip?.length || 10}
                step="0.1"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                placeholder="0.0"
                style={{
                  flex: 1,
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  background: theme.colors.bg2,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radii.sm,
                  color: theme.colors.text0,
                  fontSize: theme.typography.size.sm,
                  fontFamily: "monospace"
                }}
              />
              <Button
                variant="ghost"
                onClick={handleAddEventAtCurrentTime}
                style={{
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  fontSize: theme.typography.size.xs
                }}
              >
                Current ({currentTime.toFixed(2)}s)
              </Button>
            </div>
          </div>
          <Button
            variant="accent"
            onClick={handleAddEvent}
            disabled={!newEventName || !newEventTime}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Add Event
          </Button>
        </div>
      </div>

      {/* Event List */}
      {events.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
          {events
            .sort((a, b) => a.time - b.time)
            .map((event, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                  padding: theme.spacing.sm,
                  background: theme.colors.bg1,
                  borderRadius: theme.radii.sm,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.size.xs,
                    color: theme.colors.accent || theme.colors.text0,
                    fontFamily: "monospace",
                    minWidth: 60
                  }}
                >
                  {event.time.toFixed(2)}s
                </div>
                <div
                  style={{
                    flex: 1,
                    fontSize: theme.typography.size.sm,
                    color: theme.colors.text0
                  }}
                >
                  {event.functionName}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handlePlayFromEvent(event)}
                  style={{
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    fontSize: theme.typography.size.xs
                  }}
                >
                  ▶
                </Button>
              </div>
            ))}
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
          No events. Add events using the form above.
        </div>
      )}
    </div>
  );
}

