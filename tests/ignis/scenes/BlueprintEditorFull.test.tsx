/**
 * BlueprintEditorFull Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BlueprintEditorFull } from '../../../src/ignis/scenes/BlueprintEditorFull';

describe('BlueprintEditorFull', () => {
  it('renders without crashing', () => {
    const { container } = render(<BlueprintEditorFull />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<BlueprintEditorFull />);
    expect(container).toMatchSnapshot();
  });

  it('renders complete editor scene', () => {
    const { container } = render(<BlueprintEditorFull />);
    expect(container).toBeTruthy();
  });

  it('contains sidebar', () => {
    const { container } = render(<BlueprintEditorFull />);
    expect(container.textContent).toContain('Blueprints');
  });

  it('contains top bar', () => {
    const { container } = render(<BlueprintEditorFull />);
    expect(container.textContent).toContain('WISSIL');
  });
});

