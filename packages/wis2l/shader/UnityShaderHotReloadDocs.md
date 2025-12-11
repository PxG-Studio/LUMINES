# Unity C# Integration for Shader Hot Reload

This document describes the Unity C# scripts needed for Phase Q - Full Node-Based Shader Editor.

## Required Unity Scripts

### 1. ShaderHotReload.cs

Place in `Assets/Scripts/Shaders/ShaderHotReload.cs`:

```csharp
using UnityEngine;

public class ShaderHotReload : MonoBehaviour
{
    public Material targetMaterial;

    public static void UpdateShader(string shaderText, string shaderName)
    {
        // Create a new shader from the text
        var shader = Shader.Find(shaderName);
        if (shader == null)
        {
            // Shader doesn't exist yet, we need to create it
            // Note: In WebGL builds, we cannot create shaders at runtime
            // This is a limitation - shaders must be precompiled
            
            Debug.LogWarning($"[ShaderHotReload] Shader {shaderName} not found. Shader hot reload in WebGL requires precompiled shaders.");
            return;
        }

        // Update material to use the shader
        var materials = GameObject.FindObjectsOfType<Renderer>();
        foreach (var renderer in materials)
        {
            if (renderer.material != null && renderer.material.shader.name == shaderName)
            {
                renderer.material.shader = shader;
                Debug.Log($"[ShaderHotReload] Updated material on {renderer.gameObject.name}");
            }
        }
    }

    public void UpdateShaderInstance(string shaderText)
    {
        if (targetMaterial == null) return;

        var shaderName = targetMaterial.shader.name;
        UpdateShader(shaderText, shaderName);
    }
}
```

### 2. ShaderLoader.cs (Alternative Approach)

For a more complete solution that works better with WebGL limitations:

```csharp
using UnityEngine;
using System.Collections;

public class ShaderLoader : MonoBehaviour
{
    public Material targetMaterial;

    // Load shader from Resources or AssetBundle
    public static Shader LoadShader(string shaderName)
    {
        // Option 1: Load from Resources
        var shader = Resources.Load<Shader>($"Shaders/{shaderName}");
        if (shader != null) return shader;

        // Option 2: Use built-in shader
        shader = Shader.Find(shaderName);
        return shader;
    }

    public static void ApplyShaderToMaterial(string shaderName, Material mat)
    {
        var shader = LoadShader(shaderName);
        if (shader != null)
        {
            mat.shader = shader;
        }
        else
        {
            Debug.LogError($"[ShaderLoader] Shader {shaderName} not found");
        }
    }
}
```

### 3. JSBridge Integration

Ensure your existing JSBridge.cs handles shader updates:

```csharp
public class JSBridge : MonoBehaviour
{
    // ... existing code ...

    void ReceiveMessage(string json)
    {
        var msg = JsonUtility.FromJson<JSMessage>(json);

        switch (msg.type)
        {
            case "shader/update":
                // Store shader code for next build
                // In WebGL, we cannot compile shaders at runtime
                // Instead, we save the shader code to a file
                SaveShaderCode(msg.text, msg.name);
                break;

            // ... other cases ...
        }
    }

    void SaveShaderCode(string shaderCode, string shaderName)
    {
        // Save to Application.persistentDataPath for next build
        // Or send back to WISSIL for compilation and asset bundle generation
        var path = System.IO.Path.Combine(Application.persistentDataPath, $"{shaderName}.shader");
        System.IO.File.WriteAllText(path, shaderCode);
        
        Debug.Log($"[JSBridge] Shader code saved to {path}");
        
        // In editor, we could compile it directly
        #if UNITY_EDITOR
        UnityEditor.AssetDatabase.Refresh();
        #endif
    }
}
```

## WebGL Limitations

**Important**: Unity WebGL has significant limitations for shader hot reloading:

1. **No Runtime Compilation**: Shaders cannot be compiled at runtime in WebGL builds
2. **Precompiled Shaders Only**: All shaders must be compiled during the build process
3. **No Shader.Create()**: Cannot create shaders dynamically

## Alternative Approaches

### Approach 1: Shader Variants
Use shader variants and switch between them at runtime:

```csharp
// In shader
#pragma multi_compile _ VARIANT_A VARIANT_B

// In C#
Material.EnableKeyword("VARIANT_A");
Material.DisableKeyword("VARIANT_B");
```

### Approach 2: Material Property Updates
Instead of changing shaders, update material properties:

```csharp
Material.SetColor("_Color", newColor);
Material.SetFloat("_Intensity", intensity);
```

### Approach 3: Asset Bundle System
1. Compile shader in WISSIL
2. Generate Unity shader file
3. Build asset bundle with shader
4. Load asset bundle in Unity WebGL
5. Apply shader from bundle

### Approach 4: Editor-Only Hot Reload
For development, use Unity Editor's shader hot reload:

1. Save shader file to Unity project
2. Unity Editor automatically recompiles
3. Materials using the shader update automatically

## Recommended Workflow

For Phase Q, we recommend:

1. **Development**: Use Unity Editor with hot reload
   - WISSIL generates shader file
   - File is saved to Unity project
   - Unity Editor automatically compiles
   - Materials update in real-time

2. **WebGL Preview**: Use shader variants or material properties
   - Generate shader variants for different configurations
   - Switch between variants at runtime
   - Or use material property updates for simple changes

3. **Production**: Precompile all shaders
   - Export all shader graphs before building
   - Include in Unity project
   - Build with all shaders precompiled

## Integration Notes

- Shader code generated by WISSIL is standard Unity ShaderLab
- Works with Unity 2021.3+ and all modern Unity versions
- Compatible with both Built-in and URP/HDRP (with modifications)
- Can be exported as `.shader` files for Unity project import

## Future Enhancements

- **Shader Variant System**: Generate variants for runtime switching
- **Material Parameter Mapping**: Map shader graph inputs to material properties
- **Asset Bundle Pipeline**: Automated shader bundle generation
- **URP/HDRP Support**: Generate URP/HDRP compatible shaders
- **Compute Shader Support**: Extend to compute shader generation

