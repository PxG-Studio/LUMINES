# Unity-Side Hot Reload Implementation

This document describes the Unity C# scripts needed to support hot reload functionality.

## Required Unity Scripts

### 1. BehaviorOverride.cs

```csharp
using UnityEngine;
using System;

public class BehaviorOverride : MonoBehaviour
{
    public static Func<string, string, string> JSOverride = null;

    public static string Call(string methodName, string jsonArgs)
    {
        if (JSOverride != null)
        {
            try
            {
                string result = JSOverride(methodName, jsonArgs);
                if (result != null && result != "null")
                {
                    return result; // JS override returned a value
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"[BehaviorOverride] JS override error for {methodName}: {e}");
            }
        }

        return null; // Fall back to default C# handler
    }
}
```

### 2. ConfigLoader.cs

```csharp
using UnityEngine;
using System.Collections.Generic;

public class ConfigLoader : MonoBehaviour
{
    private static Dictionary<string, JSONObject> configs = new Dictionary<string, JSONObject>();

    public static void Load(string path, string json)
    {
        try
        {
            JSONObject config = new JSONObject(json);
            configs[path] = config;
            Debug.Log($"[ConfigLoader] Loaded config: {path}");
        }
        catch (Exception e)
        {
            Debug.LogError($"[ConfigLoader] Error loading {path}: {e}");
        }
    }

    public static JSONObject Get(string path)
    {
        return configs.ContainsKey(path) ? configs[path] : null;
    }
}
```

### 3. SOPatch.cs

```csharp
using UnityEngine;

public class SOPatch : ScriptableObject
{
    public virtual void Patch(string json)
    {
        JsonUtility.FromJsonOverwrite(json, this);
        Debug.Log($"[SOPatch] Patched {name}");
    }
}
```

### 4. HotReloadDispatcher.cs

```csharp
using UnityEngine;

public class HotReloadDispatcher : MonoBehaviour
{
    void Start()
    {
        // Set up JS bridge
        if (Application.platform == RuntimePlatform.WebGLPlayer)
        {
            // Make BehaviorOverride accessible from JS
            BehaviorOverride.JSOverride = (method, args) =>
            {
                try
                {
                    if (Application.ExternalCall != null)
                    {
                        return Application.ExternalCall("BehaviorOverride.call", method, args) as string;
                    }
                }
                catch (Exception e)
                {
                    Debug.LogError($"[HotReloadDispatcher] Error calling JS override: {e}");
                }
                return null;
            };
        }
    }

    public void ReceiveMessage(string json)
    {
        try
        {
            JSMessage msg = JsonUtility.FromJson<JSMessage>(json);

            switch (msg.type)
            {
                case "registerOverride":
                    Debug.Log($"[HotReloadDispatcher] Registered override: {msg.payload.methodName}");
                    break;

                case "configUpdate":
                    ConfigLoader.Load(msg.payload.path, msg.payload.content);
                    break;

                case "patchSO":
                    var so = Resources.Load<ScriptableObject>(msg.payload.name);
                    if (so != null && so is SOPatch)
                    {
                        (so as SOPatch).Patch(msg.payload.json);
                    }
                    break;

                case "captureResult":
                    // Handle capture result from ShadowVM
                    Debug.Log($"[HotReloadDispatcher] Capture result: {msg.payload}");
                    break;

                case "scoreUpdate":
                    // Handle score update from ShadowVM
                    Debug.Log($"[HotReloadDispatcher] Score update: {msg.payload}");
                    break;

                case "shadowVMEnabled":
                    Debug.Log($"[HotReloadDispatcher] ShadowVM enabled: {msg.payload.enabled}");
                    break;

                default:
                    Debug.LogWarning($"[HotReloadDispatcher] Unknown message type: {msg.type}");
                    break;
            }
        }
        catch (Exception e)
        {
            Debug.LogError($"[HotReloadDispatcher] Error processing message: {e}");
        }
    }
}

[System.Serializable]
public class JSMessage
{
    public string type;
    public JSMessagePayload payload;
}

[System.Serializable]
public class JSMessagePayload
{
    public string methodName;
    public string path;
    public string content;
    public string name;
    public string json;
    public bool enabled;
    public string cardA;
    public string cardB;
    public string side;
    public bool canCapture;
    public string playerId;
    public int score;
}
```

### 5. JSBridge.cs (GameObject Receiver)

```csharp
using UnityEngine;

public class JSBridge : MonoBehaviour
{
    private HotReloadDispatcher dispatcher;

    void Start()
    {
        dispatcher = GetComponent<HotReloadDispatcher>();
        if (dispatcher == null)
        {
            dispatcher = gameObject.AddComponent<HotReloadDispatcher>();
        }
    }

    public void ReceiveMessage(string json)
    {
        if (dispatcher != null)
        {
            dispatcher.ReceiveMessage(json);
        }
    }
}
```

## Unity Scene Setup

1. Create a GameObject named "JSBridge" in your scene
2. Add the `JSBridge` component to it
3. The `JSBridge` will automatically create a `HotReloadDispatcher`

## Usage in Unity Scripts

### Using Behavior Override

```csharp
// In your card comparison method
bool CanCapture(Card a, Card b)
{
    string result = BehaviorOverride.Call("CanCapture", JsonUtility.ToJson(new { a, b }));
    if (result != null)
    {
        return JsonUtility.FromJson<bool>(result);
    }

    // Fallback to default C# logic
    return a.top > b.bottom;
}
```

### Using Config Loader

```csharp
// Load config at runtime
var rules = ConfigLoader.Get("GameConfig/card_rules.json");
if (rules != null)
{
    int threshold = rules.GetField("captureRules").GetField("threshold").i;
}
```

## Integration Notes

- The Unity scripts should be placed in `Assets/Scripts/HotReload/`
- The JSBridge GameObject must exist in the scene for hot reload to work
- All messages are sent via UnityMessagingBus (from Phase E)
- Config files should be in WISSIL FS at paths like `GameConfig/`

