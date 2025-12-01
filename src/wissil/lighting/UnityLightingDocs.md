# Unity C# Integration for Lighting Editor

This document describes the Unity C# scripts needed for Phase V - Lighting Editor.

## Required Unity Scripts

### 1. LightSnapshotEmitter.cs

Place in `Assets/Scripts/Lighting/LightSnapshotEmitter.cs`:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class LightSnapshotEmitter : MonoBehaviour
{
    private float lastUpdateTime = 0;
    private float updateInterval = 0.2f; // Update every 200ms

    void Update()
    {
        if (Time.time - lastUpdateTime < updateInterval) return;

        Light[] lights = GameObject.FindObjectsOfType<Light>();
        List<LightSnapshot> snaps = new List<LightSnapshot>();

        foreach (var l in lights)
        {
            var s = new LightSnapshot();
            s.id = l.gameObject.GetInstanceID().ToString();
            s.name = l.gameObject.name;
            s.type = l.type.ToString();
            s.color = new ColorWrapper
            {
                r = l.color.r,
                g = l.color.g,
                b = l.color.b,
                a = l.color.a
            };
            s.intensity = l.intensity;
            s.range = l.range;
            s.spotAngle = l.spotAngle;
            s.position = new Vector3Wrapper
            {
                x = l.transform.position.x,
                y = l.transform.position.y,
                z = l.transform.position.z
            };
            s.rotation = new Vector3Wrapper
            {
                x = l.transform.rotation.eulerAngles.x,
                y = l.transform.rotation.eulerAngles.y,
                z = l.transform.rotation.eulerAngles.z
            };
            s.shadows = l.shadows.ToString();
            s.shadowStrength = l.shadowStrength;

            snaps.Add(s);
        }

        string json = JsonHelper.ToJson(snaps.ToArray());
        JSBridge.SendToJS("lighting/snapshot", json);

        lastUpdateTime = Time.time;
    }
}

[System.Serializable]
public class LightSnapshot
{
    public string id;
    public string name;
    public string type;
    public ColorWrapper color;
    public float intensity;
    public float range;
    public float spotAngle;
    public Vector3Wrapper position;
    public Vector3Wrapper rotation;
    public string shadows;
    public float shadowStrength;
}

[System.Serializable]
public class ColorWrapper
{
    public float r, g, b, a;
}

[System.Serializable]
public class Vector3Wrapper
{
    public float x, y, z;
}
```

### 2. LightPatcherHandler.cs

Place in `Assets/Scripts/Lighting/LightPatcherHandler.cs`:

```csharp
using UnityEngine;

public class LightPatcherHandler : MonoBehaviour
{
    public static void Patch(string json)
    {
        var payload = JsonUtility.FromJson<PatchPayload>(json);
        int id = int.Parse(payload.id);

        var lights = GameObject.FindObjectsOfType<Light>();
        foreach (var l in lights)
        {
            if (l.gameObject.GetInstanceID() == id)
            {
                ApplyPatch(l, payload.field, payload.value);
                break;
            }
        }
    }

    public static void Create(string type, Vector3Wrapper position)
    {
        var go = new GameObject($"Light_{type}_{Time.time}");
        var light = go.AddComponent<Light>();
        var pos = new Vector3(position.x, position.y, position.z);
        go.transform.position = pos;

        switch (type)
        {
            case "Directional":
                light.type = LightType.Directional;
                light.transform.rotation = Quaternion.Euler(50, -30, 0);
                light.intensity = 1.5f;
                break;
            case "Point":
                light.type = LightType.Point;
                light.range = 10f;
                light.intensity = 1f;
                break;
            case "Spot":
                light.type = LightType.Spot;
                light.range = 10f;
                light.spotAngle = 30f;
                light.intensity = 1f;
                break;
        }
    }

    public static void Delete(string id)
    {
        int instanceId = int.Parse(id);
        var lights = GameObject.FindObjectsOfType<Light>();
        foreach (var l in lights)
        {
            if (l.gameObject.GetInstanceID() == instanceId)
            {
                Destroy(l.gameObject);
                break;
            }
        }
    }

    private static void ApplyPatch(Light light, string field, string value)
    {
        switch (field)
        {
            case "color":
                var c = JsonUtility.FromJson<ColorWrapper>(value);
                light.color = new Color(c.r, c.g, c.b, c.a);
                break;
            case "intensity":
                light.intensity = float.Parse(value);
                break;
            case "range":
                light.range = float.Parse(value);
                break;
            case "spotAngle":
                light.spotAngle = float.Parse(value);
                break;
            case "shadows":
                light.shadows = (LightShadows)System.Enum.Parse(typeof(LightShadows), value);
                break;
            case "shadowStrength":
                light.shadowStrength = float.Parse(value);
                break;
        }
    }
}

[System.Serializable]
public class PatchPayload
{
    public string id;
    public string field;
    public string value;
}
```

### 3. AmbientLightingHandler.cs

Place in `Assets/Scripts/Lighting/AmbientLightingHandler.cs`:

```csharp
using UnityEngine;

public class AmbientLightingHandler : MonoBehaviour
{
    public static void UpdateAmbient(string json)
    {
        var data = JsonUtility.FromJson<AmbientData>(json);

        if (data.ambientIntensity != null)
        {
            RenderSettings.ambientIntensity = (float)data.ambientIntensity;
        }

        if (data.ambientColor != null)
        {
            RenderSettings.ambientLight = new Color(
                data.ambientColor.r,
                data.ambientColor.g,
                data.ambientColor.b
            );
        }
    }

    public static void UpdateSkybox(string json)
    {
        var data = JsonUtility.FromJson<SkyboxData>(json);

        if (RenderSettings.skybox != null)
        {
            if (data.tint != null)
            {
                RenderSettings.skybox.SetColor("_Tint", new Color(
                    data.tint.r,
                    data.tint.g,
                    data.tint.b
                ));
            }

            if (data.exposure != null)
            {
                RenderSettings.skybox.SetFloat("_Exposure", (float)data.exposure);
            }
        }
    }
}

[System.Serializable]
public class AmbientData
{
    public float? ambientIntensity;
    public ColorWrapper ambientColor;
}

[System.Serializable]
public class SkyboxData
{
    public ColorWrapper tint;
    public float? exposure;
}
```

### 4. ShadowSettingsHandler.cs

Place in `Assets/Scripts/Lighting/ShadowSettingsHandler.cs`:

```csharp
using UnityEngine;

public class ShadowSettingsHandler : MonoBehaviour
{
    public static void UpdateShadows(string json)
    {
        var data = JsonUtility.FromJson<ShadowData>(json);

        if (data.shadowDistance != null)
        {
            QualitySettings.shadowDistance = (float)data.shadowDistance;
        }

        if (data.shadowResolution != null)
        {
            QualitySettings.shadowResolution = ParseShadowResolution(data.shadowResolution);
        }

        if (data.shadowCascades != null)
        {
            QualitySettings.shadowCascades = (ShadowQuality)data.shadowCascades;
        }
    }

    private static ShadowResolution ParseShadowResolution(string res)
    {
        switch (res.ToLower())
        {
            case "low": return ShadowResolution.Low;
            case "medium": return ShadowResolution.Medium;
            case "high": return ShadowResolution.High;
            case "veryhigh": return ShadowResolution.VeryHigh;
            default: return ShadowResolution.High;
        }
    }
}

[System.Serializable]
public class ShadowData
{
    public float? shadowDistance;
    public string shadowResolution;
    public int? shadowCascades;
}
```

### 5. GIHandler.cs

Place in `Assets/Scripts/Lighting/GIHandler.cs`:

```csharp
using UnityEngine;

public class GIHandler : MonoBehaviour
{
    public static void UpdateGI(string json)
    {
        var data = JsonUtility.FromJson<GIData>(json);

        #if UNITY_EDITOR
        if (data.realtimeGI != null)
        {
            LightmapSettings.lightmapsMode = data.realtimeGI.Value
                ? LightmapsMode.CombinedDirectional
                : LightmapsMode.NonDirectional;
        }

        if (data.bakedGI != null)
        {
            // Baked GI requires lightmap baking
            // This is typically done in Unity Editor
            Debug.Log("[GIHandler] Baked GI requires Unity Editor lightmap baking");
        }
        #else
        Debug.Log("[GIHandler] GI settings can only be modified in Unity Editor");
        #endif
    }
}

[System.Serializable]
public class GIData
{
    public bool? realtimeGI;
    public bool? bakedGI;
}
```

### 6. ToneMappingHandler.cs

Place in `Assets/Scripts/Lighting/ToneMappingHandler.cs`:

```csharp
using UnityEngine;

public class ToneMappingHandler : MonoBehaviour
{
    // Note: Full tone mapping requires PostProcessing stack or URP/HDRP
    // This is a simplified implementation

    public static void UpdateToneMapping(string json)
    {
        var data = JsonUtility.FromJson<ToneMappingData>(json);

        // Update camera exposure if available
        var cameras = GameObject.FindObjectsOfType<Camera>();
        foreach (var cam in cameras)
        {
            // Exposure can be set via camera component in URP/HDRP
            // For built-in pipeline, this would require PostProcessing stack
            Debug.Log($"[ToneMappingHandler] Tone mapping mode: {data.mode}, Exposure: {data.exposure}");
        }
    }
}

[System.Serializable]
public class ToneMappingData
{
    public string mode;
    public float exposure;
}
```

### 7. JSBridge Integration

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
            case "light/patch":
                LightPatcherHandler.Patch(json);
                break;

            case "light/create":
                var createData = JsonUtility.FromJson<CreateLightData>(json);
                LightPatcherHandler.Create(createData.type, createData.position);
                break;

            case "light/delete":
                LightPatcherHandler.Delete(msg.id);
                break;

            case "lighting/ambient":
                AmbientLightingHandler.UpdateAmbient(json);
                break;

            case "lighting/skybox":
                AmbientLightingHandler.UpdateSkybox(json);
                break;

            case "lighting/shadows":
                ShadowSettingsHandler.UpdateShadows(json);
                break;

            case "lighting/gi":
                GIHandler.UpdateGI(json);
                break;

            case "lighting/tonemap":
                ToneMappingHandler.UpdateToneMapping(json);
                break;

            // ... other cases ...
        }
    }
}
```

## Setup Instructions

1. Create the folder structure:
   - `Assets/Scripts/Lighting/`

2. Add all scripts to Unity project

3. Add `LightSnapshotEmitter` component to a manager GameObject

4. Lights will automatically be detected and synced to WISSIL

## Notes

- Light snapshots are emitted every 200ms for performance
- Light properties update in real-time
- Ambient and skybox settings apply immediately
- Shadow settings affect QualitySettings
- GI settings require Unity Editor for full functionality
- Tone mapping may require PostProcessing stack or URP/HDRP

This system integrates with:
- Phase K (Scene Graph) for object selection
- Phase R (Gizmos) for transform manipulation
- Phase N (Materials) for material updates
- Phase F/G (Hot Reload) for live updates

