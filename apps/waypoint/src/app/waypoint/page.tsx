'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Gamepad2, Network, Settings, Layers, Code2, Play, Download, Share2, Zap, CheckCircle2 } from 'lucide-react';
import { Navigation } from '@/components/wissil/Navigation';
import { Button } from '@/design-system/primitives/Button';

/**
 * WAYPOINT - Unity Visual Scripting
 *
 * Visual node-based programming interface for Unity WebGL.
 * Graph editor, node inspector, and node registry.
 *
 * Domain: waypoint.lumenforge.io
 * Network: Helios Compute (192.168.86.115)
 * Port: 3006
 * Integration: NEC (Unity Runtime) for Unity WebGL execution
 */
export default function WaypointPage() {
  const router = useRouter();

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [graphStats, setGraphStats] = useState({ nodes: 12, connections: 18, complexity: 'Medium' });

  const nodeCategories = [
    {
      name: 'Events',
      nodes: ['OnStart', 'OnUpdate', 'OnClick', 'OnCollision', 'OnTrigger', 'OnDestroy'],
      icon: Code2,
      color: 'waypoint-primary',
    },
    {
      name: 'Variables',
      nodes: ['GetVariable', 'SetVariable', 'LocalVariable', 'GlobalVariable', 'ArrayVariable'],
      icon: Layers,
      color: 'waypoint-secondary',
    },
    {
      name: 'Logic',
      nodes: ['If', 'Switch', 'ForLoop', 'WhileLoop', 'Break', 'Continue'],
      icon: Network,
      color: 'waypoint-accent',
    },
    {
      name: 'Unity',
      nodes: ['Transform', 'Rigidbody', 'Collider', 'Renderer', 'AudioSource', 'Animator'],
      icon: Gamepad2,
      color: 'waypoint-primary',
    },
  ];

  const recentGraphs = [
    { name: 'Player Movement', nodes: 8, lastModified: '2 hours ago' },
    { name: 'Enemy AI', nodes: 15, lastModified: '1 day ago' },
    { name: 'UI System', nodes: 6, lastModified: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      <Navigation />
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-waypoint-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-waypoint-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 pt-16">
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-waypoint-primary/30 mb-8">
              <Gamepad2 className="w-4 h-4 text-waypoint-primary" />
              <span className="text-sm font-medium text-text-secondary">Unity Visual Scripting</span>
            </div>

            <h1 className="text-6xl sm:text-7xl font-bold mb-6 text-gradient-waypoint">
              WAYPOINT
            </h1>

            <p className="text-xl text-text-secondary mb-4 leading-relaxed">
              Visual Node-Based Programming for Unity
            </p>

            <p className="text-lg text-text-tertiary mb-12 max-w-2xl mx-auto">
              Create game logic visually with a powerful node-based editor. Connect nodes, define behaviors, and see your game come to life.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="accent"
                style={{ fontSize: '16px', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <>
                    <Settings style={{ width: '20px', height: '20px' }} />
                    Stop Execution
                  </>
                ) : (
                  <>
                    <Play style={{ width: '20px', height: '20px' }} />
                    Run Graph
                  </>
                )}
              </Button>
              <Button
                variant="default"
                style={{ fontSize: '16px', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => {
                  // Export functionality
                  console.log('Exporting graph...');
                }}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  // Share functionality
                  if (navigator.share) {
                    navigator.share({
                      title: 'WAYPOINT Graph',
                      text: 'Check out my Unity visual script!',
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="px-8 py-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 font-semibold text-text-primary transition-all duration-300 hover:bg-white/10 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </section>

        {/* Graph Stats */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-container p-4">
                <div className="text-sm text-text-secondary mb-1">Nodes</div>
                <div className="text-2xl font-bold text-waypoint-primary">{graphStats.nodes}</div>
              </div>
              <div className="glass-container p-4">
                <div className="text-sm text-text-secondary mb-1">Connections</div>
                <div className="text-2xl font-bold text-waypoint-secondary">{graphStats.connections}</div>
              </div>
              <div className="glass-container p-4">
                <div className="text-sm text-text-secondary mb-1">Complexity</div>
                <div className="text-2xl font-bold text-waypoint-accent">{graphStats.complexity}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Network className="w-6 h-6 text-waypoint-primary" />
                <h2 className="text-3xl font-bold text-text-primary">Graph Editor</h2>
              </div>
              {isPlaying && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-green-400 font-medium">Running</span>
                </div>
              )}
            </div>

            <div className="glass-container p-8 min-h-[500px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-waypoint-primary/5 to-transparent" />
              <div className="relative text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-waypoint-primary/10 border border-waypoint-primary/20 mb-6">
                  <Gamepad2 className="w-12 h-12 text-waypoint-primary opacity-50" />
                </div>
                <p className="text-text-secondary mb-2 text-lg font-semibold">Graph Editor Canvas</p>
                <p className="text-sm text-text-tertiary mb-6 max-w-md mx-auto">
                  Visual scripting interface with node-based programming. Connect nodes to create Unity behaviors.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Drag & Drop Nodes', 'Real-time Preview', 'Unity Integration', 'Export to Unity'].map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-waypoint-primary/10 border border-waypoint-primary/20 text-waypoint-primary"
                    >
                      <CheckCircle2 className="w-3 h-3 inline mr-1" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Node Registry */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Layers className="w-6 h-6 text-waypoint-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Node Registry</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nodeCategories.map((category) => (
                <div key={category.name} className="glass-container p-6 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-waypoint-primary/10 border border-waypoint-primary/20">
                      <category.icon className="w-5 h-5 text-waypoint-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">{category.name}</h3>
                    <span className="ml-auto px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-text-tertiary">
                      {category.nodes.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {category.nodes.map((node) => (
                      <button
                        key={node}
                        onClick={() => setSelectedNode(node)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                          selectedNode === node
                            ? 'bg-waypoint-primary/20 border border-waypoint-primary/30 text-waypoint-primary'
                            : 'bg-white/5 border border-white/5 text-text-secondary hover:bg-white/10'
                        }`}
                      >
                        <span>{node}</span>
                        {selectedNode === node && (
                          <CheckCircle2 className="w-4 h-4 text-waypoint-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Graphs */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Layers className="w-6 h-6 text-waypoint-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Recent Graphs</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentGraphs.map((graph, idx) => (
                <div key={idx} className="glass-container p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary mb-1">{graph.name}</h3>
                      <p className="text-sm text-text-tertiary">{graph.nodes} nodes</p>
                    </div>
                    <Zap className="w-5 h-5 text-waypoint-primary" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>{graph.lastModified}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Opening graph:', graph.name);
                        setSelectedNode(null);
                        setIsPlaying(false);
                        alert(`Opening ${graph.name}...`);
                      }}
                      className="px-3 py-1 rounded bg-waypoint-primary/10 border border-waypoint-primary/20 text-waypoint-primary hover:bg-waypoint-primary/20 transition-colors"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Info */}
        <section className="container mx-auto px-4 py-12 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="glass-container p-6">
              <div className="flex items-start gap-4">
                <Settings className="w-5 h-5 text-waypoint-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">Unity Integration</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-3">
                    WAYPOINT integrates with NEC (Unity Runtime) to execute Unity WebGL applications.
                    Visual scripts are compiled and run in real-time within the browser.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <span className="px-2 py-1 rounded bg-waypoint-primary/10 border border-waypoint-primary/20 text-waypoint-primary">
                      NEC Integration
                    </span>
                    <span className="px-2 py-1 rounded bg-waypoint-primary/10 border border-waypoint-primary/20 text-waypoint-primary">
                      WebSocket
                    </span>
                    <span className="px-2 py-1 rounded bg-waypoint-primary/10 border border-waypoint-primary/20 text-waypoint-primary">
                      Unity WebGL
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
