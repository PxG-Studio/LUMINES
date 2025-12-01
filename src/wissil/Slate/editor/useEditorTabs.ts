/**
 * Editor Tabs Store
 * Manages open files and active file state for Monaco Editor
 */

import { create } from "zustand";

type EditorTabs = {
  openFiles: string[];
  activeFile: string | null;
  open: (file: string) => void;
  close: (file: string) => void;
  setActive: (file: string) => void;
};

export const useEditorTabs = create<EditorTabs>((set) => ({
  openFiles: [],
  activeFile: null,

  open: (file) =>
    set((s) => ({
      openFiles: s.openFiles.includes(file)
        ? s.openFiles
        : [...s.openFiles, file],
      activeFile: file
    })),

  close: (file) =>
    set((s) => {
      const newFiles = s.openFiles.filter((f) => f !== file);
      const newActive = s.activeFile === file 
        ? (newFiles.length > 0 ? newFiles[0] : null)
        : s.activeFile;
      
      return {
        openFiles: newFiles,
        activeFile: newActive
      };
    }),

  setActive: (file) => 
    set((s) => ({
      activeFile: s.openFiles.includes(file) ? file : s.activeFile
    }))
}));

