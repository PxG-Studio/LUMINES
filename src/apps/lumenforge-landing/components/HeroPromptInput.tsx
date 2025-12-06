import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { validateInputCharacters } from '../utils/sanitize';
import { sanitizeInput as secureSanitize } from '../utils/security';
import { validateInput, validationRules } from './FormValidation';

export interface HeroPromptInputProps {
  onSubmit: (prompt: string) => void;
  placeholder?: string;
  examples?: string[];
}

// Helper function to detect engine/tech from example text
// EC-068: Improved detection logic
const getEngineBadge = (example: string): { name: string; color: string } => {
  const lower = example.toLowerCase();
  if (lower.includes('pico-8') || lower.includes('pico8') || lower.includes('pico 8')) {
    return { name: 'Pico-8', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' };
  }
  if (lower.includes('unity')) {
    return { name: 'Unity', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
  }
  if (lower.includes('lua') || lower.includes('löve') || lower.includes('love2d')) {
    return { name: 'Lua', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
  }
  if (lower.includes('godot')) {
    return { name: 'Godot', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
  }
  if (lower.includes('gamemaker') || lower.includes('game maker')) {
    return { name: 'GameMaker', color: 'bg-green-500/20 text-green-300 border-green-500/30' };
  }
  return { name: 'Indie', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
};

/**
 * HeroPromptInput Component
 * EC-008: Fix examples rotation memory leak
 * EC-009: Fix transition state race condition
 * EC-056, EC-057, EC-058: Input validation and sanitization
 * EC-062: Fix example selection race condition
 * EC-065, EC-066: Handle empty/large examples arrays
 * EC-067: Better randomization
 * EC-069: Disable submit button when empty
 */
export const HeroPromptInput: React.FC<HeroPromptInputProps> = ({
  onSubmit,
  placeholder = "Describe your idea... (e.g., 'A todo app with dark mode')",
  examples = [],
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [currentExamples, setCurrentExamples] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // EC-066: Limit examples array size
  const limitedExamples = useMemo(() => {
    return examples.slice(0, 50); // Limit to 50 examples max
  }, [examples]);

  // EC-067: Better randomization (Fisher-Yates shuffle)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // EC-008, EC-009: Fix memory leaks and race conditions
  useEffect(() => {
    if (!isFocused || limitedExamples.length === 0) {
      // Clean up when not focused
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
      setIsTransitioning(false);
      return;
    }

    const getRandomExamples = () => {
      const shuffled = shuffleArray(limitedExamples);
      return shuffled.slice(0, 3);
    };

    // Set initial examples
    setCurrentExamples(getRandomExamples());

    // Rotate every 3 seconds
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      transitionTimeoutRef.current = setTimeout(() => {
        if (isFocused && limitedExamples.length > 0) {
          setCurrentExamples(getRandomExamples());
        }
        setIsTransitioning(false);
        transitionTimeoutRef.current = null;
      }, 200);
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
      setIsTransitioning(false);
    };
  }, [isFocused, limitedExamples]);

  // EC-056, EC-057, EC-058, EC-061, EC-063, EC-064: Input validation and sanitization
  // EC-LAND-001 to EC-LAND-010: Enhanced XSS prevention
  // EC-LAND-041 to EC-LAND-050: Enhanced data validation
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // EC-LAND-042, EC-LAND-043: Validate characters first
    if (!validateInputCharacters(value)) {
      setValidationError('Input contains invalid characters');
      setHasError(true);
      setTimeout(() => {
        setHasError(false);
        setValidationError(null);
      }, 4000);
      return;
    }
    
    // Validate input
    const validation = validateInput(value, [
      validationRules.required('Please enter a project description'),
      validationRules.minLength(3, 'Description must be at least 3 characters'),
      validationRules.maxLength(1000, 'Description must be no more than 1000 characters'),
    ]);
    
    if (!validation.isValid) {
      setValidationError(validation.errors[0]);
      setHasError(true);
      setTimeout(() => {
        setHasError(false);
        setValidationError(null);
      }, 4000);
      return;
    }
    
    // EC-LAND-001 to EC-LAND-010: Enhanced sanitization
    const sanitized = secureSanitize(value, 1000);
    
    if (sanitized.length > 0) {
      onSubmit(sanitized);
      setValue('');
      setIsFocused(false); // EC-017: Hide examples on submit
      setValidationError(null);
    } else {
      // Shake animation on empty submit
      setHasError(true);
      setValidationError('Please enter a valid project description');
      setTimeout(() => {
        setHasError(false);
        setValidationError(null);
      }, 4000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      className="relative max-w-3xl mx-auto z-40"
      animate={{
        scale: isFocused ? 1.02 : 1,
        x: hasError ? [-10, 10, -10, 10, 0] : 0,
      }}
      transition={{ duration: hasError ? 0.4 : 0.2 }}
    >
      {/* Animated Gradient Border */}
      <motion.div
        className="absolute -inset-[2px] rounded-2xl opacity-0 blur-sm"
        style={{
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #764ba2 75%, #667eea 100%)',
          backgroundSize: '300% auto',
        }}
        animate={{
          opacity: isFocused ? 1 : 0,
          backgroundPosition: isFocused ? ['0% 50%', '300% 50%'] : '0% 50%',
        }}
        transition={{
          opacity: { duration: 0.3 },
          backgroundPosition: {
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      />

      {/* Input Container (Glass Morphism) - EC-056, EC-057, EC-058, EC-059, EC-060, EC-070, EC-071, EC-072, EC-073, EC-076, EC-108 */}
      <div className={`relative flex items-center bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 transition-all duration-300 ${
        typeof window !== 'undefined' && CSS.supports('backdrop-filter', 'blur(10px)') 
          ? 'backdrop-blur-xl' 
          : 'bg-[#1A1A1A]/80'
      }`}>
        <label htmlFor="hero-prompt-input" className="sr-only">
          Describe your project idea
        </label>
        <input
          id="hero-prompt-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          onPaste={(e) => {
            // EC-060: Strip formatting from pasted content
            // EC-LAND-003: Sanitize pasted content
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            const sanitized = secureSanitize(text, 1000);
            if (validateInputCharacters(sanitized)) {
              setValue(sanitized);
            } else {
              setValidationError('Pasted content contains invalid characters');
              setHasError(true);
              setTimeout(() => {
                setHasError(false);
                setValidationError(null);
              }, 4000);
            }
          }}
          placeholder={placeholder}
          maxLength={1000}
          autoComplete="off"
          spellCheck={false}
          inputMode="text"
          className="flex-1 bg-transparent text-white text-lg md:text-xl px-6 md:px-8 py-5 md:py-6 outline-none placeholder:text-white/40 focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2 focus:ring-offset-transparent rounded-2xl"
          aria-label="Describe your project idea"
          aria-describedby={hasError || validationError ? "input-error" : undefined}
          aria-invalid={hasError || !!validationError}
        />
        {(hasError || validationError) && (
          <span id="input-error" className="sr-only" role="alert">
            {validationError || 'Please enter a valid prompt'}
          </span>
        )}

        {/* Submit Button - EC-069: Disable when empty, EC-101, EC-102, EC-120 */}
        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={!value.trim()}
          className={`m-2 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2 focus:ring-offset-transparent ${
            !value.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={value.trim() ? { scale: 1.05 } : {}}
          whileTap={value.trim() ? { scale: 0.95 } : {}}
          animate={value.trim() ? {
            boxShadow: [
              '0 0 20px rgba(102, 126, 234, 0.5)',
              '0 0 40px rgba(102, 126, 234, 0.8)',
              '0 0 20px rgba(102, 126, 234, 0.5)',
            ],
          } : {}}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity },
          }}
          aria-label="Submit project idea"
          aria-disabled={!value.trim()}
        >
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white" aria-hidden="true" />
        </motion.button>
      </div>

      {/* Validation Error Display - EC-061, EC-063, EC-064 */}
      {validationError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 left-0 right-0 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm z-[70]"
          role="alert"
          aria-live="assertive"
        >
          {validationError}
        </motion.div>
      )}
      
      {/* Example Prompts (on focus) - EC-065: Check array length, EC-062: Disable during transition */}
      {isFocused && limitedExamples.length > 0 && !value && !validationError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-3 left-0 right-0 bg-gray-800/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl z-[60]"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-gray-400">Try these examples:</span>
          </div>
          <motion.div 
            className="space-y-2"
            animate={{ opacity: isTransitioning ? 0.3 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentExamples.map((example, i) => {
              const badge = getEngineBadge(example);
              return (
                <motion.button
                  key={`${example}-${i}`}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  onClick={() => {
                    // EC-062: Prevent clicks during transition
                    if (!isTransitioning) {
                      setValue(example);
                    }
                  }}
                  disabled={isTransitioning}
                  className={`group w-full text-left px-3 py-2.5 text-sm text-gray-300/80 hover:text-white hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-purple-500/10 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 hover:border hover:border-amber-400/30 relative focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  whileHover={!isTransitioning ? { 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  } : {}}
                  whileTap={!isTransitioning ? { scale: 0.98 } : {}}
                  aria-label={`Use example: ${example}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${badge.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
                      {badge.name}
                    </span>
                    <span className="relative flex-1">
                      {example}
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/20 to-amber-400/0 rounded"
                        initial={{ opacity: 0, x: "-100%" }}
                        whileHover={{ 
                          opacity: 1, 
                          x: "100%",
                          transition: { duration: 0.6, ease: "easeInOut" }
                        }}
                      />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

