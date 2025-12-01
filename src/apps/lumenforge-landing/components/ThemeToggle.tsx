import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, Theme } from '../hooks/useTheme';

const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" aria-hidden="true" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" aria-hidden="true" /> },
  { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" aria-hidden="true" /> },
];

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Theme toggle">
      {themeOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          className={`px-3 py-2 rounded-full text-sm font-medium flex items-center gap-1 transition-colors border border-white/10 ${
            theme === option.value
              ? 'bg-white/20 text-white'
              : 'bg-transparent text-white/70 hover:text-white'
          }`}
          aria-pressed={theme === option.value}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};
