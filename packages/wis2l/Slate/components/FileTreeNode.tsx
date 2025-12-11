/**
 * FileTreeNode Component
 * Recursive component for rendering file tree structure with selection
 */

'use client';

import React, { useState, useRef, useEffect } from "react";
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

  const nodeRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e as any);
    } else if (e.key === "ArrowRight" && isFolder && !open) {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === "ArrowLeft" && isFolder && open) {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      // Focus next sibling
      const nextSibling = nodeRef.current?.parentElement?.nextElementSibling?.querySelector('[role="treeitem"]') as HTMLElement;
      nextSibling?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      // Focus previous sibling
      const prevSibling = nodeRef.current?.parentElement?.previousElementSibling?.querySelector('[role="treeitem"]') as HTMLElement;
      prevSibling?.focus();
    }
  };

  return (
    <div>
      {/* NODE HEADER */}
      <div
        ref={nodeRef}
        role="treeitem"
        aria-expanded={isFolder ? open : undefined}
        aria-selected={isSelected}
        aria-label={isFolder ? `Folder ${name}` : `File ${name}`}
        tabIndex={isSelected ? 0 : -1}
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: level * 12,
          paddingRight: theme.spacing.xs,
          cursor: "pointer",
          userSelect: "none",
          minHeight: 28,
          paddingTop: 4,
          paddingBottom: 4,
          background: isSelected
            ? `${theme.colors.accent}20`
            : isFocused && !isSelected
            ? theme.colors.bg2
            : "transparent",
          borderRadius: theme.radii.sm,
          color: isSelected ? theme.colors.text0 : theme.colors.text1,
          fontSize: theme.typography.size.sm,
          transition: "all 0.15s ease",
          outline: "none",
          border: isFocused ? `1px solid ${theme.colors.accent}40` : "1px solid transparent"
        }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          setIsFocused(true);
          e.currentTarget.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={(e) => {
          if (!isSelected && !isFocused) {
            e.currentTarget.style.background = theme.colors.bg2;
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected && !isFocused) {
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
        <div role="group">
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
