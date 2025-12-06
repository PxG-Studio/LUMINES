/**
 * Alerting System
 * 
 * Configures alert rules, notification channels, and test delivery
 */

import { getLogAggregator } from './log-aggregation';
import { getErrorLogger } from './error-logging';
import { getAnalyticsTracker } from '../analytics/tracker';

export interface AlertRule {
  id: string;
  name: string;
  condition: (metrics: any) => boolean;
  severity: 'info' | 'warning' | 'critical';
  cooldown: number; // ms
  lastTriggered?: number;
  enabled: boolean;
}

export interface NotificationChannel {
  id: string;
  type: 'email' | 'slack' | 'webhook' | 'pagerduty';
  config: Record<string, any>;
  enabled: boolean;
}

export interface Alert {
  id: string;
  ruleId: string;
  severity: string;
  message: string;
  timestamp: number;
  resolved?: boolean;
  resolvedAt?: number;
}

class AlertingSystem {
  private rules: Map<string, AlertRule> = new Map();
  private channels: Map<string, NotificationChannel> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;

  /**
   * Register an alert rule
   */
  registerRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Register a notification channel
   */
  registerChannel(channel: NotificationChannel): void {
    this.channels.set(channel.id, channel);
  }

  /**
   * Start monitoring
   */
  start(intervalMs: number = 60000): void {
    if (this.checkInterval) {
      return; // Already started
    }

    this.checkInterval = setInterval(() => {
      this.checkRules();
    }, intervalMs);
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Check all alert rules
   */
  private async checkRules(): Promise<void> {
    const metrics = await this.collectMetrics();

    for (const rule of this.rules.values()) {
      if (!rule.enabled) {
        continue;
      }

      // Check cooldown
      if (rule.lastTriggered && Date.now() - rule.lastTriggered < rule.cooldown) {
        continue;
      }

      // Check condition
      if (rule.condition(metrics)) {
        await this.triggerAlert(rule, metrics);
        rule.lastTriggered = Date.now();
      }
    }
  }

  /**
   * Collect current metrics
   */
  private async collectMetrics(): Promise<any> {
    const logAggregator = getLogAggregator();
    const errorLogger = getErrorLogger();
    const analytics = getAnalyticsTracker();

    const logStats = logAggregator.getStats();
    const errorStats = errorLogger.getStats();
    const recentErrors = errorLogger.getRecentErrors(100);

    return {
      logs: logStats,
      errors: errorStats,
      recentErrors: recentErrors.length,
      errorRate: this.calculateErrorRate(recentErrors),
      // Add more metrics as needed
    };
  }

  /**
   * Calculate error rate
   */
  private calculateErrorRate(errors: any[]): number {
    if (errors.length === 0) return 0;

    const now = Date.now();
    const oneHourAgo = now - 3600000;
    const recentErrors = errors.filter((e) => e.timestamp > oneHourAgo);

    return recentErrors.length / 60; // Errors per minute
  }

  /**
   * Trigger an alert
   */
  private async triggerAlert(rule: AlertRule, metrics: any): Promise<void> {
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const message = this.formatAlertMessage(rule, metrics);

    const alert: Alert = {
      id: alertId,
      ruleId: rule.id,
      severity: rule.severity,
      message,
      timestamp: Date.now(),
      resolved: false,
    };

    this.alerts.set(alertId, alert);

    // Send notifications
    await this.sendNotifications(alert, rule);

    // Log alert
    const logAggregator = getLogAggregator();
    await logAggregator.log({
      level: rule.severity === 'critical' ? 'error' : 'warn',
      message: `Alert triggered: ${rule.name}`,
      context: {
        alertId,
        ruleId: rule.id,
        severity: rule.severity,
        metrics,
      },
    });
  }

  /**
   * Format alert message
   */
  private formatAlertMessage(rule: AlertRule, metrics: any): string {
    return `Alert: ${rule.name}\nSeverity: ${rule.severity}\nMetrics: ${JSON.stringify(metrics, null, 2)}`;
  }

  /**
   * Send notifications to all enabled channels
   */
  private async sendNotifications(alert: Alert, rule: AlertRule): Promise<void> {
    for (const channel of this.channels.values()) {
      if (!channel.enabled) {
        continue;
      }

      try {
        await this.sendToChannel(channel, alert, rule);
      } catch (error) {
        console.error(`Failed to send alert to channel ${channel.id}:`, error);
      }
    }
  }

  /**
   * Send alert to a specific channel
   */
  private async sendToChannel(
    channel: NotificationChannel,
    alert: Alert,
    rule: AlertRule
  ): Promise<void> {
    switch (channel.type) {
      case 'email':
        await this.sendEmail(channel, alert, rule);
        break;
      case 'slack':
        await this.sendSlack(channel, alert, rule);
        break;
      case 'webhook':
        await this.sendWebhook(channel, alert, rule);
        break;
      case 'pagerduty':
        await this.sendPagerDuty(channel, alert, rule);
        break;
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(
    channel: NotificationChannel,
    alert: Alert,
    rule: AlertRule
  ): Promise<void> {
    // In real implementation, would use email service (SendGrid, SES, etc.)
    const { to, from, subject } = channel.config;
    console.log(`[Email Alert] To: ${to}, Subject: ${subject || rule.name}, Message: ${alert.message}`);
  }

  /**
   * Send Slack notification
   */
  private async sendSlack(
    channel: NotificationChannel,
    alert: Alert,
    rule: AlertRule
  ): Promise<void> {
    const { webhookUrl } = channel.config;
    if (!webhookUrl) return;

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: `🚨 Alert: ${rule.name}`,
        attachments: [
          {
            color: rule.severity === 'critical' ? 'danger' : rule.severity === 'warning' ? 'warning' : 'good',
            fields: [
              { title: 'Severity', value: rule.severity, short: true },
              { title: 'Message', value: alert.message, short: false },
            ],
            ts: Math.floor(alert.timestamp / 1000),
          },
        ],
      }),
    });
  }

  /**
   * Send webhook notification
   */
  private async sendWebhook(
    channel: NotificationChannel,
    alert: Alert,
    rule: AlertRule
  ): Promise<void> {
    const { url, headers } = channel.config;
    if (!url) return;

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        alert,
        rule,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  /**
   * Send PagerDuty notification
   */
  private async sendPagerDuty(
    channel: NotificationChannel,
    alert: Alert,
    rule: AlertRule
  ): Promise<void> {
    const { integrationKey } = channel.config;
    if (!integrationKey) return;

    await fetch('https://events.pagerduty.com/v2/enqueue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        routing_key: integrationKey,
        event_action: 'trigger',
        payload: {
          summary: `${rule.name}: ${alert.message}`,
          severity: rule.severity,
          source: 'spark',
          custom_details: {
            alertId: alert.id,
            ruleId: rule.id,
          },
        },
      }),
    });
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = Date.now();
    }
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter((a) => !a.resolved);
  }

  /**
   * Get all alerts
   */
  getAllAlerts(): Alert[] {
    return Array.from(this.alerts.values());
  }
}

// Singleton instance
let alertingInstance: AlertingSystem | null = null;

/**
 * Get the global alerting system
 */
export function getAlertingSystem(): AlertingSystem {
  if (!alertingInstance) {
    alertingInstance = new AlertingSystem();

    // Register default rules
    alertingInstance.registerRule({
      id: 'high-error-rate',
      name: 'High Error Rate',
      condition: (metrics) => metrics.errorRate > 10, // More than 10 errors per minute
      severity: 'critical',
      cooldown: 300000, // 5 minutes
      enabled: true,
    });

    alertingInstance.registerRule({
      id: 'many-recent-errors',
      name: 'Many Recent Errors',
      condition: (metrics) => metrics.recentErrors > 50, // More than 50 errors in last hour
      severity: 'warning',
      cooldown: 600000, // 10 minutes
      enabled: true,
    });
  }
  return alertingInstance;
}

/**
 * Initialize default notification channels from environment
 */
export function initDefaultChannels(): void {
  const alerting = getAlertingSystem();

  // Slack channel
  if (process.env.SLACK_WEBHOOK_URL) {
    alerting.registerChannel({
      id: 'slack-default',
      type: 'slack',
      config: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
      },
      enabled: true,
    });
  }

  // Email channel
  if (process.env.ALERT_EMAIL_TO) {
    alerting.registerChannel({
      id: 'email-default',
      type: 'email',
      config: {
        to: process.env.ALERT_EMAIL_TO,
        from: process.env.ALERT_EMAIL_FROM || 'alerts@spark.com',
      },
      enabled: true,
    });
  }

  // Webhook channel
  if (process.env.ALERT_WEBHOOK_URL) {
    alerting.registerChannel({
      id: 'webhook-default',
      type: 'webhook',
      config: {
        url: process.env.ALERT_WEBHOOK_URL,
        headers: process.env.ALERT_WEBHOOK_HEADERS
          ? JSON.parse(process.env.ALERT_WEBHOOK_HEADERS)
          : {},
      },
      enabled: true,
    });
  }
}

