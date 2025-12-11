/**
 * Error Scenario Tests for Components
 * Target: 15-20 tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import MCPChat from '../MCPChat';
import ExportButton from '../ExportButton';
import PreviewPanel from '../PreviewPanel';

// Mock dependencies
vi.mock('../actions/generate', () => ({
  generateUnityScript: vi.fn(),
}));

vi.mock('@/lib/spark/hooks/useProgress', () => ({
  useProgress: vi.fn(() => ({
    currentTask: null,
    tasks: [],
    fileChanges: [],
    tokenUsage: { used: 0, remaining: 1000 },
    metadata: null,
    addTask: vi.fn(),
    completeTask: vi.fn(),
    failTask: vi.fn(),
    addFileChange: vi.fn(),
    updateTokenUsage: vi.fn(),
    reset: vi.fn(),
  })),
}));

vi.mock('@monaco-editor/react', () => ({
  default: () => <div data-testid="monaco-editor">Editor</div>,
}));

global.fetch = vi.fn();

describe('Component Error Scenarios', () => {
  describe('MCPChat error handling', () => {
    it('should handle API failure gracefully', async () => {
      const { generateUnityScript } = await import('../actions/generate');
      vi.mocked(generateUnityScript).mockResolvedValue({
        success: false,
        error: 'API error',
      });

      const mockOnCodeGenerated = vi.fn();
      render(<MCPChat onCodeGenerated={mockOnCodeGenerated} />);

      // Error should be displayed
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });

    it('should handle network timeout', async () => {
      const { generateUnityScript } = await import('../actions/generate');
      vi.mocked(generateUnityScript).mockImplementation(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      );

      const mockOnCodeGenerated = vi.fn();
      render(<MCPChat onCodeGenerated={mockOnCodeGenerated} />);

      // Should handle timeout
      await waitFor(() => {
        expect(screen.getByText(/error|timeout/i)).toBeInTheDocument();
      }, { timeout: 200 });
    });

    it('should handle validation errors', async () => {
      const { generateUnityScript } = await import('../actions/generate');
      vi.mocked(generateUnityScript).mockResolvedValue({
        success: false,
        error: 'Validation failed: Missing using statements',
      });

      const mockOnCodeGenerated = vi.fn();
      render(<MCPChat onCodeGenerated={mockOnCodeGenerated} />);

      await waitFor(() => {
        expect(screen.getByText(/validation|error/i)).toBeInTheDocument();
      });
    });
  });

  describe('ExportButton error handling', () => {
    it('should handle export API failure', async () => {
      vi.mocked(fetch).mockResolvedValue(
        new Response(JSON.stringify({ error: 'Export failed' }), { status: 500 })
      );

      render(<ExportButton code="test code" scriptName="Test" />);
      const button = screen.getByRole('button');
      button.click();

      await waitFor(() => {
        expect(screen.getByText(/export failed/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors during export', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

      render(<ExportButton code="test code" scriptName="Test" />);
      const button = screen.getByRole('button');
      button.click();

      await waitFor(() => {
        expect(screen.getByText(/failed to export/i)).toBeInTheDocument();
      });
    });

    it('should handle invalid response format', async () => {
      vi.mocked(fetch).mockResolvedValue(
        new Response('Invalid response', { status: 200 })
      );

      render(<ExportButton code="test code" scriptName="Test" />);
      const button = screen.getByRole('button');
      button.click();

      // Should handle gracefully
      await waitFor(() => {
        expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
      });
    });

    it('should handle missing code during export', () => {
      render(<ExportButton code="" scriptName="Test" />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('PreviewPanel error handling', () => {
    it('should handle empty code gracefully', () => {
      render(<PreviewPanel code="" scriptName="" />);
      expect(screen.getByText(/No code generated yet/i)).toBeInTheDocument();
    });

    it('should handle invalid code format', () => {
      const invalidCode = 'not valid c# code';
      render(<PreviewPanel code={invalidCode} scriptName="Test" />);
      // Should still render
      expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    });

    it('should handle very long code', () => {
      const longCode = Array(10000).fill('line of code').join('\n');
      render(<PreviewPanel code={longCode} scriptName="Test" />);
      // Should not crash
      expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    });
  });
});

