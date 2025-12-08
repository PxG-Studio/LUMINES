# SLATE Component & Artifact Inventory (StackBlitz Parity)

Comprehensive inventory of SLATE UI/IDE components, modules, stories, tests, and docs to track coverage toward the 8-point StackBlitz parity standard.

## Core Shell & Layout
- `src/wissil/Slate/SlateLayout.tsx`
- `src/wissil/Slate/SlateComponents.stories.tsx`
- `src/slate/SlateLayout.tsx`
- `src/slate/SlateLayout.stories.tsx`
- `src/slate/components/SlateLayoutConnected.tsx`

## IDE Panels & UI Components
- `src/wissil/Slate/components/Sidebar.tsx`
- `src/wissil/Slate/components/EditorArea.tsx`
- `src/wissil/Slate/components/PreviewPanel.tsx`
- `src/wissil/Slate/components/InspectorPanel.tsx`
- `src/wissil/Slate/components/ConsolePanel.tsx`
- `src/wissil/Slate/components/BottomPanel.tsx`
- `src/wissil/Slate/components/StatusBar.tsx`
- `src/wissil/Slate/components/TabBar.tsx`
- `src/wissil/Slate/components/EditorToolbar.tsx`
- `src/wissil/Slate/components/FileTree.tsx`
- `src/wissil/Slate/components/FileTreeNode.tsx`
- `src/wissil/Slate/components/FileTreeState.ts`
- `src/slate/components/ExplorerPanel.tsx`
- `src/slate/components/EditorPanel.tsx`
- `src/slate/components/RuntimePanel.tsx`
- `src/slate/components/ExplorerPanelConnected.tsx`
- `src/slate/components/EditorPanelConnected.tsx`
- `src/slate/components/BottomPanel.tsx`

## Editor & FS Backbone
- `src/wissil/Slate/editor/MonacoEditor.tsx`
- `src/wissil/Slate/editor/useEditorTabs.ts`
- `src/wissil/Slate/editor/openFile.ts`
- `src/wissil/Slate/editor/hmrHooks.ts`
- `src/wissil/Slate/mock/mockFs.ts`
- `src/slate/context/ProjectContext.tsx`
- `src/slate/storybook.d.ts`

## Assets / Unity Integration
- `src/slate/modules/assets/UnityAssetManager.tsx`
- `src/slate/modules/assets/UnityAssetManagerConnected.tsx`
- `src/slate/modules/assets/AssetTreeView.tsx`
- `src/slate/modules/assets/AssetPreview.tsx`
- `src/slate/modules/assets/useUnityAssetParser.ts`
- `src/slate/modules/assets/AssetReconstructor.tsx`
- `src/slate/modules/assets/AssetDeconstructor.tsx`
- `src/slate/modules/assets/types.ts`

## Stories (Storybook)
- `src/wissil/Slate/FullSlate.stories.tsx`
- `src/wissil/Slate/components/InspectorTree.stories.tsx`
- `src/slate/SlateLayout.stories.tsx`
- `src/slate/modules/assets/UnityAssetManager.stories.tsx`
- `src/stories/WIS2L Framework/Slate/Components/InspectorPanel.stories.tsx`
- `src/stories/WIS2L Framework/Slate/Components/FileTree.stories.tsx`
- `src/stories/WIS2L Framework/Slate/Components/MonacoEditor.stories.tsx`
- `src/stories/WIS2L Framework/Slate/Components/SplitView.stories.tsx`
- `src/stories/WIS2L Framework/Slate/Components/FullIDEWorkflow.stories.tsx`
- `src/stories/WIS2L Framework/Slate/Pages/SlateExperience.stories.tsx`
- `src/stories/WIS2L Framework/Slate/Documentation/Slate.mdx`

## Tests (Unit / Integration / Runtime / Storybook)
- Unit – Core: `slate/__tests__/unit/workspace/workspace.comprehensive.test.ts`
- Unit – Filesystem: `slate/__tests__/unit/filesystem/filesystem.comprehensive.test.ts`
- Unit – Files DB: `slate/__tests__/unit/filesystem/files-database.comprehensive.test.ts`
- Unit – Code Editor: `slate/__tests__/unit/code-editor/code-editor.comprehensive.test.ts`
- Unit – Compiler: `slate/__tests__/unit/compiler/compiler.comprehensive.test.ts`
- Unit – Editor Host/Bridge: `slate/__tests__/unit/editor-host/editor-host.comprehensive.test.ts`
- Unit – Inspector: `slate/__tests__/unit/inspector/inspector.comprehensive.test.tsx`
- Unit – UI Framework: `slate/__tests__/unit/ui-framework/ui-framework.comprehensive.test.tsx`
- Unit – MCP Agent: `slate/__tests__/unit/mcp-agent/mcp-agent.comprehensive.test.ts`
- Unit – Async/Workers: `slate/__tests__/async-worker/worker.comprehensive.test.ts`
- Integration – FS→Compiler→Runtime: `slate/__tests__/integration/fs-compiler-runtime.test.ts`
- Integration – Editor↔Bridge↔Unity: `slate/__tests__/integration/editor-bridge-unity.test.ts`
- Integration – Full IDE chain: `slate/__tests__/integration/full-ide-chain.comprehensive.test.ts`
- Runtime Stability: `slate/__tests__/runtime/stability.comprehensive.test.ts`
- Error Injection & Resilience: `slate/__tests__/error-injection/resilience.comprehensive.test.ts`
- API Routes: `slate/__tests__/api/api-routes.comprehensive.test.ts`
- Database – Assets: `slate/__tests__/database/assets.comprehensive.test.ts`
- Database – Builds: `slate/__tests__/database/builds.comprehensive.test.ts`
- Security: `slate/__tests__/security/security.comprehensive.test.ts`
- Performance: `slate/__tests__/performance/performance.comprehensive.test.ts`
- Visual/Snapshot: `slate/__tests__/visual/snapshot.test.tsx`
- Storybook Coverage Dashboard: `slate/__tests__/storybook/coverage-dashboard.test.ts`
- Utilities: `slate/__tests__/utils/{fs-corruption.ts,webgl-simulator.ts,mcp-mock-server.ts,error-injection.ts}`

## Docs & Reports
- `slate/TESTING_PLAN_STACKBLITZ_PARITY.md`
- `slate/TESTING_PROGRESS.md`
- `slate/IMPLEMENTATION_STATUS.md`
- `slate/MVP_PRODUCTION_READINESS_ASSESSMENT.md`
- `slate/FINAL_PRODUCTION_READINESS_REPORT.md`
- `slate/ULTIMATE_COMPLETION_REPORT.md`
- `slate/COMPREHENSIVE_TEST_IMPLEMENTATION_SUMMARY.md`
- `slate/FINAL_TEST_COUNT_REPORT.md`
- `slate/COMPREHENSIVE_IMPLEMENTATION_COMPLETE.md`
- `slate/STORYBOOK_8_POINT_PARITY_PLAN.md`
- `slate/STORYBOOK_COMPREHENSIVE_COVERAGE_REPORT.md`

## Storybook Config & Test Runner
- `.storybook/preview.tsx`
- `.storybook/chromatic.config.ts`
- `.storybook/a11y.config.ts`
- `.storybook/test-runner.ts`
- `.storybook/msw-handlers.ts`

## Notes
- Inventory focuses on SLATE IDE surface, stories, and test coverage to satisfy the 8-point StackBlitz parity criteria.
- For visual regression and accessibility, Chromatic and axe configs live in `.storybook/*`.
- Integration mocks (MSW) are defined in `.storybook/msw-handlers.ts` and used by Full IDE workflow stories.

