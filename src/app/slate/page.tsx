'use client';

import React, { useState } from 'react';
import { Users, FolderKanban, Settings, Key, Plus, Search, Bell, CheckCircle2, Shield, Globe, Mail } from 'lucide-react';
import { Navigation } from '@/components/wissil/Navigation';

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
      name: 'Personal Studio',
      description: 'Your personal game projects and assets',
      projects: 5,
      members: 1,
      storage: '2.4 GB',
      color: 'slate-primary',
    },
    {
      id: 'team-alpha',
      name: 'Alpha Game Studio',
      description: 'Collaborative studio for Alpha game project',
      projects: 12,
      members: 8,
      storage: '8.7 GB',
      color: 'slate-secondary',
    },
    {
      id: 'team-beta',
      name: 'Beta Game Studio',
      description: 'Beta team game development workspace',
      projects: 7,
      members: 4,
      storage: '4.2 GB',
      color: 'slate-accent',
    },
  ];

  const teamMembers = [
    { name: 'Alex Johnson', role: 'Owner', email: 'alex@lumenforge.io', avatar: 'AJ' },
    { name: 'Sarah Chen', role: 'Admin', email: 'sarah@lumenforge.io', avatar: 'SC' },
    { name: 'Mike Davis', role: 'Member', email: 'mike@lumenforge.io', avatar: 'MD' },
  ];

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      <Navigation />
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-slate-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-slate-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 pt-16">
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
              Manage Your Game Studio & Team
            </p>

            <p className="text-lg text-text-tertiary mb-12 max-w-2xl mx-auto">
              Organize game projects, manage team access, and configure your studio settings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 rounded-lg bg-gradient-slate font-semibold text-background-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2 mx-auto">
                <Plus className="w-5 h-5" />
                Create Workspace
              </button>
              <button className="px-8 py-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 font-semibold text-text-primary transition-all duration-300 hover:bg-white/10">
                Import Workspace
              </button>
            </div>
          </div>
        </section>

        {/* Workspace Selector */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <FolderKanban className="w-6 h-6 text-slate-primary" />
                <h2 className="text-3xl font-bold text-text-primary">Workspaces</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search workspaces..."
                    className="pl-10 pr-4 py-2 rounded-lg bg-background-secondary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-slate-primary"
                  />
                </div>
                <button className="p-2 rounded-lg bg-slate-primary/10 border border-slate-primary/20 text-slate-primary hover:bg-slate-primary/20 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => setSelectedWorkspace(workspace.id)}
                  className={`glass-container p-6 text-left transition-all duration-300 hover:-translate-y-2 ${
                    selectedWorkspace === workspace.id
                      ? 'border-slate-primary shadow-lg shadow-slate-primary/20 ring-2 ring-slate-primary/50'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary mb-1">
                        {workspace.name}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {workspace.description}
                      </p>
                    </div>
                    {selectedWorkspace === workspace.id && (
                      <CheckCircle2 className="w-5 h-5 text-slate-primary flex-shrink-0" />
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-text-tertiary">
                        <FolderKanban className="w-4 h-4" />
                        <span>Game Projects</span>
                      </div>
                      <span className="text-text-primary font-medium">{workspace.projects}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-text-tertiary">
                        <Users className="w-4 h-4" />
                        <span>Members</span>
                      </div>
                      <span className="text-text-primary font-medium">{workspace.members}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-text-tertiary">
                        <Settings className="w-4 h-4" />
                        <span>Assets</span>
                      </div>
                      <span className="text-text-primary font-medium">{workspace.storage}</span>
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Key className="w-6 h-6 text-slate-primary" />
                <h2 className="text-3xl font-bold text-text-primary">Identity Management</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-container p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border-primary">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-primary/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-slate-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary mb-1">nocturnaID</h3>
                        <p className="text-sm text-text-secondary">Primary identity provider</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      Connected
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border-primary">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-secondary/20 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-slate-secondary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary mb-1">Email</h3>
                        <p className="text-sm text-text-secondary">user@lumenforge.io</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const newEmail = prompt('Enter new email:', 'user@lumenforge.io');
                        if (newEmail) {
                          console.log('Email updated to:', newEmail);
                          alert('Email updated successfully!');
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-text-primary hover:bg-white/10 transition-colors"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-accent/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-slate-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary mb-1">Roles</h3>
                        <p className="text-sm text-text-secondary">Designer, Engineer</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        console.log('Opening role management...');
                        alert('Role management panel would open here');
                      }}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-text-primary hover:bg-white/10 transition-colors"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="glass-container p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-text-primary">Team Members</h3>
                  <button 
                    onClick={() => {
                      const name = prompt('Enter studio name:');
                      if (name) {
                        console.log('Creating studio:', name);
                        alert(`Game Studio "${name}" created successfully!`);
                      }
                    }}
                    className="p-2 rounded-lg bg-slate-primary/10 border border-slate-primary/20 text-slate-primary hover:bg-slate-primary/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-primary/20 flex items-center justify-center text-slate-primary font-bold text-sm">
                          {member.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-primary">{member.name}</div>
                          <div className="text-xs text-text-tertiary">{member.role}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          console.log('Managing member:', member.name);
                          alert(`Managing ${member.name}...`);
                        }}
                        className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
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
                      <button 
                        onClick={() => {
                          const themes = ['Dark', 'Light', 'Auto'];
                          const current = 'Dark';
                          const next = themes[(themes.indexOf(current) + 1) % themes.length];
                          alert(`Theme changed to ${next} mode`);
                        }}
                        className="px-4 py-2 rounded-lg bg-slate-primary/10 border border-slate-primary/20 text-sm font-medium text-slate-primary hover:bg-slate-primary/20 transition-colors"
                      >
                        Change
                      </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">Notifications</h3>
                    <p className="text-sm text-text-secondary">Email and in-app notifications</p>
                  </div>
                    <button 
                      onClick={() => {
                        console.log('Opening notification settings...');
                        alert('Notification settings panel would open here');
                      }}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-text-primary hover:bg-white/10 transition-colors"
                    >
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
