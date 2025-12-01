# Unity C# Integration for Animation Timeline + Sequencer

This document describes the Unity C# scripts needed for Phase O - Animation Timeline + Sequencer.

## Required Unity Scripts

### 1. AnimationSnapshotEmitter.cs

Place in `Assets/Scripts/Animation/AnimationSnapshotEmitter.cs`:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class AnimationSnapshotEmitter : MonoBehaviour
{
    public Animator animator;
    private float lastEmitTime = 0;
    private float emitInterval = 0.1f; // Emit every 100ms

    void Update()
    {
        if (animator == null || Time.time - lastEmitTime < emitInterval) return;

        var clips = animator.runtimeAnimatorController?.animationClips;
        if (clips == null || clips.Length == 0) return;

        var snapshots = new List<AnimSnapshot>();

        foreach (var clip in clips)
        {
            var stateInfo = animator.GetCurrentAnimatorStateInfo(0);
            float normalizedTime = stateInfo.normalizedTime;
            float currentTime = (normalizedTime % 1.0f) * clip.length;

            snapshots.Add(new AnimSnapshot
            {
                clipName = clip.name,
                length = clip.length,
                frameRate = clip.frameRate,
                currentTime = currentTime,
                isPlaying = animator.speed > 0,
                loop = clip.isLooping,
                speed = animator.speed
            });
        }

        string json = JsonHelper.ToJson(snapshots.ToArray());
        JSBridge.SendToJS("animation/update", json);

        lastEmitTime = Time.time;
    }
}

[System.Serializable]
public class AnimSnapshot
{
    public string clipName;
    public float length;
    public float frameRate;
    public float currentTime;
    public bool isPlaying;
    public bool loop;
    public float speed;
}
```

### 2. AnimationControls.cs

Place in `Assets/Scripts/Animation/AnimationControls.cs`:

```csharp
using UnityEngine;

public class AnimationControls : MonoBehaviour
{
    private static AnimationControls instance;
    public Animator animator;

    void Awake()
    {
        instance = this;
    }

    public static void Play(string clipName)
    {
        if (instance == null || instance.animator == null) return;
        instance.animator.Play(clipName);
        instance.animator.speed = 1.0f;
    }

    public static void Pause()
    {
        if (instance == null || instance.animator == null) return;
        instance.animator.speed = 0;
    }

    public static void Stop()
    {
        if (instance == null || instance.animator == null) return;
        instance.animator.speed = 0;
        instance.animator.Play(instance.animator.GetCurrentAnimatorStateInfo(0).shortNameHash, 0, 0);
    }

    public static void Scrub(string clipName, float normalizedTime)
    {
        if (instance == null || instance.animator == null) return;
        instance.animator.Play(clipName, 0, normalizedTime);
        instance.animator.speed = 0; // Hold frame
    }

    public static void SetSpeed(float speed)
    {
        if (instance == null || instance.animator == null) return;
        instance.animator.speed = speed;
    }

    public static void CrossFade(string clipName, float duration)
    {
        if (instance == null || instance.animator == null) return;
        instance.animator.CrossFade(clipName, duration);
    }

    public static void SetBlendWeight(int layerIndex, float weight)
    {
        if (instance == null || instance.animator == null) return;
        instance.animator.SetLayerWeight(layerIndex, weight);
    }

    public static void SetLoop(string clipName, bool loop)
    {
        // Note: Loop setting typically requires modifying the AnimationClip directly
        // This is a simplified example
        Debug.Log($"[AnimationControls] SetLoop called for {clipName}: {loop}");
    }
}
```

### 3. SequencePlayer.cs

Place in `Assets/Scripts/Animation/SequencePlayer.cs`:

```csharp
using UnityEngine;
using System.Collections;

public class SequencePlayer : MonoBehaviour
{
    private static SequencePlayer instance;
    public Animator animator;

    void Awake()
    {
        instance = this;
    }

    public static void PlaySequence(string json)
    {
        if (instance == null || instance.animator == null) return;
        instance.StartCoroutine(instance.PlaySequenceRoutine(json));
    }

    IEnumerator PlaySequenceRoutine(string json)
    {
        var payload = JsonUtility.FromJson<SequencePayload>(json);
        var clips = animator.runtimeAnimatorController.animationClips;

        foreach (var clipName in payload.clips)
        {
            var clip = System.Array.Find(clips, c => c.name == clipName);
            if (clip == null) continue;

            animator.Play(clipName);
            animator.speed = 1.0f;

            yield return new WaitForSeconds(clip.length);

            if (payload.loop && payload.clips[payload.clips.Length - 1] == clipName)
            {
                // Loop back to start
                yield return PlaySequenceRoutine(json);
            }
        }
    }

    public static void StopSequence()
    {
        if (instance == null) return;
        instance.StopAllCoroutines();
        AnimationControls.Stop();
    }
}

[System.Serializable]
public class SequencePayload
{
    public string[] clips;
    public bool loop;
}
```

### 4. AnimationEventManager.cs

Place in `Assets/Scripts/Animation/AnimationEventManager.cs`:

```csharp
using UnityEngine;

public class AnimationEventManager : MonoBehaviour
{
    public static void AddEvent(string clipName, AnimationEventMarker marker)
    {
        // Note: This requires access to the AnimationClip
        // In a real implementation, you'd load the clip and add the event
        Debug.Log($"[AnimationEventManager] Adding event to {clipName}: {marker.functionName} at {marker.time}s");

        // Example implementation (simplified)
        var clip = Resources.Load<AnimationClip>(clipName);
        if (clip != null)
        {
            var evt = new AnimationEvent
            {
                functionName = marker.functionName,
                time = marker.time
            };
            clip.AddEvent(evt);
        }
    }

    // Handle animation events at runtime
    public void OnAnimationEvent(string eventName)
    {
        Debug.Log($"[AnimationEventManager] Animation event triggered: {eventName}");
        // Send to WISSIL
        JSBridge.SendToJS("animation/event", JsonUtility.ToJson(new EventPayload
        {
            functionName = eventName,
            time = Time.time
        }));
    }
}

[System.Serializable]
public class AnimationEventMarker
{
    public float time;
    public string functionName;
}

[System.Serializable]
public class EventPayload
{
    public string functionName;
    public float time;
}
```

### 5. KeyframeExtractor.cs

Place in `Assets/Scripts/Animation/KeyframeExtractor.cs`:

```csharp
#if UNITY_EDITOR
using UnityEngine;
using UnityEditor;

public class KeyframeExtractor : MonoBehaviour
{
    public static void EmitKeyframes(string clipName)
    {
        var clip = AssetDatabase.LoadAssetAtPath<AnimationClip>($"Assets/{clipName}.anim");
        if (clip == null) return;

        var keyframes = new System.Collections.Generic.List<KeyframeData>();
        var bindings = AnimationUtility.GetCurveBindings(clip);

        foreach (var binding in bindings)
        {
            var curve = AnimationUtility.GetEditorCurve(clip, binding);
            if (curve == null) continue;

            foreach (var keyframe in curve.keys)
            {
                keyframes.Add(new KeyframeData
                {
                    time = keyframe.time,
                    property = binding.propertyName,
                    value = keyframe.value,
                    inTangent = keyframe.inTangent,
                    outTangent = keyframe.outTangent
                });
            }
        }

        string json = JsonHelper.ToJson(keyframes.ToArray());
        JSBridge.SendToJS("animation/keyframes", json);
    }
}
#endif

[System.Serializable]
public class KeyframeData
{
    public float time;
    public string property;
    public float value;
    public float inTangent;
    public float outTangent;
}
```

### 6. JSBridge Integration

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
            case "animation/request":
                // Trigger snapshot emission
                break;

            case "animation/play":
                AnimationControls.Play(msg.clip);
                break;

            case "animation/pause":
                AnimationControls.Pause();
                break;

            case "animation/stop":
                AnimationControls.Stop();
                break;

            case "animation/scrub":
                AnimationControls.Scrub(msg.clip, msg.time);
                break;

            case "animation/setSpeed":
                AnimationControls.SetSpeed(msg.speed);
                break;

            case "animation/crossfade":
                AnimationControls.CrossFade(msg.clip, msg.duration);
                break;

            case "animation/setBlendWeight":
                AnimationControls.SetBlendWeight(msg.layerIndex, msg.weight);
                break;

            case "animation/sequence":
                SequencePlayer.PlaySequence(json);
                break;

            case "animation/stopSequence":
                SequencePlayer.StopSequence();
                break;

            case "animation/addEvent":
                AnimationEventManager.AddEvent(msg.clip, msg.event);
                break;

            case "animation/requestKeyframes":
                #if UNITY_EDITOR
                KeyframeExtractor.EmitKeyframes(msg.clipName);
                #endif
                break;

            // ... other cases ...
        }
    }
}
```

## Setup Instructions

1. Create the folder structure:
   - `Assets/Scripts/Animation/`

2. Add all scripts to Unity project

3. Add `AnimationSnapshotEmitter` and `AnimationControls` components to a GameObject with an Animator

4. Assign the Animator reference

5. Animations will stream automatically to WISSIL Timeline panel

6. Timeline scrubbing and playback controls work in real-time

## Notes

- Animation snapshots are emitted every 100ms for smooth timeline updates
- Scrubbing works by setting normalized time and pausing animator
- Sequence playback uses coroutines for sequential clip execution
- Event markers are added to AnimationClip at runtime
- Keyframe extraction uses Unity Editor API (editor-only)

This system integrates with:
- Phase K (Scene Graph) for object selection
- Phase F/G (Hot Reload) for live animation parameter updates
- Phase J/L (LUNA) for AI-assisted animation correction

