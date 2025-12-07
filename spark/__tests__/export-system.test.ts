import { describe, it, expect } from 'vitest';
import {
  generateReadme,
  generateAssemblyDefinition,
  generatePackageManifest,
  DEFAULT_TEMPLATE,
  PACKAGE_TEMPLATE,
} from '../lib/export/templates';

describe('Export System', () => {
  describe('README Generation', () => {
    it('should generate README with script names', () => {
      const scriptNames = ['PlayerController', 'EnemyAI', 'GameManager'];
      const readme = generateReadme(scriptNames);

      expect(readme).toContain('SPARK Generated Scripts');
      expect(readme).toContain('PlayerController.cs');
      expect(readme).toContain('EnemyAI.cs');
      expect(readme).toContain('GameManager.cs');
    });

    it('should include generation date', () => {
      const readme = generateReadme(['TestScript']);
      expect(readme).toContain(new Date().toLocaleDateString());
    });
  });

  describe('Assembly Definition Generation', () => {
    it('should generate valid JSON assembly definition', () => {
      const asmdef = generateAssemblyDefinition('TestPackage');
      const parsed = JSON.parse(asmdef);

      expect(parsed.name).toBe('TestPackage');
      expect(parsed.rootNamespace).toBe('TestPackage');
      expect(parsed.autoReferenced).toBe(true);
      expect(parsed.allowUnsafeCode).toBe(false);
    });

    it('should sanitize package names', () => {
      const asmdef = generateAssemblyDefinition('Test-Package.Name');
      const parsed = JSON.parse(asmdef);

      expect(parsed.rootNamespace).toBe('TestPackageName');
    });
  });

  describe('Package Manifest Generation', () => {
    it('should generate valid Unity package manifest', () => {
      const manifest = generatePackageManifest('TestPackage', ['Script1', 'Script2']);
      const parsed = JSON.parse(manifest);

      expect(parsed.name).toContain('com.spark');
      expect(parsed.displayName).toContain('TestPackage');
      expect(parsed.version).toBe('1.0.0');
      expect(parsed.unity).toBe('2020.3');
    });

    it('should include script names in description', () => {
      const manifest = generatePackageManifest('TestPackage', ['PlayerController']);
      const parsed = JSON.parse(manifest);

      expect(parsed.description).toContain('PlayerController');
    });
  });

  describe('Export Templates', () => {
    it('should have correct default template configuration', () => {
      expect(DEFAULT_TEMPLATE.name).toBe('Standard');
      expect(DEFAULT_TEMPLATE.includeReadme).toBe(false);
      expect(DEFAULT_TEMPLATE.includeAssemblyDefinition).toBe(false);
      expect(DEFAULT_TEMPLATE.folderStructure).toEqual(['Assets', 'Scripts']);
    });

    it('should have correct package template configuration', () => {
      expect(PACKAGE_TEMPLATE.name).toBe('Unity Package');
      expect(PACKAGE_TEMPLATE.includeReadme).toBe(true);
      expect(PACKAGE_TEMPLATE.includeAssemblyDefinition).toBe(true);
      expect(PACKAGE_TEMPLATE.includePackageManifest).toBe(true);
    });
  });
});
