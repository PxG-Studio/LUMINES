'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Code, FileCode, Folder, MessageSquare, LayoutDashboard, Settings, Terminal, Plus } from 'lucide-react';
import { Navigation } from '@/components/wissil/Navigation';
import { Button } from '@/design-system/primitives/Button';

/**
 * SPARK — AI-Powered IDE Workbench
 *
 * Developer-first workspace for game development with AI assistance.
 * Real-time code editing, project management, and Unity/Unreal/Godot integration.
 *
 * Domain: spark.lumenforge.io
 * Network: HELIOS-CN (192.168.86.115)
 * Port: 3000
 * Integration: LUNA (AI responses), IGNIS (Runtime execution), AGEIS (IDE adapter), AGENT-FOUNDRY (Plugin discovery)
 */
export default function SparkPage() {
  // Check if we're in Next.js context (not Storybook)
  const isNextJs = typeof window !== 'undefined' && (window as any).__NEXT_DATA__;
  let router: ReturnType<typeof useRouter> | null = null;
  
  try {
    if (isNextJs) {
      router = useRouter();
    }
  } catch (e) {
    // Not in Next.js context (Storybook)
    router = null;
  }

  const [activeTab, setActiveTab] = useState('editor');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedFile, setSelectedFile] = useState('PlayerController.cs');
  const [selectedProject, setSelectedProject] = useState('space-shooter');
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m LUNA, your AI coding assistant. How can I help you today?' },
  ]);

  const handleNavigation = (href: string) => {
    console.log(`Button clicked - navigating to: ${href}`);
    
    // In the real Next.js app, perform actual navigation
    if (router && isNextJs) {
      router.push(href);
    }
    // In Storybook (no Next.js router), we ONLY log.
    // We intentionally do NOT change the current story so you stay on Canvas.
  };

  const projects = [
    { id: 'space-shooter', name: 'Space Shooter', language: 'C#', lastModified: '2 hours ago' },
    { id: 'rpg-game', name: 'RPG Game', language: 'TypeScript', lastModified: '1 day ago' },
    { id: 'platformer', name: 'Platformer', language: 'C#', lastModified: '3 days ago' },
  ];

  const files = [
    { name: 'PlayerController.cs', type: 'file', language: 'csharp', size: '2.3 KB' },
    { name: 'GameManager.cs', type: 'file', language: 'csharp', size: '1.8 KB' },
    { name: 'Scripts', type: 'folder', children: 12 },
    { name: 'Prefabs', type: 'folder', children: 8 },
    { name: 'Assets', type: 'folder', children: 24 },
  ];

  const tabs = [
    { id: 'editor', label: 'Editor', icon: FileCode },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'ai-chat', label: 'AI Chat', icon: MessageSquare, badge: '1' },
  ];

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        background: 'var(--nv-bg-0)',
        color: 'var(--nv-text-0)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Navigation />
      
      {/* Top Bar - IDE Style */}
      <div 
        style={{
          height: '48px',
          borderBottom: '1px solid var(--nv-border)',
          background: 'var(--nv-bg-1)',
          display: 'flex',
          alignItems: 'center',
          padding: `0 var(--nv-space-4)`,
          gap: 'var(--nv-space-4)',
          fontSize: '13px',
          fontFamily: 'monospace'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nv-space-2)', fontWeight: 600 }}>
          <Code style={{ width: '16px', height: '16px', color: 'var(--nv-accent)' }} />
          <span>Spark Workbench</span>
        </div>
        
        <div style={{ width: '1px', height: '24px', background: 'var(--nv-border)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nv-space-2)' }}>
          <span style={{ color: 'var(--nv-text-2)' }}>Project:</span>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{
              background: 'transparent',
              border: `1px solid var(--nv-border)`,
              borderRadius: 'var(--nv-radius-sm)',
              padding: 'var(--nv-space-1) var(--nv-space-2)',
              color: 'var(--nv-text-0)',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'var(--nv-transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--nv-border-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--nv-border)';
            }}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id} style={{ background: 'var(--nv-bg-1)' }}>{p.name}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nv-space-2)', color: 'var(--nv-text-2)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--nv-success)' }} />
          <span>Helios Connected</span>
        </div>

        <Button variant="ghost" style={{ padding: 'var(--nv-space-1) var(--nv-space-2)', fontSize: '12px' }}>
          <Settings style={{ width: '14px', height: '14px' }} />
        </Button>
      </div>

      {/* Main Work Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <div 
          style={{
            width: '240px',
            borderRight: `1px solid var(--nv-border)`,
            background: 'var(--nv-bg-1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Sidebar Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid var(--nv-border)` }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: 'var(--nv-space-2)',
                    background: isActive ? 'var(--nv-bg-0)' : 'transparent',
                    border: 'none',
                    borderBottom: isActive ? `2px solid var(--nv-accent)` : '2px solid transparent',
                    color: isActive ? 'var(--nv-text-0)' : 'var(--nv-text-2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    transition: 'var(--nv-transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--nv-bg-2)';
                      e.currentTarget.style.color = 'var(--nv-text-1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--nv-text-2)';
                    }
                  }}
                >
                  <Icon style={{ width: '16px', height: '16px' }} />
                </button>
              );
            })}
          </div>

          {/* File Tree */}
          {activeTab === 'editor' && (
            <div style={{ flex: 1, overflow: 'auto', padding: 'var(--nv-space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--nv-space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nv-space-3)', fontSize: '12px', fontWeight: 600 }}>
                  <Folder style={{ width: '14px', height: '14px', color: 'var(--nv-accent)' }} />
                  <span>Files</span>
                </div>
                <Button variant="ghost" style={{ padding: 'var(--nv-space-1) var(--nv-space-1)' }}>
                  <Plus style={{ width: '12px', height: '12px' }} />
                </Button>
              </div>
              <div style={{ fontSize: '12px' }}>
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    onClick={() => file.type === 'file' && setSelectedFile(file.name)}
                    style={{
                      padding: `var(--nv-space-1) var(--nv-space-2)`,
                      borderRadius: 'var(--nv-radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '2px',
                      background: selectedFile === file.name ? 'var(--nv-bg-2)' : 'transparent',
                      color: selectedFile === file.name ? 'var(--nv-text-0)' : 'var(--nv-text-2)',
                      transition: 'var(--nv-transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedFile !== file.name) {
                        e.currentTarget.style.background = 'var(--nv-bg-2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedFile !== file.name) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nv-space-3)' }}>
                      <span>{file.type === 'folder' ? '📁' : '📄'}</span>
                      <span>{file.name}</span>
                    </div>
                    {file.type === 'folder' && (
                      <span style={{ fontSize: '11px', color: 'var(--nv-text-3)' }}>{file.children}</span>
                    )}
                    {file.type === 'file' && (
                      <span style={{ fontSize: '11px', color: 'var(--nv-text-3)' }}>{file.size}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dashboard Sidebar */}
          {activeTab === 'dashboard' && (
            <div style={{ flex: 1, overflow: 'auto', padding: 'var(--nv-space-4)' }}>
              <div style={{ fontSize: '12px', color: 'var(--nv-text-2)', marginBottom: 'var(--nv-space-3)' }}>Quick Stats</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nv-space-2)' }}>
                <div style={{ padding: 'var(--nv-space-2)', background: 'var(--nv-bg-2)', borderRadius: 'var(--nv-radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--nv-text-2)', marginBottom: 'var(--nv-space-1)' }}>Projects</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--nv-accent)' }}>{projects.length}</div>
                </div>
                <div style={{ padding: 'var(--nv-space-2)', background: 'var(--nv-bg-2)', borderRadius: 'var(--nv-radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--nv-text-2)', marginBottom: 'var(--nv-space-1)' }}>Lines of Code</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--nv-text-0)' }}>12,847</div>
                </div>
              </div>
            </div>
          )}

          {/* Terminal Sidebar */}
          {activeTab === 'terminal' && (
            <div style={{ flex: 1, overflow: 'auto', padding: 'var(--nv-space-2)', fontFamily: 'monospace', fontSize: '12px' }}>
              <div style={{ color: 'var(--nv-text-2)', marginBottom: 'var(--nv-space-2)' }}>$ spark --version</div>
              <div style={{ color: 'var(--nv-accent)' }}>SPARK IDE v1.0.0</div>
              <div style={{ color: 'var(--nv-text-2)', marginTop: 'var(--nv-space-2)' }}>$ npm run dev</div>
              <div style={{ color: 'var(--nv-text-1)' }}>Starting development server...</div>
            </div>
          )}

          {/* AI Chat Sidebar */}
          {activeTab === 'ai-chat' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--nv-space-3)', borderBottom: `1px solid var(--nv-border)` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nv-space-2)' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--nv-bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare style={{ width: '14px', height: '14px', color: 'var(--nv-accent)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>LUNA AI</div>
                    <div style={{ fontSize: '11px', color: 'var(--nv-text-2)' }}>Your coding assistant</div>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, overflow: 'auto', padding: 'var(--nv-space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--nv-space-3)' }}>
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: `var(--nv-space-2) var(--nv-space-3)`,
                      borderRadius: 'var(--nv-radius-md)',
                      background: msg.role === 'assistant' ? 'var(--nv-bg-2)' : 'var(--nv-bg-1)',
                      fontSize: '12px',
                      color: 'var(--nv-text-1)'
                    }}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
              <div style={{ padding: 'var(--nv-space-3)', borderTop: `1px solid var(--nv-border)` }}>
                <div style={{ display: 'flex', gap: 'var(--nv-space-2)' }}>
                  <input
                    type="text"
                    placeholder="Ask LUNA..."
                    style={{
                      flex: 1,
                      padding: `var(--nv-space-3) var(--nv-space-3)`,
                      background: 'var(--nv-bg-2)',
                      border: `1px solid var(--nv-border)`,
                      borderRadius: 'var(--nv-radius-sm)',
                      color: 'var(--nv-text-0)',
                      fontSize: '12px'
                    }}
                  />
                  <Button variant="accent" style={{ padding: 'var(--nv-space-3) var(--nv-space-3)', fontSize: '12px' }}>
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeTab === 'editor' && (
            <>
              {/* Editor Tabs */}
              <div 
                style={{
                  height: '36px',
                  borderBottom: `1px solid var(--nv-border)`,
                  background: 'var(--nv-bg-1)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: `0 var(--nv-space-2)`,
                  gap: 'var(--nv-space-1)',
                  overflowX: 'auto'
                }}
              >
                <div 
                  style={{
                    padding: `var(--nv-space-3) var(--nv-space-3)`,
                    background: 'var(--nv-bg-0)',
                    borderBottom: `2px solid var(--nv-accent)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--nv-space-2)',
                    fontSize: '12px',
                    color: 'var(--nv-text-0)'
                  }}
                >
                  <FileCode style={{ width: '14px', height: '14px' }} />
                  <span>{selectedFile}</span>
                  <button 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--nv-text-2)', 
                      cursor: 'pointer', 
                      padding: '0', 
                      marginLeft: 'var(--nv-space-1)',
                      transition: 'var(--nv-transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--nv-text-0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--nv-text-2)';
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Editor Content */}
              <div 
                style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: 'var(--nv-space-4)',
                  background: 'var(--nv-bg-0)',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  lineHeight: '1.6'
                }}
              >
                <div style={{ color: 'var(--nv-text-3)', marginBottom: 'var(--nv-space-2)' }}>// {selectedFile}</div>
                <div style={{ color: 'var(--nv-text-0)' }}>using UnityEngine;</div>
                <div style={{ color: 'var(--nv-text-0)' }}>using System.Collections;</div>
                <div style={{ marginBottom: 'var(--nv-space-4)' }} />
                <div style={{ color: 'var(--nv-text-0)' }}>public class PlayerController : MonoBehaviour</div>
                <div style={{ color: 'var(--nv-text-0)' }}>{'{'}</div>
                <div style={{ paddingLeft: 'var(--nv-space-4)', color: 'var(--nv-text-0)' }}>public float speed = 5f;</div>
                <div style={{ paddingLeft: 'var(--nv-space-4)', color: 'var(--nv-text-0)' }}>public Rigidbody rb;</div>
                <div style={{ marginBottom: 'var(--nv-space-4)' }} />
                <div style={{ paddingLeft: 'var(--nv-space-4)', color: 'var(--nv-text-0)' }}>void Update()</div>
                <div style={{ paddingLeft: 'var(--nv-space-4)', color: 'var(--nv-text-0)' }}>{'{'}</div>
                <div style={{ paddingLeft: 'var(--nv-space-6)', color: 'var(--nv-accent)' }}>float moveX = Input.GetAxis("Horizontal");</div>
                <div style={{ paddingLeft: 'var(--nv-space-6)', color: 'var(--nv-accent)' }}>float moveZ = Input.GetAxis("Vertical");</div>
                <div style={{ paddingLeft: 'var(--nv-space-6)', color: 'var(--nv-text-0)' }}>Vector3 movement = new Vector3(moveX, 0, moveZ);</div>
                <div style={{ paddingLeft: 'var(--nv-space-6)', color: 'var(--nv-text-0)' }}>rb.velocity = movement * speed;</div>
                <div style={{ paddingLeft: 'var(--nv-space-4)', color: 'var(--nv-text-0)' }}>{'}'}</div>
                <div style={{ color: 'var(--nv-text-0)' }}>{'}'}</div>
              </div>

              {/* Status Bar */}
              <div 
                style={{
                  height: '24px',
                  borderTop: `1px solid var(--nv-border)`,
                  background: 'var(--nv-bg-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `0 var(--nv-space-3)`,
                  fontSize: '11px',
                  color: 'var(--nv-text-2)',
                  fontFamily: 'monospace'
                }}
              >
                <div style={{ display: 'flex', gap: 'var(--nv-space-4)' }}>
                  <span>Ln 1, Col 1</span>
                  <span>{selectedFile}</span>
                  <span>C#</span>
                </div>
                {isRunning && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nv-space-3)', color: 'var(--nv-success)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--nv-success)' }} />
                    <span>Running</span>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'dashboard' && (
            <div style={{ flex: 1, overflow: 'auto', padding: 'var(--nv-space-5)' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--nv-space-5)' }}>Project Dashboard</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--nv-space-4)' }}>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    style={{
                      padding: 'var(--nv-space-4)',
                      background: 'var(--nv-bg-1)',
                      border: `1px solid var(--nv-border)`,
                      borderRadius: 'var(--nv-radius-md)',
                      cursor: 'pointer',
                      transition: 'var(--nv-transition-fast)'
                    }}
                    onClick={() => {
                      setSelectedProject(project.id);
                      setActiveTab('editor');
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--nv-border-hover)';
                      e.currentTarget.style.background = 'var(--nv-bg-2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--nv-border)';
                      e.currentTarget.style.background = 'var(--nv-bg-1)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nv-space-2)', marginBottom: 'var(--nv-space-3)' }}>
                      <Folder style={{ width: '20px', height: '20px', color: 'var(--nv-accent)' }} />
                      <span style={{ fontWeight: 600 }}>{project.name}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--nv-text-2)', marginBottom: 'var(--nv-space-2)' }}>
                      {project.language} • {project.lastModified}
                    </div>
                    <Button
                      variant="ghost"
                      style={{ fontSize: '12px', padding: 'var(--nv-space-1) var(--nv-space-2)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project.id);
                        setActiveTab('editor');
                      }}
                    >
                      Open
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div style={{ flex: 1, overflow: 'auto', padding: 'var(--nv-space-4)', background: 'var(--nv-bg-0)', fontFamily: 'monospace', fontSize: '13px' }}>
              <div style={{ color: 'var(--nv-text-2)', marginBottom: 'var(--nv-space-2)' }}>$ spark --version</div>
              <div style={{ color: 'var(--nv-accent)' }}>SPARK IDE v1.0.0</div>
              <div style={{ color: 'var(--nv-text-2)', marginTop: 'var(--nv-space-4)' }}>$ npm run dev</div>
              <div style={{ color: 'var(--nv-text-1)' }}>Starting development server...</div>
              <div style={{ color: 'var(--nv-success)', marginTop: 'var(--nv-space-2)' }}>✓ Server running on http://localhost:3000</div>
            </div>
          )}

          {activeTab === 'ai-chat' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--nv-bg-0)' }}>
              <div style={{ flex: 1, overflow: 'auto', padding: 'var(--nv-space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--nv-space-4)' }}>
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: 'var(--nv-space-3)',
                      justifyContent: msg.role === 'assistant' ? 'flex-start' : 'flex-end'
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--nv-bg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MessageSquare style={{ width: '16px', height: '16px', color: 'var(--nv-accent)' }} />
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: `var(--nv-space-3) var(--nv-space-4)`,
                        borderRadius: 'var(--nv-radius-md)',
                        background: msg.role === 'assistant' ? 'var(--nv-bg-1)' : 'var(--nv-bg-2)',
                        fontSize: '14px',
                        color: 'var(--nv-text-0)',
                        lineHeight: '1.5'
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 'var(--nv-space-4)', borderTop: `1px solid var(--nv-border)` }}>
                <div style={{ display: 'flex', gap: 'var(--nv-space-2)' }}>
                  <input
                    type="text"
                    placeholder="Ask LUNA about game development..."
                    style={{
                      flex: 1,
                      padding: `var(--nv-space-2) var(--nv-space-3)`,
                      background: 'var(--nv-bg-1)',
                      border: `1px solid var(--nv-border)`,
                      borderRadius: 'var(--nv-radius-md)',
                      color: 'var(--nv-text-0)',
                      fontSize: '14px'
                    }}
                  />
                  <Button
                    variant="accent"
                    style={{ padding: 'var(--nv-space-2) var(--nv-space-4)' }}
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Ask LUNA about game development..."]') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        setAiMessages([...aiMessages, { role: 'user', content: input.value }]);
                        setTimeout(() => {
                          setAiMessages(prev => [...prev, { role: 'assistant', content: 'I understand you want help with: ' + input.value + '. How can I assist you further?' }]);
                        }, 1000);
                        input.value = '';
                      }
                    }}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Optional (can be collapsed) */}
        {activeTab === 'editor' && (
          <div 
            style={{
              width: '280px',
              borderLeft: `1px solid var(--nv-border)`,
              background: 'var(--nv-bg-1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: 'var(--nv-space-3)', borderBottom: `1px solid var(--nv-border)`, fontSize: '13px', fontWeight: 600 }}>
              Inspector
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 'var(--nv-space-3)', fontSize: '12px' }}>
              <div style={{ marginBottom: 'var(--nv-space-4)' }}>
                <div style={{ color: 'var(--nv-text-2)', marginBottom: 'var(--nv-space-2)' }}>Properties</div>
                <div style={{ padding: 'var(--nv-space-2)', background: 'var(--nv-bg-0)', borderRadius: 'var(--nv-radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--nv-space-1)' }}>
                    <span style={{ color: 'var(--nv-text-2)' }}>speed</span>
                    <span style={{ color: 'var(--nv-text-0)' }}>5f</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--nv-text-2)' }}>rb</span>
                    <span style={{ color: 'var(--nv-text-0)' }}>Rigidbody</span>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--nv-text-2)', marginBottom: 'var(--nv-space-2)' }}>AI Suggestions</div>
                <div style={{ padding: 'var(--nv-space-2)', background: 'var(--nv-bg-2)', border: `1px solid var(--nv-border)`, borderRadius: 'var(--nv-radius-sm)', fontSize: '11px', color: 'var(--nv-text-1)' }}>
                  Consider adding jump functionality with Input.GetButtonDown("Jump")
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
