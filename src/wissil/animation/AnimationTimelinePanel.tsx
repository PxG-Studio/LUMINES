/**
 * Animation Timeline Panel
 * Complete animation timeline editor
 * Combines scrubber, keyframes, events, and sequences
 */

'use client';

import React, { useState } from "react";
import { TimelineScrubber } from "./TimelineScrubber";
import { KeyframeInspector } from "./KeyframeInspector";
import { EventMarkerPanel } from "./EventMarkerPanel";
import { SequenceEditor } from "./SequenceEditor";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { SplitView } from "@/design-system/primitives/SplitView";

export interface AnimationTimelinePanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function AnimationTimelinePanel({
  className,
  style
}: AnimationTimelinePanelProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<"timeline" | "keyframes" | "events" | "sequence">("timeline");

  return (
    <div
      className={className}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: theme.colors.bg0,
        ...style
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.bg1
        }}
      >
        {(["timeline", "keyframes", "events", "sequence"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              background: activeTab === tab ? theme.colors.bg0 : "transparent",
              border: "none",
              borderBottom:
                activeTab === tab
                  ? `2px solid ${theme.colors.accent || theme.colors.text0}`
                  : "2px solid transparent",
              color: activeTab === tab ? theme.colors.text0 : theme.colors.text2,
              fontSize: theme.typography.size.sm,
              fontWeight: activeTab === tab ? theme.typography.weight.semibold : theme.typography.weight.regular,
              cursor: "pointer",
              textTransform: "capitalize"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTab === "timeline" && (
          <SplitView direction="horizontal" initial={300}>
            <div style={{ height: "100%", overflow: "auto" }}>
              <TimelineScrubber />
            </div>
            <div style={{ height: "100%", overflow: "auto" }}>
              <KeyframeInspector />
            </div>
          </SplitView>
        )}

        {activeTab === "keyframes" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <KeyframeInspector />
          </div>
        )}

        {activeTab === "events" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <EventMarkerPanel />
          </div>
        )}

        {activeTab === "sequence" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <SequenceEditor />
          </div>
        )}
      </div>
    </div>
  );
}

