# Unity C# Integration for Prefab Inspector + Runtime Prefab Editing

This document describes the Unity C# scripts needed for Phase U - Prefab Inspector + Runtime Prefab Editing.

## Required Unity Scripts

### 1. PrefabMetadataEmitter.cs

Place in `Assets/Scripts/Prefabs/PrefabMetadataEmitter.cs`:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class PrefabMetadataEmitter : MonoBehaviour
{
    public GameObject rootPrefab;
    public string prefabId;

    private float lastUpdateTime = 0;
    private float updateInterval = 0.5f; // Update every 500ms

    void Start()
    {
        if (rootPrefab == null)
        {
            rootPrefab = gameObject;
        }
        if (string.IsNullOrEmpty(prefabId))
        {
            prefabId = GetInstanceID().ToString();
        }
        Emit();
    }

    void Update()
    {
        // Periodic updates (less frequent than transforms)
        if (Time.time - lastUpdateTime >= updateInterval)
        {
            Emit();
            lastUpdateTime = Time.time;
        }
    }

    public void Emit()
    {
        if (rootPrefab == null) return;

        var data = ExtractPrefabData(rootPrefab);
        string json = JsonUtility.ToJson(data);
        JSBridge.SendToJS("prefab/snapshot", json);
    }

    PrefabData ExtractPrefabData(GameObject go)
    {
        var d = new PrefabData();
        d.id = prefabId + "_" + go.GetInstanceID();
        d.name = go.name;

        // Transform
        d.transform = new PrefabTransform()
        {
            pos = new Vector3Wrapper
            {
                x = go.transform.localPosition.x,
                y = go.transform.localPosition.y,
                z = go.transform.localPosition.z
            },
            rot = new Vector3Wrapper
            {
                x = go.transform.localEulerAngles.x,
                y = go.transform.localEulerAngles.y,
                z = go.transform.localEulerAngles.z
            },
            scale = new Vector3Wrapper
            {
                x = go.transform.localScale.x,
                y = go.transform.localScale.y,
                z = go.transform.localScale.z
            }
        };

        // Components
        var comps = go.GetComponents<Component>();
        foreach (var c in comps)
        {
            if (c is Transform) continue;

            try
            {
                d.components.Add(new PrefabComponent()
                {
                    type = c.GetType().Name,
                    json = JsonUtility.ToJson(c)
                });
            }
            catch (System.Exception e)
            {
                Debug.LogWarning($"[PrefabMetadataEmitter] Could not serialize component {c.GetType().Name}: {e.Message}");
            }
        }

        // Children
        foreach (Transform child in go.transform)
        {
            d.children.Add(ExtractPrefabData(child.gameObject));
        }

        return d;
    }
}

[System.Serializable]
public class PrefabData
{
    public string id;
    public string name;
    public PrefabTransform transform;
    public List<PrefabComponent> components = new List<PrefabComponent>();
    public List<PrefabData> children = new List<PrefabData>();
}

[System.Serializable]
public class PrefabTransform
{
    public Vector3Wrapper pos;
    public Vector3Wrapper rot;
    public Vector3Wrapper scale;
}

[System.Serializable]
public class PrefabComponent
{
    public string type;
    public string json;
}

[System.Serializable]
public class Vector3Wrapper
{
    public float x, y, z;
}
```

### 2. PrefabHotReloadHandler.cs

Place in `Assets/Scripts/Prefabs/PrefabHotReloadHandler.cs`:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class PrefabHotReloadHandler : MonoBehaviour
{
    private static Dictionary<string, GameObject> prefabInstances = new Dictionary<string, GameObject>();

    public static void RegisterPrefab(string id, GameObject instance)
    {
        prefabInstances[id] = instance;
    }

    public static void Apply(string id, string json)
    {
        if (!prefabInstances.ContainsKey(id))
        {
            Debug.LogWarning($"[PrefabHotReloadHandler] Prefab {id} not found");
            return;
        }

        var payload = JsonUtility.FromJson<ApplyPayload>(json);
        var prefabRoot = prefabInstances[id];

        foreach (var diff in payload.diffs)
        {
            ApplyDiff(prefabRoot, diff);
        }

        Debug.Log($"[PrefabHotReloadHandler] Applied {payload.diffs.Length} changes to prefab {id}");
    }

    public static void Revert(string id)
    {
        if (!prefabInstances.ContainsKey(id))
        {
            Debug.LogWarning($"[PrefabHotReloadHandler] Prefab {id} not found");
            return;
        }

        // Reload prefab from original
        var prefabRoot = prefabInstances[id];
        
        // Note: In WebGL, we cannot reload prefabs at runtime
        // This would require precompiled prefab variants or asset bundle reloading
        Debug.Log($"[PrefabHotReloadHandler] Revert not fully supported in WebGL");
    }

    private static void ApplyDiff(GameObject root, Diff diff)
    {
        var parts = diff.path.Split('.');
        
        // Handle transform paths
        if (parts.Length >= 2 && parts[0] == "transform")
        {
            var t = root.transform;
            
            if (parts[1] == "pos" || parts[1] == "position")
            {
                var pos = t.localPosition;
                if (parts.Length >= 3)
                {
                    float value = float.Parse(diff.modified.ToString());
                    if (parts[2] == "x") pos.x = value;
                    else if (parts[2] == "y") pos.y = value;
                    else if (parts[2] == "z") pos.z = value;
                }
                t.localPosition = pos;
            }
            else if (parts[1] == "rot" || parts[1] == "rotation")
            {
                var rot = t.localEulerAngles;
                if (parts.Length >= 3)
                {
                    float value = float.Parse(diff.modified.ToString());
                    if (parts[2] == "x") rot.x = value;
                    else if (parts[2] == "y") rot.y = value;
                    else if (parts[2] == "z") rot.z = value;
                }
                t.localEulerAngles = rot;
            }
            else if (parts[1] == "scale")
            {
                var scale = t.localScale;
                if (parts.Length >= 3)
                {
                    float value = float.Parse(diff.modified.ToString());
                    if (parts[2] == "x") scale.x = value;
                    else if (parts[2] == "y") scale.y = value;
                    else if (parts[2] == "z") scale.z = value;
                }
                t.localScale = scale;
            }
        }
        // Handle component paths
        else if (parts.Length >= 2 && parts[0] == "components")
        {
            // Extract component index
            var match = System.Text.RegularExpressions.Regex.Match(parts[1], @"\[(\d+)\]");
            if (match.Success)
            {
                int index = int.Parse(match.Groups[1].Value);
                var components = root.GetComponents<Component>();
                
                if (index >= 0 && index < components.Length)
                {
                    var component = components[index];
                    // Try to apply JSON changes
                    try
                    {
                        JsonUtility.FromJsonOverwrite(diff.modified.ToString(), component);
                    }
                    catch (System.Exception e)
                    {
                        Debug.LogWarning($"[PrefabHotReloadHandler] Could not apply component diff: {e.Message}");
                    }
                }
            }
        }
        // Handle child paths
        else if (parts.Length >= 2 && parts[0] == "children")
        {
            var match = System.Text.RegularExpressions.Regex.Match(parts[1], @"\[(.+?)\]");
            if (match.Success)
            {
                string childId = match.Groups[1].Value;
                // Find child by ID and apply diff recursively
                var child = FindChildById(root, childId);
                if (child != null)
                {
                    // Recursively apply remaining path
                    var remainingPath = string.Join(".", parts, 2, parts.Length - 2);
                    if (!string.IsNullOrEmpty(remainingPath))
                    {
                        var childDiff = new Diff { path = remainingPath, modified = diff.modified };
                        ApplyDiff(child, childDiff);
                    }
                }
            }
        }
    }

    private static GameObject FindChildById(GameObject root, string id)
    {
        // Search all children
        foreach (Transform child in root.transform)
        {
            if (child.gameObject.GetInstanceID().ToString().Contains(id))
            {
                return child.gameObject;
            }
            
            var found = FindChildById(child.gameObject, id);
            if (found != null) return found;
        }
        
        return null;
    }
}

[System.Serializable]
public class ApplyPayload
{
    public string id;
    public Diff[] diffs;
}

[System.Serializable]
public class Diff
{
    public string path;
    public string original;
    public string modified;
}
```

### 3. JSBridge Integration

Ensure your existing JSBridge.cs handles these messages:

```csharp
public class JSBridge : MonoBehaviour
{
    // ... existing code ...

    void ReceiveMessage(string json)
    {
        var msg = JsonUtility.FromJson<JSMessage>(json);

        switch (msg.type)
        {
            case "prefab/request":
                // Request prefab snapshot
                var emitter = FindObjectOfType<PrefabMetadataEmitter>();
                if (emitter != null && emitter.prefabId == msg.id)
                {
                    emitter.Emit();
                }
                break;

            case "prefab/apply":
                PrefabHotReloadHandler.Apply(msg.id, json);
                break;

            case "prefab/revert":
                PrefabHotReloadHandler.Revert(msg.id);
                break;

            // ... other cases ...
        }
    }
}
```

## Setup Instructions

1. Create the folder structure:
   - `Assets/Scripts/Prefabs/`

2. Add all scripts to Unity project

3. Add `PrefabMetadataEmitter` component to prefab root objects

4. Set `prefabId` on each emitter (unique identifier)

5. Register prefabs with hot reload handler:
   ```csharp
   PrefabHotReloadHandler.RegisterPrefab("prefab_001", myPrefabInstance);
   ```

## Notes

- Prefab snapshots are emitted periodically (every 500ms)
- Component serialization uses JsonUtility (limited to public fields)
- Transform changes apply immediately
- Component changes require JsonUtility-compatible classes
- Revert functionality is limited in WebGL (precompiled prefabs)

This system integrates with:
- Phase K (Scene Graph) for object selection
- Phase F/G (Hot Reload) for live component updates
- Phase N (Materials) for material property changes
- Phase R (Gizmos) for transform manipulation

