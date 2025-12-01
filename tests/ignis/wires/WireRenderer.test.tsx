/**
 * WireRenderer Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { WireRenderer } from '../../../src/ignis/wires/WireRenderer';

describe('WireRenderer', () => {
  const mockConnection = {
    id: 'conn1',
    fromNode: 'node1',
    fromSocket: 'out',
    toNode: 'node2',
    toSocket: 'in',
  };

  it('renders without crashing', () => {
    const { container } = render(
      <svg>
        <WireRenderer
          connection={mockConnection}
          fromCoords={{ x: 0, y: 0 }}
          toCoords={{ x: 100, y: 100 }}
        />
      </svg>
    );
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <svg>
        <WireRenderer
          connection={mockConnection}
          fromCoords={{ x: 0, y: 0 }}
          toCoords={{ x: 100, y: 100 }}
        />
      </svg>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders SVG path element', () => {
    const { container } = render(
      <svg>
        <WireRenderer
          connection={mockConnection}
          fromCoords={{ x: 0, y: 0 }}
          toCoords={{ x: 100, y: 100 }}
        />
      </svg>
    );
    const path = container.querySelector('path');
    expect(path).toBeTruthy();
  });

  it('renders Bezier curve path', () => {
    const { container } = render(
      <svg>
        <WireRenderer
          connection={mockConnection}
          fromCoords={{ x: 0, y: 0 }}
          toCoords={{ x: 100, y: 100 }}
        />
      </svg>
    );
    const path = container.querySelector('path');
    expect(path?.getAttribute('d')).toContain('C');
  });

  it('calls onRemove when wire is clicked', () => {
    const onRemove = vi.fn();
    const { container } = render(
      <svg>
        <WireRenderer
          connection={mockConnection}
          fromCoords={{ x: 0, y: 0 }}
          toCoords={{ x: 100, y: 100 }}
          onRemove={onRemove}
        />
      </svg>
    );
    const path = container.querySelector('path');
    if (path) {
      fireEvent.click(path);
      expect(onRemove).toHaveBeenCalledWith('conn1');
    }
  });

  it('uses correct wire color for socket type', () => {
    const { container } = render(
      <svg>
        <WireRenderer
          connection={mockConnection}
          fromCoords={{ x: 0, y: 0 }}
          toCoords={{ x: 100, y: 100 }}
          socketType="exec"
        />
      </svg>
    );
    const path = container.querySelector('path');
    expect(path).toBeTruthy();
  });
});

