import { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Square, Pause, Trash2, Download, Filter } from 'lucide-react';
import { useRuntimeSession } from '@/hooks/useRuntime';

export interface RuntimeConsoleProps {
  sessionId: string;
}

export function RuntimeConsole({ sessionId }: RuntimeConsoleProps) {
  const { session, logs, start, stop, isLoading } = useRuntimeSession(sessionId);
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <ConsoleToolbar
        session={session}
        isLoading={isLoading}
        onStart={start}
        onStop={stop}
        filter={filter}
        onFilterChange={setFilter}
        autoScroll={autoScroll}
        onAutoScrollChange={setAutoScroll}
        logCount={logs.length}
      />
      <div className="flex-1 overflow-auto p-4 space-y-1 font-mono text-sm">
        {filteredLogs.map((log, index) => (
          <LogEntry key={index} log={log} />
        ))}
        <div ref={logsEndRef} />
      </div>
      <ConsoleStatusBar
        status={session?.status || 'stopped'}
        logCount={filteredLogs.length}
      />
    </div>
  );
}

interface ConsoleToolbarProps {
  session: any;
  isLoading: boolean;
  onStart: () => void;
  onStop: () => void;
  filter: string;
  onFilterChange: (filter: 'all' | 'error' | 'warning' | 'info') => void;
  autoScroll: boolean;
  onAutoScrollChange: (enabled: boolean) => void;
  logCount: number;
}

function ConsoleToolbar({
  session,
  isLoading,
  onStart,
  onStop,
  filter,
  onFilterChange,
  autoScroll,
  onAutoScrollChange,
  logCount,
}: ConsoleToolbarProps) {
  const isRunning = session?.status === 'running';

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <button
          onClick={isRunning ? onStop : onStart}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRunning ? <Square size={14} /> : <Play size={14} />}
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <div className="w-px h-6 bg-slate-700" />
        <button className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
          <Trash2 size={16} />
        </button>
        <button className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
          <Download size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
          <FilterButton
            label="All"
            active={filter === 'all'}
            onClick={() => onFilterChange('all')}
          />
          <FilterButton
            label="Errors"
            active={filter === 'error'}
            onClick={() => onFilterChange('error')}
            color="red"
          />
          <FilterButton
            label="Warnings"
            active={filter === 'warning'}
            onClick={() => onFilterChange('warning')}
            color="yellow"
          />
          <FilterButton
            label="Info"
            active={filter === 'info'}
            onClick={() => onFilterChange('info')}
            color="blue"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => onAutoScrollChange(e.target.checked)}
            className="rounded"
          />
          Auto-scroll
        </label>
      </div>
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: 'red' | 'yellow' | 'blue';
}

function FilterButton({ label, active, onClick, color }: FilterButtonProps) {
  const colors = {
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
        active
          ? `bg-slate-700 ${color ? colors[color] : 'text-slate-100'}`
          : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

interface LogEntryProps {
  log: {
    level: string;
    message: string;
    timestamp: string;
  };
}

function LogEntry({ log }: LogEntryProps) {
  const colors = {
    error: 'text-red-400',
    warn: 'text-yellow-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    debug: 'text-slate-400',
  };

  const color = colors[log.level as keyof typeof colors] || 'text-slate-300';

  return (
    <div className="flex gap-3 py-1 hover:bg-slate-900/50">
      <span className="text-slate-500 text-xs whitespace-nowrap">
        {new Date(log.timestamp).toLocaleTimeString()}
      </span>
      <span className={`uppercase text-xs font-semibold ${color} w-12`}>
        {log.level}
      </span>
      <span className="text-slate-200 flex-1">{log.message}</span>
    </div>
  );
}

function ConsoleStatusBar({ status, logCount }: { status: string; logCount: number }) {
  const statusColors = {
    running: 'text-green-400',
    stopped: 'text-slate-400',
    error: 'text-red-400',
    starting: 'text-yellow-400',
  };

  const color = statusColors[status as keyof typeof statusColors] || 'text-slate-400';

  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-t border-slate-800 text-xs text-slate-400">
      <div className="flex items-center gap-4">
        <span className={`flex items-center gap-2 ${color}`}>
          <span className="w-2 h-2 rounded-full bg-current" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <span>{logCount} log entries</span>
      </div>
      <div className="flex items-center gap-2">
        <Terminal size={14} />
        <span>Runtime Console</span>
      </div>
    </div>
  );
}
