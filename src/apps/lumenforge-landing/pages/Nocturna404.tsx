/**
 * 🌙 Nocturna.design 404 Placeholder
 * 
 * Coming soon page for Nocturna Design ecosystem
 * Uses locked design system tokens with cosmic theme
 */

import { motion } from 'framer-motion';
import { Moon, Sparkles, ArrowLeft } from 'lucide-react';

export function Nocturna404() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1A0B2E] via-[#0F0F23] to-[#16213E]" />
      
      {/* Dual Animated Orbs */}
      <motion.div
        className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-[#A64DFF]/20 to-[#4C4BFF]/15 blur-3xl"
        animate={{
          x: [0, 150, 0],
          y: [0, -80, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ left: '10%', top: '20%' }}
      />
      
      <motion.div
        className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-[#F5B914]/15 to-[#A64DFF]/20 blur-3xl"
        animate={{
          x: [0, -120, 0],
          y: [0, 60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        style={{ right: '15%', bottom: '25%' }}
      />

      {/* Twinkling Stars */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.9, 0.1],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            <Moon className="w-24 h-24 text-[#A64DFF]" strokeWidth={1.5} />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity },
              }}
            >
              <Sparkles className="w-8 h-8 text-[#F5B914]" />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-[#A64DFF] blur-2xl opacity-40"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl sm:text-7xl font-extrabold text-white mb-6"
          style={{ lineHeight: 1.2 }}
        >
          Nocturna
          <br />
          <span className="bg-gradient-to-r from-[#A64DFF] via-[#F5B914] to-[#47E0FF] bg-clip-text text-transparent">
            Design Ecosystem
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl text-[#A64DFF] font-medium mb-4"
        >
          Weaving Art, Code, and Cognition
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-xl text-white/70 mb-12 max-w-2xl mx-auto"
          style={{ lineHeight: 1.8 }}
        >
          A Studio PxG initiative. The Nocturna Ecosystem connects creative tools, AI intelligence, and human artistry into one unified platform.
        </motion.p>

        {/* Ecosystem Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
        >
          {[
            { name: 'LUNA', color: '#47E0FF', desc: 'AI Core' },
            { name: 'NERVA', color: '#4CFF8A', desc: 'Event Bus' },
            { name: 'SPARK', color: '#F5B914', desc: 'Creative IDE' },
            { name: 'IGNIS', color: '#FF6B35', desc: 'Runtime' },
          ].map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + i * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 0 30px ${item.color}40`,
              }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div 
                className="w-3 h-3 rounded-full mx-auto mb-3"
                style={{ 
                  backgroundColor: item.color,
                  boxShadow: `0 0 20px ${item.color}80`,
                }}
              />
              <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
              <p className="text-white/50 text-xs">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Visual Separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="w-full max-w-md mx-auto h-px bg-gradient-to-r from-transparent via-[#A64DFF] to-transparent mb-12"
        />

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {['Design System', 'Component Library', 'Token Management', 'Theme Engine'].map((feature, i) => (
            <motion.span
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.9 + i * 0.1 }}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm backdrop-blur-sm"
            >
              {feature}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1 }}
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#A64DFF] to-[#F5B914] text-white font-semibold rounded-xl hover:shadow-glow-purple transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to LumenForge
          </a>
        </motion.div>

        {/* Coming Soon Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3 }}
          className="mt-12"
        >
          <span className="inline-block px-4 py-2 bg-[#A64DFF]/20 border border-[#A64DFF]/30 rounded-full text-[#A64DFF] text-sm font-medium">
            🌙 Launching This Week
          </span>
        </motion.div>

        {/* Studio PxG Signature */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-8 text-white/40 text-sm"
        >
          A <span className="text-white/60 font-medium">Studio PxG</span> Initiative
        </motion.p>
      </div>
    </div>
  );
}

