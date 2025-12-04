import { publish } from './client';
import { NatsSubjects } from './subjects';
import type {
  ProjectEvent,
  FileEvent,
  AssetEvent,
  RuntimeEvent,
  BuildEvent,
  EditorEvent,
  CollaborationEvent,
} from './subjects';

export async function publishProjectEvent(event: ProjectEvent): Promise<void> {
  let subject: string;

  switch (event.type) {
    case 'created':
      subject = NatsSubjects.project.created(event.userId);
      break;
    case 'updated':
      subject = NatsSubjects.project.updated(event.projectId);
      break;
    case 'deleted':
      subject = NatsSubjects.project.deleted(event.projectId);
      break;
  }

  await publish(subject, event);
}

export async function publishFileEvent(event: FileEvent): Promise<void> {
  let subject: string;

  switch (event.type) {
    case 'created':
      subject = NatsSubjects.file.created(event.projectId);
      break;
    case 'updated':
    case 'content_changed':
      subject = NatsSubjects.file.updated(event.fileId);
      break;
    case 'deleted':
      subject = NatsSubjects.file.deleted(event.fileId);
      break;
  }

  await publish(subject, event);
}

export async function publishAssetEvent(event: AssetEvent): Promise<void> {
  let subject: string;

  switch (event.type) {
    case 'created':
      subject = NatsSubjects.asset.created(event.projectId);
      break;
    case 'updated':
      subject = NatsSubjects.asset.updated(event.assetId);
      break;
    case 'deleted':
      subject = NatsSubjects.asset.deleted(event.assetId);
      break;
    case 'component_added':
      subject = NatsSubjects.asset.componentAdded(event.assetId);
      break;
    case 'component_removed':
      subject = NatsSubjects.asset.componentRemoved(event.assetId);
      break;
  }

  await publish(subject, event);
}

export async function publishRuntimeEvent(event: RuntimeEvent): Promise<void> {
  let subject: string;

  switch (event.type) {
    case 'started':
      subject = NatsSubjects.runtime.started(event.sessionId);
      break;
    case 'stopped':
      subject = NatsSubjects.runtime.stopped(event.sessionId);
      break;
    case 'status':
      subject = NatsSubjects.runtime.status(event.sessionId);
      break;
    case 'log':
      subject = NatsSubjects.runtime.log(event.sessionId);
      break;
    case 'error':
      subject = NatsSubjects.runtime.error(event.sessionId);
      break;
  }

  await publish(subject, event);
}

export async function publishBuildEvent(event: BuildEvent): Promise<void> {
  let subject: string;

  switch (event.type) {
    case 'started':
      subject = NatsSubjects.build.started(event.projectId);
      break;
    case 'progress':
      subject = NatsSubjects.build.progress(event.projectId);
      break;
    case 'completed':
      subject = NatsSubjects.build.completed(event.projectId);
      break;
    case 'failed':
      subject = NatsSubjects.build.failed(event.projectId);
      break;
  }

  await publish(subject, event);
}

export async function publishEditorEvent(event: EditorEvent): Promise<void> {
  let subject: string;

  switch (event.type) {
    case 'opened':
      subject = NatsSubjects.editor.opened(event.userId, event.fileId);
      break;
    case 'closed':
      subject = NatsSubjects.editor.closed(event.userId, event.fileId);
      break;
    case 'cursor':
      subject = NatsSubjects.editor.cursor(event.userId, event.fileId);
      break;
    case 'selection':
      subject = NatsSubjects.editor.selection(event.userId, event.fileId);
      break;
  }

  await publish(subject, event);
}

export async function publishCollaborationEvent(event: CollaborationEvent): Promise<void> {
  let subject: string;

  switch (event.type) {
    case 'user_joined':
      subject = NatsSubjects.collaboration.userJoined(event.projectId);
      break;
    case 'user_left':
      subject = NatsSubjects.collaboration.userLeft(event.projectId);
      break;
    case 'presence':
      subject = NatsSubjects.collaboration.presence(event.projectId);
      break;
  }

  await publish(subject, event);
}
