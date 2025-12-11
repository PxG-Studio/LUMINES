/**
 * Wrapper for Spark generate actions
 * This file re-exports functions from the Spark app to make them available
 * to shared API routes in src/app/api
 * 
 * Note: This uses webpack alias configured in apps/spark/next.config.js
 * to resolve @/app/spark/actions/generate to the actual Spark app file.
 */

// Re-export from Spark app actions
// The webpack alias in apps/spark/next.config.js will resolve this path
export { generateUnityScript } from '@/app/spark/actions/generate';
export type {
  GenerateOptions,
  GenerateResult,
  AIProvider,
  ClaudeModel,
  OpenAIModel
} from '@/app/spark/actions/generate';

