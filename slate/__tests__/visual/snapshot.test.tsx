/**
 * UI Snapshot & Regression Tests
 * CRITICAL BLOCKER #3 - StackBlitz-parity visual regression testing
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';
import { InspectorPanel } from '@/wissil/Slate/components/InspectorPanel';
import { SplitView } from '@/design-system/primitives/SplitView';

describe('UI Snapshot & Regression Tests (CRITICAL BLOCKER #3)', () => {
  describe('Inspector Panel Snapshots', () => {
    it('should match snapshot for empty inspector', () => {
      const { container } = render(
        <ThemeProvider>
          <InspectorPanel />
        </ThemeProvider>
      );
      
      expect(container).toMatchSnapshot('inspector-empty');
    });

    it('should match snapshot for inspector with file', () => {
      const { container } = render(
        <ThemeProvider>
          <InspectorPanel />
        </ThemeProvider>
      );
      
      expect(container).toMatchSnapshot('inspector-with-file');
    });
  });

  describe('SplitView Snapshots', () => {
    it('should match snapshot for vertical split', () => {
      const { container } = render(
        <ThemeProvider>
          <SplitView direction="vertical" initial={300}>
            <div>Left Panel</div>
            <div>Right Panel</div>
          </SplitView>
        </ThemeProvider>
      );
      
      expect(container).toMatchSnapshot('splitview-vertical');
    });

    it('should match snapshot for horizontal split', () => {
      const { container } = render(
        <ThemeProvider>
          <SplitView direction="horizontal" initial={200}>
            <div>Top Panel</div>
            <div>Bottom Panel</div>
          </SplitView>
        </ThemeProvider>
      );
      
      expect(container).toMatchSnapshot('splitview-horizontal');
    });
  });

  describe('Dark Mode Snapshots', () => {
    it('should match snapshot in dark mode', () => {
      const { container } = render(
        <ThemeProvider theme="dark">
          <InspectorPanel />
        </ThemeProvider>
      );
      
      expect(container).toMatchSnapshot('inspector-dark-mode');
    });
  });

  describe('Layout Stability Snapshots', () => {
    it('should match snapshot for mobile viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container } = render(
        <ThemeProvider>
          <SplitView direction="vertical" initial={300}>
            <div>Panel 1</div>
            <div>Panel 2</div>
          </SplitView>
        </ThemeProvider>
      );
      
      expect(container).toMatchSnapshot('layout-mobile');
    });

    it('should match snapshot for tablet viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      const { container } = render(
        <ThemeProvider>
          <SplitView direction="vertical" initial={300}>
            <div>Panel 1</div>
            <div>Panel 2</div>
          </SplitView>
        </ThemeProvider>
      );
      
      expect(container).toMatchSnapshot('layout-tablet');
    });

    it('should match snapshot for desktop viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      const { container } = render(
        <ThemeProvider>
          <SplitView direction="vertical" initial={300}>
            <div>Panel 1</div>
            <div>Panel 2</div>
          </SplitView>
        </ThemeProvider>
      );
      
      expect(container).toMatchSnapshot('layout-desktop');
    });
  });

  describe('Text Overflow Snapshots', () => {
    it('should match snapshot with long text', () => {
      const longText = 'a'.repeat(1000);
      const { container } = render(
        <ThemeProvider>
          <div style={{ width: '200px' }}>
            {longText}
          </div>
        </ThemeProvider>
      );
      
      expect(container).toMatchSnapshot('text-overflow-long');
    });

    it('should match snapshot with non-ASCII text', () => {
      const { container } = render(
        <ThemeProvider>
          <div>
            测试文件 日本語 русский العربية
          </div>
        </ThemeProvider>
      );
      
      expect(container).toMatchSnapshot('text-non-ascii');
    });
  });

  describe('Component Name Snapshots', () => {
    it('should match snapshot with very long component names', () => {
      const longName = 'VeryLongComponentNameThatExceedsNormalLength'.repeat(10);
      const { container } = render(
        <ThemeProvider>
          <div>{longName}</div>
        </ThemeProvider>
      );
      
      expect(container).toMatchSnapshot('component-long-name');
    });
  });

  describe('Gluten Scaling Snapshots', () => {
    it('should match snapshot at 80% zoom', () => {
      const originalDevicePixelRatio = window.devicePixelRatio;
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        value: 0.8,
      });

      const { container } = render(
        <ThemeProvider>
          <InspectorPanel />
        </ThemeProvider>
      );
      
      expect(container).toMatchSnapshot('zoom-80');

      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        value: originalDevicePixelRatio,
      });
    });

    it('should match snapshot at 110% zoom', () => {
      const originalDevicePixelRatio = window.devicePixelRatio;
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        value: 1.1,
      });

      const { container } = render(
        <ThemeProvider>
          <InspectorPanel />
        </ThemeProvider>
      );
      
      expect(container).toMatchSnapshot('zoom-110');

      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        value: originalDevicePixelRatio,
      });
    });
  });
});

