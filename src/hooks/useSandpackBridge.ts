/**
 * Hook for Sandpack Bridge communication
 */

import { useEffect, useCallback } from 'react';
import { getBridge, BridgeMessage } from '@/runtime/sandbox-bridge';
import { useEditorState } from '@/state/editorState';
import { useRuntimeState } from '@/state/runtimeState';

export const useSandpackBridge = () => {
  const bridge = getBridge();
  const { files, updateFile } = useEditorState();
  const { addError, clearErrors, setCompiling } = useRuntimeState();

  useEffect(() => {
    // Listen for code changes from sandbox
    const unsubscribeCodeChange = bridge.on('code-change', (message: BridgeMessage) => {
      const { path, content } = message.payload;
      updateFile(path, content);
    });

    // Listen for errors
    const unsubscribeError = bridge.on('error', (message: BridgeMessage) => {
      addError(message.payload);
    });

    // Listen for compilation status
    const unsubscribeCompile = bridge.on('compile', (message: BridgeMessage) => {
      setCompiling(message.payload.compiling);
    });

    return () => {
      unsubscribeCodeChange();
      unsubscribeError();
      unsubscribeCompile();
    };
  }, [bridge, updateFile, addError, setCompiling]);

  const sendCodeChange = useCallback((path: string, content: string) => {
    bridge.send({
      type: 'code-change',
      payload: { path, content },
      timestamp: Date.now(),
    });
  }, [bridge]);

  const requestCompile = useCallback(() => {
    bridge.send({
      type: 'compile',
      payload: {},
      timestamp: Date.now(),
    });
  }, [bridge]);

  return {
    sendCodeChange,
    requestCompile,
    clearErrors,
  };
};

