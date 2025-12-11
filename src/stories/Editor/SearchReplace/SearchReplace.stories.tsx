/**
 * Search & Replace Stories
 */

import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { SearchReplace } from '@/editor/monaco/SearchReplace';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Editor/MonacoEditor/SearchReplace',
  component: SearchReplace,
  parameters: {
    layout: 'fullscreen',
    chromatic: { diffThreshold: 0.01 },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchReplace>;

export default meta;
type Story = StoryObj<typeof meta>;

const EditorWithSearch = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  return (
    <div style={{ height: '100vh', position: 'relative', background: '#0A0A0A' }}>
      <Editor
        height="100%"
        language="typescript"
        theme="vs-dark"
        value={`function helloWorld() {
  const message = "Hello, World!";
  console.log(message);
  return message;
}

function goodbyeWorld() {
  const message = "Goodbye, World!";
  console.log(message);
  return message;
}

// Multiple occurrences of "message"
const msg1 = "First message";
const msg2 = "Second message";
const msg3 = "Third message";
`}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />
      <SearchReplace
        editor={editorRef.current}
        visible={true}
        onClose={() => {}}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <EditorWithSearch />,
};

const WithReplaceComponent: React.FC = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [replaceMode, setReplaceMode] = React.useState(true);

  return (
    <div style={{ height: '100vh', position: 'relative', background: '#0A0A0A' }}>
      <Editor
        height="100%"
        language="typescript"
        theme="vs-dark"
        value={`function example() {
  const oldName = "test";
  const anotherOldName = "test2";
  return oldName + anotherOldName;
}`}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />
      <SearchReplace
        editor={editorRef.current}
        visible={true}
        onClose={() => {}}
      />
    </div>
  );
};

export const WithReplace: Story = {
  render: () => <WithReplaceComponent />,
};

