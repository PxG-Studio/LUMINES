/**
 * AIExplainPanel Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AIExplainPanel } from '../../../src/waypoint/AIExplainPanel';

describe('AIExplainPanel', () => {
  it('renders without crashing', () => {
    const { container } = render(<AIExplainPanel />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<AIExplainPanel />);
    expect(container).toMatchSnapshot();
  });

  it('displays explanation text', () => {
    const explanation = 'This node adds two numbers together.';
    const { getByText } = render(<AIExplainPanel explanation={explanation} />);
    expect(getByText(explanation)).toBeTruthy();
  });

  it('displays code if provided', () => {
    const code = 'function add(a, b) { return a + b; }';
    const { container } = render(<AIExplainPanel code={code} />);
    const pre = container.querySelector('pre');
    expect(pre).toBeTruthy();
    expect(pre?.textContent).toContain(code);
  });

  it('shows default message when no explanation', () => {
    const { getByText } = render(<AIExplainPanel explanation="" />);
    expect(getByText(/No explanation available/)).toBeTruthy();
  });
});

