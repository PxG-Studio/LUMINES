import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Video } from 'lucide-react';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { GradientButton } from '../components/GradientButton';

const Demo404: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <FloatingOrbs />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-blue-950/20 to-cyan-950/20 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12"
      >
        <Video className="w-16 h-16 text-purple-400 mx-auto mb-6" />
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          Demo Theater Under Construction
        </h2>
        <p className="text-white/70 text-lg mb-8">
          The LumenForge.io demo experience is still being crafted in the forge.
          Soon you'll witness the full power of AI-powered creative development in action!
        </p>

        <div className="space-y-4">
          <GradientButton
            onClick={() => window.location.href = '/'}
            className="w-full md:w-auto px-8 py-3 text-lg"
          >
            <Rocket className="inline-block mr-2" /> Back to LumenForge.io
          </GradientButton>
          <div className="text-sm text-white/50 mt-4">
            <p>Coming Soon:</p>
            <div className="flex justify-center items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30">Interactive Demo</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">Live Coding</span>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs border border-cyan-500/30">AI Showcase</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Demo404;
