export const NatsSubjects = {
  project: {
    created: (userId: string) => `slate.project.created.${userId}`,
    updated: (projectId: string) => `slate.project.updated.${projectId}`,
    deleted: (projectId: string) => `slate.project.deleted.${projectId}`,
    all: 'slate.project.*',
  },

  file: {
    created: (projectId: string) => `slate.file.created.${projectId}`,
    updated: (fileId: string) => `slate.file.updated.${fileId}`,
    deleted: (fileId: string) => `slate.file.deleted.${fileId}`,
    content: (fileId: string) => `slate.file.content.${fileId}`,
    allInProject: (projectId: string) => `slate.file.*.${projectId}`,
  },

  asset: {
    created: (projectId: string) => `slate.asset.created.${projectId}`,
    updated: (assetId: string) => `slate.asset.updated.${assetId}`,
    deleted: (assetId: string) => `slate.asset.deleted.${assetId}`,
    componentAdded: (assetId: string) => `slate.asset.component.added.${assetId}`,
    componentRemoved: (assetId: string) => `slate.asset.component.removed.${assetId}`,
    allInProject: (projectId: string) => `slate.asset.*.${projectId}`,
  },

  runtime: {
    started: (sessionId: string) => `slate.runtime.started.${sessionId}`,
    stopped: (sessionId: string) => `slate.runtime.stopped.${sessionId}`,
    status: (sessionId: string) => `slate.runtime.status.${sessionId}`,
    log: (sessionId: string) => `slate.runtime.log.${sessionId}`,
    error: (sessionId: string) => `slate.runtime.error.${sessionId}`,
    allForSession: (sessionId: string) => `slate.runtime.*.${sessionId}`,
  },

  build: {
    started: (projectId: string) => `slate.build.started.${projectId}`,
    progress: (projectId: string) => `slate.build.progress.${projectId}`,
    completed: (projectId: string) => `slate.build.completed.${projectId}`,
    failed: (projectId: string) => `slate.build.failed.${projectId}`,
    allForProject: (projectId: string) => `slate.build.*.${projectId}`,
  },

  editor: {
    opened: (userId: string, fileId: string) => `slate.editor.opened.${userId}.${fileId}`,
    closed: (userId: string, fileId: string) => `slate.editor.closed.${userId}.${fileId}`,
    cursor: (userId: string, fileId: string) => `slate.editor.cursor.${userId}.${fileId}`,
    selection: (userId: string, fileId: string) => `slate.editor.selection.${userId}.${fileId}`,
  },

  collaboration: {
    userJoined: (projectId: string) => `slate.collab.joined.${projectId}`,
    userLeft: (projectId: string) => `slate.collab.left.${projectId}`,
    presence: (projectId: string) => `slate.collab.presence.${projectId}`,
  },

  system: {
    health: 'slate.system.health',
    metrics: 'slate.system.metrics',
    alerts: 'slate.system.alerts',
  },
} as const;

export type ProjectEvent = {
  type: 'created' | 'updated' | 'deleted';
  projectId: string;
  userId: string;
  timestamp: number;
  data?: any;
};

export type FileEvent = {
  type: 'created' | 'updated' | 'deleted' | 'content_changed';
  fileId: string;
  projectId: string;
  userId: string;
  timestamp: number;
  data?: any;
};

export type AssetEvent = {
  type: 'created' | 'updated' | 'deleted' | 'component_added' | 'component_removed';
  assetId: string;
  projectId: string;
  userId: string;
  timestamp: number;
  data?: any;
};

export type RuntimeEvent = {
  type: 'started' | 'stopped' | 'status' | 'log' | 'error';
  sessionId: string;
  projectId: string;
  timestamp: number;
  data?: any;
};

export type BuildEvent = {
  type: 'started' | 'progress' | 'completed' | 'failed';
  projectId: string;
  timestamp: number;
  data?: any;
};

export type EditorEvent = {
  type: 'opened' | 'closed' | 'cursor' | 'selection';
  userId: string;
  fileId: string;
  timestamp: number;
  data?: any;
};

export type CollaborationEvent = {
  type: 'user_joined' | 'user_left' | 'presence';
  projectId: string;
  userId: string;
  timestamp: number;
  data?: any;
};
