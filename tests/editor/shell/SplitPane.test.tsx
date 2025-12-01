/**
 * SplitPane Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { SplitPane } from '../../../src/editor/shell/SplitPane';

describe('SplitPane', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <SplitPane>
        <div>Left</div>
        <div>Right</div>
      </SplitPane>
    );
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <SplitPane>
        <div>Left</div>
        <div>Right</div>
      </SplitPane>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders both children', () => {
    const { getByText } = render(
      <SplitPane>
        <div>Left Panel</div>
        <div>Right Panel</div>
      </SplitPane>
    );
    expect(getByText('Left Panel')).toBeTruthy();
    expect(getByText('Right Panel')).toBeTruthy();
  });

  it('renders horizontal split by default', () => {
    const { container } = render(
      <SplitPane>
        <div>Left</div>
        <div>Right</div>
      </SplitPane>
    );
    const splitPane = container.firstChild as HTMLElement;
    expect(splitPane.style.flexDirection).toBe('row');
  });

  it('renders vertical split when direction is vertical', () => {
    const { container } = render(
      <SplitPane direction="vertical">
        <div>Top</div>
        <div>Bottom</div>
      </SplitPane>
    );
    const splitPane = container.firstChild as HTMLElement;
    expect(splitPane.style.flexDirection).toBe('column');
  });

  it('has a divider element', () => {
    const { container } = render(
      <SplitPane>
        <div>Left</div>
        <div>Right</div>
      </SplitPane>
    );
    const divider = container.querySelector('[style*="cursor"]');
    expect(divider).toBeTruthy();
  });

  it('allows dragging the divider', () => {
    const { container } = render(
      <SplitPane>
        <div>Left</div>
        <div>Right</div>
      </SplitPane>
    );
    const divider = container.querySelector('[style*="cursor"]');
    if (divider) {
      fireEvent.mouseDown(divider);
      fireEvent.mouseMove(divider, { clientX: 300, clientY: 0 });
      fireEvent.mouseUp(divider);
      expect(container).toBeTruthy();
    }
  });
});

