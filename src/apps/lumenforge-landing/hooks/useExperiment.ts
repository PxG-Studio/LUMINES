import { useMemo } from 'react';
import { experiments, Variant, ExperimentConfig } from '../utils/experiments';

export function useExperiment(config: ExperimentConfig): Variant {
  return useMemo(() => experiments.assign(config), [config.id]);
}
