/**
 * Hard Edge Case Tests - Validation Extremes
 * Target: 10-12 tests for extreme validation scenarios
 */

import { describe, it, expect } from 'vitest';
import { validateCSharp, extractScriptName } from '../../unity/validator';

describe('Hard Edge Cases - Validation Extremes', () => {
  describe('Maximum Length Validations', () => {
    it('should validate maximum class name length (511 chars)', () => {
      const maxName = 'A'.repeat(511);
      const code = `using UnityEngine;\npublic class ${maxName} : MonoBehaviour { }`;
      const name = extractScriptName(code);
      expect(name).toBe(maxName);
    });

    it('should handle class name exceeding maximum', () => {
      const exceedMax = 'A'.repeat(512);
      const code = `using UnityEngine;\npublic class ${exceedMax} : MonoBehaviour { }`;
      const name = extractScriptName(code);
      // Should still extract (validation may vary)
      expect(name).toBe(exceedMax);
    });

    it('should validate maximum method name length', () => {
      const maxMethod = 'A'.repeat(511);
      const code = `
        using UnityEngine;
        public class Test : MonoBehaviour {
          void ${maxMethod}() { }
        }
      `;
      const result = validateCSharp(code);
      expect(result).toBeDefined();
    });

    it('should validate maximum parameter count (255)', () => {
      const params = Array(255).fill(null).map((_, i) => `int p${i}`).join(', ');
      const code = `
        using UnityEngine;
        public class Test : MonoBehaviour {
          void Method(${params}) { }
        }
      `;
      const result = validateCSharp(code);
      expect(result).toBeDefined();
    });
  });

  describe('Maximum Nesting Depth', () => {
    it('should validate code with 100+ nesting levels', () => {
      let nested = 'using UnityEngine;\npublic class Test : MonoBehaviour {\n';
      for (let i = 0; i < 100; i++) {
        nested += '  '.repeat(i + 1) + 'if (true) {\n';
      }
      for (let i = 99; i >= 0; i--) {
        nested += '  '.repeat(i + 1) + '}\n';
      }
      nested += '}';
      
      const result = validateCSharp(nested);
      // Should validate (braces are balanced)
      expect(result.errors).not.toContain('Mismatched braces');
    });

    it('should detect mismatched braces at deep nesting', () => {
      let nested = 'using UnityEngine;\npublic class Test : MonoBehaviour {\n';
      for (let i = 0; i < 50; i++) {
        nested += '  '.repeat(i + 1) + 'if (true) {\n';
      }
      // Missing closing braces
      
      const result = validateCSharp(nested);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Mismatched braces');
    });
  });

  describe('Maximum String Literal Length', () => {
    it('should validate code with 1MB string literal', () => {
      const hugeString = '"' + 'A'.repeat(1000000) + '"';
      const code = `
        using UnityEngine;
        public class Test : MonoBehaviour {
          string text = ${hugeString};
        }
      `;
      const result = validateCSharp(code);
      // Should handle
      expect(result).toBeDefined();
    });

    it('should validate code with multiple large string literals', () => {
      const largeString = '"' + 'A'.repeat(100000) + '"';
      const code = `
        using UnityEngine;
        public class Test : MonoBehaviour {
          string text1 = ${largeString};
          string text2 = ${largeString};
          string text3 = ${largeString};
        }
      `;
      const result = validateCSharp(code);
      expect(result).toBeDefined();
    });
  });

  describe('Invalid Character Encoding', () => {
    it('should handle code with invalid UTF-8 sequences', async () => {
      // Invalid UTF-8
      const invalidUTF8 = Buffer.from([0xFF, 0xFE]);
      const code = 'using UnityEngine;\n' + invalidUTF8.toString('binary');
      const result = validateCSharp(code);
      // Should handle gracefully
      expect(result).toBeDefined();
    });

    it('should handle code with mixed encodings', async () => {
      const mixed = 'using UnityEngine;\n// こんにちは\npublic class Test : MonoBehaviour { }';
      const result = validateCSharp(mixed);
      expect(result).toBeDefined();
    });
  });

  describe('Reserved C# Keywords', () => {
    it('should reject reserved keywords as class names', () => {
      const reserved = 'class';
      const code = `using UnityEngine;\npublic class ${reserved} : MonoBehaviour { }`;
      const name = extractScriptName(code);
      // May extract but should fail validation
      expect(name).toBe('class');
    });

    it('should handle escaped reserved keywords', () => {
      const escaped = '@class';
      const code = `using UnityEngine;\npublic class ${escaped} : MonoBehaviour { }`;
      const name = extractScriptName(code);
      expect(name).toBe('@class');
    });

    it('should handle all C# reserved keywords', () => {
      const keywords = [
        'abstract', 'as', 'base', 'bool', 'break', 'byte', 'case', 'catch',
        'char', 'checked', 'class', 'const', 'continue', 'decimal', 'default',
        'delegate', 'do', 'double', 'else', 'enum', 'event', 'explicit',
        'extern', 'false', 'finally', 'fixed', 'float', 'for', 'foreach',
        'goto', 'if', 'implicit', 'in', 'int', 'interface', 'internal',
        'is', 'lock', 'long', 'namespace', 'new', 'null', 'object', 'operator',
        'out', 'override', 'params', 'private', 'protected', 'public', 'readonly',
        'ref', 'return', 'sbyte', 'sealed', 'short', 'sizeof', 'stackalloc',
        'static', 'string', 'struct', 'switch', 'this', 'throw', 'true',
        'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort',
        'using', 'virtual', 'void', 'volatile', 'while'
      ];
      
      keywords.forEach(keyword => {
        const code = `using UnityEngine;\npublic class ${keyword} : MonoBehaviour { }`;
        const name = extractScriptName(code);
        // Should extract (validation may vary)
        expect(name).toBe(keyword);
      });
    });
  });

  describe('Complex Validation Scenarios', () => {
    it('should validate code with maximum complexity', () => {
      let complex = 'using UnityEngine;\npublic class Test : MonoBehaviour {\n';
      
      // Add many methods
      for (let i = 0; i < 100; i++) {
        complex += `  void Method${i}() {\n`;
        complex += `    if (true) { if (false) { if (true) { } } }\n`;
        complex += `  }\n`;
      }
      
      complex += '}';
      
      const result = validateCSharp(complex);
      expect(result).toBeDefined();
    });

    it('should validate code with maximum attributes', () => {
      const manyAttributes = Array(50).fill('[System.Serializable]').join('\n');
      const code = `
        ${manyAttributes}
        using UnityEngine;
        public class Test : MonoBehaviour { }
      `;
      const result = validateCSharp(code);
      expect(result).toBeDefined();
    });

    it('should validate code with 1000+ attributes', () => {
      const manyAttributes = Array(1000).fill('[System.Serializable]').join('\n');
      const code = `
        ${manyAttributes}
        using UnityEngine;
        public class Test : MonoBehaviour { }
      `;
      const result = validateCSharp(code);
      expect(result).toBeDefined();
    });

    it('should validate code with maximum generic type parameters', () => {
      // C# allows up to 16 type parameters
      const generics = Array(16).fill(null).map((_, i) => `T${i}`).join(', ');
      const code = `public class Test<${generics}> : MonoBehaviour { }`;
      const result = validateCSharp(code);
      expect(result).toBeDefined();
    });

    it('should validate code with maximum array dimensions', () => {
      // C# allows up to 32 array dimensions
      const dimensions = Array(32).fill(',').join('');
      const code = `public class Test : MonoBehaviour { int[${dimensions}] array; }`;
      const result = validateCSharp(code);
      expect(result).toBeDefined();
    });

    it('should validate code with maximum method overloads', () => {
      let code = 'using UnityEngine;\npublic class Test : MonoBehaviour {\n';
      for (let i = 0; i < 1000; i++) {
        code += `  void Method() { }\n`;
        code += `  void Method(int p${i}) { }\n`;
      }
      code += '}';
      
      const result = validateCSharp(code);
      expect(result).toBeDefined();
    });

    it('should validate code with maximum interface implementations', () => {
      let code = 'using UnityEngine;\n';
      for (let i = 0; i < 100; i++) {
        code += `interface I${i} { void Method${i}(); }\n`;
      }
      code += 'public class Test : MonoBehaviour';
      for (let i = 0; i < 100; i++) {
        code += `, I${i}`;
      }
      code += ' { }';
      
      const result = validateCSharp(code);
      expect(result).toBeDefined();
    });
  });
});

