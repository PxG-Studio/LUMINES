import { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Network, TrendingUp, TrendingDown } from 'lucide-react';
import { useContainerStats } from '@/hooks/useRuntime';
import { subscribeToProfilerData, calculateAverageFPS, findBottlenecks, generatePerformanceReport } from '@/lib/unity/profiler';
import type { UnityProfilerFrame } from '@/lib/unity/types';

export interface PerformanceMonitorProps {
  projectId: string;
  sessionId?: string;
}

export function PerformanceMonitor({ projectId, sessionId }: PerformanceMonitorProps) {
  const { stats } = useContainerStats(sessionId || '', !!sessionId);
  const [profilerFrames, setProfilerFrames] = useState<UnityProfilerFrame[]>([]);
  const [timeRange, setTimeRange] = useState<'1m' | '5m' | '15m' | '1h'>('5m');

  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = subscribeToProfilerData(projectId, (frame) => {
      setProfilerFrames((prev) => [...prev.slice(-299), frame]);
    });

    return () => {
      unsubscribe.then((unsub) => unsub());
    };
  }, [projectId, sessionId]);

  const report = profilerFrames.length > 0 ? generatePerformanceReport(profilerFrames) : null;

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Performance Monitor</h2>
            <p className="text-sm text-slate-400 mt-1">Real-time performance metrics and profiling</p>
          </div>
          <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Frame Rate"
            value={report ? `${report.fps.toFixed(1)} FPS` : '--'}
            icon={Activity}
            trend={report && report.fps >= 60 ? 'up' : 'down'}
          />
          <MetricCard
            title="CPU Usage"
            value={stats ? `${stats.cpu_percent.toFixed(1)}%` : '--'}
            icon={Cpu}
            trend={stats && stats.cpu_percent < 80 ? 'up' : 'down'}
          />
          <MetricCard
            title="Memory"
            value={stats ? `${(stats.memory_usage / 1024 / 1024).toFixed(0)} MB` : '--'}
            icon={HardDrive}
            trend="neutral"
          />
          <MetricCard
            title="Network"
            value={stats ? `${(stats.network_rx_bytes / 1024).toFixed(0)} KB/s` : '--'}
            icon={Network}
            trend="neutral"
          />
        </div>

        {report && (
          <>
            <PerformanceSummary report={report} />
            <BottleneckAnalysis bottlenecks={report.bottlenecks} />
            <Recommendations recommendations={report.recommendations} />
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CPUChart frames={profilerFrames} />
          <MemoryChart frames={profilerFrames} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GPUChart frames={profilerFrames} />
          <RenderingChart frames={profilerFrames} />
        </div>
      </div>
    </div>
  );
}

interface TimeRangeSelectorProps {
  selected: string;
  onSelect: (range: '1m' | '5m' | '15m' | '1h') => void;
}

function TimeRangeSelector({ selected, onSelect }: TimeRangeSelectorProps) {
  const ranges = [
    { id: '1m', label: '1m' },
    { id: '5m', label: '5m' },
    { id: '15m', label: '15m' },
    { id: '1h', label: '1h' },
  ] as const;

  return (
    <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
      {ranges.map((range) => (
        <button
          key={range.id}
          onClick={() => onSelect(range.id)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            selected === range.id
              ? 'bg-slate-700 text-slate-100'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  trend: 'up' | 'down' | 'neutral';
}

function MetricCard({ title, value, icon: Icon, trend }: MetricCardProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-slate-400',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-400">{title}</p>
          <p className="text-2xl font-semibold text-slate-100 mt-1">{value}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <Icon size={20} className="text-blue-400" />
          </div>
          <TrendIcon size={16} className={trendColors[trend]} />
        </div>
      </div>
    </div>
  );
}

function PerformanceSummary({ report }: { report: any }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-3">Performance Summary</h3>
      <p className="text-slate-300">{report.summary}</p>
    </div>
  );
}

function BottleneckAnalysis({ bottlenecks }: { bottlenecks: any[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Bottleneck Analysis</h3>
      <div className="space-y-3">
        {bottlenecks.map((bottleneck, index) => (
          <div key={index}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-300 capitalize">{bottleneck.category}</span>
              <span className="text-slate-400">{bottleneck.percentage.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${bottleneck.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Recommendations({ recommendations }: { recommendations: string[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Optimization Recommendations</h3>
      <ul className="space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex gap-3 text-sm text-slate-300">
            <span className="text-blue-400">•</span>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CPUChart({ frames }: { frames: UnityProfilerFrame[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">CPU Usage</h3>
      <div className="h-48 flex items-end justify-between gap-1">
        {frames.slice(-60).map((frame, index) => {
          const height = (frame.cpu.totalTime / 33.33) * 100;
          return (
            <div
              key={index}
              className="flex-1 bg-blue-500 rounded-t"
              style={{ height: `${Math.min(height, 100)}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

function MemoryChart({ frames }: { frames: UnityProfilerFrame[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Memory Usage</h3>
      <div className="h-48 flex items-end justify-between gap-1">
        {frames.slice(-60).map((frame, index) => {
          const height = (frame.memory.totalAllocated / (2048 * 1024 * 1024)) * 100;
          return (
            <div
              key={index}
              className="flex-1 bg-purple-500 rounded-t"
              style={{ height: `${Math.min(height, 100)}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

function GPUChart({ frames }: { frames: UnityProfilerFrame[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">GPU Usage</h3>
      <div className="h-48 flex items-end justify-between gap-1">
        {frames.slice(-60).map((frame, index) => {
          const height = (frame.gpu.totalTime / 16.67) * 100;
          return (
            <div
              key={index}
              className="flex-1 bg-green-500 rounded-t"
              style={{ height: `${Math.min(height, 100)}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

function RenderingChart({ frames }: { frames: UnityProfilerFrame[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Draw Calls</h3>
      <div className="h-48 flex items-end justify-between gap-1">
        {frames.slice(-60).map((frame, index) => {
          const height = (frame.rendering.drawCalls / 1000) * 100;
          return (
            <div
              key={index}
              className="flex-1 bg-orange-500 rounded-t"
              style={{ height: `${Math.min(height, 100)}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}
