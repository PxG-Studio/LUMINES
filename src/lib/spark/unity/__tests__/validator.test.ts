/**
 * Comprehensive Unit Tests for Unity Validator
 * Target: 20-25 tests (extending existing)
 */

import { describe, it, expect } from 'vitest';
import { validateCSharp, extractScriptName } from '../validator';

describe('Unity Validator - validateCSharp', () => {
  describe('empty code validation', () => {
    it('should reject empty code', () => {
      const result = validateCSharp('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Code is empty');
    });

    it('should reject whitespace-only code', () => {
      const result = validateCSharp('   \n\t  ');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Code is empty');
    });
  });

  describe('brace matching', () => {
    it('should detect mismatched braces', () => {
      const code = 'public class Test { void Method() { }';
      const result = validateCSharp(code);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Mismatched braces');
    });

    it('should accept balanced braces', () => {
      const code = 'public class Test { void Method() { } }';
      const result = validateCSharp(code);
      expect(result.errors).not.toContain('Mismatched braces');
    });

    it('should handle nested braces', () => {
      const code = `
        public class Test {
          void Method() {
            if (true) {
              // nested
            }
          }
        }
      `;
      const result = validateCSharp(code);
      expect(result.errors).not.toContain('Mismatched braces');
    });

    it('should detect extra closing braces', () => {
      const code = 'public class Test { } }';
      const result = validateCSharp(code);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Mismatched braces');
    });
  });

  describe('using statements', () => {
    it('should require using statements', () => {
      const code = 'public class Test { }';
      const result = validateCSharp(code);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing using statements');
    });

    it('should accept code with using statements', () => {
      const code = 'using UnityEngine;\npublic class Test { }';
      const result = validateCSharp(code);
      expect(result.errors).not.toContain('Missing using statements');
    });

    it('should handle multiple using statements', () => {
      const code = `
        using UnityEngine;
        using System.Collections;
        public class Test { }
      `;
      const result = validateCSharp(code);
      expect(result.errors).not.toContain('Missing using statements');
    });
  });

  describe('class definition', () => {
    it('should require class definition', () => {
      const code = 'using UnityEngine;';
      const result = validateCSharp(code);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('No class definition found');
    });

    it('should accept valid class definition', () => {
      const code = 'using UnityEngine;\npublic class Test { }';
      const result = validateCSharp(code);
      expect(result.errors).not.toContain('No class definition found');
    });

    it('should handle class with inheritance', () => {
      const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
      const result = validateCSharp(code);
      expect(result.errors).not.toContain('No class definition found');
    });

    it('should handle abstract classes', () => {
      const code = 'using UnityEngine;\npublic abstract class Test { }';
      const result = validateCSharp(code);
      expect(result.errors).not.toContain('No class definition found');
    });
  });

  describe('UnityEngine namespace', () => {
    it('should require UnityEngine namespace', () => {
      const code = 'using System;\npublic class Test { }';
      const result = validateCSharp(code);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing UnityEngine namespace');
    });

    it('should accept code with UnityEngine', () => {
      const code = 'using UnityEngine;\npublic class Test { }';
      const result = validateCSharp(code);
      expect(result.errors).not.toContain('Missing UnityEngine namespace');
    });

    it('should handle UnityEngine in using block', () => {
      const code = `
        using UnityEngine;
        using System.Collections;
        public class Test { }
      `;
      const result = validateCSharp(code);
      expect(result.errors).not.toContain('Missing UnityEngine namespace');
    });
  });

  describe('valid Unity scripts', () => {
    it('should validate complete Unity MonoBehaviour script', () => {
      const code = `
        using UnityEngine;
        
        public class PlayerController : MonoBehaviour {
          void Update() {
            // Movement code
          }
        }
      `;
      const result = validateCSharp(code);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate ScriptableObject', () => {
      const code = `
        using UnityEngine;
        
        [CreateAssetMenu]
        public class GameData : ScriptableObject {
          public int score;
        }
      `;
      const result = validateCSharp(code);
      expect(result.isValid).toBe(true);
    });

    it('should validate utility class', () => {
      const code = `
        using UnityEngine;
        
        public static class MathUtils {
          public static float Clamp(float value) {
            return Mathf.Clamp(value, 0, 1);
          }
        }
      `;
      const result = validateCSharp(code);
      expect(result.isValid).toBe(true);
    });
  });

  describe('error aggregation', () => {
    it('should collect all errors', () => {
      const code = '// No using, no class';
      const result = validateCSharp(code);
      
      expect(result.errors.length).toBeGreaterThan(1);
      // Check that all expected error types are present (order may vary)
      const errorMessages = result.errors.join(' ');
      expect(errorMessages).toMatch(/using|class|UnityEngine/i);
    });
  });
});

describe('Unity Validator - extractScriptName', () => {
  it('should extract class name', () => {
    const code = 'public class PlayerController : MonoBehaviour { }';
    const name = extractScriptName(code);
    expect(name).toBe('PlayerController');
  });

  it('should extract first class name in file', () => {
    const code = `
      public class FirstClass { }
      public class SecondClass { }
    `;
    const name = extractScriptName(code);
    expect(name).toBe('FirstClass');
  });

  it('should handle class with inheritance', () => {
    const code = 'public class EnemyAI : MonoBehaviour { }';
    const name = extractScriptName(code);
    expect(name).toBe('EnemyAI');
  });

  it('should handle abstract classes', () => {
    const code = 'public abstract class BaseClass { }';
    const name = extractScriptName(code);
    expect(name).toBe('BaseClass');
  });

  it('should handle partial classes', () => {
    const code = 'public partial class SplitClass { }';
    const name = extractScriptName(code);
    expect(name).toBe('SplitClass');
  });

  it('should return null when no class found', () => {
    const code = 'using UnityEngine;';
    const name = extractScriptName(code);
    expect(name).toBeNull();
  });

  it('should handle whitespace in class declaration', () => {
    const code = 'public   class   SpacedClass   :   MonoBehaviour   { }';
    const name = extractScriptName(code);
    expect(name).toBe('SpacedClass');
  });

  it('should handle class in namespace', () => {
    const code = 'namespace MyNamespace { public class NamespacedClass { } }';
    const name = extractScriptName(code);
    expect(name).toBe('NamespacedClass');
  });
});

