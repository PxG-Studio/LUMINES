/**
 * Import Project
 * Imports a ZIP file into the virtual filesystem
 */

import { unzipToObject, isValidZip } from "./zipUtils";
import { useWissilFS } from "@/wis2l/runtime/fs/wissilFs";
import { regenerateTree } from "@/wis2l/Slate/components/FileTreeState";
import { openFile } from "@/wis2l/Slate/editor/openFile";
import { IgnitionController } from "@/wis2l/runtime/projects/ignitionController";
import { useEditorState } from "@/state/editorState";

/**
 * Import a project from a ZIP file
 * - Extracts ZIP into virtual filesystem
 * - Regenerates FileTree
 * - Opens entry file in editor
 * - Optionally auto-runs the project
 */
export async function importProjectZip(
  blob: Blob,
  options: {
    autoRun?: boolean;
    clearExisting?: boolean;
  } = {}
): Promise<void> {
  const { autoRun = true, clearExisting = true } = options;

  // Validate ZIP
  if (!(await isValidZip(blob))) {
    throw new Error("Invalid ZIP file. Please provide a valid WISSIL project ZIP.");
  }

  const fs = useWissilFS.getState();

  // Extract files from ZIP
  const files = await unzipToObject(blob);

  if (Object.keys(files).length === 0) {
    throw new Error("ZIP file is empty or contains no valid files.");
  }

  // Clear existing filesystem if requested
  if (clearExisting) {
    fs.hydrate({
      type: "folder",
      children: {}
    });
  }

  // Write all files to virtual filesystem
  for (const path in files) {
    try {
      fs.writeFile(path, files[path]);
    } catch (err) {
      console.warn(`Failed to import file ${path}:`, err);
    }
  }

  // Refresh FileTree
  regenerateTree();

  // Find entry file automatically
  const entryFile = findEntryFile(files);

  if (entryFile) {
    // Open entry file in editor
    openFile(entryFile);

    // Auto-run if requested
    if (autoRun) {
      // Small delay to ensure editor is ready
      setTimeout(() => {
        IgnitionController.run(entryFile);
      }, 500);
    }
  } else {
    // If no entry file found, clear selection
    useEditorState.getState().setSelectedFile(null);
  }
}

/**
 * Find the entry file from a set of files
 * Tries common entry points in order of preference
 */
function findEntryFile(files: Record<string, string>): string | null {
  // Common entry points in order of preference
  const entryPoints = [
    "src/main.ts",
    "src/index.ts",
    "src/sketch.js",
    "src/main.js",
    "src/index.js",
    "main.ts",
    "index.ts",
    "main.js",
    "index.js"
  ];

  // Try exact matches first
  for (const entry of entryPoints) {
    if (files[entry]) {
      return entry;
    }
  }

  // Find first TypeScript/JavaScript file
  const tsFiles = Object.keys(files).filter(
    (f) => f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".js") || f.endsWith(".jsx")
  );

  if (tsFiles.length > 0) {
    // Prefer files in src/ directory
    const srcFiles = tsFiles.filter((f) => f.startsWith("src/"));
    return srcFiles.length > 0 ? srcFiles[0] : tsFiles[0];
  }

  // Fallback: first file
  const firstFile = Object.keys(files)[0];
  return firstFile || null;
}

