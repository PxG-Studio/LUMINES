import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

export interface StreamingTextProps {
  content: string;
  speed?: number;
  onComplete?: () => void;
  showCursor?: boolean;
  pauseOnPunctuation?: boolean;
  className?: string;
}

/**
 * StreamingText Component
 * EC-007: Fix state updates after unmount
 * EC-016: Handle content changes during streaming
 * EC-245: Validate speed parameter
 * EC-259: Handle empty content
 */
export const StreamingText: React.FC<StreamingTextProps> = ({
  content,
  speed = 20,
  onComplete,
  showCursor = true,
  pauseOnPunctuation = true,
  className = '',
}) => {
  // EC-007: Track mounted state
  const isMountedRef = useRef(true);
  const prevContentRef = useRef(content);
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // EC-245: Validate speed parameter
  const validSpeed = useMemo(() => {
    return Math.max(1, Math.min(1000, speed || 20));
  }, [speed]);

  // EC-259: Handle empty content
  if (!content || content.length === 0) {
    return null;
  }

  // EC-007: Set mounted flag
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // EC-016: Reset when content changes
  useEffect(() => {
    if (prevContentRef.current !== content) {
      setDisplayedContent('');
      setCurrentIndex(0);
      setIsComplete(false);
      prevContentRef.current = content;
    }
  }, [content]);

  useEffect(() => {
    if (currentIndex >= content.length) {
      if (isMountedRef.current) {
        setIsComplete(true);
        onComplete?.();
      }
      return;
    }

    const char = content[currentIndex];
    let delay = validSpeed;

    // Add pauses for punctuation
    if (pauseOnPunctuation) {
      if (['.', '!', '?'].includes(char)) {
        delay += 200;
      } else if ([',', ';', ':'].includes(char)) {
        delay += 100;
      } else if (char === '\n') {
        delay += 100;
      }
    }

    const timeout = setTimeout(() => {
      if (isMountedRef.current) {
        setDisplayedContent((prev) => prev + char);
        setCurrentIndex((prev) => prev + 1);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [currentIndex, content, validSpeed, pauseOnPunctuation, onComplete]);

  return (
    <span className={`inline ${className}`} aria-live="polite" aria-atomic="true">
      <span className="whitespace-pre-wrap">{displayedContent}</span>
      {!isComplete && showCursor && (
        <motion.span
          className="inline-block w-1.5 h-5 bg-purple-400 ml-1 align-text-bottom"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          aria-hidden="true"
        />
      )}
    </span>
  );
};

// Code Block variant with syntax-aware streaming
export const StreamingCodeBlock: React.FC<{
  code: string;
  language: string;
  speed?: number;
  onComplete?: () => void;
}> = ({ code, language, speed = 15, onComplete }) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;

    const streamCode = () => {
      if (index < code.length) {
        setDisplayedCode(code.slice(0, index + 1));
        index++;
        setTimeout(streamCode, speed);
      } else {
        setShowCursor(false);
        onComplete?.();
      }
    };

    streamCode();
  }, [code, speed, onComplete]);

  return (
    <div className="relative bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-700">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-gray-400 ml-2">{language}</span>
        </div>
        <button className="text-xs text-gray-400 hover:text-white transition-colors">
          Copy Code
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-4 text-sm font-mono text-gray-200 overflow-x-auto">
        <code>{displayedCode}</code>
        {showCursor && (
          <motion.span
            className="inline-block w-2 h-5 bg-purple-400 ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </pre>
    </div>
  );
};

