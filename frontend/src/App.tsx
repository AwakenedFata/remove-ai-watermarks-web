import { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SingleCleaner } from './components/SingleCleaner';
import { BatchCleaner } from './components/BatchCleaner';
import { ProvenanceInspector } from './components/ProvenanceInspector';
import { InfoBanner } from './components/InfoBanner';
import { AppProvider, useApp } from './context/AppContext';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'inspect'>('single');
  const { t } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Decorative ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl"></div>
      </div>

      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content (with bottom padding for mobile thumb nav) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 sm:pb-10 space-y-6">
        {activeTab === 'single' && <SingleCleaner />}
        {activeTab === 'batch' && <BatchCleaner />}
        {activeTab === 'inspect' && <ProvenanceInspector />}

        <InfoBanner />
      </main>

      {/* Mobile Ergonomic Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Desktop/Tablet Footer */}
      <footer className="hidden sm:block border-t border-slate-200 dark:border-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>{t('footerCopy')}</p>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Clean AI Engine • Production Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
