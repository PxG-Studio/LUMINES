/**
 * FileTree Component
 * Displays the project file structure from virtual filesystem
 */

'use client';

import React, { useEffect } from "react";
import { FileTreeNode } from "./FileTreeNode";
import { useFileTreeState, regenerateTree } from "./FileTreeState";
import { useWissilFS } from "@/wissil/runtime/fs/wissilFs";
import { ScrollArea } from "@/design-system/layouts/ScrollArea";
import { useTheme } from "@/design-system/themes/ThemeProvider";

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
  
  /**
   * Build nested object from filesystem for FileTreeNode compatibility
   */
  const buildNestedFromFS = React.useCallback((): any => {
    const fsSnapshot = fs.getSnapshot();
    
    function walk(node: any): any {
      const result: any = {};
      
      for (const [key, child] of Object.entries(node.children || {})) {
        if (child.type === "folder") {
          result[key] = walk(child);
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
          padding: theme.spacing.sm
        }}
      >
        <div
          style={{
            fontSize: theme.typography.size.sm,
            color: theme.colors.text2,
            opacity: 0.6,
            padding: theme.spacing.md,
            textAlign: "center"
          }}
        >
          No files. Select a template to begin.
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
      <div style={{ fontSize: theme.typography.size.sm, color: theme.colors.text1 }}>
        <FileTreeNode name="root" value={nestedFs} level={0} onFileClick={onFileSelect} />
      </div>
    </ScrollArea>
  );
}

