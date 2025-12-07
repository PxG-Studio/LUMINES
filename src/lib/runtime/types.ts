export type ContainerStatus = 'creating' | 'starting' | 'running' | 'stopping' | 'stopped' | 'failed' | 'error';

export type RuntimeType = 'unity' | 'unreal' | 'godot' | 'custom';

export interface ContainerConfig {
  image: string;
  tag: string;
  name: string;
  ports?: Record<string, number>;
  env?: Record<string, string>;
  volumes?: Array<{
    host: string;
    container: string;
    readOnly?: boolean;
  }>;
  memory?: string;
  cpus?: number;
  gpu?: boolean;
  networkMode?: string;
}

export interface RuntimeSession {
  id: string;
  project_id: string;
  user_id: string;
  runtime_type: RuntimeType;
  status: ContainerStatus;
  container_id?: string;
  container_config: ContainerConfig;
  started_at?: string;
  stopped_at?: string;
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RuntimeSessionInsert {
  project_id: string;
  user_id: string;
  runtime_type: RuntimeType;
  container_config: ContainerConfig;
  metadata?: Record<string, any>;
}

export interface RuntimeSessionUpdate {
  status?: ContainerStatus;
  container_id?: string;
  started_at?: string;
  stopped_at?: string;
  error_message?: string;
  metadata?: Record<string, any>;
}

export interface RuntimeLog {
  id: string;
  session_id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface BuildJob {
  id: string;
  project_id: string;
  user_id: string;
  status: 'queued' | 'building' | 'completed' | 'failed' | 'cancelled';
  build_type: 'development' | 'staging' | 'production';
  target_platform: string;
  source_commit?: string;
  output_path?: string;
  error_message?: string;
  progress: number;
  started_at?: string;
  completed_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface BuildJobInsert {
  project_id: string;
  user_id: string;
  build_type: 'development' | 'staging' | 'production';
  target_platform: string;
  source_commit?: string;
  metadata?: Record<string, any>;
}

export interface BuildJobUpdate {
  status?: 'queued' | 'building' | 'completed' | 'failed' | 'cancelled';
  progress?: number;
  output_path?: string;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  metadata?: Record<string, any>;
}

export interface ContainerStats {
  cpu_percent: number;
  memory_usage: number;
  memory_limit: number;
  network_rx_bytes: number;
  network_tx_bytes: number;
  timestamp: number;
}

export interface RuntimeCommand {
  type: 'start' | 'stop' | 'restart' | 'execute' | 'stats';
  session_id: string;
  command?: string;
  args?: string[];
  timeout?: number;
}

export interface RuntimeCommandResult {
  success: boolean;
  output?: string;
  error?: string;
  exit_code?: number;
  stats?: ContainerStats;
}
