/**
 * CardFront Unity Template
 * Complete CardFront starter with board, cards, UI, and scripts
 */

export const cardfrontUnityTemplate = {
  id: "cardfront",
  name: "CardFront Starter",
  files: {
    // ProjectSettings (same as minimal)
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

    // Card Script
    "Assets/Scripts/Card.cs": `using UnityEngine;

public class Card : MonoBehaviour
{
    public int top;
    public int bottom;
    public int left;
    public int right;
    
    public string cardName;
    public string description;
    
    public void OnCardPlayed()
    {
        Debug.Log("Card played: " + cardName);
    }
    
    public void OnCardDrawn()
    {
        Debug.Log("Card drawn: " + cardName);
    }
}
`,

    // CardZone Script
    "Assets/Scripts/CardZone.cs": `using UnityEngine;
using System.Collections.Generic;

public class CardZone : MonoBehaviour
{
    public List<Card> cards = new List<Card>();
    public int maxCards = 10;
    public string zoneName;
    
    public bool AddCard(Card card)
    {
        if (cards.Count >= maxCards)
        {
            Debug.LogWarning("Zone " + zoneName + " is full!");
            return false;
        }
        
        cards.Add(card);
        card.transform.SetParent(transform);
        return true;
    }
    
    public bool RemoveCard(Card card)
    {
        return cards.Remove(card);
    }
}
`,

    // TurnManager Script
    "Assets/Scripts/TurnManager.cs": `using UnityEngine;

public class TurnManager : MonoBehaviour
{
    public int currentPlayer = 0;
    public int totalPlayers = 2;
    
    private void Start()
    {
        Debug.Log("Turn Manager initialized");
    }
    
    public void NextTurn()
    {
        currentPlayer = (currentPlayer + 1) % totalPlayers;
        Debug.Log("Turn: Player " + currentPlayer);
    }
    
    public void EndTurn()
    {
        NextTurn();
    }
}
`,

    // Main Scene
    "Assets/Scenes/CardFront.unity": `%YAML 1.1
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
  m_Orthographic: 0
  m_OrthographicSize: 5
  m_Depth: -1
  m_CullingMask:
    serializedVersion: 2
    m_Bits: 4294967295
`,

    // Entry script
    "src/main.ts": `// CardFront Unity Template
console.log("CardFront template loaded!");
console.log("This template includes:");
console.log("- Card.cs: Card component script");
console.log("- CardZone.cs: Zone management script");
console.log("- TurnManager.cs: Turn-based gameplay script");
`,

    // WISSIL Metadata
    "WISSIL/Metadata/manifest.json": JSON.stringify(
      {
        project: "CardFront",
        version: "1.0.0",
        unity: "2022.3.x",
        contains: ["scenes", "scripts", "prefabs", "webgl"],
        generatedAt: new Date().toISOString(),
        description: "CardFront game starter template with board, cards, and UI"
      },
      null,
      2
    ),

    // Documentation
    "WISSIL/Docs/README.md": `# CardFront Unity Template

Complete CardFront starter project with board layout, camera, UI, and card prefabs.

## Components

### Scripts

- **Card.cs**: Card component with values (top, bottom, left, right)
- **CardZone.cs**: Zone management for organizing cards
- **TurnManager.cs**: Turn-based gameplay manager

### Scene

- CardFront.unity: Main scene with board setup

## Usage

1. Open Assets/Scenes/CardFront.unity
2. Review the scripts in Assets/Scripts/
3. Connect to LUNA / WISSIL runtime
4. Extend with custom card logic

Ready to build card-based games!
`
  }
};

