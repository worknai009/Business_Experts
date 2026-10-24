'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Sparkles,
  Bot,
  TrendingUp,
  FileText,
  Sun,
  Moon,
  Compass
} from 'lucide-react';
import { Dock, DockItem, DockLabel, DockIcon } from './core/dock';

export function FloatingDock({ className = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const navItems = [
    {
      title: 'Home',
      icon: Home,
      href: '/',
      action: () => navigate('/'),
    },
    {
      title: 'Opportunities',
      icon: Search,
      href: '/business-finder',
      action: () => navigate('/business-finder'),
    },
    {
      title: 'Analyze Business',
      icon: Sparkles,
      href: '/analyze',
      action: () => navigate('/analyze'),
    },
    {
      title: 'AI Mentor Chat',
      icon: Bot,
      href: '/dashboard/ai-mentor',
      action: () => navigate('/dashboard/ai-mentor'),
    },
    {
      title: 'Market Insights',
      icon: TrendingUp,
      href: '/dashboard/market-insights',
      action: () => navigate('/dashboard/market-insights'),
    },
    {
      title: 'Saved Reports',
      icon: FileText,
      href: '/history',
      action: () => navigate('/history'),
    },
    {
      title: isDark ? 'Light Mode' : 'Dark Mode',
      icon: isDark ? Sun : Moon,
      action: toggleTheme,
    },
  ];

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto ${className}`}>
      <Dock magnification={64} distance={130} panelHeight={56}>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.href && location.pathname === item.href;

          return (
            <DockItem
              key={index}
              onClick={item.action}
              className={isActive ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/20' : ''}
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>
                <Icon size={20} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : ''} />
              </DockIcon>
            </DockItem>
          );
        })}
      </Dock>
    </div>
  );
}

export default FloatingDock;
