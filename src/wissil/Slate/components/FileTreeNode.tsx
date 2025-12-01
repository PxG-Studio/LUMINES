/**
 * FileTreeNode Component
 * Recursive component for rendering file tree structure with selection
 */

'use client';

import React, { useState } from "react";
import { ChevronRight } from "@/design-system/icons/ChevronRight";
import { FolderIcon } from "@/design-system/icons/Folder";
import { FileIcon } from "@/design-system/icons/File";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { useEditorState } from "@/state/editorState";
import { openFile } from "../editor/openFile";

export interface FileTreeNodeProps {
  name: string;
  value: any;
  level: number;
  parentPath?: string;
  onFileClick?: (path: string) => void;
}

export function FileTreeNode({
  name,
  value,
  level,
  parentPath = "",
  onFileClick
}: FileTreeNodeProps) {
  const theme = useTheme();
  const isFolder = typeof value === "object" && value !== null && !Array.isArray(value);
  const [open, setOpen] = useState(level === 0);

  const fullPath = parentPath === "" ? name : `${parentPath}/${name}`;

  const selectedFile = useEditorState((s) => s.selectedFile);
  const setSelectedFile = useEditorState((s) => s.setSelectedFile);

  const isSelected = selectedFile === fullPath;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isFolder) {
      setOpen(!open);
    } else {
      // Open file in editor (adds to tabs, sets as active, updates selection)
      openFile(fullPath);
      onFileClick?.(fullPath);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Right-click on:", fullPath);
    // Placeholder for context menu
    alert(`Context menu placeholder for: ${fullPath}`);
  };

  return (
    <div>
      {/* NODE HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: level * 12,
          cursor: "pointer",
          userSelect: "none",
          height: 24,
          background: isSelected
            ? `${theme.colors.accent}25`
            : "transparent",
          borderRadius: theme.radii.sm,
          color: theme.colors.text1,
          fontSize: theme.typography.size.sm,
          transition: "background 0.1s ease"
        }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.background = theme.colors.bg2;
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        {isFolder ? (
          <ChevronRight
            size={16}
            style={{
              marginRight: 4,
              transform: open ? "rotate(90deg)" : "rotate(0)",
              transition: "transform 0.1s",
              color: theme.colors.text2
            }}
          />
        ) : (
          <span style={{ width: 16, display: "inline-block" }} />
        )}

        {isFolder ? (
          <FolderIcon size={16} style={{ marginRight: 6, color: theme.colors.accent }} />
        ) : (
          <FileIcon size={16} style={{ marginRight: 6, color: theme.colors.text2 }} />
        )}

        <span>{name}</span>
      </div>

      {/* CHILDREN */}
      {isFolder && open && (
        <div>
          {Object.entries(value).map(([child, val]) => (
            <FileTreeNode
              key={child}
              name={child}
              value={val}
              level={level + 1}
              parentPath={fullPath}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
