'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, Terminal, Users, Zap, Rocket } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const navItems: NavItem[] = [
  { name: 'LANDING', path: '/landing', icon: Home, color: 'landing' },
  { name: 'WAYPOINT', path: '/waypoint', icon: Gamepad2, color: 'waypoint' },
  { name: 'SPARK', path: '/spark', icon: Terminal, color: 'spark' },
  { name: 'SLATE', path: '/slate', icon: Users, color: 'slate' },
  { name: 'IGNIS', path: '/ignis', icon: Zap, color: 'ignis' },
  { name: 'IGNITION', path: '/ignition', icon: Rocket, color: 'ignition' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background-primary/80 backdrop-blur-xl border-b border-border-primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/landing" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-landing flex items-center justify-center">
              <Home className="w-5 h-5 text-background-primary" />
            </div>
            <span className="text-lg font-bold text-text-primary">WISSIL</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              const activeStyles = {
                landing: isActive ? 'bg-landing-primary/20 text-landing-primary border border-landing-primary/30' : '',
                waypoint: isActive ? 'bg-waypoint-primary/20 text-waypoint-primary border border-waypoint-primary/30' : '',
                spark: isActive ? 'bg-spark-primary/20 text-spark-primary border border-spark-primary/30' : '',
                slate: isActive ? 'bg-slate-primary/20 text-slate-primary border border-slate-primary/30' : '',
                ignis: isActive ? 'bg-ignis-primary/20 text-ignis-primary border border-ignis-primary/30' : '',
                ignition: isActive ? 'bg-ignition-primary/20 text-ignition-primary border border-ignition-primary/30' : '',
              };
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? activeStyles[item.color as keyof typeof activeStyles]
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <select
              value={pathname}
              onChange={(e) => {
                window.location.href = e.target.value;
              }}
              className="px-3 py-2 rounded-lg bg-background-secondary border border-border-primary text-text-primary text-sm"
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}

