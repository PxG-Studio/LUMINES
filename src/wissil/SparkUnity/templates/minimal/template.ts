/**
 * Minimal Unity WebGL Template
 * Smallest possible Unity project with WebGL build
 */

export const minimalUnityTemplate = {
  id: "minimal",
  name: "Minimal Unity WebGL Project",
  files: {
    // ProjectSettings
    "ProjectSettings/ProjectVersion.txt": `m_EditorVersion: 2022.3.0f1
m_EditorVersionWithRevision: 2022.3.0f1 (a13e52b7c76a)`,
    
    "ProjectSettings/EditorSettings.asset": `%YAML 1.1
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
`,

    "Packages/manifest.json": JSON.stringify(
      {
        dependencies: {
          "com.unity.collab-proxy": "2.0.7",
          "com.unity.feature.development": "1.0.1",
          "com.unity.textmeshpro": "3.0.6",
          "com.unity.timeline": "1.7.4",
          "com.unity.ugui": "1.0.0"
        }
      },
      null,
      2
    ),

    // Main Scene
    "Assets/Scenes/Main.unity": `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!29 &1
OcclusionCullingSettings:
  m_ObjectHideFlags: 0
  serializedVersion: 2
  m_SceneGUID: 00000000000000000000000000000000
--- !u!104 &2
RenderSettings:
  m_ObjectHideFlags: 0
  serializedVersion: 9
  m_Fog: 0
  m_FogColor: {r: 0.5, g: 0.5, b: 0.5, a: 1}
  m_FogMode: 3
  m_AmbientSkyColor: {r: 0.212, g: 0.227, b: 0.259, a: 1}
--- !u!157 &3
LightmapSettings:
  m_ObjectHideFlags: 0
  serializedVersion: 12
--- !u!1 &519420028
GameObject:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  serializedVersion: 6
  m_Component:
  - component: {fileID: 519420032}
  m_Layer: 0
  m_Name: Main Camera
  m_TagString: MainCamera
  m_Icon: {fileID: 0}
  m_NavMeshLayer: 0
  m_StaticEditorFlags: 0
  m_IsActive: 1
--- !u!81 &519420032
Camera:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_GameObject: {fileID: 519420028}
  m_Enabled: 1
  serializedVersion: 3
  m_Near: 0.3
  m_Far: 1000
  m_FieldOfView: 60
  m_Orthographic: 0
  m_OrthographicSize: 5
  m_Depth: -1
  m_CullingMask:
    serializedVersion: 2
    m_Bits: 4294967295
  m_RenderingPath: -1
  m_TargetTexture: {fileID: 0}
  m_TargetDisplay: 0
  m_TargetEye: 3
  m_HDR: 1
  m_AllowMSAA: 1
  m_AllowDynamicResolution: 0
  m_ForceIntoRT: 0
  m_OcclusionCulling: 1
  m_StereoConvergence: 10
  m_StereoSeparation: 0.022
`,

    // Entry script
    "src/main.ts": `// Minimal Unity WebGL Template
console.log("Unity WebGL template loaded!");
console.log("Open Assets/Scenes/Main.unity in Unity Browser to view the scene.");
`,

    // WISSIL Metadata
    "WISSIL/Metadata/manifest.json": JSON.stringify(
      {
        project: "MinimalUnity",
        version: "1.0.0",
        unity: "2022.3.x",
        contains: ["scenes", "webgl"],
        generatedAt: new Date().toISOString(),
        description: "Minimal Unity WebGL project template"
      },
      null,
      2
    ),

    // Documentation
    "WISSIL/Docs/README.md": `# Minimal Unity Template

A tiny Unity WebGL-ready project.

## Features

- Single scene (Main.unity)
- Default camera setup
- WebGL build ready
- Minimal ProjectSettings

## Usage

1. Open Assets/Scenes/Main.unity in Unity Browser
2. View scene hierarchy
3. Export to Unity Hub or extend with more assets

Perfect for testing Ignis WebGL preview!
`
  }
};

