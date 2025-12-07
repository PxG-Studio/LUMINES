import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * k6 Smoke Test - Baseline Performance
 * 
 * Tests basic functionality with minimal load
 * Goal: Verify system works under normal conditions
 */
export const options = {
  stages: [
    { duration: '1m', target: 5 },   // Ramp up to 5 users
    { duration: '2m', target: 5 },   // Stay at 5 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests < 2s
    http_req_failed: ['rate<0.01'],    // < 1% errors
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test health check endpoint if available
  let res = http.get(`${BASE_URL}/api/health`);
  check(res, {
    'health check status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // Test generation endpoint
  res = http.post(
    `${BASE_URL}/api/spark/generate`,
    JSON.stringify({
      prompt: 'Create a simple Unity script',
      provider: 'claude',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(res, {
    'generation status is 200 or 202': (r) => r.status === 200 || r.status === 202,
    'generation response time < 5s': (r) => r.timings.duration < 5000,
  });

  sleep(2);
}

