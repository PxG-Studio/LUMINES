/**
 * Documentation Database
 * Virtual doc tree - in production these would be separate .mdx files
 */

const docsDb: Record<string, string> = {
  "intro/getting-started": `
# Getting Started

Welcome to **WISSIL Waypoint**, the documentation engine for the WISSIL IDE.

<Note>
WISSIL is designed to mirror Bolt.new and GameDev IDEs for modern game development workflows.
</Note>

## Features

- MDX rendering
- Live code examples
- Component documentation
- Runtime API documentation
- Full search integration

## Quick Start

1. Select a template from **Spark**
2. Edit your code in the **Monaco Editor**
3. Click **Run** to see your code execute
4. Preview Unity WebGL builds in **Ignis**

The IDE will automatically rebuild and reload on file changes.
  `,

  "runtime/runtime-overview": `
# Runtime Overview

The WISSIL Runtime has three main layers:

## 1. WISSIL-FS (Virtual Filesystem)

An in-memory virtual filesystem that stores all project files.

\`\`\`ts
import { useWissilFS } from '@/wis2l/runtime/fs/wissilFs';

const fs = useWissilFS.getState();
fs.writeFile('src/main.ts', 'console.log("Hello!");');
const content = fs.readFile('src/main.ts');
\`\`\`

<Warning>
This system is fully isolated for safety. Files exist only in memory.
</Warning>

## 2. WISSIL-BUILD (Compiler Pipeline)

Uses esbuild-wasm to transform TypeScript/JavaScript in the browser.

- Dependency graph building
- TypeScript transformation
- Bundle generation

## 3. WISSIL-RUN (Execution Sandbox)

Secure iframe sandbox for executing user code.

- Isolated execution environment
- Console log capture
- Error reporting
  `,

  "runtime/fs-api": `
# Filesystem API

## Reading Files

\`\`\`ts
const fs = useWissilFS.getState();
const content = fs.readFile('src/main.ts');
\`\`\`

## Writing Files

\`\`\`ts
fs.writeFile('src/main.ts', 'console.log("Hello!");');
\`\`\`

## Creating Folders

\`\`\`ts
fs.createFolder('src/components');
\`\`\`

## Listing Directory

\`\`\`ts
const files = fs.listDirectory('src');
// Returns: ['main.ts', 'App.tsx']
\`\`\`
  `,

  "editor/monaco-basics": `
# Monaco Editor Basics

The Monaco Editor provides a full-featured code editing experience.

## Features

- Syntax highlighting
- IntelliSense
- Code formatting
- Multiple file tabs
- Cursor position tracking

## Opening Files

Click any file in the FileTree to open it in the editor. The file will automatically:

1. Load content from the virtual filesystem
2. Add to the tab bar
3. Set as the active file

## Editing

All edits are automatically saved to the filesystem. After a 350ms delay, the project will automatically rebuild and reload.
  `,

  "ignis/unity-webgl": `
# Unity WebGL Integration

Ignis provides a preview panel for Unity WebGL builds.

## Features

- Unity WebGL player loading
- Device scaling (desktop/tablet/mobile)
- FPS monitoring
- Fullscreen support
- Unity log capture

## Setup

1. Export your Unity project as WebGL
2. Place the build in \`/public/UnityBuild/\`
3. Enable Unity in IgnisContainer:

\`\`\`tsx
<IgnisContainer unityEnabled={true} unityBuildUrl="/UnityBuild" />
\`\`\`

<Tip>
Unity WebGL preview is independent of the TypeScript runtime. Both can run simultaneously.
</Tip>
  `
};

export default docsDb;

