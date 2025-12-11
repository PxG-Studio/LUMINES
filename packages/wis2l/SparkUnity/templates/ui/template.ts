/**
 * Unity UI Template
 * UI Canvas, buttons, transitions, animations
 */

export const uiUnityTemplate = {
  id: "ui",
  name: "Unity UI Template",
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
          "com.unity.ugui": "1.0.0"
        }
      },
      null,
      2
    ),

    // FadeTransition Script
    "Assets/Scripts/FadeTransition.cs": `using UnityEngine;
using System.Collections;

public class FadeTransition : MonoBehaviour
{
    public CanvasGroup group;
    public float duration = 0.3f;
    
    private Coroutine fadeCoroutine;
    
    public void FadeIn()
    {
        if (fadeCoroutine != null)
            StopCoroutine(fadeCoroutine);
            
        fadeCoroutine = StartCoroutine(Fade(1f));
    }
    
    public void FadeOut()
    {
        if (fadeCoroutine != null)
            StopCoroutine(fadeCoroutine);
            
        fadeCoroutine = StartCoroutine(Fade(0f));
    }
    
    private IEnumerator Fade(float targetAlpha)
    {
        if (group == null) yield break;
        
        float startAlpha = group.alpha;
        float elapsed = 0f;
        
        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            group.alpha = Mathf.Lerp(startAlpha, targetAlpha, elapsed / duration);
            yield return null;
        }
        
        group.alpha = targetAlpha;
    }
}
`,

    // UI Manager Script
    "Assets/Scripts/UIManager.cs": `using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    public Button playButton;
    public Button settingsButton;
    public Button quitButton;
    
    public GameObject mainMenuPanel;
    public GameObject settingsPanel;
    
    private void Start()
    {
        if (playButton != null)
            playButton.onClick.AddListener(OnPlayClicked);
            
        if (settingsButton != null)
            settingsButton.onClick.AddListener(OnSettingsClicked);
            
        if (quitButton != null)
            quitButton.onClick.AddListener(OnQuitClicked);
    }
    
    private void OnPlayClicked()
    {
        Debug.Log("Play button clicked!");
        if (mainMenuPanel != null)
            mainMenuPanel.SetActive(false);
    }
    
    private void OnSettingsClicked()
    {
        Debug.Log("Settings button clicked!");
        if (settingsPanel != null)
            settingsPanel.SetActive(true);
        if (mainMenuPanel != null)
            mainMenuPanel.SetActive(false);
    }
    
    private void OnQuitClicked()
    {
        Debug.Log("Quit button clicked!");
        Application.Quit();
    }
}
`,

    // Main Scene with UI
    "Assets/Scenes/UI.unity": `%YAML 1.1
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
`,

    // Entry script
    "src/main.ts": `// Unity UI Template
console.log("Unity UI template loaded!");
console.log("This template includes:");
console.log("- FadeTransition.cs: UI fade effects");
console.log("- UIManager.cs: Button and panel management");
console.log("- Canvas setup for UI prototyping");
`,

    // WISSIL Metadata
    "WISSIL/Metadata/manifest.json": JSON.stringify(
      {
        project: "UnityUI",
        version: "1.0.0",
        unity: "2022.3.x",
        contains: ["scenes", "scripts", "ui"],
        generatedAt: new Date().toISOString(),
        description: "Unity UI template with Canvas, buttons, and transitions"
      },
      null,
      2
    ),

    // Documentation
    "WISSIL/Docs/README.md": `# Unity UI Template

Unity UI template with Canvas, buttons, transitions, and animations.

## Components

### Scripts

- **FadeTransition.cs**: Fade in/out effects for UI panels
- **UIManager.cs**: Button click handlers and panel management

### Features

- Canvas setup
- Button samples
- Transition effects
- Panel switching
- Animation-ready structure

## Usage

1. Open Assets/Scenes/UI.unity
2. Review UI scripts in Assets/Scripts/
3. Customize button behaviors
4. Add more UI elements as needed

Perfect for WISSIL UI prototyping!
`
  }
};

