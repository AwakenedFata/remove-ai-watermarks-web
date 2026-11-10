import type React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Layers, SearchCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BottomNavProps {
  activeTab: 'single' | 'batch' | 'inspect';
  setActiveTab: (tab: 'single' | 'batch' | 'inspect') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useApp();

  const navItems = [
    { id: 'single' as const, label: t('tabSingle'), icon: Wand2 },
    { id: 'batch' as const, label: t('tabBatch'), icon: Layers },
    { id: 'inspect' as const, label: t('tabInspect'), icon: SearchCheck },
  ];

  return (
    <nav className="sm:hidden fixed bottom-3 left-3 right-3 z-50">
      <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-700/60 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all select-none"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavPill"
                  className="absolute inset-0 bg-indigo-600/20 dark:bg-indigo-500/25 border border-indigo-500/40 rounded-xl"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <Icon
                className={`w-5 h-5 transition-colors relative z-10 ${
                  isActive
                    ? 'text-indigo-400 dark:text-indigo-300 scale-110'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors relative z-10 ${
                  isActive
                    ? 'text-indigo-200 dark:text-white font-semibold'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
