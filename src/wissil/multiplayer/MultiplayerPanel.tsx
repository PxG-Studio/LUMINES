/**
 * Multiplayer Debug Panel UI
 * StackBlitz/Bolt.new-style UI for multiplayer debugging and collaboration
 */

'use client';

import React, { useState, useEffect } from "react";
import { useTransport } from "./Transport";
import { useTimeline } from "./TimelineRecorder";
import { GhostCursorContainer } from "./GhostCursor";
import { Button } from "@/design-system/primitives/Button";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { SceneStateReplication } from "./SceneStateReplication";
import { EventSync } from "./EventSync";
import { InputSync } from "./InputSync";
import { BreakpointSync } from "./BreakpointSync";

export interface MultiplayerPanelProps {
  className?: string;
  style?: React.CSSProperties;
  websocketUrl?: string;
}

export function MultiplayerPanel({
  className,
  style,
  websocketUrl = "ws://localhost:8080"
}: MultiplayerPanelProps) {
  const theme = useTheme();
  const transport = useTransport();
  const timeline = useTimeline();
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);

  // Initialize all sync systems
  useEffect(() => {
    const cleanups = [
      SceneStateReplication.initialize(),
      EventSync.initialize(),
      InputSync.initialize(),
      BreakpointSync.initialize()
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  // Update connected peers list
  useEffect(() => {
    setConnectedPeers(Object.keys(transport.peers));
  }, [transport.peers]);

  const handleConnect = () => {
    transport.initWebSocket(websocketUrl);
  };

  const handleDisconnect = () => {
    transport.disconnect();
  };

  const handleStartRecording = () => {
    timeline.startRecording();
  };

  const handleStopRecording = () => {
    timeline.stopRecording();
  };

  const handleReplay = () => {
    timeline.startReplay();
  };

  const handleExport = () => {
    const json = timeline.exportTimeline();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wissil-timeline-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
      {/* Ghost Cursors */}
      <GhostCursorContainer />

      {/* Header */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.xl,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Multiplayer Debug Sync
        </h2>
        <p
          style={{
            margin: 0,
            color: theme.colors.text2,
            fontSize: theme.typography.size.sm,
            opacity: 0.8
          }}
        >
          Real-time collaborative debugging and shared Unity scene state
        </p>
      </div>

      {/* Connection Status */}
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
          <div>
            <strong style={{ color: theme.colors.text0 }}>Status:</strong>
            <span
              style={{
                marginLeft: theme.spacing.sm,
                color: transport.isConnected
                  ? theme.colors.success || "#4ade80"
                  : theme.colors.text2,
                fontSize: theme.typography.size.sm
              }}
            >
              {transport.isConnected ? "● Connected" : "○ Disconnected"}
            </span>
          </div>
          <div style={{ display: "flex", gap: theme.spacing.xs }}>
            {!transport.isConnected ? (
              <Button
                variant="accent"
                onClick={handleConnect}
                style={{
                  padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                  fontSize: theme.typography.size.sm
                }}
              >
                Connect
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleDisconnect}
                style={{
                  padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                  fontSize: theme.typography.size.sm
                }}
              >
                Disconnect
              </Button>
            )}
          </div>
        </div>
        <div style={{ fontSize: theme.typography.size.xs, color: theme.colors.text2 }}>
          Type: {transport.connectionType}
        </div>
      </div>

      {/* Connected Peers */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.md,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Connected Peers ({connectedPeers.length + 1})
        </h3>
        <div
          style={{
            fontSize: theme.typography.size.sm,
            color: theme.colors.text1,
            marginBottom: theme.spacing.xs
          }}
        >
          • {transport.localId} (You)
        </div>
        {connectedPeers.map((peerId) => (
          <div
            key={peerId}
            style={{
              fontSize: theme.typography.size.sm,
              color: theme.colors.text2,
              marginBottom: theme.spacing.xs
            }}
          >
            • {peerId}
          </div>
        ))}
        {connectedPeers.length === 0 && (
          <div
            style={{
              fontSize: theme.typography.size.xs,
              color: theme.colors.text2,
              opacity: 0.6,
              fontStyle: "italic"
            }}
          >
            No other peers connected
          </div>
        )}
      </div>

      {/* Timeline Controls */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.md,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Timeline Recorder
        </h3>
        <div
          style={{
            marginBottom: theme.spacing.md,
            fontSize: theme.typography.size.sm,
            color: theme.colors.text2
          }}
        >
          {timeline.frames.length} events recorded
          {timeline.isRecording && (
            <span style={{ color: theme.colors.error, marginLeft: theme.spacing.xs }}>
              ● Recording
            </span>
          )}
          {timeline.isReplaying && (
            <span style={{ color: theme.colors.accent, marginLeft: theme.spacing.xs }}>
              ▶ Replaying
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: theme.spacing.xs }}>
          {!timeline.isRecording ? (
            <Button
              variant="accent"
              onClick={handleStartRecording}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                fontSize: theme.typography.size.sm
              }}
            >
              Start Recording
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={handleStopRecording}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                fontSize: theme.typography.size.sm
              }}
            >
              Stop Recording
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={handleReplay}
            disabled={timeline.frames.length === 0 || timeline.isReplaying}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Replay Timeline
          </Button>
          <Button
            variant="ghost"
            onClick={handleExport}
            disabled={timeline.frames.length === 0}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Export Timeline
          </Button>
          <Button
            variant="ghost"
            onClick={() => timeline.clearFrames()}
            disabled={timeline.frames.length === 0}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Features List */}
      <div
        style={{
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.md,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Active Features
        </h3>
        <ul
          style={{
            margin: 0,
            paddingLeft: theme.spacing.lg,
            fontSize: theme.typography.size.sm,
            color: theme.colors.text2
          }}
        >
          <li>Real-time scene state sync</li>
          <li>Ghost cursors (Figma-style)</li>
          <li>Shared captures & scoring</li>
          <li>Breakpoint sync</li>
          <li>Timeline replay</li>
          <li>Input synchronization</li>
        </ul>
      </div>
    </div>
  );
}

