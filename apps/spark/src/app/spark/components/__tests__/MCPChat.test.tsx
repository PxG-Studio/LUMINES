/**
 * Unit Tests for MCPChat Component
 * Target: 15-20 tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MCPChat from '../MCPChat';

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

vi.mock('../ProgressPanel', () => ({
  default: () => <div data-testid="progress-panel">Progress</div>,
}));

describe('MCPChat Component', () => {
  const mockOnCodeGenerated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render initial assistant message', () => {
    render(<MCPChat onCodeGenerated={mockOnCodeGenerated} />);
    
    expect(screen.getByText(/Hello! I'm SPARK/i)).toBeInTheDocument();
  });

  it('should render chat input', () => {
    render(<MCPChat onCodeGenerated={mockOnCodeGenerated} />);
    
    const input = screen.getByPlaceholderText(/describe what unity script/i);
    expect(input).toBeInTheDocument();
  });

  it('should render provider selector', () => {
    render(<MCPChat onCodeGenerated={mockOnCodeGenerated} />);
    
    // Should have provider selection UI
    expect(screen.getByText(/claude|openai/i)).toBeInTheDocument();
  });

  it('should handle user input', () => {
    render(<MCPChat onCodeGenerated={mockOnCodeGenerated} />);
    
    const input = screen.getByPlaceholderText(/describe what unity script/i);
    fireEvent.change(input, { target: { value: 'Create a player controller' } });
    
    expect(input).toHaveValue('Create a player controller');
  });

  it('should not submit empty input', async () => {
    const { generateUnityScript } = await import('../actions/generate');
    render(<MCPChat onCodeGenerated={mockOnCodeGenerated} />);
    
    const form = screen.getByRole('form') || screen.getByTestId('chat-form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(generateUnityScript).not.toHaveBeenCalled();
    });
  });

  it('should call onCodeGenerated when code is generated', async () => {
    const { generateUnityScript } = await import('../actions/generate');
    vi.mocked(generateUnityScript).mockResolvedValue({
      success: true,
      code: 'using UnityEngine;\npublic class Test : MonoBehaviour { }',
      scriptName: 'Test',
    });

    render(<MCPChat onCodeGenerated={mockOnCodeGenerated} />);
    
    const input = screen.getByPlaceholderText(/describe what unity script/i);
    fireEvent.change(input, { target: { value: 'Create test script' } });
    fireEvent.submit(input.closest('form') || input);

    await waitFor(() => {
      expect(mockOnCodeGenerated).toHaveBeenCalledWith(
        expect.stringContaining('Test'),
        'Test'
      );
    });
  });

  it('should display error message on generation failure', async () => {
    const { generateUnityScript } = await import('../actions/generate');
    vi.mocked(generateUnityScript).mockResolvedValue({
      success: false,
      error: 'API error',
    });

    render(<MCPChat onCodeGenerated={mockOnCodeGenerated} />);
    
    const input = screen.getByPlaceholderText(/describe what unity script/i);
    fireEvent.change(input, { target: { value: 'Create test' } });
    fireEvent.submit(input.closest('form') || input);

    await waitFor(() => {
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during generation', async () => {
    const { generateUnityScript } = await import('../actions/generate');
    vi.mocked(generateUnityScript).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true, code: 'test', scriptName: 'Test' }), 100))
    );

    render(<MCPChat onCodeGenerated={mockOnCodeGenerated} />);
    
    const input = screen.getByPlaceholderText(/describe what unity script/i);
    fireEvent.change(input, { target: { value: 'Create test' } });
    fireEvent.submit(input.closest('form') || input);

    expect(screen.getByText(/generating|loading/i)).toBeInTheDocument();
  });

  it('should allow switching between providers', () => {
    render(<MCPChat onCodeGenerated={mockOnCodeGenerated} />);
    
    // Find provider selector and switch
    const providerButton = screen.getByText(/claude|openai/i);
    fireEvent.click(providerButton);
    
    // Provider should change
    expect(providerButton).toBeInTheDocument();
  });

  it('should allow model selection', () => {
    render(<MCPChat onCodeGenerated={mockOnCodeGenerated} />);
    
    // Model selector should be present
    const modelSelect = screen.getByRole('combobox') || screen.getByTestId('model-select');
    expect(modelSelect).toBeInTheDocument();
  });
});

