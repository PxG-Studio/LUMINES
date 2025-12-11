/**
 * Analytics Tracker Bridge
 * 
 * Re-exports analytics tracker from SPARK module
 * This allows the main app to use SPARK's analytics functionality
 */

export { getAnalyticsTracker } from '@/lib/spark/analytics/tracker';
export type { AnalyticsEvent, AnalyticsMetrics } from '@/lib/spark/analytics/tracker';

