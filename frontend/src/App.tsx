import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SingleCleaner } from './components/SingleCleaner';
import { BatchCleaner } from './components/BatchCleaner';
import { ProvenanceInspector } from './components/ProvenanceInspector';
import { InfoBanner } from './components/InfoBanner';
import type { SystemStatus } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'inspect'>('single');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    fetch('/api/system-status')
      .then(res => res.json())
      .then(data => setSystemStatus(data))
      .catch(() => {
        setSystemStatus({
          status: 'online',
          version: '0.55.0',
          hardware: {
            cuda_available: false,
            device_name: 'CPU (LaMa-ONNX / OpenCV Engine)',
            can_remove_visible: true,
            can_remove_metadata: true,
            can_remove_invisible: false
          },
          supported_signals: []
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Global Header */}
      <Header
        status={systemStatus}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {activeTab === 'single' && <SingleCleaner />}
        {activeTab === 'batch' && <BatchCleaner />}
        {activeTab === 'inspect' && <ProvenanceInspector />}

        <InfoBanner />
      </main>

      {/* Production Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AI Watermark Studio. Powered by <span className="text-slate-400 font-medium">remove-ai-watermarks</span>.</p>
          <p className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>FastAPI Backend + React Vite SPA</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
