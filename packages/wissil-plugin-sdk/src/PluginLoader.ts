/**
 * Plugin Loader
 * 
 * Loads plugins via Module Federation and dynamic imports
 */

import type { WISSILPluginManifest, validateManifest } from './PluginManifest';

export interface LoadedPlugin {
  manifest: WISSILPluginManifest;
  module: any;
  id: string;
  url: string;
}

export class PluginLoader {
  private loadedPlugins: Map<string, LoadedPlugin> = new Map();
  private loadingPromises: Map<string, Promise<LoadedPlugin>> = new Map();

  async loadPlugin(url: string): Promise<LoadedPlugin> {
    // Normalize URL
    const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;

    // Check if already loaded
    const existing = Array.from(this.loadedPlugins.values()).find(p => p.url === normalizedUrl);
    if (existing) {
      return existing;
    }

    // Check if already loading
    const loading = this.loadingPromises.get(normalizedUrl);
    if (loading) {
      return loading;
    }

    // Start loading
    const loadPromise = this.doLoadPlugin(normalizedUrl);
    this.loadingPromises.set(normalizedUrl, loadPromise);

    try {
      const plugin = await loadPromise;
      this.loadingPromises.delete(normalizedUrl);
      return plugin;
    } catch (error) {
      this.loadingPromises.delete(normalizedUrl);
      throw error;
    }
  }

  private async doLoadPlugin(url: string): Promise<LoadedPlugin> {
    // Load manifest
    const manifestResponse = await fetch(`${url}/manifest.json`);
    if (!manifestResponse.ok) {
      throw new Error(`Failed to load plugin manifest from ${url}: ${manifestResponse.statusText}`);
    }
    
    const manifest: WISSILPluginManifest = await manifestResponse.json();

    // Validate manifest
    validateManifest(manifest);

    // Check if already loaded by ID
    if (this.loadedPlugins.has(manifest.id)) {
      const existing = this.loadedPlugins.get(manifest.id)!;
      if (existing.url !== url) {
        throw new Error(`Plugin ID ${manifest.id} already loaded from different URL: ${existing.url}`);
      }
      return existing;
    }

    // Load federated module
    const remoteEntryUrl = manifest.remoteEntry || `${url}/remoteEntry.js`;
    let module: any;
    
    try {
      module = await import(/* @vite-ignore */ remoteEntryUrl);
    } catch (error) {
      throw new Error(`Failed to load plugin module from ${remoteEntryUrl}: ${error}`);
    }

    const loadedPlugin: LoadedPlugin = {
      manifest,
      module,
      id: manifest.id,
      url: normalizedUrl
    };

    this.loadedPlugins.set(manifest.id, loadedPlugin);
    
    return loadedPlugin;
  }

  async loadFromMarketplace(pluginId: string): Promise<LoadedPlugin> {
    const marketplaceUrl = process.env.WISSIL_MARKETPLACE_URL || 'https://marketplace.wissil.dev';
    const url = `${marketplaceUrl}/plugins/${pluginId}`;
    return this.loadPlugin(url);
  }

  getLoadedPlugin(id: string): LoadedPlugin | undefined {
    return this.loadedPlugins.get(id);
  }

  unloadPlugin(id: string): void {
    this.loadedPlugins.delete(id);
  }

  getLoadedPlugins(): LoadedPlugin[] {
    return Array.from(this.loadedPlugins.values());
  }
}

export const pluginLoader = new PluginLoader();

