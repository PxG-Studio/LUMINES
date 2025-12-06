/**
 * SlateLayout Component
 * Main container that assembles the editor shell
 */

'use client';

import React from "react";
import { Sidebar } from "./components/Sidebar";
import { TabBar } from "./components/TabBar";
import { EditorToolbar } from "./components/EditorToolbar";
import { FileTree } from "./components/FileTree";
import { InspectorPanel } from "./components/InspectorPanel";
import { MonacoEditor } from "./editor/MonacoEditor";
import { PreviewPanel } from "./components/PreviewPanel";
import { BottomPanel } from "./components/BottomPanel";
import { StatusBar } from "./components/StatusBar";
import { IgnitionProvider } from "@/wissil/Ignition/IgnitionProvider";
import { SplitView } from "@/design-system/primitives/SplitView";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface SlateLayoutProps {
  onFileSelect?: (path: string) => void;
  onTabSelect?: (tab: string) => void;
  onTabClose?: (tab: string) => void;
  onRun?: () => void;
  onRestart?: () => void;
  onStop?: () => void;
}

export function SlateLayout({
  onFileSelect,
  onTabSelect,
  onTabClose,
  onRun,
  onRestart,
  onStop
}: SlateLayoutProps) {
  const theme = useTheme();

  return (
    <IgnitionProvider>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: theme.colors.bg0,
          display: "flex",
          overflow: "hidden"
        }}
      >
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN EDITOR REGION */}
      <div role="main" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <EditorToolbar
          onRun={onRun}
          onRestart={onRestart}
          onStop={onStop}
        />
        <TabBar />

        <div style={{ flex: 1 }}>
          <SplitView direction="vertical" initial={340} min={200} max={600}>
            {/* left (inspector + file tree) */}
            <SplitView direction="horizontal" initial={220} min={150} max={400}>
              <InspectorPanel />
              <div
                role="region"
                aria-label="File explorer"
                tabIndex={0}
                style={{
                  overflowY: "auto",
                  height: "100%",
                  background: theme.colors.bg1
                }}
              >
                <FileTree onFileSelect={onFileSelect} />
              </div>
            </SplitView>

            {/* right (editor area + preview) */}
            <SplitView direction="vertical" initial={350} min={250} max={800}>
              {/* editor */}
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <MonacoEditor />
                <StatusBar />
              </div>

              {/* preview/logs */}
              <SplitView direction="horizontal" initial={200} min={150} max={400}>
                <PreviewPanel />
                <BottomPanel height={undefined} />
              </SplitView>
            </SplitView>
          </SplitView>
        </div>
      </div>
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="sr-announcements"
      />
    </div>
    </IgnitionProvider>
  );
}

