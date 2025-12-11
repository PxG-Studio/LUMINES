import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { HeroPromptInput } from '../HeroPromptInput';

describe('HeroPromptInput', () => {
  it('renders with placeholder text', () => {
    const handleSubmit = vi.fn();
    render(
      <HeroPromptInput
        onSubmit={handleSubmit}
        placeholder="Describe your idea"
        examples={['Example project']}
      />
    );

    expect(screen.getByPlaceholderText('Describe your idea')).toBeInTheDocument();
  });

  it('submits when valid text is provided', () => {
    const handleSubmit = vi.fn();
    render(
      <HeroPromptInput
        onSubmit={handleSubmit}
        placeholder="Describe your idea"
        examples={[]}
      />
    );

    const input = screen.getByPlaceholderText('Describe your idea');
    fireEvent.change(input, { target: { value: 'Build a web app' } });

    const button = screen.getByRole('button', { name: /submit project idea/i });
    fireEvent.click(button);

    expect(handleSubmit).toHaveBeenCalledWith('Build a web app');
  });
});
