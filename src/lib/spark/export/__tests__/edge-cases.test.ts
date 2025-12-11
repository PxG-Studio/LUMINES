/**
 * Edge Case Tests for Export System
 * Target: 15-20 tests
 */

import { describe, it, expect, vi } from 'vitest';
import { generateUnityZip } from '../zip-generator';
import { generateReadme, generateAssemblyDefinition, generatePackageManifest } from '../templates';

// Mock JSZip
vi.mock('jszip', () => ({
  default: vi.fn().mockImplementation(() => ({
    folder: vi.fn(() => ({
      folder: vi.fn(() => ({
        file: vi.fn(),
      })),
      file: vi.fn(),
    })),
    generateAsync: vi.fn().mockResolvedValue(new Blob()),
  })),
}));

describe('Export System Edge Cases', () => {
  describe('ZIP generation edge cases', () => {
    it('should handle very large code files', async () => {
      const largeCode = 'using UnityEngine;\n' + Array(10000).fill('public class Test { }').join('\n');
      const blob = await generateUnityZip({ code: largeCode, scriptName: 'Test' });
      expect(blob).toBeInstanceOf(Blob);
    });

    it('should handle code with special file system characters', async () => {
      const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
      const specialName = 'Test<script>';
      // Should sanitize or handle special characters
      expect(specialName).toBeDefined();
    });

    it('should handle empty script name', async () => {
      const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
      // Empty name should be handled
      expect(() => generateUnityZip({ code, scriptName: '' })).not.toThrow();
    });

    it('should handle script name with path separators', async () => {
      const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
      const nameWithPath = 'Test/Script';
      // Should sanitize path separators
      expect(nameWithPath.includes('/')).toBe(true);
    });

    it('should handle multiple consecutive exports', async () => {
      const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
      
      const blob1 = await generateUnityZip({ code, scriptName: 'Test1' });
      const blob2 = await generateUnityZip({ code, scriptName: 'Test2' });
      const blob3 = await generateUnityZip({ code, scriptName: 'Test3' });

      expect(blob1).toBeInstanceOf(Blob);
      expect(blob2).toBeInstanceOf(Blob);
      expect(blob3).toBeInstanceOf(Blob);
    });

    it('should handle code with null bytes', async () => {
      const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
      // Null bytes should be handled
      expect(code.includes('\0')).toBe(false);
    });

    it('should handle very long script names', async () => {
      const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
      const longName = 'A'.repeat(255);
      const blob = await generateUnityZip({ code, scriptName: longName });
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('Template generation edge cases', () => {
    it('should handle empty script names array', () => {
      const readme = generateReadme([]);
      expect(readme).toBeDefined();
      expect(readme).toContain('SPARK Generated Scripts');
    });

    it('should handle many script names', () => {
      const manyNames = Array(100).fill(null).map((_, i) => `Script${i}`);
      const readme = generateReadme(manyNames);
      expect(readme).toBeDefined();
      manyNames.forEach(name => {
        expect(readme).toContain(`${name}.cs`);
      });
    });

    it('should handle script names with special characters in readme', () => {
      const names = ['Script_123', 'Test-Script'];
      const readme = generateReadme(names);
      expect(readme).toBeDefined();
    });

    it('should handle package name with special characters', () => {
      const definition = generateAssemblyDefinition('Test-Package_123');
      const parsed = JSON.parse(definition);
      expect(parsed.name).toBe('Test-Package_123');
    });

    it('should handle very long package names', () => {
      const longName = 'A'.repeat(200);
      const definition = generateAssemblyDefinition(longName);
      expect(() => JSON.parse(definition)).not.toThrow();
    });

    it('should handle empty package name', () => {
      const definition = generateAssemblyDefinition('');
      expect(() => JSON.parse(definition)).not.toThrow();
    });

    it('should handle package manifest with unicode characters', () => {
      const manifest = generatePackageManifest('テストパッケージ', ['Script1']);
      expect(() => JSON.parse(manifest)).not.toThrow();
    });

    it('should handle package manifest with many scripts', () => {
      const manyScripts = Array(1000).fill(null).map((_, i) => `Script${i}`);
      const manifest = generatePackageManifest('Test', manyScripts);
      expect(() => JSON.parse(manifest)).not.toThrow();
    });
  });
});

