'use client';

import React, { useState } from 'react';
import { Rocket, FolderPlus, FileCode, Sparkles, Settings } from 'lucide-react';

/**
 * IGNITION - Project Bootstrap
 *
 * Project creation wizard, template gallery, and project initialization.
 *
 * Domain: ignition.lumenforge.io, ignite.lumenforge.io
 * Network: Helios Control (192.168.86.114)
 * Port: 3005
 * Integration: Template service, MCP tools, GitHub integration
 */
export default function IgnitionPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const templates = [
    {
      id: 'nextjs-app',
      name: 'Next.js Application',
      description: 'Full-stack React application with App Router',
      icon: FileCode,
      features: ['TypeScript', 'Tailwind CSS', 'App Router'],
      color: 'ignition',
    },
    {
      id: 'react-library',
      name: 'React Component Library',
      description: 'Reusable component library with Storybook',
      icon: FolderPlus,
      features: ['Storybook', 'TypeScript', 'Rollup'],
      color: 'ignition',
    },
    {
      id: 'node-api',
      name: 'Node.js API',
      description: 'RESTful API with Express and TypeScript',
      icon: Settings,
      features: ['Express', 'TypeScript', 'Jest'],
      color: 'ignition',
    },
  ];

  const steps = [
    { number: 1, title: 'Choose Template', description: 'Select a project template' },
    { number: 2, title: 'Configure Project', description: 'Set project name and options' },
    { number: 3, title: 'Initialize', description: 'Create project structure' },
  ];

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-ignition-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-ignition-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-ignition-primary/30 mb-8">
              <Rocket className="w-4 h-4 text-ignition-primary" />
              <span className="text-sm font-medium text-text-secondary">Project Bootstrap</span>
            </div>

            <h1 className="text-6xl sm:text-7xl font-bold mb-6 text-gradient-ignition">
              IGNITION
            </h1>

            <p className="text-xl text-text-secondary mb-4 leading-relaxed">
              Start Your Next Project
            </p>

            <p className="text-lg text-text-tertiary mb-12 max-w-2xl mx-auto">
              Create and initialize new projects with our intelligent project bootstrap wizard.
            </p>

            <button className="group px-8 py-4 rounded-lg bg-gradient-ignition font-semibold text-background-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2 mx-auto">
              <Sparkles className="w-5 h-5" />
              Create New Project
            </button>
          </div>
        </section>

        {/* Wizard Steps */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-12">
              {steps.map((s) => (
                <div key={s.number} className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    step >= s.number
                      ? 'bg-ignition-primary border-ignition-primary text-background-primary'
                      : 'bg-background-secondary border-border-primary text-text-tertiary'
                  }`}>
                    <span className="font-bold">{s.number}</span>
                  </div>
                  {s.number < steps.length && (
                    <div className={`w-16 h-0.5 ${
                      step > s.number ? 'bg-ignition-primary' : 'bg-border-primary'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Template Gallery */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <FolderPlus className="w-6 h-6 text-ignition-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Template Gallery</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`glass-container p-6 text-left transition-all duration-300 hover:-translate-y-2 ${
                    selectedTemplate === template.id
                      ? 'border-ignition-primary shadow-lg shadow-ignition-primary/20'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-ignition-primary/10 border border-ignition-primary/20">
                      <template.icon className="w-6 h-6 text-ignition-primary" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {template.name}
                  </h3>

                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {template.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature) => (
                      <span key={feature} className="px-2 py-1 rounded text-xs font-medium bg-ignition-primary/10 border border-ignition-primary/20 text-ignition-primary">
                        {feature}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Info */}
        <section className="container mx-auto px-4 py-12 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="glass-container p-6">
              <div className="flex items-start gap-4">
                <Sparkles className="w-5 h-5 text-ignition-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">Project Creation</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-3">
                    IGNITION integrates with template services, MCP tools for automation,
                    and GitHub for repository creation. Projects are initialized with best practices
                    and ready-to-use configurations.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-ignition-primary/10 border border-ignition-primary/20 text-ignition-primary">
                      Template Service
                    </span>
                    <span className="px-2 py-1 rounded bg-ignition-primary/10 border border-ignition-primary/20 text-ignition-primary">
                      MCP Tools
                    </span>
                    <span className="px-2 py-1 rounded bg-ignition-primary/10 border border-ignition-primary/20 text-ignition-primary">
                      GitHub Integration
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
