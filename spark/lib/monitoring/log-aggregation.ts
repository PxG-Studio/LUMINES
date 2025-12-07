/**
 * Log Aggregation Integration
 * 
 * Provides centralized logging, retention, and search interface
 * Integrates with external logging services (ELK, Loki, CloudWatch, etc.)
 */

import { logEvent, AuditEvent } from './audit';
import { getErrorLogger } from './error-logging';

export interface LogEntry {
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
  service?: string;
}

export interface LogSearchQuery {
  level?: string[];
  userId?: string;
  service?: string;
  message?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

class LogAggregator {
  private logs: LogEntry[] = [];
  private maxLogs: number = 100000; // Keep last 100k logs
  private retentionDays: number = 30;

  /**
   * Log an entry
   */
  async log(entry: Omit<LogEntry, 'timestamp'>): Promise<void> {
    const fullEntry: LogEntry = {
      ...entry,
      timestamp: Date.now(),
      service: entry.service || 'spark',
    };

    // Store locally
    this.logs.push(fullEntry);

    // Cleanup old logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Send to external logging service
    await this.sendToLoggingService(fullEntry);

    // Also log to audit system for important events
    if (entry.level === 'error' || entry.level === 'warn') {
      await logEvent(
        AuditEvent.SYSTEM_ERROR,
        {
          level: entry.level,
          message: entry.message,
          context: entry.context,
        },
        entry.userId
      );
    }
  }

  /**
   * Send log to external logging service
   */
  private async sendToLoggingService(entry: LogEntry): Promise<void> {
    const loggingServiceUrl = process.env.LOGGING_SERVICE_URL;
    if (!loggingServiceUrl) {
      return; // No external logging configured
    }

    try {
      // Determine service type from URL
      const isLoki = loggingServiceUrl.includes('loki');
      const isElasticsearch = loggingServiceUrl.includes('elasticsearch') || loggingServiceUrl.includes('es');
      const isCloudWatch = loggingServiceUrl.includes('cloudwatch') || loggingServiceUrl.includes('logs.amazonaws.com');

      if (isLoki) {
        await this.sendToLoki(entry);
      } else if (isElasticsearch) {
        await this.sendToElasticsearch(entry);
      } else if (isCloudWatch) {
        await this.sendToCloudWatch(entry);
      } else {
        // Generic HTTP endpoint
        await fetch(loggingServiceUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.LOGGING_SERVICE_KEY}`,
          },
          body: JSON.stringify(entry),
        });
      }
    } catch (error) {
      // Don't throw - logging failures shouldn't break the app
      console.error('Failed to send log to logging service:', error);
    }
  }

  /**
   * Send to Loki (Grafana Loki)
   */
  private async sendToLoki(entry: LogEntry): Promise<void> {
    const lokiUrl = process.env.LOGGING_SERVICE_URL;
    if (!lokiUrl) return;

    const labels = {
      level: entry.level,
      service: entry.service || 'spark',
      ...(entry.userId && { userId: entry.userId }),
    };

    const lokiPayload = {
      streams: [
        {
          stream: labels,
          values: [[(entry.timestamp * 1000000).toString(), JSON.stringify(entry)]],
        },
      ],
    };

    await fetch(`${lokiUrl}/loki/api/v1/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lokiPayload),
    });
  }

  /**
   * Send to Elasticsearch
   */
  private async sendToElasticsearch(entry: LogEntry): Promise<void> {
    const esUrl = process.env.LOGGING_SERVICE_URL;
    if (!esUrl) return;

    const index = `logs-${new Date(entry.timestamp).toISOString().split('T')[0]}`;

    await fetch(`${esUrl}/${index}/_doc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${process.env.ELASTICSEARCH_USER}:${process.env.ELASTICSEARCH_PASSWORD}`
        ).toString('base64')}`,
      },
      body: JSON.stringify(entry),
    });
  }

  /**
   * Send to CloudWatch
   */
  private async sendToCloudWatch(entry: LogEntry): Promise<void> {
    // CloudWatch requires AWS SDK
    // This is a placeholder structure
    const logGroup = process.env.CLOUDWATCH_LOG_GROUP || 'spark-logs';
    const logStream = `${entry.service || 'spark'}-${new Date(entry.timestamp).toISOString().split('T')[0]}`;

    // In real implementation, would use AWS SDK:
    // const cloudwatch = new CloudWatchLogs();
    // await cloudwatch.putLogEvents({
    //   logGroupName: logGroup,
    //   logStreamName: logStream,
    //   logEvents: [{
    //     timestamp: entry.timestamp,
    //     message: JSON.stringify(entry),
    //   }],
    // }).promise();
  }

  /**
   * Search logs
   */
  search(query: LogSearchQuery): LogEntry[] {
    let results = [...this.logs];

    if (query.level && query.level.length > 0) {
      results = results.filter((log) => query.level!.includes(log.level));
    }

    if (query.userId) {
      results = results.filter((log) => log.userId === query.userId);
    }

    if (query.service) {
      results = results.filter((log) => log.service === query.service);
    }

    if (query.message) {
      const messageLower = query.message.toLowerCase();
      results = results.filter((log) =>
        log.message.toLowerCase().includes(messageLower)
      );
    }

    if (query.startTime) {
      results = results.filter((log) => log.timestamp >= query.startTime!);
    }

    if (query.endTime) {
      results = results.filter((log) => log.timestamp <= query.endTime!);
    }

    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp - a.timestamp);

    // Apply limit
    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  /**
   * Cleanup old logs
   */
  cleanup(): void {
    const cutoff = Date.now() - this.retentionDays * 24 * 60 * 60 * 1000;
    this.logs = this.logs.filter((log) => log.timestamp > cutoff);
  }

  /**
   * Get log statistics
   */
  getStats(): {
    total: number;
    byLevel: Record<string, number>;
    byService: Record<string, number>;
    oldestLog: number | null;
    newestLog: number | null;
  } {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<string, number>,
      byService: {} as Record<string, number>,
      oldestLog: null as number | null,
      newestLog: null as number | null,
    };

    if (this.logs.length === 0) {
      return stats;
    }

    this.logs.forEach((log) => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      stats.byService[log.service || 'unknown'] =
        (stats.byService[log.service || 'unknown'] || 0) + 1;
    });

    const timestamps = this.logs.map((log) => log.timestamp);
    stats.oldestLog = Math.min(...timestamps);
    stats.newestLog = Math.max(...timestamps);

    return stats;
  }
}

// Singleton instance
let aggregatorInstance: LogAggregator | null = null;

/**
 * Get the global log aggregator
 */
export function getLogAggregator(): LogAggregator {
  if (!aggregatorInstance) {
    aggregatorInstance = new LogAggregator();
  }
  return aggregatorInstance;
}

/**
 * Convenience functions
 */
export async function logDebug(message: string, context?: Record<string, any>): Promise<void> {
  const aggregator = getLogAggregator();
  await aggregator.log({ level: 'debug', message, context });
}

export async function logInfo(message: string, context?: Record<string, any>): Promise<void> {
  const aggregator = getLogAggregator();
  await aggregator.log({ level: 'info', message, context });
}

export async function logWarn(message: string, context?: Record<string, any>): Promise<void> {
  const aggregator = getLogAggregator();
  await aggregator.log({ level: 'warn', message, context });
}

export async function logError(message: string, context?: Record<string, any>): Promise<void> {
  const aggregator = getLogAggregator();
  await aggregator.log({ level: 'error', message, context });
  
  // Also log to error logger
  const errorLogger = getErrorLogger();
  await errorLogger.logError(new Error(message), context);
}

