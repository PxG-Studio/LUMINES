/**
 * Export Project
 * Exports the current virtual filesystem to a ZIP file
 */

import { useWissilFS } from "@/wis2l/runtime/fs/wissilFs";
import { zipFromObject } from "./zipUtils";

/**
 * Export the current project to a ZIP file
 * Flattens the filesystem tree into a ZIP and triggers download
 */
export async function exportProject(filename: string = "project.wissil.zip"): Promise<void> {
  const fsSnapshot = useWissilFS.getState().getSnapshot();

  /**
   * Flatten the folder structure into a flat object of paths → content
   */
  const flatten = (folder: any, prefix = ""): Record<string, string> => {
    let out: Record<string, string> = {};

    for (const key in folder.children) {
      const node = folder.children[key];
      const path = prefix ? `${prefix}/${key}` : key;

      if (node.type === "folder") {
        // Recursively flatten folders
        out = { ...out, ...flatten(node, path) };
      } else if (node.type === "file") {
        // Add file content
        out[path] = node.content;
      }
    }

    return out;
  };

  const files = flatten(fsSnapshot);

  // Check if there are any files to export
  if (Object.keys(files).length === 0) {
    throw new Error("No files to export. Create some files first.");
  }

  // Create ZIP blob
  const blob = await zipFromObject(files);

  // Trigger browser download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

