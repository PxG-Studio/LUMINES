# Unity C# Runtime Execution Backend for Ignis Blueprints

This document describes the Unity C# scripts needed to execute Ignis Blueprint graphs in Unity WebGL.

## Required Unity Scripts

### 1. IgnisBlueprintRuntime.cs

Place in `Assets/Ignis/Scripts/IgnisBlueprintRuntime.cs`:

```csharp
using UnityEngine;
using System;
using System.Collections.Generic;

public class IgnisBlueprintRuntime : MonoBehaviour
{
    private Dictionary<string, object> variables = new Dictionary<string, object>();
    private Dictionary<string, Action<string>> eventHandlers = new Dictionary<string, Action<string>>();

    /// <summary>
    /// Execute a blueprint node
    /// </summary>
    public void ExecuteNode(string nodeId, string jsonPayload)
    {
        try
        {
            var payload = JsonUtility.FromJson<NodeExecutionPayload>(jsonPayload);
            
            Debug.Log($"[Ignis] Execute node {nodeId}");

            // Route to appropriate handler based on node type
            switch (payload.nodeType)
            {
                case "Print":
                    HandlePrint(payload);
                    break;
                case "SetPosition":
                    HandleSetPosition(payload);
                    break;
                case "GetPosition":
                    HandleGetPosition(payload);
                    break;
                case "PlaySound":
                    HandlePlaySound(payload);
                    break;
                case "SpawnPrefab":
                    HandleSpawnPrefab(payload);
                    break;
                case "DestroyObject":
                    HandleDestroyObject(payload);
                    break;
                default:
                    Debug.LogWarning($"[Ignis] Unknown node type: {payload.nodeType}");
                    break;
            }
        }
        catch (Exception e)
        {
            Debug.LogError($"[Ignis] Error executing node {nodeId}: {e.Message}");
        }
    }

    /// <summary>
    /// Trigger a blueprint event
    /// </summary>
    public void TriggerEvent(string eventName, string payload)
    {
        Debug.Log($"[Ignis] Event triggered: {eventName}");
        
        if (eventHandlers.ContainsKey(eventName))
        {
            eventHandlers[eventName]?.Invoke(payload);
        }
        
        // Relay to WebGL JSLib -> JS -> Blueprint Interpreter
        IgnisBridge.Trigger(eventName, payload);
    }

    /// <summary>
    /// Register event handler
    /// </summary>
    public void RegisterEvent(string eventName, Action<string> handler)
    {
        eventHandlers[eventName] = handler;
    }

    /// <summary>
    /// Set variable value
    /// </summary>
    public void SetVariable(string name, string jsonValue)
    {
        // Simple implementation - would need proper type parsing
        variables[name] = jsonValue;
    }

    /// <summary>
    /// Get variable value
    /// </summary>
    public string GetVariable(string name)
    {
        if (variables.ContainsKey(name))
        {
            return JsonUtility.ToJson(variables[name]);
        }
        return "null";
    }

    // Node handlers
    private void HandlePrint(NodeExecutionPayload payload)
    {
        string message = payload.GetValue<string>("Message", "Hello World");
        Debug.Log($"[Blueprint] {message}");
    }

    private void HandleSetPosition(NodeExecutionPayload payload)
    {
        GameObject target = payload.GetValue<GameObject>("Object");
        Vector3 position = payload.GetValue<Vector3>("Position");
        
        if (target != null)
        {
            target.transform.position = position;
        }
    }

    private void HandleGetPosition(NodeExecutionPayload payload)
    {
        GameObject target = payload.GetValue<GameObject>("Object");
        if (target != null)
        {
            Vector3 pos = target.transform.position;
            // Send result back to JS
            IgnisBridge.SendResult(payload.nodeId, JsonUtility.ToJson(pos));
        }
    }

    private void HandlePlaySound(NodeExecutionPayload payload)
    {
        AudioClip clip = payload.GetValue<AudioClip>("Sound");
        if (clip != null)
        {
            AudioSource.PlayClipAtPoint(clip, transform.position);
        }
    }

    private void HandleSpawnPrefab(NodeExecutionPayload payload)
    {
        GameObject prefab = payload.GetValue<GameObject>("Prefab");
        Vector3 position = payload.GetValue<Vector3>("Position", Vector3.zero);
        
        if (prefab != null)
        {
            GameObject instance = Instantiate(prefab, position, Quaternion.identity);
            // Send spawned object ID back
            IgnisBridge.SendResult(payload.nodeId, instance.GetInstanceID().ToString());
        }
    }

    private void HandleDestroyObject(NodeExecutionPayload payload)
    {
        GameObject target = payload.GetValue<GameObject>("Object");
        if (target != null)
        {
            Destroy(target);
        }
    }
}

[System.Serializable]
public class NodeExecutionPayload
{
    public string nodeId;
    public string nodeType;
    public Dictionary<string, string> values;

    public T GetValue<T>(string key, T defaultValue = default(T))
    {
        if (values != null && values.ContainsKey(key))
        {
            try
            {
                return JsonUtility.FromJson<T>(values[key]);
            }
            catch
            {
                return defaultValue;
            }
        }
        return defaultValue;
    }
}
```

### 2. IgnisBridge.cs

Place in `Assets/Ignis/Scripts/IgnisBridge.cs`:

```csharp
using UnityEngine;

/// <summary>
/// Bridge between Unity and JavaScript for Ignis Blueprints
/// </summary>
public static class IgnisBridge
{
    /// <summary>
    /// Trigger an event that will be caught by JS blueprint interpreter
    /// </summary>
    public static void Trigger(string eventName, string payload)
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        TriggerWebGL(eventName, payload);
#else
        Debug.Log($"[IgnisBridge] {eventName}: {payload}");
#endif
    }

    /// <summary>
    /// Send result back to JS
    /// </summary>
    public static void SendResult(string nodeId, string result)
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        SendResultWebGL(nodeId, result);
#else
        Debug.Log($"[IgnisBridge] Result for {nodeId}: {result}");
#endif
    }

#if UNITY_WEBGL && !UNITY_EDITOR
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void TriggerWebGL(string eventName, string payload);

    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void SendResultWebGL(string nodeId, string result);
#endif
}
```

### 3. JSLib (JavaScript Bridge)

Create `Assets/Plugins/IgnisBridge.jslib`:

```javascript
mergeInto(LibraryManager.library, {
  TriggerWebGL: function (eventNamePtr, payloadPtr) {
    var eventName = UTF8ToString(eventNamePtr);
    var payload = UTF8ToString(payloadPtr);
    
    // Dispatch to WISSIL blueprint interpreter
    window.dispatchEvent(new CustomEvent('ignis-blueprint-event', {
      detail: { eventName, payload }
    }));
  },
  
  SendResultWebGL: function (nodeIdPtr, resultPtr) {
    var nodeId = UTF8ToString(nodeIdPtr);
    var result = UTF8ToString(resultPtr);
    
    // Send result back to blueprint
    window.dispatchEvent(new CustomEvent('ignis-blueprint-result', {
      detail: { nodeId, result }
    }));
  }
});
```

### 4. BlueprintEventHandler.cs

Place in `Assets/Ignis/Scripts/BlueprintEventHandler.cs`:

```csharp
using UnityEngine;

/// <summary>
/// Component to handle blueprint events
/// </summary>
public class BlueprintEventHandler : MonoBehaviour
{
    private IgnisBlueprintRuntime runtime;

    void Start()
    {
        runtime = GetComponent<IgnisBlueprintRuntime>();
        if (runtime == null)
        {
            runtime = gameObject.AddComponent<IgnisBlueprintRuntime>();
        }

        // Register common events
        runtime.RegisterEvent("OnStart", HandleStart);
        runtime.RegisterEvent("OnUpdate", HandleUpdate);
        runtime.RegisterEvent("OnTriggerEnter", HandleTriggerEnter);
    }

    void HandleStart(string payload)
    {
        // Trigger Start node execution
        Debug.Log("[Blueprint] Start event");
    }

    void HandleUpdate(string payload)
    {
        // Trigger Update node execution (called every frame)
        // Note: This should be throttled or controlled
    }

    void HandleTriggerEnter(string payload)
    {
        Debug.Log("[Blueprint] Trigger Enter event");
    }

    void OnTriggerEnter(Collider other)
    {
        runtime.TriggerEvent("OnTriggerEnter", JsonUtility.ToJson(new { other = other.gameObject.name }));
    }
}
```

## Setup Instructions

1. Create folder structure:
   - `Assets/Ignis/Scripts/`
   - `Assets/Plugins/`

2. Add scripts to Unity project

3. Add `IgnisBlueprintRuntime` and `BlueprintEventHandler` components to a manager GameObject

4. Build for WebGL - the JSLib will be included automatically

5. Blueprint graphs will now execute through Unity runtime

## Message Flow

```
JS Blueprint Interpreter
    ↓
UnityBridge.send("blueprint/execute", { nodeId, payload })
    ↓
Unity WebGL receives via JSLib
    ↓
IgnisBlueprintRuntime.ExecuteNode()
    ↓
Node handler executes Unity API
    ↓
Result sent back via IgnisBridge.SendResult()
    ↓
JS receives result and continues graph execution
```

## Notes

- Node execution is synchronous for simple operations
- Complex operations should use coroutines or async/await
- Event handlers must be registered before use
- Variables are stored in runtime dictionary
- GameObject references must be passed as instance IDs or names

This system integrates with:
- Phase E (WISSIL ↔ Unity Bidirectional Runtime Bridge)
- Phase G (C# Hot Reload)
- Phase H (Multiplayer Debug Sync)

