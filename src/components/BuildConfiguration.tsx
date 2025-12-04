import { useState } from 'react';
import { Package, Settings, Play, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getUnityBuildPlatforms, getDevelopmentBuildOptions, getReleaseBuildOptions } from '@/lib/unity/build';
import { useBuildJob } from '@/hooks/useRuntime';

export interface BuildConfigurationProps {
  projectId: string;
}

export function BuildConfiguration({ projectId }: BuildConfigurationProps) {
  const [selectedPlatform, setSelectedPlatform] = useState('StandaloneWindows64');
  const [buildType, setBuildType] = useState<'development' | 'staging' | 'production'>('development');
  const [selectedScenes, setSelectedScenes] = useState<string[]>(['MainScene']);
  const { jobs, activeJob } = useBuildJob(projectId);

  return (
    <div className="flex h-full bg-slate-950">
      <div className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-100">Build Configuration</h2>
          <p className="text-sm text-slate-400 mt-1">Configure and manage project builds</p>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          <PlatformSelector
            selected={selectedPlatform}
            onSelect={setSelectedPlatform}
          />

          <BuildTypeSelector
            selected={buildType}
            onSelect={setBuildType}
          />

          <SceneSelector
            selected={selectedScenes}
            onToggle={(scene) => {
              setSelectedScenes((prev) =>
                prev.includes(scene)
                  ? prev.filter((s) => s !== scene)
                  : [...prev, scene]
              );
            }}
          />

          <BuildOptions buildType={buildType} />

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              <Play size={18} />
              Start Build
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg font-medium transition-colors">
              <Settings size={18} />
              Advanced Settings
            </button>
          </div>
        </div>
      </div>

      <BuildHistory jobs={jobs} activeJob={activeJob} />
    </div>
  );
}

interface PlatformSelectorProps {
  selected: string;
  onSelect: (platform: string) => void;
}

function PlatformSelector({ selected, onSelect }: PlatformSelectorProps) {
  const platforms = getUnityBuildPlatforms();

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-100">Target Platform</h3>
      <div className="grid grid-cols-3 gap-3">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => onSelect(platform.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              selected === platform.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-800 bg-slate-900 hover:border-slate-700'
            }`}
          >
            <Package size={24} />
            <span className="text-sm font-medium text-slate-100">{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface BuildTypeSelectorProps {
  selected: string;
  onSelect: (type: 'development' | 'staging' | 'production') => void;
}

function BuildTypeSelector({ selected, onSelect }: BuildTypeSelectorProps) {
  const types = [
    { id: 'development', name: 'Development', desc: 'Fast iteration with debugging' },
    { id: 'staging', name: 'Staging', desc: 'Pre-production testing' },
    { id: 'production', name: 'Production', desc: 'Optimized release build' },
  ] as const;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-100">Build Type</h3>
      <div className="grid grid-cols-3 gap-3">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`flex flex-col items-start gap-1 p-4 rounded-lg border-2 transition-all ${
              selected === type.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-800 bg-slate-900 hover:border-slate-700'
            }`}
          >
            <span className="text-sm font-medium text-slate-100">{type.name}</span>
            <span className="text-xs text-slate-400">{type.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface SceneSelectorProps {
  selected: string[];
  onToggle: (scene: string) => void;
}

function SceneSelector({ selected, onToggle }: SceneSelectorProps) {
  const scenes = [
    'MainScene',
    'Level1',
    'Level2',
    'BossArena',
    'EndCredits',
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-100">Scenes to Include</h3>
      <div className="space-y-2">
        {scenes.map((scene) => (
          <label
            key={scene}
            className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(scene)}
              onChange={() => onToggle(scene)}
              className="rounded"
            />
            <span className="text-sm text-slate-100">{scene}.unity</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function BuildOptions({ buildType }: { buildType: string }) {
  const options = buildType === 'development'
    ? getDevelopmentBuildOptions()
    : getReleaseBuildOptions();

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-100">Build Options</h3>
      <div className="grid grid-cols-2 gap-3">
        <Option label="Development Build" value={options.developmentBuild} />
        <Option label="Script Debugging" value={options.allowDebugging} />
        <Option label="Profiler Connection" value={options.autoConnectProfiler} />
        <Option label="Strict Mode" value={options.strictMode} />
        <Option label="LZ4 Compression" value={options.compressWithLz4} />
        <Option label="LZ4HC Compression" value={options.compressWithLz4HC} />
        <Option label="Clean Build Cache" value={options.cleanBuildCache} />
        <Option label="Detailed Report" value={options.detailedBuildReport} />
      </div>
    </div>
  );
}

function Option({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
      <span className="text-sm text-slate-300">{label}</span>
      <span className={`text-sm font-medium ${value ? 'text-green-400' : 'text-slate-500'}`}>
        {value ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );
}

function BuildHistory({ jobs, activeJob }: { jobs: any[]; activeJob: any }) {
  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
      <div className="px-4 py-3 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-slate-100">Build History</h3>
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {activeJob && (
          <BuildJobCard job={activeJob} isActive />
        )}
        {jobs.slice(0, 10).map((job) => (
          <BuildJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

function BuildJobCard({ job, isActive }: { job: any; isActive?: boolean }) {
  const statusIcons = {
    completed: <CheckCircle size={16} className="text-green-400" />,
    failed: <XCircle size={16} className="text-red-400" />,
    building: <Clock size={16} className="text-blue-400 animate-spin" />,
    queued: <Clock size={16} className="text-yellow-400" />,
  };

  return (
    <div className={`p-3 rounded-lg border ${
      isActive
        ? 'bg-blue-500/10 border-blue-500'
        : 'bg-slate-800 border-slate-700'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-100">{job.target_platform}</p>
          <p className="text-xs text-slate-400">{job.build_type}</p>
        </div>
        {statusIcons[job.status as keyof typeof statusIcons]}
      </div>
      {isActive && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Building...</span>
            <span>{job.progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
