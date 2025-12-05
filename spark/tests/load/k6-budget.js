import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * k6 Performance Budget Test
 * 
 * Validates performance budgets are met
 * Goal: Ensure system meets performance requirements
 */
export const options = {
  vus: 5,
  duration: '5m',
  thresholds: {
    // Performance budgets
    http_req_duration: [
      'p(50)<1000',   // 50% of requests < 1s
      'p(95)<3000',   // 95% of requests < 3s
      'p(99)<5000',   // 99% of requests < 5s
    ],
    http_req_failed: ['rate<0.01'], // < 1% errors
    http_req_waiting: ['p(95)<2000'], // Wait time < 2s
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Performance budgets
const BUDGETS = {
  generationTime: 5000,      // 5 seconds max
  healthCheckTime: 500,      // 500ms max
  errorRate: 0.01,           // 1% max
};

export default function () {
  // Health check - should be fast
  let res = http.get(`${BASE_URL}/api/health`, {
    tags: { name: 'HealthCheck' },
  });

  check(res, {
    'health check within budget': (r) => r.timings.duration < BUDGETS.healthCheckTime,
    'health check successful': (r) => r.status === 200,
  });

  sleep(1);

  // Generation request - main performance test
  res = http.post(
    `${BASE_URL}/api/spark/generate`,
    JSON.stringify({
      prompt: 'Create a Unity PlayerController script',
      provider: 'claude',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'Generation' },
    }
  );

  check(res, {
    'generation within budget': (r) => r.timings.duration < BUDGETS.generationTime,
    'generation successful': (r) => r.status === 200 || r.status === 202,
    'response has code': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.code !== undefined || body.success === true;
      } catch {
        return false;
      }
    },
  });

  sleep(2);
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'performance-budget.json': JSON.stringify({
      timestamp: new Date().toISOString(),
      budgets: BUDGETS,
      metrics: {
        generationTime: {
          p50: data.metrics.http_req_duration.values.p50,
          p95: data.metrics.http_req_duration.values.p95,
          p99: data.metrics.http_req_duration.values.p99,
        },
        errorRate: data.metrics.http_req_failed.values.rate,
      },
      passed: data.metrics.http_req_duration.values.p95 < BUDGETS.generationTime &&
              data.metrics.http_req_failed.values.rate < BUDGETS.errorRate,
    }, null, 2),
  };
}

function textSummary(data, options) {
  // Simple text summary
  return `
Performance Budget Test Results
===============================
Generation Time (p95): ${data.metrics.http_req_duration.values.p95}ms
Budget: ${BUDGETS.generationTime}ms
Status: ${data.metrics.http_req_duration.values.p95 < BUDGETS.generationTime ? 'PASS' : 'FAIL'}

Error Rate: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%
Budget: ${(BUDGETS.errorRate * 100).toFixed(2)}%
Status: ${data.metrics.http_req_failed.values.rate < BUDGETS.errorRate ? 'PASS' : 'FAIL'}
`;
}

