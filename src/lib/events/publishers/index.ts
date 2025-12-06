/**
 * Event Publishers
 * Publish events to NATS message bus
 */

import { eventBus } from '../client';

/**
 * Component events (SPARK)
 */
export const componentEvents = {
  created: async (data: { componentId: string; projectId: string; component: any }) => {
    await eventBus.publish('component.created', data);
  },
  updated: async (data: { componentId: string; changes: any }) => {
    await eventBus.publish('component.updated', data);
  },
  deleted: async (data: { componentId: string }) => {
    await eventBus.publish('component.deleted', data);
  },
};

/**
 * Deployment events (WAYPOINT)
 */
export const deploymentEvents = {
  started: async (data: { deploymentId: string; projectId: string; environment?: string }) => {
    await eventBus.publish('deployment.started', data);
  },
  completed: async (data: { deploymentId: string; projectId: string; url: string; status: string }) => {
    await eventBus.publish('deployment.completed', data);
  },
  failed: async (data: { deploymentId: string; projectId: string; error: string }) => {
    await eventBus.publish('deployment.failed', data);
  },
  rolledBack: async (data: { deploymentId: string; projectId: string; userId: string; previousVersion: string; newStatus: string }) => {
    await eventBus.publish('deployment.rolledBack', data);
  },
};

/**
 * Build events (IGNIS)
 */
export const buildEvents = {
  started: async (data: { buildId: string; projectId: string }) => {
    await eventBus.publish('build.started', data);
  },
  progress: async (data: { buildId: string; progress: number; stage: string }) => {
    await eventBus.publish('build.progress', data);
  },
  completed: async (data: { buildId: string; projectId: string; artifactUrl: string; artifactSize?: bigint; status: string }) => {
    await eventBus.publish('build.completed', data);
  },
  failed: async (data: { buildId: string; projectId: string; error: string }) => {
    await eventBus.publish('build.failed', data);
  },
};

/**
 * Token events (SLATE)
 */
export const tokenEvents = {
  updated: async (data: { tokenId: string; category: string; tokens?: any }) => {
    await eventBus.publish('token.updated', data);
  },
  synced: async (data: { count: number; source: string }) => {
    await eventBus.publish('token.synced', data);
  },
};

