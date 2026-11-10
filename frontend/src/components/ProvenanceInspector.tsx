import { useState, useRef } from 'react';
import type React from 'react';
import { Search, ShieldAlert, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import type { ProvenanceReport } from '../types';

export const ProvenanceInspector: React.FC = () => {
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
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center space-x-2 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-5 sm:p-7 shadow-xl backdrop-blur-md">
        {!previewUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500/60 hover:bg-indigo-950/10 rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 flex items-center justify-center transition-all">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-slate-200">
                Inspect Image Provenance & C2PA Credentials
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Reads cryptographically signed manifests, IPTC tags, and invisible signals
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-700" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">{selectedFile?.name}</h3>
                  <p className="text-xs text-slate-400">Deep Inspection Result</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  setReport(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Inspect Another
              </button>
            </div>

            {isInspecting && (
              <div className="p-8 text-center space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-400 mx-auto" />
                <p className="text-sm text-slate-300">Extracting cryptographic manifests & checking EXIF tags...</p>
              </div>
            )}

            {report && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Box */}
                <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 tracking-wide uppercase">AI Verdict & Attribution</h4>
                  <div className="flex items-center space-x-3 pt-1">
                    {report.is_ai_generated ? (
                      <div className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-sm flex items-center space-x-2">
                        <ShieldAlert className="w-4 h-4" />
                        <span>AI-GENERATED</span>
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-sm flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>NO AI PROVENANCE FOUND</span>
                      </div>
                    )}
                    <span className="text-xs text-slate-400">Confidence: <strong className="text-slate-200">{report.confidence}</strong></span>
                  </div>

                  <div className="text-xs space-y-2 pt-2 border-t border-slate-800/80">
                    <p className="text-slate-400">Attributed Platform: <span className="text-slate-200 font-semibold">{report.platform}</span></p>
                    <p className="text-slate-400">AI Metadata Present: <span className="text-slate-200 font-semibold">{report.has_ai_metadata ? 'Yes (C2PA/IPTC detected)' : 'No'}</span></p>
                  </div>
                </div>

                {/* Markers & C2PA */}
                <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 tracking-wide uppercase">Detected Watermarks & C2PA</h4>
                  <div className="text-xs space-y-2">
                    <p className="text-slate-400 font-medium">Markers:</p>
                    {report.watermarks.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-slate-200">
                        {report.watermarks.map((w, i) => (
                          <li key={i} className="text-indigo-300 font-mono text-[11px]">{w}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 italic">No specific watermark signatures</p>
                    )}

                    <div className="pt-2 border-t border-slate-800/80">
                      <p className="text-slate-400">C2PA Content Credentials:</p>
                      <p className="font-mono text-[11px] text-slate-300 mt-0.5 break-all bg-slate-900 p-2 rounded-lg border border-slate-800">
                        {report.c2pa}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Caveats */}
                {report.caveats.length > 0 && (
                  <div className="md:col-span-2 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1.5">
                    <div className="flex items-center space-x-1.5 font-semibold text-amber-200">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Technical Caveats:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-amber-300/90">
                      {report.caveats.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
