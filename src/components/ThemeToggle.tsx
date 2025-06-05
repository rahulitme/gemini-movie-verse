
import React from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-8 right-8 z-50 p-4 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-purple-200 dark:border-purple-700 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 glow-purple group"
      aria-label="Toggle theme"
    >
      <div className="relative">
        {theme === 'dark' ? (
          <Sun className="w-6 h-6 text-amber-500 group-hover:text-amber-400 transition-colors duration-300" />
        ) : (
          <Moon className="w-6 h-6 text-purple-600 group-hover:text-purple-500 transition-colors duration-300" />
        )}
        
        {/* Sparkle effect */}
        <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-purple-500 dark:text-amber-400 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </button>
  );
};

export default ThemeToggle;
