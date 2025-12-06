/**
 * Sidebar Component
 * Clean, Bolt.new-style sidebar with icons
 */

'use client';

import React, { useState } from "react";
import { FolderIcon } from "@/design-system/icons/Folder";
import { FileIcon } from "@/design-system/icons/File";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export function Sidebar() {
  const theme = useTheme();
  const [activeId, setActiveId] = useState<string | null>("explorer");

  const items = [
    { id: "explorer", icon: <FolderIcon size={20} />, title: "Explorer" },
    { id: "files", icon: <FileIcon size={20} />, title: "Files" }
  ];

  return (
    <nav
      aria-label="Primary navigation"
      style={{
        width: 52,
        background: theme.colors.bg1,
        borderRight: `1px solid ${theme.colors.border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 16,
        gap: 12
      }}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            aria-label={item.title}
            aria-pressed={isActive}
            title={item.title}
            style={{
              padding: 10,
              cursor: "pointer",
              color: isActive ? theme.colors.accent : theme.colors.text1,
              background: isActive ? `${theme.colors.accent}20` : "transparent",
              borderRadius: theme.radii.sm,
              transition: "all 0.15s ease",
              border: "none",
              outline: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = theme.colors.text0;
                e.currentTarget.style.background = theme.colors.bg2;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = theme.colors.text1;
                e.currentTarget.style.background = "transparent";
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = `2px solid ${theme.colors.accent}`;
              e.currentTarget.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            {item.icon}
          </button>
        );
      })}
    </nav>
  );
}

