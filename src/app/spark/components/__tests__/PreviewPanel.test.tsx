/**
 * Unit Tests for PreviewPanel Component
 * Target: 10-15 tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PreviewPanel from '../PreviewPanel';

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, height }: any) => (
    <div data-testid="monaco-editor" data-value={value} data-height={height}>
      {value}
    </div>
  ),
}));

// Mock ExportButton
vi.mock('../ExportButton', () => ({
  default: ({ code, scriptName }: any) => (
    <button data-testid="export-button" data-code={code} data-script-name={scriptName}>
      Export
    </button>
  ),
}));

describe('PreviewPanel Component', () => {
  it('should render empty state when no code', () => {
    render(<PreviewPanel code="" scriptName="" />);
    
    expect(screen.getByText(/No code generated yet/i)).toBeInTheDocument();
  });

  it('should render code when provided', () => {
    const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
    render(<PreviewPanel code={code} scriptName="Test" />);
    
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveAttribute('data-value', code);
  });

  it('should pass script name to ExportButton', () => {
    render(<PreviewPanel code="test code" scriptName="TestScript" />);
    
    const exportButton = screen.getByTestId('export-button');
    expect(exportButton).toHaveAttribute('data-script-name', 'TestScript');
  });

  it('should pass code to ExportButton', () => {
    const code = 'using UnityEngine;';
    render(<PreviewPanel code={code} scriptName="Test" />);
    
    const exportButton = screen.getByTestId('export-button');
    expect(exportButton).toHaveAttribute('data-code', code);
  });

  it('should render Monaco Editor with correct props', () => {
    const code = 'public class Test { }';
    render(<PreviewPanel code={code} scriptName="Test" />);
    
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toHaveAttribute('data-height', '100%');
  });

  it('should handle long code', () => {
    const longCode = Array(100).fill('using UnityEngine;').join('\n');
    render(<PreviewPanel code={longCode} scriptName="Test" />);
    
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toBeInTheDocument();
  });

  it('should handle special characters in code', () => {
    const code = 'public class Test { void Method() { Debug.Log("Hello"); } }';
    render(<PreviewPanel code={code} scriptName="Test" />);
    
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toBeInTheDocument();
  });

  it('should handle empty script name', () => {
    render(<PreviewPanel code="test code" scriptName="" />);
    
    const exportButton = screen.getByTestId('export-button');
    expect(exportButton).toHaveAttribute('data-script-name', '');
  });
});

