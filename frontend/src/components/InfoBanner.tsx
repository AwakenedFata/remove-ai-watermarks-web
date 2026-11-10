import { useState } from 'react';
import type React from 'react';
import { Info, ChevronDown, ChevronUp, Cpu, Globe } from 'lucide-react';

export const InfoBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden text-xs text-slate-400">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/40 transition-colors text-left"
      >
        <div className="flex items-center space-x-2 text-slate-300 font-medium">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Technical Note: How Instagram AI Detection & GPU Requirements Work</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800/60 bg-slate-950/40 text-[12px] leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-indigo-300 font-semibold">
                <Globe className="w-4 h-4" />
                <span>Instagram / Meta "AI info" Labels</span>
              </div>
              <p>
                Meta detects AI primarily via <strong>C2PA Content Credentials</strong> and <strong>IPTC digitalSourceType</strong> metadata tags embedded by image generators (DALL-E, Photoshop, Midjourney, Imagen).
              </p>
              <p className="text-emerald-300">
                Stripping metadata (via Studio Clean or Metadata-Only mode) removes these cryptographic manifests without altering image quality.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-indigo-300 font-semibold">
                <Cpu className="w-4 h-4" />
                <span>Hardware Acceleration</span>
              </div>
              <p>
                Visible watermark removal (Gemini sparkle, Doubao, Kling) runs on <strong>CPU via LaMa-ONNX</strong> inpainting.
              </p>
              <p>
                Removing invisible pixel watermarks (e.g. diffusion-based SynthID) requires an NVIDIA GPU (CUDA). Visual classifiers are separate from provenance marks.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
