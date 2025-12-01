/**
 * TabBar Component
 * Displays open file tabs with editor integration
 */

'use client';

import React from "react";
import { useEditorTabs } from "../editor/useEditorTabs";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface TabBarProps {
  className?: string;
  style?: React.CSSProperties;
}

export function TabBar({ className, style }: TabBarProps) {
  const theme = useTheme();
  const { openFiles, activeFile, setActive, close } = useEditorTabs();

  if (openFiles.length === 0) {
    return (
      <div
        className={className}
        style={{
          height: 40,
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.bg1,
          ...style
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        height: 40,
        display: "flex",
        alignItems: "center",
        background: theme.colors.bg1,
        borderBottom: `1px solid ${theme.colors.border}`,
        paddingLeft: theme.spacing.sm,
        gap: theme.spacing.xs,
        overflowX: "auto",
        ...style
      }}
    >
      {openFiles.map((file) => {
        const isActive = file === activeFile;
        const fileName = file.split("/").pop() || file;
        
        return (
          <div
            key={file}
            onClick={() => setActive(file)}
            style={{
              padding: "6px 10px",
              borderRadius: theme.radii.sm,
              border: `1px solid ${theme.colors.border}`,
              background: isActive ? theme.colors.bg2 : theme.colors.bg1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.xs,
              fontSize: theme.typography.size.sm,
              color: isActive ? theme.colors.text0 : theme.colors.text1,
              whiteSpace: "nowrap",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = theme.colors.bg2;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = theme.colors.bg1;
              }
            }}
          >
            <span>{fileName}</span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                close(file);
              }}
              style={{
                cursor: "pointer",
                opacity: 0.6,
                fontSize: "14px",
                lineHeight: 1,
                padding: "2px 4px",
                borderRadius: theme.radii.sm,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.background = theme.colors.error;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.6";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "";
              }}
            >
              ✕
            </span>
          </div>
        );
      })}
    </div>
  );
}

