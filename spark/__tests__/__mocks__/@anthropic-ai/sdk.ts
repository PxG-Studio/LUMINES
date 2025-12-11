import { vi } from 'vitest';

export default class Anthropic {
  constructor(config: any) {}

  messages = {
    create: vi.fn().mockResolvedValue({
      content: [{
        type: 'text',
        text: `using UnityEngine;
using System.Collections;

/// <summary>
/// A simple test script
/// </summary>
public class TestScript : MonoBehaviour
{
    void Start()
    {
        Debug.Log("Hello from TestScript!");
    }
}`
      }]
    })
  };
}
