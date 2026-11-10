import { useState, useRef } from 'react';
import type React from 'react';
import { Layers, Download, CheckCircle2, XCircle, RefreshCw, Sparkles, AlertTriangle } from 'lucide-react';
import type { BatchResponse } from '../types';

export const BatchCleaner: React.FC = () => {
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
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center space-x-2 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-5 sm:p-7 shadow-xl backdrop-blur-md">
        {files.length === 0 ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500/60 hover:bg-indigo-950/10 rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              multiple
              accept="image/*"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 flex items-center justify-center transition-all">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-slate-200">
                Upload multiple images for Batch Cleaning
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select or drop a folder/multiple files to process them automatically
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    Queue: {files.length} images selected
                  </h3>
                  <p className="text-xs text-slate-400">Ready to clean</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Clear Queue
                </button>
              </div>
            </div>

            {/* Mode selection */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setMode('visible')}
                className={`flex-1 p-3 rounded-xl border text-left text-xs ${
                  mode === 'visible' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200' : 'bg-slate-800/40 border-slate-700 text-slate-400'
                }`}
              >
                <div className="font-semibold text-slate-200">Visible + Metadata</div>
                <div className="text-[11px] text-slate-400">Strips visible logos and cleans C2PA</div>
              </button>
              <button
                type="button"
                onClick={() => setMode('metadata')}
                className={`flex-1 p-3 rounded-xl border text-left text-xs ${
                  mode === 'metadata' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200' : 'bg-slate-800/40 border-slate-700 text-slate-400'
                }`}
              >
                <div className="font-semibold text-slate-200">Metadata Only (Lossless)</div>
                <div className="text-[11px] text-slate-400">Zero pixel change, cleans C2PA/IPTC</div>
              </button>
            </div>

            {/* Action Button */}
            {!batchResult && (
              <button
                onClick={handleStartBatch}
                disabled={isProcessing}
                className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 ${
                  isProcessing ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>Processing {files.length} images...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Process All {files.length} Images</span>
                  </>
                )}
              </button>
            )}

            {/* Batch Results List */}
            {batchResult && (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-300 text-xs sm:text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Processed {batchResult.total_files} files successfully!</span>
                  </div>

                  <a
                    href={batchResult.zip_url}
                    download
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All (ZIP)</span>
                  </a>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                  {batchResult.results.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        {item.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-medium text-slate-200 truncate">{item.filename}</span>
                        {item.removed_marks && item.removed_marks.length > 0 && (
                          <span className="text-slate-400 text-[10px] hidden sm:inline">
                            ({item.removed_marks.join(', ')})
                          </span>
                        )}
                      </div>

                      {item.cleaned_url && (
                        <a
                          href={item.cleaned_url}
                          download={`clean_${item.filename}`}
                          className="text-indigo-400 hover:text-indigo-300 font-medium shrink-0 ml-2"
                        >
                          Download
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
    </div>
  );
};
