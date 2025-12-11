/*
  # SPARK AI Preferences Migration

  1. New Tables
    - `spark_user_preferences` - Store user AI preferences
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users, unique)
      - `ai_provider` (text: 'claude' or 'openai')
      - `claude_model` (text: Claude model identifier)
      - `openai_model` (text: OpenAI model identifier)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `spark_generation_history` - Track generation requests
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `provider` (text: 'claude' or 'openai')
      - `model` (text: model identifier)
      - `prompt` (text)
      - `generated_code` (text)
      - `script_name` (text)
      - `success` (boolean)
      - `error_message` (text)
      - `tokens_used` (integer)
      - `generation_time_ms` (integer)
      - `created_at` (timestamptz)

  2. Indexes
    - User preferences by user_id
    - Generation history by user_id, provider, created_at

  3. Security
    - RLS enabled on both tables
    - Users can only access their own data
*/

-- Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- SPARK user preferences table
CREATE TABLE IF NOT EXISTS spark_user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ai_provider TEXT DEFAULT 'claude' CHECK (ai_provider IN ('claude', 'openai')),
  claude_model TEXT DEFAULT 'claude-sonnet-3-5-20241022',
  openai_model TEXT DEFAULT 'gpt-4',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SPARK generation history table
CREATE TABLE IF NOT EXISTS spark_generation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('claude', 'openai')),
  model TEXT NOT NULL,
  prompt TEXT NOT NULL,
  generated_code TEXT,
  script_name TEXT,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  tokens_used INTEGER DEFAULT 0,
  generation_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spark_preferences_user_id
  ON spark_user_preferences(user_id);

CREATE INDEX IF NOT EXISTS idx_spark_history_user_id
  ON spark_generation_history(user_id);

CREATE INDEX IF NOT EXISTS idx_spark_history_provider
  ON spark_generation_history(provider);

CREATE INDEX IF NOT EXISTS idx_spark_history_created_at
  ON spark_generation_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_spark_history_user_created
  ON spark_generation_history(user_id, created_at DESC);

-- Add updated_at trigger for preferences
CREATE TRIGGER update_spark_preferences_updated_at
  BEFORE UPDATE ON spark_user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE spark_user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE spark_generation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for spark_user_preferences
CREATE POLICY "Users can view own preferences"
  ON spark_user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON spark_user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON spark_user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON spark_user_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for spark_generation_history
CREATE POLICY "Users can view own generation history"
  ON spark_generation_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generation history"
  ON spark_generation_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to get or create user preferences
CREATE OR REPLACE FUNCTION get_or_create_spark_preferences(p_user_id UUID)
RETURNS spark_user_preferences AS $$
DECLARE
  preferences spark_user_preferences;
BEGIN
  SELECT * INTO preferences FROM spark_user_preferences WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO spark_user_preferences (user_id)
    VALUES (p_user_id)
    RETURNING * INTO preferences;
  END IF;

  RETURN preferences;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old generation history (90+ days)
CREATE OR REPLACE FUNCTION cleanup_old_generation_history(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM spark_generation_history
  WHERE created_at < NOW() - INTERVAL '1 day' * days_old;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get user generation stats
CREATE OR REPLACE FUNCTION get_user_generation_stats(p_user_id UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  total_generations BIGINT,
  successful_generations BIGINT,
  failed_generations BIGINT,
  claude_generations BIGINT,
  openai_generations BIGINT,
  total_tokens_used BIGINT,
  avg_generation_time_ms NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_generations,
    COUNT(*) FILTER (WHERE success = true)::BIGINT as successful_generations,
    COUNT(*) FILTER (WHERE success = false)::BIGINT as failed_generations,
    COUNT(*) FILTER (WHERE provider = 'claude')::BIGINT as claude_generations,
    COUNT(*) FILTER (WHERE provider = 'openai')::BIGINT as openai_generations,
    COALESCE(SUM(tokens_used), 0)::BIGINT as total_tokens_used,
    COALESCE(AVG(generation_time_ms), 0)::NUMERIC as avg_generation_time_ms
  FROM spark_generation_history
  WHERE user_id = p_user_id
    AND created_at >= NOW() - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;