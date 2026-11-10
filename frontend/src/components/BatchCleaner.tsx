import { useState, useRef } from 'react';
import type React from 'react';
import { Layers, Download, CheckCircle2, XCircle, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BatchResponse } from '../types';
import { useApp } from '../context/AppContext';

export const BatchCleaner: React.FC = () => {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<'visible' | 'metadata'>('visible');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [batchResult, setBatchResult] = useState<BatchResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList) => {
    const valid = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    if (valid.length === 0) {
      setErrorMsg('No valid image files selected.');
      return;
    }
    setErrorMsg(null);
    setFiles(prev => [...prev, ...valid]);
  };

  const handleStartBatch = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setErrorMsg(null);

    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    formData.append('mode', mode);

    try {
      const res = await fetch('/api/batch', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Batch processing failed');
      }

      const data: BatchResponse = await res.json();
      setBatchResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred during batch clean.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setBatchResult(null);
    setErrorMsg(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-center space-x-2 text-xs"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/80 dark:bg-slate-900/60 rounded-3xl border border-slate-200/90 dark:border-slate-800/80 p-5 sm:p-7 shadow-xl backdrop-blur-md transition-colors duration-200">
        {files.length === 0 ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700/80 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/15 rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              multiple
              accept="image/*"
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all shadow-inner"
            >
              <Layers className="w-8 h-8" />
            </motion.div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200">
                {t('batchTitle')}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                {t('batchSubtitle')}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                    {files.length} {t('batchSelected')}
                  </h3>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                {t('clearQueue')}
              </button>
            </div>

            {/* Mode selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('visible')}
                className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                  mode === 'visible'
                    ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="font-bold text-slate-900 dark:text-slate-100">{t('modeFullTitle')}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t('modeFullDesc')}</div>
              </button>
              <button
                type="button"
                onClick={() => setMode('metadata')}
                className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                  mode === 'metadata'
                    ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="font-bold text-slate-900 dark:text-slate-100">{t('modeMetaTitle')}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t('modeMetaDesc')}</div>
              </button>
            </div>

            {/* Action Button */}
            {!batchResult && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartBatch}
                disabled={isProcessing}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
                  isProcessing
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{t('btnBatchDownloading')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>{t('btnBatchClean')} ({files.length})</span>
                  </>
                )}
              </motion.button>
            )}

            {/* Batch Results */}
            {batchResult && (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>{batchResult.total_files} {t('batchSuccess')}</span>
                  </div>

                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={batchResult.zip_url}
                    download
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/25"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('btnBatchZip')}</span>
                  </motion.a>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                  {batchResult.results.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        {item.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.filename}</span>
                      </div>

                      {item.cleaned_url && (
                        <a
                          href={item.cleaned_url}
                          download={`clean_${item.filename}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold shrink-0 ml-2"
                        >
                          {t('btnDownload')}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
