declare module '@/lib/database/operations/files' {
  export const createFile: any;
  export const getFile: any;
  export const getFileByPath: any;
  export const listFiles: any;
  export const updateFile: any;
  export const deleteFile: any;
  export const searchFiles: any;
  export const buildFileTree: any;
}

declare module '@/lib/database/operations/builds' {
  export const createBuildJob: any;
  export const getBuildJob: any;
  export const listBuildJobs: any;
  export const updateBuildJob: any;
  export const getBuildStats: any;
  export const getActiveBuildJobs: any;
  export const getRecentBuildJobs: any;
  export const getBuildStatistics: any;
}

declare module '@/lib/database/client' {
  export const query: any;
  export const queryReplica: any;
  export const transaction: any;
}

declare module '@/lib/database/types' {
  export type SlateFile = any;
  export type SlateAsset = any;
  export type SlateAssetComponent = any;
  export type SlateAssetDependency = any;
}

declare module '@/lib/cache/*' {
  const anyValue: any;
  export = anyValue;
}

declare module '@/lib/database/*' {
  const anyValue: any;
  export = anyValue;
}

declare module '@/lib/cache/strategies' {
  export const getActiveRedisClient: any;
}

declare module '@/lib/cache/client' {
  export const getActiveRedisClient: any;
  export const getRedisUrl: any;
}

declare module '@/wissil/runtime/fs/wissilFs' {
  export const useWissilFS: any;
}

declare module '@/design-system/themes/ThemeProvider' {
  export const ThemeProvider: any;
  export const useTheme: any;
}

declare module '@/design-system/primitives/SplitView' {
  export const SplitView: any;
}

declare module '@/state/editorState' {
  export const useEditorState: any;
}

declare module '@/wissil/Slate/components/InspectorPanel' {
  export const InspectorPanel: any;
}

declare module "@codesandbox/sandpack-react" {
  export const SandpackProvider: any;
  export const SandpackLayout: any;
  export const useSandpack: any;
  export type SandpackFiles = any;
}

declare module '@/lib/cache/config/redis' {
  export const getRedisUrl: any;
}

declare module '@storybook/nextjs' {
  export const Meta: any;
  export const StoryObj: any;
}

declare module '@storybook/theming' {
  export const create: any;
}

declare module '@storybook/react' {
  export type Meta<T = any> = any;
  export type StoryObj<T = any> = any;
}

declare module 'src/wissil/runtime/fs/wissilFs' {
  const value: any;
  export default value;
}

declare module 'src/wissil/Slate/components/InspectorPanel' {
  const InspectorPanel: any;
  export default InspectorPanel;
}


