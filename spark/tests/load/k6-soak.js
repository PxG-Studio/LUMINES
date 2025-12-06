import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * k6 Soak Test - Long-term Stability
 * 
 * Runs for extended period to find memory leaks and stability issues
 * Goal: Verify system stability over 24 hours
 */
export const options = {
  stages: [
    { duration: '5m', target: 10 },   // Ramp up
    { duration: '2h', target: 10 },  // Stay at 10 users for 2 hours
    { duration: '5m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.02'],
    // Memory and CPU thresholds would be set via external monitoring
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Periodic health check
  let res = http.get(`${BASE_URL}/api/health`);
  check(res, {
    'health check OK': (r) => r.status === 200,
  });

  sleep(5);

  // Occasional generation requests
  if (Math.random() > 0.7) {
    res = http.post(
      `${BASE_URL}/api/spark/generate`,
      JSON.stringify({
        prompt: 'Create a Unity script',
        provider: 'claude',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    check(res, {
      'generation OK': (r) => r.status === 200 || r.status === 202,
    });
  }

  sleep(10);
}

