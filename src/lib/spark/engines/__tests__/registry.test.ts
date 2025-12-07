/**
 * Unit Tests for Engine Registry
 * Target: 15-20 tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getEngineRegistry,
  registerEngine,
  getEngine,
  getEngineByExtension,
} from '../registry';
import { BaseEngineAdapter, type GenerateResult } from '../base';

// Mock adapter for testing
class MockAdapter extends BaseEngineAdapter {
  readonly engineId = 'mock';
  readonly displayName = 'Mock Engine';
  readonly supportedExtensions = ['mock', 'test'];

  async generate(prompt: string): Promise<GenerateResult> {
    return {
      success: true,
      code: `// Mock code for: ${prompt}`,
      scriptName: 'MockScript',
    };
  }
}

describe('Engine Registry', () => {
  beforeEach(() => {
    // Reset registry for each test
    const registry = getEngineRegistry();
    // Note: In a real scenario, we'd need a way to reset the singleton
    // For now, we'll test with the existing registry
  });

  describe('getEngineRegistry', () => {
    it('should return singleton instance', () => {
      const registry1 = getEngineRegistry();
      const registry2 = getEngineRegistry();

      expect(registry1).toBe(registry2);
    });

    it('should have built-in engines registered', () => {
      const registry = getEngineRegistry();
      const engines = registry.getAll();

      expect(engines.length).toBeGreaterThan(0);
      expect(engines.some(e => e.engineId === 'unity')).toBe(true);
    });
  });

  describe('getEngine', () => {
    it('should return Unity adapter', () => {
      const adapter = getEngine('unity');
      expect(adapter).toBeDefined();
      expect(adapter?.engineId).toBe('unity');
    });

    it('should return null for unknown engine', () => {
      const adapter = getEngine('unknown-engine');
      expect(adapter).toBeNull();
    });

    it('should return Godot adapter', () => {
      const adapter = getEngine('godot');
      expect(adapter).toBeDefined();
      expect(adapter?.engineId).toBe('godot');
    });
  });

  describe('getEngineByExtension', () => {
    it('should return Unity adapter for .cs extension', () => {
      const adapter = getEngineByExtension('.cs');
      expect(adapter).toBeDefined();
      expect(adapter?.engineId).toBe('unity');
    });

    it('should return Unity adapter for cs extension (no dot)', () => {
      const adapter = getEngineByExtension('cs');
      expect(adapter).toBeDefined();
      expect(adapter?.engineId).toBe('unity');
    });

    it('should return null for unknown extension', () => {
      const adapter = getEngineByExtension('.unknown');
      expect(adapter).toBeNull();
    });

    it('should handle case-insensitive extensions', () => {
      const adapter1 = getEngineByExtension('.CS');
      const adapter2 = getEngineByExtension('.cs');

      expect(adapter1?.engineId).toBe(adapter2?.engineId);
    });
  });

  describe('registerEngine', () => {
    it('should register custom engine adapter', () => {
      const mockAdapter = new MockAdapter();
      registerEngine(mockAdapter);

      const adapter = getEngine('mock');
      expect(adapter).toBeDefined();
      expect(adapter?.engineId).toBe('mock');
    });

    it('should allow custom adapter to be found by extension', () => {
      const mockAdapter = new MockAdapter();
      registerEngine(mockAdapter);

      const adapter = getEngineByExtension('.mock');
      expect(adapter).toBeDefined();
      expect(adapter?.engineId).toBe('mock');
    });
  });

  describe('registry methods', () => {
    it('should get all registered engines', () => {
      const registry = getEngineRegistry();
      const engines = registry.getAll();

      expect(engines.length).toBeGreaterThan(0);
      expect(engines.every(e => e.engineId && e.displayName)).toBe(true);
    });

    it('should check if engine is supported', () => {
      const registry = getEngineRegistry();
      
      expect(registry.isSupported('unity')).toBe(true);
      expect(registry.isSupported('unknown')).toBe(false);
    });

    it('should get supported engines list', () => {
      const registry = getEngineRegistry();
      const engines = registry.getSupportedEngines();

      expect(engines.length).toBeGreaterThan(0);
      expect(engines.every(e => e.id && e.name && Array.isArray(e.extensions))).toBe(true);
      
      const unity = engines.find(e => e.id === 'unity');
      expect(unity).toBeDefined();
      expect(unity?.name).toBe('Unity');
      expect(unity?.extensions).toContain('cs');
    });
  });

  describe('built-in engines', () => {
    it('should have Unity engine registered', () => {
      const adapter = getEngine('unity');
      expect(adapter).toBeDefined();
      expect(adapter?.displayName).toBe('Unity');
      expect(adapter?.supportedExtensions).toContain('cs');
    });

    it('should have Godot engine registered', () => {
      const adapter = getEngine('godot');
      expect(adapter).toBeDefined();
      expect(adapter?.displayName).toBe('Godot');
    });

    it('should have PICO-8 engine registered', () => {
      const adapter = getEngine('pico8');
      expect(adapter).toBeDefined();
    });
  });
});

