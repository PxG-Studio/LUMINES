/*
  # Unity MCP Operations Tables

  1. New Tables
    - `spark_generated_scripts` - Generated Unity C# scripts
    - `spark_previews` - Rendered scene previews with cache keys
    - `spark_build_jobs` - Unity build job tracking
    - `spark_operations` - Operation log for all Unity MCP calls

  2. Security
    - Enable RLS on all tables
    - Add policies for session-based access

  3. Indexes
    - session_id lookups (frequent)
    - cache_key lookups (preview cache)
    - job_id lookups (build status polling)
*/

CREATE TABLE IF NOT EXISTS spark_generated_scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  script_name text NOT NULL,
  script_path text NOT NULL,
  script_content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spark_scripts_session ON spark_generated_scripts(session_id);
CREATE INDEX IF NOT EXISTS idx_spark_scripts_created ON spark_generated_scripts(created_at DESC);

ALTER TABLE spark_generated_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for spark_generated_scripts"
  ON spark_generated_scripts
  FOR ALL
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS spark_previews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  scene_path text,
  game_object text,
  frame_ref text NOT NULL,
  format text NOT NULL,
  cache_key text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spark_previews_session ON spark_previews(session_id);
CREATE INDEX IF NOT EXISTS idx_spark_previews_cache ON spark_previews(cache_key);
CREATE INDEX IF NOT EXISTS idx_spark_previews_created ON spark_previews(created_at DESC);

ALTER TABLE spark_previews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for spark_previews"
  ON spark_previews
  FOR ALL
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS spark_build_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id text UNIQUE NOT NULL,
  session_id text NOT NULL,
  target text NOT NULL,
  status text NOT NULL,
  progress integer,
  error text,
  output_path text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spark_builds_job ON spark_build_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_spark_builds_session ON spark_build_jobs(session_id);
CREATE INDEX IF NOT EXISTS idx_spark_builds_status ON spark_build_jobs(status);

ALTER TABLE spark_build_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for spark_build_jobs"
  ON spark_build_jobs
  FOR ALL
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS spark_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  operation_type text NOT NULL,
  operation_data jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL,
  error text,
  duration_ms integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spark_ops_session ON spark_operations(session_id);
CREATE INDEX IF NOT EXISTS idx_spark_ops_type ON spark_operations(operation_type);
CREATE INDEX IF NOT EXISTS idx_spark_ops_created ON spark_operations(created_at DESC);

ALTER TABLE spark_operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for spark_operations"
  ON spark_operations
  FOR ALL
  TO authenticated
  USING (true);
