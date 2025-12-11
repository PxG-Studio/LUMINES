/**
 * FileTree Component
 * Displays the project file structure from virtual filesystem
 */

'use client';

import React, { useEffect } from "react";
import { FileTreeNode } from "./FileTreeNode";
import { useFileTreeState, regenerateTree } from "./FileTreeState";
import { useWissilFS } from "@/wis2l/runtime/fs/wissilFs";
import { ScrollArea } from "@/design-system/layouts/ScrollArea";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { FolderIcon } from "@/design-system/icons/Folder";
import { useEditorState } from "@/state/editorState";

export interface FileTreeProps {
  onFileSelect?: (path: string) => void;
}

/**
 * Convert TreeNode structure to nested object for FileTreeNode
 */
function treeToNestedObject(nodes: any[]): any {
  const result: any = {};
  
  for (const node of nodes) {
    if (node.children) {
      result[node.name] = treeToNestedObject(node.children);
    } else {
      // For files, we need to store them differently
      // Since FileTreeNode expects a nested structure, we'll create a placeholder
      result[node.name] = ""; // Empty string indicates a file
    }
  }
  
  return result;
}

export function FileTree({ onFileSelect }: FileTreeProps) {
  const theme = useTheme();
  const fs = useWissilFS();
  const selectedFile = useEditorState((s) => s.selectedFile);
  
  // Announce file selection changes
  useEffect(() => {
    if (selectedFile) {
      const announcement = document.getElementById("sr-announcements");
      if (announcement) {
        const fileName = selectedFile.split("/").pop() || selectedFile;
        announcement.textContent = `Opened file ${fileName}`;
        setTimeout(() => {
          announcement.textContent = "";
        }, 1000);
      }
    }
  }, [selectedFile]);
  
  /**
   * Build nested object from filesystem for FileTreeNode compatibility
   */
  const buildNestedFromFS = React.useCallback((): any => {
    const fsSnapshot = fs.getSnapshot();
    
    function walk(node: any): any {
      const result: any = {};
      
      for (const [key, child] of Object.entries(node.children || {})) {
        const childNode = child as { type?: string; children?: any };
        if (childNode.type === "folder") {
          result[key] = walk(childNode);
        } else {
          result[key] = ""; // File marker - FileTreeNode expects empty string for files
        }
      }
      
      return result;
    }
    
    return walk(fsSnapshot);
  }, [fs]);
  
  // Regenerate tree when filesystem changes
  useEffect(() => {
    regenerateTree();
  }, [fs.root]);

  // Convert tree structure to nested object for FileTreeNode
  const nestedFs = buildNestedFromFS();

  // Show placeholder if no files
  if (Object.keys(nestedFs).length === 0) {
    return (
      <ScrollArea
        style={{
          height: "100%",
          padding: theme.spacing.md
        }}
      >
        <div
          role="status"
          aria-live="polite"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            padding: theme.spacing.xl,
            textAlign: "center"
          }}
        >
          <FolderIcon 
            size={48} 
            style={{ 
              color: theme.colors.text2, 
              opacity: 0.4,
              marginBottom: theme.spacing.md
            }} 
          />
          <div
            style={{
              fontSize: theme.typography.size.md,
              color: theme.colors.text1,
              fontWeight: theme.typography.weight.medium,
              marginBottom: theme.spacing.xs
            }}
          >
            No files yet
          </div>
          <div
            style={{
              fontSize: theme.typography.size.sm,
              color: theme.colors.text1,
              maxWidth: "300px"
            }}
          >
            Select a template or create a new file to begin
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea
      style={{
        height: "100%",
        padding: theme.spacing.sm
      }}
    >
      <div 
        role="tree" 
        aria-label="File Explorer"
        style={{ fontSize: theme.typography.size.sm, color: theme.colors.text1 }}
      >
        <FileTreeNode name="root" value={nestedFs} level={0} onFileClick={onFileSelect} />
      </div>
    </ScrollArea>
  );
}

