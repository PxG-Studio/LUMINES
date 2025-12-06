/**
 * Unity Template Loader
 * Loads Unity starter templates into WISSIL filesystem
 */

import { useWissilFS } from "@/wissil/runtime/fs/wissilFs";
import { UnityTemplateMeta } from "./TemplateRegistry";
import { openFile } from "@/wissil/Slate/editor/openFile";
import { regenerateTree } from "@/wissil/Slate/components/FileTreeState";
import { useEditorState } from "@/state/editorState";
import { minimalUnityTemplate } from "./templates/minimal/template";
import { cardfrontUnityTemplate } from "./templates/cardfront/template";
import { uiUnityTemplate } from "./templates/ui/template";
import { unity2dTemplate } from "./templates/unity2d/template";

/**
 * Load a Unity template into the filesystem
 * - Clears existing FS
 * - Writes all template files (Assets, ProjectSettings, WebGLBuild, WISSIL)
 * - Regenerates FileTree
 * - Opens entry file in editor (if applicable)
 * - Auto-runs WebGL build in Ignis (if includesWebGL)
 */
export async function loadUnityTemplate(templateMeta: UnityTemplateMeta): Promise<void> {
  const fs = useWissilFS.getState();
  const pushMessage = useEditorState.getState().pushMessage;

  pushMessage(`[Spark] Loading Unity template: ${templateMeta.name}...`);

  try {
    // 1. Clear FS entirely
    fs.hydrate({
      type: "folder",
      children: {}
    });

    // 2. Get template files based on template ID
    let templateFiles: Record<string, string> = {};

    switch (templateMeta.id) {
      case "minimal":
        templateFiles = minimalUnityTemplate.files;
        break;
      case "cardfront":
        templateFiles = cardfrontUnityTemplate.files;
        break;
      case "ui":
        templateFiles = uiUnityTemplate.files;
        break;
      case "unity2d":
        templateFiles = unity2dTemplate.files;
        break;
      default:
        throw new Error(`Unknown Unity template: ${templateMeta.id}`);
    }

    // 3. Populate FS with template files
    const fileCount = Object.keys(templateFiles).length;
    pushMessage(`[Spark] Writing ${fileCount} files to virtual filesystem...`);

    for (const [path, content] of Object.entries(templateFiles)) {
      fs.writeFile(path, content);
    }

    // 4. Regenerate FileTree from FS
    regenerateTree();
    pushMessage(`[Spark] File tree regenerated`);

    // 5. Open entry file if specified (for templates with scripts)
    if (templateFiles["src/main.ts"]) {
      openFile("src/main.ts");
    } else if (templateFiles["Assets/Scenes/Main.unity"]) {
      // For Unity templates, open the main scene
      openFile("Assets/Scenes/Main.unity");
    }

    // 6. Enable Unity preview in Ignis if WebGL build is included
    if (templateMeta.includesWebGL) {
      pushMessage(`[Spark] Unity WebGL build ready for Ignis preview`);
      // The Ignis container will automatically detect and load Unity builds
    }

    pushMessage(`[Spark] Unity template loaded successfully: ${templateMeta.name}`);
  } catch (err: any) {
    const setRuntimeError = useEditorState.getState().setRuntimeError;
    setRuntimeError(`Failed to load Unity template: ${err?.message || String(err)}`);
    pushMessage(`❌ [Spark] Failed to load template: ${err?.message || String(err)}`);
    throw err;
  }
}

