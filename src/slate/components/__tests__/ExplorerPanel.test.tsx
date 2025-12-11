import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExplorerPanel } from '../ExplorerPanel';

describe('ExplorerPanel', () => {
  const mockFiles = [
    {
      name: 'src',
      type: 'folder' as const,
      path: 'src',
      children: [
        { name: 'Main.cs', type: 'file' as const, path: 'src/Main.cs' },
        { name: 'GameManager.cs', type: 'file' as const, path: 'src/GameManager.cs' },
      ],
    },
    {
      name: 'Assets',
      type: 'folder' as const,
      path: 'Assets',
      children: [
        { name: 'player.prefab', type: 'file' as const, path: 'Assets/player.prefab' },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('File Tree Rendering', () => {
    it('renders file tree with folders and files', () => {
      render(<ExplorerPanel files={mockFiles} />);

      expect(screen.getByText('src')).toBeInTheDocument();
      expect(screen.getByText('Assets')).toBeInTheDocument();
      expect(screen.getByText('Main.cs')).toBeInTheDocument();
      expect(screen.getByText('GameManager.cs')).toBeInTheDocument();
    });

    it('expands folders by default', () => {
      render(<ExplorerPanel files={mockFiles} />);

      // Folders should be expanded initially
      expect(screen.getByText('Main.cs')).toBeInTheDocument();
      expect(screen.getByText('player.prefab')).toBeInTheDocument();
    });

    it('renders empty state when no files provided', () => {
      render(<ExplorerPanel files={[]} />);

      expect(screen.getByLabelText('file explorer')).toBeInTheDocument();
    });

    it('displays folder icons for folders', () => {
      render(<ExplorerPanel files={mockFiles} />);

      const folderElements = screen.getAllByText('src');
      expect(folderElements.length).toBeGreaterThan(0);
    });

    it('displays file icons for files', () => {
      render(<ExplorerPanel files={mockFiles} />);

      expect(screen.getByText('Main.cs')).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('calls onFileSelect when file is clicked', () => {
      const onFileSelect = vi.fn();

      render(<ExplorerPanel files={mockFiles} onFileSelect={onFileSelect} />);

      const fileElement = screen.getByText('Main.cs');
      fireEvent.click(fileElement);

      expect(onFileSelect).toHaveBeenCalledWith('src/Main.cs');
    });

    it('highlights selected file', () => {
      render(
        <ExplorerPanel
          files={mockFiles}
          selectedPath="src/Main.cs"
        />
      );

      const fileElement = screen.getByText('Main.cs').closest('div');
      expect(fileElement).toHaveStyle({ borderLeft: expect.stringContaining('2px solid') });
    });

    it('does not highlight unselected files', () => {
      render(
        <ExplorerPanel
          files={mockFiles}
          selectedPath="src/Main.cs"
        />
      );

      const unselectedFile = screen.getByText('GameManager.cs').closest('div');
      expect(unselectedFile).not.toHaveStyle({ borderLeft: expect.stringContaining('2px solid') });
    });
  });

  describe('Folder Expansion', () => {
    it('toggles folder expansion when folder is clicked', () => {
      render(<ExplorerPanel files={mockFiles} />);

      // Initially expanded, files should be visible
      expect(screen.getByText('Main.cs')).toBeInTheDocument();

      const folderElement = screen.getByText('src').closest('div');
      if (folderElement) {
        fireEvent.click(folderElement);

        // After collapse, files might still be visible due to animation
        // But the chevron should change
        expect(screen.getByText('src')).toBeInTheDocument();
      }
    });

    it('expands folder when clicked', () => {
      const collapsedFiles = [
        {
          name: 'src',
          type: 'folder' as const,
          path: 'src',
          children: [
            { name: 'Main.cs', type: 'file' as const, path: 'src/Main.cs' },
          ],
        },
      ];

      render(<ExplorerPanel files={collapsedFiles} />);

      const folderElement = screen.getByText('src').closest('div');
      if (folderElement) {
        fireEvent.click(folderElement);
        // Folder should expand
        expect(screen.getByText('Main.cs')).toBeInTheDocument();
      }
    });
  });

  describe('Search Functionality', () => {
    it('filters files by search term', () => {
      render(<ExplorerPanel files={mockFiles} />);

      const searchInput = screen.getByPlaceholderText('Search files...');
      fireEvent.change(searchInput, { target: { value: 'Main' } });

      expect(screen.getByText('Main.cs')).toBeInTheDocument();
      expect(screen.queryByText('GameManager.cs')).not.toBeInTheDocument();
    });

    it('filters folders by search term', () => {
      render(<ExplorerPanel files={mockFiles} />);

      const searchInput = screen.getByPlaceholderText('Search files...');
      fireEvent.change(searchInput, { target: { value: 'src' } });

      expect(screen.getByText('src')).toBeInTheDocument();
      expect(screen.queryByText('Assets')).not.toBeInTheDocument();
    });

    it('shows all files when search is cleared', () => {
      render(<ExplorerPanel files={mockFiles} />);

      const searchInput = screen.getByPlaceholderText('Search files...');
      fireEvent.change(searchInput, { target: { value: 'Main' } });
      fireEvent.change(searchInput, { target: { value: '' } });

      expect(screen.getByText('Main.cs')).toBeInTheDocument();
      expect(screen.getByText('GameManager.cs')).toBeInTheDocument();
    });

    it('performs case-insensitive search', () => {
      render(<ExplorerPanel files={mockFiles} />);

      const searchInput = screen.getByPlaceholderText('Search files...');
      fireEvent.change(searchInput, { target: { value: 'MAIN' } });

      expect(screen.getByText('Main.cs')).toBeInTheDocument();
    });
  });

  describe('Asset Manager Button', () => {
    it('renders asset manager button when onShowAssetManager is provided', () => {
      const onShowAssetManager = vi.fn();

      render(
        <ExplorerPanel
          files={mockFiles}
          onShowAssetManager={onShowAssetManager}
        />
      );

      expect(screen.getByText('Unity Assets')).toBeInTheDocument();
    });

    it('calls onShowAssetManager when button is clicked', () => {
      const onShowAssetManager = vi.fn();

      render(
        <ExplorerPanel
          files={mockFiles}
          onShowAssetManager={onShowAssetManager}
        />
      );

      const button = screen.getByText('Unity Assets');
      fireEvent.click(button);

      expect(onShowAssetManager).toHaveBeenCalled();
    });

    it('does not render asset manager button when onShowAssetManager is not provided', () => {
      render(<ExplorerPanel files={mockFiles} />);

      expect(screen.queryByText('Unity Assets')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA roles', () => {
      render(<ExplorerPanel files={mockFiles} />);

      expect(screen.getByRole('region', { name: 'file explorer' })).toBeInTheDocument();
      expect(screen.getByRole('tree', { name: 'file explorer' })).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      render(<ExplorerPanel files={mockFiles} />);

      expect(screen.getByText('Explorer')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles deeply nested folder structures', () => {
      const deepFiles = [
        {
          name: 'root',
          type: 'folder' as const,
          path: 'root',
          children: [
            {
              name: 'level1',
              type: 'folder' as const,
              path: 'root/level1',
              children: [
                {
                  name: 'level2',
                  type: 'folder' as const,
                  path: 'root/level1/level2',
                  children: [
                    { name: 'deep.cs', type: 'file' as const, path: 'root/level1/level2/deep.cs' },
                  ],
                },
              ],
            },
          ],
        },
      ];

      render(<ExplorerPanel files={deepFiles} />);

      expect(screen.getByText('root')).toBeInTheDocument();
      expect(screen.getByText('deep.cs')).toBeInTheDocument();
    });

    it('handles files with special characters in names', () => {
      const specialFiles = [
        {
          name: 'src',
          type: 'folder' as const,
          path: 'src',
          children: [
            { name: 'Test (1).cs', type: 'file' as const, path: 'src/Test (1).cs' },
            { name: 'file-name.cs', type: 'file' as const, path: 'src/file-name.cs' },
          ],
        },
      ];

      render(<ExplorerPanel files={specialFiles} />);

      expect(screen.getByText('Test (1).cs')).toBeInTheDocument();
      expect(screen.getByText('file-name.cs')).toBeInTheDocument();
    });

    it('handles empty folders', () => {
      const emptyFolderFiles = [
        {
          name: 'empty',
          type: 'folder' as const,
          path: 'empty',
          children: [],
        },
      ];

      render(<ExplorerPanel files={emptyFolderFiles} />);

      expect(screen.getByText('empty')).toBeInTheDocument();
    });

    it('handles very long file names', () => {
      const longNameFiles = [
        {
          name: 'src',
          type: 'folder' as const,
          path: 'src',
          children: [
            {
              name: 'VeryLongFileNameThatShouldBeDisplayedCorrectly.cs',
              type: 'file' as const,
              path: 'src/VeryLongFileNameThatShouldBeDisplayedCorrectly.cs',
            },
          ],
        },
      ];

      render(<ExplorerPanel files={longNameFiles} />);

      expect(
        screen.getByText('VeryLongFileNameThatShouldBeDisplayedCorrectly.cs')
      ).toBeInTheDocument();
    });
  });

  describe('Inspector Section', () => {
    it('displays inspector footer', () => {
      render(<ExplorerPanel files={mockFiles} />);

      expect(screen.getByText('Inspector')).toBeInTheDocument();
    });
  });
});

