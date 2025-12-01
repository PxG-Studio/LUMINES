'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Code, FileCode, Folder, Command, MessageSquare, LayoutDashboard, Search, Settings, Bell, User, Play, Save, Share2, Sparkles, Zap, Languages, Brain, Flame } from 'lucide-react';
import { Navigation } from '@/components/wissil/Navigation';

/**
 * SPARK — AI-Powered IDE
 *
 * Intelligent development environment with natural language project creation.
 * Real-time AI assistance, multi-language support, and smart code generation.
 *
 * Domain: spark.lumenforge.io
 * Network: HELIOS-CN (192.168.86.115)
 * Port: 3000
 * Integration: LUNA (AI responses), IGNIS (Runtime execution), AGEIS (IDE adapter), AGENT-FOUNDRY (Plugin discovery)
 */
export default function SparkPage() {
  const [activeTab, setActiveTab] = useState('editor');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedFile, setSelectedFile] = useState('PlayerController.cs');
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m LUNA, your AI coding assistant. How can I help you today?' },
  ]);

  const tabs = [
    { id: 'editor', label: 'Editor', icon: FileCode, badge: null },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'projects', label: 'Projects', icon: Folder, badge: '3' },
    { id: 'terminal', label: 'Terminal', icon: Terminal, badge: null },
    { id: 'ai-chat', label: 'AI Chat', icon: MessageSquare, badge: '1' },
  ];

  const projects = [
    { name: 'space-shooter', language: 'C#', lastModified: '2 hours ago', files: 24, size: '2.4 MB' },
    { name: 'rpg-game', language: 'TypeScript', lastModified: '1 day ago', files: 18, size: '1.8 MB' },
    { name: 'platformer', language: 'C#', lastModified: '3 days ago', files: 12, size: '856 KB' },
  ];

  const files = [
    { name: 'PlayerController.cs', type: 'file', language: 'csharp', size: '2.3 KB' },
    { name: 'GameManager.cs', type: 'file', language: 'csharp', size: '1.8 KB' },
    { name: 'Scripts', type: 'folder', children: 12 },
    { name: 'Prefabs', type: 'folder', children: 8 },
    { name: 'Assets', type: 'folder', children: 24 },
  ];

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      <Navigation />
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-spark-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-spark-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 pt-16">
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-spark-primary/30 mb-8">
              <Code className="w-4 h-4 text-spark-primary" />
              <span className="text-sm font-medium text-text-secondary">AI-Powered IDE</span>
            </div>

            <h1 className="text-6xl sm:text-7xl font-bold mb-6 text-gradient-spark">
              SPARK
            </h1>

            <p className="text-xl text-text-secondary mb-4 leading-relaxed">
              AI-Powered IDE for Natural Language Development
            </p>

            <p className="text-lg text-text-tertiary mb-12 max-w-2xl mx-auto">
              Describe your idea, get a working project. Natural language to code conversion with real-time AI assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/spark"
                className="group px-8 py-4 rounded-lg bg-gradient-spark font-semibold text-background-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2 mx-auto"
              >
                <Code className="w-5 h-5" />
                Open SPARK IDE
              </Link>
              <Link
                href="/spark#demo"
                className="px-8 py-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 font-semibold text-text-primary transition-all duration-300 hover:bg-white/10"
              >
                View Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <section className="container mx-auto px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="glass-container p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background-secondary border border-border-primary">
                  <Search className="w-4 h-4 text-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search game scripts..."
                    className="bg-transparent border-none outline-none text-text-primary placeholder-text-tertiary"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <Bell className="w-4 h-4 text-text-secondary" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <Settings className="w-4 h-4 text-text-secondary" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <User className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="container mx-auto px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6 border-b border-border-primary overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-spark-primary text-spark-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-spark-primary/20 text-spark-primary">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Editor View */}
            {activeTab === 'editor' && (
              <div className="glass-container p-0 overflow-hidden">
                <div className="flex">
                  {/* File Tree */}
                  <div className="w-64 border-r border-border-primary bg-background-secondary p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-spark-primary" />
                        <span className="text-sm font-semibold text-text-primary">Files</span>
                      </div>
                      <button className="p-1 rounded hover:bg-white/5">
                        <Settings className="w-3 h-3 text-text-tertiary" />
                      </button>
                    </div>
                    <div className="space-y-1 text-sm">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          onClick={() => file.type === 'file' && setSelectedFile(file.name)}
                          className={`px-2 py-1.5 rounded cursor-pointer transition-colors flex items-center justify-between ${
                            selectedFile === file.name
                              ? 'bg-spark-primary/20 text-spark-primary'
                              : 'text-text-secondary hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{file.type === 'folder' ? '📁' : '📄'}</span>
                            <span>{file.name}</span>
                          </div>
                          {file.type === 'folder' && (
                            <span className="text-xs text-text-tertiary">{file.children}</span>
                          )}
                          {file.type === 'file' && (
                            <span className="text-xs text-text-tertiary">{file.size}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Editor */}
                  <div className="flex-1 flex flex-col">
                    {/* Editor Tabs */}
                    <div className="flex items-center gap-1 border-b border-border-primary bg-background-secondary px-4">
                      <div className="flex items-center gap-2 px-3 py-2 border-b-2 border-spark-primary text-spark-primary">
                        <FileCode className="w-3 h-3" />
                        <span className="text-sm font-medium">{selectedFile}</span>
                        <button className="ml-2 p-0.5 rounded hover:bg-white/5">
                          <span className="text-xs">×</span>
                        </button>
                      </div>
                    </div>
                    {/* Editor Content */}
                    <div className="flex-1 bg-background-primary p-4 overflow-auto">
                      <div className="text-sm font-mono">
                        <div className="mb-2 text-text-tertiary">// {selectedFile}</div>
                        <div className="text-text-primary">using UnityEngine;</div>
                        <div className="text-text-primary">using System.Collections;</div>
                        <div className="mb-4" />
                        <div className="text-text-primary">public class PlayerController : MonoBehaviour</div>
                        <div className="text-text-primary">{'{'}</div>
                        <div className="pl-4 text-text-primary">public float speed = 5f;</div>
                        <div className="pl-4 text-text-primary">public Rigidbody rb;</div>
                        <div className="mb-4" />
                        <div className="pl-4 text-text-primary">void Update()</div>
                        <div className="pl-4 text-text-primary">{'{'}</div>
                        <div className="pl-8 text-spark-primary">float moveX = Input.GetAxis("Horizontal");</div>
                        <div className="pl-8 text-spark-primary">float moveZ = Input.GetAxis("Vertical");</div>
                        <div className="pl-8 text-text-primary">Vector3 movement = new Vector3(moveX, 0, moveZ);</div>
                        <div className="pl-8 text-text-primary">rb.velocity = movement * speed;</div>
                        <div className="pl-4 text-text-primary">{'}'}</div>
                        <div className="text-text-primary">{'}'}</div>
                      </div>
                    </div>
                    {/* Editor Status Bar */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-border-primary bg-background-secondary text-xs text-text-tertiary">
                      <div className="flex items-center gap-4">
                        <span>Ln 1, Col 1</span>
                        <span>{selectedFile}</span>
                        <span>C#</span>
                      </div>
                      {isRunning && (
                        <div className="flex items-center gap-2 text-green-400">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span>Running</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project.name} className="glass-container p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                      <div className="flex items-center gap-3 mb-3">
                        <Folder className="w-5 h-5 text-spark-primary" />
                        <h3 className="text-lg font-bold text-text-primary">{project.name}</h3>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">Language</span>
                          <span className="text-sm font-medium text-spark-primary">{project.language}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">Files</span>
                          <span className="text-sm text-text-primary">{project.files}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">Size</span>
                          <span className="text-sm text-text-primary">{project.size}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border-primary">
                        <p className="text-xs text-text-tertiary">{project.lastModified}</p>
                    <button 
                      onClick={() => {
                        setActiveTab('editor');
                      }}
                      className="px-3 py-1 rounded bg-spark-primary/10 border border-spark-primary/20 text-spark-primary hover:bg-spark-primary/20 transition-colors text-xs"
                    >
                      Open
                    </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="glass-container p-4">
                  <div className="text-sm text-text-secondary mb-1">Game Projects</div>
                  <div className="text-2xl font-bold text-spark-primary">{projects.length}</div>
                  </div>
                  <div className="glass-container p-4">
                    <div className="text-sm text-text-secondary mb-1">Lines of Code</div>
                    <div className="text-2xl font-bold text-spark-secondary">12,847</div>
                  </div>
                  <div className="glass-container p-4">
                    <div className="text-sm text-text-secondary mb-1">Commits</div>
                    <div className="text-2xl font-bold text-spark-accent">342</div>
                  </div>
                  <div className="glass-container p-4">
                    <div className="text-sm text-text-secondary mb-1">Active Sessions</div>
                    <div className="text-2xl font-bold text-green-400">3</div>
                  </div>
                </div>
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
              <div className="glass-container p-0 overflow-hidden flex flex-col h-[600px]">
                <div className="flex items-center gap-3 p-4 border-b border-border-primary">
                  <div className="w-8 h-8 rounded-full bg-spark-primary/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-spark-primary" />
                  </div>
                  <div>
                  <h3 className="text-lg font-bold text-text-primary">LUNA AI Assistant</h3>
                  <p className="text-xs text-text-tertiary">Your game development companion</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {aiMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${
                        msg.role === 'assistant' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-spark-primary/20 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-spark-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          msg.role === 'assistant'
                            ? 'bg-white/5 text-text-secondary'
                            : 'bg-spark-primary/20 text-text-primary'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border-primary">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ask LUNA about game development..."
                      className="flex-1 px-4 py-2 rounded-lg bg-background-secondary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-spark-primary"
                    />
                    <button 
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Ask LUNA anything..."]') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          setAiMessages([...aiMessages, { role: 'user', content: input.value }]);
                          setTimeout(() => {
                            setAiMessages(prev => [...prev, { role: 'assistant', content: 'I understand you want help with: ' + input.value + '. How can I assist you further?' }]);
                          }, 1000);
                          input.value = '';
                        }
                      }}
                      className="px-6 py-2 rounded-lg bg-gradient-spark font-semibold text-background-primary transition-all duration-300 hover:scale-105"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-text-primary">
                Powerful Features
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Everything you need for intelligent game development
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-spark-primary/10 border border-spark-primary/20 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-spark-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Natural Language to Code</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Describe your game idea in plain English and get working code instantly
                </p>
              </div>
              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-spark-primary/10 border border-spark-primary/20 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-spark-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Real-time AI Assistance</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Get instant AI-powered suggestions and code completion as you type
                </p>
              </div>
              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-spark-primary/10 border border-spark-primary/20 flex items-center justify-center mb-4">
                  <Languages className="w-6 h-6 text-spark-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Multi-Language Support</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  TypeScript, Python, Lua, C#, and more with smart autocomplete
                </p>
              </div>
              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-spark-primary/10 border border-spark-primary/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-spark-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Smart Code Generation</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  AI-powered code generation with context awareness and best practices
                </p>
              </div>
              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-spark-primary/10 border border-spark-primary/20 flex items-center justify-center mb-4">
                  <FileCode className="w-6 h-6 text-spark-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Project Scaffolding</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Generate complete project structures from natural language prompts
                </p>
              </div>
              <div className="glass-container p-6">
                <div className="w-12 h-12 rounded-lg bg-spark-primary/10 border border-spark-primary/20 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-spark-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">Live Preview</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  See your changes instantly with hot reload and real-time preview
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section id="integration" className="container mx-auto px-4 py-20">
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
              <Link href="/luna" className="glass-container p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="w-16 h-16 rounded-lg bg-luna-primary/10 border border-luna-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-luna-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">LUNA</h3>
                <p className="text-sm text-text-secondary">AI model routing</p>
              </Link>
              <Link href="/ignis" className="glass-container p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="w-16 h-16 rounded-lg bg-ignis-primary/10 border border-ignis-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-8 h-8 text-ignis-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">IGNIS</h3>
                <p className="text-sm text-text-secondary">Runtime execution</p>
              </Link>
              <div className="glass-container p-6 text-center">
                <div className="w-16 h-16 rounded-lg bg-slate-primary/10 border border-slate-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-slate-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">AGEIS</h3>
                <p className="text-sm text-text-secondary">IDE adapter</p>
              </div>
              <div className="glass-container p-6 text-center">
                <div className="w-16 h-16 rounded-lg bg-spark-primary/10 border border-spark-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-spark-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">AGENT-FOUNDRY</h3>
                <p className="text-sm text-text-secondary">Plugin discovery</p>
              </div>
            </div>
          </div>
        </section>

        {/* Code Example Section */}
        <section id="demo" className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-text-primary">
                See It In Action
              </h2>
              <p className="text-lg text-text-secondary">
                Embedded Monaco editor with AI-powered assistance
              </p>
            </div>
            <div className="glass-container p-0 overflow-hidden">
              <div className="bg-background-secondary px-4 py-3 border-b border-border-primary flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-spark-primary" />
                  <span className="text-sm font-medium text-text-primary">Example: Player Movement Script</span>
                </div>
                <button className="px-3 py-1 rounded bg-spark-primary/10 border border-spark-primary/20 text-spark-primary text-xs hover:bg-spark-primary/20 transition-colors">
                  Copy
                </button>
              </div>
              <div className="p-6 bg-background-primary">
                <pre className="text-sm font-mono text-text-primary overflow-x-auto">
                  <code>{`// Generated by SPARK from: "Create a player controller with WASD movement"

using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed = 5f;
    private Rigidbody rb;
    
    void Start()
    {
        rb = GetComponent<Rigidbody>();
    }
    
    void Update()
    {
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        
        Vector3 movement = new Vector3(horizontal, 0, vertical);
        rb.velocity = movement * moveSpeed;
    }
}`}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="glass-container p-12 text-center bg-gradient-to-br from-spark-primary/10 to-spark-secondary/10 border-spark-primary/30">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-text-primary">
                Ready to Build Your Game?
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                Start coding with natural language. Describe your idea and watch it come to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/spark"
                  className="group px-8 py-4 rounded-lg bg-gradient-spark font-semibold text-background-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  <Code className="w-5 h-5" />
                  Open SPARK IDE
                </Link>
                <Link
                  href="/spark#demo"
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
