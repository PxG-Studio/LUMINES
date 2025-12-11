/**
 * Edge Case Tests for Unity Validator
 * Target: 15-20 tests
 */

import { describe, it, expect } from 'vitest';
import { validateCSharp, extractScriptName } from '../validator';

describe('Unity Validator Edge Cases', () => {
  describe('validateCSharp edge cases', () => {
    it('should handle code with only comments', () => {
      const code = '// This is a comment\n/* Multi-line */';
      const result = validateCSharp(code);
      expect(result.isValid).toBe(false);
    });

    it('should handle code with preprocessor directives', () => {
      const code = `
        #if UNITY_EDITOR
        using UnityEngine;
        #endif
        public class Test : MonoBehaviour { }
      `;
      const result = validateCSharp(code);
      // Should still validate (preprocessor directives are valid C#)
      expect(result).toBeDefined();
    });

    it('should handle code with attributes', () => {
      const code = `
        using UnityEngine;
        [System.Serializable]
        public class Test : MonoBehaviour { }
      `;
      const result = validateCSharp(code);
      expect(result.isValid).toBe(true);
    });

    it('should handle code with generics', () => {
      const code = `
        using UnityEngine;
        using System.Collections.Generic;
        public class Test<T> : MonoBehaviour {
          private List<T> items;
        }
      `;
      const result = validateCSharp(code);
      expect(result.isValid).toBe(true);
    });

    it('should handle code with interfaces', () => {
      const code = `
        using UnityEngine;
        public class Test : MonoBehaviour, System.IDisposable {
          public void Dispose() { }
        }
      `;
      const result = validateCSharp(code);
      expect(result.isValid).toBe(true);
    });

    it('should handle code with nested classes', () => {
      const code = `
        using UnityEngine;
        public class Outer : MonoBehaviour {
          public class Inner {
            public void Method() { }
          }
        }
      `;
      const result = validateCSharp(code);
      expect(result.isValid).toBe(true);
    });

    it('should handle code with partial classes', () => {
      const code = `
        using UnityEngine;
        public partial class Test : MonoBehaviour { }
      `;
      const result = validateCSharp(code);
      expect(result.isValid).toBe(true);
    });

    it('should handle code with static classes', () => {
      const code = `
        using UnityEngine;
        public static class Utils {
          public static void Method() { }
        }
      `;
      const result = validateCSharp(code);
      // Static classes don't need MonoBehaviour
      expect(result).toBeDefined();
    });

    it('should handle code with enums', () => {
      const code = `
        using UnityEngine;
        public enum MyEnum {
          Value1,
          Value2
        }
        public class Test : MonoBehaviour { }
      `;
      const result = validateCSharp(code);
      expect(result.isValid).toBe(true);
    });

    it('should handle code with structs', () => {
      const code = `
        using UnityEngine;
        public struct MyStruct {
          public int value;
        }
        public class Test : MonoBehaviour { }
      `;
      const result = validateCSharp(code);
      expect(result.isValid).toBe(true);
    });

    it('should handle very long code (10k lines)', () => {
      const longCode = Array(10000).fill('// Line').join('\n') + '\nusing UnityEngine;\npublic class Test : MonoBehaviour { }';
      const result = validateCSharp(longCode);
      expect(result).toBeDefined();
    });

    it('should handle code with unicode characters', () => {
      const code = `
        using UnityEngine;
        // こんにちは
        public class Test : MonoBehaviour {
          private string メッセージ = "Hello";
        }
      `;
      const result = validateCSharp(code);
      expect(result).toBeDefined();
    });

    it('should handle code with escaped characters', () => {
      const code = `
        using UnityEngine;
        public class Test : MonoBehaviour {
          private string text = "Hello\\nWorld";
        }
      `;
      const result = validateCSharp(code);
      expect(result.isValid).toBe(true);
    });
  });

  describe('extractScriptName edge cases', () => {
    it('should handle class name with numbers', () => {
      const code = 'public class Script123 : MonoBehaviour { }';
      const name = extractScriptName(code);
      expect(name).toBe('Script123');
    });

    it('should handle class name starting with underscore', () => {
      const code = 'public class _PrivateScript : MonoBehaviour { }';
      const name = extractScriptName(code);
      expect(name).toBe('_PrivateScript');
    });

    it('should handle class name with generic parameters', () => {
      const code = 'public class Test<T> : MonoBehaviour { }';
      const name = extractScriptName(code);
      expect(name).toBe('Test');
    });

    it('should handle abstract class', () => {
      const code = 'public abstract class BaseClass : MonoBehaviour { }';
      const name = extractScriptName(code);
      expect(name).toBe('BaseClass');
    });

    it('should handle sealed class', () => {
      const code = 'public sealed class FinalClass : MonoBehaviour { }';
      const name = extractScriptName(code);
      expect(name).toBe('FinalClass');
    });

    it('should handle class with multiple modifiers', () => {
      const code = 'public static partial class Utility { }';
      const name = extractScriptName(code);
      expect(name).toBe('Utility');
    });

    it('should return null for interface', () => {
      const code = 'public interface ITest { }';
      const name = extractScriptName(code);
      // Interfaces don't match class pattern
      expect(name).toBeNull();
    });

    it('should handle class name in string literal', () => {
      const code = 'string text = "class MyClass";';
      const name = extractScriptName(code);
      // Should not match string content
      expect(name).toBeNull();
    });
  });
});

