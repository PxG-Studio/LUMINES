import { useState } from 'react';
import {
  useUnityProject,
  useUnityPlayMode,
  useUnityEditor,
  useUnityBuild,
  useUnityProfiler,
  useUnityLogs,
} from '../hooks/useUnity';
import { Play, Pause, Square, RefreshCw, Hammer, Zap, Activity, Terminal } from 'lucide-react';

interface UnityProjectDashboardProps {
  projectId: string;
  userId: string;
}

export function UnityProjectDashboard({ projectId, userId }: UnityProjectDashboardProps) {
  const { project, isLoading, refresh, clean, rebuildLibrary } = useUnityProject(projectId);
  const { isPlaying, isPaused, play, stop, pause } = useUnityPlayMode(projectId);
  const { refreshAssets, compile, isLoading: editorLoading } = useUnityEditor(projectId);
  const { build, isBuilding, progress } = useUnityBuild(projectId);
  const { frames } = useUnityProfiler(projectId, isPlaying);
  const { logs, clear: clearLogs } = useUnityLogs(projectId);

  const [showProfiler, setShowProfiler] = useState(false);
  const [showConsole, setShowConsole] = useState(false);

  if (isLoading || !project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  const avgFps = frames.length > 0
    ? frames.reduce((sum, f) => sum + (1000 / f.cpu.totalTime), 0) / frames.length
    : 0;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-sm text-slate-400">Unity {project.unityVersion}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={isLoading}
            className="p-2 rounded hover:bg-slate-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowProfiler(!showProfiler)}
            className={`p-2 rounded transition-colors ${
              showProfiler ? 'bg-blue-600' : 'hover:bg-slate-800'
            }`}
            title="Profiler"
          >
            <Activity className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`p-2 rounded transition-colors ${
              showConsole ? 'bg-blue-600' : 'hover:bg-slate-800'
            }`}
            title="Console"
          >
            <Terminal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Play Mode Controls</h2>

            <div className="flex items-center gap-4">
              {!isPlaying ? (
                <button
                  onClick={play}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Play
                </button>
              ) : (
                <>
                  <button
                    onClick={isPaused ? play : pause}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                  >
                    <Pause className="w-5 h-5" />
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>

                  <button
                    onClick={stop}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <Square className="w-5 h-5" />
                    Stop
                  </button>
                </>
              )}

              {isPlaying && (
                <div className="flex items-center gap-2 ml-auto">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-300">
                    {avgFps.toFixed(1)} FPS
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Editor Actions</h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={refreshAssets}
                disabled={editorLoading}
                className="flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${editorLoading ? 'animate-spin' : ''}`} />
                Refresh Assets
              </button>

              <button
                onClick={compile}
                disabled={editorLoading}
                className="flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                Compile Scripts
              </button>

              <button
                onClick={clean}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                Clean Project
              </button>

              <button
                onClick={rebuildLibrary}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <Hammer className="w-4 h-4" />
                Rebuild Library
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Scenes</h2>

            {project.scenes.length === 0 ? (
              <p className="text-slate-400 text-sm">No scenes found</p>
            ) : (
              <div className="space-y-2">
                {project.scenes.map((scene) => (
                  <div
                    key={scene.guid}
                    className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{scene.name}</p>
                      <p className="text-xs text-slate-400">{scene.path}</p>
                    </div>
                    <span className="text-xs text-slate-400">
                      Build Index: {scene.buildIndex}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Project Info</h2>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400">Unity Version</p>
                <p className="font-medium">{project.unityVersion}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Company</p>
                <p className="font-medium">
                  {project.settings.companyName || 'Not set'}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Product</p>
                <p className="font-medium">
                  {project.settings.productName || project.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Packages</p>
                <p className="font-medium">{project.packages.length} installed</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Scenes</p>
                <p className="font-medium">{project.scenes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Build</h2>

            <button
              onClick={() => {
                build({
                  target: {
                    platform: 'StandaloneWindows64',
                    architecture: 'x86_64',
                    scriptingBackend: 'IL2CPP',
                    developmentBuild: true,
                    scriptDebugging: true,
                    compressionMethod: 'LZ4',
                    buildOptions: [],
                  },
                  outputPath: `/var/slate/builds/${projectId}`,
                  options: {
                    developmentBuild: true,
                    autoConnectProfiler: true,
                    allowDebugging: true,
                    buildScriptsOnly: false,
                    compressWithLz4: true,
                    compressWithLz4HC: false,
                    strictMode: false,
                    detailedBuildReport: true,
                    cleanBuildCache: false,
                    showBuiltPlayer: false,
                  },
                });
              }}
              disabled={isBuilding}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <Hammer className="w-4 h-4" />
              {isBuilding ? `Building... ${progress}%` : 'Build Project'}
            </button>

            {isBuilding && (
              <div className="mt-3">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {project.packages.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Packages</h2>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {project.packages.map((pkg) => (
                  <div key={pkg.name} className="p-2 bg-slate-700 rounded">
                    <p className="text-sm font-medium">{pkg.displayName}</p>
                    <p className="text-xs text-slate-400">{pkg.version}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showProfiler && frames.length > 0 && (
        <div className="border-t border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Profiler</h2>
            <span className="text-sm text-slate-400">
              {frames.length} frames
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Avg FPS</p>
              <p className="text-2xl font-bold">{avgFps.toFixed(1)}</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">CPU Time</p>
              <p className="text-2xl font-bold">
                {(frames[frames.length - 1]?.cpu.totalTime || 0).toFixed(1)}ms
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Draw Calls</p>
              <p className="text-2xl font-bold">
                {frames[frames.length - 1]?.gpu.drawCalls || 0}
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Memory</p>
              <p className="text-2xl font-bold">
                {((frames[frames.length - 1]?.memory.totalAllocated || 0) / 1024 / 1024).toFixed(0)}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {showConsole && (
        <div className="border-t border-slate-700 p-6 h-64 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Console</h2>
            <button
              onClick={clearLogs}
              className="text-sm text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          </div>

          {logs.length === 0 ? (
            <p className="text-slate-400 text-sm">No logs</p>
          ) : (
            <div className="space-y-1 font-mono text-xs">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    log.type === 'error'
                      ? 'bg-red-900/20 text-red-300'
                      : log.type === 'warning'
                      ? 'bg-yellow-900/20 text-yellow-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>{' '}
                  {log.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
