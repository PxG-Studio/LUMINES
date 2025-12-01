/**
 * Plugin API
 * 
 * Provides a safe API surface for plugins to interact with WISSIL
 */

import { PluginSandbox } from './PluginSandbox';

export interface PluginLifecycle {
  onLoad?: () => void | Promise<void>;
  onUnload?: () => void | Promise<void>;
  onSessionStart?: (sessionId: string) => void | Promise<void>;
  onSessionEnd?: (sessionId: string) => void | Promise<void>;
  onGraphUpdate?: (graphId: string, graph: any) => void | Promise<void>;
  onSceneGraphUpdate?: (sceneId: string, scene: any) => void | Promise<void>;
  onAIRequest?: (prompt: string, context: any) => void | Promise<void>;
  onBuildStart?: (config: any) => void | Promise<void>;
  onBuildComplete?: (result: any) => void | Promise<void>;
}

export class PluginAPI {
  private sandbox: PluginSandbox;
  private pluginId: string;

  constructor(sandbox: PluginSandbox, pluginId: string) {
    this.sandbox = sandbox;
    this.pluginId = pluginId;
  }

  // Graph API
  async getGraph(graphId: string): Promise<any> {
    if (!this.sandbox.hasPermission('nodes')) {
      throw new Error('Plugin does not have permission to access graphs');
    }
    
    // Access graph through WISSIL API
    if ((window as any).WISSIL?.graphStore) {
      return (window as any).WISSIL.graphStore.getGraph(graphId);
    }
    return null;
  }

  async updateGraph(graphId: string, updates: any): Promise<void> {
    if (!this.sandbox.hasPermission('nodes')) {
      throw new Error('Plugin does not have permission to modify graphs');
    }
    
    if ((window as any).WISSIL?.graphStore) {
      (window as any).WISSIL.graphStore.updateGraph(graphId, updates);
    }
  }

  // SceneGraph API
  async getSceneGraph(): Promise<any> {
    if (!this.sandbox.hasPermission('scenegraph')) {
      throw new Error('Plugin does not have permission to access SceneGraph');
    }
    
    if ((window as any).WISSIL?.sceneGraph) {
      return (window as any).WISSIL.sceneGraph.getScene();
    }
    return null;
  }

  async selectObject(objectId: string): Promise<void> {
    if (!this.sandbox.hasPermission('scenegraph')) {
      throw new Error('Plugin does not have permission to select objects');
    }
    
    if ((window as any).WISSIL?.sceneGraph) {
      (window as any).WISSIL.sceneGraph.selectObject(objectId);
    }
  }

  // Inspector API
  async inspectObject(objectId: string): Promise<void> {
    if (!this.sandbox.hasPermission('inspector')) {
      throw new Error('Plugin does not have permission to inspect objects');
    }
    
    if ((window as any).WISSIL?.inspector) {
      (window as any).WISSIL.inspector.inspect(objectId);
    }
  }

  // AI API
  async askLUNA(prompt: string): Promise<string> {
    if (!this.sandbox.hasPermission('ai')) {
      throw new Error('Plugin does not have permission to use AI');
    }
    
    if ((window as any).WISSIL?.waypoint) {
      return (window as any).WISSIL.waypoint.ask(prompt);
    }
    throw new Error('Waypoint AI not available');
  }

  // Build API
  async triggerBuild(config: any): Promise<string> {
    if (!this.sandbox.hasPermission('build')) {
      throw new Error('Plugin does not have permission to trigger builds');
    }
    
    if ((window as any).WISSIL?.build) {
      return (window as any).WISSIL.build.start(config);
    }
    throw new Error('Build system not available');
  }

  // Storage API (with permissions)
  async getStorage(key: string): Promise<any> {
    if (!this.sandbox.hasPermission('storage')) {
      throw new Error('Plugin does not have permission to access storage');
    }
    
    const stored = localStorage.getItem(`plugin:${this.pluginId}:${key}`);
    return stored ? JSON.parse(stored) : null;
  }

  async setStorage(key: string, value: any): Promise<void> {
    if (!this.sandbox.hasPermission('storage')) {
      throw new Error('Plugin does not have permission to write to storage');
    }
    
    localStorage.setItem(`plugin:${this.pluginId}:${key}`, JSON.stringify(value));
  }

  // Network API (with permissions)
  async fetch(url: string, options?: RequestInit): Promise<Response> {
    if (!this.sandbox.hasPermission('network')) {
      throw new Error('Plugin does not have permission to make network requests');
    }
    
    return window.fetch(url, options);
  }
}

