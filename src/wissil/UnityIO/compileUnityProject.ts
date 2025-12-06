/**
 * Unity Project Compiler
 * Compiles WISSIL virtual FS into Unity-compatible folder structure
 */

import { useWissilFS } from "@/wissil/runtime/fs/wissilFs";
import { UnityExportManifest, createExportManifest } from "./manifest";

export type UnityCompiledProject = {
  files: Record<string, string>;
  manifest: UnityExportManifest;
};

/**
 * Generate a GUID (Unity format: 32 hex characters)
 */
function createGuid(): string {
  return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate Unity .meta file content for an asset
 */
function generateMetaFile(path: string, fileType: string = "DefaultAsset"): string {
  const guid = createGuid();
  const now = Date.now();
  
  // Determine file type based on extension
  let assetImporter = "DefaultImporter";
  let importSettings = "";
  
  if (path.endsWith(".cs")) {
    assetImporter = "MonoImporter";
    importSettings = `
  externalObjects: {}
  serializedVersion: 2
  defaultReferences: []
  executionOrder: 0
  icon: {instanceID: 0}
  userData: 
  assetBundleName: 
  assetBundleVariant: `;
  } else if (path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".jpeg")) {
    assetImporter = "TextureImporter";
    importSettings = `
  externalObjects: {}
  serializedVersion: 2
  mipmaps:
    mipMapMode: 0
    enableMipMap: 1
  enablePostProcessor: 0
  spriteImportMode: 1
  spritePixelsPerUnit: 100
  spriteMeshType: 1`;
  } else if (path.endsWith(".shader")) {
    assetImporter = "ShaderImporter";
    importSettings = `
  externalObjects: {}
  defaultTextures: []
  nonModifiableTextures: []
  preprocessorOverride: 0
  userData: 
  assetBundleName: 
  assetBundleVariant: `;
  } else if (path.endsWith(".unity")) {
    assetImporter = "SceneAssetImporter";
    importSettings = `
  externalObjects: {}
  userData: 
  assetBundleName: 
  assetBundleVariant: `;
  }

  return `fileFormatVersion: 2
guid: ${guid}
${importSettings}
  ${assetImporter}:
    externalObjects: {}
    userData: 
    assetBundleName: 
    assetBundleVariant: 
`;
}

/**
 * Compile WISSIL virtual FS into Unity-compatible project structure
 */
export function compileUnityProject(
  name: string = "WISSILUnityProject"
): UnityCompiledProject {
  const fsSnapshot = useWissilFS.getState().getSnapshot();
  const out: Record<string, string> = {};

  /**
   * Helper to write a file to the output
   */
  function write(path: string, content: string): void {
    out[path] = content;
  }

  // 1. Add mandatory Unity ProjectSettings files
  write(
    "ProjectSettings/ProjectVersion.txt",
    "m_EditorVersion: 2022.3.0f1\nm_EditorVersionWithRevision: 2022.3.0f1 (a13e52b7c76a)"
  );

  write(
    "ProjectSettings/EditorSettings.asset",
    `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!159 &1
EditorSettings:
  m_ObjectHideFlags: 0
  serializedVersion: 12
  m_SerializationMode: 2
  m_LineEndingsForNewScripts: 0
  defaultBehaviorMode: 1
  prefabModeAllowAutoSave: 1
  spritePackerMode: 4
  spritePackerPaddingPower: 1
  etwStackTraceCapture: 1
`
  );

  write(
    "ProjectSettings/GraphicsSettings.asset",
    `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!129 &1
GraphicsSettings:
  m_ObjectHideFlags: 0
  serializedVersion: 14
`
  );

  write(
    "ProjectSettings/InputManager.asset",
    `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!13 &1
InputManager:
  m_ObjectHideFlags: 0
  serializedVersion: 2
  m_Axes:
  - serializedVersion: 3
    m_Name: Horizontal
    descriptiveName: 
    descriptiveNegativeName: 
    negativeButton: left
    positiveButton: right
    altNegativeButton: a
    altPositiveButton: d
    gravity: 3
    dead: 0.001
    sensitivity: 3
    snap: 1
    invert: 0
    type: 0
    axis: 0
    joyNum: 0
  - serializedVersion: 3
    m_Name: Vertical
    descriptiveName: 
    descriptiveNegativeName: 
    negativeButton: down
    positiveButton: up
    altNegativeButton: s
    altPositiveButton: w
    gravity: 3
    dead: 0.001
    sensitivity: 3
    snap: 1
    invert: 0
    type: 0
    axis: 0
    joyNum: 0
`
  );

  // 2. Add Packages manifest
  write(
    "Packages/manifest.json",
    JSON.stringify(
      {
        dependencies: {
          "com.unity.collab-proxy": "2.0.7",
          "com.unity.feature.development": "1.0.1",
          "com.unity.textmeshpro": "3.0.6",
          "com.unity.timeline": "1.7.4",
          "com.unity.ugui": "1.0.0",
          "com.unity.visualscripting": "1.8.0"
        }
      },
      null,
      2
    )
  );

  // Helper to detect file type for meta file generation
  function detectFileType(path: string): string {
    if (path.endsWith(".cs")) return "MonoScript";
    if (path.endsWith(".unity")) return "SceneAsset";
    if (path.match(/\.(png|jpg|jpeg)$/i)) return "Texture2D";
    if (path.endsWith(".mat")) return "Material";
    if (path.endsWith(".shader")) return "Shader";
    if (path.endsWith(".prefab")) return "Prefab";
    return "DefaultAsset";
  }

  // 3. Walk filesystem and add Assets/ folder content
  function walkAssets(folder: any, prefix: string): void {
    if (!folder || folder.type !== "folder") return;
    
    for (const key in folder.children || {}) {
      const node = folder.children[key];
      if (!node) continue;

      const path = `${prefix}/${key}`;

      if (node.type === "folder") {
        walkAssets(node, path);
      } else if (node.type === "file") {
        // Write the file
        write(path, node.content);

        // Generate and write .meta file for Unity
        const metaContent = generateMetaFile(path, detectFileType(path));
        write(`${path}.meta`, metaContent);
      }
    }
  }

  function walkAll(folder: any, targetPrefix: string): void {
    if (!folder || folder.type !== "folder") return;
    
    for (const key in folder.children || {}) {
      const node = folder.children[key];
      if (!node) continue;

      // Skip non-Unity files
      if (node.type === "file") {
        if (
          key.endsWith(".md") ||
          key === "README.md" ||
          key === "package.json" ||
          key === "tsconfig.json"
        ) {
          continue;
        }
      }

      const path = `${targetPrefix}/${key}`;

      if (node.type === "folder") {
        walkAll(node, path);
      } else if (node.type === "file") {
        // Write the file under Assets/
        write(path, node.content);
        
        // Generate .meta file
        const metaContent = generateMetaFile(path, detectFileType(key));
        write(`${path}.meta`, metaContent);
      }
    }
  }

  // Start walking from root
  // If there's an Assets/ folder in FS, use it directly; otherwise organize all files under Assets/
  if (fsSnapshot.children && fsSnapshot.children["Assets"]) {
    walkAssets(fsSnapshot.children["Assets"], "Assets");
  } else {
    // Walk all files and organize them under Assets/
    for (const key in fsSnapshot.children || {}) {
      const node = fsSnapshot.children[key];
      if (!node) continue;

      // Skip root-level special files and folders
      if (key === "node_modules" || key === ".git" || key.startsWith(".")) {
        continue;
      }

      if (node.type === "folder") {
        walkAll(node, `Assets/${key}`);
      } else if (node.type === "file") {
        // Only include Unity-compatible files at root
        if (
          key.endsWith(".cs") ||
          key.endsWith(".unity") ||
          key.endsWith(".mat") ||
          key.endsWith(".shader") ||
          key.endsWith(".prefab")
        ) {
          write(`Assets/${key}`, node.content);
          const metaContent = generateMetaFile(`Assets/${key}`, detectFileType(key));
          write(`Assets/${key}.meta`, metaContent);
        }
      }
    }
  }

  // 4. Create metadata manifest
  const contains: string[] = [];
  
  // Detect what's in the project
  const allFiles = Object.keys(out);
  if (allFiles.some((f) => f.endsWith(".unity"))) contains.push("scenes");
  if (allFiles.some((f) => f.endsWith(".cs") || f.endsWith(".js"))) contains.push("scripts");
  if (allFiles.some((f) => f.match(/\.(png|jpg|jpeg|mat|prefab|shader)$/))) contains.push("assets");
  if (allFiles.some((f) => f.includes("Resources/"))) contains.push("resources");

  const manifest = createExportManifest({
    project: name,
    contains: contains.length > 0 ? contains : ["assets", "scenes", "scripts"],
    description: `Unity project exported from WISSIL at ${new Date().toISOString()}`
  });

  // 5. Add WISSIL metadata folder
  write("WISSIL/Metadata/manifest.json", JSON.stringify(manifest, null, 2));

  return { files: out, manifest };
}

