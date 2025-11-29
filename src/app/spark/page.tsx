'use client';

import React, { useState } from 'react';
import { Terminal, FileCode, Folder, Command, MessageSquare, LayoutDashboard } from 'lucide-react';

/**
 * SPARK - IDE Experience
 *
 * Full-featured integrated development environment with Monaco editor,
 * file tree, terminal, and AI assistant integration.
 *
 * Domain: spark.lumenforge.io
 * Network: Helios Compute (192.168.86.115)
 * Port: 3000
 * Integration: LUNA (AI Assistant), IGNIS (Code Execution), WebSocket HMR
 */
export default function SparkPage() {
  const [activeTab, setActiveTab] = useState('editor');

  const tabs = [
    { id: 'editor', label: 'Editor', icon: FileCode },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'ai-chat', label: 'AI Chat', icon: MessageSquare },
  ];

  const projects = [
    { name: 'my-app', language: 'TypeScript', lastModified: '2 hours ago' },
    { name: 'component-library', language: 'React', lastModified: '1 day ago' },
    { name: 'api-service', language: 'Node.js', lastModified: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-spark-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-spark-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-spark-primary/30 mb-8">
              <Terminal className="w-4 h-4 text-spark-primary" />
              <span className="text-sm font-medium text-text-secondary">IDE Experience</span>
            </div>

            <h1 className="text-6xl sm:text-7xl font-bold mb-6 text-gradient-spark">
              SPARK
            </h1>

            <p className="text-xl text-text-secondary mb-4 leading-relaxed">
              Full-Featured Code Editor
            </p>

            <p className="text-lg text-text-tertiary mb-12 max-w-2xl mx-auto">
              Monaco editor, file tree, terminal, and AI assistant in one powerful IDE.
            </p>

            <button className="group px-8 py-4 rounded-lg bg-gradient-spark font-semibold text-background-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2 mx-auto">
              <FileCode className="w-5 h-5" />
              Open Editor
            </button>
          </div>
        </section>

        {/* Tabs */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6 border-b border-border-primary">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-spark-primary text-spark-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Editor View */}
            {activeTab === 'editor' && (
              <div className="glass-container p-0 overflow-hidden">
                <div className="flex">
                  {/* File Tree */}
                  <div className="w-64 border-r border-border-primary bg-background-secondary p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Folder className="w-4 h-4 text-spark-primary" />
                      <span className="text-sm font-semibold text-text-primary">Files</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="px-2 py-1 rounded text-text-secondary hover:bg-white/5 cursor-pointer">
                        📁 src
                      </div>
                      <div className="px-2 py-1 pl-6 rounded text-text-secondary hover:bg-white/5 cursor-pointer">
                        📄 App.tsx
                      </div>
                      <div className="px-2 py-1 pl-6 rounded text-text-secondary hover:bg-white/5 cursor-pointer">
                        📄 index.ts
                      </div>
                    </div>
                  </div>

                  {/* Editor */}
                  <div className="flex-1">
                    <div className="h-96 bg-background-primary p-4">
                      <div className="text-sm font-mono text-text-secondary">
                        <div className="mb-2 text-text-tertiary">// Monaco Editor will be rendered here</div>
                        <div className="text-text-primary">function App() {'{'}</div>
                        <div className="pl-4 text-text-primary">  return &lt;div&gt;Hello SPARK&lt;/div&gt;</div>
                        <div className="text-text-primary">{'}'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.name} className="glass-container p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Folder className="w-5 h-5 text-spark-primary" />
                      <h3 className="text-lg font-bold text-text-primary">{project.name}</h3>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{project.language}</p>
                    <p className="text-xs text-text-tertiary">{project.lastModified}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Terminal View */}
            {activeTab === 'terminal' && (
              <div className="glass-container p-4 bg-background-secondary">
                <div className="font-mono text-sm">
                  <div className="text-text-tertiary mb-2">$ spark --version</div>
                  <div className="text-spark-primary">SPARK IDE v1.0.0</div>
                  <div className="text-text-tertiary mt-4">$ npm run dev</div>
                  <div className="text-text-secondary">Starting development server...</div>
                </div>
              </div>
            )}

            {/* AI Chat View */}
            {activeTab === 'ai-chat' && (
              <div className="glass-container p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-5 h-5 text-spark-primary" />
                  <h3 className="text-lg font-bold text-text-primary">LUNA AI Assistant</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-text-secondary">
                      Ask LUNA for help with your code, explanations, or debugging.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Integration Info */}
        <section className="container mx-auto px-4 py-12 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="glass-container p-6">
              <div className="flex items-start gap-4">
                <Command className="w-5 h-5 text-spark-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">IDE Features</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-3">
                    SPARK integrates with LUNA for AI assistance, IGNIS for code execution,
                    and provides WebSocket-based hot module replacement for instant feedback.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-spark-primary/10 border border-spark-primary/20 text-spark-primary">
                      Monaco Editor
                    </span>
                    <span className="px-2 py-1 rounded bg-spark-primary/10 border border-spark-primary/20 text-spark-primary">
                      LUNA AI
                    </span>
                    <span className="px-2 py-1 rounded bg-spark-primary/10 border border-spark-primary/20 text-spark-primary">
                      IGNIS Runtime
                    </span>
                    <span className="px-2 py-1 rounded bg-spark-primary/10 border border-spark-primary/20 text-spark-primary">
                      WebSocket HMR
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
