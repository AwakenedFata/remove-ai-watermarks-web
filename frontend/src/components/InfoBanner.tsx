import { useState } from 'react';
import type React from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export const InfoBanner: React.FC = () => {
  const { t } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md overflow-hidden text-xs text-slate-600 dark:text-slate-400 transition-colors duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left"
      >
        <div className="flex items-center space-x-2.5 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm">
          <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>{t('faqTitle')}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 pb-5 pt-1 space-y-3 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40 text-[12px] leading-relaxed"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{t('faqInstagramTitle')}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{t('faqInstagramDesc')}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{t('faqQualityTitle')}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{t('faqQualityDesc')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
