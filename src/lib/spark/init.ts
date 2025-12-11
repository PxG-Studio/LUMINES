/**
 * Application Initialization
 * 
 * Sets up monitoring, error handling, and other services at startup
 */

import { setupGlobalErrorHandler } from './monitoring/error-logging';
import { initOpenTelemetry } from './monitoring/otel';
import { initDefaultChannels, getAlertingSystem } from './monitoring/alerting';
import { getLogAggregator } from './monitoring/log-aggregation';

/**
 * Initialize all services
 */
export async function initializeApp(): Promise<void> {
  console.log('[Init] Starting application initialization...');

  try {
    // Set up global error handling
    setupGlobalErrorHandler();
    console.log('[Init] ✓ Global error handler configured');

    // Initialize OpenTelemetry (if enabled)
    if (process.env.OTEL_ENABLED === 'true') {
      await initOpenTelemetry();
      console.log('[Init] ✓ OpenTelemetry initialized');
    }

    // Initialize alerting system
    initDefaultChannels();
    const alerting = getAlertingSystem();
    alerting.start(60000); // Check every minute
    console.log('[Init] ✓ Alerting system started');

    // Initialize log aggregation
    const logAggregator = getLogAggregator();
    await logAggregator.log({
      level: 'info',
      message: 'Application initialized',
      service: 'spark',
    });
    console.log('[Init] ✓ Log aggregation initialized');

    console.log('[Init] Application initialization complete');
  } catch (error) {
    console.error('[Init] Initialization failed:', error);
    throw error;
  }
}

/**
 * Shutdown cleanup
 */
export async function shutdownApp(): Promise<void> {
  console.log('[Shutdown] Starting graceful shutdown...');

  try {
    // Stop alerting system
    const alerting = getAlertingSystem();
    alerting.stop();
    console.log('[Shutdown] ✓ Alerting system stopped');

    // Cleanup log aggregator
    const logAggregator = getLogAggregator();
    logAggregator.cleanup();
    console.log('[Shutdown] ✓ Log aggregator cleaned up');

    console.log('[Shutdown] Graceful shutdown complete');
  } catch (error) {
    console.error('[Shutdown] Shutdown error:', error);
  }
}

