import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Dark / Light mode toggle component.
 * Manages 'light' and 'dark' class names and color-scheme on <html>.
 */

const STORAGE_KEY = 'businessai-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  return 'light';
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
  }
}

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      className={`relative w-14 h-7 rounded-full border transition-colors duration-300 shrink-0 cursor-pointer ${
        isLight
          ? 'bg-emerald-100 border-emerald-300'
          : 'bg-slate-900 border-slate-700'
      } ${className}`}
    >
      {/* Sliding knob */}
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
          isLight
            ? 'left-[calc(100%-1.625rem)] bg-amber-400 text-amber-900'
            : 'left-0.5 bg-slate-700 text-slate-300'
        }`}
      >
        {isLight ? <Sun size={13} /> : <Moon size={13} />}
      </span>
    </button>
  );
}

/**
 * Initialize theme immediately at app load.
 */
export function initTheme() {
  applyTheme(getInitialTheme());
}
