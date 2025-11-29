'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Code, Gamepad2, Terminal, Users, Zap, Rocket } from 'lucide-react';

/**
 * LANDING - Production Landing Page
 *
 * The main marketing landing page for LumenForge.io
 * Provides overview, quick links, and navigation to all WISSIL subsystems.
 *
 * Domain: lumenforge.io, www.lumenforge.io
 * Network: Helios Control (192.168.86.114)
 * Port: 3000
 * Auth: Public facing, nocturnaID integration via Cloudflare Zero Trust
 */
export default function LandingPage() {
  const systems = [
    {
      name: 'WAYPOINT',
      icon: Gamepad2,
      description: 'Unity Visual Scripting - Visual node-based programming for Unity',
      path: '/waypoint',
      domain: 'waypoint.lumenforge.io',
      color: 'waypoint',
      status: 'active',
    },
    {
      name: 'SPARK',
      icon: Terminal,
      description: 'IDE Experience - Full-featured code editor with Monaco',
      path: '/spark',
      domain: 'spark.lumenforge.io',
      color: 'spark',
      status: 'active',
    },
    {
      name: 'SLATE',
      icon: Users,
      description: 'Workspace & Identity - Manage workspaces and user identity',
      path: '/slate',
      domain: 'slate.lumenforge.io',
      color: 'slate',
      status: 'active',
    },
    {
      name: 'IGNIS',
      icon: Zap,
      description: 'API Backend - Runtime engine with WebContainer support',
      path: '/ignis',
      domain: 'ignis.lumenforge.io',
      color: 'ignis',
      status: 'active',
    },
    {
      name: 'IGNITION',
      icon: Rocket,
      description: 'Project Bootstrap - Create and initialize new projects',
      path: '/ignition',
      domain: 'ignition.lumenforge.io',
      color: 'ignition',
      status: 'active',
    },
  ];

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-landing-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-landing-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 sm:py-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-landing-primary/30 mb-8">
              <Code className="w-4 h-4 text-landing-primary" />
              <span className="text-sm font-medium text-text-secondary">
                LumenForge.io Ecosystem
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 text-gradient-landing">
              LumenForge
            </h1>

            <p className="text-xl sm:text-2xl text-text-secondary mb-4 leading-relaxed max-w-3xl mx-auto">
              The unified development platform for{' '}
              <span className="text-landing-primary font-semibold">modern web applications</span>
            </p>

            <p className="text-lg text-text-tertiary mb-12 max-w-2xl mx-auto">
              Build, deploy, and scale applications with our integrated suite of development tools.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/about"
                className="group px-8 py-4 rounded-lg bg-gradient-landing font-semibold text-background-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2"
              >
                Learn More
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 font-semibold text-text-primary transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              >
                View Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Systems Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-text-primary">
              WISSIL Systems
            </h2>
            <p className="text-center text-text-secondary mb-12">
              Five powerful tools working together seamlessly
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systems.map((system) => (
                <Link
                  key={system.name}
                  href={system.path}
                  className="group glass-container p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl card-hover"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-${system.color}-primary/10 border border-${system.color}-primary/20`}>
                      <system.icon className={`w-6 h-6 text-${system.color}-primary`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-xl font-bold text-${system.color}-primary`}>
                          {system.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          {system.status}
                        </span>
                      </div>
                      <p className="text-xs text-text-tertiary font-mono">{system.domain}</p>
                    </div>
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {system.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-medium text-text-tertiary group-hover:text-text-primary transition-colors">
                    Explore {system.name}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-text-primary">
              Built for Modern Development
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-landing-primary/10 border border-landing-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-landing-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Lightning Fast</h3>
                <p className="text-text-tertiary text-sm">
                  Optimized workflows and hot-reload for instant feedback
                </p>
              </div>

              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-landing-primary/10 border border-landing-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-landing-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Fully Integrated</h3>
                <p className="text-text-tertiary text-sm">
                  Seamless connections across all development stages
                </p>
              </div>

              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-landing-primary/10 border border-landing-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-landing-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Team Ready</h3>
                <p className="text-text-tertiary text-sm">
                  Workspace management and collaboration tools
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
