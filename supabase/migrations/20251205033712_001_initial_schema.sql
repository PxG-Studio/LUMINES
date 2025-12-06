/*
  # SLATE Initial Database Schema

  1. New Tables
    - `slate_projects` - Project management
    - `slate_files` - File storage
    - `slate_assets` - Unity asset metadata
    - `slate_asset_components` - Deconstructed asset components
    - `slate_asset_dependencies` - Asset dependency tracking
    - `slate_runtime_sessions` - Runtime session management
    - `slate_editor_tabs` - User editor state
    - `slate_error_logs` - Error logging

  2. Indexes
    - Performance indexes for common queries
    - Full-text search on file content
    - JSONB indexes for metadata

  3. Triggers
    - Auto-update updated_at timestamps
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE IF NOT EXISTS slate_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_slate_projects_user_id ON slate_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_slate_projects_created_at ON slate_projects(created_at DESC);

-- Files Table
CREATE TABLE IF NOT EXISTS slate_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES slate_projects(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  content TEXT,
  type VARCHAR(50),
  size BIGINT DEFAULT 0,
  version INTEGER DEFAULT 1,
  encoding VARCHAR(50) DEFAULT 'utf-8',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL,
  UNIQUE(project_id, path)
);

CREATE INDEX IF NOT EXISTS idx_slate_files_project_id ON slate_files(project_id);
CREATE INDEX IF NOT EXISTS idx_slate_files_path ON slate_files(path);
CREATE INDEX IF NOT EXISTS idx_slate_files_type ON slate_files(type);
CREATE INDEX IF NOT EXISTS idx_slate_files_content_search ON slate_files USING gin(to_tsvector('english', content));

-- Unity Assets Table
CREATE TABLE IF NOT EXISTS slate_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES slate_projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  file_path TEXT,
  registry_path TEXT,
  guid VARCHAR(36),
  file_id BIGINT,
  size BIGINT DEFAULT 0,
  mime_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_slate_assets_project_id ON slate_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_slate_assets_type ON slate_assets(type);
CREATE INDEX IF NOT EXISTS idx_slate_assets_guid ON slate_assets(guid);
CREATE INDEX IF NOT EXISTS idx_slate_assets_metadata ON slate_assets USING gin(metadata);

-- Asset Components Table (Deconstructed)
CREATE TABLE IF NOT EXISTS slate_asset_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID NOT NULL REFERENCES slate_assets(id) ON DELETE CASCADE,
  component_type VARCHAR(100) NOT NULL,
  component_name VARCHAR(255),
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  editable BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_slate_asset_components_asset_id ON slate_asset_components(asset_id);
CREATE INDEX IF NOT EXISTS idx_slate_asset_components_type ON slate_asset_components(component_type);
CREATE INDEX IF NOT EXISTS idx_slate_asset_components_properties ON slate_asset_components USING gin(properties);

-- Asset Dependencies Table
CREATE TABLE IF NOT EXISTS slate_asset_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID NOT NULL REFERENCES slate_assets(id) ON DELETE CASCADE,
  dependency_asset_id UUID REFERENCES slate_assets(id) ON DELETE CASCADE,
  dependency_type VARCHAR(50),
  dependency_path TEXT,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_slate_asset_dependencies_asset_id ON slate_asset_dependencies(asset_id);
CREATE INDEX IF NOT EXISTS idx_slate_asset_dependencies_dependency_id ON slate_asset_dependencies(dependency_asset_id);

-- Runtime Sessions Table
CREATE TABLE IF NOT EXISTS slate_runtime_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  project_id UUID NOT NULL REFERENCES slate_projects(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'idle',
  logs JSONB DEFAULT '[]'::jsonb,
  errors JSONB DEFAULT '[]'::jsonb,
  console_output TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_slate_runtime_sessions_user_id ON slate_runtime_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_slate_runtime_sessions_project_id ON slate_runtime_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_slate_runtime_sessions_status ON slate_runtime_sessions(status);
CREATE INDEX IF NOT EXISTS idx_slate_runtime_sessions_created_at ON slate_runtime_sessions(created_at DESC);

-- Editor Tabs Table (User session state)
CREATE TABLE IF NOT EXISTS slate_editor_tabs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  project_id UUID NOT NULL REFERENCES slate_projects(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES slate_files(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id, file_id)
);

CREATE INDEX IF NOT EXISTS idx_slate_editor_tabs_user_project ON slate_editor_tabs(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_slate_editor_tabs_file_id ON slate_editor_tabs(file_id);

-- Error Logs Table
CREATE TABLE IF NOT EXISTS slate_error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  project_id UUID REFERENCES slate_projects(id) ON DELETE SET NULL,
  error_type VARCHAR(100),
  error_message TEXT,
  error_stack TEXT,
  context JSONB DEFAULT '{}'::jsonb,
  severity VARCHAR(20) DEFAULT 'error',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_slate_error_logs_user_id ON slate_error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_slate_error_logs_project_id ON slate_error_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_slate_error_logs_severity ON slate_error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_slate_error_logs_created_at ON slate_error_logs(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_slate_projects_updated_at BEFORE UPDATE ON slate_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slate_files_updated_at BEFORE UPDATE ON slate_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slate_assets_updated_at BEFORE UPDATE ON slate_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slate_asset_components_updated_at BEFORE UPDATE ON slate_asset_components
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slate_runtime_sessions_updated_at BEFORE UPDATE ON slate_runtime_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slate_editor_tabs_updated_at BEFORE UPDATE ON slate_editor_tabs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();