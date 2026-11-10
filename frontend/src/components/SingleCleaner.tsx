import { useState, useRef } from 'react';
import type React from 'react';
import {
  Upload,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Download,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CleanResponse } from '../types';
import { ImageComparisonSlider } from './ImageComparisonSlider';
import { useApp } from '../context/AppContext';

export const SingleCleaner: React.FC = () => {
  const { t } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<'visible' | 'metadata'>('visible');
  const [manualRegion, setManualRegion] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cleanResult, setCleanResult] = useState<CleanResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setErrorMsg(null);
    setSelectedFile(file);
    setCleanResult(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSample = async () => {
    setErrorMsg(null);
    setIsProcessing(true);
    try {
      const sampleUrl = 'https://raw.githubusercontent.com/wiltodelta/remove-ai-watermarks/main/demo_banana_before.png';
      const sampleRes = await fetch(sampleUrl);
      if (!sampleRes.ok) throw new Error('Failed to fetch remote sample');
      const blob = await sampleRes.blob();
      const file = new File([blob], 'gemini_sample.png', { type: 'image/png' });
      handleFileChange(file);
    } catch {
      setErrorMsg('Could not load sample. Please upload an image directly.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartClean = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('mode', mode);
    if (showManualInput && manualRegion.trim()) {
      formData.append('region', manualRegion.trim());
    }

    try {
      const res = await fetch('/api/clean', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Cleaning process failed');
      }

      const data: CleanResponse = await res.json();
      setCleanResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during cleaning.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCleanResult(null);
    setErrorMsg(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Error Alert */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-center space-x-3 text-sm"
          >
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Studio Card */}
      <div className="bg-white/80 dark:bg-slate-900/60 rounded-3xl border border-slate-200/90 dark:border-slate-800/80 p-5 sm:p-7 shadow-xl backdrop-blur-md transition-colors duration-200">
        {!previewUrl ? (
          /* Dropzone State */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700/80 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/15 rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center space-y-4"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all shadow-inner"
            >
              <Upload className="w-8 h-8" />
            </motion.div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200">
                {t('dropzoneTitle')}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                {t('dropzoneSubtitle')}
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadSample();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t('trySample')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Image Selected & Options State */
          <div className="space-y-6">
            {/* File Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[220px] sm:max-w-md">
                    {selectedFile?.name || 'Selected Image'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedFile ? formatBytes(selectedFile.size) : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t('chooseAnother')}</span>
              </button>
            </div>

            {/* Mode Selector Radio Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setMode('visible')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  mode === 'visible'
                    ? 'bg-indigo-50 dark:bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-500/5'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                          {t('modeFullTitle')}
                        </p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold">
                          {t('recommended')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {t('modeFullDesc')}
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="cleanMode"
                    checked={mode === 'visible'}
                    onChange={() => setMode('visible')}
                    className="accent-indigo-600 mt-1 shrink-0"
                  />
                </div>
              </div>

              <div
                onClick={() => setMode('metadata')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  mode === 'metadata'
                    ? 'bg-indigo-50 dark:bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-500/5'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {t('modeMetaTitle')}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {t('modeMetaDesc')}
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="cleanMode"
                    checked={mode === 'metadata'}
                    onChange={() => setMode('metadata')}
                    className="accent-indigo-600 mt-1 shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* Optional Custom Region Toggle */}
            {mode === 'visible' && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1.5 font-medium"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{showManualInput ? t('customRegionHide') : t('customRegionToggle')}</span>
                </button>
                {showManualInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5"
                  >
                    <label className="text-slate-700 dark:text-slate-300 font-medium">
                      {t('customRegionLabel')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1640, 1930, 400, 100"
                      value={manualRegion}
                      onChange={(e) => setManualRegion(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {t('customRegionHelp')}
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Clean Action Button */}
            {!cleanResult && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartClean}
                disabled={isProcessing}
                className={`w-full py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all shadow-xl ${
                  isProcessing
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                    <span>{t('btnCleaning')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-white" />
                    <span>{t('btnClean')}</span>
                  </>
                )}
              </motion.button>
            )}

            {/* Clean Results Presentation */}
            {cleanResult && (
              <div className="space-y-6 pt-2">
                {/* Interactive Split Comparison */}
                <ImageComparisonSlider
                  originalSrc={cleanResult.original_url}
                  cleanedSrc={cleanResult.cleaned_url}
                  alt={cleanResult.filename}
                />

                {/* Metrics & Download Action Bar */}
                <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/30 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      <span>{t('timeTaken')}: <strong className="text-slate-900 dark:text-white">{cleanResult.elapsed_seconds}s</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                      <HardDrive className="w-4 h-4 text-indigo-500" />
                      <span>{t('fileSize')}: <strong className="text-slate-900 dark:text-white">{formatBytes(cleanResult.cleaned_size)}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{t('marksRemoved')}: <strong className="text-slate-900 dark:text-white">{cleanResult.removed_marks.join(', ')}</strong></span>
                    </div>
                  </div>

                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={cleanResult.cleaned_url}
                    download={`clean_${cleanResult.filename}`}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('btnDownload')}</span>
                  </motion.a>
                </div>

                {/* User-Friendly Verification Cards (Before vs After) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before Cleaning */}
                  <div className="bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-rose-200 dark:border-rose-500/20 p-4 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center space-x-2">
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        <h4 className="text-xs font-bold text-rose-700 dark:text-rose-300 tracking-wide uppercase">
                          {t('originalCardTitle')}
                        </h4>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold">
                        {t('aiStatusDetected')}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-600 dark:text-slate-400">
                        {t('platform')}: <span className="text-slate-900 dark:text-slate-200 font-semibold">{cleanResult.pre_inspection.platform}</span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">{t('detectedMarks')}:</p>
                      <ul className="list-disc list-inside text-rose-600 dark:text-rose-300 pl-1 space-y-0.5">
                        {cleanResult.pre_inspection.watermarks.length > 0 ? (
                          cleanResult.pre_inspection.watermarks.map((m, idx) => (
                            <li key={idx} className="truncate">{m}</li>
                          ))
                        ) : (
                          <li className="text-slate-500">{t('noneDetected')}</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* After Cleaning */}
                  <div className="bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 p-4 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-300 tracking-wide uppercase">
                          {t('cleanedCardTitle')}
                        </h4>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                        {t('aiStatusClean')}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-600 dark:text-slate-400">
                        Status: <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{t('readyToShare')}</span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {t('detectedMarks')}: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t('noneDetected')}</span>
                      </p>
                    </div>
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
