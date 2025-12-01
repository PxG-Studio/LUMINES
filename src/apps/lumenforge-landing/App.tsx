import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  Code, 
  Flame, 
  Rocket,
  Brain,
  Globe,
  Shield,
  Play,
  Sparkles
} from 'lucide-react';

// Import our advanced components
import { GradientButton } from './components/GradientButton';
import { HeroPromptInput } from './components/HeroPromptInput';
import { FloatingOrbs } from './components/FloatingOrbs';
import { RotatingWord } from './components/RotatingWord';
import { StreamingText } from './components/StreamingText';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SkipLink } from './components/SkipLink';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ThemeToggle } from './components/ThemeToggle';
import { ToastContainer, useToast } from './components/Toast';
import { ConsentBanner } from './components/ConsentBanner';
import { sanitizeInput } from './utils/sanitize';
import { isMobileDevice, prefersReducedMotion, throttle } from './utils/performance';
import { supportsBackdropFilter } from './utils/browser';
import { DOMNodeMonitor, MemoryManager, PerformanceMonitor } from './utils/performance-advanced';
import { analytics } from './utils/analytics';
import { sessionStorage as safeSessionStorage } from './utils/storage';
import { useTranslation, Locale } from './utils/i18n';
import { defaultContent, HeroContent } from './utils/content';
import { fetchContent } from './utils/cms';
import { useExperiment } from './hooks/useExperiment';

// Throttle function moved to utils/performance.ts

function App() {
  // EC-001, EC-002: Fix state updates after unmount using refs
  const isMountedRef = useRef(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [siteContent, setSiteContent] = useState(defaultContent);
  const [contentError, setContentError] = useState<string | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);
  const { locale, setLocale, t } = useTranslation();
  const heroVariant = useExperiment({ id: 'hero-cta', variants: ['A', 'B'], enabled: true });
  const { toasts, info, error: showError, dismissToast } = useToast();

  // EC-003: Set mounted flag and cleanup
  // EC-178: Track page view
  // EC-LAND-101: Monitor DOM nodes
  // EC-LAND-111, EC-LAND-115: Memory management
  // EC-LAND-191: Performance monitoring
  useEffect(() => {
    isMountedRef.current = true;
    
    // Track page view
    analytics.pageView(window.location.pathname);
    
    // EC-LAND-101: Monitor DOM nodes
    DOMNodeMonitor.logNodeCount();
    
    // EC-LAND-191: Initialize performance monitoring
    PerformanceMonitor.monitorWebVitals();
    
    return () => {
      isMountedRef.current = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      // EC-LAND-111, EC-LAND-115: Cleanup resources
      MemoryManager.cleanup();
    };
  }, []);

  // EC-013: Throttle mouse position updates (60fps max)
  useEffect(() => {
    const handleMouseMove = throttle((e: MouseEvent) => {
      if (isMountedRef.current) {
        mousePositionRef.current = { x: e.clientX, y: e.clientY };
      }
    }, 1000 / 60); // 60fps max

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
    
  // EC-002, EC-004, EC-014: Fix scroll progress with proper validation and RAF
  useEffect(() => {
    const handleScroll = () => {
      if (rafIdRef.current !== null) return; // Skip if already scheduled
      
      rafIdRef.current = requestAnimationFrame(() => {
        if (!isMountedRef.current) {
          rafIdRef.current = null;
          return;
        }

        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScroll <= 0) {
          setScrollProgress(0);
          rafIdRef.current = null;
          return;
        }

        const currentScroll = window.scrollY;
        const progress = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
        setScrollProgress(progress);
        rafIdRef.current = null;
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  // EC-024, EC-178, EC-179: Handle async prompt submission with error handling and analytics
  const handlePromptSubmit = useCallback(async (prompt: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Track submission attempt
    analytics.track({
      name: 'project_submit_attempt',
      properties: { promptLength: prompt.length },
    });
    
    try {
      // Sanitize input - EC-146, EC-150, EC-158
      const sanitizedPrompt = sanitizeInput(prompt);
      if (!sanitizedPrompt) {
        throw new Error('Please enter a valid prompt');
      }

      console.log('Creating project:', sanitizedPrompt);
      // TODO: Integrate with LumenForge project creation
      // This will eventually connect to the SPARK IDE and LUNA AI
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Track successful submission
      analytics.track({
        name: 'project_submit_success',
        properties: { promptLength: sanitizedPrompt.length },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      setSubmitError(errorMessage);
      
      // Track error
      if (error instanceof Error) {
        analytics.error(error, { context: 'project_submit' });
      }
      
      analytics.track({
        name: 'project_submit_error',
        properties: { error: errorMessage },
      });
      
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  // EC-029: Memoize scroll progress to prevent unnecessary re-renders
  const throttledScrollProgress = useMemo(() => {
    return Math.min(100, Math.max(0, scrollProgress));
  }, [scrollProgress]);
  const heroTitle = t('hero.title') || siteContent.hero.headline;
  const heroSubtitle = t('hero.subtitle') || siteContent.hero.subheadline;
  const heroDescription = siteContent.hero.description;
  const primaryCtaText =
    heroVariant === 'A'
      ? t('hero.primaryCta') || 'Start Building Now'
      : t('hero.primaryCtaAlt') || 'Launch with LumenForge';
  const promptPlaceholder =
    heroVariant === 'A'
    ? "Describe your game... e.g., 'Unity card game with ScriptableObjects'"
    : "What should we build together? e.g., 'AI co-op builder for Roblox'";

  useEffect(() => {
    let active = true;
    
    // Suppress content update notifications in Storybook
    const isStorybook = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' && window.location.port === '6006' ||
      window.parent !== window && window.parent.location?.href?.includes('storybook')
    );
    
    fetchContent(locale)
      .then((content) => {
        if (!active) return;
        setSiteContent(content);
        setContentError(null);
        if (!isStorybook) {
          info(`Content updated for ${locale.toUpperCase()}`);
        }
      })
      .catch(() => {
        if (!active) return;
        setContentError('Unable to load content');
        if (!isStorybook) {
          showError('Unable to load latest content');
        }
      });

    return () => {
      active = false;
    };
  }, [locale]); // Only depend on locale - info/showError are stable function references

  return (
    <ErrorBoundary>
      <SkipLink />
      <OfflineIndicator />
      <div className="relative min-h-screen overflow-hidden bg-[#0A0A0A]" id="main-content" role="main">
        {/* Scroll Progress Indicator - Cognitive Flow Enhancement - EC-029 */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F5B914] via-[#47E0FF] to-[#A64DFF] z-[100] origin-left"
          style={{ scaleX: throttledScrollProgress / 100 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: throttledScrollProgress / 100 }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
          aria-label="Scroll progress"
          role="progressbar"
          aria-valuenow={Math.round(throttledScrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      
      {/* Dynamic Background with Forge Glow */}
      <BackgroundLayer />
      
      {/* Navigation */}
      <Header locale={locale} onLocaleChange={setLocale} />
      
      {/* Hero Section - DNA: First Impression Clarity */}
      <HeroSection
        onSubmit={handlePromptSubmit}
        isSubmitting={isSubmitting}
        hero={{
          headline: heroTitle,
          subheadline: heroSubtitle,
          description: heroDescription,
        }}
        primaryCta={primaryCtaText}
        placeholder={promptPlaceholder}
        contentError={contentError}
      />
      
      {/* Narrative Bridge: Hero → Spark */}
      <NarrativeBridge />
      
      {/* Narrative Flow: Spark/LUNA intro */}
      <SparkLunaSection />
      
      {/* Narrative Bridge: Spark → Ignis */}
      <NarrativeBridge />
      
      {/* Ignis/NEC Section */}
      <IgnisNECSection />
      
      {/* Narrative Bridge: Ignis → NERVA */}
      <NarrativeBridge />
      
      {/* NERVA/FluxRunner Section */}
      <NervaFluxSection />
      
      {/* Narrative Bridge: NERVA → CTA */}
      <NarrativeBridge />
      
      {/* CTA Section - DNA: Magnetic & Immediate */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
      
        {/* Interactive Elements - EC-020: Use ref for mouse position */}
        <InteractiveElements mousePosition={mousePositionRef.current} />
        
        {/* Loading state - EC-019, EC-021, EC-022 */}
        {isSubmitting && (
          <LoadingSpinner
            text="Creating your project..."
            fullScreen={false}
            className="fixed bottom-4 left-4 z-[200]"
          />
        )}
        
        {/* Error message display - EC-024, EC-025, EC-026 */}
        {submitError && (
          <ErrorMessage
            message={submitError}
            onDismiss={() => setSubmitError(null)}
            type="error"
            autoDismiss={true}
            dismissAfter={5000}
          />
        )}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} position="top-right" />
        <ConsentBanner />
      </div>
    </ErrorBoundary>
  );
}

// Star Field Component - EC-028: Optimized with pre-calculated values
function StarField({ count }: { count: number }) {
  // Pre-calculate all star positions and animations once
  const stars = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 opacity-20 pointer-events-none" aria-hidden="true">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
}

// Background Layer Component - DNA: Emotional Resonance
// EC-028: Optimize star field for mobile
// EC-116: Respect reduced motion preference
function BackgroundLayer() {
  const isMobile = isMobileDevice();
  const reduceMotion = prefersReducedMotion();
  const starCount = isMobile ? 20 : 50; // EC-028: Reduce stars on mobile
  
  // EC-116: Disable animations if user prefers reduced motion
  if (reduceMotion) {
    return (
      <>
        <div className="fixed inset-0 bg-gradient-to-br from-[#1A0B2E] via-[#16213E] to-[#0F0F23]" />
        <FloatingOrbs count={0} />
      </>
    );
  }

  return (
    <>
      {/* Main Gradient with Forge Glow */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1A0B2E] via-[#16213E] to-[#0F0F23]" />
      
      {/* Animated Orbs */}
      <FloatingOrbs count={isMobile ? 2 : 5} />
      
      {/* Forge Glow - Pulsing ambient gradients */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Golden Forge Glow */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#F5B914]/15 via-[#FFD659]/10 to-transparent blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ left: '5%', top: '15%' }}
        />
        
        {/* Indigo Pulse */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#4C4BFF]/15 to-[#47E0FF]/10 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 80, 0],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{ right: '10%', top: '40%' }}
        />
        
        {/* Violet Ambient */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#A64DFF]/12 to-[#F5B914]/8 blur-2xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 0.9, 1],
            opacity: [0.12, 0.18, 0.12],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{ left: '40%', bottom: '20%' }}
        />
      </motion.div>
      
      {/* Subtle Star Field - EC-028: Optimized for performance */}
      <StarField count={starCount} />
      
      {/* Noise Texture */}
      <div className="fixed inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    </>
  );
}

// Header Component - DNA: CTA Structure
// EC-023, EC-101, EC-102, EC-121, EC-076: Add active state, accessibility, and browser compatibility
interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

function Header({ locale, onLocaleChange }: HeaderProps) {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const hasBackdropFilter = supportsBackdropFilter();
  
  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-8 py-5 bg-[#0A0A0A]/90 ${
        hasBackdropFilter ? 'backdrop-blur-xl' : 'bg-[#0A0A0A]'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      role="banner"
    >
      <nav className="max-w-[1200px] mx-auto flex items-center justify-between" role="navigation" aria-label="Main navigation">
        <motion.a
          href="/"
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
          aria-label="LumenForge.io Home"
        >
          <motion.div 
            className="w-12 h-12 bg-gradient-to-r from-[#F5B914] to-[#FFD659] rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
            aria-hidden="true"
          >
            <Flame className="w-7 h-7 text-[#1E1345]" />
          </motion.div>
          <span className="text-white font-bold text-2xl tracking-tight">LumenForge.io</span>
        </motion.a>
        
        <div className="hidden md:flex items-center space-x-6">
          <a 
            href="/about" 
            className={`text-base transition-colors duration-200 hover:text-white hover:underline underline-offset-4 decoration-[#F5B914] focus:outline-none focus:ring-2 focus:ring-[#F5B914] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded ${
              currentPath === '/about' ? 'text-white underline' : 'text-white/60'
            }`}
            aria-label="About LumenForge"
            aria-current={currentPath === '/about' ? 'page' : undefined}
          >
            About
          </a>
          <a 
            href="/projects" 
            className={`text-base transition-colors duration-200 hover:text-white hover:underline underline-offset-4 decoration-[#47E0FF] focus:outline-none focus:ring-2 focus:ring-[#47E0FF] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded ${
              currentPath === '/projects' ? 'text-white underline' : 'text-white/60'
            }`}
            aria-label="My Projects"
            aria-current={currentPath === '/projects' ? 'page' : undefined}
          >
            My Projects
          </a>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={locale}
            onChange={(e) => onLocaleChange(e.target.value as Locale)}
            className="bg-white/10 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#47E0FF]"
            aria-label="Select language"
          >
            {['en', 'es', 'fr', 'de', 'ja', 'zh'].map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}

interface HeroSectionProps {
  onSubmit: (prompt: string) => void;
  isSubmitting: boolean;
  hero: HeroContent;
  primaryCta: string;
  placeholder: string;
  contentError?: string | null;
}

// Hero Section Component - DNA: Visual Hierarchy + First Impression Clarity
// EC-108: Add proper heading structure and labels
// EC-019, EC-021, EC-022: Loading states
function HeroSection({ onSubmit, isSubmitting, hero, primaryCta, placeholder, contentError }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 pt-24" aria-labelledby="hero-heading">
      <div className="max-w-[1200px] mx-auto text-center space-y-12">
        {/* Main Headline - DNA: 2.5rem bold hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* H1 - Primary Headline - EC-107, EC-169 */}
          <h1 id="hero-heading" className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] tracking-tight">
            <RotatingWord 
              words={['Build', 'Forge', 'Create', 'Ignite']} 
              className="inline-block"
            />{' '}
            <span className="bg-gradient-to-r from-[#F5B914] via-[#FFD659] to-[#47E0FF] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(245,185,20,0.3)]">
              {hero.headline}
            </span>
          </h1>
          
          {/* DNA: One-line descriptor - IMMEDIATE CONTEXT */}
          <motion.p 
            className="text-xl sm:text-2xl lg:text-3xl text-white/90 font-medium max-w-4xl mx-auto"
            style={{ lineHeight: 1.6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {hero.subheadline}
          </motion.p>
          
          {/* Supporting copy with proper line height */}
          <motion.p 
            className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto"
            style={{ lineHeight: 1.8 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <StreamingText content={hero.description} speed={30} />
          </motion.p>
        </motion.div>
        
        {/* Hero Input - DNA: Higher in visual hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-4xl mx-auto pt-8"
        >
          <HeroPromptInput
            onSubmit={onSubmit}
            placeholder={placeholder}
            examples={[
              "Create a Pico-8 platformer with pixel-perfect physics",
              "Build a Unity 2D roguelike with procedural dungeon generation",
              "Make a Lua-based tower defense game for LÖVE2D",
              "Design a Unity shader for stylized cel-shading effects",
              "Create a Pico-8 bullet-hell shooter with particle effects",
              "Build a Unity character controller with wall-jump mechanics",
              "Make a Godot metroidvania with interconnected map system",
              "Design a Unity inventory system with drag-and-drop",
              "Create a Pico-8 racing game with drifting mechanics",
              "Build a Unity dialogue system with branching choices",
              "Make a Lua puzzle game with sokoban-style mechanics",
              "Design a Unity procedural terrain generator",
              "Create a Pico-8 rhythm game with beat detection",
              "Build a Unity AI pathfinding system with A* algorithm",
              "Make a GameMaker Studio twin-stick shooter",
              "Design a Unity pixel-art lighting system",
              "Create a Pico-8 dungeon crawler with turn-based combat",
              "Build a Unity farming sim with crop growth cycles",
              "Make a Lua endless runner with dynamic obstacles",
              "Design a Unity camera system with smooth follow and zoom",
              "Create a Pico-8 arcade-style space shooter",
              "Build a Unity crafting system with recipe combinations",
              "Make a Godot fishing game with physics-based casting",
              "Design a Unity quest system with objective tracking",
              "Create a Pico-8 snake game with modern twists",
              "Build a Unity boss battle with phase transitions",
              "Make a Lua card game with deck-building mechanics",
              "Design a Unity save/load system with cloud backup",
              "Create a Pico-8 maze generator with perfect algorithms",
              "Build a Unity multiplayer lobby with matchmaking",
              "Make a Godot visual novel engine with save points",
              "Design a Unity combat system with combo attacks",
              "Create a Pico-8 idle clicker with prestige mechanics",
              "Build a Unity pet simulation with AI behavior trees",
              "Make a Lua stealth game with line-of-sight detection",
              "Design a Unity weather system with dynamic effects",
              "Create a Pico-8 mini-golf game with wind physics",
              "Build a Unity skill tree system with unlockable abilities",
              "Make a GameMaker auto-battler with unit synergies",
              "Design a Unity day-night cycle with time-based events",
              "Create a Pico-8 breakout clone with power-ups",
              "Build a Unity procedural animation system with IK",
              "Make a Lua dungeon generator with BSP algorithm",
              "Design a Unity particle system for magic spells",
              "Create a Pico-8 turn-based strategy game",
              "Build a Unity achievement system with Steam integration",
              "Make a Godot physics-based puzzle platformer",
              "Design a Unity UI system with animated transitions",
              "Create a Pico-8 match-3 puzzle with cascade effects",
              "Build a Unity enemy spawner with wave difficulty scaling",
              "Make a Lua collision detection system with spatial hashing",
              "Design a Unity audio manager with dynamic music layers",
              "Create a Pico-8 zelda-like with sword combat",
              "Build a Unity loot system with rarity tiers",
              "Make a GameMaker bullet-time mechanic with slow-mo",
              "Design a Unity minimap system with fog of war",
              "Create a Pico-8 shoot-em-up with boss patterns",
              "Build a Unity narrative system with Ink integration",
              "Make a Lua state machine for game flow management",
              "Design a Unity post-processing stack for retro aesthetics"
            ]}
          />
        </motion.div>
        
        {/* DNA: Magnetic Primary CTA - Visually dominant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
        >
          <GradientButton 
            size="lg"
            variant="primary"
            onClick={() => {
              analytics.click('start_building_button', { location: 'hero' });
              onSubmit('Start Building Now');
            }}
            disabled={isSubmitting}
            loading={isSubmitting}
            className="bg-gradient-to-r from-[#F5B914] via-[#FFD659] to-[#F5B914] text-[#1E1345] text-lg font-bold px-10 py-6 hover:shadow-[0_0_60px_rgba(245,185,20,0.8)] transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F5B914] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
            icon={<Sparkles className="w-6 h-6" aria-hidden="true" />}
            iconPosition="left"
            aria-label="Start building with LumenForge.io"
          >
            {isSubmitting ? 'Creating...' : primaryCta}
          </GradientButton>
          
          <GradientButton 
            size="lg"
            variant="secondary"
            onClick={() => {
              analytics.click('view_demo_button', { location: 'hero' });
              window.open('/demo', '_blank');
            }}
            className="border-2 border-white/30 text-white text-lg px-10 py-6 hover:bg-white/10 hover:border-[#47E0FF] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#47E0FF] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
            icon={<Play className="w-6 h-6" aria-hidden="true" />}
            iconPosition="left"
            aria-label="Watch demo video"
          >
            View Demo
          </GradientButton>
        </motion.div>
        {contentError && (
          <p className="text-sm text-red-400" role="alert">
            {contentError}
          </p>
        )}
      </div>
    </section>
  );
}

// DNA: Narrative Flow - Spark/LUNA Section (Idea → Creation)
function SparkLunaSection() {
  return (
    <section className="relative py-20 sm:py-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-[1200px] mx-auto container-balanced">
        {/* Section Header with Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-white/50 tracking-wider uppercase mb-4">
            🧭 LumenForge.io Ecosystem → Creation Tools
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ lineHeight: 1.2 }}>
            From <span className="bg-gradient-to-r from-[#47E0FF] to-[#4C4BFF] bg-clip-text text-transparent">Idea</span> to{' '}
            <span className="bg-gradient-to-r from-[#F5B914] to-[#FFD659] bg-clip-text text-transparent">Reality</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto" style={{ lineHeight: 1.8 }}>
            Powered by LUNA AI and Spark IDE — the creative core of your development workflow
          </p>
        </motion.div>

        {/* Two-column alternating layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* SPARK Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5B914]/20 to-[#FFD659]/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-[#F5B914]/50 transition-all duration-500">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#F5B914] to-[#FFD659] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Code className="w-10 h-10 text-[#1E1345]" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">SPARK</h3>
                  <p className="text-[#F5B914] font-medium text-lg">AI IDE</p>
                </div>
              </div>
              <p className="text-white/80 text-lg mb-6" style={{ lineHeight: 1.8 }}>
                Intelligent development environment with natural language project creation. 
                Monaco-powered editor with AI-assisted coding and multi-language support.
              </p>
              <ul className="space-y-3" role="list">
                {['Natural language to code', 'Real-time AI assistance', 'Multi-language support', 'Smart autocomplete'].map((item, i) => (
                  <li key={i} className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-[#F5B914] rounded-full mr-3" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* LUNA Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#47E0FF]/20 to-[#4C4BFF]/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-[#47E0FF]/50 transition-all duration-500">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#47E0FF] to-[#4C4BFF] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">LUNA</h3>
                  <p className="text-[#47E0FF] font-medium text-lg">AI Creative Core</p>
                </div>
              </div>
              <p className="text-white/80 text-lg mb-6" style={{ lineHeight: 1.8 }}>
                Advanced AI orchestration for creative prompt engineering and intelligent code generation. 
                The brain behind every LumenForge.io creation.
              </p>
              <ul className="space-y-3" role="list">
                {['GPT-4 & Claude integration', 'Context-aware responses', 'Creative prompt engineering', 'Multi-modal reasoning'].map((item, i) => (
                  <li key={i} className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-[#47E0FF] rounded-full mr-3" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// DNA: Narrative Flow - Ignis/NEC Section (Runtime & Engine)
function IgnisNECSection() {
  return (
    <section className="relative py-20 sm:py-32 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-transparent via-[#1A0B2E]/30 to-transparent">
      <div className="max-w-[1200px] mx-auto container-balanced">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-white/50 tracking-wider uppercase mb-4">
            🧭 LumenForge.io Ecosystem → Runtime & Engine
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ lineHeight: 1.2 }}>
            <span className="bg-gradient-to-r from-[#FF6B35] to-[#F5B914] bg-clip-text text-transparent">Instant</span> Execution,{' '}
            <span className="bg-gradient-to-r from-[#4C4BFF] to-[#A64DFF] bg-clip-text text-transparent">Powerful</span> Runtime
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto" style={{ lineHeight: 1.8 }}>
            Run your code instantly with Ignis WebContainers and build games with NEC Unity runtime
          </p>
        </motion.div>

        {/* Two-column alternating layout (reversed) - Perfectly Symmetrical */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* IGNIS Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group lg:order-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/20 to-[#F5B914]/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-[#FF6B35]/50 transition-all duration-500 h-full flex flex-col">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#FF6B35] to-[#F5B914] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Flame className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">IGNIS</h3>
                  <p className="text-[#FF6B35] font-medium text-lg">Runtime Engine</p>
                </div>
              </div>
              <p className="text-white/80 text-lg mb-6 flex-1" style={{ lineHeight: 1.8 }}>
                WebContainer-powered execution environment with instant hot reload, 
                comprehensive debugging tools, and seamless NPM package integration.
              </p>
              <ul className="space-y-3 mt-auto" role="list">
                {['Instant code execution', 'Hot module replacement', 'Full NPM ecosystem', 'Browser-native runtime'].map((item, i) => (
                  <li key={i} className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-[#FF6B35] rounded-full mr-3" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* NEC Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative group lg:order-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#4C4BFF]/20 to-[#A64DFF]/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-[#A64DFF]/50 transition-all duration-500 h-full flex flex-col">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#4C4BFF] to-[#A64DFF] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">NEC</h3>
                  <p className="text-[#A64DFF] font-medium text-lg">Unity Runtime</p>
                </div>
              </div>
              <p className="text-white/80 text-lg mb-6 flex-1" style={{ lineHeight: 1.8 }}>
                Seamless Unity WebGL integration with full C# scripting support, 
                physics engine, and real-time game logic execution in the browser.
              </p>
              <ul className="space-y-3 mt-auto" role="list">
                {['Unity WebGL support', 'C# script execution', 'Physics & animations', 'Asset management'].map((item, i) => (
                  <li key={i} className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-[#A64DFF] rounded-full mr-3" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// DNA: Narrative Flow - NERVA/FluxRunner Section (Deployment & Ecosystem)
function NervaFluxSection() {
  return (
    <section className="relative py-20 sm:py-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-[1200px] mx-auto container-balanced">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-white/50 tracking-wider uppercase mb-4">
            🧭 LumenForge.io Ecosystem → Deployment & Orchestration
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ lineHeight: 1.2 }}>
            <span className="bg-gradient-to-r from-[#10B981] to-[#47E0FF] bg-clip-text text-transparent">Deploy</span> with Confidence,{' '}
            <span className="bg-gradient-to-r from-[#F5B914] to-[#FFD659] bg-clip-text text-transparent">Scale</span> Effortlessly
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto" style={{ lineHeight: 1.8 }}>
            Real-time synchronization and automated deployment for the complete platform
          </p>
        </motion.div>

        {/* Two-column alternating layout - Perfectly Symmetrical */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* NERVA Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#10B981]/20 to-[#47E0FF]/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-[#10B981]/50 transition-all duration-500 h-full flex flex-col">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#10B981] to-[#47E0FF] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">NERVA</h3>
                  <p className="text-[#10B981] font-medium text-lg">Event Bus</p>
                </div>
              </div>
              <p className="text-white/80 text-lg mb-6 flex-1" style={{ lineHeight: 1.8 }}>
                Real-time synchronization and telemetry across all platform components. 
                WebSocket-based event streaming for instant updates.
              </p>
              <ul className="space-y-3 mt-auto" role="list">
                {['Real-time sync', 'WebSocket streaming', 'Component telemetry', 'Event orchestration'].map((item, i) => (
                  <li key={i} className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-[#10B981] rounded-full mr-3" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* FLUXRUNNER Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5B914]/20 to-[#FFD659]/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-[#F5B914]/50 transition-all duration-500 h-full flex flex-col">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#F5B914] to-[#FFD659] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-10 h-10 text-[#1E1345]" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">FLUXRUNNER</h3>
                  <p className="text-[#F5B914] font-medium text-lg">CI/CD Pipeline</p>
                </div>
              </div>
              <p className="text-white/80 text-lg mb-6 flex-1" style={{ lineHeight: 1.8 }}>
                Automated deployment and verification with blockchain signature support. 
                One-click production deployment with rollback capabilities.
              </p>
              <ul className="space-y-3 mt-auto" role="list">
                {['One-click deployment', 'Automated verification', 'Blockchain signatures', 'Instant rollback'].map((item, i) => (
                  <li key={i} className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-[#F5B914] rounded-full mr-3" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// CTA Section Component - DNA: Magnetic & Immediate with Studio PxG Branding (10/10 Krug Polish)
function CTASection() {
  return (
    <section className="relative py-24 text-center bg-gradient-to-b from-indigo-950/20 via-amber-900/20 to-black">
      {/* Continuous Gradient Bridge - Studio PxG Forged Light */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#A64DFF]/5 via-[#F5B914]/8 to-[#000]/95" />
      
      {/* Subtle Card Edge Reflections */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent opacity-30" />
      
      <div className="max-w-[1200px] mx-auto text-center relative z-10 px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Main CTA Headline - Studio PxG Elegant Indie-AAA */}
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4" style={{ lineHeight: 1.2 }}>
            Ready to{' '}
            <span className="bg-gradient-to-r from-[#F5B914] to-[#FFD659] bg-clip-text text-transparent">
              Forge
            </span>{' '}
            the Future?
          </h2>
          
          {/* Supporting Copy - Krug's "Why Should I Care?" */}
          <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl mb-16 leading-relaxed">
            Join the creators, dreamers, and engineers shaping the next era of{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300 font-medium">AI-powered creative ecosystems</span> with{' '}
            <strong className="text-white">LumenForge.io</strong>.
          </p>
          
          {/* DNA: Primary CTA Dominance - Krug's "One Obvious Next Step" */}
          <div className="flex justify-center gap-4 mb-24">
            <GradientButton 
              size="lg"
              variant="primary"
              onClick={() => console.log('Get Started clicked')}
              className="bg-gradient-to-r from-[#F5B914] via-[#FFD659] to-[#F5B914] text-[#1E1345] text-sm font-semibold uppercase tracking-wide px-12 py-7 hover:shadow-[0_0_100px_rgba(245,185,20,1)] transition-all duration-500 hover:scale-110 relative overflow-hidden min-w-[180px]"
              icon={<Sparkles className="w-6 h-6" />}
              iconPosition="left"
              aria-label="Start building with LumenForge.io"
            >
              <span className="relative z-10">Start Building Now</span>
            </GradientButton>
            
            <GradientButton 
              size="lg"
              variant="secondary"
              onClick={() => console.log('View Demo clicked')}
              className="bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-semibold uppercase tracking-wide px-12 py-7 hover:bg-white/20 transition-all duration-500 hover:scale-105 min-w-[180px]"
              icon={<Play className="w-6 h-6" />}
              iconPosition="left"
              aria-label="Watch demo video"
            >
              View Demo
            </GradientButton>
          </div>

          {/* Enhanced Ecosystem Tagline - Living Energy */}
          <motion.p 
            className="text-sm text-sky-300/70 tracking-wide text-center mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
          >
            LumenForge.io is part of the{' '}
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="bg-gradient-to-r from-sky-300/90 via-cyan-400 to-sky-300/90 bg-[length:200%_auto] bg-clip-text text-transparent font-medium text-white/90"
            >
              Creative Technology Labs
            </motion.span>
            {' '}— a{' '}
            <motion.span
              animate={{
                backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: 4,
              }}
              className="bg-gradient-to-r from-amber-300/90 via-yellow-400 to-amber-300/90 bg-[length:200%_auto] bg-clip-text text-transparent font-medium text-white/90"
            >
              Studio PxG initiative
            </motion.span>
            {' '}weaving art, code, and cognition.
          </motion.p>

        </motion.div>
      </div>
    </section>
  );
}

// Enhanced Cinematic Footer - The Forge Breathes
// EC-010, EC-011, EC-018, EC-251: Fix audio ref, observer cleanup, sound state persistence
function Footer() {
  const [sound, setSound] = useState(() => {
    // EC-018: Load from sessionStorage with error handling
    return safeSessionStorage.get<string>('forge-sound-enabled') === 'true';
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const controls = useAnimation();

  // EC-018: Persist sound state with error handling
  useEffect(() => {
    safeSessionStorage.set('forge-sound-enabled', String(sound));
  }, [sound]);

  // EC-011: Proper observer cleanup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            controls.start('ignite');
            // EC-010: Null check before accessing
            if (sound && audioRef.current) {
              audioRef.current.play().catch(() => {
                // EC-251: Handle autoplay blocking gracefully
                console.log('Audio autoplay blocked. User interaction required.');
              });
            }
          } else {
            controls.start('cool');
            // EC-010: Null check before accessing
            if (audioRef.current) {
              audioRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.3 }
    );
    const footer = document.getElementById('forge-footer');
    if (footer) observer.observe(footer);
    return () => {
      observer.disconnect(); // EC-011: Ensure cleanup
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [controls, sound]);

  return (
    <motion.footer
      id="forge-footer"
      initial="cool"
      animate={controls}
      variants={{
        ignite: {
          background: 'linear-gradient(to bottom, #1e1b4b, #f59e0b33 40%, #0f172a 90%)',
        },
        cool: {
          background: 'linear-gradient(to bottom, transparent, #0f172a 20%, #000)',
        },
      }}
      transition={{ duration: 2, ease: 'easeInOut' }}
      className="relative text-center py-16 overflow-hidden"
    >
      {/* Floating Embers */}
        <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-400/70 blur-[1px]"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 20}%`,
            }}
            animate={{
              y: [-5, -100],
              opacity: [0.4, 0.8, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeInOut',
            }}
          />
        ))}
        </motion.div>
        

      {/* Footer Links - EC-102, EC-121, EC-265 */}
      <div className="flex justify-center gap-4 text-sm text-gray-500 mt-4 relative z-10" role="list">
        <a 
          href="https://nocturna.design" 
          className="hover:text-amber-300 transition focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded px-1"
          aria-label="Visit nocturna.design"
          target="_blank"
          rel="noopener noreferrer"
        >
          nocturna.design
        </a>
        <span className="text-gray-700" aria-hidden="true">•</span>
        <a 
          href="/docs" 
          className="hover:text-amber-300 transition focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded px-1"
          aria-label="View documentation"
        >
          Documentation
        </a>
        <span className="text-gray-700" aria-hidden="true">•</span>
        <a 
          href="https://studiopxg.com" 
          className="hover:text-amber-300 transition focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded px-1"
          aria-label="Visit Studio PxG"
          target="_blank"
          rel="noopener noreferrer"
        >
          Studio PxG
        </a>
      </div>

      {/* Copyright */}
      <p className="text-xs text-gray-300 mt-6 relative z-10">
        © 2025 Studio PxG · LumenForge.io — Spark & Ignis
        <br />
        The Creative Continuum · Igniting the Future of Creative Intelligence
      </p>

      {/* Audio Control - EC-101, EC-102, EC-120 */}
      <div className="absolute bottom-6 right-6 z-20">
        <audio 
          ref={audioRef} 
          src="/sounds/forge_ember.mp3" 
          preload="auto" 
          loop 
          muted={!sound}
          aria-label="Forge ambient sound"
          onError={(e) => {
            // Silently handle missing audio file (e.g., in Storybook)
            // The audio element will simply not play, which is fine for demo purposes
            const isStorybook = typeof window !== 'undefined' && (
              window.location.hostname === 'localhost' && window.location.port === '6006' ||
              window.parent !== window && window.parent.location?.href?.includes('storybook')
            );
            if (!isStorybook) {
              console.warn('Audio file not found: /sounds/forge_ember.mp3');
            }
          }}
        />
        <button
          type="button"
          onClick={() => setSound(!sound)}
          className="text-gray-500 hover:text-amber-400 transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded p-1"
          aria-label={sound ? 'Disable forge sound' : 'Enable forge sound'}
          aria-pressed={sound}
        >
          <span aria-hidden="true">{sound ? '🔊' : '🔇'}</span>
        </button>
      </div>
    </motion.footer>
  );
}

// Narrative Bridge Component - Smooth Section Transitions (10/10 Narrative Flow)
// EC-116: Respect reduced motion preference
function NarrativeBridge() {
  const reduceMotion = prefersReducedMotion();
  
  return (
    <motion.div
      className="relative h-32 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: reduceMotion ? 0 : 0.8 }}
    >
      {/* Flowing Particles - EC-116: Disable if reduced motion */}
      {!reduceMotion && (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-amber-400 to-purple-400 rounded-full"
              initial={{ x: -100, opacity: 0 }}
              animate={{
                x: 100,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
      
      {/* Gradient Line - EC-116: Respect reduced motion */}
      <motion.div
        className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduceMotion ? 0 : 1.2, ease: "easeOut" }}
      />
    </motion.div>
  );
}

// Interactive Elements Component - EC-020, EC-036: Use CSS transforms, throttle updates
function InteractiveElements({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-0"
      style={{
        left: mousePosition.x - 200,
        top: mousePosition.y - 200,
        transform: 'translateZ(0)', // GPU acceleration
        willChange: 'transform',
      }}
      animate={{
        background: 'radial-gradient(circle, rgba(245,185,20,0.03) 0%, rgba(71,224,255,0.02) 50%, transparent 70%)',
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      aria-hidden="true"
    >
      <div className="w-[400px] h-[400px] rounded-full" />
    </motion.div>
  );
}

export default App;
