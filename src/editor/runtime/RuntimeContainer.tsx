/**
 * Runtime Container Component
 * 
 * Orchestrates all runtime components (Preview, Console, Terminal, Build Status)
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useStackBlitzRuntime, RuntimeStatus } from './StackBlitzRuntime';
import { PreviewFrame } from './PreviewFrame';
import { ConsoleOutput, ConsoleMessage } from './ConsoleOutput';
import { Terminal } from './Terminal';
import { BuildStatus, BuildStatusType } from './BuildStatus';
import { ErrorOverlay } from './ErrorOverlay';
import { SplitPane } from '../shell/SplitPane';
import { useWissilFS } from '@/wissil/runtime/fs/wissilFs';
import type { WebContainer } from '@webcontainer/api';

export interface RuntimeContainerProps {
  showPreview?: boolean;
  showConsole?: boolean;
  showTerminal?: boolean;
  showBuildStatus?: boolean;
  layout?: 'horizontal' | 'vertical' | 'grid';
  previewHeight?: string;
}

export const RuntimeContainer: React.FC<RuntimeContainerProps> = ({
  showPreview = true,
  showConsole = true,
  showTerminal = true,
  showBuildStatus = true,
  layout = 'horizontal',
  previewHeight = '50%',
}) => {
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [buildStatus, setBuildStatus] = useState<BuildStatusType>('idle');
  const [buildMessage, setBuildMessage] = useState<string>('');
  const [buildProgress, setBuildProgress] = useState<number>(0);
  const [runtimeError, setRuntimeError] = useState<Error | null>(null);
  const fs = useWissilFS();

  // Initialize runtime
  const { container, status: runtimeStatus } = useStackBlitzRuntime({
    onReady: handleRuntimeReady,
    onError: handleRuntimeError,
    autoStart: true,
  });

  // Handle runtime ready
  const handleRuntimeReady = useCallback((container: WebContainer) => {
    // Listen for server-ready events
    container.on('server-ready', (port, url) => {
      setBuildStatus('success');
      setBuildMessage('Build completed successfully');
    });
  }, []);

  // Handle runtime errors
  const handleRuntimeError = useCallback((error: Error) => {
    setRuntimeError(error);
    setBuildStatus('error');
    setBuildMessage(error.message);
    setConsoleMessages((prev) => [
      ...prev,
      {
        type: 'error',
        message: error.message,
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    setRuntimeError(null);
    setBuildStatus('idle');
    setBuildMessage('');
    // Runtime will auto-restart
  }, []);

  // Add console message
  const addConsoleMessage = useCallback((message: ConsoleMessage) => {
    setConsoleMessages((prev) => [...prev, message].slice(-1000));
  }, []);

  // Clear console
  const handleClearConsole = useCallback(() => {
    setConsoleMessages([]);
  }, []);

  // Handle terminal output
  const handleTerminalOutput = useCallback((output: string) => {
    addConsoleMessage({
      type: 'log',
      message: output,
      timestamp: new Date(),
    });
  }, [addConsoleMessage]);

  // Handle terminal command
  const handleTerminalCommand = useCallback((command: string) => {
    addConsoleMessage({
      type: 'info',
      message: `Executing: ${command}`,
      timestamp: new Date(),
    });

    // Update build status for npm commands
    if (command.startsWith('npm')) {
      setBuildStatus('building');
      setBuildMessage('Installing dependencies...');
      setBuildProgress(0);
    }
  }, [addConsoleMessage]);

  // Watch for file changes and trigger rebuild
  useEffect(() => {
    if (!container || runtimeStatus.status !== 'running') return;

    // Sync filesystem on changes
    const syncFilesystem = async () => {
      try {
        const snapshot = fs.getSnapshot();
        // Sync files to WebContainer
        // This would trigger HMR in the dev server
      } catch (error) {
        console.error('Failed to sync filesystem:', error);
      }
    };

    // Debounce sync
    const timeoutId = setTimeout(syncFilesystem, 500);
    return () => clearTimeout(timeoutId);
  }, [fs.getSnapshot(), container, runtimeStatus.status]);

  return (
    <>
      {/* Error Overlay */}
      <ErrorOverlay
        error={runtimeError}
        onClose={() => setRuntimeError(null)}
        onRetry={handleRetry}
        show={!!runtimeError}
      />

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Build Status */}
        {showBuildStatus && (
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--slate-border, #26292f)' }}>
            <BuildStatus
              status={buildStatus}
              message={buildMessage}
              progress={buildProgress}
            />
          </div>
        )}

      {/* Runtime Components */}
      <div style={{ flex: 1, display: 'flex', flexDirection: layout === 'vertical' ? 'column' : 'row' }}>
        {/* Preview */}
        {showPreview && (
          <div style={{ flex: 1, minHeight: 0 }}>
            <PreviewFrame
              url={runtimeStatus.url}
              onLoad={() => {
                addConsoleMessage({
                  type: 'info',
                  message: 'Preview loaded successfully',
                  timestamp: new Date(),
                });
              }}
              onError={(error) => {
                addConsoleMessage({
                  type: 'error',
                  message: error.message,
                  timestamp: new Date(),
                });
              }}
              height={layout === 'vertical' ? previewHeight : '100%'}
            />
          </div>
        )}

        {/* Console & Terminal */}
        {(showConsole || showTerminal) && (
          <SplitPane
            direction={layout === 'vertical' ? 'horizontal' : 'vertical'}
            defaultSize={50}
            minSize={20}
            maxSize={80}
          >
            {/* Console */}
            {showConsole && (
              <ConsoleOutput
                messages={consoleMessages}
                onClear={handleClearConsole}
              />
            )}

            {/* Terminal */}
            {showTerminal && (
              <Terminal
                container={container}
                onCommand={handleTerminalCommand}
                onOutput={handleTerminalOutput}
              />
            )}
          </SplitPane>
        )}
      </div>
    </div>
    </>
  );
};

export default RuntimeContainer;

