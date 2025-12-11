import { experiments } from '../experiments';

describe('experiments', () => {
  it('assigns and persists variants', () => {
    const variant = experiments.assign({
      id: 'test-experiment',
      variants: ['A', 'B'],
      enabled: true,
    });

    const second = experiments.assign({
      id: 'test-experiment',
      variants: ['A', 'B'],
      enabled: true,
    });

    expect(second).toBe(variant);
  });
});
