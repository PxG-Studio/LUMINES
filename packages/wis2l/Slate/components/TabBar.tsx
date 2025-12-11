/**
 * TabBar Component
 * Displays open file tabs with editor integration
 */

'use client';

import React, { useRef, useEffect } from "react";
import { useEditorTabs } from "../editor/useEditorTabs";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface TabBarProps {
  className?: string;
  style?: React.CSSProperties;
}

export function TabBar({ className, style }: TabBarProps) {
  const theme = useTheme();
  const { openFiles, activeFile, setActive, close } = useEditorTabs();
  const tabListRef = useRef<HTMLDivElement>(null);
  const activeTabIndex = openFiles.findIndex(f => f === activeFile);

  const handleKeyDown = (e: React.KeyboardEvent, file: string, index: number) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = index > 0 ? index - 1 : openFiles.length - 1;
      setActive(openFiles[prevIndex]);
      const prevTab = tabListRef.current?.children[prevIndex] as HTMLElement;
      prevTab?.focus();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = index < openFiles.length - 1 ? index + 1 : 0;
      setActive(openFiles[nextIndex]);
      const nextTab = tabListRef.current?.children[nextIndex] as HTMLElement;
      nextTab?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(openFiles[0]);
      const firstTab = tabListRef.current?.children[0] as HTMLElement;
      firstTab?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const lastIndex = openFiles.length - 1;
      setActive(openFiles[lastIndex]);
      const lastTab = tabListRef.current?.children[lastIndex] as HTMLElement;
      lastTab?.focus();
    } else if (e.key === "w" && e.ctrlKey) {
      e.preventDefault();
      close(file);
    }
  };

  if (openFiles.length === 0) {
    return (
      <div
        className={className}
        role="tablist"
        aria-label="Open files"
        style={{
          height: 40,
          display: "flex",
          alignItems: "center",
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.bg1,
          paddingLeft: theme.spacing.sm,
          ...style
        }}
      >
        <button
          type="button"
          role="tab"
          aria-selected="false"
          aria-disabled="true"
          tabIndex={-1}
          style={{
            fontSize: theme.typography.size.sm,
            color: theme.colors.text2,
            cursor: "default",
            background: "transparent",
            border: "none",
            padding: 0
          }}
        >
          No files open
        </button>
      </div>
    );
  }

  return (
    <div
      ref={tabListRef}
      className={className}
      role="tablist"
      aria-label="Open files"
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
      {openFiles.map((file, index) => {
        const isActive = file === activeFile;
        const fileName = file.split("/").pop() || file;
        
        return (
          <button
            key={file}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="editor-panel"
            tabIndex={isActive ? 0 : -1}
            onClick={() => setActive(file)}
            onKeyDown={(e) => handleKeyDown(e, file, index)}
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
              transition: "all 0.15s ease",
              outline: "none",
              fontFamily: theme.typography.font
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
            <span>{fileName}</span>
            <button
              type="button"
              aria-label={`Close ${fileName}`}
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
                justifyContent: "center",
                border: "none",
                background: "transparent",
                color: "inherit",
                outline: "none"
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
              onFocus={(e) => {
                e.currentTarget.style.outline = `2px solid ${theme.colors.error}`;
                e.currentTarget.style.outlineOffset = "1px";
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = "none";
              }}
            >
              <span aria-hidden="true">✕</span>
            </button>
          </button>
        );
      })}
    </div>
  );
}

