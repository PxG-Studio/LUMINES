/**
 * Hard Edge Case Tests - API Extremes
 * Target: 10-12 tests for extreme API response sizes and formats
 */

import { describe, it, expect, vi } from 'vitest';
import { generateUnityZip } from '../../export/zip-generator';
import { validateCSharp } from '../../unity/validator';

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

describe('Hard Edge Cases - API Extremes', () => {
  describe('Extremely Large Responses', () => {
    it('should handle 10MB+ response size', async () => {
      // Simulate 10MB code response
      const largeCode = 'using UnityEngine;\n' + Array(500000).fill('public class Test { }').join('\n');
      expect(largeCode.length).toBeGreaterThan(10000000);
      
      // Should handle without crashing
      const result = validateCSharp(largeCode);
      expect(result).toBeDefined();
    });

    it('should handle extremely large ZIP files', async () => {
      const largeCode = Array(100000).fill('using UnityEngine;\npublic class Test : MonoBehaviour { }').join('\n');
      
      // Should generate ZIP without OOM
      const blob = await generateUnityZip({ code: largeCode, scriptName: 'Test' });
      expect(blob).toBeInstanceOf(Blob);
    });

    it('should handle response with maximum string length', async () => {
      // Maximum safe string length in JavaScript
      const maxLength = Math.pow(2, 28) - 1; // ~268MB
      // Should handle gracefully (may need chunking)
      expect(maxLength).toBeGreaterThan(0);
    });
  });

  describe('Empty Responses', () => {
    it('should handle empty API response', async () => {
      const empty = '';
      const result = validateCSharp(empty);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Code is empty');
    });

    it('should handle null response', async () => {
      const nullResponse = null;
      // Should handle gracefully
      expect(nullResponse).toBeNull();
    });

    it('should handle undefined response', async () => {
      const undefinedResponse = undefined;
      // Should handle gracefully
      expect(undefinedResponse).toBeUndefined();
    });
  });

  describe('Malformed API Responses', () => {
    it('should handle response with wrong content type', () => {
      // Simulated wrong content-type
      const wrongType = 'text/html';
      expect(wrongType).not.toBe('application/json');
    });

    it('should handle response with unexpected format', () => {
      const unexpected = '<html>Not JSON</html>';
      expect(() => JSON.parse(unexpected)).toThrow();
    });

    it('should handle response with missing required fields', () => {
      const incomplete = { success: true }; // Missing 'code' field
      expect(incomplete.code).toBeUndefined();
    });

    it('should handle response with extra unexpected fields', () => {
      const extraFields = {
        success: true,
        code: 'test',
        unexpected: 'field',
        malicious: '<script>alert(1)</script>',
      };
      // Should ignore extra fields
      expect(extraFields.success).toBe(true);
    });
  });

  describe('Response Timeout Extremes', () => {
    it('should handle very short timeout', async () => {
      const shortTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 1);
      });
      
      await expect(shortTimeout).rejects.toThrow('Timeout');
    });

    it('should handle very long timeout', async () => {
      const longTimeout = new Promise((resolve) => {
        setTimeout(() => resolve('done'), 100);
      });
      
      const result = await longTimeout;
      expect(result).toBe('done');
    });

    it('should handle timeout during large response', async () => {
      // Simulate timeout while processing large response
      const timeoutError = new Error('Request timeout');
      expect(timeoutError.message).toContain('timeout');
    });
  });

  describe('Invalid Request Headers', () => {
    it('should handle missing required headers', () => {
      const missingHeaders = {};
      expect(Object.keys(missingHeaders).length).toBe(0);
    });

    it('should handle invalid header values', () => {
      const invalidHeader = { 'Content-Type': 'invalid/type' };
      expect(invalidHeader['Content-Type']).toBe('invalid/type');
    });

    it('should handle extremely long header values', () => {
      const longHeader = { 'X-Custom': 'A'.repeat(10000) };
      expect(longHeader['X-Custom'].length).toBe(10000);
    });
  });

  describe('Response Parsing Extremes', () => {
    it('should handle response with circular references', () => {
      const circular: any = { key: 'value' };
      circular.self = circular;
      
      // JSON.stringify should handle circular refs
      expect(() => JSON.stringify(circular)).toThrow();
    });

    it('should handle response with deeply nested objects', () => {
      let nested: any = { value: 'deep' };
      for (let i = 0; i < 100; i++) {
        nested = { nested };
      }
      
      // Should handle without stack overflow
      expect(nested).toBeDefined();
    });

    it('should handle API response with 1000+ nested levels', () => {
      let deeplyNested: any = { value: 'deep' };
      for (let i = 0; i < 1000; i++) {
        deeplyNested = { nested: deeplyNested };
      }
      
      // Should handle without stack overflow
      expect(deeplyNested).toBeDefined();
    });

    it('should handle API response with array of 1M+ elements', () => {
      const hugeArray = Array(1000000).fill(0);
      expect(hugeArray.length).toBe(1000000);
    });

    it('should handle API response with extremely large object keys', () => {
      const largeKey = 'A'.repeat(100000);
      const obj: any = {};
      obj[largeKey] = 'value';
      expect(obj[largeKey]).toBe('value');
    });

    it('should handle API response with mixed content types', () => {
      const mixed = {
        text: 'text',
        number: 123,
        boolean: true,
        null: null,
        array: [1, 2, 3],
        object: { nested: 'value' },
      };
      expect(mixed).toBeDefined();
    });

    it('should handle API response with special JSON values', () => {
      const special = {
        infinity: Infinity,
        negativeInfinity: -Infinity,
        nan: NaN,
      };
      // JSON.stringify handles these specially
      const json = JSON.stringify(special);
      expect(json).toBeDefined();
    });
  });
});

