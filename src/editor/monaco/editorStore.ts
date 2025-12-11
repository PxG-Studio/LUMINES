/**
 * Editor State Store
 * 
 * Manages editor state: open files, active editor, dirty files, etc.
 */

import { create } from 'zustand';
import type { editor } from 'monaco-editor';

export interface OpenFile {
  path: string;
  language?: string;
  isDirty: boolean;
  lastSaved?: Date;
}

interface EditorState {
  // Open files
  openFiles: OpenFile[];
  activeFilePath: string | null;
  activeEditor: editor.IStandaloneCodeEditor | null;

  // Actions
  openFile: (path: string, language?: string) => void;
  closeFile: (path: string) => void;
  setActiveFile: (path: string) => void;
  setActiveEditor: (editor: editor.IStandaloneCodeEditor | null, path: string) => void;
  markDirty: (path: string) => void;
  markClean: (path: string) => void;
  isDirty: (path: string) => boolean;
  hasUnsavedChanges: () => boolean;
  closeAllFiles: () => void;
  closeOtherFiles: (path: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  openFiles: [],
  activeFilePath: null,
  activeEditor: null,

  openFile: (path, language) => {
    const { openFiles } = get();
    const existing = openFiles.find((f) => f.path === path);

    if (existing) {
      // File already open, just activate it
      set({ activeFilePath: path });
      return;
    }

    // Add new file
    const newFile: OpenFile = {
      path,
      language,
      isDirty: false,
    };

    set({
      openFiles: [...openFiles, newFile],
      activeFilePath: path,
    });
  },

  closeFile: (path) => {
    const { openFiles, activeFilePath } = get();
    const filtered = openFiles.filter((f) => f.path !== path);

    // If closing active file, switch to another
    let newActive = activeFilePath;
    if (activeFilePath === path) {
      const index = openFiles.findIndex((f) => f.path === path);
      if (filtered.length > 0) {
        // Switch to next file, or previous if at end
        const nextIndex = index < filtered.length ? index : filtered.length - 1;
        newActive = filtered[nextIndex]?.path || null;
      } else {
        newActive = null;
      }
    }

    set({
      openFiles: filtered,
      activeFilePath: newActive,
      activeEditor: newActive === activeFilePath ? null : get().activeEditor,
    });
  },

  setActiveFile: (path) => {
    set({ activeFilePath: path });
  },

  setActiveEditor: (editor, path) => {
    set({
      activeEditor: editor,
      activeFilePath: path,
    });
  },

  markDirty: (path) => {
    const { openFiles } = get();
    const updated = openFiles.map((f) =>
      f.path === path ? { ...f, isDirty: true } : f
    );
    set({ openFiles: updated });
  },

  markClean: (path) => {
    const { openFiles } = get();
    const updated = openFiles.map((f) =>
      f.path === path ? { ...f, isDirty: false, lastSaved: new Date() } : f
    );
    set({ openFiles: updated });
  },

  isDirty: (path) => {
    const { openFiles } = get();
    const file = openFiles.find((f) => f.path === path);
    return file?.isDirty || false;
  },

  hasUnsavedChanges: () => {
    const { openFiles } = get();
    return openFiles.some((f) => f.isDirty);
  },

  closeAllFiles: () => {
    set({
      openFiles: [],
      activeFilePath: null,
      activeEditor: null,
    });
  },

  closeOtherFiles: (path) => {
    const { openFiles } = get();
    const kept = openFiles.filter((f) => f.path === path);
    set({
      openFiles: kept,
      activeFilePath: path,
    });
  },
}));

