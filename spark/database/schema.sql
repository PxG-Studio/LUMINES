/*
  SPARK PostgreSQL Schema (SLATE Infrastructure)

  Run on primary: 192.168.86.27:5432
  Replica: 192.168.86.28:5432

  NO SUPABASE - Direct PostgreSQL only

  Execute with: psql -h 192.168.86.27 -U slate_user -d wissil_db -f schema.sql

  Tables:
  - spark_sessions - Real-time session tracking
  - spark_events - All realtime events (partitioned by month)
  - spark_function_calls - Function call tracking
  - spark_telemetry - Telemetry data
  - spark_usage - Token usage per session
  - spark_previews - Preview frames
  - spark_generated_scripts - Generated code storage
  - spark_build_jobs - Build job queue
  - spark_usage_daily - Daily usage rollups
  - spark_errors_daily - Daily error rate rollups
  - spark_events_daily - Daily event count rollups
*/

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions
CREATE TABLE IF NOT EXISTS spark_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL UNIQUE,
  user_id UUID,
  model TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('creative', 'deterministic', 'hybrid')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  meta JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_spark_sessions_user ON spark_sessions (user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_spark_sessions_sid ON spark_sessions (session_id);

-- Events (partitioned by month)
CREATE TABLE IF NOT EXISTS spark_events (
  id BIGSERIAL,
  session_id TEXT NOT NULL,
  type TEXT NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID,
  project_id UUID,
  payload JSONB NOT NULL,
  PRIMARY KEY (id, ts)
) PARTITION BY RANGE (ts);

-- Create initial partitions (December 2025, January 2026)
CREATE TABLE IF NOT EXISTS spark_events_2025_12 PARTITION OF spark_events
  FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS spark_events_2026_01 PARTITION OF spark_events
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE INDEX IF NOT EXISTS idx_spark_events_session ON spark_events (session_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_spark_events_type ON spark_events (type, ts DESC);
CREATE INDEX IF NOT EXISTS idx_spark_events_payload ON spark_events USING GIN (payload);

-- Function calls
CREATE TABLE IF NOT EXISTS spark_function_calls (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  call_id TEXT NOT NULL,
  name TEXT NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_ms INT,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  error TEXT,
  args JSONB,
  output JSONB
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_spark_function_calls_unique ON spark_function_calls (session_id, call_id);
CREATE INDEX IF NOT EXISTS idx_spark_function_calls_name ON spark_function_calls (name, ts DESC);
CREATE INDEX IF NOT EXISTS idx_spark_function_calls_status ON spark_function_calls (status, ts DESC);

-- Telemetry
CREATE TABLE IF NOT EXISTS spark_telemetry (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_spark_telemetry_session ON spark_telemetry (session_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_spark_telemetry_kind ON spark_telemetry (kind, ts DESC);

-- Usage (tokens/cost)
CREATE TABLE IF NOT EXISTS spark_usage (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  model TEXT NOT NULL,
  tokens_prompt INT DEFAULT 0,
  tokens_completion INT DEFAULT 0,
  cost_estimate NUMERIC(12,6) DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_spark_usage_session ON spark_usage (session_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_spark_usage_ts ON spark_usage (ts DESC);

-- Previews
CREATE TABLE IF NOT EXISTS spark_previews (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  engine TEXT NOT NULL CHECK (engine IN ('unity', 'godot', 'pico8', 'gamemaker', 'rpgmaker', 'construct', 'renpy')),
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('idle', 'loading', 'ready', 'error')),
  frame_ref TEXT,
  meta JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_spark_previews_session ON spark_previews (session_id, engine, ts DESC);

-- Generated scripts
CREATE TABLE IF NOT EXISTS spark_generated_scripts (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  script_name TEXT NOT NULL,
  script_content TEXT NOT NULL,
  prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spark_scripts_session ON spark_generated_scripts (session_id, created_at DESC);

-- Build jobs
CREATE TABLE IF NOT EXISTS spark_build_jobs (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  build_target TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'building', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spark_builds_session ON spark_build_jobs (session_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_spark_builds_status ON spark_build_jobs (status, created_at DESC);

-- Daily usage rollups
CREATE TABLE IF NOT EXISTS spark_usage_daily (
  day DATE NOT NULL,
  session_id TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens_prompt BIGINT DEFAULT 0,
  tokens_completion BIGINT DEFAULT 0,
  cost_estimate NUMERIC(14,6) DEFAULT 0,
  PRIMARY KEY (day, session_id, model)
);

CREATE INDEX IF NOT EXISTS idx_spark_usage_daily_day ON spark_usage_daily (day, model);

-- Daily error rollups
CREATE TABLE IF NOT EXISTS spark_errors_daily (
  day DATE NOT NULL,
  name TEXT NOT NULL,
  success_count BIGINT DEFAULT 0,
  error_count BIGINT DEFAULT 0,
  error_rate NUMERIC(6,3) DEFAULT 0,
  PRIMARY KEY (day, name)
);

CREATE INDEX IF NOT EXISTS idx_spark_errors_daily_day ON spark_errors_daily (day);

-- Daily event rollups
CREATE TABLE IF NOT EXISTS spark_events_daily (
  day DATE NOT NULL,
  type TEXT NOT NULL,
  event_count BIGINT DEFAULT 0,
  PRIMARY KEY (day, type)
);

CREATE INDEX IF NOT EXISTS idx_spark_events_daily_day ON spark_events_daily (day);

-- Comments for documentation
COMMENT ON TABLE spark_sessions IS 'Real-time SPARK sessions with OpenAI RT';
COMMENT ON TABLE spark_events IS 'All realtime events (partitioned monthly)';
COMMENT ON TABLE spark_function_calls IS 'Function calls from OpenAI RT to engine bridges';
COMMENT ON TABLE spark_telemetry IS 'Telemetry data for monitoring';
COMMENT ON TABLE spark_usage IS 'Token usage and cost tracking';
COMMENT ON TABLE spark_previews IS 'Engine preview frames';
COMMENT ON TABLE spark_generated_scripts IS 'AI-generated scripts';
COMMENT ON TABLE spark_build_jobs IS 'Build job queue';
COMMENT ON TABLE spark_usage_daily IS 'Daily usage aggregates (for analytics)';
COMMENT ON TABLE spark_errors_daily IS 'Daily error rate aggregates';
COMMENT ON TABLE spark_events_daily IS 'Daily event count aggregates';
