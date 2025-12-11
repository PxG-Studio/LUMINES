/**
 * Spark Loader
 * Hydrates a template into the virtual filesystem
 */

import { useWissilFS } from "@/wis2l/runtime/fs/wissilFs";
import { SparkTemplate } from "./sparkTemplates";
import { openFile } from "@/wis2l/Slate/editor/openFile";
import { IgnitionController } from "@/wis2l/runtime/projects/ignitionController";
import { regenerateTree } from "@/wis2l/Slate/components/FileTreeState";

/**
 * Load a Spark template into the filesystem
 * - Clears existing FS
 * - Writes all template files
 * - Regenerates FileTree
 * - Opens entry file in editor
 * - Auto-runs the project
 */
export function loadSparkTemplate(template: SparkTemplate): void {
  const fs = useWissilFS.getState();

  // 1. Clear FS entirely (reset to empty folder structure)
  fs.hydrate({
    type: "folder",
    children: {}
  });

  // 2. Populate FS with template files
  for (const [path, content] of Object.entries(template.files)) {
    fs.writeFile(path, content);
  }

  // 3. Regenerate FileTree from FS
  regenerateTree();

  // 4. Open entry file in editor
  openFile(template.entry);

  // 5. Auto-run project (with small delay to ensure editor is ready)
  setTimeout(() => {
    IgnitionController.run(template.entry);
  }, 500);
}

