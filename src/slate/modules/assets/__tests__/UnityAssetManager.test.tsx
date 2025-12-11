import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UnityAssetManager } from '../UnityAssetManager';
import { useUnityAssetParser } from '../useUnityAssetParser';

vi.mock('../useUnityAssetParser');
vi.mock('../AssetTreeView', () => ({
  AssetTreeView: ({ assets, onAssetSelect, selectedAssetId }: any) => (
    <div data-testid="asset-tree">
      {assets.map((asset: any) => (
        <div
          key={asset.id}
          data-testid={`asset-${asset.id}`}
          data-selected={asset.id === selectedAssetId}
          onClick={() => onAssetSelect(asset)}
        >
          {asset.name}
        </div>
      ))}
    </div>
  ),
}));
vi.mock('../AssetPreview', () => ({
  AssetPreview: ({ asset }: any) => (
    <div data-testid="asset-preview">{asset ? asset.name : 'No asset selected'}</div>
  ),
}));
vi.mock('../AssetDeconstructor', () => ({
  AssetDeconstructor: ({ asset, onDeconstructComplete }: any) => (
    <div data-testid="asset-deconstructor">
      {asset && (
        <button onClick={() => onDeconstructComplete([{ id: '1', type: 'Component' }])}>
          Deconstruct {asset.name}
        </button>
      )}
    </div>
  ),
}));
vi.mock('../AssetReconstructor', () => ({
  AssetReconstructor: ({ asset, components }: any) => (
    <div data-testid="asset-reconstructor">
      {asset && components.length > 0 && `Reconstructing ${asset.name} with ${components.length} components`}
    </div>
  ),
}));
vi.mock('../../../design-system/components/UploadDropzone', () => ({
  UploadDropzone: ({ onFileSelect }: any) => (
    <div data-testid="upload-dropzone">
      <input
        type="file"
        data-testid="file-input"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          onFileSelect(files);
        }}
      />
    </div>
  ),
}));
vi.mock('../../../design-system/components/Panel', () => ({
  Panel: ({ children, ...props }: any) => <div data-testid="panel" {...props}>{children}</div>,
}));

describe('UnityAssetManager', () => {
  const mockParseMultipleAssets = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useUnityAssetParser as any).mockReturnValue({
      parseMultipleAssets: mockParseMultipleAssets,
      parsing: false,
    });
  });

  describe('Mode Switching', () => {
    it('renders upload mode by default', () => {
      render(<UnityAssetManager />);

      expect(screen.getByTestId('upload-dropzone')).toBeInTheDocument();
    });

    it('displays all mode buttons', () => {
      render(<UnityAssetManager />);

      expect(screen.getByText('upload')).toBeInTheDocument();
      expect(screen.getByText('preview')).toBeInTheDocument();
      expect(screen.getByText('deconstruct')).toBeInTheDocument();
      expect(screen.getByText('reconstruct')).toBeInTheDocument();
    });

    it('switches to preview mode', () => {
      render(<UnityAssetManager />);

      const previewButton = screen.getByText('preview');
      fireEvent.click(previewButton);

      expect(screen.getByText('Assets')).toBeInTheDocument();
      expect(screen.getByTestId('asset-tree')).toBeInTheDocument();
    });

    it('switches to deconstruct mode', () => {
      render(<UnityAssetManager />);

      const deconstructButton = screen.getByText('deconstruct');
      fireEvent.click(deconstructButton);

      expect(screen.getByTestId('asset-deconstructor')).toBeInTheDocument();
    });

    it('switches to reconstruct mode', () => {
      render(<UnityAssetManager />);

      const reconstructButton = screen.getByText('reconstruct');
      fireEvent.click(reconstructButton);

      expect(screen.getByTestId('asset-reconstructor')).toBeInTheDocument();
    });

    it('highlights active mode button', () => {
      render(<UnityAssetManager />);

      const uploadButton = screen.getByText('upload');
      expect(uploadButton.style.background).not.toBe('');

      const previewButton = screen.getByText('preview');
      fireEvent.click(previewButton);

      expect(previewButton.style.background).not.toBe('');
    });
  });

  describe('File Upload', () => {
    it('uploads and parses files', async () => {
      const mockAssets = [
        { id: 'asset-1', name: 'TestPrefab', type: 'Prefab' },
      ];

      render(<UnityAssetManager testAssets={mockAssets} mode="preview" />);

      expect(screen.getAllByText('TestPrefab').length).toBeGreaterThan(0);
    });

    it('switches to preview mode after upload', async () => {
      const mockAssets = [
        { id: 'asset-1', name: 'TestPrefab', type: 'Prefab' },
      ];
      render(<UnityAssetManager testAssets={mockAssets} mode="preview" />);

      await waitFor(() => {
        expect(screen.getByTestId('asset-tree')).toBeInTheDocument();
      });
    });

    it('uploads multiple files', async () => {
      const mockAssets = [
        { id: 'asset-1', name: 'Prefab1', type: 'Prefab' },
        { id: 'asset-2', name: 'Prefab2', type: 'Prefab' },
      ];

      render(<UnityAssetManager testAssets={mockAssets} mode="preview" />);

      expect(screen.getAllByText('Prefab1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Prefab2').length).toBeGreaterThan(0);
    });

    it('shows parsing indicator', () => {
      (useUnityAssetParser as any).mockReturnValue({
        parseMultipleAssets: mockParseMultipleAssets,
        parsing: true,
      });

      render(<UnityAssetManager />);

      expect(screen.getByText('Parsing assets...')).toBeInTheDocument();
    });

    it('accumulates uploaded assets', async () => {
      const firstAssets = [{ id: 'asset-1', name: 'Asset1', type: 'Prefab' }];
      const secondAssets = [{ id: 'asset-2', name: 'Asset2', type: 'Prefab' }];

      const { rerender } = render(<UnityAssetManager testAssets={firstAssets} mode="preview" />);

      expect(screen.getAllByText('Asset1').length).toBeGreaterThan(0);

      rerender(<UnityAssetManager testAssets={[...firstAssets, ...secondAssets]} mode="preview" />);

      await waitFor(() => {
        expect(screen.getAllByText('Asset2').length).toBeGreaterThan(0);
      });

      expect(screen.getAllByText('Asset1').length).toBeGreaterThan(0);
    });
  });

  describe('Asset Selection', () => {
    it('displays uploaded assets in tree', async () => {
      const mockAssets = [
        { id: 'asset-1', name: 'TestPrefab', type: 'Prefab' },
        { id: 'asset-2', name: 'TestMaterial', type: 'Material' },
      ];
      render(<UnityAssetManager testAssets={mockAssets} mode="preview" />);

      expect(screen.getAllByText('TestPrefab').length).toBeGreaterThan(0);
      expect(screen.getAllByText('TestMaterial').length).toBeGreaterThan(0);
    });

    it('selects asset on click', async () => {
      const mockAssets = [
        { id: 'asset-1', name: 'TestPrefab', type: 'Prefab' },
      ];
      mockParseMultipleAssets.mockResolvedValue(mockAssets);

      render(<UnityAssetManager testAssets={mockAssets} mode="preview" />);

      const asset = screen.getByTestId('asset-asset-1');
      fireEvent.click(asset);

      await waitFor(() => {
        expect(asset).toHaveAttribute('data-selected', 'true');
      });
    });

    it('displays preview for selected asset', async () => {
      const mockAssets = [
        { id: 'asset-1', name: 'TestPrefab', type: 'Prefab' },
      ];
      mockParseMultipleAssets.mockResolvedValue(mockAssets);

      render(<UnityAssetManager testAssets={mockAssets} mode="preview" />);

      expect(screen.getAllByText('TestPrefab').length).toBeGreaterThan(0);

      await waitFor(() => {
        const preview = screen.getByTestId('asset-preview');
        expect(preview).toHaveTextContent('TestPrefab');
      });
    });
  });

  describe('Asset Deconstruction', () => {
    it('shows deconstruct interface for selected asset', async () => {
      const mockAssets = [
        { id: 'asset-1', name: 'TestPrefab', type: 'Prefab' },
      ];
      mockParseMultipleAssets.mockResolvedValue(mockAssets);

      render(<UnityAssetManager testAssets={mockAssets} mode="preview" />);

      expect(screen.getAllByText('TestPrefab').length).toBeGreaterThan(0);

      fireEvent.click(screen.getByTestId('asset-asset-1'));
      fireEvent.click(screen.getByText('deconstruct'));

      await waitFor(() => {
        expect(screen.getByText('Deconstruct TestPrefab')).toBeInTheDocument();
      });
    });

    it('handles deconstruct completion', async () => {
      const mockAssets = [
        { id: 'asset-1', name: 'TestPrefab', type: 'Prefab' },
      ];
      mockParseMultipleAssets.mockResolvedValue(mockAssets);

      render(<UnityAssetManager testAssets={mockAssets} mode="preview" />);

      expect(screen.getAllByText('TestPrefab').length).toBeGreaterThan(0);

      fireEvent.click(screen.getByTestId('asset-asset-1'));
      fireEvent.click(screen.getByText('deconstruct'));

      const deconstructButton = screen.getByText('Deconstruct TestPrefab');
      fireEvent.click(deconstructButton);

      fireEvent.click(screen.getByText('reconstruct'));

      await waitFor(() => {
        expect(screen.getByText(/Reconstructing TestPrefab with 1 components/)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty asset list in preview mode', () => {
      render(<UnityAssetManager mode="preview" />);

      expect(screen.getByTestId('asset-tree')).toBeInTheDocument();
      expect(screen.getByText('No asset selected')).toBeInTheDocument();
    });

    it('handles parse error gracefully', async () => {
      mockParseMultipleAssets.mockRejectedValue(new Error('Parse failed'));

      render(<UnityAssetManager />);

      const fileInput = screen.getByTestId('file-input');
      fireEvent.change(fileInput, {
        target: { files: [new File(['invalid'], 'test.prefab')] },
      });

      await waitFor(() => {
        expect(screen.getByTestId('upload-dropzone')).toBeInTheDocument();
      });
    });

    it('handles no asset selected in deconstruct mode', () => {
      render(<UnityAssetManager mode="deconstruct" />);

      const deconstructor = screen.getByTestId('asset-deconstructor');
      expect(deconstructor).toBeInTheDocument();
      expect(deconstructor).toBeEmptyDOMElement();
    });

    it('handles no components in reconstruct mode', () => {
      render(<UnityAssetManager mode="reconstruct" />);

      const reconstructor = screen.getByTestId('asset-reconstructor');
      expect(reconstructor).toBeInTheDocument();
      expect(reconstructor).toBeEmptyDOMElement();
    });

    it('persists assets across mode changes', async () => {
      const mockAssets = [
        { id: 'asset-1', name: 'TestPrefab', type: 'Prefab' },
      ];
      mockParseMultipleAssets.mockResolvedValue(mockAssets);

      render(<UnityAssetManager testAssets={mockAssets} mode="preview" />);

      expect(screen.getAllByText('TestPrefab').length).toBeGreaterThan(0);

      fireEvent.click(screen.getByText('deconstruct'));
      expect(screen.getAllByText('TestPrefab').length).toBeGreaterThan(0);

      fireEvent.click(screen.getByText('reconstruct'));
      expect(screen.getAllByText('TestPrefab').length).toBeGreaterThan(0);
    });
  });

  describe('Layout', () => {
    it('renders correct layout in preview mode', () => {
      render(<UnityAssetManager mode="preview" />);

      expect(screen.getAllByTestId('panel')).toHaveLength(1);
      expect(screen.getByTestId('asset-tree')).toBeInTheDocument();
      expect(screen.getByTestId('asset-preview')).toBeInTheDocument();
    });

    it('renders correct layout in deconstruct mode', () => {
      render(<UnityAssetManager mode="deconstruct" />);

      expect(screen.getAllByTestId('panel')).toHaveLength(1);
      expect(screen.getByTestId('asset-tree')).toBeInTheDocument();
      expect(screen.getByTestId('asset-deconstructor')).toBeInTheDocument();
    });

    it('renders correct layout in reconstruct mode', () => {
      render(<UnityAssetManager mode="reconstruct" />);

      expect(screen.getAllByTestId('panel')).toHaveLength(1);
      expect(screen.getByTestId('asset-tree')).toBeInTheDocument();
      expect(screen.getByTestId('asset-reconstructor')).toBeInTheDocument();
    });
  });
});
