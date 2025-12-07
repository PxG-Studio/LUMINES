import { describe, it, expect } from 'vitest';
import { validateCSharp } from '../lib/unity/validator';

describe('Unity C# Validator', () => {
  it('should validate correct Unity script', () => {
    const code = `using UnityEngine;

public class TestScript : MonoBehaviour
{
    void Start()
    {
        Debug.Log("Test");
    }
}`;

    const result = validateCSharp(code);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect missing using UnityEngine', () => {
    const code = `public class TestScript : MonoBehaviour
{
    void Start() { }
}`;

    const result = validateCSharp(code);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('using'))).toBe(true);
  });

  it('should detect missing class declaration', () => {
    const code = `using UnityEngine;

void Start() { }`;

    const result = validateCSharp(code);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('class'))).toBe(true);
  });

  it('should validate script with multiple using statements', () => {
    const code = `using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class TestScript : MonoBehaviour
{
    private List<string> items = new List<string>();
}`;

    const result = validateCSharp(code);
    expect(result.isValid).toBe(true);
  });

  it('should detect unbalanced braces', () => {
    const code = `using UnityEngine;

public class TestScript : MonoBehaviour
{
    void Start()
    {
        Debug.Log("Test");
    }
`;

    const result = validateCSharp(code);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('brace'))).toBe(true);
  });

  it('should allow scripts without MonoBehaviour', () => {
    const code = `using UnityEngine;

public class TestData
{
    public string name;
    public int value;
}`;

    const result = validateCSharp(code);
    expect(result.isValid).toBe(true);
  });

  it('should validate namespace declarations', () => {
    const code = `using UnityEngine;

namespace MyGame.Scripts
{
    public class TestScript : MonoBehaviour
    {
        void Start() { }
    }
}`;

    const result = validateCSharp(code);
    expect(result.isValid).toBe(true);
  });
});
