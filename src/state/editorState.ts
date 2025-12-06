/**
 * Editor State Management
 * Zustand store for Slate editor state
 */

import { create } from 'zustand';
import { SandpackFiles } from '@codesandbox/sandpack-react';

export interface EditorFile {
  path: string;
  content: string;
  language?: string;
  isDirty?: boolean;
}

export interface EditorState {
  files: Record<string, EditorFile>;
  activeFile: string | null;
  openFiles: string[];
  selectedFiles: string[];
  selectedFile: string | null; // For FileTree selection
  
  // Runtime & Build State
  buildStatus: "idle" | "running" | "error";
  cursorLine: number;
  cursorCol: number;
  runtimeMessages: string[];
  runtimeError: string | null;
  
  // Actions
  setFiles: (files: SandpackFiles) => void;
  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  updateFile: (path: string, content: string) => void;
  createFile: (path: string, content: string) => void;
  deleteFile: (path: string) => void;
  setActiveFile: (path: string) => void;
  selectFiles: (paths: string[]) => void;
  setSelectedFile: (path: string | null) => void;
  setBuildStatus: (status: "idle" | "running" | "error") => void;
  setCursorPosition: (line: number, col: number) => void;
  pushMessage: (msg: string) => void;
  setRuntimeError: (msg: string | null) => void;
  markDirty: (path: string, isDirty: boolean) => void;
}

export const useEditorState = create<EditorState>((set) => ({
  files: {},
  activeFile: null,
  openFiles: [],
  selectedFiles: [],
  selectedFile: null,
  
  // Runtime & Build State
  buildStatus: "idle",
  cursorLine: 1,
  cursorCol: 1,
  runtimeMessages: [],
  runtimeError: null,

  setFiles: (files) => {
    const editorFiles: Record<string, EditorFile> = {};
    
    Object.entries(files).forEach(([path, file]) => {
      const content = typeof file === 'string' ? file : ('code' in file ? file.code : '');
      editorFiles[path] = {
        path,
        content,
        isDirty: false,
      };
    });

    set({ files: editorFiles });
  },

  openFile: (path) =>
    set((state) => {
      if (state.openFiles.includes(path)) {
        return state;
      }
      return {
        openFiles: [...state.openFiles, path],
        activeFile: path,
      };
    }),

  closeFile: (path) =>
    set((state) => ({
      openFiles: state.openFiles.filter((p) => p !== path),
      activeFile: state.activeFile === path 
        ? state.openFiles[state.openFiles.length - 2] || null
        : state.activeFile,
    })),

  updateFile: (path, content) =>
    set((state) => ({
      files: {
        ...state.files,
        [path]: {
          ...state.files[path],
          content,
          isDirty: true,
        },
      },
    })),

  createFile: (path, content) =>
    set((state) => ({
      files: {
        ...state.files,
        [path]: {
          path,
          content,
          isDirty: false,
        },
      },
      openFiles: [...state.openFiles, path],
      activeFile: path,
    })),

  deleteFile: (path) =>
    set((state) => {
      const newFiles = { ...state.files };
      delete newFiles[path];
      
      return {
        files: newFiles,
        openFiles: state.openFiles.filter((p) => p !== path),
        activeFile: state.activeFile === path ? null : state.activeFile,
      };
    }),

  setActiveFile: (path) =>
    set((state) => ({
      activeFile: path,
      openFiles: state.openFiles.includes(path)
        ? state.openFiles
        : [...state.openFiles, path],
    })),

  selectFiles: (paths) => set({ selectedFiles: paths }),

  setSelectedFile: (path) => set({ selectedFile: path }),

  setBuildStatus: (status) => set({ buildStatus: status }),

  setCursorPosition: (line, col) => set({ cursorLine: line, cursorCol: col }),

  pushMessage: (msg) =>
    set((s) => ({ runtimeMessages: [...s.runtimeMessages, msg] })),

  setRuntimeError: (msg) => set({ runtimeError: msg }),

  markDirty: (path, isDirty) =>
    set((state) => ({
      files: {
        ...state.files,
        [path]: {
          ...state.files[path],
          isDirty,
        },
      },
    })),
}));

