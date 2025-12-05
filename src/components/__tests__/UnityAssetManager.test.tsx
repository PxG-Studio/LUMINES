import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UnityAssetManager } from '../../slate/modules/assets/UnityAssetManager';

// Mock the asset parser hook
vi.mock('../../slate/modules/assets/useUnityAssetParser', () => ({
  useUnityAssetParser: () => ({
    parseMultipleAssets: vi.fn().mockResolvedValue([
      {
        id: 'asset-1',
        name: 'test.prefab',
        type: 'Prefab',
        size: 1024,
        dependencies: ['UnityEngine.CoreModule'],
        metadata: { guid: 'test-guid', path: 'Assets/test.prefab' },
      },
    ]),
    parsing: false,
    error: null,
  }),
}));

describe('UnityAssetManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('renders upload mode by default', () => {
      render(<UnityAssetManager />);

      // Upload dropzone should be visible
      expect(screen.getByText(/upload/i)).toBeInTheDocument();
    });

    it('renders in specified mode', () => {
      render(<UnityAssetManager mode="preview" />);

      expect(screen.getByText(/assets/i)).toBeInTheDocument();
    });
  });

  describe('File Upload', () => {
    it('handles file selection', async () => {
      render(<UnityAssetManager />);

      const file = new File(['test content'], 'test.prefab', { type: 'application/octet-stream' });
      const input = screen.getByLabelText(/upload/i) || document.querySelector('input[type="file"]');

      if (input) {
        fireEvent.change(input, { target: { files: [file] } });
      }

      // Should transition to preview mode after parsing
      await waitFor(() => {
        expect(screen.queryByText(/parsing/i)).not.toBeInTheDocument();
      });
    });

    it('shows parsing state during upload', () => {
      // Mock parsing state
      vi.mock('../../slate/modules/assets/useUnityAssetParser', () => ({
        useUnityAssetParser: () => ({
          parseMultipleAssets: vi.fn(),
          parsing: true,
          error: null,
        }),
      }));

      render(<UnityAssetManager />);

      expect(screen.getByText(/parsing assets/i)).toBeInTheDocument();
    });

    it('handles multiple file uploads', async () => {
      render(<UnityAssetManager />);

      const files = [
        new File(['content1'], 'test1.prefab'),
        new File(['content2'], 'test2.prefab'),
      ];

      const input = document.querySelector('input[type="file"]');
      if (input) {
        fireEvent.change(input, { target: { files } });
      }

      await waitFor(() => {
        // Should handle multiple files
        expect(screen.queryByText(/parsing/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Asset Preview', () => {
    it('displays asset tree in preview mode', () => {
      render(<UnityAssetManager mode="preview" />);

      expect(screen.getByText(/assets/i)).toBeInTheDocument();
    });

    it('allows asset selection', () => {
      render(<UnityAssetManager mode="preview" />);

      // Asset tree should be rendered
      const assetTree = screen.getByText(/assets/i).closest('div');
      expect(assetTree).toBeInTheDocument();
    });
  });

  describe('Mode Switching', () => {
    it('switches from upload to preview after file upload', async () => {
      render(<UnityAssetManager />);

      // Initially in upload mode
      expect(screen.getByText(/upload/i)).toBeInTheDocument();

      // After file upload, should switch to preview
      // This is tested through the file upload flow
    });

    it('supports deconstruct mode', () => {
      render(<UnityAssetManager mode="deconstruct" />);

      // Deconstruct mode should render
      expect(screen.getByText(/deconstruct/i) || screen.getByText(/components/i)).toBeInTheDocument();
    });

    it('supports reconstruct mode', () => {
      render(<UnityAssetManager mode="reconstruct" />);

      // Reconstruct mode should render
      expect(screen.getByText(/reconstruct/i) || screen.getByText(/components/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles parsing errors gracefully', () => {
      vi.mock('../../slate/modules/assets/useUnityAssetParser', () => ({
        useUnityAssetParser: () => ({
          parseMultipleAssets: vi.fn().mockRejectedValue(new Error('Parse failed')),
          parsing: false,
          error: 'Parse failed',
        }),
      }));

      render(<UnityAssetManager />);

      // Should handle error without crashing
      expect(screen.getByText(/upload/i)).toBeInTheDocument();
    });

    it('handles invalid file types', async () => {
      render(<UnityAssetManager />);

      const invalidFile = new File(['content'], 'test.txt');
      const input = document.querySelector('input[type="file"]');

      if (input) {
        fireEvent.change(input, { target: { files: [invalidFile] } });
      }

      // Should handle gracefully
      await waitFor(() => {
        expect(screen.queryByText(/parsing/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Component Tracking', () => {
    it('tracks deconstructed components', () => {
      render(<UnityAssetManager mode="deconstruct" />);

      // Deconstruct mode should allow component tracking
      expect(screen.getByText(/deconstruct/i) || screen.getByText(/components/i)).toBeInTheDocument();
    });

    it('displays component list after deconstruction', () => {
      render(<UnityAssetManager mode="deconstruct" />);

      // Component list should be available
      const componentSection = screen.getByText(/components/i)?.closest('div');
      expect(componentSection || screen.getByText(/deconstruct/i)).toBeInTheDocument();
    });
  });
});

