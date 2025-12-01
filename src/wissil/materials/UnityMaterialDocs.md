# Unity C# Integration for Material/Shader Inspector

This document describes the Unity C# scripts needed for Phase N - Unity Material/Shader Inspector.

## Required Unity Scripts

### 1. MaterialSnapshotEmitter.cs

Place in `Assets/Scripts/Materials/MaterialSnapshotEmitter.cs`:

```csharp
using UnityEngine;
using System.Collections.Generic;
#if UNITY_EDITOR
using UnityEditor;
#endif

public class MaterialSnapshotEmitter : MonoBehaviour
{
    public static void Emit(GameObject obj)
    {
        var renderer = obj.GetComponent<Renderer>();
        if (!renderer || !renderer.material) return;

        var mat = renderer.material;
        var props = new List<MaterialParam>();

        Shader shader = mat.shader;
        
        #if UNITY_EDITOR
        int propCount = ShaderUtil.GetPropertyCount(shader);

        for (int i = 0; i < propCount; i++)
        {
            string name = ShaderUtil.GetPropertyName(shader, i);
            var type = ShaderUtil.GetPropertyType(shader, i);

            props.Add(new MaterialParam
            {
                name = name,
                type = type.ToString(),
                value = GetParamValue(mat, name, type)
            });
        }
        #else
        // Runtime fallback - manually check common properties
        if (mat.HasProperty("_Color"))
        {
            props.Add(new MaterialParam
            {
                name = "_Color",
                type = "Color",
                value = mat.GetColor("_Color")
            });
        }
        if (mat.HasProperty("_MainTex"))
        {
            var tex = mat.GetTexture("_MainTex");
            props.Add(new MaterialParam
            {
                name = "_MainTex",
                type = "TexEnv",
                value = tex ? tex.name : ""
            });
        }
        if (mat.HasProperty("_Metallic"))
        {
            props.Add(new MaterialParam
            {
                name = "_Metallic",
                type = "Float",
                value = mat.GetFloat("_Metallic")
            });
        }
        if (mat.HasProperty("_Smoothness"))
        {
            props.Add(new MaterialParam
            {
                name = "_Smoothness",
                type = "Float",
                value = mat.GetFloat("_Smoothness")
            });
        }
        #endif

        var snapshot = new MaterialSnapshot
        {
            objectId = obj.GetInstanceID().ToString(),
            materialName = mat.name,
            shaderName = shader.name,
            parameters = props.ToArray(),
        };

        string json = JsonUtility.ToJson(snapshot);
        JSBridge.SendToJS("material/snapshot", json);
    }

    static object GetParamValue(Material mat, string name, ShaderUtil.ShaderPropertyType type)
    {
        switch (type)
        {
            case ShaderUtil.ShaderPropertyType.Color:
                return new ColorWrapper { r = mat.GetColor(name).r, g = mat.GetColor(name).g, b = mat.GetColor(name).b, a = mat.GetColor(name).a };
            case ShaderUtil.ShaderPropertyType.Float:
            case ShaderUtil.ShaderPropertyType.Range:
                return mat.GetFloat(name);
            case ShaderUtil.ShaderPropertyType.Vector:
                var v = mat.GetVector(name);
                return new Vector4Wrapper { x = v.x, y = v.y, z = v.z, w = v.w };
            case ShaderUtil.ShaderPropertyType.TexEnv:
                var tex = mat.GetTexture(name);
                return tex ? tex.name : "";
            case ShaderUtil.ShaderPropertyType.Int:
                return mat.GetInt(name);
        }
        return null;
    }
}

[System.Serializable]
public class MaterialParam
{
    public string name;
    public string type;
    public object value;
}

[System.Serializable]
public class MaterialSnapshot
{
    public string objectId;
    public string materialName;
    public string shaderName;
    public MaterialParam[] parameters;
}

[System.Serializable]
public class ColorWrapper
{
    public float r, g, b, a;
}

[System.Serializable]
public class Vector4Wrapper
{
    public float x, y, z, w;
}
```

### 2. MaterialPatcher.cs

Place in `Assets/Scripts/Materials/MaterialPatcher.cs`:

```csharp
using UnityEngine;

public class MaterialPatcher : MonoBehaviour
{
    public static void Patch(string json)
    {
        try
        {
            var payload = JsonUtility.FromJson<MaterialPatchPayload>(json);
            
            int objectId = int.Parse(payload.objectId);
            var renderers = GameObject.FindObjectsOfType<Renderer>();

            foreach (var r in renderers)
            {
                if (r.gameObject.GetInstanceID() == objectId)
                {
                    var mat = r.material;

                    switch (payload.paramType)
                    {
                        case "Float":
                        case "Range":
                            if (mat.HasProperty(payload.paramName))
                            {
                                mat.SetFloat(payload.paramName, float.Parse(payload.value.ToString()));
                            }
                            break;

                        case "Color":
                            if (mat.HasProperty(payload.paramName))
                            {
                                var color = JsonUtility.FromJson<ColorWrapper>(payload.value.ToString());
                                mat.SetColor(payload.paramName, new Color(color.r, color.g, color.b, color.a));
                            }
                            break;

                        case "Vector":
                            if (mat.HasProperty(payload.paramName))
                            {
                                var vec = JsonUtility.FromJson<Vector4Wrapper>(payload.value.ToString());
                                mat.SetVector(payload.paramName, new Vector4(vec.x, vec.y, vec.z, vec.w));
                            }
                            break;

                        case "Int":
                            if (mat.HasProperty(payload.paramName))
                            {
                                mat.SetInt(payload.paramName, int.Parse(payload.value.ToString()));
                            }
                            break;
                    }

                    break;
                }
            }
        }
        catch (System.Exception e)
        {
            Debug.LogError($"[MaterialPatcher] Error: {e.Message}");
        }
    }
}

[System.Serializable]
public class MaterialPatchPayload
{
    public string objectId;
    public string paramName;
    public string paramType;
    public object value;
}
```

### 3. MaterialPreviewRenderer.cs

Place in `Assets/Scripts/Materials/MaterialPreviewRenderer.cs`:

```csharp
using UnityEngine;

public class MaterialPreviewRenderer : MonoBehaviour
{
    public Camera previewCamera;
    public GameObject previewSphere;
    private Texture2D renderTexture;
    private RenderTexture rt;

    void Start()
    {
        renderTexture = new Texture2D(256, 256, TextureFormat.RGB24, false);
        rt = new RenderTexture(256, 256, 24);
        
        if (previewCamera != null)
        {
            previewCamera.targetTexture = rt;
        }
    }

    public static void RenderPreview(string objectId, string materialName)
    {
        var renderer = FindObjectOfType<MaterialPreviewRenderer>();
        if (renderer == null)
        {
            Debug.LogWarning("[MaterialPreviewRenderer] Instance not found");
            return;
        }

        renderer.DoRenderPreview(objectId, materialName);
    }

    void DoRenderPreview(string objectId, string materialName)
    {
        // Find the material
        int id = int.Parse(objectId);
        var allRenderers = GameObject.FindObjectsOfType<Renderer>();

        Material targetMaterial = null;
        foreach (var r in allRenderers)
        {
            if (r.gameObject.GetInstanceID() == id && r.material != null)
            {
                targetMaterial = r.material;
                break;
            }
        }

        if (targetMaterial == null || previewSphere == null || previewCamera == null)
        {
            Debug.LogWarning("[MaterialPreviewRenderer] Missing components");
            return;
        }

        // Apply material to preview sphere
        previewSphere.GetComponent<Renderer>().material = targetMaterial;

        // Render
        previewCamera.Render();

        // Read pixels
        RenderTexture.active = rt;
        renderTexture.ReadPixels(new Rect(0, 0, 256, 256), 0, 0);
        renderTexture.Apply();
        RenderTexture.active = null;

        // Encode to base64
        byte[] bytes = renderTexture.EncodeToPNG();
        string base64 = System.Convert.ToBase64String(bytes);

        // Send to WISSIL
        JSBridge.SendToJS("material/preview", base64);
    }

    void OnDestroy()
    {
        if (rt != null)
        {
            rt.Release();
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
            case "material/request":
                var objId = msg.objectId;
                var obj = FindObjectByInstanceID(int.Parse(objId));
                if (obj != null)
                {
                    MaterialSnapshotEmitter.Emit(obj);
                }
                break;

            case "material/requestPreview":
                MaterialPreviewRenderer.RenderPreview(msg.objectId, msg.materialName);
                break;

            case "material/patch":
                MaterialPatcher.Patch(json);
                break;

            // ... other cases ...
        }
    }

    GameObject FindObjectByInstanceID(int id)
    {
        var all = GameObject.FindObjectsOfType<Transform>();
        foreach (var t in all)
        {
            if (t.gameObject.GetInstanceID() == id)
            {
                return t.gameObject;
            }
        }
        return null;
    }
}
```

## Setup Instructions

1. Create the folder structure:
   - `Assets/Scripts/Materials/`

2. Add all scripts to Unity project

3. Create preview camera and sphere:
   - Create a new Camera (set as child of a GameObject, disable audio listener)
   - Create a sphere GameObject for preview rendering
   - Add `MaterialPreviewRenderer` component to a manager GameObject
   - Assign previewCamera and previewSphere references

4. Material snapshots are automatically emitted when objects are selected in WISSIL scene graph

5. Material previews are rendered on-demand when requested

## Notes

- Material patching works in real-time via Phase F (Live Asset Editing)
- Shader property introspection uses Unity Editor API when available
- Runtime fallback checks common shader properties manually
- Material previews are rendered at 256x256 resolution
- This system integrates with Phase K (Scene Graph) for object selection

