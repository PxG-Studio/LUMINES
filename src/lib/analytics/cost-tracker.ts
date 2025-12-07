/**
 * Cost Tracker Bridge
 * 
 * Re-exports cost tracker from SPARK module
 * This allows the main app to use SPARK's cost tracking functionality
 */

export { getCostTracker } from '@/lib/spark/analytics/cost-tracker';
export type { CostMetrics, OptimizationRecommendation } from '@/lib/spark/analytics/cost-tracker';

