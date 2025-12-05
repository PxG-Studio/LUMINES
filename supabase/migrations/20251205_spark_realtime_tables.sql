/*
  # SPARK Real-Time Architecture Database Schema

  1. New Tables
    - `spark_user_profiles` - User tier, permissions, quotas
    - `spark_sessions` - Real-time session tracking
    - `spark_rate_limits` - Rate limit tracking per user/endpoint
    - `spark_token_usage` - Monthly token usage tracking
    - `spark_requests` - Daily request tracking
    - `spark_deltas` - State delta history
    - `spark_generated_scripts` - Generated Unity scripts
    - `spark_files` - IDE file tracking with versioning
    - `spark_unity_prefabs` - Unity prefab storage
    - `spark_unity_materials` - Unity material storage
    - `spark_build_jobs` - Build job queue

  2. Security
    - Enable RLS on all tables
    - Restrict access to authenticated users
    - Users can only access their own data
*/

-- User profiles
CREATE TABLE IF NOT EXISTS spark_user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  permissions text[] NOT NULL DEFAULT ARRAY['spark:read', 'spark:generate'],
  quotas jsonb NOT NULL DEFAULT '{"monthlyTokens": 100000, "dailyRequests": 100, "concurrentSessions": 1}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE spark_user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON spark_user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON spark_user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Sessions
CREATE TABLE IF NOT EXISTS spark_sessions (
  session_id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE spark_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sessions"
  ON spark_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON spark_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON spark_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Rate limits
CREATE TABLE IF NOT EXISTS spark_rate_limits (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  current int NOT NULL DEFAULT 0,
  limit int NOT NULL,
  reset_at timestamptz NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

ALTER TABLE spark_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own rate limits"
  ON spark_rate_limits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Token usage
CREATE TABLE IF NOT EXISTS spark_token_usage (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tokens_used int NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spark_token_usage_user_date 
  ON spark_token_usage(user_id, created_at DESC);

ALTER TABLE spark_token_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own token usage"
  ON spark_token_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Requests
CREATE TABLE IF NOT EXISTS spark_requests (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spark_requests_user_date 
  ON spark_requests(user_id, created_at DESC);

ALTER TABLE spark_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own requests"
  ON spark_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Deltas (state updates)
CREATE TABLE IF NOT EXISTS spark_deltas (
  id bigserial PRIMARY KEY,
  session_id text NOT NULL REFERENCES spark_sessions(session_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta_type text NOT NULL,
  delta_data jsonb NOT NULL,
  version int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spark_deltas_session 
  ON spark_deltas(session_id, version DESC);

ALTER TABLE spark_deltas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own deltas"
  ON spark_deltas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deltas"
  ON spark_deltas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Generated scripts
CREATE TABLE IF NOT EXISTS spark_generated_scripts (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  script_name text NOT NULL,
  script_content text NOT NULL,
  prompt text NOT NULL,
  class_name text,
  namespace text,
  base_class text DEFAULT 'MonoBehaviour',
  tokens_used int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spark_generated_scripts_user 
  ON spark_generated_scripts(user_id, created_at DESC);

ALTER TABLE spark_generated_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own generated scripts"
  ON spark_generated_scripts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own generated scripts"
  ON spark_generated_scripts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Files (IDE tracking)
CREATE TABLE IF NOT EXISTS spark_files (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  path text NOT NULL,
  content text NOT NULL,
  version int NOT NULL DEFAULT 1,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, path)
);

CREATE INDEX IF NOT EXISTS idx_spark_files_user_path 
  ON spark_files(user_id, path);

ALTER TABLE spark_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own files"
  ON spark_files FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Unity prefabs
CREATE TABLE IF NOT EXISTS spark_unity_prefabs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  prefab_name text NOT NULL,
  prefab_content text NOT NULL,
  components jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spark_unity_prefabs_user 
  ON spark_unity_prefabs(user_id, created_at DESC);

ALTER TABLE spark_unity_prefabs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own prefabs"
  ON spark_unity_prefabs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Unity materials
CREATE TABLE IF NOT EXISTS spark_unity_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  material_name text NOT NULL,
  material_content text NOT NULL,
  shader text NOT NULL,
  properties jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spark_unity_materials_user 
  ON spark_unity_materials(user_id, created_at DESC);

ALTER TABLE spark_unity_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own materials"
  ON spark_unity_materials FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Build jobs
CREATE TABLE IF NOT EXISTS spark_build_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  build_target text NOT NULL,
  build_path text NOT NULL,
  development boolean DEFAULT false,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'building', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spark_build_jobs_user_status 
  ON spark_build_jobs(user_id, status, created_at DESC);

ALTER TABLE spark_build_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own build jobs"
  ON spark_build_jobs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
