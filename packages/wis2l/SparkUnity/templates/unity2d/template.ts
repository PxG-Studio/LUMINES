/**
 * Unity 2D Template
 * 2D camera, sprites, tilemap-ready project
 */

export const unity2dTemplate = {
  id: "unity2d",
  name: "Unity 2D Template",
  files: {
    // ProjectSettings
    "ProjectSettings/ProjectVersion.txt": `m_EditorVersion: 2022.3.0f1
m_EditorVersionWithRevision: 2022.3.0f1 (a13e52b7c76a)`,

    "Packages/manifest.json": JSON.stringify(
      {
        dependencies: {
          "com.unity.collab-proxy": "2.0.7",
          "com.unity.feature.development": "1.0.1",
          "com.unity.textmeshpro": "3.0.6",
          "com.unity.timeline": "1.7.4",
          "com.unity.ugui": "1.0.0",
          "com.unity.2d.tilemap": "1.0.0",
          "com.unity.2d.sprite": "1.0.0"
        }
      },
      null,
      2
    ),

    // Player Movement Script
    "Assets/Scripts/PlayerMove2D.cs": `using UnityEngine;

public class PlayerMove2D : MonoBehaviour
{
    public float speed = 5f;
    public Rigidbody2D rb;
    
    private Vector2 moveInput;
    
    private void Start()
    {
        if (rb == null)
            rb = GetComponent<Rigidbody2D>();
    }
    
    private void Update()
    {
        moveInput.x = Input.GetAxis("Horizontal");
        moveInput.y = Input.GetAxis("Vertical");
    }
    
    private void FixedUpdate()
    {
        if (rb != null)
        {
            rb.velocity = moveInput * speed;
        }
        else
        {
            transform.Translate(new Vector3(moveInput.x, moveInput.y, 0) * speed * Time.deltaTime);
        }
    }
}
`,

    // Camera Follow Script
    "Assets/Scripts/CameraFollow2D.cs": `using UnityEngine;

public class CameraFollow2D : MonoBehaviour
{
    public Transform target;
    public float smoothSpeed = 0.125f;
    public Vector3 offset;
    
    private void LateUpdate()
    {
        if (target != null)
        {
            Vector3 desiredPosition = target.position + offset;
            Vector3 smoothedPosition = Vector3.Lerp(transform.position, desiredPosition, smoothSpeed);
            transform.position = new Vector3(smoothedPosition.x, smoothedPosition.y, transform.position.z);
        }
    }
}
`,

    // Main 2D Scene
    "Assets/Scenes/Scene2D.unity": `%YAML 1.1
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
  m_Orthographic: 1
  m_OrthographicSize: 5
  m_Depth: -1
  m_CullingMask:
    serializedVersion: 2
    m_Bits: 4294967295
`,

    // Entry script
    "src/main.ts": `// Unity 2D Template
console.log("Unity 2D template loaded!");
console.log("This template includes:");
console.log("- PlayerMove2D.cs: 2D movement script");
console.log("- CameraFollow2D.cs: Camera follow script");
console.log("- Pixel-perfect camera setup");
console.log("- Tilemap-ready project structure");
`,

    // WISSIL Metadata
    "WISSIL/Metadata/manifest.json": JSON.stringify(
      {
        project: "Unity2D",
        version: "1.0.0",
        unity: "2022.3.x",
        contains: ["scenes", "scripts", "2d"],
        generatedAt: new Date().toISOString(),
        description: "Unity 2D template with pixel-perfect camera and sprite setup"
      },
      null,
      2
    ),

    // Documentation
    "WISSIL/Docs/README.md": `# Unity 2D Template

Unity 2D template with pixel-perfect camera, sprites, and tilemap-ready project.

## Components

### Scripts

- **PlayerMove2D.cs**: 2D movement with WASD/Arrow keys
- **CameraFollow2D.cs**: Camera that follows a target smoothly

### Features

- Pixel-perfect camera
- 2D physics ready
- Tilemap package included
- Sprite support
- Movement scripts

## Usage

1. Open Assets/Scenes/Scene2D.unity
2. Review 2D scripts in Assets/Scripts/
3. Add sprites to Assets/Sprites/
4. Create tilemaps for level design

Perfect for 2D game development!
`
  }
};

