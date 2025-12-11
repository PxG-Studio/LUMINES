# Unity C# Integration for UI Canvas Editor

This document describes the Unity C# scripts needed for Phase X - UI Canvas Editor.

## Required Unity Scripts

### 1. RectSnapshotEmitter.cs

Place in `Assets/Scripts/UI/RectSnapshotEmitter.cs`:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class RectSnapshotEmitter : MonoBehaviour
{
    private float lastUpdateTime = 0;
    private float updateInterval = 0.2f; // Update every 200ms

    void Update()
    {
        if (Time.time - lastUpdateTime < updateInterval) return;

        var rects = GameObject.FindObjectsOfType<RectTransform>();
        List<RectSnapshot> list = new List<RectSnapshot>();

        foreach (var r in rects)
        {
            var s = new RectSnapshot();
            s.id = r.GetInstanceID().ToString();
            s.name = r.gameObject.name;
            s.position = r.anchoredPosition;
            s.size = r.sizeDelta;
            s.anchorMin = r.anchorMin;
            s.anchorMax = r.anchorMax;
            s.pivot = r.pivot;

            // Parent/child relationships
            if (r.parent != null && r.parent is RectTransform)
            {
                s.parent = r.parent.GetInstanceID().ToString();
            }

            list.Add(s);
        }

        string json = JsonHelper.ToJson(list.ToArray());
        JSBridge.SendToJS("ui/rectsnapshot", json);

        lastUpdateTime = Time.time;
    }
}

[System.Serializable]
public class RectSnapshot
{
    public string id;
    public string name;
    public Vector2 position;
    public Vector2 size;
    public Vector2 anchorMin;
    public Vector2 anchorMax;
    public Vector2 pivot;
    public string parent;
}
```

### 2. CanvasPatcherHandler.cs

Place in `Assets/Scripts/UI/CanvasPatcherHandler.cs`:

```csharp
using UnityEngine;
using UnityEngine.UI;

public class CanvasPatcherHandler : MonoBehaviour
{
    public static void Patch(string json)
    {
        var p = JsonUtility.FromJson<PatchPayload>(json);
        int id = int.Parse(p.id);
        var rects = GameObject.FindObjectsOfType<RectTransform>();

        foreach (var r in rects)
        {
            if (r.GetInstanceID().ToString() != p.id)
                continue;

            // Position updates
            if (p.field == "position")
            {
                var pos = JsonUtility.FromJson<Vector2>(p.value.ToString());
                r.anchoredPosition = pos;
            }

            // Size updates
            if (p.field == "size")
            {
                var size = JsonUtility.FromJson<Vector2>(p.value.ToString());
                r.sizeDelta = size;
            }

            // Anchor Min updates
            if (p.field == "anchorMin")
            {
                var anchorMin = JsonUtility.FromJson<Vector2>(p.value.ToString());
                r.anchorMin = anchorMin;
            }

            // Anchor Max updates
            if (p.field == "anchorMax")
            {
                var anchorMax = JsonUtility.FromJson<Vector2>(p.value.ToString());
                r.anchorMax = anchorMax;
            }

            // Pivot updates
            if (p.field == "pivot")
            {
                var pivot = JsonUtility.FromJson<Vector2>(p.value.ToString());
                r.pivot = pivot;
            }
        }
    }

    public static void ApplyAnchorPreset(string json)
    {
        var data = JsonUtility.FromJson<AnchorPresetPayload>(json);
        int id = int.Parse(data.id);
        var rects = GameObject.FindObjectsOfType<RectTransform>();

        foreach (var r in rects)
        {
            if (r.GetInstanceID().ToString() != data.id)
                continue;

            // Apply preset based on name
            switch (data.preset.ToLower())
            {
                case "stretch":
                case "stretch all":
                    r.anchorMin = new Vector2(0, 0);
                    r.anchorMax = new Vector2(1, 1);
                    r.offsetMin = Vector2.zero;
                    r.offsetMax = Vector2.zero;
                    break;

                case "top left":
                    r.anchorMin = new Vector2(0, 1);
                    r.anchorMax = new Vector2(0, 1);
                    r.pivot = new Vector2(0, 1);
                    break;

                case "top right":
                    r.anchorMin = new Vector2(1, 1);
                    r.anchorMax = new Vector2(1, 1);
                    r.pivot = new Vector2(1, 1);
                    break;

                case "bottom left":
                    r.anchorMin = new Vector2(0, 0);
                    r.anchorMax = new Vector2(0, 0);
                    r.pivot = new Vector2(0, 0);
                    break;

                case "bottom right":
                    r.anchorMin = new Vector2(1, 0);
                    r.anchorMax = new Vector2(1, 0);
                    r.pivot = new Vector2(1, 0);
                    break;

                case "full center":
                    r.anchorMin = new Vector2(0.5f, 0.5f);
                    r.anchorMax = new Vector2(0.5f, 0.5f);
                    r.pivot = new Vector2(0.5f, 0.5f);
                    break;

                // Additional presets...
            }

            // If custom config provided, use it
            if (data.config != null)
            {
                // Apply custom anchor config
            }
        }
    }

    public static void ApplyLayout(string json)
    {
        var data = JsonUtility.FromJson<LayoutPayload>(json);
        int id = int.Parse(data.id);
        var rects = GameObject.FindObjectsOfType<RectTransform>();

        foreach (var r in rects)
        {
            if (r.GetInstanceID().ToString() != data.id)
                continue;

            // Remove existing layout groups
            var existingHorizontal = r.GetComponent<HorizontalLayoutGroup>();
            var existingVertical = r.GetComponent<VerticalLayoutGroup>();
            var existingGrid = r.GetComponent<GridLayoutGroup>();

            if (existingHorizontal) Destroy(existingHorizontal);
            if (existingVertical) Destroy(existingVertical);
            if (existingGrid) Destroy(existingGrid);

            // Apply new layout
            switch (data.config.type.ToLower())
            {
                case "horizontal":
                    var h = r.gameObject.AddComponent<HorizontalLayoutGroup>();
                    h.spacing = data.config.spacing;
                    if (data.config.padding != null)
                    {
                        h.padding = new RectOffset(
                            data.config.padding.left,
                            data.config.padding.right,
                            data.config.padding.top,
                            data.config.padding.bottom
                        );
                    }
                    break;

                case "vertical":
                    var v = r.gameObject.AddComponent<VerticalLayoutGroup>();
                    v.spacing = data.config.spacing;
                    if (data.config.padding != null)
                    {
                        v.padding = new RectOffset(
                            data.config.padding.left,
                            data.config.padding.right,
                            data.config.padding.top,
                            data.config.padding.bottom
                        );
                    }
                    break;

                case "grid":
                    var g = r.gameObject.AddComponent<GridLayoutGroup>();
                    g.spacing = new Vector2(data.config.spacingX, data.config.spacingY);
                    if (data.config.cellSize != null)
                    {
                        g.cellSize = data.config.cellSize;
                    }
                    break;
            }
        }
    }

    public static void UpdateStyle(string json)
    {
        var data = JsonUtility.FromJson<StylePayload>(json);
        int id = int.Parse(data.rectId);
        var rects = GameObject.FindObjectsOfType<RectTransform>();

        foreach (var r in rects)
        {
            if (r.GetInstanceID().ToString() != data.rectId)
                continue;

            // Update Image color
            var image = r.GetComponent<Image>();
            if (image != null && data.style.ContainsKey("backgroundColor"))
            {
                Color color;
                if (ColorUtility.TryParseHtmlString(data.style["backgroundColor"], out color))
                {
                    image.color = color;
                }
            }

            // Update TextMeshPro
            var text = r.GetComponent<TMPro.TextMeshProUGUI>();
            if (text != null)
            {
                if (data.style.ContainsKey("textColor"))
                {
                    Color color;
                    if (ColorUtility.TryParseHtmlString(data.style["textColor"], out color))
                    {
                        text.color = color;
                    }
                }
                if (data.style.ContainsKey("fontSize"))
                {
                    text.fontSize = float.Parse(data.style["fontSize"]);
                }
                if (data.style.ContainsKey("fontFamily"))
                {
                    // Load font resource
                }
            }
        }
    }
}

[System.Serializable]
public class PatchPayload
{
    public string id;
    public string field;
    public object value;
}

[System.Serializable]
public class AnchorPresetPayload
{
    public string id;
    public string preset;
    public object config;
}

[System.Serializable]
public class LayoutPayload
{
    public string id;
    public LayoutConfigData config;
}

[System.Serializable]
public class LayoutConfigData
{
    public string type;
    public float spacing;
    public float spacingX;
    public float spacingY;
    public PaddingData padding;
    public Vector2 cellSize;
}

[System.Serializable]
public class PaddingData
{
    public int left;
    public int right;
    public int top;
    public int bottom;
}

[System.Serializable]
public class StylePayload
{
    public string rectId;
    public Dictionary<string, string> style;
}
```

### 3. PreviewResolutionHandler.cs

Place in `Assets/Scripts/UI/PreviewResolutionHandler.cs`:

```csharp
using UnityEngine;
using UnityEngine.UI;

public class PreviewResolutionHandler : MonoBehaviour
{
    public static void SetPreviewResolution(string json)
    {
        var data = JsonUtility.FromJson<PreviewResolutionData>(json);
        var canvases = GameObject.FindObjectsOfType<Canvas>();

        foreach (var canvas in canvases)
        {
            var scaler = canvas.GetComponent<CanvasScaler>();
            if (scaler != null)
            {
                scaler.referenceResolution = new Vector2(data.width, data.height);
            }
        }
    }
}

[System.Serializable]
public class PreviewResolutionData
{
    public int width;
    public int height;
    public string resolution;
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
            case "ui/patch":
                CanvasPatcherHandler.Patch(msg.payload);
                break;

            case "ui/applyAnchorPreset":
                CanvasPatcherHandler.ApplyAnchorPreset(msg.payload);
                break;

            case "ui/applyLayout":
                CanvasPatcherHandler.ApplyLayout(msg.payload);
                break;

            case "ui/style":
                CanvasPatcherHandler.UpdateStyle(msg.payload);
                break;

            case "ui/preview":
                PreviewResolutionHandler.SetPreviewResolution(msg.payload);
                break;

            // ... other cases ...
        }
    }
}
```

## Setup Instructions

1. Create the folder structure:
   - `Assets/Scripts/UI/`

2. Add scripts to Unity project

3. Add `RectSnapshotEmitter` component to a manager GameObject in your scene

4. UI rect snapshots will sync automatically to WISSIL every 200ms

5. UI edits from WISSIL will apply in real-time to Unity

## Notes

- RectTransform snapshots are emitted every 200ms
- Layout changes apply immediately
- Style updates require Image/TextMeshPro components
- Anchor presets are applied instantly
- Preview resolution changes affect CanvasScaler

This system integrates with:
- Phase K (Scene Graph) for object selection
- Phase F/G (Hot Reload) for live updates
- Phase R (Gizmos) for visual manipulation
- Phase W (Audio) for UI sound feedback

