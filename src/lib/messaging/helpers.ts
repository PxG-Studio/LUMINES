import {
  publishProjectEvent,
  publishFileEvent,
  publishAssetEvent,
  publishRuntimeEvent,
  publishBuildEvent,
} from './publishers';

export const projectEvents = {
  created: async (data: { projectId: string; projectName: string; userId: string }) => {
    await publishProjectEvent({
      type: 'created',
      projectId: data.projectId,
      projectName: data.projectName,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
  updated: async (data: { projectId: string; projectName: string; userId: string }) => {
    await publishProjectEvent({
      type: 'updated',
      projectId: data.projectId,
      projectName: data.projectName,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
  deleted: async (data: { projectId: string; userId: string }) => {
    await publishProjectEvent({
      type: 'deleted',
      projectId: data.projectId,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
};

export const fileEvents = {
  created: async (data: { fileId: string; projectId: string; path: string; type?: string; userId: string }) => {
    await publishFileEvent({
      type: 'created',
      fileId: data.fileId,
      projectId: data.projectId,
      path: data.path,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
  saved: async (data: { fileId: string; projectId: string; path: string; userId: string }) => {
    await publishFileEvent({
      type: 'updated',
      fileId: data.fileId,
      projectId: data.projectId,
      path: data.path,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
  updated: async (data: { fileId: string; projectId: string; path: string; userId: string }) => {
    await publishFileEvent({
      type: 'updated',
      fileId: data.fileId,
      projectId: data.projectId,
      path: data.path,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
  deleted: async (data: { fileId: string; projectId: string; path: string; userId: string }) => {
    await publishFileEvent({
      type: 'deleted',
      fileId: data.fileId,
      projectId: data.projectId,
      path: data.path,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
};

export const assetEvents = {
  uploaded: async (data: { assetId: string; projectId: string; assetName: string; userId: string }) => {
    await publishAssetEvent({
      type: 'created',
      assetId: data.assetId,
      projectId: data.projectId,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
  parsed: async (data: { assetId: string; projectId: string; assetName: string; assetType: string; userId: string }) => {
    await publishAssetEvent({
      type: 'updated',
      assetId: data.assetId,
      projectId: data.projectId,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
  updated: async (data: { assetId: string; projectId: string; assetName: string; userId: string }) => {
    await publishAssetEvent({
      type: 'updated',
      assetId: data.assetId,
      projectId: data.projectId,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
  deleted: async (data: { assetId: string; projectId: string; assetName: string; userId: string }) => {
    await publishAssetEvent({
      type: 'deleted',
      assetId: data.assetId,
      projectId: data.projectId,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
};

export const runtimeEvents = {
  started: async (data: { sessionId: string; projectId: string; userId: string }) => {
    await publishRuntimeEvent({
      type: 'started',
      sessionId: data.sessionId,
      projectId: data.projectId,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
  stopped: async (data: { sessionId: string; projectId: string; userId: string }) => {
    await publishRuntimeEvent({
      type: 'stopped',
      sessionId: data.sessionId,
      projectId: data.projectId,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
  log: async (data: {
    sessionId: string;
    projectId: string;
    message: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    source?: string;
    metadata?: Record<string, any>;
  }) => {
    await publishRuntimeEvent({
      type: 'log',
      sessionId: data.sessionId,
      projectId: data.projectId,
      userId: '',
      message: data.message,
      level: data.level,
      source: data.source,
      metadata: data.metadata,
      timestamp: new Date().toISOString(),
    });
  },
  error: async (data: { sessionId: string; projectId: string; error: Error }) => {
    await publishRuntimeEvent({
      type: 'error',
      sessionId: data.sessionId,
      projectId: data.projectId,
      userId: '',
      message: data.error.message,
      level: 'error',
      source: 'RuntimeEngine',
      metadata: {
        errorName: data.error.name,
        errorStack: data.error.stack,
      },
      timestamp: new Date().toISOString(),
    });
  },
};

export const buildEvents = {
  started: async (data: { buildId: string; projectId: string; userId: string }) => {
    await publishBuildEvent({
      type: 'started',
      projectId: data.projectId,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
  completed: async (data: { buildId: string; projectId: string; userId: string }) => {
    await publishBuildEvent({
      type: 'completed',
      projectId: data.projectId,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
  failed: async (data: { buildId: string; projectId: string; error: string; userId: string }) => {
    await publishBuildEvent({
      type: 'failed',
      projectId: data.projectId,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
};
