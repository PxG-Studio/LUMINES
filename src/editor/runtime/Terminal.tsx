/**
 * Terminal Component
 * 
 * Interactive terminal for executing commands in WebContainer
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal as TerminalIcon, Play, Square } from 'lucide-react';
import type { WebContainerProcess } from '@webcontainer/api';

export interface TerminalProps {
  container?: any; // WebContainer instance
  onCommand?: (command: string) => void;
  onOutput?: (output: string) => void;
  height?: string;
  autoFocus?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({
  container,
  onCommand,
  onOutput,
  height = '300px',
  autoFocus = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentCommand, setCurrentCommand] = useState('');
  const [output, setOutput] = useState<Array<{ type: 'input' | 'output' | 'error'; text: string }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const processRef = useRef<WebContainerProcess | null>(null);

  // Auto-focus input
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Execute command
  const executeCommand = useCallback(async (command: string) => {
    if (!container || !command.trim()) return;

    // Add command to history
    setHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);

    // Add command to output
    setOutput((prev) => [...prev, { type: 'input', text: `$ ${command}` }]);
    onCommand?.(command);

    setIsRunning(true);

    try {
      // Parse command
      const [cmd, ...args] = command.trim().split(/\s+/);

      // Execute in WebContainer
      const process = await container.spawn(cmd, args);
      processRef.current = process;

      // Handle output
      const reader = process.output.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        setOutput((prev) => [...prev, { type: 'output', text }]);
        onOutput?.(text);
      }

      // Handle exit
      const exitCode = await process.exit;
      if (exitCode !== 0) {
        setOutput((prev) => [...prev, { type: 'error', text: `Process exited with code ${exitCode}` }]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Command failed';
      setOutput((prev) => [...prev, { type: 'error', text: errorMessage }]);
    } finally {
      setIsRunning(false);
      processRef.current = null;
    }
  }, [container, onCommand, onOutput]);

  // Handle input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = currentCommand.trim();
      if (command) {
        executeCommand(command);
        setCurrentCommand('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(history[newIndex]);
        }
      }
    } else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      // Kill current process
      if (processRef.current) {
        processRef.current.kill();
        processRef.current = null;
        setIsRunning(false);
      }
    }
  };

  const handleStop = () => {
    if (processRef.current) {
      processRef.current.kill();
      processRef.current = null;
      setIsRunning(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height,
        background: 'var(--slate-bg, #0f1115)',
        border: '1px solid var(--slate-border, #26292f)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'var(--slate-panel, #16181d)',
          borderBottom: '1px solid var(--slate-border, #26292f)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TerminalIcon size={14} style={{ color: 'var(--slate-text-muted, #9ba1aa)' }} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--slate-text, #e4e7eb)',
            }}
          >
            Terminal
          </span>
        </div>

        {isRunning && (
          <button
            onClick={handleStop}
            style={{
              padding: '4px 8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 4,
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
            }}
          >
            <Square size={12} />
            Stop
          </button>
        )}
      </div>

      {/* Output */}
      <div
        ref={outputRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 8,
          fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
          fontSize: 12,
          lineHeight: 1.5,
          background: '#000000',
          color: '#00ff00',
        }}
      >
        {output.length === 0 ? (
          <div
            style={{
              color: 'var(--slate-text-muted, #9ba1aa)',
              fontSize: 12,
            }}
          >
            Terminal ready. Type a command and press Enter.
          </div>
        ) : (
          output.map((item, index) => (
            <div
              key={index}
              style={{
                color:
                  item.type === 'error'
                    ? '#ef4444'
                    : item.type === 'input'
                    ? '#00ff00'
                    : '#e4e7eb',
                marginBottom: 2,
                wordBreak: 'break-word',
              }}
            >
              {item.text}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: 'var(--slate-panel, #16181d)',
          borderTop: '1px solid var(--slate-border, #26292f)',
        }}
      >
        <span style={{ color: '#00ff00', fontSize: 12 }}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRunning}
          placeholder={isRunning ? 'Command running...' : 'Enter command...'}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e4e7eb',
            fontSize: 12,
            fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
          }}
        />
        {!isRunning && (
          <button
            onClick={() => {
              if (currentCommand.trim()) {
                executeCommand(currentCommand);
                setCurrentCommand('');
              }
            }}
            style={{
              padding: '4px 8px',
              background: 'var(--slate-accent, #3f8cff)',
              border: 'none',
              borderRadius: 4,
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
            }}
          >
            <Play size={12} />
            Run
          </button>
        )}
      </div>
    </div>
  );
};

export default Terminal;

