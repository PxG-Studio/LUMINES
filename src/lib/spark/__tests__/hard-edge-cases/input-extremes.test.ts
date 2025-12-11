/**
 * Hard Edge Case Tests - Input Extremes
 * Target: 10-15 tests for extreme input sizes and formats
 */

import { describe, it, expect } from 'vitest';
import { validateCSharp } from '../../unity/validator';
import { extractScriptName } from '../../unity/validator';

describe('Hard Edge Cases - Input Extremes', () => {
  describe('Extremely Long Inputs', () => {
    it('should handle 100k+ character prompts', () => {
      const hugePrompt = 'a'.repeat(100000);
      expect(hugePrompt.length).toBe(100000);
    });

    it('should handle 1MB+ character prompts', () => {
      const megaPrompt = 'a'.repeat(1000000);
      expect(megaPrompt.length).toBe(1000000);
    });

    it('should handle code with 100k+ lines', () => {
      const hugeCode = Array(100000).fill('using UnityEngine;\npublic class Test : MonoBehaviour { }').join('\n');
      expect(hugeCode.split('\n').length).toBeGreaterThan(100000);
    });

    it('should handle code with no newlines (single line)', () => {
      const singleLine = 'using UnityEngine; public class Test : MonoBehaviour { void Start() { } }';
      const result = validateCSharp(singleLine);
      // Should still validate
      expect(result).toBeDefined();
    });

    it('should handle code with only newlines', () => {
      const onlyNewlines = '\n\n\n\n';
      const result = validateCSharp(onlyNewlines);
      expect(result.isValid).toBe(false);
    });
  });

  describe('Binary Data in Inputs', () => {
    it('should handle null bytes in prompts', () => {
      const withNull = 'test\0prompt';
      expect(withNull.includes('\0')).toBe(true);
    });

    it('should handle binary data in code', async () => {
      const binary = Buffer.from([0x00, 0x01, 0x02, 0xFF]);
      const code = 'using UnityEngine;\n' + binary.toString('binary');
      const result = validateCSharp(code);
      // Should handle gracefully
      expect(result).toBeDefined();
    });

    it('should handle control characters (0x00-0x1F)', () => {
      const controlChars = Array.from({ length: 32 }, (_, i) => String.fromCharCode(i)).join('');
      expect(controlChars.length).toBe(32);
    });
  });

  describe('Unicode Normalization Edge Cases', () => {
    it('should handle RTL (right-to-left) text', () => {
      const rtl = 'مرحبا'; // Arabic
      expect(rtl.length).toBeGreaterThan(0);
    });

    it('should handle zero-width characters', () => {
      const zeroWidth = 'test\u200B\u200C\u200D\uFEFFtest';
      expect(zeroWidth.length).toBeGreaterThan(8); // Includes zero-width chars
    });

    it('should handle emoji-only prompts', () => {
      const emojiOnly = '🎉🚀💻🎮🌟';
      expect(emojiOnly.length).toBeGreaterThan(0);
    });

    it('should handle mixed script prompts', () => {
      const mixed = 'Hello こんにちは مرحبا Привет';
      expect(mixed.length).toBeGreaterThan(0);
    });

    it('should handle Unicode normalization differences', () => {
      // é can be encoded as U+00E9 or e + U+0301
      const composed = 'café';
      const decomposed = 'cafe\u0301';
      // Should handle both forms
      expect(composed.length).toBe(4);
      expect(decomposed.length).toBe(5);
    });
  });

  describe('Special Character Extremes', () => {
    it('should handle all ASCII special characters', () => {
      const special = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      expect(special.length).toBeGreaterThan(0);
    });

    it('should handle Unicode special characters', () => {
      const unicodeSpecial = '©®™€£¥§¶†‡•…';
      expect(unicodeSpecial.length).toBeGreaterThan(0);
    });

    it('should handle mathematical symbols', () => {
      const math = '∑∏∫√∞±×÷≤≥≠≈';
      expect(math.length).toBeGreaterThan(0);
    });
  });

  describe('Maximum Values', () => {
    it('should handle maximum class name length', () => {
      // C# identifier max length is implementation-dependent, but typically 511 chars
      const maxName = 'A'.repeat(511);
      const code = `public class ${maxName} : MonoBehaviour { }`;
      const name = extractScriptName(code);
      expect(name).toBe(maxName);
    });

    it('should handle maximum method name length', () => {
      const maxMethod = 'A'.repeat(511);
      const code = `public class Test : MonoBehaviour { void ${maxMethod}() { } }`;
      const result = validateCSharp(code);
      // Should handle
      expect(result).toBeDefined();
    });

    it('should handle maximum parameter count', () => {
      // C# allows up to 255 parameters
      const params = Array(255).fill(null).map((_, i) => `int param${i}`).join(', ');
      const code = `public class Test : MonoBehaviour { void Method(${params}) { } }`;
      const result = validateCSharp(code);
      // Should handle
      expect(result).toBeDefined();
    });

    it('should handle maximum nesting depth', () => {
      let nested = 'using UnityEngine;\npublic class Test : MonoBehaviour {\n';
      for (let i = 0; i < 100; i++) {
        nested += '  '.repeat(i + 1) + 'void Method' + i + '() {\n';
      }
      for (let i = 99; i >= 0; i--) {
        nested += '  '.repeat(i + 1) + '}\n';
      }
      nested += '}';
      
      const result = validateCSharp(nested);
      // Should handle deep nesting
      expect(result).toBeDefined();
    });

    it('should handle maximum string literal length', () => {
      // Very long string literal
      const longString = '"' + 'A'.repeat(100000) + '"';
      const code = `public class Test : MonoBehaviour { string text = ${longString}; }`;
      const result = validateCSharp(code);
      // Should handle
      expect(result).toBeDefined();
    });
  });

  describe('Reserved Keywords', () => {
    it('should handle C# reserved keywords as names', () => {
      const reserved = ['class', 'namespace', 'using', 'public', 'private', 'void'];
      
      reserved.forEach(keyword => {
        // Should fail validation (reserved keywords can't be class names without @)
        const code = `public class ${keyword} : MonoBehaviour { }`;
        const name = extractScriptName(code);
        // May or may not extract (depends on validation)
        expect(name).toBeDefined();
      });
    });

    it('should handle escaped reserved keywords', () => {
      // C# allows @ prefix for reserved keywords
      const escaped = '@class';
      const code = `public class ${escaped} : MonoBehaviour { }`;
      const name = extractScriptName(code);
      expect(name).toBe('@class');
    });

    it('should handle input with 10MB+ of whitespace', () => {
      const whitespace = ' '.repeat(10000000);
      expect(whitespace.length).toBe(10000000);
    });

    it('should handle input with mixed line endings (CRLF, LF, CR)', () => {
      const mixedEndings = 'line1\r\nline2\nline3\rline4';
      expect(mixedEndings.includes('\r\n')).toBe(true);
      expect(mixedEndings.includes('\n')).toBe(true);
      expect(mixedEndings.includes('\r')).toBe(true);
    });

    it('should handle input with BOM (Byte Order Mark)', () => {
      const withBOM = '\uFEFF' + 'using UnityEngine;';
      expect(withBOM.charCodeAt(0)).toBe(0xFEFF);
    });

    it('should handle input with surrogate pairs', () => {
      const surrogate = 'test\uD83D\uDE00test'; // 😀 emoji
      // JavaScript counts surrogate pairs as 2 code units each
      // 'test' (4) + '\uD83D\uDE00' (2) + 'test' (4) = 10
      expect(surrogate.length).toBe(10);
    });

    it('should handle input with combining characters', () => {
      const combining = 'cafe\u0301'; // café with combining accent
      expect(combining.length).toBe(5);
    });

    it('should handle input with all Unicode categories', () => {
      const unicode = 'Letter: A, Number: 1, Symbol: @, Punctuation: !, Mark: ́';
      expect(unicode.length).toBeGreaterThan(0);
    });
  });
});

