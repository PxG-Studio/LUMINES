# Unity C# Integration for Audio Mixer & SoundGraph Editor

This document describes the Unity C# scripts needed for Phase W - Audio Mixer & SoundGraph Editor.

## Required Unity Scripts

### 1. AudioSnapshotEmitter.cs

Place in `Assets/Scripts/Audio/AudioSnapshotEmitter.cs`:

```csharp
using UnityEngine;
using UnityEngine.Audio;
using System.Collections.Generic;

public class AudioSnapshotEmitter : MonoBehaviour
{
    public AudioMixer mixer;
    private float lastUpdateTime = 0;
    private float updateInterval = 0.2f; // Update every 200ms

    void Start()
    {
        if (mixer == null)
        {
            mixer = Resources.Load<AudioMixer>("Audio/MasterMixer");
        }
    }

    void Update()
    {
        if (mixer == null || Time.time - lastUpdateTime < updateInterval) return;

        var groups = mixer.FindMatchingGroups(string.Empty);
        List<AudioGroupSnapshot> payload = new List<AudioGroupSnapshot>();

        foreach (var g in groups)
        {
            float vol;
            mixer.GetFloat($"{g.name}Volume", out vol);

            float pitch;
            mixer.GetFloat($"{g.name}Pitch", out pitch);

            // Get effects (simplified - would need to query actual effects)
            List<AudioEffectData> effects = new List<AudioEffectData>();

            payload.Add(new AudioGroupSnapshot
            {
                id = g.GetInstanceID().ToString(),
                name = g.name,
                volume = vol,
                pitch = pitch,
                effects = effects.ToArray()
            });
        }

        string json = JsonHelper.ToJson(payload.ToArray());
        JSBridge.SendToJS("audio/snapshot", json);

        lastUpdateTime = Time.time;
    }
}

[System.Serializable]
public class AudioGroupSnapshot
{
    public string id;
    public string name;
    public float volume;
    public float pitch;
    public AudioEffectData[] effects;
}

[System.Serializable]
public class AudioEffectData
{
    public string type;
    public bool enabled;
    public float[] parameters;
}
```

### 2. AudioPatcherHandler.cs

Place in `Assets/Scripts/Audio/AudioPatcherHandler.cs`:

```csharp
using UnityEngine;
using UnityEngine.Audio;

public class AudioPatcherHandler : MonoBehaviour
{
    public AudioMixer mixer;

    public static void Patch(string json)
    {
        var p = JsonUtility.FromJson<PatchPayload>(json);
        var handler = FindObjectOfType<AudioPatcherHandler>();
        if (handler == null || handler.mixer == null) return;

        var mixer = handler.mixer;

        string paramName = $"{p.name}{p.field}";

        switch (p.field)
        {
            case "volume":
                mixer.SetFloat($"{p.name}Volume", p.value);
                break;
            case "pitch":
                mixer.SetFloat($"{p.name}Pitch", p.value);
                break;
            case "lowpass":
                mixer.SetFloat($"{p.name}Lowpass", p.value);
                break;
            case "highpass":
                mixer.SetFloat($"{p.name}Highpass", p.value);
                break;
            case "reverb":
                mixer.SetFloat($"{p.name}ReverbLevel", p.value);
                break;
            case "echo":
                mixer.SetFloat($"{p.name}EchoDelay", p.value);
                break;
        }
    }

    public static void AddEffect(string json)
    {
        var data = JsonUtility.FromJson<AddEffectPayload>(json);
        // Add effect to mixer group (implementation depends on Unity Audio Mixer API)
        Debug.Log($"[AudioPatcherHandler] Adding effect {data.effectType} to {data.name}");
    }

    public static void ToggleEffect(string json)
    {
        var data = JsonUtility.FromJson<ToggleEffectPayload>(json);
        // Toggle effect in mixer group
        Debug.Log($"[AudioPatcherHandler] Toggling effect {data.effectIndex} on {data.name}: {data.enabled}");
    }

    public static void Preview(string soundId)
    {
        var clip = Resources.Load<AudioClip>($"Audio/{soundId}");
        if (clip != null)
        {
            AudioSource.PlayClipAtPoint(clip, Vector3.zero);
        }
    }
}

[System.Serializable]
public class PatchPayload
{
    public string id;
    public string name;
    public string field;
    public float value;
}

[System.Serializable]
public class AddEffectPayload
{
    public string id;
    public string name;
    public string effectType;
}

[System.Serializable]
public class ToggleEffectPayload
{
    public string id;
    public string name;
    public int effectIndex;
    public bool enabled;
}
```

### 3. SpatialAudioHandler.cs

Place in `Assets/Scripts/Audio/SpatialAudioHandler.cs`:

```csharp
using UnityEngine;

public class SpatialAudioHandler : MonoBehaviour
{
    public static void UpdateSpatial(string json)
    {
        var data = JsonUtility.FromJson<SpatialData>(json);
        var sources = GameObject.FindObjectsOfType<AudioSource>();

        foreach (var source in sources)
        {
            if (data.minDistance != null)
                source.minDistance = (float)data.minDistance;
            if (data.maxDistance != null)
                source.maxDistance = (float)data.maxDistance;
            if (data.spread != null)
                source.spread = (float)data.spread;
            if (data.dopplerLevel != null)
                source.dopplerLevel = (float)data.dopplerLevel;
            if (data.spatialBlend != null)
                source.spatialBlend = (float)data.spatialBlend;
            if (data.rolloffMode != null)
                source.rolloffMode = ParseRolloffMode(data.rolloffMode);
        }
    }

    private static AudioRolloffMode ParseRolloffMode(string mode)
    {
        switch (mode.ToLower())
        {
            case "linear": return AudioRolloffMode.Linear;
            case "logarithmic": return AudioRolloffMode.Logarithmic;
            case "custom": return AudioRolloffMode.Custom;
            default: return AudioRolloffMode.Logarithmic;
        }
    }
}

[System.Serializable]
public class SpatialData
{
    public float? minDistance;
    public float? maxDistance;
    public float? spread;
    public float? dopplerLevel;
    public float? spatialBlend;
    public string rolloffMode;
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
            case "audio/patch":
                AudioPatcherHandler.Patch(json);
                break;

            case "audio/addEffect":
                AudioPatcherHandler.AddEffect(json);
                break;

            case "audio/toggleEffect":
                AudioPatcherHandler.ToggleEffect(json);
                break;

            case "audio/preview":
                AudioPatcherHandler.Preview(msg.id);
                break;

            case "audio/spatial":
                SpatialAudioHandler.UpdateSpatial(json);
                break;

            case "audio/loadPreset":
                // Load mixer preset
                LoadMixerPreset(json);
                break;

            // ... other cases ...
        }
    }

    void LoadMixerPreset(string json)
    {
        var preset = JsonUtility.FromJson<MixerPresetData>(json);
        var handler = FindObjectOfType<AudioPatcherHandler>();
        if (handler == null || handler.mixer == null) return;

        // Apply preset to mixer
        foreach (var group in preset.groups)
        {
            handler.mixer.SetFloat($"{group.name}Volume", group.volume);
            handler.mixer.SetFloat($"{group.name}Pitch", group.pitch);
        }
    }
}

[System.Serializable]
public class MixerPresetData
{
    public string name;
    public AudioGroupSnapshot[] groups;
}
```

## Setup Instructions

1. Create the folder structure:
   - `Assets/Scripts/Audio/`
   - `Assets/Audio/Presets/` (for presets)

2. Create Unity Audio Mixer:
   - Window → Audio → Audio Mixer
   - Create new mixer (MasterMixer)
   - Save to `Assets/Audio/MasterMixer.mixer`

3. Add scripts to Unity project

4. Add `AudioSnapshotEmitter` and `AudioPatcherHandler` components to manager GameObject

5. Assign mixer reference

6. Audio mixer will sync automatically to WISSIL

## Notes

- Audio mixer snapshots are emitted every 200ms
- Effect parameters update in real-time
- Spatial audio settings apply to all AudioSources
- Presets can be saved/loaded from file system
- Preview sounds require audio clips in Resources/Audio/ folder

This system integrates with:
- Phase K (Scene Graph) for object selection
- Phase F/G (Hot Reload) for live updates
- Phase R (Gizmos) for spatial audio positioning

