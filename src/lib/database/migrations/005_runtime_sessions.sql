DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'slate_runtime_sessions' AND column_name = 'logs'
  ) THEN
    ALTER TABLE slate_runtime_sessions
    ADD COLUMN logs JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_runtime_sessions_active'
  ) THEN
    CREATE INDEX idx_runtime_sessions_active
    ON slate_runtime_sessions(project_id, user_id, status)
    WHERE status = 'running';
  END IF;
END $$;
