'use client';

import React, { useState } from 'react';
import { Zap, Code, Server, Play, Terminal, Database } from 'lucide-react';

/**
 * IGNIS - API Backend
 *
 * Runtime engine with WebContainer support, API documentation, and code execution.
 *
 * Domain: ignis.lumenforge.io
 * Network: Helios Control (192.168.86.114)
 * Port: 3001
 * Integration: WebContainer API, NPM package registry, Hot module replacement
 */
export default function IgnisPage() {
  const [activeView, setActiveView] = useState('api');

  const apiEndpoints = [
    { method: 'GET', path: '/api/runtime/status', description: 'Get runtime status' },
    { method: 'POST', path: '/api/runtime/execute', description: 'Execute code' },
    { method: 'GET', path: '/api/packages', description: 'List available packages' },
    { method: 'POST', path: '/api/webcontainer/start', description: 'Start WebContainer' },
  ];

  const runtimeStatus = {
    status: 'running',
    uptime: '2h 34m',
    requests: 1247,
    memory: '256 MB',
    cpu: '12%',
  };

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-ignis-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-ignis-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-ignis-primary/30 mb-8">
              <Zap className="w-4 h-4 text-ignis-primary" />
              <span className="text-sm font-medium text-text-secondary">API Backend</span>
            </div>

            <h1 className="text-6xl sm:text-7xl font-bold mb-6 text-gradient-ignis">
              IGNIS
            </h1>

            <p className="text-xl text-text-secondary mb-4 leading-relaxed">
              Runtime Engine & API Backend
            </p>

            <p className="text-lg text-text-tertiary mb-12 max-w-2xl mx-auto">
              Execute code, manage packages, and run WebContainers with our powerful runtime engine.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 rounded-lg bg-gradient-ignis font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2 mx-auto">
                <Play className="w-5 h-5" />
                Start Runtime
              </button>
              <button
                onClick={() => setActiveView('api')}
                className="px-8 py-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 font-semibold text-text-primary transition-all duration-300 hover:bg-white/10"
              >
                View API Docs
              </button>
            </div>
          </div>
        </section>

        {/* Runtime Status */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Server className="w-6 h-6 text-ignis-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Runtime Status</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-container p-6">
                <div className="text-sm font-medium text-text-secondary mb-2">Status</div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold text-green-400">{runtimeStatus.status}</div>
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>

              <div className="glass-container p-6">
                <div className="text-sm font-medium text-text-secondary mb-2">Uptime</div>
                <div className="text-2xl font-bold text-text-primary">{runtimeStatus.uptime}</div>
              </div>

              <div className="glass-container p-6">
                <div className="text-sm font-medium text-text-secondary mb-2">Requests</div>
                <div className="text-2xl font-bold text-text-primary">{runtimeStatus.requests.toLocaleString()}</div>
              </div>

              <div className="glass-container p-6">
                <div className="text-sm font-medium text-text-secondary mb-2">Memory</div>
                <div className="text-2xl font-bold text-text-primary">{runtimeStatus.memory}</div>
              </div>
            </div>
          </div>
        </section>

        {/* API Documentation */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Code className="w-6 h-6 text-ignis-primary" />
              <h2 className="text-3xl font-bold text-text-primary">API Documentation</h2>
            </div>

            <div className="glass-container p-6">
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/5">
                    <div className={`px-3 py-1 rounded text-xs font-bold ${
                      endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {endpoint.method}
                    </div>
                    <div className="flex-1">
                      <code className="text-sm font-mono text-text-primary">{endpoint.path}</code>
                      <p className="text-sm text-text-secondary mt-1">{endpoint.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WebContainer */}
        <section className="container mx-auto px-4 py-12 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Terminal className="w-6 h-6 text-ignis-primary" />
              <h2 className="text-3xl font-bold text-text-primary">WebContainer</h2>
            </div>

            <div className="glass-container p-6">
              <div className="flex items-start gap-4">
                <Database className="w-5 h-5 text-ignis-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">Container Runtime</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-3">
                    IGNIS provides WebContainer support for running Node.js applications directly in the browser.
                    Execute code, install packages, and run full applications without server infrastructure.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-ignis-primary/10 border border-ignis-primary/20 text-ignis-primary">
                      WebContainer API
                    </span>
                    <span className="px-2 py-1 rounded bg-ignis-primary/10 border border-ignis-primary/20 text-ignis-primary">
                      NPM Registry
                    </span>
                    <span className="px-2 py-1 rounded bg-ignis-primary/10 border border-ignis-primary/20 text-ignis-primary">
                      Hot Reload
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
