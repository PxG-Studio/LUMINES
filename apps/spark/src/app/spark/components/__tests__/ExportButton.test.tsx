/**
 * Unit Tests for ExportButton Component
 * Target: 12-15 tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ExportButton from '../ExportButton';

// Mock fetch
global.fetch = vi.fn();

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock document.createElement and appendChild/removeChild
const mockAnchor = {
  href: '',
  download: '',
  click: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'a') {
      return mockAnchor as any;
    }
    return document.createElement(tag);
  });
  vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor as any);
  vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor as any);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ExportButton Component', () => {
  it('should render export button', () => {
    render(<ExportButton code="test code" scriptName="Test" />);
    
    expect(screen.getByText(/Export as ZIP/i)).toBeInTheDocument();
  });

  it('should be disabled when no code', () => {
    render(<ExportButton code="" scriptName="Test" />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should be enabled when code is provided', () => {
    render(<ExportButton code="test code" scriptName="Test" />);
    
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should show loading state during export', async () => {
    vi.mocked(fetch).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(new Response(new Blob())), 100))
    );

    render(<ExportButton code="test code" scriptName="Test" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Exporting/i)).toBeInTheDocument();
    });
  });

  it('should call export API on click', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(new Blob(), { status: 200 }));

    render(<ExportButton code="test code" scriptName="Test" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'test code', scriptName: 'Test' }),
      });
    });
  });

  it('should download ZIP file on success', async () => {
    const blob = new Blob(['zip content'], { type: 'application/zip' });
    vi.mocked(fetch).mockResolvedValue(new Response(blob, { status: 200 }));

    render(<ExportButton code="test code" scriptName="Test" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(mockAnchor.download).toBe('Test.zip');
    });
  });

  it('should display error on API failure', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: 'Export failed' }), { status: 500 })
    );

    render(<ExportButton code="test code" scriptName="Test" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Export failed/i)).toBeInTheDocument();
    });
  });

  it('should handle network errors', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    render(<ExportButton code="test code" scriptName="Test" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Failed to export/i)).toBeInTheDocument();
    });
  });

  it('should handle invalid JSON error response', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response('Invalid JSON', { status: 500 })
    );

    render(<ExportButton code="test code" scriptName="Test" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Export failed/i)).toBeInTheDocument();
    });
  });

  it('should clean up object URL after download', async () => {
    const blob = new Blob(['zip content'], { type: 'application/zip' });
    vi.mocked(fetch).mockResolvedValue(new Response(blob, { status: 200 }));

    render(<ExportButton code="test code" scriptName="Test" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  it('should handle special characters in script name', async () => {
    const blob = new Blob(['zip content'], { type: 'application/zip' });
    vi.mocked(fetch).mockResolvedValue(new Response(blob, { status: 200 }));

    render(<ExportButton code="test code" scriptName="Test-Script_123" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAnchor.download).toBe('Test-Script_123.zip');
    });
  });
});

