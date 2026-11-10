import { useState, useRef } from 'react';
import type React from 'react';
import { SearchCheck, ShieldAlert, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProvenanceReport } from '../types';
import { useApp } from '../context/AppContext';

export const ProvenanceInspector: React.FC = () => {
  const { t } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [report, setReport] = useState<ProvenanceReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setReport(null);
    setErrorMsg(null);
    setIsInspecting(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Inspection failed');
      }

      const data: ProvenanceReport = await res.json();
      setReport(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Inspection failed.');
    } finally {
      setIsInspecting(false);
    }
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
        {!previewUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700/80 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/15 rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all shadow-inner"
            >
              <SearchCheck className="w-8 h-8" />
            </motion.div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200">
                {t('inspectTitle')}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                {t('inspectSubtitle')}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">{selectedFile?.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('tabInspect')}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  setReport(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {t('inspectAnother')}
              </button>
            </div>

            {isInspecting && (
              <div className="p-8 text-center space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('inspecting')}</p>
              </div>
            )}

            {report && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Box */}
                <div className="bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                    Status Overview
                  </h4>
                  <div className="flex items-center space-x-3 pt-1">
                    {report.is_ai_generated ? (
                      <div className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 font-bold text-xs flex items-center space-x-2">
                        <ShieldAlert className="w-4 h-4" />
                        <span>{t('verdictAI')}</span>
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 font-bold text-xs flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t('verdictHuman')}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <p className="text-slate-600 dark:text-slate-400">
                      {t('platform')}: <span className="text-slate-900 dark:text-slate-200 font-semibold">{report.platform}</span>
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {t('hiddenMetadata')}: <span className="text-slate-900 dark:text-slate-200 font-semibold">{report.has_ai_metadata ? t('yesPresent') : t('notPresent')}</span>
                    </p>
                  </div>
                </div>

                {/* Markers & Signals */}
                <div className="bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                    {t('detectedMarks')}
                  </h4>
                  <div className="text-xs space-y-2">
                    {report.watermarks.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                        {report.watermarks.map((w, i) => (
                          <li key={i} className="text-indigo-600 dark:text-indigo-300 font-medium">{w}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 italic">{t('noneDetected')}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
