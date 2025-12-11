import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface RotatingWordProps {
  words?: string[];
  interval?: number;
  className?: string;
}

/**
 * RotatingWord Component
 * EC-005: Handle empty words array
 * EC-006: Ensure interval cleanup
 * EC-015: Stabilize words array
 * EC-258: Handle interval prop changes
 */
export const RotatingWord: React.FC<RotatingWordProps> = ({
  words = ['build', 'create', 'design', 'ship', 'launch', 'code'],
  interval = 2500,
  className = '',
}) => {
  // EC-015: Stabilize words array with useMemo
  const stableWords = useMemo(() => {
    if (!words || words.length === 0) {
      return ['Loading...']; // EC-005: Default fallback
    }
    return [...words]; // Create new array to prevent mutation issues
  }, [words]);

  const [index, setIndex] = useState(0);

  // EC-006, EC-258: Proper interval cleanup and handle prop changes
  useEffect(() => {
    if (stableWords.length === 0) return;
    
    // Ensure index is within bounds
    setIndex(prev => Math.min(prev, stableWords.length - 1));
    
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % stableWords.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [stableWords.length, interval]);

  // EC-005: Safety check
  if (stableWords.length === 0) {
    return <span className={className}>Loading...</span>;
  }

  const currentWord = stableWords[index];

  return (
    <span className={`relative inline-block ${className}`} aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -20, opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.3 }}
          className="inline-block bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] bg-clip-text text-transparent relative"
          style={{
            backgroundSize: '200% auto',
          }}
        >
          {currentWord}
          
          {/* Animated Underline */}
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

