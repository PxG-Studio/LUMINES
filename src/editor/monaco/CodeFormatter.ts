/**
 * Code Formatter
 * 
 * Code formatting using Monaco Editor's built-in formatter
 * For Prettier integration, we'll use Monaco's formatDocument action
 */

import type { editor } from 'monaco-editor';

export interface FormatOptions {
  parser?: string;
  tabWidth?: number;
  useTabs?: boolean;
  semi?: boolean;
  singleQuote?: boolean;
  trailingComma?: 'none' | 'es5' | 'all';
  bracketSpacing?: boolean;
  arrowParens?: 'always' | 'avoid';
  printWidth?: number;
}

/**
 * Detect parser from file extension or language
 */
function detectParser(filePath?: string, language?: string): string {
  if (language) {
    const langMap: Record<string, string> = {
      typescript: 'typescript',
      javascript: 'babel',
      tsx: 'typescript',
      jsx: 'babel',
      json: 'json',
      html: 'html',
      css: 'css',
      scss: 'scss',
      markdown: 'markdown',
      mdx: 'markdown',
    };
    return langMap[language] || 'babel';
  }

  if (filePath) {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const extMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'babel',
      jsx: 'babel',
      json: 'json',
      html: 'html',
      css: 'css',
      scss: 'scss',
      md: 'markdown',
      mdx: 'markdown',
    };
    return extMap[ext || ''] || 'babel';
  }

  return 'babel';
}

/**
 * Format code using Monaco Editor's formatter
 */
export async function formatCode(
  editorInstance: editor.IStandaloneCodeEditor
): Promise<void> {
  try {
    await editorInstance.getAction('editor.action.formatDocument')?.run();
  } catch (error) {
    console.error('Formatting error:', error);
    throw error;
  }
}

/**
 * Format selection in editor
 */
export async function formatSelection(
  editorInstance: editor.IStandaloneCodeEditor
): Promise<void> {
  try {
    await editorInstance.getAction('editor.action.formatSelection')?.run();
  } catch (error) {
    console.error('Format selection error:', error);
    throw error;
  }
}

