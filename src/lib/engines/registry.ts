/**
 * Engine Registry Bridge
 * 
 * Re-exports engine registry from SPARK module
 * This allows the main app to use SPARK's engine registry
 */

export { getEngineRegistry } from '@/lib/spark/engines/registry';
export type { EngineAdapter, GenerateResult, ValidationResult } from '@/lib/spark/engines/base';

