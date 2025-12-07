/**
 * Performance Monitoring and Alerting Thresholds
 *
 * Production-grade observability with automatic alerting
 */

import { getTimer, getCounter, getAllMetrics } from "../metrics/metrics";

export interface AlertRule {
  name: string;
  condition: (metrics: any) => boolean;
  severity: "warning" | "critical";
  message: string;
  cooldownMs: number;
}

interface AlertState {
  lastTriggered: number;
  triggerCount: number;
}

const alertStates = new Map<string, AlertState>();

export const ALERT_RULES: AlertRule[] = [
  {
    name: "high_p95_latency",
    condition: (metrics) => {
      const timer = metrics.timers?.["unity.generate_script"];
      return timer && timer.p95 > 5000;
    },
    severity: "warning",
    message: "P95 latency for Unity script generation > 5s",
    cooldownMs: 300000,
  },
  {
    name: "high_error_rate",
    condition: (metrics) => {
      const total = metrics.counters?.["unity.generate_script.requests"] || 0;
      const failed = metrics.counters?.["unity.generate_script.failed"] || 0;
      const errorRate = total > 0 ? failed / total : 0;
      return errorRate > 0.1;
    },
    severity: "critical",
    message: "Error rate > 10% for Unity operations",
    cooldownMs: 600000,
  },
  {
    name: "high_queue_depth",
    condition: (metrics) => {
      const queueDepth = metrics.counters?.["nats.queue_depth"] || 0;
      return queueDepth > 800;
    },
    severity: "warning",
    message: "NATS queue depth > 800 (approaching limit)",
    cooldownMs: 180000,
  },
  {
    name: "preview_cache_miss_rate",
    condition: (metrics) => {
      const hits = metrics.counters?.["preview.cache_hit"] || 0;
      const misses = metrics.counters?.["preview.cache_miss"] || 0;
      const total = hits + misses;
      const missRate = total > 100 ? misses / total : 0;
      return missRate > 0.5;
    },
    severity: "warning",
    message: "Preview cache miss rate > 50%",
    cooldownMs: 300000,
  },
  {
    name: "build_timeout_spike",
    condition: (metrics) => {
      const completed = metrics.counters?.["unity.build.completed"] || 0;
      const timeout = metrics.counters?.["unity.build.timeout"] || 0;
      const total = completed + timeout;
      const timeoutRate = total > 10 ? timeout / total : 0;
      return timeoutRate > 0.2;
    },
    severity: "critical",
    message: "Build timeout rate > 20%",
    cooldownMs: 600000,
  },
  {
    name: "database_slow_queries",
    condition: (metrics) => {
      const timer = metrics.timers?.["db.query"];
      return timer && timer.p95 > 1000;
    },
    severity: "warning",
    message: "Database P95 query latency > 1s",
    cooldownMs: 300000,
  },
  {
    name: "nats_publish_failures",
    condition: (metrics) => {
      const published = metrics.counters?.["nats.published"] || 0;
      const failed = metrics.counters?.["nats.failed"] || 0;
      const total = published + failed;
      const failureRate = total > 100 ? failed / total : 0;
      return failureRate > 0.05;
    },
    severity: "critical",
    message: "NATS publish failure rate > 5%",
    cooldownMs: 600000,
  },
  {
    name: "mcp_circuit_breaker_open",
    condition: (metrics) => {
      const circuitBreakerOpen =
        metrics.counters?.["unity_mcp.circuit_breaker.open"] || 0;
      return circuitBreakerOpen > 0;
    },
    severity: "critical",
    message: "Unity MCP circuit breaker is open",
    cooldownMs: 300000,
  },
];

export function checkAlerts(): Array<{
  rule: AlertRule;
  triggered: boolean;
  message: string;
}> {
  const metrics = getAllMetrics();
  const now = Date.now();
  const triggeredAlerts: Array<{
    rule: AlertRule;
    triggered: boolean;
    message: string;
  }> = [];

  for (const rule of ALERT_RULES) {
    const state = alertStates.get(rule.name);
    const cooldownExpired = !state || now - state.lastTriggered > rule.cooldownMs;

    if (cooldownExpired && rule.condition(metrics)) {
      triggeredAlerts.push({
        rule,
        triggered: true,
        message: rule.message,
      });

      alertStates.set(rule.name, {
        lastTriggered: now,
        triggerCount: (state?.triggerCount || 0) + 1,
      });

      sendAlert(rule);
    }
  }

  return triggeredAlerts;
}

function sendAlert(rule: AlertRule): void {
  const logLevel = rule.severity === "critical" ? "error" : "warn";
  console[logLevel](`[ALERT][${rule.severity.toUpperCase()}] ${rule.message}`);

  if (typeof window !== "undefined") {
    // Client-side: Show toast or notification
    return;
  }

  // Server-side: Send to external service
  if (process.env.SLACK_WEBHOOK_URL) {
    sendSlackAlert(rule).catch((err) =>
      console.error("Failed to send Slack alert:", err)
    );
  }

  if (process.env.PAGERDUTY_INTEGRATION_KEY && rule.severity === "critical") {
    sendPagerDutyAlert(rule).catch((err) =>
      console.error("Failed to send PagerDuty alert:", err)
    );
  }
}

async function sendSlackAlert(rule: AlertRule): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const color = rule.severity === "critical" ? "danger" : "warning";
  const emoji = rule.severity === "critical" ? ":rotating_light:" : ":warning:";

  const payload = {
    attachments: [
      {
        color,
        title: `${emoji} SPARK Alert: ${rule.name}`,
        text: rule.message,
        fields: [
          {
            title: "Severity",
            value: rule.severity.toUpperCase(),
            short: true,
          },
          {
            title: "Timestamp",
            value: new Date().toISOString(),
            short: true,
          },
        ],
        footer: "SPARK Monitoring",
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function sendPagerDutyAlert(rule: AlertRule): Promise<void> {
  const integrationKey = process.env.PAGERDUTY_INTEGRATION_KEY;
  if (!integrationKey) return;

  const payload = {
    routing_key: integrationKey,
    event_action: "trigger",
    payload: {
      summary: rule.message,
      severity: rule.severity === "critical" ? "critical" : "warning",
      source: "SPARK",
      component: "monitoring",
      group: "performance",
      custom_details: {
        alert_name: rule.name,
        threshold_exceeded: true,
      },
    },
  };

  await fetch("https://events.pagerduty.com/v2/enqueue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function startAlertMonitoring(intervalMs = 60000): void {
  setInterval(() => {
    try {
      checkAlerts();
    } catch (error) {
      console.error("Alert check failed:", error);
    }
  }, intervalMs);

  console.log(`Alert monitoring started (interval: ${intervalMs}ms)`);
}

export function getAlertStats(): {
  totalRules: number;
  activeAlerts: number;
  alertHistory: Map<string, AlertState>;
} {
  const metrics = getAllMetrics();
  let activeCount = 0;

  for (const rule of ALERT_RULES) {
    if (rule.condition(metrics)) {
      activeCount++;
    }
  }

  return {
    totalRules: ALERT_RULES.length,
    activeAlerts: activeCount,
    alertHistory: new Map(alertStates),
  };
}
