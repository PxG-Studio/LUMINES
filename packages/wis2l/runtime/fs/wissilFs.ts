// @ts-nocheck
/**
 * WISSIL Virtual Filesystem
 * Complete in-memory filesystem with CRUD operations
 * Sandpack-style file operations for safe, isolated execution
 */

import { FSFolder, FSFile, FSNode } from "./fsTypes";
import { splitPath } from "./pathUtils";
import { create } from "zustand";

type FSState = {
  root: FSFolder;

  // File operations
  writeFile: (path: string, content: string) => void;
  readFile: (path: string) => string | null;
  deleteFile: (path: string) => void;
  exists: (path: string) => boolean;

  // Folder operations
  createFolder: (path: string) => void;
  deleteFolder: (path: string) => void;
  listDirectory: (path: string) => string[];

  // Utility operations
  getSnapshot: () => FSFolder;
  hydrate: (tree: FSFolder) => void;
  clear: () => void;
};

/**
 * Ensure a folder path exists, creating folders as needed
 */
function ensureFolder(folder: FSFolder, parts: string[]): FSFolder {
  if (parts.length === 0) return folder;

  const [head, ...rest] = parts;

  if (!folder.children[head]) {
    folder.children[head] = {
      type: "folder",
      children: {}
    };
  }

  const next = folder.children[head];
  if (next.type !== "folder") {
    throw new Error(`Cannot create folder: ${head} already exists as a file`);
  }

  return ensureFolder(next, rest);
}

/**
 * Navigate to a folder at the given path
 */
function navigateToFolder(root: FSFolder, parts: string[]): FSFolder | null {
  let current: FSNode = root;

  for (const part of parts) {
    if (current.type !== "folder") return null;
    const next = current.children[part];
    if (!next || next.type !== "folder") return null;
    current = next;
  }

  return current.type === "folder" ? current : null;
}

export const useWissilFS = create<FSState>((set, get) => ({
  root: {
    type: "folder",
    children: {}
  },

  writeFile: (path, content) => {
    const parts = splitPath(path);
    if (parts.length === 0) {
      throw new Error("Cannot write to root path");
    }

    const fileName = parts.pop()!;
    const folder = ensureFolder(get().root, parts);

    folder.children[fileName] = {
      type: "file",
      content
    };

    // Trigger update
    set({ root: { ...get().root } });
  },

  readFile: (path) => {
    const parts = splitPath(path);
    if (parts.length === 0) return null;

    const fileName = parts.pop()!;
    const folder = navigateToFolder(get().root, parts);

    if (!folder) return null;

    const node = folder.children[fileName];
    if (!node || node.type !== "file") return null;

    return node.content;
  },

  deleteFile: (path) => {
    const parts = splitPath(path);
    if (parts.length === 0) return;

    const fileName = parts.pop()!;
    const folder = navigateToFolder(get().root, parts);

    if (!folder) return;

    delete folder.children[fileName];
    set({ root: { ...get().root } });
  },

  exists: (path) => {
    const parts = splitPath(path);
    if (parts.length === 0) return true; // Root exists

    const fileName = parts.pop()!;
    const folder = navigateToFolder(get().root, parts);

    if (!folder) return false;

    return fileName in folder.children;
  },

  createFolder: (path) => {
    const parts = splitPath(path);
    if (parts.length === 0) return; // Root already exists

    ensureFolder(get().root, parts);
    set({ root: { ...get().root } });
  },

  deleteFolder: (path) => {
    const parts = splitPath(path);
    if (parts.length === 0) {
      // Clear root
      set({ root: { type: "folder", children: {} } });
      return;
    }

    const folderName = parts.pop()!;
    const parent = navigateToFolder(get().root, parts);

    if (!parent) return;

    const folder = parent.children[folderName];
    if (!folder || folder.type !== "folder") return;

    delete parent.children[folderName];
    set({ root: { ...get().root } });
  },

  listDirectory: (path) => {
    const parts = splitPath(path);
    const folder = navigateToFolder(get().root, parts);

    if (!folder) return [];

    return Object.keys(folder.children);
  },

  getSnapshot: () => {
    // Deep clone the filesystem tree
    return JSON.parse(JSON.stringify(get().root));
  },

  hydrate: (tree) => {
    set({ root: tree });
  },

  clear: () => {
    set({ root: { type: "folder", children: {} } });
  }
}));

