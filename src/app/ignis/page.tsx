'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, Code, Server, Play, Terminal, Database, Activity, Clock, TrendingUp, Copy, CheckCircle2, Zap, Shield } from 'lucide-react';
import { Navigation } from '@/components/wissil/Navigation';

/**
 * IGNIS — Runtime Engine
 *
 * WebContainer-powered execution environment with instant hot reload.
 * Instant code execution, full NPM ecosystem support, and browser-native runtime.
 *
 * Domain: ignis.lumenforge.io
 * Network: HELIOS-CN (192.168.86.115)
 * Port: 3001
 * Integration: SPARK (IDE integration), NERVA (Runtime telemetry), LUMENFORGE (Build orchestration), GRAVIA (Safety checkpoints)
 */
export default function IgnisPage() {
  const [activeView, setActiveView] = useState('api');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<number | null>(null);

  const apiEndpoints = [
    { method: 'GET', path: '/api/runtime/status', description: 'Get runtime status', example: 'curl https://ignis.lumenforge.io/api/runtime/status' },
    { method: 'POST', path: '/api/runtime/execute', description: 'Execute code', example: 'curl -X POST https://ignis.lumenforge.io/api/runtime/execute -d \'{"code": "console.log(\\"Hello\\")"}\'' },
    { method: 'GET', path: '/api/packages', description: 'List available packages', example: 'curl https://ignis.lumenforge.io/api/packages' },
    { method: 'POST', path: '/api/webcontainer/start', description: 'Start WebContainer', example: 'curl -X POST https://ignis.lumenforge.io/api/webcontainer/start' },
    { method: 'GET', path: '/api/webcontainer/status', description: 'Get WebContainer status', example: 'curl https://ignis.lumenforge.io/api/webcontainer/status' },
    { method: 'POST', path: '/api/packages/install', description: 'Install package', example: 'curl -X POST https://ignis.lumenforge.io/api/packages/install -d \'{"name": "react"}\'' },
  ];

  const runtimeStatus = {
    status: 'running',
    uptime: '2h 34m',
    requests: 1247,
    memory: '256 MB',
    cpu: '12%',
    activeContainers: 3,
    totalPackages: 1247,
  };

  const handleCopy = (endpoint: string, index: number) => {
    navigator.clipboard.writeText(endpoint);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      <Navigation />
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-ignis-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-ignis-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 pt-16">
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-ignis-primary/30 mb-8">
              <Flame className="w-4 h-4 text-ignis-primary" />
              <span className="text-sm font-medium text-text-secondary">Runtime Engine</span>
            </div>

            <h1 className="text-6xl sm:text-7xl font-bold mb-6 text-gradient-ignis">
              IGNIS
            </h1>

            <p className="text-xl text-text-secondary mb-4 leading-relaxed">
              Instant Code Execution in Your Browser
            </p>

            <p className="text-lg text-text-tertiary mb-12 max-w-2xl mx-auto">
              Run code instantly in your browser. Zero-config setup with full Node.js compatibility and real-time error reporting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ignis#playground"
                className="group px-8 py-4 rounded-lg bg-gradient-ignis font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                Run Code Now
              </Link>
              <button
                onClick={() => {
                  setActiveView('api');
                  document.getElementById('api-docs')?.scrollIntoView({ behavior: 'smooth' });
                }}
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
              <h2 className="text-3xl font-bold text-text-primary">Game Runtime Status</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="glass-container p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-text-tertiary" />
                  <div className="text-xs font-medium text-text-secondary">Status</div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-xl font-bold text-green-400 capitalize">{runtimeStatus.status}</div>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>

              <div className="glass-container p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-text-tertiary" />
                  <div className="text-xs font-medium text-text-secondary">Uptime</div>
                </div>
                <div className="text-xl font-bold text-text-primary">{runtimeStatus.uptime}</div>
              </div>

              <div className="glass-container p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-text-tertiary" />
                  <div className="text-xs font-medium text-text-secondary">Requests</div>
                </div>
                <div className="text-xl font-bold text-text-primary">{runtimeStatus.requests.toLocaleString()}</div>
              </div>

              <div className="glass-container p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-text-tertiary" />
                  <div className="text-xs font-medium text-text-secondary">Memory</div>
                </div>
                <div className="text-xl font-bold text-text-primary">{runtimeStatus.memory}</div>
              </div>

              <div className="glass-container p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-text-tertiary" />
                  <div className="text-xs font-medium text-text-secondary">Containers</div>
                </div>
                <div className="text-xl font-bold text-text-primary">{runtimeStatus.activeContainers}</div>
              </div>

              <div className="glass-container p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-text-tertiary" />
                  <div className="text-xs font-medium text-text-secondary">Packages</div>
                </div>
                <div className="text-xl font-bold text-text-primary">{runtimeStatus.totalPackages.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-text-primary">
                Runtime Features
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Everything you need for instant code execution
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-ignis-primary/10 border border-ignis-primary/20 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-ignis-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Instant Execution</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Run code instantly in your browser with WebContainers
                </p>
              </div>
              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-ignis-primary/10 border border-ignis-primary/20 flex items-center justify-center mb-4">
                  <Flame className="w-6 h-6 text-ignis-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Hot Module Replacement</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  See changes instantly with sub-200ms hot reload
                </p>
              </div>
              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-ignis-primary/10 border border-ignis-primary/20 flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-ignis-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Full NPM Ecosystem</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Access the entire NPM package registry
                </p>
              </div>
              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-ignis-primary/10 border border-ignis-primary/20 flex items-center justify-center mb-4">
                  <Terminal className="w-6 h-6 text-ignis-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Browser-Native</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  No server required - runs entirely in the browser
                </p>
              </div>
              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-ignis-primary/10 border border-ignis-primary/20 flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-ignis-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Full Node.js Compatibility</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Complete Node.js API support and file system emulation
                </p>
              </div>
              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-ignis-primary/10 border border-ignis-primary/20 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-ignis-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Comprehensive Debugging</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Real-time error reporting and debugging tools
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* API Documentation */}
        <section id="api-docs" className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Code className="w-6 h-6 text-ignis-primary" />
              <h2 className="text-3xl font-bold text-text-primary">API Documentation</h2>
            </div>

            <div className="glass-container p-6">
              <div className="space-y-3">
                {apiEndpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedEndpoint(selectedEndpoint === index ? null : index)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedEndpoint === index
                        ? 'bg-ignis-primary/10 border-ignis-primary/30'
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`px-3 py-1 rounded text-xs font-bold flex-shrink-0 ${
                        endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {endpoint.method}
                      </div>
                      <div className="flex-1 min-w-0">
                        <code className="text-sm font-mono text-text-primary block mb-1 break-all">{endpoint.path}</code>
                        <p className="text-sm text-text-secondary mb-2">{endpoint.description}</p>
                        {selectedEndpoint === index && endpoint.example && (
                          <div className="mt-3 p-3 rounded bg-background-secondary border border-border-primary">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-text-tertiary">Example:</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(endpoint.example!, index);
                                }}
                                className="p-1 rounded hover:bg-white/5 transition-colors"
                              >
                                {copiedEndpoint === endpoint.example ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-text-tertiary" />
                                )}
                              </button>
                            </div>
                            <code className="text-xs font-mono text-text-secondary break-all block">{endpoint.example}</code>
                          </div>
                        )}
                      </div>
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
                  <h3 className="text-lg font-bold text-text-primary mb-2">WebContainer Runtime</h3>
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

        {/* Integration Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-text-primary">
                Works With
              </h2>
              <p className="text-lg text-text-secondary">
                Seamlessly integrated with the LumenStack ecosystem
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/spark" className="glass-container p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="w-16 h-16 rounded-lg bg-ignis-primary/10 border border-ignis-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-ignis-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">SPARK</h3>
                <p className="text-sm text-text-secondary">IDE integration</p>
              </Link>
              <Link href="/nerva" className="glass-container p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="w-16 h-16 rounded-lg bg-ignis-primary/10 border border-ignis-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Terminal className="w-8 h-8 text-ignis-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">NERVA</h3>
                <p className="text-sm text-text-secondary">Runtime telemetry</p>
              </Link>
              <div className="glass-container p-6 text-center">
                <div className="w-16 h-16 rounded-lg bg-ignis-primary/10 border border-ignis-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-ignis-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">LUMENFORGE</h3>
                <p className="text-sm text-text-secondary">Build orchestration</p>
              </div>
              <div className="glass-container p-6 text-center">
                <div className="w-16 h-16 rounded-lg bg-ignis-primary/10 border border-ignis-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-ignis-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">GRAVIA</h3>
                <p className="text-sm text-text-secondary">Safety checkpoints</p>
              </div>
            </div>
          </div>
        </section>

        {/* Code Execution Demo */}
        <section id="playground" className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-text-primary">
                Code Execution Preview
              </h2>
              <p className="text-lg text-text-secondary">
                See your code run instantly in the browser
              </p>
            </div>
            <div className="glass-container p-0 overflow-hidden">
              <div className="bg-background-secondary px-4 py-3 border-b border-border-primary flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-ignis-primary" />
                  <span className="text-sm font-medium text-text-primary">Terminal Output</span>
                </div>
                <button className="px-3 py-1 rounded bg-ignis-primary/10 border border-ignis-primary/20 text-ignis-primary text-xs hover:bg-ignis-primary/20 transition-colors">
                  Run Code
                </button>
              </div>
              <div className="p-6 bg-background-primary font-mono text-sm">
                <div className="text-green-400 mb-2">$ npm install react</div>
                <div className="text-text-secondary mb-4">added 1247 packages in 2.3s</div>
                <div className="text-green-400 mb-2">$ node index.js</div>
                <div className="text-text-primary">Hello from IGNIS Runtime!</div>
                <div className="text-text-tertiary mt-4">Code executed successfully in 0.12s</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="glass-container p-12 text-center bg-gradient-to-br from-ignis-primary/10 to-ignis-secondary/10 border-ignis-primary/30">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-text-primary">
                Ready to Run Code Instantly?
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                Experience zero-config code execution with full Node.js compatibility. No server required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ignis#playground"
                  className="group px-8 py-4 rounded-lg bg-gradient-ignis font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Run Code Now
                </Link>
                <Link
                  href="/ignis#api-docs"
                  className="px-8 py-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 font-semibold text-text-primary transition-all duration-300 hover:bg-white/10"
                >
                  Read Documentation
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
