/**
 * Open File Utility
 * Opens a file in the editor (adds to tabs, loads content)
 */

import { useEditorTabs } from "./useEditorTabs";
import { useEditorState } from "@/state/editorState";
import { useWissilFS } from "@/wis2l/runtime/fs/wissilFs";

/**
 * Open a file in the editor
 * - Adds to tabs if not already open
 * - Sets as active file
 * - Updates global selection for Inspector
 * - Returns file content
 */
export function openFile(path: string): string | null {
  const fs = useWissilFS.getState();
  const code = fs.readFile(path);

  // Update global selection for Inspector etc.
  useEditorState.getState().setSelectedFile(path);

  // Open in tabs (will set as active automatically)
  useEditorTabs.getState().open(path);

  return code;
}

