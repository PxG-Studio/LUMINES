"use client";

import { useState, useEffect } from "react";

interface UsageStatsData {
  totalGenerations: number;
  successfulGenerations: number;
  failedGenerations: number;
  claudeGenerations: number;
  openaiGenerations: number;
  totalTokensUsed: number;
  avgGenerationTimeMs: number;
}

export default function UsageStats() {
  const [stats, setStats] = useState<UsageStatsData>({
    totalGenerations: 0,
    successfulGenerations: 0,
    failedGenerations: 0,
    claudeGenerations: 0,
    openaiGenerations: 0,
    totalTokensUsed: 0,
    avgGenerationTimeMs: 0,
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    try {
      const history = localStorage.getItem('spark_generation_history');
      if (history) {
        const items = JSON.parse(history);

        const claudeCount = items.filter((i: any) => i.provider === 'claude').length;
        const openaiCount = items.filter((i: any) => i.provider === 'openai').length;
        const successCount = items.filter((i: any) => i.success).length;
        const failedCount = items.filter((i: any) => !i.success).length;

        setStats({
          totalGenerations: items.length,
          successfulGenerations: successCount,
          failedGenerations: failedCount,
          claudeGenerations: claudeCount,
          openaiGenerations: openaiCount,
          totalTokensUsed: 0,
          avgGenerationTimeMs: 0,
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const successRate = stats.totalGenerations > 0
    ? Math.round((stats.successfulGenerations / stats.totalGenerations) * 100)
    : 0;

  return (
    <>
      <button
        onClick={() => {
          loadStats();
          setIsOpen(!isOpen);
        }}
        className="stats-toggle"
        aria-label="View usage statistics"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 17V7M10 17V3M17 17V11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="stats-modal">
          <div className="stats-backdrop" onClick={() => setIsOpen(false)} />
          <div className="stats-panel">
            <div className="stats-header">
              <h2 className="stats-title">Usage Statistics</h2>
              <button onClick={() => setIsOpen(false)} className="stats-close">
                ×
              </button>
            </div>

            <div className="stats-content">
              <div className="stat-card">
                <div className="stat-label">Total Generations</div>
                <div className="stat-value">{stats.totalGenerations}</div>
              </div>

              <div className="stat-card success">
                <div className="stat-label">Successful</div>
                <div className="stat-value">{stats.successfulGenerations}</div>
              </div>

              <div className="stat-card error">
                <div className="stat-label">Failed</div>
                <div className="stat-value">{stats.failedGenerations}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Success Rate</div>
                <div className="stat-value">{successRate}%</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Claude Generations</div>
                <div className="stat-value">{stats.claudeGenerations}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">OpenAI Generations</div>
                <div className="stat-value">{stats.openaiGenerations}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
