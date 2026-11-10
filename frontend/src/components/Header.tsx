import type React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Globe, Wand2, Layers, SearchCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  activeTab: 'single' | 'batch' | 'inspect';
  setActiveTab: (tab: 'single' | 'batch' | 'inspect') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { lang, setLang, theme, toggleTheme, t } = useApp();

  const logoSrc = theme === 'dark' ? '/darkmodelogo.png' : '/lightmodelogo.png';

  const navItems = [
    { id: 'single' as const, label: t('tabSingle'), icon: Wand2 },
    { id: 'batch' as const, label: t('tabBatch'), icon: Layers },
    { id: 'inspect' as const, label: t('tabInspect'), icon: SearchCheck },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo & Brand (Dual-mode Wordmark - Enlarged) */}
          <div className="flex items-center">
            <motion.img
              key={theme}
              initial={{ opacity: 0.85 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              src={logoSrc}
              alt="AI Watermark Remover"
              className="h-14 sm:h-16 md:h-18 lg:h-20 w-auto max-w-[300px] sm:max-w-[420px] object-contain cursor-pointer select-none py-1"
            />
          </div>

          {/* Desktop Navigation Tabs - Concentric Proportional Segmented Pill */}
          <nav className="hidden sm:inline-flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-inner space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors select-none z-10 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktopNavPill"
                      className="absolute inset-0 bg-indigo-600 rounded-lg -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Language Dropdown & Theme Toggle */}
          <div className="flex items-center space-x-2">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1 mr-1 shrink-0" />
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  lang === 'en'
                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('id')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  lang === 'id'
                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                ID
              </button>
            </div>

            {/* Dark / Light Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
              title={theme === 'dark' ? t('themeLight') : t('themeDark')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};
