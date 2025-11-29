'use client';

import React, { useState } from 'react';
import { Users, FolderKanban, Settings, Key } from 'lucide-react';

/**
 * SLATE - Workspace & Identity Management
 *
 * Workspace selector, identity management, and user settings.
 * Integration with nocturnaID for authentication.
 *
 * Domain: slate.lumenforge.io
 * Network: Helios Compute (192.168.86.115)
 * Port: 3004
 * Integration: nocturnaID, Workspace service
 */
export default function SlatePage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  const workspaces = [
    {
      id: 'personal',
      name: 'Personal Workspace',
      description: 'Your personal projects and files',
      projects: 5,
      members: 1,
    },
    {
      id: 'team-alpha',
      name: 'Team Alpha',
      description: 'Collaborative workspace for Alpha project',
      projects: 12,
      members: 8,
    },
    {
      id: 'team-beta',
      name: 'Team Beta',
      description: 'Beta team workspace',
      projects: 7,
      members: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-slate-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-slate-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-slate-primary/30 mb-8">
              <Users className="w-4 h-4 text-slate-primary" />
              <span className="text-sm font-medium text-text-secondary">Workspace & Identity</span>
            </div>

            <h1 className="text-6xl sm:text-7xl font-bold mb-6 text-gradient-slate">
              SLATE
            </h1>

            <p className="text-xl text-text-secondary mb-4 leading-relaxed">
              Manage Your Workspaces & Identity
            </p>

            <p className="text-lg text-text-tertiary mb-12 max-w-2xl mx-auto">
              Organize projects, manage team access, and configure your identity settings.
            </p>
          </div>
        </section>

        {/* Workspace Selector */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <FolderKanban className="w-6 h-6 text-slate-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Workspaces</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => setSelectedWorkspace(workspace.id)}
                  className={`glass-container p-6 text-left transition-all duration-300 hover:-translate-y-2 ${
                    selectedWorkspace === workspace.id
                      ? 'border-slate-primary shadow-lg shadow-slate-primary/20'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-text-primary mb-1">
                        {workspace.name}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {workspace.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-text-tertiary">
                      <FolderKanban className="w-4 h-4" />
                      <span>{workspace.projects} projects</span>
                    </div>
                    <div className="flex items-center gap-1 text-text-tertiary">
                      <Users className="w-4 h-4" />
                      <span>{workspace.members} members</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Identity Management */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Key className="w-6 h-6 text-slate-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Identity Management</h2>
            </div>

            <div className="glass-container p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border-primary">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">nocturnaID</h3>
                    <p className="text-sm text-text-secondary">Primary identity provider</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border-primary">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">Email</h3>
                    <p className="text-sm text-text-secondary">user@lumenforge.io</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-text-primary hover:bg-white/10 transition-colors">
                    Edit
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">Roles</h3>
                    <p className="text-sm text-text-secondary">Designer, Engineer</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-text-primary hover:bg-white/10 transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Settings */}
        <section className="container mx-auto px-4 py-12 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Settings className="w-6 h-6 text-slate-primary" />
              <h2 className="text-3xl font-bold text-text-primary">User Settings</h2>
            </div>

            <div className="glass-container p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">Theme</h3>
                    <p className="text-sm text-text-secondary">Dark mode</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-slate-primary/10 border border-slate-primary/20 text-sm font-medium text-slate-primary">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">Notifications</h3>
                    <p className="text-sm text-text-secondary">Email and in-app notifications</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-text-primary hover:bg-white/10 transition-colors">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
