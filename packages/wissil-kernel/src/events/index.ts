/**
 * Event Schemas
 * 
 * Event type definitions for JetStream and real-time sync
 */

import { IDEEvent } from '../types';

// Ignis events
export type IgnisEventType = 
  | 'node.add'
  | 'node.move'
  | 'node.delete'
  | 'node.update'
  | 'wire.create'
  | 'wire.delete'
  | 'graph.rename'
  | 'graph.save';

// Unity events
export type UnityEventType =
  | 'scenegraph.select'
  | 'scenegraph.add'
  | 'scenegraph.delete'
  | 'prefab.edit'
  | 'shader.param.change'
  | 'timeline.scrub'
  | 'material.update';

// Spark events
export type SparkEventType =
  | 'template.create'
  | 'template.load'
  | 'template.save'
  | 'template.delete';

// Ignition events
export type IgnitionEventType =
  | 'build.start'
  | 'build.complete'
  | 'build.error'
  | 'runtime.log'
  | 'runtime.error';

// Waypoint events
export type WaypointEventType =
  | 'ai.suggestion'
  | 'ai.generate'
  | 'ai.explain'
  | 'ai.fix';

// Event factory
export function createIDEEvent(
  sessionId: string,
  userId: string,
  subsystem: IDEEvent['event']['subsystem'],
  eventType: string,
  payload: any,
  metadata?: IDEEvent['metadata']
): IDEEvent {
  return {
    sessionId,
    userId,
    timestamp: Date.now(),
    event: {
      type: eventType,
      subsystem,
      payload
    },
    metadata
  };
}

