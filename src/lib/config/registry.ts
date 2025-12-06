/**
 * Container Registry Configuration
 * Docker registry configuration using environment variables
 */

import { env, getRegistryUrl } from './environment';

export const registryConfig = {
  url: getRegistryUrl(),
  host: env.REGISTRY_HOST,
  port: env.REGISTRY_PORT,
  user: env.REGISTRY_USER,
  password: env.REGISTRY_PASSWORD,
  // Image naming
  namespace: env.K8S_NAMESPACE,
  // TODO: Future - Add image tagging strategy
} as const;

