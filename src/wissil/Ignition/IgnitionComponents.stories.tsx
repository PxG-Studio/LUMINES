import type { Meta, StoryObj } from "@storybook/react";
import { IgnitionRuntimeBar } from "./IgnitionRuntimeBar";
import { IgnitionErrorOverlay } from "./IgnitionErrorOverlay";
import { IgnitionMessageStream } from "./IgnitionMessageStream";
import { IgnitionStatusIndicator } from "./IgnitionStatusIndicator";
import { IgnitionProvider } from "./IgnitionProvider";
import { useEditorState } from "@/state/editorState";
import { ThemeProvider } from "@/design-system/themes/ThemeProvider";

const meta: Meta = {
  title: "Lumenforge.io Design System/WIS2L Framework/Ignition/Shared Framework Components/IgnitionComponents",
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ['autodocs'],
};

export default meta;

export const RuntimeBar: StoryObj = {
  render: () => (
    <div style={{ padding: "20px", background: "var(--nv-bg-1)" }}>
      <IgnitionRuntimeBar />
    </div>
  ),
};

export const StatusIndicator: StoryObj = {
  render: () => (
    <div style={{ padding: "20px", background: "var(--nv-bg-1)", display: "flex", gap: "20px" }}>
      <IgnitionStatusIndicator />
    </div>
  ),
};

export const MessageStream: StoryObj = {
  render: () => {
    const pushMessage = useEditorState((s) => s.pushMessage);
    
    return (
      <div style={{ width: "100vw", height: "400px", background: "var(--nv-bg-0)" }}>
        <div style={{ padding: "20px" }}>
          <button
            onClick={() => pushMessage(`[${new Date().toLocaleTimeString()}] Test message`)}
            style={{ marginBottom: "10px", padding: "8px 16px" }}
          >
            Add Message
          </button>
        </div>
        <IgnitionMessageStream />
      </div>
    );
  },
};

export const ErrorOverlay: StoryObj = {
  render: () => {
    const setErr = useEditorState((s) => s.setRuntimeError);
    
    return (
      <IgnitionProvider>
        <div style={{ width: "100vw", height: "100vh", background: "var(--nv-bg-0)", padding: "20px" }}>
          <button
            onClick={() => setErr("Sample runtime error:\n\nError: Cannot read property 'foo' of undefined\n    at App.tsx:42:15\n    at render (ReactDOM.js:1234:56)")}
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Trigger Error
          </button>
          <IgnitionErrorOverlay />
        </div>
      </IgnitionProvider>
    );
  },
};

export const FullRuntimeUI: StoryObj = {
  render: () => {
    const pushMessage = useEditorState((s) => s.pushMessage);
    const setErr = useEditorState((s) => s.setRuntimeError);
    
    return (
      <IgnitionProvider>
        <div style={{ width: "100vw", height: "100vh", background: "var(--nv-bg-0)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px", borderBottom: "1px solid var(--nv-border)" }}>
            <IgnitionRuntimeBar />
          </div>
          <div style={{ flex: 1, padding: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
              <button
                onClick={() => pushMessage(`[${new Date().toLocaleTimeString()}] Test log message`)}
                style={{ marginRight: "10px", padding: "8px 16px" }}
              >
                Add Log
              </button>
              <button
                onClick={() => setErr("Sample runtime error")}
                style={{ padding: "8px 16px" }}
              >
                Trigger Error
              </button>
            </div>
            <IgnitionMessageStream />
          </div>
        </div>
      </IgnitionProvider>
    );
  },
};

