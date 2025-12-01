/**
 * BottomPanel Component
 * Collapsible multi-tab bottom panel (Console / Logs / Errors)
 */

'use client';

import React, { useState } from "react";
import { ConsolePanel } from "./ConsolePanel";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export type BottomPanelTab = "console" | "logs" | "errors";

export interface BottomPanelProps {
  initialTab?: BottomPanelTab;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onTabChange?: (tab: BottomPanelTab) => void;
}

export function BottomPanel({
  initialTab = "console",
  height,
  className,
  style,
  onTabChange
}: BottomPanelProps) {
  const theme = useTheme();
  const [tab, setTab] = useState<BottomPanelTab>(initialTab);

  const handleTabChange = (newTab: BottomPanelTab) => {
    setTab(newTab);
    onTabChange?.(newTab);
  };

  const tabs: BottomPanelTab[] = ["console", "logs", "errors"];
  const panelHeight = height !== undefined ? `${height}px` : "100%";

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        height: panelHeight,
        width: "100%",
        background: theme.colors.bg1,
        borderTop: `1px solid ${theme.colors.border}`,
        ...style
      }}
    >
      {/* TAB BAR */}
      <div
        style={{
          height: 34,
          display: "flex",
          alignItems: "center",
          borderBottom: `1px solid ${theme.colors.border}`,
          paddingLeft: theme.spacing.md,
          gap: theme.spacing.lg,
          background: theme.colors.bg2
        }}
      >
        {tabs.map((t) => {
          const isActive = tab === t;
          return (
            <div
              key={t}
              onClick={() => handleTabChange(t)}
              style={{
                padding: "6px 8px",
                cursor: "pointer",
                fontSize: theme.typography.size.sm,
                color: isActive ? theme.colors.text0 : theme.colors.text2,
                borderBottom: isActive ? `2px solid ${theme.colors.accent}` : "none",
                transition: "color 0.15s ease",
                textTransform: "uppercase",
                fontWeight: isActive ? theme.typography.weight.medium : theme.typography.weight.regular
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = theme.colors.text1;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = theme.colors.text2;
                }
              }}
            >
              {t}
            </div>
          );
        })}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {tab === "console" && <ConsolePanel />}
        {tab === "logs" && (
          <div
            style={{
              padding: theme.spacing.md,
              color: theme.colors.text2,
              fontSize: theme.typography.size.sm,
              height: "100%",
              overflowY: "auto"
            }}
          >
            <div style={{ opacity: 0.4 }}>
              Logs will appear here
            </div>
          </div>
        )}
        {tab === "errors" && (
          <div
            style={{
              padding: theme.spacing.md,
              color: theme.colors.error,
              fontSize: theme.typography.size.sm,
              height: "100%",
              overflowY: "auto"
            }}
          >
            <div style={{ opacity: 0.4 }}>
              Build/runtime errors will appear here
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

