/**
 * Experiments Manager
 * EC-204, EC-205, EC-206: A/B testing framework
 */
import { localStorage as safeLocalStorage } from './storage';

export type Variant = 'A' | 'B';

export interface ExperimentConfig {
  id: string;
  variants: Variant[];
  weights?: number[];
  enabled?: boolean;
}

class Experiments {
  private experiments = new Map<string, Variant>();

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = safeLocalStorage.get<Record<string, Variant>>('experiments');
      if (stored) {
        Object.entries(stored).forEach(([id, variant]) => {
          this.experiments.set(id, variant);
        });
      }
    }
  }

  assign(config: ExperimentConfig): Variant {
    if (!config.enabled) {
      return config.variants[0];
    }

    if (this.experiments.has(config.id)) {
      return this.experiments.get(config.id)!;
    }

    const variant = this.rollVariant(config.variants, config.weights);
    this.experiments.set(config.id, variant);
    safeLocalStorage.set('experiments', Object.fromEntries(this.experiments));
    return variant;
  }

  private rollVariant(variants: Variant[], weights?: number[]): Variant {
    if (!weights || weights.length !== variants.length) {
      const randomIndex = Math.floor(Math.random() * variants.length);
      return variants[randomIndex];
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const randomValue = Math.random() * totalWeight;

    let currentWeight = 0;
    for (let i = 0; i < variants.length; i++) {
      currentWeight += weights[i];
      if (randomValue <= currentWeight) {
        return variants[i];
      }
    }

    return variants[0];
  }
}

export const experiments = new Experiments();
