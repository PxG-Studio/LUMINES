import { useState } from 'react';
import { useUnitySync } from '../hooks/useUnity';
import { FolderOpen, Plus, CheckCircle, XCircle, Loader } from 'lucide-react';

interface UnityProjectInitProps {
  userId: string;
  onProjectCreated: (projectId: string) => void;
}

export function UnityProjectInit({ userId, onProjectCreated }: UnityProjectInitProps) {
  const [mode, setMode] = useState<'sync' | 'create'>('sync');
  const [projectPath, setProjectPath] = useState('');
  const [projectName, setProjectName] = useState('');
  const [unityVersion, setUnityVersion] = useState('2022.3');
  const [template, setTemplate] = useState<'empty' | '2d' | '3d' | 'urp' | 'hdrp'>('3d');

  const { sync, initialize, validate, isLoading, result, error } = useUnitySync();

  const handleSync = async () => {
    try {
      const syncResult = await sync(projectPath, userId, {
        syncAssets: true,
        syncScenes: true,
        syncPackages: true,
        syncSettings: true,
        deep: true,
      });

      if (syncResult.success) {
        onProjectCreated(syncResult.projectId);
      }
    } catch (err) {
      console.error('Sync failed:', err);
    }
  };

  const handleCreate = async () => {
    try {
      const result = await initialize(projectName, unityVersion, userId, template);
      onProjectCreated(result.projectId);
    } catch (err) {
      console.error('Initialization failed:', err);
    }
  };

  const handleValidate = async () => {
    if (!projectPath) return;

    try {
      await validate(projectPath);
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-slate-800 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-6">
          Unity Project Setup
        </h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('sync')}
            className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
              mode === 'sync'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <FolderOpen className="w-5 h-5 inline-block mr-2" />
            Sync Existing Project
          </button>

          <button
            onClick={() => setMode('create')}
            className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
              mode === 'create'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Plus className="w-5 h-5 inline-block mr-2" />
            Create New Project
          </button>
        </div>

        {mode === 'sync' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Path
              </label>
              <input
                type="text"
                value={projectPath}
                onChange={(e) => setProjectPath(e.target.value)}
                placeholder="/path/to/unity/project"
                className="w-full px-4 py-3 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-slate-400 mt-1">
                Path to the root folder containing Assets, ProjectSettings, etc.
              </p>
            </div>

            <button
              onClick={handleValidate}
              disabled={!projectPath || isLoading}
              className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Validate Project
            </button>

            <button
              onClick={handleSync}
              disabled={!projectPath || isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <FolderOpen className="w-5 h-5" />
                  Sync Project
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="MyUnityProject"
                className="w-full px-4 py-3 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Unity Version
              </label>
              <select
                value={unityVersion}
                onChange={(e) => setUnityVersion(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="2022.3">2022.3 LTS</option>
                <option value="2023.1">2023.1</option>
                <option value="2023.2">2023.2</option>
                <option value="6000.0">6000.0</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Template
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'empty', label: 'Empty' },
                  { value: '2d', label: '2D' },
                  { value: '3d', label: '3D' },
                  { value: 'urp', label: 'URP' },
                  { value: 'hdrp', label: 'HDRP' },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTemplate(t.value as any)}
                    className={`py-3 px-4 rounded-lg transition-colors ${
                      template === t.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={!projectName || isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Project
                </>
              )}
            </button>
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-300 font-medium">
                  {mode === 'sync' ? 'Project synced successfully!' : 'Project created successfully!'}
                </p>
                <p className="text-sm text-green-400 mt-1">
                  Project ID: {result.projectId}
                </p>
                {mode === 'sync' && (
                  <div className="mt-2 text-xs text-green-400 space-y-1">
                    <p>Files processed: {result.stats.filesProcessed}</p>
                    <p>Assets processed: {result.stats.assetsProcessed}</p>
                    <p>Scenes found: {result.stats.scenesFound}</p>
                    <p>Packages found: {result.stats.packagesFound}</p>
                    {result.stats.errors > 0 && (
                      <p className="text-yellow-400">
                        Errors: {result.stats.errors}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 font-medium">Operation failed</p>
                <p className="text-sm text-red-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
