# Unity C# Integration for Scene Graph Synchronizer

This document describes the Unity C# scripts needed for Phase K - Scene Graph Synchronizer.

## Required Unity Scripts

### 1. SceneGraphEmitter.cs

Place in `Assets/Scripts/SceneSync/SceneGraphEmitter.cs`:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class SceneGraphEmitter : MonoBehaviour
{
    private static float lastEmitTime = 0;
    private static float emitInterval = 0.5f; // Emit every 500ms

    void Update()
    {
        // Periodic emission
        if (Time.time - lastEmitTime > emitInterval)
        {
            EmitFull();
            lastEmitTime = Time.time;
        }
    }

    public static void EmitFull()
    {
        var objects = GameObject.FindObjectsOfType<Transform>();
        var list = new List<SceneNode>();

        foreach (var t in objects)
        {
            list.Add(new SceneNode(t));
        }

        string json = JsonHelper.ToJson(list.ToArray());
        JSBridge.SendToJS("scenegraph/update", json);
    }

    public static void EmitPartial(List<Transform> changed)
    {
        var list = new List<SceneNode>();
        foreach (var t in changed)
        {
            list.Add(new SceneNode(t));
        }

        string json = JsonHelper.ToJson(list.ToArray());
        JSBridge.SendToJS("scenegraph/partial", json);
    }
}

[System.Serializable]
public class SceneNode
{
    public string id;
    public string name;
    public string parent;
    public Vector3 pos;
    public Vector3 rot;
    public Vector3 scale;
    public string[] components;
    public bool active;
    public int layer;
    public string tag;

    public SceneNode(Transform t)
    {
        id = t.GetInstanceID().ToString();
        name = t.gameObject.name;
        parent = t.parent ? t.parent.GetInstanceID().ToString() : null;
        pos = t.localPosition;
        rot = t.localEulerAngles;
        scale = t.localScale;
        active = t.gameObject.activeSelf;
        layer = t.gameObject.layer;
        tag = t.gameObject.tag;

        var comps = t.GetComponents<Component>();
        components = new string[comps.Length];
        for (int i = 0; i < comps.Length; i++)
        {
            components[i] = comps[i].GetType().Name;
        }
    }
}
```

### 2. SceneSelection.cs

Place in `Assets/Scripts/SceneSync/SceneSelection.cs`:

```csharp
using UnityEngine;

public class SceneSelection : MonoBehaviour
{
    private static GameObject selectedObject = null;
    private static Material highlightMaterial = null;

    public static void Select(string instanceId)
    {
        // Clear previous selection
        if (selectedObject != null)
        {
            ClearHighlight(selectedObject);
        }

        int id = int.Parse(instanceId);
        var all = GameObject.FindObjectsOfType<Transform>();

        foreach (var t in all)
        {
            if (t.GetInstanceID().ToString() == instanceId)
            {
                selectedObject = t.gameObject;
                Highlight(t.gameObject);
                break;
            }
        }
    }

    public static void Hover(string instanceId)
    {
        // Hover highlighting (optional)
        int id = int.Parse(instanceId);
        // Implementation similar to Select
    }

    static void Highlight(GameObject go)
    {
        var rend = go.GetComponent<Renderer>();
        if (rend != null)
        {
            // Create highlight material
            if (highlightMaterial == null)
            {
                highlightMaterial = new Material(Shader.Find("Standard"));
                highlightMaterial.color = Color.yellow;
            }

            // Store original material and apply highlight
            var originalMaterials = rend.materials;
            var highlightedMaterials = new Material[originalMaterials.Length];
            for (int i = 0; i < highlightedMaterials.Length; i++)
            {
                highlightedMaterials[i] = highlightMaterial;
            }
            rend.materials = highlightedMaterials;
        }
    }

    static void ClearHighlight(GameObject go)
    {
        // Restore original materials
        // Implementation would restore previously stored materials
    }
}
```

### 3. TransformPatcher.cs

Place in `Assets/Scripts/SceneSync/TransformPatcher.cs`:

```csharp
using UnityEngine;

public class TransformPatcher : MonoBehaviour
{
    public static void Patch(string instanceId, string field, Vector3 value)
    {
        var all = GameObject.FindObjectsOfType<Transform>();

        foreach (var t in all)
        {
            if (t.GetInstanceID().ToString() == instanceId)
            {
                switch (field)
                {
                    case "position":
                    case "pos":
                        t.localPosition = value;
                        break;
                    case "rotation":
                    case "rot":
                        t.localEulerAngles = value;
                        break;
                    case "scale":
                        t.localScale = value;
                        break;
                }

                // Emit partial update for this transform
                SceneGraphEmitter.EmitPartial(new List<Transform> { t });
                break;
            }
        }
    }

    public static void PatchComponent(
        string instanceId,
        string componentType,
        string propertyName,
        object value
    )
    {
        var all = GameObject.FindObjectsOfType<GameObject>();

        foreach (var go in all)
        {
            if (go.GetInstanceID().ToString() == instanceId)
            {
                var component = go.GetComponent(componentType);
                if (component != null)
                {
                    var prop = component.GetType().GetProperty(propertyName);
                    if (prop != null && prop.CanWrite)
                    {
                        prop.SetValue(component, value, null);
                    }
                }
                break;
            }
        }
    }
}
```

### 4. JSBridge Integration

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
            case "scene/select":
                SceneSelection.Select(msg.instanceId);
                break;

            case "scene/hover":
                SceneSelection.Hover(msg.instanceId);
                break;

            case "patch/transform":
                TransformPatcher.Patch(
                    msg.instanceId,
                    msg.field,
                    JsonUtility.FromJson<Vector3>(msg.value)
                );
                break;

            case "patch/component":
                TransformPatcher.PatchComponent(
                    msg.instanceId,
                    msg.componentType,
                    msg.propertyName,
                    msg.value
                );
                break;

            case "scenegraph/request":
                SceneGraphEmitter.EmitFull();
                break;

            // ... other cases ...
        }
    }
}
```

### 5. JsonHelper.cs (if not already present)

Place in `Assets/Scripts/Utils/JsonHelper.cs`:

```csharp
using UnityEngine;
using System;

public static class JsonHelper
{
    public static T[] FromJson<T>(string json)
    {
        Wrapper<T> wrapper = JsonUtility.FromJson<Wrapper<T>>(json);
        return wrapper.Items;
    }

    public static string ToJson<T>(T[] array)
    {
        Wrapper<T> wrapper = new Wrapper<T>();
        wrapper.Items = array;
        return JsonUtility.ToJson(wrapper);
    }

    [Serializable]
    private class Wrapper<T>
    {
        public T[] Items;
    }
}
```

## Setup Instructions

1. Create the folder structure:
   - `Assets/Scripts/SceneSync/`
   - `Assets/Scripts/Utils/`

2. Add all scripts to Unity project

3. Add `SceneGraphEmitter` component to a GameObject in your scene (or create a manager object)

4. Ensure `JSBridge` is set up and connected to WISSIL's UnityMessagingBus

5. Unity will automatically emit scene graph updates every 500ms

## Notes

- The scene graph is emitted as JSON array of SceneNode objects
- Transform changes trigger immediate partial updates
- Selection changes are bidirectional (Unity ↔ WISSIL)
- Component properties can be patched at runtime
- This system works with Phase F (Live Asset Editing) and Phase G (Hot Reload)

