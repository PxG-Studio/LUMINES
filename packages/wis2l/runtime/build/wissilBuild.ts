/**
 * WISSIL Build Pipeline
 * Full bundling pipeline: FS → Dependency Graph → Transform → Bundle
 */

import { buildDependencyGraph, getDependencyOrder } from "./dependencyGraph";
import { transformFiles, initEsbuild } from "./transform";
import { formatBuildError } from "./errors";
import { useEditorState } from "@/state/editorState";
import { useWissilFS } from "../fs/wissilFs";

export interface BuildResult {
  bundle: string;
  graph: Record<string, string[]>;
  transformed: Record<string, string>;
  success: boolean;
  error?: string;
}

/**
 * Main build function
 * Compiles virtual filesystem into executable bundle
 */
export async function wissilBuild(entry: string): Promise<BuildResult> {
  const setBuildStatus = useEditorState.getState().setBuildStatus;
  const setRuntimeError = useEditorState.getState().setRuntimeError;
  const pushMessage = useEditorState.getState().pushMessage;

  try {
    setBuildStatus("running");
    pushMessage(`[Build] Starting build for entry: ${entry}`);

    // Initialize esbuild
    await initEsbuild();
    pushMessage(`[Build] esbuild initialized`);

    // 1. Build dependency graph
    const graph = buildDependencyGraph(entry);
    pushMessage(`[Build] Dependency graph built: ${Object.keys(graph).length} files`);

    if (Object.keys(graph).length === 0) {
      throw new Error(`No files found for entry: ${entry}`);
    }

    // 2. Get files in dependency order
    const orderedFiles = getDependencyOrder(graph);
    pushMessage(`[Build] Transforming ${orderedFiles.length} files...`);

    // 3. Transform each file
    const transformed = await transformFiles(orderedFiles);
    pushMessage(`[Build] All files transformed successfully`);

    // 4. Bundle into single output
    // Simple concatenation for now - Phase 4.3 will wrap in eval-sandbox
    let bundle = `// WISSIL Build Output\n// Entry: ${entry}\n// Files: ${orderedFiles.length}\n\n`;
    
    // Add module wrapper for each file
    for (const file of orderedFiles) {
      const code = transformed[file] || "";
      bundle += `// ===== FILE: ${file} =====\n`;
      bundle += `(function() {\n`;
      bundle += code;
      bundle += `\n})();\n\n`;
    }

    setBuildStatus("idle");
    pushMessage(`[Build] Build completed successfully`);
    
    return {
      bundle,
      graph,
      transformed,
      success: true
    };

  } catch (err: any) {
    const errorMessage = formatBuildError(err);
    setBuildStatus("error");
    setRuntimeError(errorMessage);
    pushMessage(`[Build] Build failed: ${errorMessage}`);

    return {
      bundle: "",
      graph: {},
      transformed: {},
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Quick build check (validate entry exists)
 */
export function validateEntry(entry: string): boolean {
  const fs = useWissilFS.getState();
  return fs.exists(entry);
}

