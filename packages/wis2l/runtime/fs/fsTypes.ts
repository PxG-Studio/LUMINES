/**
 * WISSIL Filesystem Types
 * Core types for virtual filesystem nodes
 */

export type FSFile = {
  type: "file";
  content: string;
};

export type FSFolder = {
  type: "folder";
  children: Record<string, FSFile | FSFolder>;
};

export type FSNode = FSFile | FSFolder;

export type FilePath = string; // "src/main.ts"

