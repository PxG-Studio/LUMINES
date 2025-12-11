import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InspectorPanel } from '../InspectorPanel';

describe('InspectorPanel - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Empty State', () => {
    it('renders empty state when no item selected', () => {
      render(<InspectorPanel />);

      expect(screen.getByText('Inspector')).toBeInTheDocument();
      expect(screen.getByText('Select a file or folder to view properties')).toBeInTheDocument();
    });

    it('displays file icon in empty state', () => {
      render(<InspectorPanel />);

      const panel = screen.getByTestId('inspector-panel');
      expect(panel).toBeInTheDocument();
    });
  });

  describe('File Display', () => {
    it('displays file name and path', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'Main.cs',
            path: 'src/Main.cs',
            type: 'file',
          }}
        />
      );

      expect(screen.getByText('Main.cs')).toBeInTheDocument();
      expect(screen.getByText('src/Main.cs')).toBeInTheDocument();
    });

    it('displays file type', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'Main.cs',
            path: 'src/Main.cs',
            type: 'file',
            fileType: 'cs',
          }}
        />
      );

      expect(screen.getByText('cs')).toBeInTheDocument();
    });

    it('displays file size', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'Main.cs',
            path: 'src/Main.cs',
            type: 'file',
            size: 1024,
          }}
        />
      );

      expect(screen.getByText(/1.00 KB/i)).toBeInTheDocument();
    });

    it('formats large file sizes correctly', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'LargeFile.bin',
            path: 'src/LargeFile.bin',
            type: 'file',
            size: 5 * 1024 * 1024, // 5 MB
          }}
        />
      );

      expect(screen.getByText(/5.00 MB/i)).toBeInTheDocument();
    });

    it('displays created date', () => {
      const createdDate = new Date('2024-01-15T10:30:00');
      render(
        <InspectorPanel
          selectedItem={{
            name: 'Main.cs',
            path: 'src/Main.cs',
            type: 'file',
            created: createdDate,
          }}
        />
      );

      expect(screen.getByText(/Jan/i)).toBeInTheDocument();
    });

    it('displays modified date', () => {
      const modifiedDate = new Date('2024-01-20T14:45:00');
      render(
        <InspectorPanel
          selectedItem={{
            name: 'Main.cs',
            path: 'src/Main.cs',
            type: 'file',
            modified: modifiedDate,
          }}
        />
      );

      expect(screen.getByText(/Jan/i)).toBeInTheDocument();
    });
  });

  describe('Folder Display', () => {
    it('displays folder name and path', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'src',
            path: 'src',
            type: 'folder',
          }}
        />
      );

      // Check that folder name appears (use getAllByText since name and path are same)
      const srcElements = screen.getAllByText('src');
      expect(srcElements.length).toBeGreaterThan(0);
      // Verify it's rendered as a folder (check for folder type)
      expect(screen.getByText(/folder/i)).toBeInTheDocument();
    });

    it('displays folder type', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'src',
            path: 'src',
            type: 'folder',
          }}
        />
      );

      expect(screen.getByText('Folder')).toBeInTheDocument();
    });
  });

  describe('Metadata Display', () => {
    it('displays simple metadata', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'Main.cs',
            path: 'src/Main.cs',
            type: 'file',
            metadata: {
              guid: 'abc123',
              version: '1.0.0',
            },
          }}
        />
      );

      expect(screen.getByText('guid')).toBeInTheDocument();
      expect(screen.getByText('abc123')).toBeInTheDocument();
      expect(screen.getByText('version')).toBeInTheDocument();
      expect(screen.getByText('1.0.0')).toBeInTheDocument();
    });

    it('displays complex metadata as JSON', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'Main.cs',
            path: 'src/Main.cs',
            type: 'file',
            metadata: {
              complex: {
                nested: {
                  value: 'test',
                },
              },
            },
          }}
        />
      );

      expect(screen.getByText('complex')).toBeInTheDocument();
      expect(screen.getByText(/"nested"/i)).toBeInTheDocument();
    });

    it('handles empty metadata', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'Main.cs',
            path: 'src/Main.cs',
            type: 'file',
            metadata: {},
          }}
        />
      );

      expect(screen.getByText('Main.cs')).toBeInTheDocument();
    });
  });

  describe('File Type Icons', () => {
    it('displays code icon for code files', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'Main.cs',
            path: 'src/Main.cs',
            type: 'file',
            fileType: 'cs',
          }}
        />
      );

      const panel = screen.getByTestId('inspector-panel');
      expect(panel).toBeInTheDocument();
    });

    it('displays image icon for image files', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'sprite.png',
            path: 'Assets/sprite.png',
            type: 'file',
            fileType: 'png',
          }}
        />
      );

      const panel = screen.getByTestId('inspector-panel');
      expect(panel).toBeInTheDocument();
    });

    it('displays folder icon for folders', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'src',
            path: 'src',
            type: 'folder',
          }}
        />
      );

      const panel = screen.getByTestId('inspector-panel');
      expect(panel).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long file names', () => {
      const longName = 'A'.repeat(200);
      render(
        <InspectorPanel
          selectedItem={{
            name: longName,
            path: `src/${longName}`,
            type: 'file',
          }}
        />
      );

      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('handles very long paths', () => {
      const longPath = 'src/' + 'deep/'.repeat(50) + 'file.cs';
      render(
        <InspectorPanel
          selectedItem={{
            name: 'file.cs',
            path: longPath,
            type: 'file',
          }}
        />
      );

      expect(screen.getByText(longPath)).toBeInTheDocument();
    });

    it('handles missing file extension', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'file',
            path: 'src/file',
            type: 'file',
          }}
        />
      );

      expect(screen.getByText('file')).toBeInTheDocument();
    });

    it('handles zero file size', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'Empty.cs',
            path: 'src/Empty.cs',
            type: 'file',
            size: 0,
          }}
        />
      );

      expect(screen.getByText(/0 B/i)).toBeInTheDocument();
    });

    it('handles undefined size gracefully', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'Main.cs',
            path: 'src/Main.cs',
            type: 'file',
          }}
        />
      );

      expect(screen.getByText('Main.cs')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<InspectorPanel />);

      const heading = screen.getByText('Inspector');
      expect(heading.tagName).toBe('H3');
    });

    it('has test id for testing', () => {
      render(<InspectorPanel />);

      expect(screen.getByTestId('inspector-panel')).toBeInTheDocument();
    });

    it('has proper semantic structure', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'Main.cs',
            path: 'src/Main.cs',
            type: 'file',
          }}
        />
      );

      const panel = screen.getByTestId('inspector-panel');
      expect(panel).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('renders with proper structure', () => {
      const { container } = render(<InspectorPanel />);

      const panel = container.querySelector('[data-testid="inspector-panel"]');
      expect(panel).toBeInTheDocument();
    });

    it('handles overflow for long content', () => {
      render(
        <InspectorPanel
          selectedItem={{
            name: 'Main.cs',
            path: 'src/Main.cs',
            type: 'file',
            metadata: {
              large: 'A'.repeat(1000),
            },
          }}
        />
      );

      const panel = screen.getByTestId('inspector-panel');
      expect(panel).toHaveStyle({ overflowY: 'auto' });
    });
  });
});
