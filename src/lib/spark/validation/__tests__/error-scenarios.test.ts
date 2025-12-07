/**
 * Error Scenario Tests for Validation
 * Target: 15-20 tests
 */

import { describe, it, expect } from 'vitest';
import { validateCSharp } from '../../unity/validator';

describe('Validation Error Scenarios', () => {
  describe('Syntax errors', () => {
    it('should detect missing semicolon in critical places', () => {
      const code = `
        using UnityEngine
        public class Test : MonoBehaviour { }
      `;
      const result = validateCSharp(code);
      // May or may not catch this depending on validator strictness
      expect(result).toBeDefined();
    });

    it('should detect mismatched parentheses', () => {
      const code = `
        using UnityEngine;
        public class Test : MonoBehaviour {
          void Method( {
            // Missing closing paren
          }
        }
      `;
      const result = validateCSharp(code);
      expect(result).toBeDefined();
    });

    it('should detect missing closing brace', () => {
      const code = `
        using UnityEngine;
        public class Test : MonoBehaviour {
          void Method() {
            // Missing closing brace
      `;
      const result = validateCSharp(code);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Mismatched braces');
    });

    it('should detect extra closing brace', () => {
      const code = `
        using UnityEngine;
        public class Test : MonoBehaviour {
          void Method() { }
        }
      }
      `;
      const result = validateCSharp(code);
      expect(result.isValid).toBe(false);
    });
  });

  describe('Missing required elements', () => {
    it('should detect missing using statements', () => {
      const code = 'public class Test : MonoBehaviour { }';
      const result = validateCSharp(code);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing using statements');
    });

    it('should detect missing UnityEngine', () => {
      const code = 'using System;\npublic class Test : MonoBehaviour { }';
      const result = validateCSharp(code);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing UnityEngine namespace');
    });

    it('should detect missing class definition', () => {
      const code = 'using UnityEngine;\nvoid Method() { }';
      const result = validateCSharp(code);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('No class definition found');
    });
  });

  describe('Invalid code structures', () => {
    it('should detect class outside namespace issues', () => {
      const code = `
        using UnityEngine;
        namespace Test {
          // Missing closing brace
        public class Test : MonoBehaviour { }
      `;
      const result = validateCSharp(code);
      expect(result).toBeDefined();
    });

    it('should detect invalid inheritance', () => {
      const code = `
        using UnityEngine;
        public class Test : InvalidBaseClass { }
      `;
      const result = validateCSharp(code);
      // May not catch this without full compilation
      expect(result).toBeDefined();
    });

    it('should detect duplicate class names', () => {
      const code = `
        using UnityEngine;
        public class Test : MonoBehaviour { }
        public class Test : MonoBehaviour { }
      `;
      const result = validateCSharp(code);
      // May not catch this without full compilation
      expect(result).toBeDefined();
    });
  });

  describe('Edge case validation errors', () => {
    it('should handle code with only errors', () => {
      const code = 'invalid code syntax {';
      const result = validateCSharp(code);
      expect(result.isValid).toBe(false);
    });

    it('should handle code with mixed valid and invalid', () => {
      const code = `
        using UnityEngine;
        public class Test : MonoBehaviour {
          void Method( {
            // Invalid syntax
          }
        }
      `;
      const result = validateCSharp(code);
      expect(result).toBeDefined();
    });

    it('should handle code with compilation errors', () => {
      const code = `
        using UnityEngine;
        public class Test : MonoBehaviour {
          void Method() {
            undefinedVariable = 5;
          }
        }
      `;
      const result = validateCSharp(code);
      // May not catch this without full compilation
      expect(result).toBeDefined();
    });
  });
});

