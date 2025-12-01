# Unity C# Integration for Test Scenario Generator

This document describes the Unity C# scripts needed for Phase M - Test Scenario Generator.

## Required Unity Scripts

### 1. ConditionChecker.cs

Place in `Assets/Scripts/Test/ConditionChecker.cs`:

```csharp
using UnityEngine;
using System;

public class ConditionChecker : MonoBehaviour
{
    private static ConditionChecker instance;

    void Awake()
    {
        instance = this;
    }

    public static void CheckCondition(string json)
    {
        if (instance == null)
        {
            Debug.LogError("[ConditionChecker] Instance not found");
            return;
        }

        instance.DoCheckCondition(json);
    }

    void DoCheckCondition(string json)
    {
        try
        {
            var payload = JsonUtility.FromJson<ConditionPayload>(json);
            bool result = TestCondition(payload.condition);

            // Send result back to WISSIL
            var resultPayload = new ResultPayload
            {
                ok = result,
                condition = payload.condition,
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            };

            string resultJson = JsonUtility.ToJson(resultPayload);
            JSBridge.SendToJS("test/conditionResult", resultJson);
        }
        catch (Exception e)
        {
            Debug.LogError($"[ConditionChecker] Error: {e.Message}");
            
            var errorPayload = new ResultPayload
            {
                ok = false,
                error = e.Message,
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            };

            JSBridge.SendToJS("test/conditionResult", JsonUtility.ToJson(errorPayload));
        }
    }

    bool TestCondition(string condition)
    {
        condition = condition.ToLower();

        // Capture conditions
        if (condition.Contains("capture"))
        {
            // Check if last capture was successful
            // This assumes you have a CaptureManager or similar
            return LastCaptureEvent != null && LastCaptureEvent.success;
        }

        // Score conditions
        if (condition.Contains("score"))
        {
            if (condition.Contains("player1 > player2"))
            {
                return ScoreManager.Player1Score > ScoreManager.Player2Score;
            }
            if (condition.Contains("player2 > player1"))
            {
                return ScoreManager.Player2Score > ScoreManager.Player1Score;
            }
        }

        // Comparison conditions
        if (condition.Contains(">"))
        {
            var parts = condition.Split('>');
            if (parts.Length == 2)
            {
                var left = ExtractValue(parts[0].Trim());
                var right = ExtractValue(parts[1].Trim());
                return left > right;
            }
        }

        if (condition.Contains("<"))
        {
            var parts = condition.Split('<');
            if (parts.Length == 2)
            {
                var left = ExtractValue(parts[0].Trim());
                var right = ExtractValue(parts[1].Trim());
                return left < right;
            }
        }

        return false;
    }

    float ExtractValue(string expr)
    {
        // Try to parse as number
        if (float.TryParse(expr, out float value))
        {
            return value;
        }

        // Try to extract from game state
        if (expr.Contains("player1"))
        {
            return ScoreManager.Player1Score;
        }
        if (expr.Contains("player2"))
        {
            return ScoreManager.Player2Score;
        }

        return 0;
    }
}

[System.Serializable]
public class ConditionPayload
{
    public string condition;
}

[System.Serializable]
public class ResultPayload
{
    public bool ok;
    public string condition;
    public string error;
    public long timestamp;
    public object data; // Additional result data
}
```

### 2. TestCardPlayer.cs

Place in `Assets/Scripts/Test/TestCardPlayer.cs`:

```csharp
using UnityEngine;

public class TestCardPlayer : MonoBehaviour
{
    private static TestCardPlayer instance;

    void Awake()
    {
        instance = this;
    }

    public static void PlayCard(string json)
    {
        if (instance == null)
        {
            Debug.LogError("[TestCardPlayer] Instance not found");
            return;
        }

        instance.DoPlayCard(json);
    }

    void DoPlayCard(string json)
    {
        try
        {
            var payload = JsonUtility.FromJson<PlayCardPayload>(json);
            
            // Find card by ID
            var card = FindCardById(payload.cardId);
            if (card == null)
            {
                Debug.LogWarning($"[TestCardPlayer] Card not found: {payload.cardId}");
                return;
            }

            // Find tile by index
            var tile = FindTileByIndex(payload.tileIndex);
            if (tile == null)
            {
                Debug.LogWarning($"[TestCardPlayer] Tile not found: {payload.tileIndex}");
                return;
            }

            // Play card
            // This assumes you have a CardManager or GameManager
            CardManager.Instance.PlayCard(card, tile, payload.player);
        }
        catch (System.Exception e)
        {
            Debug.LogError($"[TestCardPlayer] Error: {e.Message}");
        }
    }

    Card FindCardById(string cardId)
    {
        // Find card in scene or card manager
        // Implementation depends on your card system
        return CardManager.Instance.FindCard(cardId);
    }

    Tile FindTileByIndex(int index)
    {
        // Find tile in scene or tile manager
        // Implementation depends on your tile system
        return TileManager.Instance.GetTile(index);
    }
}

[System.Serializable]
public class PlayCardPayload
{
    public string cardId;
    public int tileIndex;
    public string player;
}
```

### 3. JSBridge Integration

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
            case "test/playCard":
                TestCardPlayer.PlayCard(msg.payload);
                break;

            case "test/checkCondition":
                ConditionChecker.CheckCondition(msg.payload);
                break;

            // ... other cases ...
        }
    }
}
```

### 4. CaptureEventTracker.cs (if needed)

Place in `Assets/Scripts/Test/CaptureEventTracker.cs`:

```csharp
using UnityEngine;
using System;

public class CaptureEventTracker : MonoBehaviour
{
    public static CaptureEvent LastCaptureEvent { get; private set; }

    void Start()
    {
        // Subscribe to capture events
        CardManager.OnCardCaptured += HandleCapture;
    }

    void HandleCapture(Card attacker, Card defender, bool success)
    {
        LastCaptureEvent = new CaptureEvent
        {
            attacker = attacker.name,
            defender = defender.name,
            success = success,
            timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
        };
    }

    void OnDestroy()
    {
        CardManager.OnCardCaptured -= HandleCapture;
    }
}

[System.Serializable]
public class CaptureEvent
{
    public string attacker;
    public string defender;
    public bool success;
    public long timestamp;
}
```

## Setup Instructions

1. Create the folder structure:
   - `Assets/Scripts/Test/`

2. Add all scripts to Unity project

3. Add `ConditionChecker`, `TestCardPlayer`, and `CaptureEventTracker` components to a GameObject in your scene (or create a TestManager object)

4. Ensure your game systems (CardManager, TileManager, ScoreManager) expose the necessary APIs for test execution

5. Tests will execute automatically when triggered from WISSIL Test Runner Panel

## Notes

- Test execution happens in real-time against Unity WebGL runtime
- Conditions are evaluated synchronously where possible
- Test results are sent back to WISSIL via JSBridge
- This system integrates with Phase J (AI Debug Agent) for automatic fixes

