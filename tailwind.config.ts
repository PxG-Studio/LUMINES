import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './.storybook/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // WISSIL System Colors (Luminera Design System)
        landing: {
          primary: '#F5B914', // Amber
          secondary: '#47E0FF', // Cyan
          accent: '#A64DFF', // Purple
        },
        waypoint: {
          primary: '#A64DFF', // Purple (Unity Visual Scripting)
          secondary: '#47E0FF', // Cyan
          accent: '#F5B914', // Amber
        },
        spark: {
          primary: '#47E0FF', // Cyan (IDE Experience)
          secondary: '#F5B914', // Amber
          accent: '#A64DFF', // Purple
        },
        slate: {
          primary: '#A64DFF', // Purple (Workspace & Identity)
          secondary: '#47E0FF', // Cyan
          accent: '#F5B914', // Amber
        },
        ignis: {
          primary: '#FF6B35', // Orange (API Backend)
          secondary: '#F5B914', // Amber
          accent: '#47E0FF', // Cyan
        },
        ignition: {
          primary: '#F5B914', // Amber (Project Bootstrap)
          secondary: '#FF6B35', // Orange
          accent: '#A64DFF', // Purple
        },
        // Base Colors
        background: {
          primary: '#0A0A0A',
          secondary: '#1A1A1A',
          tertiary: '#2A2A2A',
        },
        text: {
          primary: '#FFFFFF',
          secondary: 'rgba(255, 255, 255, 0.7)',
          tertiary: 'rgba(255, 255, 255, 0.5)',
        },
        border: {
          primary: 'rgba(255, 255, 255, 0.1)',
          secondary: 'rgba(255, 255, 255, 0.05)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
