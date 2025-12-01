import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export interface FloatingOrbsProps {
  count?: number;
  className?: string;
}

/**
 * FloatingOrbs Component
 * EC-027: Optimize for performance (reduce on mobile)
 * EC-243: Validate count parameter
 * EC-257: Pre-calculate random values
 */
export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({
  count = 5,
  className = '',
}) => {
  const orbs = [
    {
      gradient: 'from-[#667eea] to-[#764ba2]',
      size: 'w-96 h-96',
      startX: 20,
      startY: 10,
      delay: 0,
    },
    {
      gradient: 'from-[#f093fb] to-[#f5576c]',
      size: 'w-64 h-64',
      startX: 80,
      startY: 30,
      delay: 2,
    },
    {
      gradient: 'from-[#4facfe] to-[#00f2fe]',
      size: 'w-[32rem] h-[32rem]',
      startX: 50,
      startY: 60,
      delay: 4,
    },
    {
      gradient: 'from-[#43e97b] to-[#38f9d7]',
      size: 'w-64 h-64',
      startX: 10,
      startY: 80,
      delay: 6,
    },
    {
      gradient: 'from-[#fa709a] to-[#fee140]',
      size: 'w-96 h-96',
      startX: 90,
      startY: 90,
      delay: 8,
    },
  ];

  // EC-243: Validate and limit count
  const validCount = Math.min(Math.max(0, count || 5), orbs.length);
  const visibleOrbs = orbs.slice(0, validCount);

  // EC-257: Pre-calculate animation values to avoid recalculation
  const orbAnimations = useMemo(() => {
    return visibleOrbs.map((orb) => ({
      ...orb,
      animation: {
        x: [0, Math.random() * 200 - 100, Math.random() * 150 - 75, 0],
        y: [0, Math.random() * 200 - 100, Math.random() * 150 - 75, 0],
        scale: [1, 1.2, 1.1, 1],
      },
      duration: 15 + Math.random() * 10,
    }));
  }, [visibleOrbs]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {orbAnimations.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute ${orb.size} rounded-full bg-gradient-to-br ${orb.gradient} blur-3xl opacity-20`}
          style={{
            left: `${orb.startX}%`,
            top: `${orb.startY}%`,
            transform: 'translateZ(0)', // EC-027: GPU acceleration
            willChange: 'transform, opacity',
          }}
          animate={orb.animation}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
};

