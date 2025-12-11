export const CacheKeys = {
  project: (projectId: string) => `slate:project:${projectId}`,
  projectList: (userId: string) => `slate:projects:user:${userId}`,

  file: (fileId: string) => `slate:file:${fileId}`,
  fileByPath: (projectId: string, path: string) => `slate:file:${projectId}:${path}`,
  projectFiles: (projectId: string) => `slate:files:project:${projectId}`,

  asset: (assetId: string) => `slate:asset:${assetId}`,
  projectAssets: (projectId: string) => `slate:assets:project:${projectId}`,
  assetComponents: (assetId: string) => `slate:asset:${assetId}:components`,

  runtimeSession: (sessionId: string) => `slate:runtime:${sessionId}`,
  runtimeSessionList: (projectId: string) => `slate:runtime:sessions:${projectId}`,
  runtimeStatus: (projectId: string) => `slate:runtime:status:${projectId}`,

  editorTabs: (userId: string, projectId: string) => `slate:editor:tabs:${userId}:${projectId}`,

  userSession: (userId: string) => `slate:session:${userId}`,

  buildCache: (projectId: string) => `slate:build:${projectId}`,

  searchCache: (projectId: string, query: string) => `slate:search:${projectId}:${query}`,
} as const;

export const CacheTTL = {
  project: 3600,
  projectList: 1800,
  file: 1800,
  projectFiles: 600,
  asset: 3600,
  projectAssets: 1800,
  assetComponents: 1800,
  runtimeSession: 300,
  runtimeSessionList: 300,
  runtimeStatus: 60,
  editorTabs: 1800,
  userSession: 86400,
  buildCache: 7200,
  searchCache: 300,
} as const;
