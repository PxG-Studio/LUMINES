/**
 * FileTree State Management
 * Manages the file tree structure derived from the virtual filesystem
 */

import { useWissilFS } from "@/wissil/runtime/fs/wissilFs";
import { create } from "zustand";

export type TreeNode = {
  name: string;
  path: string;
  children?: TreeNode[];
};

type FileTreeState = {
  tree: TreeNode[];
  regenerateTree: () => void;
};

/**
 * Build tree structure from filesystem snapshot
 */
const buildTree = (): TreeNode[] => {
  const fs = useWissilFS.getState().getSnapshot();

  function walk(folder: any, path: string): TreeNode[] {
    return Object.keys(folder.children)
      .sort((a, b) => {
        // Sort: folders first, then files
        const aNode = folder.children[a];
        const bNode = folder.children[b];
        if (aNode.type === "folder" && bNode.type !== "folder") return -1;
        if (aNode.type !== "folder" && bNode.type === "folder") return 1;
        return a.localeCompare(b);
      })
      .map((key) => {
        const node = folder.children[key];
        const nodePath = path ? `${path}/${key}` : key;

        if (node.type === "folder") {
          return {
            name: key,
            path: nodePath,
            children: walk(node, nodePath)
          };
        } else {
          return {
            name: key,
            path: nodePath
          };
        }
      });
  }

  return walk(fs, "");
};

export const useFileTreeState = create<FileTreeState>((set) => ({
  tree: [],
  regenerateTree: () => set({ tree: buildTree() })
}));

/**
 * Export function to regenerate tree (called from Spark loader)
 */
export const regenerateTree = () => {
  useFileTreeState.getState().regenerateTree();
};

