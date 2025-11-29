'use client';

import React, { useState } from 'react';
import { Gamepad2, Network, Settings, Layers, Code2 } from 'lucide-react';

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
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodeCategories = [
    {
      name: 'Events',
      nodes: ['OnStart', 'OnUpdate', 'OnClick', 'OnCollision'],
      icon: Code2,
    },
    {
      name: 'Variables',
      nodes: ['GetVariable', 'SetVariable', 'LocalVariable'],
      icon: Layers,
    },
    {
      name: 'Logic',
      nodes: ['If', 'Switch', 'ForLoop', 'WhileLoop'],
      icon: Network,
    },
    {
      name: 'Unity',
      nodes: ['Transform', 'Rigidbody', 'Collider', 'Renderer'],
      icon: Gamepad2,
    },
  ];

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-waypoint-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-waypoint-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10">
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
              Create Unity WebGL applications using a visual graph editor. No coding required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 rounded-lg bg-gradient-waypoint font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2 mx-auto">
                <Code2 className="w-5 h-5" />
                Open Graph Editor
              </button>
              <button className="px-8 py-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 font-semibold text-text-primary transition-all duration-300 hover:bg-white/10">
                View Examples
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Network className="w-6 h-6 text-waypoint-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Graph Editor</h2>
            </div>

            <div className="glass-container p-8 min-h-[400px]">
              <div className="text-center py-20">
                <Gamepad2 className="w-16 h-16 text-waypoint-primary mx-auto mb-4 opacity-50" />
                <p className="text-text-secondary mb-2">Graph Editor Canvas</p>
                <p className="text-sm text-text-tertiary">
                  Visual scripting interface will be rendered here
                </p>
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
                <div key={category.name} className="glass-container p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-waypoint-primary/10 border border-waypoint-primary/20">
                      <category.icon className="w-5 h-5 text-waypoint-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">{category.name}</h3>
                  </div>

                  <div className="space-y-2">
                    {category.nodes.map((node) => (
                      <button
                        key={node}
                        onClick={() => setSelectedNode(node)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedNode === node
                            ? 'bg-waypoint-primary/20 border border-waypoint-primary/30 text-waypoint-primary'
                            : 'bg-white/5 border border-white/5 text-text-secondary hover:bg-white/10'
                        }`}
                      >
                        {node}
                      </button>
                    ))}
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
