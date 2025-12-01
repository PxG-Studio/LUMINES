/**
 * 🎮 My Projects 404 Placeholder
 * 
 * Coming soon page for LumenForge.io project management
 * Uses locked design system tokens
 */

import { motion } from 'framer-motion';
import { Folder, Gamepad2, Layers, ArrowLeft } from 'lucide-react';

export function MyProjects404() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1A0B2E] via-[#16213E] to-[#0F0F23]" />
      
      {/* Animated Orb */}
      <motion.div
        className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-[#F5B914]/20 to-[#FF6B35]/20 blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ right: '20%', top: '25%' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            <Folder className="w-24 h-24 text-[#F5B914]" strokeWidth={1.5} />
            <motion.div
              className="absolute inset-0 bg-[#F5B914] blur-2xl opacity-40"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl sm:text-7xl font-extrabold text-white mb-6"
          style={{ lineHeight: 1.2 }}
        >
          My Projects
          <br />
          <span className="bg-gradient-to-r from-[#F5B914] to-[#FF6B35] bg-clip-text text-transparent">
            Coming Soon
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-white/70 mb-12 max-w-2xl mx-auto"
          style={{ lineHeight: 1.8 }}
        >
          Your personal creative dashboard is being forged. Manage Unity projects, Pico-8 games, and Lua scripts all in one place.
        </motion.p>

        {/* Feature Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
        >
          {[
            { 
              icon: Gamepad2, 
              title: 'Game Projects', 
              desc: 'Unity, Pico-8, Godot',
              color: '#A64DFF' 
            },
            { 
              icon: Layers, 
              title: 'Version Control', 
              desc: 'Git integration',
              color: '#47E0FF' 
            },
            { 
              icon: Folder, 
              title: 'Cloud Sync', 
              desc: 'Auto-save & backup',
              color: '#4CFF8A' 
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <item.icon className="w-10 h-10 mb-4 mx-auto" style={{ color: item.color }} />
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-white/60 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-8 max-w-2xl mx-auto"
        >
          <div className="grid grid-cols-2 gap-4">
            {['Unity Roguelike', 'Pico-8 Shooter', 'Lua Puzzle Game', 'Godot Platformer'].map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 text-left"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#F5B914] to-[#FF6B35] rounded mb-2 opacity-50" />
                <p className="text-white/80 text-sm font-medium">{name}</p>
                <p className="text-white/40 text-xs mt-1">Last edited: Soon</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F5B914] to-[#FF6B35] text-black font-semibold rounded-xl hover:shadow-glow-amber transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </a>
        </motion.div>

        {/* Coming Soon Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-12"
        >
          <span className="inline-block px-4 py-2 bg-[#F5B914]/20 border border-[#F5B914]/30 rounded-full text-[#F5B914] text-sm font-medium">
            🎮 Launching This Week
          </span>
        </motion.div>
      </div>
    </div>
  );
}

