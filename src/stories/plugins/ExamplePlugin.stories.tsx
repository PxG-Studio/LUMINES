/**
 * Example Plugin Story
 * 
 * Demonstrates loading and using a WISSIL plugin
 */

import React, { useEffect, useState } from 'react';
// TODO: Build @wissil/plugin-sdk package first
// import { pluginLoader, pluginRegistry } from '@wissil/plugin-sdk';

// Temporary mock until package is built
const pluginLoader = {
  loadPlugin: async (url: string) => ({ manifest: {}, module: {}, id: '', url })
};
const pluginRegistry = {
  registerPlugin: (plugin: any) => console.log('Registering plugin:', plugin)
};

export default {
  title: "Lumenforge.io Design System/Integrations/Plugins/ExamplePlugin",
  parameters: {
    layout: "fullscreen"
  }
};

export const LoadedPlugin = () => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [plugin, setPlugin] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // Example: Load from URL
        // const loaded = await pluginLoader.loadPlugin('http://localhost:5000/example-plugin');
        
        // For demo purposes, create a mock plugin
        const mockPlugin = {
          manifest: {
            name: "Example Plugin",
            id: "com.example.plugin",
            version: "1.0.0",
            author: "Example Author",
            description: "An example plugin",
            permissions: ["nodes"],
            extensionPoints: {
              nodes: ["ExampleNode"]
            }
          },
          module: {
            ExampleNode: {
              type: "ExampleNode",
              title: "Example Node",
              // ... node definition
            }
          },
          id: "com.example.plugin",
          url: "http://localhost:5000/example-plugin"
        };

        pluginRegistry.registerPlugin(mockPlugin);
        setPlugin(mockPlugin);
        setStatus('loaded');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('error');
      }
    }

    load();
  }, []);

  if (status === 'loading') {
    return <div>Loading plugin...</div>;
  }

  if (status === 'error') {
    return <div>Error loading plugin: {error}</div>;
  }

  return (
    <div style={{ padding: "16px" }}>
      <h1>Plugin Loaded: {plugin?.manifest.name}</h1>
      <p><strong>ID:</strong> {plugin?.manifest.id}</p>
      <p><strong>Version:</strong> {plugin?.manifest.version}</p>
      <p><strong>Author:</strong> {plugin?.manifest.author}</p>
      <p><strong>Description:</strong> {plugin?.manifest.description}</p>
      
      <h2>Extension Points</h2>
      <ul>
        {plugin?.manifest.extensionPoints.nodes?.map((node: string) => (
          <li key={node}>{node}</li>
        ))}
      </ul>
    </div>
  );
};

