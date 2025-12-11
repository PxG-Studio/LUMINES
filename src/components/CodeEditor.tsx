import { useState, useEffect, useRef } from 'react';
import { Save, Undo, Redo, Search, FileCode } from 'lucide-react';

export interface CodeEditorProps {
  fileId: string;
  initialContent?: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
}

export function CodeEditor({
  fileId,
  initialContent = '',
  language = 'csharp',
  readOnly = false,
  onChange,
  onSave,
}: CodeEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [hasChanges, setHasChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(initialContent);
    setHasChanges(false);
  }, [fileId, initialContent]);

  const handleChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(true);
    onChange?.(newContent);
  };

  const handleSave = () => {
    onSave?.(content);
    setHasChanges(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + '  ' + content.substring(end);

      setContent(newContent);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <EditorToolbar
        hasChanges={hasChanges}
        onSave={handleSave}
        language={language}
      />
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex">
          <LineNumbers lineCount={content.split('\n').length} />
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            className="flex-1 bg-slate-950 text-slate-100 font-mono text-sm p-4 resize-none focus:outline-none"
            style={{ tabSize: 2 }}
            spellCheck={false}
          />
        </div>
      </div>
      <EditorStatusBar
        line={1}
        column={1}
        language={language}
        encoding="UTF-8"
      />
    </div>
  );
}

interface EditorToolbarProps {
  hasChanges: boolean;
  onSave: () => void;
  language: string;
}

function EditorToolbar({ hasChanges, onSave, language }: EditorToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={!hasChanges}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
            hasChanges
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Save size={14} />
          Save {hasChanges && '*'}
        </button>
        <div className="w-px h-6 bg-slate-700" />
        <ToolbarButton icon={Undo} label="Undo" />
        <ToolbarButton icon={Redo} label="Redo" />
        <div className="w-px h-6 bg-slate-700" />
        <ToolbarButton icon={Search} label="Find" />
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <FileCode size={14} />
        <span>{language.toUpperCase()}</span>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}

function ToolbarButton({ icon: Icon, label }: ToolbarButtonProps) {
  return (
    <button
      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
      title={label}
    >
      <Icon size={16} />
    </button>
  );
}

function LineNumbers({ lineCount }: { lineCount: number }) {
  return (
    <div className="bg-slate-900 text-slate-500 font-mono text-sm py-4 px-3 select-none border-r border-slate-800">
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i} className="text-right">
          {i + 1}
        </div>
      ))}
    </div>
  );
}

interface EditorStatusBarProps {
  line: number;
  column: number;
  language: string;
  encoding: string;
}

function EditorStatusBar({ line, column, language, encoding }: EditorStatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-t border-slate-800 text-xs text-slate-400">
      <div className="flex items-center gap-4">
        <span>Ln {line}, Col {column}</span>
        <span>{language}</span>
        <span>{encoding}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Spaces: 2</span>
        <span>LF</span>
      </div>
    </div>
  );
}
