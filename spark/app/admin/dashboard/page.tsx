/**
 * Admin Dashboard
 * 
 * Administrative dashboard for monitoring and management
 */

'use client';

import { useState, useEffect } from 'react';
import { getAnalyticsTracker } from '@/lib/analytics/tracker';
import { getCostTracker } from '@/lib/analytics/cost-tracker';
import { getPerformanceMonitor } from '@/lib/performance/budgets';
import { getConnectionPool } from '@/lib/ai/connection-pool';
import { getAIQueue } from '@/lib/ai/queue';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = () => {
      const tracker = getAnalyticsTracker();
      const costTracker = getCostTracker();
      const perfMonitor = getPerformanceMonitor();
      const connectionPool = getConnectionPool();
      const queue = getAIQueue();

      const analyticsMetrics = tracker.getMetrics();
      const costMetrics = costTracker.getMetrics();
      const optimization = costTracker.getOptimizationRecommendations();
      const perfSummary = perfMonitor.getSummary();
      const healthStatus = {
        claude: connectionPool.getHealth('claude'),
        openai: connectionPool.getHealth('openai'),
      };
      const queueStatus = queue.getStatus();

      setMetrics({
        analytics: analyticsMetrics,
        costs: costMetrics,
        optimization,
        performance: perfSummary,
        health: healthStatus,
        queue: queueStatus,
      });
      setLoading(false);
    };

    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Analytics Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Usage Analytics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Generations</p>
            <p className="text-2xl font-bold">{metrics.analytics.totalGenerations}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Tokens</p>
            <p className="text-2xl font-bold">{metrics.analytics.totalTokensUsed.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Avg Generation Time</p>
            <p className="text-2xl font-bold">{Math.round(metrics.analytics.averageGenerationTime)}ms</p>
          </div>
        </div>
      </section>

      {/* Cost Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Cost Tracking</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Cost</p>
            <p className="text-2xl font-bold">${metrics.costs.totalCost.toFixed(4)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Est. Monthly Cost</p>
            <p className="text-2xl font-bold">${metrics.optimization.estimatedMonthlyCost.toFixed(2)}</p>
          </div>
        </div>
        {metrics.optimization.recommendations.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">Optimization Recommendations:</p>
            <ul className="list-disc list-inside space-y-1">
              {metrics.optimization.recommendations.map((rec: string, i: number) => (
                <li key={i} className="text-sm text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Performance Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Performance</h2>
        <div className="space-y-2">
          {Object.entries(metrics.performance.metrics || {}).map(([metric, stats]: [string, any]) => (
            <div key={metric} className="border-b pb-2">
              <p className="font-semibold">{metric}</p>
              <p className="text-sm text-gray-600">
                p95: {stats.p95?.toFixed(2)}ms | p99: {stats.p99?.toFixed(2)}ms
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Health Status */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">System Health</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Claude</p>
            <p className={`text-lg font-semibold ${metrics.health.claude?.healthy ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.health.claude?.healthy ? 'Healthy' : 'Unhealthy'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">OpenAI</p>
            <p className={`text-lg font-semibold ${metrics.health.openai?.healthy ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.health.openai?.healthy ? 'Healthy' : 'Unhealthy'}
            </p>
          </div>
        </div>
      </section>

      {/* Queue Status */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Request Queue</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Queue Length</p>
            <p className="text-2xl font-bold">{metrics.queue.queueLength}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Requests</p>
            <p className="text-2xl font-bold">{metrics.queue.activeCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Processing</p>
            <p className={`text-lg font-semibold ${metrics.queue.processing ? 'text-green-600' : 'text-gray-600'}`}>
              {metrics.queue.processing ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

