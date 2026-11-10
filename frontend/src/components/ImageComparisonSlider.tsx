import { useState, useRef, useCallback, useEffect } from 'react';
import type React from 'react';
import { Columns, Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

interface ImageComparisonSliderProps {
  originalSrc: string;
  cleanedSrc: string;
  alt?: string;
}

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  originalSrc,
  cleanedSrc,
  alt = 'Comparison'
}) => {
  const { t } = useApp();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="flex flex-col space-y-3">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setViewMode('slider')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
              viewMode === 'slider'
                ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Slider</span>
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-700 dark:text-slate-300 min-w-10 text-center font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors ml-1"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      {viewMode === 'slider' ? (
        <div
          ref={containerRef}
          className="relative w-full h-[320px] sm:h-[440px] md:h-[520px] bg-slate-100 dark:bg-slate-950/90 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 select-none shadow-xl flex items-center justify-center cursor-ew-resize touch-none"
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* Zoom Wrapper */}
          <div
            className="w-full h-full relative transition-transform duration-100 ease-out flex items-center justify-center"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Cleaned Image (Bottom) */}
            <img
              src={cleanedSrc}
              alt={`${alt} - Cleaned`}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Original Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={originalSrc}
                alt={`${alt} - Original`}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />
            </div>
          </div>

          {/* Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <motion.div
              whileHover={{ scale: 1.15 }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-600 border-2 border-white shadow-xl flex items-center justify-center"
            >
              <div className="flex space-x-0.5">
                <div className="w-0.5 h-3 bg-white/90 rounded-full" />
                <div className="w-0.5 h-3 bg-white/90 rounded-full" />
              </div>
            </motion.div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-rose-500/90 backdrop-blur-md text-white text-[11px] font-bold tracking-wider z-30 pointer-events-none shadow-md">
            {t('originalLabel')}
          </div>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold tracking-wider z-30 pointer-events-none shadow-md">
            {t('cleanedLabel')}
          </div>
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative bg-slate-100 dark:bg-slate-950/80 rounded-2xl overflow-hidden border border-rose-500/30 p-2 shadow-lg">
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-rose-500 text-white text-[11px] font-bold tracking-wider z-10 shadow">
              {t('originalLabel')}
            </div>
            <div className="h-[280px] sm:h-[380px] flex items-center justify-center overflow-hidden">
              <img
                src={originalSrc}
                alt="Original"
                className="max-h-full max-w-full object-contain rounded-lg"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
          </div>

          <div className="relative bg-slate-100 dark:bg-slate-950/80 rounded-2xl overflow-hidden border border-emerald-500/30 p-2 shadow-lg">
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold tracking-wider z-10 shadow">
              {t('cleanedLabel')}
            </div>
            <div className="h-[280px] sm:h-[380px] flex items-center justify-center overflow-hidden">
              <img
                src={cleanedSrc}
                alt="Cleaned"
                className="max-h-full max-w-full object-contain rounded-lg"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
