/**
 * Skip Link Component - EC-106, EC-LAND-253
 * Allows keyboard users to skip to main content
 */
import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[#F5B914] focus:text-[#1E1345] focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-[#F5B914]"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
};

