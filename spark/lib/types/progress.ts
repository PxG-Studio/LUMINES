/**
 * Progress tracking types for Bolt-style real-time UI
 */

export type MessageRole = "user" | "assistant" | "error" | "progress" | "system" | "file-change";

export interface BaseMessage {
  id: string;
  role: MessageRole;
  timestamp: Date;
}

export interface TextMessage extends BaseMessage {
  role: "user" | "assistant" | "error" | "system";
  content: string;
}

export interface ProgressMessage extends BaseMessage {
  role: "progress";
  status: "planning" | "working" | "completed" | "error";
  title: string;
  description?: string;
  progress?: number;
  tasks?: TaskStatus[];
  fileChanges?: FileChange[];
  tokenUsage?: TokenUsage;
}

export interface FileChangeMessage extends BaseMessage {
  role: "file-change";
  changes: FileChange[];
}

export interface TaskStatus {
  id: string;
  label: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  subTasks?: TaskStatus[];
  startTime?: Date;
  endTime?: Date;
  duration?: number;
}

export interface FileChange {
  type: "created" | "modified" | "deleted";
  path: string;
  description?: string;
  size?: number;
}

export interface TokenUsage {
  used: number;
  remaining: number;
  limit: number;
  inputTokens?: number;
  outputTokens?: number;
  provider?: "claude" | "openai";
}

export interface GenerationMetadata {
  provider: "claude" | "openai";
  model: string;
  prompt: string;
  tokensUsed?: number;
  inputTokens?: number;
  outputTokens?: number;
  generationTimeMs: number;
  success: boolean;
  errorMessage?: string;
}

export type Message = TextMessage | ProgressMessage | FileChangeMessage;

export type ProgressCallback = (update: {
  stage: "planning" | "generating" | "validating" | "logging" | "completed";
  task?: TaskStatus;
  fileChanges?: FileChange[];
  tokenUsage?: TokenUsage;
  metadata?: GenerationMetadata;
}) => void;
