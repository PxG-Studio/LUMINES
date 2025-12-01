# Unity C# Integration for Scene Gizmos

This document describes the Unity C# scripts needed for Phase R - Scene Gizmos Toolset.

## Required Unity Scripts

### 1. SceneGizmoBridge.cs

Place in `Assets/Scripts/Gizmos/SceneGizmoBridge.cs`:

```csharp
using UnityEngine;

public class SceneGizmoBridge : MonoBehaviour
{
    public string objectId;

    private float lastUpdateTime = 0;
    private float updateInterval = 0.1f; // Update every 100ms

    void Update()
    {
        if (Time.time - lastUpdateTime < updateInterval) return;

        var t = transform;
        var data = new TransformSnapshot
        {
            id = objectId ?? GetInstanceID().ToString(),
            pos = new Vector3Wrapper
            {
                x = t.position.x,
                y = t.position.y,
                z = t.position.z
            },
            rot = new Vector3Wrapper
            {
                x = t.rotation.eulerAngles.x,
                y = t.rotation.eulerAngles.y,
                z = t.rotation.eulerAngles.z
            },
            scale = new Vector3Wrapper
            {
                x = t.localScale.x,
                y = t.localScale.y,
                z = t.localScale.z
            }
        };

        string json = JsonUtility.ToJson(data);
        JSBridge.SendToJS("scene/transform", json);

        lastUpdateTime = Time.time;
    }
}

[System.Serializable]
public class TransformSnapshot
{
    public string id;
    public Vector3Wrapper pos;
    public Vector3Wrapper rot;
    public Vector3Wrapper scale;
}

[System.Serializable]
public class Vector3Wrapper
{
    public float x, y, z;
}
```

### 2. Picker.cs

Place in `Assets/Scripts/Gizmos/Picker.cs`:

```csharp
using UnityEngine;

public class Picker : MonoBehaviour
{
    private static Picker instance;
    public Camera sceneCamera;

    void Awake()
    {
        instance = this;
        if (sceneCamera == null)
        {
            sceneCamera = Camera.main;
        }
    }

    public static void Pick(float normalizedX, float normalizedY)
    {
        if (instance == null || instance.sceneCamera == null) return;

        var camera = instance.sceneCamera;
        var ray = camera.ScreenPointToRay(new Vector3(
            normalizedX * Screen.width,
            normalizedY * Screen.height,
            0
        ));

        RaycastHit hit;
        if (Physics.Raycast(ray, out hit))
        {
            var obj = hit.collider.gameObject;
            int id = obj.GetInstanceID();
            
            JSBridge.SendToJS("scene/pick", id.ToString());
            
            Debug.Log($"[Picker] Picked object: {obj.name} (ID: {id})");
        }
    }

    public static void ProjectToScreen(string objectId, Vector3 position)
    {
        if (instance == null || instance.sceneCamera == null) return;

        var camera = instance.sceneCamera;
        var screenPos = camera.WorldToScreenPoint(position);
        
        // Normalize to 0-1 range
        var normalized = new Vector2(
            screenPos.x / Screen.width,
            screenPos.y / Screen.height
        );

        JSBridge.SendToJS("scene/projectResult", JsonUtility.ToJson(new ProjectResult
        {
            id = objectId,
            x = normalized.x,
            y = 1 - normalized.y // Flip Y
        }));
    }
}

[System.Serializable]
public class ProjectResult
{
    public string id;
    public float x;
    public float y;
}
```

### 3. TransformPatcher.cs

Place in `Assets/Scripts/Gizmos/TransformPatcher.cs`:

```csharp
using UnityEngine;

public class TransformPatcher : MonoBehaviour
{
    public static void Move(string id, Vector3 position)
    {
        var obj = FindObjectById(id);
        if (obj != null)
        {
            obj.transform.position = position;
        }
    }

    public static void Rotate(string id, Vector3 rotation)
    {
        var obj = FindObjectById(id);
        if (obj != null)
        {
            obj.transform.rotation = Quaternion.Euler(rotation);
        }
    }

    public static void Scale(string id, Vector3 scale)
    {
        var obj = FindObjectById(id);
        if (obj != null)
        {
            obj.transform.localScale = scale;
        }
    }

    private static GameObject FindObjectById(string id)
    {
        int instanceId = int.Parse(id);
        var allObjects = GameObject.FindObjectsOfType<Transform>();
        
        foreach (var t in allObjects)
        {
            if (t.gameObject.GetInstanceID() == instanceId)
            {
                return t.gameObject;
            }
        }
        
        return null;
    }
}
```

### 4. CameraController.cs

Place in `Assets/Scripts/Gizmos/CameraController.cs`:

```csharp
using UnityEngine;

public class CameraController : MonoBehaviour
{
    private static CameraController instance;
    public Camera cam;

    private float orbitSpeed = 0.2f;
    private float zoomSpeed = 0.05f;
    private float panSpeed = 0.01f;

    void Awake()
    {
        instance = this;
        if (cam == null)
        {
            cam = GetComponent<Camera>();
            if (cam == null)
            {
                cam = Camera.main;
            }
        }
    }

    public static void Orbit(float dx, float dy)
    {
        if (instance == null) return;

        instance.transform.Rotate(new Vector3(dy, dx, 0) * instance.orbitSpeed, Space.World);
    }

    public static void Zoom(float delta, float centerX, float centerY)
    {
        if (instance == null || instance.cam == null) return;

        var camera = instance.cam;
        camera.fieldOfView = Mathf.Clamp(
            camera.fieldOfView + delta * instance.zoomSpeed,
            10f,
            120f
        );
    }

    public static void Pan(float dx, float dy)
    {
        if (instance == null) return;

        var right = instance.transform.right;
        var up = instance.transform.up;

        instance.transform.position += (right * dx + up * dy) * instance.panSpeed;
    }

    public static void Reset()
    {
        if (instance == null) return;

        instance.transform.position = new Vector3(0, 1, -10);
        instance.transform.rotation = Quaternion.identity;
        
        if (instance.cam != null)
        {
            instance.cam.fieldOfView = 60f;
        }
    }

    public static void Focus(string objectId)
    {
        if (instance == null) return;

        var obj = TransformPatcher.FindObjectById(objectId);
        if (obj != null)
        {
            // Focus camera on object
            var targetPos = obj.transform.position;
            var dir = (targetPos - instance.transform.position).normalized;
            instance.transform.rotation = Quaternion.LookRotation(dir);
            
            // Optionally zoom to fit
            var distance = Vector3.Distance(instance.transform.position, targetPos);
            if (instance.cam != null)
            {
                instance.cam.fieldOfView = Mathf.Clamp(distance * 10f, 20f, 80f);
            }
        }
    }
}
```

### 5. JSBridge Integration

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
            case "scene/requestTransform":
                // Request transform for object
                var bridge = FindObjectOfType<SceneGizmoBridge>();
                if (bridge != null && bridge.objectId == msg.id)
                {
                    // Force immediate update
                }
                break;

            case "scene/pick":
                Picker.Pick(msg.x, msg.y);
                break;

            case "scene/projectToScreen":
                Picker.ProjectToScreen(msg.id, new Vector3(msg.position.x, msg.position.y, msg.position.z));
                break;

            case "transform/move":
                TransformPatcher.Move(msg.id, new Vector3(msg.position.x, msg.position.y, msg.position.z));
                break;

            case "transform/rotate":
                TransformPatcher.Rotate(msg.id, new Vector3(msg.rotation.x, msg.rotation.y, msg.rotation.z));
                break;

            case "transform/scale":
                TransformPatcher.Scale(msg.id, new Vector3(msg.scale.x, msg.scale.y, msg.scale.z));
                break;

            case "camera/orbit":
                CameraController.Orbit(msg.dx, msg.dy);
                break;

            case "camera/zoom":
                CameraController.Zoom(msg.delta, msg.centerX, msg.centerY);
                break;

            case "camera/pan":
                CameraController.Pan(msg.dx, msg.dy);
                break;

            case "camera/reset":
                CameraController.Reset();
                break;

            case "camera/focus":
                CameraController.Focus(msg.id);
                break;

            // ... other cases ...
        }
    }
}
```

## Setup Instructions

1. Create the folder structure:
   - `Assets/Scripts/Gizmos/`

2. Add all scripts to Unity project

3. Add components to GameObjects:
   - Add `SceneGizmoBridge` to objects you want to manipulate
   - Add `Picker` to a manager GameObject
   - Add `CameraController` to your scene camera

4. Assign references:
   - Set `sceneCamera` on Picker
   - Set `cam` on CameraController

5. Gizmos will now sync automatically with WISSIL

## Notes

- Transform updates are sent every 100ms for performance
- Picking uses raycast from camera
- Camera controls work in real-time
- Transform changes are applied immediately
- All transforms are synchronized with WISSIL scene graph (Phase K)

This system integrates with:
- Phase F/G (Hot Reload) for live transform updates
- Phase K (Scene Graph) for object selection
- Phase N (Materials) for material preview updates

