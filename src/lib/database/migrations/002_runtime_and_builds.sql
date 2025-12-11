/*
  # Runtime Sessions and Build Jobs Schema

  1. New Tables
    - `slate_runtime_sessions`
      - `id` (uuid, primary key) - Session identifier
      - `project_id` (uuid, foreign key) - Associated project
      - `user_id` (text) - User who started the session
      - `runtime_type` (text) - Type of runtime (unity, unreal, etc)
      - `status` (text) - Current status of the session
      - `container_id` (text, nullable) - Docker container ID
      - `container_config` (jsonb) - Container configuration
      - `started_at` (timestamptz, nullable) - When the session started
      - `stopped_at` (timestamptz, nullable) - When the session stopped
      - `error_message` (text, nullable) - Error details if failed
      - `metadata` (jsonb) - Additional session metadata
      - `created_at` (timestamptz) - Session creation time
      - `updated_at` (timestamptz) - Last update time
      - `deleted_at` (timestamptz, nullable) - Soft delete timestamp

    - `slate_runtime_logs`
      - `id` (uuid, primary key) - Log entry identifier
      - `session_id` (uuid, foreign key) - Associated session
      - `level` (text) - Log level (debug, info, warn, error)
      - `message` (text) - Log message
      - `timestamp` (timestamptz) - When the log was created
      - `metadata` (jsonb, nullable) - Additional log data

    - `slate_build_jobs`
      - `id` (uuid, primary key) - Build job identifier
      - `project_id` (uuid, foreign key) - Associated project
      - `user_id` (text) - User who started the build
      - `status` (text) - Current build status
      - `build_type` (text) - Build type (development, staging, production)
      - `target_platform` (text) - Target platform
      - `source_commit` (text, nullable) - Git commit hash
      - `output_path` (text, nullable) - Build output location
      - `error_message` (text, nullable) - Error details if failed
      - `progress` (integer) - Build progress percentage (0-100)
      - `started_at` (timestamptz, nullable) - When the build started
      - `completed_at` (timestamptz, nullable) - When the build finished
      - `metadata` (jsonb) - Additional build metadata
      - `created_at` (timestamptz) - Job creation time
      - `updated_at` (timestamptz) - Last update time
      - `deleted_at` (timestamptz, nullable) - Soft delete timestamp

  2. Indexes
    - Performance indexes on foreign keys and status fields
    - Composite indexes for common query patterns
    - Index on timestamps for log queries

  3. Constraints
    - Foreign key constraints to projects
    - Check constraints on status values
    - Check constraint on progress (0-100)
*/

-- Runtime Sessions Table
CREATE TABLE IF NOT EXISTS slate_runtime_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES slate_projects(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  runtime_type text NOT NULL DEFAULT 'unity',
  status text NOT NULL DEFAULT 'creating',
  container_id text,
  container_config jsonb NOT NULL DEFAULT '{}',
  started_at timestamptz,
  stopped_at timestamptz,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz,
  CONSTRAINT valid_runtime_type CHECK (
    runtime_type IN ('unity', 'unreal', 'godot', 'custom')
  ),
  CONSTRAINT valid_session_status CHECK (
    status IN ('creating', 'starting', 'running', 'stopping', 'stopped', 'failed', 'error')
  )
);

-- Runtime Logs Table
CREATE TABLE IF NOT EXISTS slate_runtime_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES slate_runtime_sessions(id) ON DELETE CASCADE,
  level text NOT NULL DEFAULT 'info',
  message text NOT NULL,
  timestamp timestamptz DEFAULT now() NOT NULL,
  metadata jsonb DEFAULT '{}',
  CONSTRAINT valid_log_level CHECK (
    level IN ('debug', 'info', 'warn', 'error')
  )
);

-- Build Jobs Table
CREATE TABLE IF NOT EXISTS slate_build_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES slate_projects(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  build_type text NOT NULL DEFAULT 'development',
  target_platform text NOT NULL,
  source_commit text,
  output_path text,
  error_message text,
  progress integer DEFAULT 0 NOT NULL,
  started_at timestamptz,
  completed_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz,
  CONSTRAINT valid_build_status CHECK (
    status IN ('queued', 'building', 'completed', 'failed', 'cancelled')
  ),
  CONSTRAINT valid_build_type CHECK (
    build_type IN ('development', 'staging', 'production')
  ),
  CONSTRAINT valid_progress CHECK (
    progress >= 0 AND progress <= 100
  )
);

-- Indexes for Runtime Sessions
CREATE INDEX IF NOT EXISTS idx_runtime_sessions_project ON slate_runtime_sessions(project_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_runtime_sessions_user ON slate_runtime_sessions(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_runtime_sessions_status ON slate_runtime_sessions(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_runtime_sessions_created ON slate_runtime_sessions(created_at DESC);

-- Indexes for Runtime Logs
CREATE INDEX IF NOT EXISTS idx_runtime_logs_session ON slate_runtime_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_runtime_logs_timestamp ON slate_runtime_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_runtime_logs_level ON slate_runtime_logs(level);

-- Indexes for Build Jobs
CREATE INDEX IF NOT EXISTS idx_build_jobs_project ON slate_build_jobs(project_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_build_jobs_user ON slate_build_jobs(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_build_jobs_status ON slate_build_jobs(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_build_jobs_created ON slate_build_jobs(created_at DESC);

-- Update Triggers
CREATE OR REPLACE FUNCTION update_runtime_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_build_job_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trigger_update_runtime_session_updated_at'
  ) THEN
    CREATE TRIGGER trigger_update_runtime_session_updated_at
      BEFORE UPDATE ON slate_runtime_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_runtime_session_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trigger_update_build_job_updated_at'
  ) THEN
    CREATE TRIGGER trigger_update_build_job_updated_at
      BEFORE UPDATE ON slate_build_jobs
      FOR EACH ROW
      EXECUTE FUNCTION update_build_job_updated_at();
  END IF;
END $$;
