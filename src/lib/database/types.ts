export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      slate_projects: {
        Row: SlateProject;
        Insert: Omit<SlateProject, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SlateProject, 'id' | 'created_at'>>;
      };
      slate_files: {
        Row: SlateFile;
        Insert: Omit<SlateFile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SlateFile, 'id' | 'created_at'>>;
      };
      slate_assets: {
        Row: SlateAsset;
        Insert: Omit<SlateAsset, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SlateAsset, 'id' | 'created_at'>>;
      };
      slate_asset_components: {
        Row: SlateAssetComponent;
        Insert: Omit<SlateAssetComponent, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SlateAssetComponent, 'id' | 'created_at'>>;
      };
      slate_asset_dependencies: {
        Row: SlateAssetDependency;
        Insert: Omit<SlateAssetDependency, 'id' | 'created_at'>;
        Update: Partial<Omit<SlateAssetDependency, 'id' | 'created_at'>>;
      };
      slate_runtime_sessions: {
        Row: SlateRuntimeSession;
        Insert: Omit<SlateRuntimeSession, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SlateRuntimeSession, 'id' | 'created_at'>>;
      };
      slate_editor_tabs: {
        Row: SlateEditorTab;
        Insert: Omit<SlateEditorTab, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SlateEditorTab, 'id' | 'created_at'>>;
      };
      slate_error_logs: {
        Row: SlateErrorLog;
        Insert: Omit<SlateErrorLog, 'id' | 'created_at'>;
        Update: Partial<SlateErrorLog>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

export interface SlateProject {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SlateFile {
  id: string;
  project_id: string;
  path: string;
  content?: string | null;
  type?: string | null;
  size: number;
  version: number;
  encoding: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SlateAsset {
  id: string;
  project_id: string;
  name: string;
  type: string;
  metadata: Record<string, any>;
  file_path?: string | null;
  registry_path?: string | null;
  guid?: string | null;
  file_id?: number | null;
  size: number;
  mime_type?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SlateAssetComponent {
  id: string;
  asset_id: string;
  component_type: string;
  component_name?: string | null;
  properties: Record<string, any>;
  editable: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SlateAssetDependency {
  id: string;
  asset_id: string;
  dependency_asset_id?: string | null;
  dependency_type?: string | null;
  dependency_path?: string | null;
  is_resolved: boolean;
  created_at: string;
}

export interface SlateRuntimeSession {
  id: string;
  user_id: string;
  project_id: string;
  status: string;
  logs: any[];
  errors: any[];
  console_output?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SlateEditorTab {
  id: string;
  user_id: string;
  project_id: string;
  file_id: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SlateErrorLog {
  id: string;
  user_id?: string | null;
  project_id?: string | null;
  error_type?: string | null;
  error_message?: string | null;
  error_stack?: string | null;
  context: Record<string, any>;
  severity: string;
  created_at: string;
}

export type SlateProjectInsert = Database['public']['Tables']['slate_projects']['Insert'];
export type SlateProjectUpdate = Database['public']['Tables']['slate_projects']['Update'];

export type SlateFileInsert = Database['public']['Tables']['slate_files']['Insert'];
export type SlateFileUpdate = Database['public']['Tables']['slate_files']['Update'];

export type SlateAssetInsert = Database['public']['Tables']['slate_assets']['Insert'];
export type SlateAssetUpdate = Database['public']['Tables']['slate_assets']['Update'];

export type SlateAssetComponentInsert = Database['public']['Tables']['slate_asset_components']['Insert'];
export type SlateAssetComponentUpdate = Database['public']['Tables']['slate_asset_components']['Update'];

export type SlateAssetDependencyInsert = Database['public']['Tables']['slate_asset_dependencies']['Insert'];
export type SlateAssetDependencyUpdate = Database['public']['Tables']['slate_asset_dependencies']['Update'];

export type SlateRuntimeSessionInsert = Database['public']['Tables']['slate_runtime_sessions']['Insert'];
export type SlateRuntimeSessionUpdate = Database['public']['Tables']['slate_runtime_sessions']['Update'];

export type SlateEditorTabInsert = Database['public']['Tables']['slate_editor_tabs']['Insert'];
export type SlateEditorTabUpdate = Database['public']['Tables']['slate_editor_tabs']['Update'];

export type SlateErrorLogInsert = Database['public']['Tables']['slate_error_logs']['Insert'];
export type SlateErrorLogUpdate = Database['public']['Tables']['slate_error_logs']['Update'];

export interface UnityAssetMetadata {
  guid?: string;
  fileID?: number;
  type?: string;
  size?: number;
  format?: string;
  width?: number;
  height?: number;
  components?: string[];
  dependencies?: string[];
  [key: string]: Json | undefined;
}

export interface ProjectMetadata {
  unity_version?: string;
  template?: string;
  description?: string;
  tags?: string[];
  [key: string]: Json | undefined;
}

export interface ComponentProperties {
  [key: string]: Json | undefined;
}

export interface RuntimeLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source?: string;
}

export interface RuntimeError {
  timestamp: string;
  message: string;
  stack?: string;
  source?: string;
}
