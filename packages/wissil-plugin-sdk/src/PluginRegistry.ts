/**
 * Plugin Registry
 * 
 * Registers plugins and their extension points into WISSIL subsystems
 */

import { NodeLibrary } from '../../ignis/blueprint/library/NodeLibrary';
import { LoadedPlugin } from './PluginLoader';
import type { PluginExtensionPoint } from './PluginManifest';

export class PluginRegistry {
  private registeredPlugins: Map<string, LoadedPlugin> = new Map();
  private extensionPoints: Map<string, PluginExtensionPoint[]> = new Map();

  registerPlugin(plugin: LoadedPlugin): void {
    if (this.registeredPlugins.has(plugin.id)) {
      console.warn(`Plugin ${plugin.id} is already registered`);
      return;
    }

    this.registeredPlugins.set(plugin.id, plugin);

    // Register nodes
    if (plugin.manifest.extensionPoints.nodes) {
      plugin.manifest.extensionPoints.nodes.forEach(nodeType => {
        const nodeDef = plugin.module[nodeType];
        if (nodeDef) {
          NodeLibrary.register(nodeType, nodeDef);
          console.log(`Registered node: ${nodeType} from plugin ${plugin.id}`);
        } else {
          console.warn(`Node ${nodeType} not found in plugin ${plugin.id}`);
        }
      });
    }

    // Register shader nodes
    if (plugin.manifest.extensionPoints.shaders) {
      plugin.manifest.extensionPoints.shaders.forEach(shaderType => {
        const shaderNode = plugin.module[shaderType];
        if (shaderNode && (window as any).WISSIL?.shaderLibrary) {
          (window as any).WISSIL.shaderLibrary.register(shaderType, shaderNode);
          console.log(`Registered shader node: ${shaderType} from plugin ${plugin.id}`);
        }
      });
    }

    // Register inspectors
    if (plugin.manifest.extensionPoints.inspectors) {
      plugin.manifest.extensionPoints.inspectors.forEach(inspectorType => {
        const inspector = plugin.module[inspectorType];
        if (inspector && (window as any).WISSIL?.inspectorRegistry) {
          (window as any).WISSIL.inspectorRegistry.register(inspectorType, inspector);
          console.log(`Registered inspector: ${inspectorType} from plugin ${plugin.id}`);
        }
      });
    }

    // Register panels
    if (plugin.manifest.extensionPoints.panels) {
      plugin.manifest.extensionPoints.panels.forEach(panelType => {
        const panel = plugin.module[panelType];
        if (panel && (window as any).WISSIL?.panelRegistry) {
          (window as any).WISSIL.panelRegistry.register(panelType, panel);
          console.log(`Registered panel: ${panelType} from plugin ${plugin.id}`);
        }
      });
    }

    // Register templates
    if (plugin.manifest.extensionPoints.templates) {
      plugin.manifest.extensionPoints.templates.forEach(templateType => {
        const template = plugin.module[templateType];
        if (template && (window as any).WISSIL?.templateRegistry) {
          (window as any).WISSIL.templateRegistry.register(templateType, template);
          console.log(`Registered template: ${templateType} from plugin ${plugin.id}`);
        }
      });
    }

    // Register AI extensions
    if (plugin.manifest.extensionPoints.ai) {
      const aiExtensions = plugin.module.ai;
      if (aiExtensions && (window as any).WISSIL?.waypointRegistry) {
        Object.entries(aiExtensions).forEach(([key, value]) => {
          (window as any).WISSIL.waypointRegistry.register(key, value);
          console.log(`Registered AI extension: ${key} from plugin ${plugin.id}`);
        });
      }
    }

    // Register build hooks
    if (plugin.manifest.extensionPoints.buildHooks) {
      const buildHooks = plugin.module.buildHooks;
      if (buildHooks && (window as any).WISSIL?.buildHookRegistry) {
        Object.entries(buildHooks).forEach(([key, value]) => {
          (window as any).WISSIL.buildHookRegistry.register(key, value);
          console.log(`Registered build hook: ${key} from plugin ${plugin.id}`);
        });
      }
    }

    // Call plugin lifecycle
    if (plugin.module.onLoad) {
      try {
        plugin.module.onLoad();
      } catch (error) {
        console.error(`Error in onLoad for plugin ${plugin.id}:`, error);
      }
    }

    console.log(`Plugin ${plugin.id} registered successfully`);
  }

  unregisterPlugin(pluginId: string): void {
    const plugin = this.registeredPlugins.get(pluginId);
    if (!plugin) {
      console.warn(`Plugin ${pluginId} is not registered`);
      return;
    }

    // Call plugin lifecycle
    if (plugin.module.onUnload) {
      try {
        plugin.module.onUnload();
      } catch (error) {
        console.error(`Error in onUnload for plugin ${pluginId}:`, error);
      }
    }

    // Remove from registries
    // Note: Actual removal depends on each registry's implementation
    
    // Remove nodes (would need NodeLibrary.unregister)
    if (plugin.manifest.extensionPoints.nodes) {
      plugin.manifest.extensionPoints.nodes.forEach(nodeType => {
        // NodeLibrary.unregister(nodeType); // If implemented
      });
    }

    this.registeredPlugins.delete(pluginId);
    this.extensionPoints.delete(pluginId);

    console.log(`Plugin ${pluginId} unregistered`);
  }

  getRegisteredPlugins(): LoadedPlugin[] {
    return Array.from(this.registeredPlugins.values());
  }

  getPlugin(pluginId: string): LoadedPlugin | undefined {
    return this.registeredPlugins.get(pluginId);
  }

  isRegistered(pluginId: string): boolean {
    return this.registeredPlugins.has(pluginId);
  }
}

export const pluginRegistry = new PluginRegistry();

