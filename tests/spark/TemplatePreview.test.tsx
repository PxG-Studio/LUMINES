/**
 * TemplatePreview Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TemplatePreview } from '../../../src/spark/TemplatePreview';

describe('TemplatePreview', () => {
  it('renders without crashing', () => {
    const { container } = render(<TemplatePreview />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<TemplatePreview />);
    expect(container).toMatchSnapshot();
  });

  it('displays template name', () => {
    const template = {
      id: 'template1',
      name: 'Card Game Template',
      description: 'A card game',
      category: 'Game',
      difficulty: 'intermediate',
      tags: ['card', 'game'],
      nodeCount: 10,
      connectionCount: 5,
    };
    const { getByText } = render(<TemplatePreview template={template} />);
    expect(getByText('Card Game Template')).toBeTruthy();
  });

  it('displays template description', () => {
    const template = {
      id: 'template1',
      name: 'Template',
      description: 'Template description',
    };
    const { getByText } = render(<TemplatePreview template={template} />);
    expect(getByText('Template description')).toBeTruthy();
  });

  it('displays template tags', () => {
    const template = {
      id: 'template1',
      name: 'Template',
      tags: ['tag1', 'tag2'],
    };
    const { getByText } = render(<TemplatePreview template={template} />);
    expect(getByText('tag1')).toBeTruthy();
    expect(getByText('tag2')).toBeTruthy();
  });

  it('displays template metadata', () => {
    const template = {
      id: 'template1',
      name: 'Template',
      nodeCount: 10,
      connectionCount: 5,
      category: 'Game',
      difficulty: 'intermediate',
    };
    const { getByText } = render(<TemplatePreview template={template} />);
    expect(getByText(/Nodes: 10/)).toBeTruthy();
    expect(getByText(/Connections: 5/)).toBeTruthy();
  });
});

