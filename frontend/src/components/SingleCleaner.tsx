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
  AlertTriangle,
  Clock,
  HardDrive,
  FileCheck
} from 'lucide-react';
import type { CleanResponse } from '../types';
import { ImageComparisonSlider } from './ImageComparisonSlider';

export const SingleCleaner: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<'visible' | 'metadata'>('visible');
  const [manualRegion, setManualRegion] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
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
    setProcessingStep('Loading Google Gemini demo sample...');
    try {
      const sampleUrl = 'https://raw.githubusercontent.com/wiltodelta/remove-ai-watermarks/main/demo_banana_before.png';
      const sampleRes = await fetch(sampleUrl);
      if (!sampleRes.ok) throw new Error('Failed to fetch remote sample');
      const blob = await sampleRes.blob();
      const file = new File([blob], 'demo_banana_before.png', { type: 'image/png' });
      handleFileChange(file);
    } catch {
      setErrorMsg('Failed to load sample image. Please upload an image directly.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleStartClean = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setProcessingStep('Analyzing C2PA credentials and locating AI marks...');

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
      setProcessingStep('');
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
    <div className="space-y-6">
      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-3 text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-200">Error</p>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Main Studio Card */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-5 sm:p-7 shadow-xl backdrop-blur-md">
        {!previewUrl ? (
          /* Dropzone State */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500/60 hover:bg-indigo-950/10 rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center space-y-4"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-slate-800 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 text-slate-400 flex items-center justify-center transition-all shadow-inner">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-slate-200">
                Drag & drop your AI image here, or <span className="text-indigo-400 group-hover:underline">browse</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Supports PNG, JPG, WEBP, AVIF with Gemini, Doubao, Kling, Sora, C2PA, IPTC tags
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <span className="text-xs text-slate-500">or test with real data:</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadSample();
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Gemini Sparkle Sample</span>
              </button>
            </div>
          </div>
        ) : (
          /* Image Loaded & Controls State */
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200 truncate max-w-[240px] sm:max-w-md">
                    {selectedFile?.name || 'Uploaded Image'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedFile ? formatBytes(selectedFile.size) : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Choose Another</span>
                </button>
              </div>
            </div>

            {/* Mode Selector Radio Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setMode('visible')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  mode === 'visible'
                    ? 'bg-indigo-600/15 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-100">Visible Mark + Metadata</p>
                      <p className="text-[11px] text-slate-400">Inpaints logo & strips C2PA/EXIF (Recommended)</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="cleanMode"
                    checked={mode === 'visible'}
                    onChange={() => setMode('visible')}
                    className="accent-indigo-500 mt-1"
                  />
                </div>
              </div>

              <div
                onClick={() => setMode('metadata')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  mode === 'metadata'
                    ? 'bg-indigo-600/15 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-100">Lossless Metadata Only</p>
                      <p className="text-[11px] text-slate-400">Keeps 100% exact pixels, removes AI manifests</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="cleanMode"
                    checked={mode === 'metadata'}
                    onChange={() => setMode('metadata')}
                    className="accent-indigo-500 mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Optional Manual Region Toggle */}
            {mode === 'visible' && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{showManualInput ? 'Hide manual erase coordinates' : 'Custom watermark position (Optional)'}</span>
                </button>
                {showManualInput && (
                  <div className="mt-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700 text-xs space-y-1.5">
                    <label className="text-slate-300 font-medium">Region Coordinates (x, y, width, height in pixels):</label>
                    <input
                      type="text"
                      placeholder="e.g. 1640, 1930, 400, 100"
                      value={manualRegion}
                      onChange={(e) => setManualRegion(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-slate-400 text-[10px]">Leave empty to let the auto-detector locate the mark automatically.</p>
                  </div>
                )}
              </div>
            )}

            {/* Clean Action Button */}
            {!cleanResult && (
              <button
                onClick={handleStartClean}
                disabled={isProcessing}
                className={`w-full py-3.5 rounded-2xl font-semibold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all shadow-xl ${
                  isProcessing
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>{processingStep || 'Processing Image...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Clean AI Watermarks & Metadata</span>
                  </>
                )}
              </button>
            )}

            {/* Clean Result Presentation */}
            {cleanResult && (
              <div className="space-y-6 pt-2">
                {/* Interactive Split Comparison */}
                <ImageComparisonSlider
                  originalSrc={cleanResult.original_url}
                  cleanedSrc={cleanResult.cleaned_url}
                  alt={cleanResult.filename}
                />

                {/* Metrics & Action Banner */}
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>Time: <strong className="text-white">{cleanResult.elapsed_seconds}s</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <HardDrive className="w-4 h-4 text-indigo-400" />
                      <span>Size: <strong className="text-white">{formatBytes(cleanResult.cleaned_size)}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Removed: <strong className="text-white">{cleanResult.removed_marks.join(', ')}</strong></span>
                    </div>
                  </div>

                  <a
                    href={cleanResult.cleaned_url}
                    download={`clean_${cleanResult.filename}`}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Clean Image</span>
                  </a>
                </div>

                {/* Verification Inspection Cards (Before vs After) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before Inspection */}
                  <div className="bg-slate-950/70 rounded-2xl border border-rose-500/20 p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        <h4 className="text-xs font-bold text-rose-300 tracking-wide uppercase">Original Provenance</h4>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-medium">
                        AI Detected: {cleanResult.pre_inspection.is_ai_generated ? 'YES' : 'NONE'}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-400">Platform: <span className="text-slate-200 font-medium">{cleanResult.pre_inspection.platform}</span></p>
                      <p className="text-slate-400">Confidence: <span className="text-slate-200 font-medium">{cleanResult.pre_inspection.confidence}</span></p>
                      <p className="text-slate-400">Markers:</p>
                      <ul className="list-disc list-inside text-rose-300 pl-1 space-y-0.5">
                        {cleanResult.pre_inspection.watermarks.length > 0 ? (
                          cleanResult.pre_inspection.watermarks.map((m, idx) => (
                            <li key={idx} className="truncate">{m}</li>
                          ))
                        ) : (
                          <li className="text-slate-500">None detected</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* After Inspection */}
                  <div className="bg-slate-950/70 rounded-2xl border border-emerald-500/20 p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-bold text-emerald-300 tracking-wide uppercase">Cleaned Provenance</h4>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                        AI Detected: {cleanResult.post_inspection.is_ai_generated ? 'YES' : 'CLEAN / NONE'}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-400">Platform: <span className="text-emerald-400 font-medium">{cleanResult.post_inspection.platform}</span></p>
                      <p className="text-slate-400">Confidence: <span className="text-emerald-400 font-medium">{cleanResult.post_inspection.confidence}</span></p>
                      <p className="text-slate-400">Markers:</p>
                      <p className="text-emerald-300 italic">
                        {cleanResult.post_inspection.watermarks.length > 0
                          ? cleanResult.post_inspection.watermarks.join(', ')
                          : 'No provenance or watermark markers found'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
