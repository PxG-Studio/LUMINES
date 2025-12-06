'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Rocket, FolderPlus, FileCode, Sparkles, Settings, ArrowRight, CheckCircle2, Loader2, Github } from 'lucide-react';
import { Navigation } from '@/components/wissil/Navigation';

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
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const templates = [
    {
      id: 'unity-2d',
      name: 'Unity 2D Game',
      description: '2D game template with Unity and C# scripting',
      icon: FileCode,
      features: ['Unity 2D', 'C# Scripts', 'Sprite System', 'Physics'],
      color: 'ignition',
      popular: true,
    },
    {
      id: 'unity-3d',
      name: 'Unity 3D Game',
      description: '3D game template with Unity and advanced rendering',
      icon: FolderPlus,
      features: ['Unity 3D', 'C# Scripts', '3D Models', 'Lighting'],
      color: 'ignition',
      popular: true,
    },
    {
      id: 'webgl-game',
      name: 'WebGL Game',
      description: 'Browser-based game with WebGL and TypeScript',
      icon: Settings,
      features: ['WebGL', 'TypeScript', 'Three.js', 'Asset Loader'],
      color: 'ignition',
      popular: true,
    },
    {
      id: 'puzzle-game',
      name: 'Puzzle Game Template',
      description: 'Match-3 style puzzle game with Unity',
      icon: FileCode,
      features: ['Unity 2D', 'Grid System', 'Particle Effects', 'UI System'],
      color: 'ignition',
      popular: false,
    },
  ];

  const steps = [
    { number: 1, title: 'Choose Template', description: 'Select a game template' },
    { number: 2, title: 'Configure Game', description: 'Set game name and settings' },
    { number: 3, title: 'Initialize', description: 'Create game project structure' },
  ];

  const handleCreate = () => {
    if (!selectedTemplate || !projectName) return;
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      setCreated(true);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      <Navigation />
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-ignition-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-ignition-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 pt-16">
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
              Start Your Next Game
            </p>

            <p className="text-lg text-text-tertiary mb-12 max-w-2xl mx-auto">
              Create and initialize new game projects with our intelligent game project templates.
            </p>

            <button
              onClick={() => setStep(1)}
              className="group px-8 py-4 rounded-lg bg-gradient-ignition font-semibold text-background-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              Create New Project
            </button>
          </div>
        </section>

        {/* Wizard Steps */}
        {step > 0 && (
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-12">
                {steps.map((s) => (
                  <div key={s.number} className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                        step >= s.number
                          ? 'bg-ignition-primary border-ignition-primary text-background-primary'
                          : 'bg-background-secondary border-border-primary text-text-tertiary'
                      }`}>
                        {step > s.number ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <span className="font-bold">{s.number}</span>
                        )}
                      </div>
                      <div className="text-center">
                        <div className={`text-xs font-medium ${
                          step >= s.number ? 'text-ignition-primary' : 'text-text-tertiary'
                        }`}>
                          {s.title}
                        </div>
                      </div>
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
        )}

        {/* Template Gallery */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <FolderPlus className="w-6 h-6 text-ignition-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Game Templates</h2>
            </div>

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setStep(2);
                    }}
                    className={`glass-container p-6 text-left transition-all duration-300 hover:-translate-y-2 relative ${
                      selectedTemplate === template.id
                        ? 'border-ignition-primary shadow-lg shadow-ignition-primary/20 ring-2 ring-ignition-primary/50'
                        : 'border-white/10'
                    }`}
                  >
                    {template.popular && (
                      <div className="absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-bold bg-ignition-primary/20 text-ignition-primary border border-ignition-primary/30">
                        Popular
                      </div>
                    )}
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
            )}

            {step === 2 && (
              <div className="max-w-2xl mx-auto">
                <div className="glass-container p-8">
                  <h3 className="text-2xl font-bold text-text-primary mb-6">Configure Your Game</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Game Name
                      </label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="my-awesome-game"
                        className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-ignition-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Game Description (Optional)
                      </label>
                      <textarea
                        placeholder="A brief description of your game"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg bg-background-secondary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-ignition-primary resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="github" className="w-4 h-4 rounded border-border-primary bg-background-secondary text-ignition-primary focus:ring-ignition-primary" />
                      <label htmlFor="github" className="text-sm text-text-secondary flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        Create GitHub repository
                      </label>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 px-6 py-3 rounded-lg bg-white/5 border border-white/10 font-semibold text-text-primary transition-all duration-300 hover:bg-white/10"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleCreate}
                        disabled={!projectName || isCreating}
                        className="flex-1 px-6 py-3 rounded-lg bg-gradient-ignition font-semibold text-background-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Game...
                          </>
                        ) : (
                          <>
                            Create Game
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && created && (
              <div className="max-w-2xl mx-auto">
                <div className="glass-container p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-4">Game Project Created Successfully!</h3>
                  <p className="text-text-secondary mb-6">
                    Your game <span className="font-semibold text-ignition-primary">{projectName}</span> has been initialized and is ready for development.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/spark"
                      className="px-6 py-3 rounded-lg bg-gradient-ignition font-semibold text-background-primary transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      Open in SPARK
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <button className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 font-semibold text-text-primary transition-all duration-300 hover:bg-white/10">
                      View Files
                    </button>
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
                <Sparkles className="w-5 h-5 text-ignition-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">Game Project Creation</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-3">
                    IGNITION integrates with Unity templates, game asset libraries, and version control
                    for repository creation. Game projects are initialized with best practices,
                    proper folder structure, and ready-to-use game configurations.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-ignition-primary/10 border border-ignition-primary/20 text-ignition-primary">
                      Unity Templates
                    </span>
                    <span className="px-2 py-1 rounded bg-ignition-primary/10 border border-ignition-primary/20 text-ignition-primary">
                      Asset Library
                    </span>
                    <span className="px-2 py-1 rounded bg-ignition-primary/10 border border-ignition-primary/20 text-ignition-primary">
                      Version Control
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
