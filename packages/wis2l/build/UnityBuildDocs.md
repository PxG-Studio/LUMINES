# Unity-Side Build Integration

This document describes the Unity C# scripts and setup needed for incremental builds.

## Required Unity Scripts

### 1. IncrementalAssetBundleBuilder.cs

Place in `Assets/Editor/IncrementalAssetBundleBuilder.cs`:

```csharp
using UnityEditor;
using UnityEngine;
using System.IO;
using System.Linq;

public class IncrementalAssetBundleBuilder
{
    [MenuItem("WISSIL/Build Changed Bundles")]
    public static void BuildChangedBundles()
    {
        // This would be called from WISSIL via Unity CLI
        // For now, it's a menu item for testing
        Debug.Log("[IncrementalAssetBundleBuilder] Building changed bundles...");
    }

    public static void BuildChangedBundles(string outputPath, string[] changedAssets)
    {
        if (changedAssets == null || changedAssets.Length == 0)
        {
            Debug.Log("[IncrementalAssetBundleBuilder] No changed assets");
            return;
        }

        var bundleBuilds = new AssetBundleBuild[changedAssets.Length];

        for (int i = 0; i < changedAssets.Length; i++)
        {
            string asset = changedAssets[i];
            
            // Skip if asset doesn't exist
            if (!File.Exists(asset))
            {
                Debug.LogWarning($"[IncrementalAssetBundleBuilder] Asset not found: {asset}");
                continue;
            }

            string bundleName = Path.GetFileNameWithoutExtension(asset).ToLower();
            bundleBuilds[i] = new AssetBundleBuild
            {
                assetNames = new[] { asset },
                assetBundleName = bundleName
            };
        }

        // Ensure output directory exists
        if (!Directory.Exists(outputPath))
        {
            Directory.CreateDirectory(outputPath);
        }

        BuildPipeline.BuildAssetBundles(
            outputPath,
            bundleBuilds,
            BuildAssetBundleOptions.ChunkBasedCompression,
            BuildTarget.WebGL
        );

        Debug.Log($"[IncrementalAssetBundleBuilder] Built {bundleBuilds.Length} bundles to {outputPath}");
    }
}
```

### 2. Unity CLI Integration

To call Unity from WISSIL, you would use Unity's command-line interface:

```bash
Unity.exe -batchmode -quit -projectPath "path/to/project" -executeMethod IncrementalAssetBundleBuilder.BuildChangedBundles -outputPath "path/to/output" -assets "asset1,asset2"
```

Or use Unity Cloud Build API for remote builds.

### 3. IL2CPP Patch Loader (Phase G Integration)

The IL2CPP patch layer uses the BehaviorOverride system from Phase G. No additional Unity scripts needed - it uses the existing `JSBridge.cs` and `BehaviorOverride.cs`.

## Build Cache Structure

The build cache should be structured as:

```
.wissil/cache/unity-build/
  manifest.json
  bundles/
    card1
    card2
    texture1
  template/
    index.html
    UnityLoader.js
  il2cpp/
    patches/
  linker/
  player/
```

## Integration Notes

- The build system works best when Unity is running in headless mode
- Asset bundles can be loaded at runtime via `AssetBundle.LoadFromFile()`
- The cache manifest tracks which files have been built
- Fingerprint hashing ensures only changed files trigger rebuilds

