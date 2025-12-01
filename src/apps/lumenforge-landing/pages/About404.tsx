/**
 * 💫 About 404 Placeholder
 * 
 * Coming soon page for LumenForge.io About section
 * Uses locked design system tokens
 */

import { motion } from 'framer-motion';
import { Sparkles, Users, Target, ArrowLeft } from 'lucide-react';

export function About404() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1A0B2E] via-[#16213E] to-[#0F0F23]" />
      
      {/* Animated Orb */}
      <motion.div
        className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-[#F5B914]/20 to-[#A64DFF]/20 blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, -60, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ left: '30%', top: '25%' }}
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
            <Sparkles className="w-24 h-24 text-[#F5B914]" strokeWidth={1.5} />
            <motion.div
              className="absolute inset-0 bg-[#F5B914] blur-2xl opacity-40"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
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
          About LumenForge
          <br />
          <span className="bg-gradient-to-r from-[#F5B914] via-[#47E0FF] to-[#A64DFF] bg-clip-text text-transparent">
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
          Discover the story behind LumenForge.io, our mission to empower indie gamedevs, and the Studio PxG team bringing it to life.
        </motion.p>

        {/* Preview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
        >
          {[
            { 
              icon: Target, 
              title: 'Our Mission', 
              desc: 'Empower indie gamedevs',
              color: '#F5B914' 
            },
            { 
              icon: Users, 
              title: 'The Team', 
              desc: 'Studio PxG creators',
              color: '#47E0FF' 
            },
            { 
              icon: Sparkles, 
              title: 'Our Vision', 
              desc: 'Creative intelligence',
              color: '#A64DFF' 
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

        {/* Story Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-8 max-w-2xl mx-auto text-left"
        >
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="text-2xl font-bold text-white mb-4"
          >
            The LumenForge Story
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3 }}
            className="text-white/70 mb-3"
            style={{ lineHeight: 1.8 }}
          >
            Born from the fusion of <span className="text-[#F5B914] font-medium">Studio PxG's</span> creative vision and 
            the <span className="text-[#A64DFF] font-medium">Nocturna Ecosystem's</span> technical prowess...
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
            className="text-white/60 text-sm italic"
          >
            Full story coming this week. 🚀
          </motion.p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F5B914] to-[#A64DFF] text-white font-semibold rounded-xl hover:shadow-glow-amber transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </a>
        </motion.div>

        {/* Coming Soon Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          className="mt-12"
        >
          <span className="inline-block px-4 py-2 bg-[#F5B914]/20 border border-[#F5B914]/30 rounded-full text-[#F5B914] text-sm font-medium">
            ✨ Launching This Week
          </span>
        </motion.div>

        {/* Studio PxG Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
          className="mt-6"
        >
          <p className="text-white/40 text-sm">
            A <span className="text-white/60 font-medium">Studio PxG</span> × <span className="text-[#A64DFF] font-medium">Nocturna</span> Collaboration
          </p>
        </motion.div>
      </div>
    </div>
  );
}

