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
        role="tablist"
        aria-label="Output panel tabs"
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
        {tabs.map((t, index) => {
          const isActive = tab === t;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              id={`${t}-tab`}
              aria-selected={isActive}
              aria-controls={`${t}-panel`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabChange(t)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  const prevIndex = index > 0 ? index - 1 : tabs.length - 1;
                  handleTabChange(tabs[prevIndex]);
                } else if (e.key === "ArrowRight") {
                  e.preventDefault();
                  const nextIndex = index < tabs.length - 1 ? index + 1 : 0;
                  handleTabChange(tabs[nextIndex]);
                }
              }}
              style={{
                padding: "6px 8px",
                cursor: "pointer",
                fontSize: theme.typography.size.sm,
                color: isActive ? theme.colors.text0 : theme.colors.text2,
                borderBottom: isActive ? `2px solid ${theme.colors.accent}` : "none",
                transition: "color 0.15s ease",
                textTransform: "uppercase",
                fontWeight: isActive ? theme.typography.weight.medium : theme.typography.weight.regular,
                background: "transparent",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                outline: "none",
                fontFamily: theme.typography.font
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
              onFocus={(e) => {
                e.currentTarget.style.outline = `2px solid ${theme.colors.accent}`;
                e.currentTarget.style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                if (!isActive) {
                  e.currentTarget.style.outline = "none";
                }
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {tab === "console" && (
          <div role="tabpanel" id="console-panel" aria-labelledby="console-tab">
            <ConsolePanel />
          </div>
        )}
        {tab === "logs" && (
          <div
            role="tabpanel"
            id="logs-panel"
            aria-labelledby="logs-tab"
            style={{
              padding: theme.spacing.xl,
              height: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                fontSize: 32,
                marginBottom: theme.spacing.md,
                opacity: 0.3,
                color: theme.colors.text2
              }}
            >
              📋
            </div>
            <div
              style={{
                fontSize: theme.typography.size.md,
                color: theme.colors.text1,
                fontWeight: theme.typography.weight.medium,
                marginBottom: theme.spacing.xs
              }}
            >
              No logs yet
            </div>
            <div
              style={{
                fontSize: theme.typography.size.sm,
                color: theme.colors.text2,
                opacity: 0.8
              }}
            >
              Runtime logs will appear here when you run a program
            </div>
          </div>
        )}
        {tab === "errors" && (
          <div
            role="tabpanel"
            id="errors-panel"
            aria-labelledby="errors-tab"
            style={{
              padding: theme.spacing.xl,
              height: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                fontSize: 32,
                marginBottom: theme.spacing.md,
                opacity: 0.3,
                color: theme.colors.error
              }}
            >
              ⚠️
            </div>
            <div
              style={{
                fontSize: theme.typography.size.md,
                color: theme.colors.error,
                fontWeight: theme.typography.weight.medium,
                marginBottom: theme.spacing.xs
              }}
            >
              No errors
            </div>
            <div
              style={{
                fontSize: theme.typography.size.sm,
                color: theme.colors.text2,
                opacity: 0.8
              }}
            >
              Build and runtime errors will appear here
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

