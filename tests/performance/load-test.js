/**
 * Load Testing Script
 * Performance testing using k6 or Artillery
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

// Configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% < 500ms, 99% < 1s
    http_req_failed: ['rate<0.01'], // Error rate < 1%
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

export default function () {
  // Test 1: Health check
  const healthRes = http.get(`${API_BASE}/health`);
  check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 200ms': (r) => r.timings.duration < 200,
  });
  errorRate.add(healthRes.status !== 200);
  responseTime.add(healthRes.timings.duration);
  sleep(1);

  // Test 2: Get templates (public endpoint)
  const templatesRes = http.get(`${API_BASE}/templates?limit=10`);
  check(templatesRes, {
    'templates status is 200': (r) => r.status === 200,
    'templates response time < 500ms': (r) => r.timings.duration < 500,
    'templates returns data': (r) => {
      try {
        const data = JSON.parse(r.body);
        return Array.isArray(data) || (data.data && Array.isArray(data.data));
      } catch {
        return false;
      }
    },
  });
  errorRate.add(templatesRes.status !== 200);
  responseTime.add(templatesRes.timings.duration);
  sleep(1);

  // Test 3: Get tokens (cached endpoint)
  const tokensRes = http.get(`${API_BASE}/tokens?category=colors`);
  check(tokensRes, {
    'tokens status is 200': (r) => r.status === 200,
    'tokens response time < 300ms': (r) => r.timings.duration < 300,
    'tokens has cache headers': (r) => r.headers['Cache-Control'] !== undefined,
  });
  errorRate.add(tokensRes.status !== 200);
  responseTime.add(tokensRes.timings.duration);
  sleep(1);
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'summary.json': JSON.stringify(data),
  };
}

