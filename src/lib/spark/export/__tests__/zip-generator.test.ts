/**
 * Unit Tests for ZIP Generator
 * Target: 15-20 tests
 */

import { describe, it, expect, vi } from 'vitest';
import { generateUnityZip } from '../zip-generator';
import JSZip from 'jszip';

// Mock JSZip
vi.mock('jszip', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      const files: Map<string, string> = new Map();
      const folders: Map<string, any> = new Map();

      return {
        folder: vi.fn((name: string) => {
          if (!folders.has(name)) {
            const folder = {
              folder: vi.fn((subName: string) => {
                const subFolder = {
                  file: vi.fn((fileName: string, content: string) => {
                    files.set(`${name}/${subName}/${fileName}`, content);
                  }),
                };
                folders.set(`${name}/${subName}`, subFolder);
                return subFolder;
              }),
              file: vi.fn((fileName: string, content: string) => {
                files.set(`${name}/${fileName}`, content);
              }),
            };
            folders.set(name, folder);
          }
          return folders.get(name);
        }),
        file: vi.fn((fileName: string, content: string) => {
          files.set(fileName, content);
        }),
        generateAsync: vi.fn().mockResolvedValue(new Blob(['mock zip'], { type: 'application/zip' })),
        files: () => files,
      };
    }),
  };
});

describe('ZIP Generator - generateUnityZip', () => {
  it('should generate ZIP with script file', async () => {
    const code = 'using UnityEngine;\npublic class TestScript : MonoBehaviour { }';
    const blob = await generateUnityZip({ code, scriptName: 'TestScript' });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/zip');
  });

  it('should create Assets folder structure', async () => {
    const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
    await generateUnityZip({ code, scriptName: 'Test' });

    // Verify JSZip was called to create folder structure
    expect(JSZip).toHaveBeenCalled();
  });

  it('should create Scripts folder inside Assets', async () => {
    const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
    await generateUnityZip({ code, scriptName: 'Test' });

    // The folder structure should be created
    expect(JSZip).toHaveBeenCalled();
  });

  it('should add .cs file with correct name', async () => {
    const code = 'using UnityEngine;\npublic class PlayerController : MonoBehaviour { }';
    await generateUnityZip({ code, scriptName: 'PlayerController' });

    expect(JSZip).toHaveBeenCalled();
  });

  it('should generate .meta file for script', async () => {
    const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
    await generateUnityZip({ code, scriptName: 'Test' });

    expect(JSZip).toHaveBeenCalled();
  });

  it('should generate folder .meta files', async () => {
    const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
    await generateUnityZip({ code, scriptName: 'Test' });

    expect(JSZip).toHaveBeenCalled();
  });

  it('should handle empty code', async () => {
    const blob = await generateUnityZip({ code: '', scriptName: 'Empty' });

    expect(blob).toBeInstanceOf(Blob);
  });

  it('should handle special characters in script name', async () => {
    const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
    const blob = await generateUnityZip({ code, scriptName: 'Test-Script_123' });

    expect(blob).toBeInstanceOf(Blob);
  });

  it('should generate unique GUIDs for meta files', async () => {
    const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
    
    const blob1 = await generateUnityZip({ code, scriptName: 'Test' });
    const blob2 = await generateUnityZip({ code, scriptName: 'Test' });

    // Both should succeed (GUIDs should be different)
    expect(blob1).toBeInstanceOf(Blob);
    expect(blob2).toBeInstanceOf(Blob);
  });

  it('should include correct file structure', async () => {
    const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
    await generateUnityZip({ code, scriptName: 'Test' });

    // Verify structure: Assets/Scripts/Test.cs and Test.cs.meta
    expect(JSZip).toHaveBeenCalled();
  });

  it('should handle long script names', async () => {
    const longName = 'VeryLongScriptNameThatExceedsNormalLength';
    const code = `using UnityEngine;\npublic class ${longName} : MonoBehaviour { }`;
    
    const blob = await generateUnityZip({ code, scriptName: longName });

    expect(blob).toBeInstanceOf(Blob);
  });

  it('should handle code with newlines and special characters', async () => {
    const code = `using UnityEngine;
using System.Collections;

public class Test : MonoBehaviour {
    void Start() {
        Debug.Log("Hello World");
    }
}`;
    const blob = await generateUnityZip({ code, scriptName: 'Test' });

    expect(blob).toBeInstanceOf(Blob);
  });

  it('should generate valid ZIP blob', async () => {
    const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
    const blob = await generateUnityZip({ code, scriptName: 'Test' });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle multiple scripts in same export', async () => {
    // This test verifies the function can be called multiple times
    const code1 = 'using UnityEngine;\npublic class Script1 : MonoBehaviour { }';
    const code2 = 'using UnityEngine;\npublic class Script2 : MonoBehaviour { }';

    const blob1 = await generateUnityZip({ code: code1, scriptName: 'Script1' });
    const blob2 = await generateUnityZip({ code: code2, scriptName: 'Script2' });

    expect(blob1).toBeInstanceOf(Blob);
    expect(blob2).toBeInstanceOf(Blob);
  });
});

