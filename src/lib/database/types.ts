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
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      slate_files: {
        Row: {
          id: string;
          project_id: string;
          path: string;
          content: string;
          type: string;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          path: string;
          content?: string;
          type: string;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          path?: string;
          content?: string;
          type?: string;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      slate_assets: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          type: string;
          metadata: Json;
          file_path: string | null;
          guid: string | null;
          file_id: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          type: string;
          metadata?: Json;
          file_path?: string | null;
          guid?: string | null;
          file_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          type?: string;
          metadata?: Json;
          file_path?: string | null;
          guid?: string | null;
          file_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      slate_asset_components: {
        Row: {
          id: string;
          asset_id: string;
          component_type: string;
          properties: Json;
          editable: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          component_type: string;
          properties: Json;
          editable?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          component_type?: string;
          properties?: Json;
          editable?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      slate_asset_dependencies: {
        Row: {
          id: string;
          asset_id: string;
          dependency_asset_id: string;
          dependency_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          dependency_asset_id: string;
          dependency_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          dependency_asset_id?: string;
          dependency_type?: string | null;
          created_at?: string;
        };
      };
      slate_runtime_sessions: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          status: string;
          logs: Json;
          errors: Json;
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          status?: string;
          logs?: Json;
          errors?: Json;
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          status?: string;
          logs?: Json;
          errors?: Json;
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
        };
      };
      slate_editor_tabs: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          file_id: string;
          position: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          file_id: string;
          position?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          file_id?: string;
          position?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

export type SlateProject = Database['public']['Tables']['slate_projects']['Row'];
export type SlateProjectInsert = Database['public']['Tables']['slate_projects']['Insert'];
export type SlateProjectUpdate = Database['public']['Tables']['slate_projects']['Update'];

export type SlateFile = Database['public']['Tables']['slate_files']['Row'];
export type SlateFileInsert = Database['public']['Tables']['slate_files']['Insert'];
export type SlateFileUpdate = Database['public']['Tables']['slate_files']['Update'];

export type SlateAsset = Database['public']['Tables']['slate_assets']['Row'];
export type SlateAssetInsert = Database['public']['Tables']['slate_assets']['Insert'];
export type SlateAssetUpdate = Database['public']['Tables']['slate_assets']['Update'];

export type SlateAssetComponent = Database['public']['Tables']['slate_asset_components']['Row'];
export type SlateAssetComponentInsert = Database['public']['Tables']['slate_asset_components']['Insert'];
export type SlateAssetComponentUpdate = Database['public']['Tables']['slate_asset_components']['Update'];

export type SlateAssetDependency = Database['public']['Tables']['slate_asset_dependencies']['Row'];
export type SlateAssetDependencyInsert = Database['public']['Tables']['slate_asset_dependencies']['Insert'];
export type SlateAssetDependencyUpdate = Database['public']['Tables']['slate_asset_dependencies']['Update'];

export type SlateRuntimeSession = Database['public']['Tables']['slate_runtime_sessions']['Row'];
export type SlateRuntimeSessionInsert = Database['public']['Tables']['slate_runtime_sessions']['Insert'];
export type SlateRuntimeSessionUpdate = Database['public']['Tables']['slate_runtime_sessions']['Update'];

export type SlateEditorTab = Database['public']['Tables']['slate_editor_tabs']['Row'];
export type SlateEditorTabInsert = Database['public']['Tables']['slate_editor_tabs']['Insert'];
export type SlateEditorTabUpdate = Database['public']['Tables']['slate_editor_tabs']['Update'];

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
