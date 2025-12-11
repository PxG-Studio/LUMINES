/**
 * StackBlitz Runtime Component
 * 
 * WebContainer-based runtime for executing code in the browser
 * Similar to StackBlitz and bolt.new runtime
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { WebContainer } from '@webcontainer/api';
import { useWissilFS } from '@/wis2l/runtime/fs/wissilFs';

export interface StackBlitzRuntimeProps {
  onReady?: (container: WebContainer) => void;
  onError?: (error: Error) => void;
  autoStart?: boolean;
}

export interface RuntimeStatus {
  status: 'idle' | 'booting' | 'ready' | 'building' | 'running' | 'error';
  port?: number;
  url?: string;
  error?: string;
}

export const useStackBlitzRuntime = (
  options: StackBlitzRuntimeProps = {}
): {
  container: WebContainer | null;
  status: RuntimeStatus;
  startDevServer: () => Promise<void>;
  syncFilesystem: () => Promise<void>;
} => {
  const { onReady, onError, autoStart = true } = options;
  const containerRef = useRef<WebContainer | null>(null);
  const [status, setStatus] = useState<RuntimeStatus>({ status: 'idle' });
  const fs = useWissilFS();

  // Initialize WebContainer
  useEffect(() => {
    let mounted = true;

    const initContainer = async () => {
      try {
        setStatus({ status: 'booting' });
        
        // Dynamically import WebContainer API
        const { WebContainer } = await import('@webcontainer/api');
        
        const container = await WebContainer.boot();
        
        if (!mounted) return;
        
        containerRef.current = container;
        setStatus({ status: 'ready' });
        onReady?.(container);

        // Sync WISSIL-FS to WebContainer
        await syncFilesystem(container);

        // Auto-start dev server if enabled
        if (autoStart) {
          await startDevServer(container);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize WebContainer');
        setStatus({ status: 'error', error: error.message });
        onError?.(error);
      }
    };

    initContainer();

    return () => {
      mounted = false;
    };
  }, [autoStart, onReady, onError]);

  // Sync WISSIL-FS to WebContainer filesystem
  const syncFilesystem = useCallback(async (container: WebContainer) => {
    try {
      const snapshot = fs.getSnapshot();
      
      // Recursively write files to WebContainer
      const writeNode = async (node: any, path: string = '') => {
        if (node.type === 'file') {
          const fullPath = path || '/';
          await container.fs.writeFile(fullPath, node.content || '');
        } else if (node.type === 'folder') {
          for (const [name, child] of Object.entries(node.children || {})) {
            const childPath = path ? `${path}/${name}` : `/${name}`;
            await writeNode(child, childPath);
          }
        }
      };

      await writeNode(snapshot);
    } catch (err) {
      console.error('Failed to sync filesystem:', err);
    }
  }, [fs]);

  // Start development server
  const startDevServer = useCallback(async (container: WebContainer) => {
    try {
      setStatus('building');

      // Check if package.json exists
      const packageJson = fs.readFile('/package.json');
      if (!packageJson) {
        // Create default package.json
        const defaultPackageJson = {
          name: 'wissil-project',
          version: '1.0.0',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
          },
          dependencies: {},
          devDependencies: {
            vite: '^5.0.0',
          },
        };

        await container.fs.writeFile(
          '/package.json',
          JSON.stringify(defaultPackageJson, null, 2)
        );
      }

      // Install dependencies
      const installProcess = await container.spawn('npm', ['install']);
      await installProcess.exit;

      // Start dev server
      const devProcess = await container.spawn('npm', ['run', 'dev']);
      
      // Wait for server to be ready
      container.on('server-ready', (port, url) => {
        setStatus({ status: 'running', port, url });
      });

      // Handle process output
      devProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            // Handle build output
            console.log('[Dev Server]', data);
          },
        })
      );

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start dev server');
      setStatus({ status: 'error', error: error.message });
      onError?.(error);
    }
  }, [fs]);

  // Watch for file changes and sync to WebContainer
  useEffect(() => {
    if (!containerRef.current || status.status !== 'ready') return;

    // Sync on file changes
    const syncOnChange = async () => {
      if (containerRef.current) {
        await syncFilesystem(containerRef.current);
      }
    };

    // Debounce sync
    const timeoutId = setTimeout(syncOnChange, 500);
    return () => clearTimeout(timeoutId);
  }, [fs.getSnapshot(), status, syncFilesystem]);

  return {
    container: containerRef.current,
    status,
    startDevServer: async () => {
      if (containerRef.current) {
        await startDevServer(containerRef.current);
      }
    },
    syncFilesystem: async () => {
      if (containerRef.current) {
        await syncFilesystem(containerRef.current);
      }
    },
  };
};

// Component wrapper for backward compatibility
export const StackBlitzRuntime: React.FC<StackBlitzRuntimeProps> = (props) => {
  useStackBlitzRuntime(props);
  return null;
};

export default StackBlitzRuntime;

