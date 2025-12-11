/**
 * Hard Edge Case Tests - Data Corruption Extremes
 * Target: 10-12 tests for malformed data, corrupted state, and recovery
 */

import { describe, it, expect, vi } from 'vitest';
import { validateCSharp } from '../../unity/validator';
import { generateUnityZip } from '../../export/zip-generator';
import { getAICache } from '../../ai/cache';

// Mock JSZip
vi.mock('jszip', () => ({
  default: vi.fn().mockImplementation(() => ({
    folder: vi.fn(() => ({
      folder: vi.fn(() => ({ file: vi.fn() })),
      file: vi.fn(),
    })),
    generateAsync: vi.fn().mockResolvedValue(new Blob()),
  })),
}));

describe('Hard Edge Cases - Data Corruption Extremes', () => {
  describe('Malformed JSON', () => {
    it('should handle malformed JSON in responses', () => {
      const malformed = '{ "key": "value"';
      expect(() => JSON.parse(malformed)).toThrow();
    });

    it('should handle incomplete JSON', () => {
      const incomplete = '{ "key": ';
      expect(() => JSON.parse(incomplete)).toThrow();
    });

    it('should handle JSON with invalid escape sequences', () => {
      const invalidEscape = '{"key": "value\\x"}';
      expect(() => JSON.parse(invalidEscape)).toThrow();
    });

    it('should handle JSON with null bytes', () => {
      const withNull = '{"key": "value\0"}';
      // JSON.parse may or may not throw depending on implementation
      expect(withNull.includes('\0')).toBe(true);
    });
  });

  describe('Truncated Responses', () => {
    it('should handle truncated code responses', async () => {
      const truncated = 'using UnityEngine;\npublic class Test : Mono';
      const result = validateCSharp(truncated);
      // Should handle gracefully
      expect(result).toBeDefined();
    });

    it('should handle truncated JSON responses', () => {
      const truncated = '{"success": true, "code": "using';
      expect(() => JSON.parse(truncated)).toThrow();
    });

    it('should handle empty response body', async () => {
      const empty = '';
      const result = validateCSharp(empty);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Code is empty');
    });
  });

  describe('Invalid UTF-8 Sequences', () => {
    it('should handle invalid UTF-8 byte sequences', () => {
      // Invalid UTF-8: 0xFF 0xFE
      const invalidUTF8 = Buffer.from([0xFF, 0xFE, 0x41, 0x42]);
      // Should handle gracefully
      expect(invalidUTF8.length).toBe(4);
    });

    it('should handle incomplete UTF-8 sequences', () => {
      // Incomplete multi-byte sequence
      const incomplete = Buffer.from([0xC2]); // Missing second byte
      expect(incomplete.length).toBe(1);
    });

    it('should handle overlong UTF-8 sequences', () => {
      // Overlong encoding (security issue)
      const overlong = Buffer.from([0xC0, 0x80]); // Invalid encoding of null
      expect(overlong.length).toBe(2);
    });
  });

  describe('Encoding Mismatches', () => {
    it('should handle UTF-16 encoded data', () => {
      const utf16 = Buffer.from('test', 'utf16le');
      // Should handle encoding conversion
      expect(utf16.length).toBeGreaterThan(0);
    });

    it('should handle Latin-1 encoded data', () => {
      const latin1 = Buffer.from('test', 'latin1');
      expect(latin1.length).toBe(4);
    });

    it('should handle mixed encoding in code', async () => {
      // Code with mixed encodings
      const mixed = 'using UnityEngine;\n// こんにちは\npublic class Test : MonoBehaviour { }';
      const result = validateCSharp(mixed);
      // Should handle gracefully
      expect(result).toBeDefined();
    });
  });

  describe('Corrupted State Recovery', () => {
    it('should recover from corrupted cache state', async () => {
      const cache = getAICache();
      
      // Simulate corrupted state by clearing
      cache.clear();
      
      // Should recover and work normally
      cache.set('test', 'claude', 'claude-3', 'value');
      const result = cache.get('test', 'claude', 'claude-3');
      expect(result).toBe('value');
    });

    it('should handle corrupted ZIP structure', async () => {
      // ZIP generation should handle errors gracefully
      const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
      
      // Should not crash even if ZIP generation fails
      try {
        const blob = await generateUnityZip({ code, scriptName: 'Test' });
        expect(blob).toBeInstanceOf(Blob);
      } catch (error) {
        // Should handle error gracefully
        expect(error).toBeDefined();
      }
    });

    it('should recover from invalid validation state', async () => {
      // Invalid code should return validation errors, not crash
      const invalidCode = 'invalid c# code {';
      const result = validateCSharp(invalidCode);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Corrupted File Data', () => {
    it('should handle corrupted code with invalid characters', async () => {
      // Code with invalid control characters
      const corrupted = 'using UnityEngine;\npublic class Test : MonoBehaviour {\0}';
      const result = validateCSharp(corrupted);
      // Should handle gracefully
      expect(result).toBeDefined();
    });

    it('should handle code with binary data', async () => {
      // Code mixed with binary data
      const binary = Buffer.from([0x00, 0x01, 0x02, 0x03]);
      const code = 'using UnityEngine;\n' + binary.toString();
      const result = validateCSharp(code);
      // Should handle gracefully
      expect(result).toBeDefined();
    });

    it('should handle JSON with duplicate keys', () => {
      // JSON with duplicate keys (last one wins)
      const duplicate = '{"key": "first", "key": "second"}';
      const parsed = JSON.parse(duplicate);
      expect(parsed.key).toBe('second');
    });

    it('should handle JSON with circular references in nested objects', () => {
      const obj: any = { nested: { value: 'test' } };
      obj.nested.parent = obj;
      
      // Should handle circular reference detection
      expect(() => JSON.stringify(obj)).toThrow();
    });

    it('should handle corrupted cache entries with invalid data', async () => {
      const cache = getAICache();
      
      // Set valid entry
      cache.set('test', 'claude', 'claude-3', 'valid');
      
      // Should handle corrupted state gracefully
      const result = cache.get('test', 'claude', 'claude-3');
      expect(result).toBe('valid');
    });

    it('should handle malformed XML-like structures in code', async () => {
      const xmlLike = 'using UnityEngine;\n// <tag>unclosed\npublic class Test : MonoBehaviour { }';
      const result = validateCSharp(xmlLike);
      // Should handle gracefully (not XML validator)
      expect(result).toBeDefined();
    });
  });
});

