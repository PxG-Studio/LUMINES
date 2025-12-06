/**
 * Engine Adapter Registry
 * 
 * Central registry for all game engine adapters
 */

import type { EngineAdapter } from './base';
import { UnityAdapter } from './unityAdapter';
import { GodotAdapter } from './godotAdapter';
import { PICO8Adapter } from './pico8Adapter';
import { GameMakerAdapter } from './gamemakerAdapter';
import { RPGMakerAdapter } from './rpgmakerAdapter';
import { ConstructAdapter } from './constructAdapter';
import { RenPyAdapter } from './renpyAdapter';

// Export adapters
export { UnityAdapter } from './unityAdapter';
export { GodotAdapter } from './godotAdapter';
export { PICO8Adapter } from './pico8Adapter';
export { GameMakerAdapter } from './gamemakerAdapter';
export { RPGMakerAdapter } from './rpgmakerAdapter';
export { ConstructAdapter } from './constructAdapter';
export { RenPyAdapter } from './renpyAdapter';
export { BaseEngineAdapter } from './base';
export type { EngineAdapter, GenerateResult, ValidationResult } from './base';

class EngineRegistry {
  private adapters: Map<string, EngineAdapter> = new Map();
  
  constructor() {
    // Register built-in adapters
    this.register(new UnityAdapter());
    this.register(new GodotAdapter());
    this.register(new PICO8Adapter());
    this.register(new GameMakerAdapter());
    this.register(new RPGMakerAdapter());
    this.register(new ConstructAdapter());
    this.register(new RenPyAdapter());
  }
  
  /**
   * Register an engine adapter
   */
  register(adapter: EngineAdapter): void {
    this.adapters.set(adapter.engineId, adapter);
  }
  
  /**
   * Get an adapter by engine ID
   */
  get(engineId: string): EngineAdapter | null {
    return this.adapters.get(engineId) || null;
  }
  
  /**
   * Get all registered adapters
   */
  getAll(): EngineAdapter[] {
    return Array.from(this.adapters.values());
  }
  
  /**
   * Get adapter by file extension
   */
  getByExtension(extension: string): EngineAdapter | null {
    const ext = extension.toLowerCase().replace(/^\./, '');
    
    for (const adapter of this.adapters.values()) {
      if (adapter.supportedExtensions.includes(ext)) {
        return adapter;
      }
    }
    
    return null;
  }
  
  /**
   * Check if an engine is supported
   */
  isSupported(engineId: string): boolean {
    return this.adapters.has(engineId);
  }
  
  /**
   * Get list of supported engines
   */
  getSupportedEngines(): Array<{ id: string; name: string; extensions: string[] }> {
    return this.getAll().map((adapter) => ({
      id: adapter.engineId,
      name: adapter.displayName,
      extensions: adapter.supportedExtensions,
    }));
  }
}

// Singleton instance
let registryInstance: EngineRegistry | null = null;

/**
 * Get the global engine registry
 */
export function getEngineRegistry(): EngineRegistry {
  if (!registryInstance) {
    registryInstance = new EngineRegistry();
  }
  return registryInstance;
}

/**
 * Register a custom engine adapter
 */
export function registerEngine(adapter: EngineAdapter): void {
  getEngineRegistry().register(adapter);
}

/**
 * Get engine adapter by ID
 */
export function getEngine(engineId: string): EngineAdapter | null {
  return getEngineRegistry().get(engineId);
}

/**
 * Get engine adapter by file extension
 */
export function getEngineByExtension(extension: string): EngineAdapter | null {
  return getEngineRegistry().getByExtension(extension);
}

