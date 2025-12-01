import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface GlassCardProps {
  children: React.ReactNode;
  hover3D?: boolean;
  glowColor?: string;
  padding?: string;
  borderRadius?: string;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hover3D = true,
  glowColor = 'rgba(102, 126, 234, 0.3)',
  padding = 'p-8',
  borderRadius = 'rounded-2xl',
  className = '',
  onClick,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -5; // Max 5deg
    const rotateYValue = ((x - centerX) / centerX) * 5;   // Max 5deg
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={`
        relative group
        bg-white/[0.03] backdrop-blur-sm
        border border-white/[0.08]
        ${borderRadius} ${padding}
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      whileHover={{
        borderColor: 'rgba(255, 255, 255, 0.15)',
        boxShadow: `0 20px 60px ${glowColor}`,
      }}
    >
      {children}
      
      {/* Inner glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/[0.02] group-hover:to-white/[0.05] rounded-inherit pointer-events-none transition-all duration-300" />
    </motion.div>
  );
};

