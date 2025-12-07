/**
 * Unit Tests for Export Templates
 * Target: 12-15 tests
 */

import { describe, it, expect } from 'vitest';
import {
  DEFAULT_TEMPLATE,
  PACKAGE_TEMPLATE,
  ORGANIZED_TEMPLATE,
  generateReadme,
  generateAssemblyDefinition,
  generatePackageManifest,
  type ExportTemplate,
} from '../templates';

describe('Export Templates', () => {
  describe('DEFAULT_TEMPLATE', () => {
    it('should have correct structure', () => {
      expect(DEFAULT_TEMPLATE.name).toBe('Standard');
      expect(DEFAULT_TEMPLATE.includeReadme).toBe(false);
      expect(DEFAULT_TEMPLATE.includeAssemblyDefinition).toBe(false);
      expect(DEFAULT_TEMPLATE.folderStructure).toEqual(['Assets', 'Scripts']);
    });
  });

  describe('PACKAGE_TEMPLATE', () => {
    it('should have correct structure', () => {
      expect(PACKAGE_TEMPLATE.name).toBe('Unity Package');
      expect(PACKAGE_TEMPLATE.includeReadme).toBe(true);
      expect(PACKAGE_TEMPLATE.includeAssemblyDefinition).toBe(true);
      expect(PACKAGE_TEMPLATE.includePackageManifest).toBe(true);
      expect(PACKAGE_TEMPLATE.folderStructure).toEqual(['Packages', 'com.spark.generated', 'Runtime']);
    });
  });

  describe('ORGANIZED_TEMPLATE', () => {
    it('should have correct structure', () => {
      expect(ORGANIZED_TEMPLATE.name).toBe('Organized');
      expect(ORGANIZED_TEMPLATE.includeReadme).toBe(true);
      expect(ORGANIZED_TEMPLATE.includeAssemblyDefinition).toBe(false);
      expect(ORGANIZED_TEMPLATE.folderStructure).toEqual(['Assets', 'Scripts', 'Generated']);
    });
  });
});

describe('generateReadme', () => {
  it('should generate readme with script names', () => {
    const scriptNames = ['PlayerController', 'EnemyAI'];
    const readme = generateReadme(scriptNames);

    expect(readme).toContain('SPARK Generated Scripts');
    expect(readme).toContain('PlayerController.cs');
    expect(readme).toContain('EnemyAI.cs');
  });

  it('should include installation instructions', () => {
    const readme = generateReadme(['Test']);
    
    expect(readme).toContain('Installation');
    expect(readme).toContain('Extract this ZIP file');
  });

  it('should include usage instructions', () => {
    const readme = generateReadme(['Test']);
    
    expect(readme).toContain('Usage');
    expect(readme).toContain('Attach scripts');
  });

  it('should handle empty script list', () => {
    const readme = generateReadme([]);
    
    expect(readme).toBeDefined();
    expect(readme).toContain('SPARK Generated Scripts');
  });

  it('should include generation date', () => {
    const readme = generateReadme(['Test']);
    const today = new Date().toLocaleDateString();
    
    expect(readme).toContain(today);
  });

  it('should handle many script names', () => {
    const scriptNames = Array.from({ length: 10 }, (_, i) => `Script${i}`);
    const readme = generateReadme(scriptNames);
    
    scriptNames.forEach(name => {
      expect(readme).toContain(`${name}.cs`);
    });
  });
});

describe('generateAssemblyDefinition', () => {
  it('should generate valid JSON', () => {
    const definition = generateAssemblyDefinition('TestPackage');
    
    expect(() => JSON.parse(definition)).not.toThrow();
  });

  it('should include package name', () => {
    const definition = generateAssemblyDefinition('TestPackage');
    const parsed = JSON.parse(definition);
    
    expect(parsed.name).toBe('TestPackage');
  });

  it('should sanitize package name for rootNamespace', () => {
    const definition = generateAssemblyDefinition('Test-Package_123');
    const parsed = JSON.parse(definition);
    
    expect(parsed.rootNamespace).toBe('TestPackage123');
  });

  it('should have correct structure', () => {
    const definition = generateAssemblyDefinition('Test');
    const parsed = JSON.parse(definition);
    
    expect(parsed).toHaveProperty('references');
    expect(parsed).toHaveProperty('includePlatforms');
    expect(parsed).toHaveProperty('allowUnsafeCode');
    expect(parsed.allowUnsafeCode).toBe(false);
  });

  it('should handle special characters in package name', () => {
    const definition = generateAssemblyDefinition('Test@Package#123');
    const parsed = JSON.parse(definition);
    
    expect(parsed.name).toBe('Test@Package#123');
    expect(parsed.rootNamespace).toBe('TestPackage123');
  });
});

describe('generatePackageManifest', () => {
  it('should generate valid JSON', () => {
    const manifest = generatePackageManifest('TestPackage', ['Script1']);
    
    expect(() => JSON.parse(manifest)).not.toThrow();
  });

  it('should include package name', () => {
    const manifest = generatePackageManifest('TestPackage', ['Script1']);
    const parsed = JSON.parse(manifest);
    
    expect(parsed.name).toContain('com.spark');
    expect(parsed.name).toContain('testpackage');
  });

  it('should include script names in description', () => {
    const manifest = generatePackageManifest('Test', ['Script1', 'Script2']);
    const parsed = JSON.parse(manifest);
    
    expect(parsed.description).toContain('Script1');
    expect(parsed.description).toContain('Script2');
  });

  it('should have correct Unity version', () => {
    const manifest = generatePackageManifest('Test', ['Script1']);
    const parsed = JSON.parse(manifest);
    
    expect(parsed.unity).toBe('2020.3');
  });

  it('should include SPARK keywords', () => {
    const manifest = generatePackageManifest('Test', ['Script1']);
    const parsed = JSON.parse(manifest);
    
    expect(parsed.keywords).toContain('spark');
    expect(parsed.keywords).toContain('ai-generated');
  });

  it('should sanitize package name for manifest name', () => {
    const manifest = generatePackageManifest('Test-Package_123', ['Script1']);
    const parsed = JSON.parse(manifest);
    
    expect(parsed.name).toContain('testpackage123');
  });
});

