import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * k6 Stress Test - Find System Limits
 * 
 * Gradually increases load to find breaking point
 * Goal: Identify maximum capacity
 */
export const options = {
  stages: [
    { duration: '2m', target: 10 },  // Ramp up to 10 users
    { duration: '3m', target: 20 },  // Ramp up to 20 users
    { duration: '3m', target: 30 },  // Ramp up to 30 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 95% of requests < 5s
    http_req_failed: ['rate<0.05'],     // < 5% errors
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test generation endpoint with varying prompts
  const prompts = [
    'Create a Unity PlayerController',
    'Create a Unity GameManager',
    'Create a Unity HealthSystem',
  ];
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  const res = http.post(
    `${BASE_URL}/api/spark/generate`,
    JSON.stringify({
      prompt,
      provider: Math.random() > 0.5 ? 'claude' : 'openai',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: '10s',
    }
  );

  check(res, {
    'request successful': (r) => r.status === 200 || r.status === 202,
    'response time acceptable': (r) => r.timings.duration < 10000,
  });

  sleep(1);
}

