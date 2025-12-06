import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Code,
  Palette,
  Globe,
  Users,
  Star,
  Github,
  FileCode,
} from 'lucide-react';

/**
 * bolt.new Landing Page - EXACT MIRROR
 * 
 * Complete visual replication of https://bolt.new/
 * - Gradient backgrounds with animated mesh
 * - Glass morphism effects
 * - Rotating headline words
 * - Floating orbs/particles
 * - Cursor glow effect
 * - Scroll-triggered animations
 * - Feature cards with 3D hover
 * - Live preview mockup
 * - Social proof section
 */

export default function BoltLandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Animated Background */}
      <BackgroundEffects mousePosition={mousePosition} />

      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Preview Section */}
      <PreviewSection />

      {/* Templates Section */}
      <TemplatesSection />

      {/* Social Proof */}
      <SocialProofSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />

      {/* Cursor Glow */}
      <CursorGlow position={mousePosition} />
    </div>
  );
}

// ============================================
// BACKGROUND EFFECTS
// ============================================

const BackgroundEffects: React.FC<{ mousePosition: { x: number; y: number } }> = () => {
  return (
    <>
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb
          color="from-[#667eea] to-[#764ba2]"
          delay={0}
          size="lg"
          startX={20}
          startY={10}
        />
        <FloatingOrb
          color="from-[#f093fb] to-[#f5576c]"
          delay={2}
          size="md"
          startX={80}
          startY={30}
        />
        <FloatingOrb
          color="from-[#4facfe] to-[#00f2fe]"
          delay={4}
          size="xl"
          startX={50}
          startY={60}
        />
        <FloatingOrb
          color="from-[#43e97b] to-[#38f9d7]"
          delay={6}
          size="md"
          startX={10}
          startY={80}
        />
        <FloatingOrb
          color="from-[#fa709a] to-[#fee140]"
          delay={8}
          size="lg"
          startX={90}
          startY={90}
        />
      </div>

      {/* Animated Mesh Grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        animate={{
          x: [0, 50],
          y: [0, 50],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(102,126,234,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(118,75,162,0.15)_0%,transparent_50%)]" />
    </>
  );
};

const FloatingOrb: React.FC<{
  color: string;
  delay: number;
  size: 'md' | 'lg' | 'xl';
  startX: number;
  startY: number;
}> = ({ color, delay, size, startX, startY }) => {
  const sizeClasses = {
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-[32rem] h-[32rem]',
  };

  return (
    <motion.div
      className={`absolute ${sizeClasses[size]} rounded-full bg-gradient-to-br ${color} blur-3xl`}
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
      }}
      animate={{
        x: [0, Math.random() * 200 - 100, 0],
        y: [0, Math.random() * 200 - 100, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
};

const CursorGlow: React.FC<{ position: { x: number; y: number } }> = ({ position }) => {
  return (
    <motion.div
      className="pointer-events-none fixed w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
      style={{
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.6) 0%, transparent 70%)',
        left: position.x - 300,
        top: position.y - 300,
      }}
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// ============================================
// NAVIGATION
// ============================================

const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            LumenForge
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">
            Features
          </a>
          <a href="#templates" className="text-sm text-white/70 hover:text-white transition-colors">
            Templates
          </a>
          <a href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#docs" className="text-sm text-white/70 hover:text-white transition-colors">
            Docs
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors">
            Sign In
          </button>
          <button className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

// ============================================
// HERO SECTION
// ============================================

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24">
      <div className="max-w-5xl mx-auto text-center">
        {/* Main Headline with Rotating Word */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-white">What will you </span>
          <RotatingWordDisplay />
          <span className="text-white"> today?</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Create stunning apps & websites by chatting with AI.
        </motion.p>

        {/* Prompt Input */}
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <HeroPromptInput />
        </motion.div>

        {/* Import Options */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-4 flex-wrap"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span className="text-sm text-white/50">or import from</span>
          <ImportButton icon="figma">Figma</ImportButton>
          <ImportButton icon="github">GitHub</ImportButton>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-8 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <TrustBadge icon={<Star className="w-5 h-5 text-yellow-400" />} text="4.9/5 Rating" />
          <TrustBadge icon={<Users className="w-5 h-5 text-blue-400" />} text="100K+ Developers" />
          <TrustBadge icon={<Zap className="w-5 h-5 text-purple-400" />} text="1M+ Apps Created" />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 bg-white/50 rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

// Rotating Word Component
const RotatingWordDisplay: React.FC = () => {
  const words = ['build', 'create', 'design', 'ship', 'launch', 'code'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block">
      <motion.span
        key={words[index]}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="inline-block bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] bg-clip-text text-transparent relative"
        style={{
          backgroundSize: '200% auto',
        }}
      >
        {words[index]}
        {/* Animated underline */}
        <motion.span
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
      </motion.span>
    </span>
  );
};

// Hero Prompt Input with Glass Morphism
const HeroPromptInput: React.FC = () => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="relative max-w-3xl mx-auto"
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Animated Gradient Border */}
      <motion.div
        className="absolute -inset-[2px] bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#667eea] rounded-2xl opacity-0 blur-sm"
        animate={{
          opacity: isFocused ? 1 : 0,
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          opacity: { duration: 0.3 },
          backgroundPosition: { duration: 3, repeat: Infinity },
        }}
        style={{ backgroundSize: '200% auto' }}
      />

      {/* Input Container */}
      <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your idea... (e.g., 'A todo app with dark mode')"
          className="flex-1 bg-transparent text-white text-lg md:text-xl px-6 md:px-8 py-5 md:py-6 outline-none placeholder:text-white/40"
        />

        {/* Submit Button */}
        <motion.button
          className="m-2 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(102, 126, 234, 0.5)',
              '0 0 40px rgba(102, 126, 234, 0.8)',
              '0 0 20px rgba(102, 126, 234, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Import Buttons
const ImportButton: React.FC<{ icon: string; children: React.ReactNode }> = ({
  icon,
  children,
}) => {
  const icons = {
    figma: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" />
        <path d="M4 20a4 4 0 0 1 4-4h4v4a4 4 0 1 1-8 0z" />
        <path d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" />
        <path d="M4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" />
        <path d="M12 0h4a4 4 0 1 1 0 8h-4V0z" />
      </svg>
    ),
    github: <Github className="w-4 h-4" />,
  };

  return (
    <motion.button
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-sm font-medium text-white/90 transition-all"
      whileHover={{
        y: -4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      }}
      whileTap={{ y: -2 }}
    >
      {icons[icon as keyof typeof icons]}
      <span>{children}</span>
    </motion.button>
  );
};

// Trust Badge
const TrustBadge: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-2 text-white/70">
      {icon}
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

// ============================================
// FEATURES SECTION
// ============================================

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: 'AI-Powered',
      description: 'Generate complete applications with natural language. No templates needed.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'Lightning Fast',
      description: 'Instant preview and deployment. See your changes in real-time.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Palette className="w-7 h-7" />,
      title: 'Design Systems',
      description: 'Import your Figma designs and maintain brand consistency.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Code className="w-7 h-7" />,
      title: 'Full Stack',
      description: 'Frontend, backend, database - everything you need in one place.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: 'Instant Deploy',
      description: 'One-click deployment to production. Share your work instantly.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Collaborate',
      description: 'Work together in real-time. Share, review, and build as a team.',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <FadeInSection>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                build faster
              </span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Stop wrestling with setup and configuration. Start building immediately.
            </p>
          </div>
        </FadeInSection>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{ feature: any; index: number }> = ({ feature, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 60, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative p-8 bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 cursor-pointer"
      whileHover={{
        y: -8,
        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
      }}
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 rounded-2xl transition-all duration-300" />

      {/* Icon */}
      <div
        className={`relative w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300`}
      >
        {feature.icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
      <p className="text-white/60 leading-relaxed text-sm">{feature.description}</p>

      {/* Hover Arrow */}
      <motion.div
        className="mt-4 flex items-center gap-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
      >
        <span className="text-sm font-medium">Learn more</span>
        <ArrowRight className="w-4 h-4" />
      </motion.div>
    </motion.div>
  );
};

// ============================================
// PREVIEW SECTION
// ============================================

const PreviewSection: React.FC = () => {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              See it in action
            </h2>
            <p className="text-lg text-white/60">
              From idea to deployed app in seconds
            </p>
          </div>
        </FadeInSection>

        <FadeInSection>
          {/* Browser Window Mockup */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              {/* Browser Chrome */}
              <div className="h-12 bg-white/[0.03] border-b border-white/[0.08] flex items-center px-4 gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 mx-8 h-7 bg-white/5 rounded-lg flex items-center px-3">
                  <span className="text-xs text-white/40">https://your-app.bolt.new</span>
                </div>
              </div>

              {/* Preview Content */}
              <div className="aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
                <LiveCodePreview />
              </div>
            </div>

            {/* Floating Elements */}
            <FloatingCodeBlock code="npm create bolt" delay={0} x={-100} y={50} />
            <FloatingCodeBlock code="<App />" delay={1} x={100} y={100} />
            <FloatingCodeBlock code="🚀 Deployed!" delay={2} x={-50} y={200} />
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

const LiveCodePreview: React.FC = () => {
  return (
    <div className="h-full grid grid-cols-2 gap-4">
      {/* Left: Chat */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-400">AI Assistant</span>
        </div>
        <div className="space-y-3">
          <ChatBubble role="user">Create a todo app with dark mode</ChatBubble>
          <ChatBubble role="assistant">Creating your todo app with React...</ChatBubble>
        </div>
      </div>

      {/* Right: Code */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 font-mono text-sm">
        <div className="flex items-center gap-2 mb-3">
          <FileCode className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-gray-400">App.tsx</span>
        </div>
        <pre className="text-gray-300">
          <code>{`export function TodoApp() {
  return (
    <div className="app">
      <h1>My Todos</h1>
    </div>
  );
}`}</code>
        </pre>
      </div>
    </div>
  );
};

const ChatBubble: React.FC<{ role: 'user' | 'assistant'; children: React.ReactNode }> = ({
  role,
  children,
}) => {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`px-4 py-2 rounded-lg text-sm max-w-[80%] ${
          role === 'user'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-700/50 text-gray-200'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const FloatingCodeBlock: React.FC<{ code: string; delay: number; x: number; y: number }> = ({
  code,
  delay,
  x,
  y,
}) => {
  return (
    <motion.div
      className="absolute px-4 py-2 bg-purple-600/20 backdrop-blur-md border border-purple-500/30 rounded-lg text-sm font-mono text-purple-300 shadow-lg"
      style={{ right: x > 0 ? `${x}px` : 'auto', left: x < 0 ? `${Math.abs(x)}px` : 'auto', top: `${y}px` }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.8, 1, 1, 0.8],
        y: [20, 0, 0, -20],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        repeatDelay: 6,
      }}
    >
      {code}
    </motion.div>
  );
};

// ============================================
// TEMPLATES SECTION
// ============================================

const TemplatesSection: React.FC = () => {
  const templates = [
    {
      title: 'React Dashboard',
      description: 'Modern admin dashboard with charts and analytics',
      tags: ['React', 'TypeScript', 'Tailwind'],
      preview: '🎨',
    },
    {
      title: 'Next.js Blog',
      description: 'SEO-optimized blog with markdown support',
      tags: ['Next.js', 'MDX', 'Vercel'],
      preview: '📝',
    },
    {
      title: 'Vue E-commerce',
      description: 'Full-featured online store with cart and checkout',
      tags: ['Vue', 'Stripe', 'Supabase'],
      preview: '🛒',
    },
    {
      title: 'SaaS Landing',
      description: 'Conversion-optimized landing page template',
      tags: ['React', 'Framer', 'SEO'],
      preview: '🚀',
    },
  ];

  return (
    <section className="relative py-32 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Start with a template
            </h2>
            <p className="text-lg text-white/60">
              Or customize any template with AI
            </p>
          </div>
        </FadeInSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template, index) => (
            <TemplateCard key={index} template={template} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TemplateCard: React.FC<{ template: any; index: number }> = ({ template, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 60, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300">
        {/* Preview */}
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
          {template.preview}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-white mb-2">{template.title}</h3>
          <p className="text-sm text-white/60 mb-4">{template.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8"
          initial={false}
        >
          <button className="px-6 py-3 bg-white/90 text-gray-900 font-medium rounded-lg hover:bg-white transition-colors">
            Use Template
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================
// SOCIAL PROOF
// ============================================

const SocialProofSection: React.FC = () => {
  const stats = [
    { number: '100K+', label: 'Active Developers' },
    { number: '1M+', label: 'Apps Created' },
    { number: '50M+', label: 'Lines of Code' },
    { number: '99.9%', label: 'Uptime' },
  ];

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <FadeInSection key={index}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// FINAL CTA SECTION
// ============================================

const CTASection: React.FC = () => {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <FadeInSection>
          <motion.div
            className="relative p-12 md:p-16 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border border-white/10 rounded-3xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />

            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to build something amazing?
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Join thousands of developers creating apps with AI. No credit card required.
              </p>

              <motion.button
                className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl shadow-2xl shadow-purple-500/50"
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(102, 126, 234, 0.8)' }}
                whileTap={{ scale: 0.98 }}
              >
                Start Building Now
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </FadeInSection>
      </div>
    </section>
  );
};

// ============================================
// FOOTER
// ============================================

const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-white/[0.08] bg-white/[0.02] py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        {/* Logo & Description */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              LumenForge
            </span>
          </div>
          <p className="text-sm text-white/50 leading-relaxed">
            AI-powered game development platform. Build, test, and deploy games faster than ever.
          </p>
        </div>

        {/* Links */}
        <FooterLinks title="Product" links={['Features', 'Templates', 'Pricing', 'Changelog']} />
        <FooterLinks title="Resources" links={['Documentation', 'Tutorials', 'Blog', 'Community']} />
        <FooterLinks title="Company" links={['About', 'Careers', 'Contact', 'Legal']} />
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/40">© 2025 LumenForge. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-white/40 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="text-white/40 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

const FooterLinks: React.FC<{ title: string; links: string[] }> = ({ title, links }) => {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((link, i) => (
          <li key={i}>
            <a
              href="#"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================
// UTILITY COMPONENTS
// ============================================

const FadeInSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 60, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

