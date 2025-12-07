'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Code, Network, Play, Rocket, BookOpen } from 'lucide-react';

interface NavItem {
  name: string;
  label: string; // Display label with descriptor
  path: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  group: 'workspace' | 'system' | 'home';
}

const navItems: NavItem[] = [
  // Workspace Tools (Primary)
  { name: 'Spark', label: 'Spark (IDE)', path: '/spark', icon: Code, group: 'workspace' },
  { name: 'Slate', label: 'Slate (Nodes)', path: '/slate', icon: Network, group: 'workspace' },
  { name: 'Ignis', label: 'Ignis (Runtime)', path: '/ignis', icon: Play, group: 'workspace' },
  
  // System Tools (Secondary)
  { name: 'Waypoint', label: 'Waypoint (Docs)', path: '/waypoint', icon: BookOpen, group: 'system' },
  { name: 'Projects', label: 'Projects (Deploy)', path: '/projects', icon: Rocket, group: 'system' },
  
  // Home
  { name: 'LUMEN', label: 'LUMEN', path: '/lumen', icon: Home, group: 'home' },
];

export function Navigation() {
  // Check if we're in Next.js context (not Storybook)
  const isNextJs = typeof window !== 'undefined' && (window as any).__NEXT_DATA__;
  let pathname: string | null = null;
  
  try {
    if (isNextJs) {
      pathname = usePathname();
    }
  } catch (e) {
    // Not in Next.js context (Storybook)
    pathname = null;
  }

  const currentPath = pathname || '';

  const workspaceItems = navItems.filter(item => item.group === 'workspace');
  const systemItems = navItems.filter(item => item.group === 'system');
  const homeItem = navItems.find(item => item.group === 'home');

  return (
    <nav 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'var(--nv-bg-1)',
        borderBottom: '1px solid var(--nv-border)',
        height: '40px', // Krug-optimized: Reduced from 64px (37.5% reduction)
      }}
    >
      <div 
        style={{
          maxWidth: '100%',
          margin: '0 auto',
          padding: `0 var(--nv-space-4)`,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--nv-space-4)'
        }}
      >
        {/* Logo */}
        <Link 
          href="/lumen" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--nv-space-2)',
            textDecoration: 'none',
            color: 'var(--nv-text-0)',
            fontWeight: 600,
            fontSize: '14px',
            flexShrink: 0
          }}
        >
          <div 
            style={{
              width: '24px',
              height: '24px',
              borderRadius: 'var(--nv-radius-sm)',
              background: 'var(--nv-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--nv-text-0)'
            }}
          >
            <Home style={{ width: '14px', height: '14px' }} />
          </div>
          <span>WIS2L</span>
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <div 
          style={{ 
            display: 'none',
            alignItems: 'center', 
            gap: 'var(--nv-space-1)', 
            flex: 1, 
            justifyContent: 'center',
            overflowX: 'auto'
          }}
          className="desktop-nav"
        >
          {/* Workspace Group */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--nv-space-1)',
              paddingRight: 'var(--nv-space-3)',
              borderRight: '1px solid var(--nv-border)',
              flexShrink: 0
            }}
          >
            {workspaceItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--nv-space-2)',
                    padding: `var(--nv-space-1) var(--nv-space-3)`,
                    borderRadius: 'var(--nv-radius-sm)',
                    fontSize: '12px',
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: 'none',
                    color: isActive ? 'var(--nv-text-0)' : 'var(--nv-text-2)',
                    background: isActive ? 'var(--nv-bg-2)' : 'transparent',
                    borderBottom: isActive ? `2px solid var(--nv-accent)` : '2px solid transparent',
                    transition: 'var(--nv-transition-fast)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
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
                  <Icon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* System Group */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--nv-space-1)',
              paddingLeft: 'var(--nv-space-3)',
              paddingRight: 'var(--nv-space-3)',
              borderRight: '1px solid var(--nv-border)',
              flexShrink: 0
            }}
          >
            {systemItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--nv-space-2)',
                    padding: `var(--nv-space-1) var(--nv-space-3)`,
                    borderRadius: 'var(--nv-radius-sm)',
                    fontSize: '12px',
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: 'none',
                    color: isActive ? 'var(--nv-text-0)' : 'var(--nv-text-2)',
                    background: isActive ? 'var(--nv-bg-2)' : 'transparent',
                    borderBottom: isActive ? `2px solid var(--nv-accent)` : '2px solid transparent',
                    transition: 'var(--nv-transition-fast)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
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
                  <Icon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Home */}
          {homeItem && (
            <div style={{ paddingLeft: 'var(--nv-space-3)', flexShrink: 0 }}>
              <Link
                href={homeItem.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--nv-space-2)',
                  padding: `var(--nv-space-1) var(--nv-space-3)`,
                  borderRadius: 'var(--nv-radius-sm)',
                  fontSize: '12px',
                  fontWeight: currentPath === homeItem.path ? 600 : 400,
                  textDecoration: 'none',
                  color: currentPath === homeItem.path ? 'var(--nv-text-0)' : 'var(--nv-text-2)',
                  background: currentPath === homeItem.path ? 'var(--nv-bg-2)' : 'transparent',
                  borderBottom: currentPath === homeItem.path ? `2px solid var(--nv-accent)` : '2px solid transparent',
                  transition: 'var(--nv-transition-fast)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (currentPath !== homeItem.path) {
                    e.currentTarget.style.background = 'var(--nv-bg-2)';
                    e.currentTarget.style.color = 'var(--nv-text-1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPath !== homeItem.path) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--nv-text-2)';
                  }
                }}
              >
                <homeItem.icon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                <span>{homeItem.label}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu - Hidden on desktop */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            flexShrink: 0
          }}
          className="mobile-nav"
        >
          <select
            value={currentPath}
            onChange={(e) => {
              window.location.href = e.target.value;
            }}
            style={{
              padding: `var(--nv-space-1) var(--nv-space-2)`,
              borderRadius: 'var(--nv-radius-sm)',
              background: 'var(--nv-bg-2)',
              border: `1px solid var(--nv-border)`,
              color: 'var(--nv-text-0)',
              fontSize: '12px',
              cursor: 'pointer',
              minWidth: '140px'
            }}
          >
            {navItems.map((item) => (
              <option key={item.path} value={item.path} style={{ background: 'var(--nv-bg-1)' }}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Responsive CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 768px) {
            .desktop-nav {
              display: flex !important;
            }
            .mobile-nav {
              display: none !important;
            }
          }
          @media (max-width: 767px) {
            .desktop-nav {
              display: none !important;
            }
            .mobile-nav {
              display: flex !important;
            }
          }
        `}} />
      </div>
    </nav>
  );
}
