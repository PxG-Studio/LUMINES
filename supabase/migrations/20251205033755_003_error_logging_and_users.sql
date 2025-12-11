/*
  # Error Logging and Users Migration

  1. New Tables
    - `users` - User accounts (no Supabase auth)
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `name` (text)
      - `avatar` (text)
      - `roles` (text array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_sessions` - Session management (Redis-backed)
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `token` (text, not null)
      - `expires_at` (timestamptz, not null)
      - `created_at` (timestamptz)

  2. Changes
    - Add user_id to existing tables
    - Add foreign key constraints
    - Add indexes for performance

  3. Security
    - Users table is application-managed (no RLS)
    - Sessions stored in Redis
    - Error logs for debugging and monitoring
*/

-- Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (application-managed auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar TEXT,
  roles TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions table (Redis-backed, for persistence)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);

CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON slate_error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON slate_projects(user_id);

-- Add updated_at trigger for users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_sessions WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old error logs (30+ days)
CREATE OR REPLACE FUNCTION cleanup_old_error_logs(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM slate_error_logs WHERE created_at < NOW() - INTERVAL '1 day' * days_old;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;