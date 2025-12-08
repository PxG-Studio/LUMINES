/**
 * Load Testing Script for SPARK
 * 
 * Tests SPARK endpoints under various load conditions
 */

import { performance } from 'perf_hooks';

interface LoadTestConfig {
  baseUrl: string;
  apiKey?: string;
  concurrency: number;
  requests: number;
  endpoint: string;
  method: 'GET' | 'POST';
  body?: any;
}

interface LoadTestResult {
  totalRequests: number;
  successful: number;
  failed: number;
  duration: number;
  requestsPerSecond: number;
  averageLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  errors: Array<{ status: number; message: string; count: number }>;
}

/**
 * Run a single request
 */
async function runRequest(config: LoadTestConfig): Promise<{ success: boolean; latency: number; status: number; error?: string }> {
  const start = performance.now();
  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (config.apiKey) {
      headers['X-API-Key'] = config.apiKey;
    }

    const options: RequestInit = {
      method: config.method,
      headers,
    };

    if (config.body && config.method === 'POST') {
      options.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${config.baseUrl}${config.endpoint}`, options);
    const latency = performance.now() - start;
    const success = response.ok;

    let error: string | undefined;
    if (!success) {
      try {
        const errorBody = await response.text();
        error = errorBody;
      } catch {
        error = `HTTP ${response.status}`;
      }
    }

    return {
      success,
      latency,
      status: response.status,
      error,
    };
  } catch (error) {
    const latency = performance.now() - start;
    return {
      success: false,
      latency,
      status: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Run load test
 */
async function runLoadTest(config: LoadTestConfig): Promise<LoadTestResult> {
  const startTime = performance.now();
  const latencies: number[] = [];
  const errors: Map<string, { status: number; message: string; count: number }> = new Map();
  let successful = 0;
  let failed = 0;

  // Create worker pool
  const workers: Promise<void>[] = [];
  const requestsPerWorker = Math.ceil(config.requests / config.concurrency);

  for (let i = 0; i < config.concurrency; i++) {
    workers.push(
      (async () => {
        for (let j = 0; j < requestsPerWorker; j++) {
          const result = await runRequest(config);
          latencies.push(result.latency);

          if (result.success) {
            successful++;
          } else {
            failed++;
            const errorKey = `${result.status}:${result.error || 'Unknown'}`;
            const existing = errors.get(errorKey);
            if (existing) {
              existing.count++;
            } else {
              errors.set(errorKey, {
                status: result.status,
                message: result.error || 'Unknown error',
                count: 1,
              });
            }
          }
        }
      })()
    );
  }

  await Promise.all(workers);

  const endTime = performance.now();
  const duration = endTime - startTime;
  const sortedLatencies = [...latencies].sort((a, b) => a - b);

  return {
    totalRequests: config.requests,
    successful,
    failed,
    duration,
    requestsPerSecond: (config.requests / duration) * 1000,
    averageLatency: latencies.reduce((a, b) => a + b, 0) / latencies.length,
    p50Latency: sortedLatencies[Math.floor(sortedLatencies.length * 0.5)] || 0,
    p95Latency: sortedLatencies[Math.floor(sortedLatencies.length * 0.95)] || 0,
    p99Latency: sortedLatencies[Math.floor(sortedLatencies.length * 0.99)] || 0,
    errors: Array.from(errors.values()),
  };
}

/**
 * Print load test results
 */
function printResults(result: LoadTestResult, testName: string): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Load Test: ${testName}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total Requests: ${result.totalRequests}`);
  console.log(`Successful: ${result.successful} (${((result.successful / result.totalRequests) * 100).toFixed(2)}%)`);
  console.log(`Failed: ${result.failed} (${((result.failed / result.totalRequests) * 100).toFixed(2)}%)`);
  console.log(`Duration: ${(result.duration / 1000).toFixed(2)}s`);
  console.log(`Requests/Second: ${result.requestsPerSecond.toFixed(2)}`);
  console.log(`\nLatency:`);
  console.log(`  Average: ${result.averageLatency.toFixed(2)}ms`);
  console.log(`  P50: ${result.p50Latency.toFixed(2)}ms`);
  console.log(`  P95: ${result.p95Latency.toFixed(2)}ms`);
  console.log(`  P99: ${result.p99Latency.toFixed(2)}ms`);
  
  if (result.errors.length > 0) {
    console.log(`\nErrors:`);
    result.errors.forEach(err => {
      console.log(`  ${err.status}: ${err.message} (${err.count}x)`);
    });
  }
  console.log(`${'='.repeat(60)}\n`);
}

/**
 * Main load test function
 */
async function main() {
  const baseUrl = process.env.SPARK_BASE_URL || 'http://localhost:3000';
  const apiKey = process.env.SPARK_API_KEY;

  console.log('Starting SPARK Load Tests...');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`API Key: ${apiKey ? 'Configured' : 'Not configured'}\n`);

  // Test 1: Health Check (Low Load)
  console.log('Test 1: Health Check (10 requests, 2 concurrent)');
  const healthResult = await runLoadTest({
    baseUrl,
    apiKey,
    concurrency: 2,
    requests: 10,
    endpoint: '/api/spark/health',
    method: 'GET',
  });
  printResults(healthResult, 'Health Check');

  // Test 2: Metrics Endpoint (Medium Load)
  console.log('Test 2: Metrics Endpoint (50 requests, 5 concurrent)');
  const metricsResult = await runLoadTest({
    baseUrl,
    apiKey,
    concurrency: 5,
    requests: 50,
    endpoint: '/api/metrics',
    method: 'GET',
  });
  printResults(metricsResult, 'Metrics Endpoint');

  // Test 3: Generation Endpoint (High Load)
  if (apiKey) {
    console.log('Test 3: Generation Endpoint (20 requests, 3 concurrent)');
    const generateResult = await runLoadTest({
      baseUrl,
      apiKey,
      concurrency: 3,
      requests: 20,
      endpoint: '/api/spark/generate',
      method: 'POST',
      body: {
        prompt: 'Create a Unity player controller with WASD movement',
        provider: 'claude',
      },
    });
    printResults(generateResult, 'Generation Endpoint');
  } else {
    console.log('Skipping Generation Endpoint test (API key not configured)');
  }

  // Test 4: Rate Limiting (Verify limits work)
  console.log('Test 4: Rate Limiting (100 requests, 10 concurrent)');
  const rateLimitResult = await runLoadTest({
    baseUrl,
    apiKey,
    concurrency: 10,
    requests: 100,
    endpoint: '/api/spark/health',
    method: 'GET',
  });
  printResults(rateLimitResult, 'Rate Limiting Test');

  console.log('Load tests completed!');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { runLoadTest, printResults };

