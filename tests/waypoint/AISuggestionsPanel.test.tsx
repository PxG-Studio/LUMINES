/**
 * AISuggestionsPanel Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { AISuggestionsPanel } from '../../../src/waypoint/AISuggestionsPanel';

describe('AISuggestionsPanel', () => {
  it('renders without crashing', () => {
    const { container } = render(<AISuggestionsPanel />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<AISuggestionsPanel />);
    expect(container).toMatchSnapshot();
  });

  it('displays loading state', () => {
    const { getByText } = render(<AISuggestionsPanel loading={true} />);
    expect(getByText(/Generating suggestions/)).toBeTruthy();
  });

  it('renders suggestions', () => {
    const suggestions = ['Add Branch node', 'Connect flow'];
    const { getByText } = render(<AISuggestionsPanel suggestions={suggestions} />);
    expect(getByText('Add Branch node')).toBeTruthy();
    expect(getByText('Connect flow')).toBeTruthy();
  });

  it('shows empty state when no suggestions', () => {
    const { getByText } = render(<AISuggestionsPanel suggestions={[]} />);
    expect(getByText(/No suggestions available/)).toBeTruthy();
  });

  it('calls onSuggestionClick when suggestion is clicked', () => {
    const suggestions = ['Add Branch node'];
    const onSuggestionClick = vi.fn();
    const { getByText } = render(
      <AISuggestionsPanel suggestions={suggestions} onSuggestionClick={onSuggestionClick} />
    );
    fireEvent.click(getByText('Add Branch node'));
    expect(onSuggestionClick).toHaveBeenCalledWith('Add Branch node');
  });
});

