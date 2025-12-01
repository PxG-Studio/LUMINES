/**
 * SimulationWrapper Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SimulationWrapper } from '../../../src/simulation/SimulationWrapper';

describe('SimulationWrapper', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <SimulationWrapper>
        <div>Test Content</div>
      </SimulationWrapper>
    );
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <SimulationWrapper>
        <div>Test Content</div>
      </SimulationWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('wraps children with simulation context', () => {
    const { getByText } = render(
      <SimulationWrapper>
        <div>Child Content</div>
      </SimulationWrapper>
    );
    expect(getByText('Child Content')).toBeTruthy();
  });

  it('applies theme to wrapper', () => {
    const { container } = render(
      <SimulationWrapper theme="light">
        <div>Content</div>
      </SimulationWrapper>
    );
    expect(container).toBeTruthy();
  });
});

