import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useFiles } from '../hooks/useFiles';
import { useAssets } from '../hooks/useAssets';

const DEMO_USER_ID = 'demo-user-123';

export function DatabaseDemo() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const { projects, createProject, deleteProject, loading: projectsLoading } = useProjects(DEMO_USER_ID);
  const { files, fileTree, createFile, deleteFile, loading: filesLoading } = useFiles(activeProjectId);
  const { assets, createAsset, deleteAsset, loading: assetsLoading } = useAssets(activeProjectId);

  const handleCreateProject = async () => {
    const project = await createProject({
      user_id: DEMO_USER_ID,
      name: `Test Project ${Date.now()}`,
      metadata: { unity_version: '2022.3', created_by: 'Database Demo' }
    });
    setActiveProjectId(project.id);
  };

  const handleCreateFile = async () => {
    if (!activeProjectId) return;
    await createFile({
      project_id: activeProjectId,
      path: `Assets/Scripts/TestScript_${Date.now()}.cs`,
      content: '// Test C# script\nusing UnityEngine;\n\npublic class TestScript : MonoBehaviour {\n    void Start() {\n        Debug.Log("Hello from database!");\n    }\n}',
      type: 'csharp'
    });
  };

  const handleCreateAsset = async () => {
    if (!activeProjectId) return;
    await createAsset({
      project_id: activeProjectId,
      name: `TestPrefab_${Date.now()}`,
      type: 'prefab',
      metadata: {
        guid: `${Math.random().toString(36).substring(7)}`,
        fileID: Math.floor(Math.random() * 1000000000),
        components: ['Transform', 'MeshRenderer', 'BoxCollider']
      }
    });
  };

  return (
    <div className="p-6 bg-slate-900 text-white rounded-lg space-y-6 max-w-4xl">
      <div className="border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-slate-100">Database Integration Test</h2>
        <p className="text-slate-400 text-sm mt-1">Phase 1.1: PostgreSQL via Supabase</p>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-200">Projects</h3>
            <button
              onClick={handleCreateProject}
              disabled={projectsLoading}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm disabled:opacity-50"
            >
              Create Project
            </button>
          </div>
          {projectsLoading ? (
            <p className="text-slate-400 text-sm">Loading...</p>
          ) : (
            <div className="space-y-2">
              {projects.length === 0 ? (
                <p className="text-slate-400 text-sm">No projects yet. Create one to get started.</p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-2 rounded cursor-pointer ${
                      activeProjectId === project.id
                        ? 'bg-blue-900 border border-blue-600'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    onClick={() => setActiveProjectId(project.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{project.name}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(project.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(project.id);
                          if (activeProjectId === project.id) setActiveProjectId(null);
                        }}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {activeProjectId && (
          <>
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-200">Files</h3>
                <button
                  onClick={handleCreateFile}
                  disabled={filesLoading}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm disabled:opacity-50"
                >
                  Create File
                </button>
              </div>
              {filesLoading ? (
                <p className="text-slate-400 text-sm">Loading...</p>
              ) : (
                <div className="space-y-2">
                  {files.length === 0 ? (
                    <p className="text-slate-400 text-sm">No files in this project.</p>
                  ) : (
                    files.map((file) => (
                      <div
                        key={file.id}
                        className="p-2 bg-slate-700 rounded flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-mono">{file.path}</p>
                          <p className="text-xs text-slate-400">
                            v{file.version} • {file.type}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-200">Assets</h3>
                <button
                  onClick={handleCreateAsset}
                  disabled={assetsLoading}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm disabled:opacity-50"
                >
                  Create Asset
                </button>
              </div>
              {assetsLoading ? (
                <p className="text-slate-400 text-sm">Loading...</p>
              ) : (
                <div className="space-y-2">
                  {assets.length === 0 ? (
                    <p className="text-slate-400 text-sm">No assets in this project.</p>
                  ) : (
                    assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="p-2 bg-slate-700 rounded flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">{asset.name}</p>
                          <p className="text-xs text-slate-400">
                            {asset.type} • GUID: {asset.guid}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-green-700">
        <h4 className="text-sm font-semibold text-green-400 mb-2">✓ Database Integration Active</h4>
        <ul className="text-xs text-slate-400 space-y-1">
          <li>• Projects: {projects.length} total</li>
          <li>• Files: {files.length} in active project</li>
          <li>• Assets: {assets.length} in active project</li>
          <li>• File Tree Nodes: {fileTree.length}</li>
          <li>• All data persisted to Supabase (PostgreSQL)</li>
        </ul>
      </div>
    </div>
  );
}
