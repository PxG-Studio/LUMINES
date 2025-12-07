import * as monaco from 'monaco-editor';
import { lumenForgeColors } from '../../design-system/tokens';

export function configureMonaco() {
  monaco.editor.defineTheme('lumenforge', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: lumenForgeColors.text.tertiary.replace('#', '') },
      { token: 'keyword', foreground: lumenForgeColors.accent.primary.replace('#', '') },
      { token: 'string', foreground: lumenForgeColors.accent.secondary.replace('#', '') },
    ],
    colors: {
      'editor.background': lumenForgeColors.background.primary,
      'editor.foreground': lumenForgeColors.text.primary,
      'editor.selectionBackground': `${lumenForgeColors.accent.primary}40`,
      'editorCursor.foreground': lumenForgeColors.accent.primary,
    },
  });
}

export function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    cs: 'csharp', shader: 'shader', js: 'javascript', jsx: 'javascript',
    ts: 'typescript', tsx: 'typescript', json: 'json', yaml: 'yaml',
    yml: 'yaml', xml: 'xml', md: 'markdown', txt: 'plaintext',
  };
  return languageMap[ext || ''] || 'plaintext';
}

export const defaultMonacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  fontSize: 14,
  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
  minimap: { enabled: true },
  wordWrap: 'on',
  automaticLayout: true,
  tabSize: 2,
  insertSpaces: true,
  formatOnPaste: true,
  formatOnType: true,
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  scrollBeyondLastLine: false,
  renderWhitespace: 'selection',
  lineNumbers: 'on',
  folding: true,
  bracketPairColorization: { enabled: true },
};
