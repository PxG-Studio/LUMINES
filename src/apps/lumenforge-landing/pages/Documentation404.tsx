/**
 * 📚 Documentation 404 Placeholder
 * 
 * Coming soon page for LumenForge.io documentation
 * Uses locked design system tokens
 */

import { motion } from 'framer-motion';
import { BookOpen, Code, Rocket, ArrowLeft } from 'lucide-react';

export function Documentation404() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1A0B2E] via-[#16213E] to-[#0F0F23]" />
      
      {/* Animated Orb */}
      <motion.div
        className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-[#47E0FF]/20 to-[#A64DFF]/20 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ left: '20%', top: '30%' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            <BookOpen className="w-24 h-24 text-[#47E0FF]" strokeWidth={1.5} />
            <motion.div
              className="absolute inset-0 bg-[#47E0FF] blur-2xl opacity-30"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
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
          Documentation
          <br />
          <span className="bg-gradient-to-r from-[#47E0FF] to-[#A64DFF] bg-clip-text text-transparent">
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
          We're crafting comprehensive guides, API references, and tutorials to help you master LumenForge.io.
          Check back soon!
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
        >
          {[
            { icon: Code, title: 'API Docs', color: '#F5B914' },
            { icon: BookOpen, title: 'Guides', color: '#47E0FF' },
            { icon: Rocket, title: 'Tutorials', color: '#A64DFF' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <item.icon className="w-8 h-8 mb-3 mx-auto" style={{ color: item.color }} />
              <h3 className="text-white font-semibold">{item.title}</h3>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#47E0FF] to-[#A64DFF] text-white font-semibold rounded-xl hover:shadow-glow-cyan transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </a>
        </motion.div>

        {/* Coming Soon Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12"
        >
          <span className="inline-block px-4 py-2 bg-[#47E0FF]/20 border border-[#47E0FF]/30 rounded-full text-[#47E0FF] text-sm font-medium">
            📅 Launching This Week
          </span>
        </motion.div>
      </div>
    </div>
  );
}

