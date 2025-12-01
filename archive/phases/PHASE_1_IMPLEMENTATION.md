# Phase 1: Core Editor Integration

## Goal
Get the basic IDE shell (Slate) working with Monaco Editor and connect it to the runtime layer.

## Tasks

### 1. Monaco Editor Integration
- [ ] Install `@monaco-editor/react`
- [ ] Replace CodeEditor placeholder with real Monaco
- [ ] Configure Monaco themes (Nocturna dark)
- [ ] Wire up to EditorState
- [ ] Add syntax highlighting for TS/TSX/JS/JSX

### 2. Slate Page Restructure
- [ ] Build IDE shell layout with SplitView
- [ ] Integrate FileTree in sidebar
- [ ] Add TabBar for open files
- [ ] Connect Monaco Editor to active file
- [ ] Add basic file operations (new, save, delete)

### 3. Runtime Connection
- [ ] Set up SandpackProvider in Ignition
- [ ] Connect SandpackBridge to Monaco changes
- [ ] Test code change propagation
- [ ] Add basic compile/error display

### 4. Basic File System
- [ ] Initialize default project structure
- [ ] Create starter files (App.tsx, package.json)
- [ ] Enable file creation/deletion
- [ ] Save state to localStorage

## Success Criteria
- ✅ Monaco Editor loads and displays code
- ✅ FileTree shows project structure
- ✅ Opening file switches editor content
- ✅ Code changes sync to runtime
- ✅ Basic file operations work

## Estimated Time: 2-3 hours


