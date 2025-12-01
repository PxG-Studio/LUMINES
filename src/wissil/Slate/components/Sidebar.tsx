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
    <div
      style={{
        width: 52,
        background: theme.colors.bg1,
        borderRight: `1px solid ${theme.colors.border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 16,
        gap: 20
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => setActiveId(item.id)}
          title={item.title}
          style={{
            padding: 10,
            cursor: "pointer",
            color: activeId === item.id ? theme.colors.accent : theme.colors.text1,
            background: activeId === item.id ? `${theme.colors.accent}20` : "transparent",
            borderRadius: theme.radii.sm,
            transition: "all 0.15s ease"
          }}
          onMouseEnter={(e) => {
            if (activeId !== item.id) {
              e.currentTarget.style.color = theme.colors.text0;
            }
          }}
          onMouseLeave={(e) => {
            if (activeId !== item.id) {
              e.currentTarget.style.color = theme.colors.text1;
            }
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}

