/**
 * Hot Reload Panel
 * Bolt.new-style UI for monitoring hot reload activity
 * Shows live override notifications, config updates, prefab updates, etc.
 */

'use client';

import React, { useState } from "react";
import { useUnityEvents } from "../unityBridge/RuntimeEvents";
import { BehaviorOverride } from "./BehaviorOverride";
import { ShadowVM } from "./ShadowVM";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Button } from "@/design-system/primitives/Button";

export interface HotReloadPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function HotReloadPanel({ className, style }: HotReloadPanelProps) {
  const theme = useTheme();
  const { events } = useUnityEvents();
  const [showOverrides, setShowOverrides] = useState(false);
  const [shadowVMEnabled, setShadowVMEnabled] = useState(ShadowVM.isEnabled);

  // Filter hot reload related events
  const hotReloadEvents = events.filter((e) =>
    e.type === "event" &&
    (e.data?.type === "assetDiff" ||
      e.data?.type === "configUpdate" ||
      e.data?.type === "registerOverride" ||
      e.data?.type === "patchSO" ||
      e.data?.type === "shadowVMEnabled")
  );

  const recentEvents = hotReloadEvents.slice(-30).reverse(); // Last 30 events

  const registeredOverrides = BehaviorOverride.list();

  const handleToggleShadowVM = () => {
    const newEnabled = !shadowVMEnabled;
    setShadowVMEnabled(newEnabled);
    ShadowVM.setEnabled(newEnabled);
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
          Hot Reload Activity
        </h2>
        <p
          style={{
            margin: 0,
            color: theme.colors.text2,
            fontSize: theme.typography.size.sm,
            opacity: 0.8
          }}
        >
          Monitor live script overrides, config updates, and behavior changes
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.sm
        }}
      >
        <div
          style={{
            padding: theme.spacing.md,
            background: theme.colors.bg1,
            borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <div style={{ marginBottom: theme.spacing.xs }}>
            <strong style={{ color: theme.colors.text0 }}>Shadow VM:</strong>
          </div>
          <Button
            variant={shadowVMEnabled ? "accent" : "ghost"}
            onClick={handleToggleShadowVM}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              fontSize: theme.typography.size.sm
            }}
          >
            {shadowVMEnabled ? "● Enabled" : "○ Disabled"}
          </Button>
        </div>

        {registeredOverrides.length > 0 && (
          <div
            style={{
              padding: theme.spacing.md,
              background: theme.colors.bg1,
              borderRadius: theme.radii.md,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing.xs,
                cursor: "pointer"
              }}
              onClick={() => setShowOverrides(!showOverrides)}
            >
              <div>
                <strong style={{ color: theme.colors.text0 }}>Method Overrides:</strong>
                <span
                  style={{
                    marginLeft: theme.spacing.xs,
                    color: theme.colors.text2,
                    fontSize: theme.typography.size.sm
                  }}
                >
                  {registeredOverrides.length}
                </span>
              </div>
              <span style={{ color: theme.colors.text2, fontSize: theme.typography.size.sm }}>
                {showOverrides ? "▼" : "▶"}
              </span>
            </div>
            {showOverrides && (
              <div style={{ marginTop: theme.spacing.sm }}>
                {registeredOverrides.map((method) => (
                  <code
                    key={method}
                    style={{
                      display: "block",
                      padding: theme.spacing.xs,
                      marginBottom: theme.spacing.xs,
                      background: theme.colors.bg2,
                      borderRadius: theme.radii.sm,
                      fontSize: theme.typography.size.xs,
                      color: theme.colors.accent,
                      fontFamily: "monospace"
                    }}
                  >
                    {method}()
                  </code>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Events */}
      <div>
        <div
          style={{
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.sm,
            color: theme.colors.text2,
            opacity: 0.7
          }}
        >
          Recent Activity ({recentEvents.length})
        </div>

        {recentEvents.length === 0 ? (
          <div
            style={{
              padding: theme.spacing.xl,
              textAlign: "center",
              color: theme.colors.text2,
              opacity: 0.6,
              fontSize: theme.typography.size.sm
            }}
          >
            No hot reload activity yet. Override methods or update configs to see activity here.
          </div>
        ) : (
          recentEvents.map((event, i) => {
            const data = event.data || {};
            const eventType = data.type || "unknown";
            const path = data.path || "";
            const methodName = data.methodName || "";

            const getEventIcon = (type: string) => {
              switch (type) {
                case "configUpdate":
                  return "⚙️";
                case "registerOverride":
                  return "🔧";
                case "patchSO":
                  return "📦";
                case "assetDiff":
                  return "📝";
                case "shadowVMEnabled":
                  return "🎮";
                default:
                  return "•";
              }
            };

            const getEventColor = (type: string) => {
              switch (type) {
                case "configUpdate":
                  return theme.colors.accent;
                case "registerOverride":
                  return theme.colors.success || "#4ade80";
                case "patchSO":
                  return theme.colors.warning || "#fbbf24";
                case "assetDiff":
                  return theme.colors.text1;
                default:
                  return theme.colors.text2;
              }
            };

            return (
              <div
                key={event.id || i}
                style={{
                  padding: theme.spacing.sm,
                  marginBottom: theme.spacing.xs,
                  background: theme.colors.bg1,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radii.sm,
                  fontSize: theme.typography.size.sm
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.xs }}>
                  <span style={{ fontSize: "14px" }}>{getEventIcon(eventType)}</span>
                  <span
                    style={{
                      color: getEventColor(eventType),
                      fontWeight: theme.typography.weight.medium
                    }}
                  >
                    {eventType}
                  </span>
                </div>
                {(path || methodName) && (
                  <code
                    style={{
                      display: "block",
                      marginTop: theme.spacing.xs,
                      paddingLeft: theme.spacing.md,
                      color: theme.colors.text1,
                      fontFamily: "monospace",
                      fontSize: theme.typography.size.xs,
                      wordBreak: "break-all"
                    }}
                  >
                    {path || methodName}
                  </code>
                )}
                {data.error && (
                  <div
                    style={{
                      marginTop: theme.spacing.xs,
                      paddingLeft: theme.spacing.md,
                      color: theme.colors.error,
                      fontSize: theme.typography.size.xs
                    }}
                  >
                    Error: {data.error}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

