import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Crosshair, Trash2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface BoundingBox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface VisualRegionSelectorProps {
  imageSrc: string;
  boxes: BoundingBox[];
  onBoxesChange: (boxes: BoundingBox[]) => void;
  disabled?: boolean;
}

export const VisualRegionSelector: React.FC<VisualRegionSelectorProps> = ({
  imageSrc,
  boxes,
  onBoxesChange,
  disabled = false,
}) => {
  const { t } = useApp();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number; naturalW: number; naturalH: number }>({
    width: 1,
    height: 1,
    naturalW: 1,
    naturalH: 1,
  });

  // Update rendered dimensions on load or resize
  const updateDimensions = useCallback(() => {
    if (!imgRef.current) return;
    const { clientWidth, clientHeight, naturalWidth, naturalHeight } = imgRef.current;
    if (clientWidth > 0 && clientHeight > 0) {
      setImgDimensions({
        width: clientWidth,
        height: clientHeight,
        naturalW: naturalWidth || clientWidth,
        naturalH: naturalHeight || clientHeight,
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions, imageSrc]);

  // Coordinates helper relative to image element
  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    if (!imgRef.current) return { x: 0, y: 0 };
    const rect = imgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
    return { x, y };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    const pos = getPointerPos(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentPos(pos);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !startPos) return;
    const pos = getPointerPos(e);
    setCurrentPos(pos);
  };

  const handleEnd = () => {
    if (!isDrawing || !startPos || !currentPos) {
      setIsDrawing(false);
      setStartPos(null);
      setCurrentPos(null);
      return;
    }

    const minX = Math.min(startPos.x, currentPos.x);
    const minY = Math.min(startPos.y, currentPos.y);
    const w = Math.abs(currentPos.x - startPos.x);
    const h = Math.abs(currentPos.y - startPos.y);

    // Only add if box is at least 8x8 pixels visually
    if (w >= 8 && h >= 8) {
      const scaleX = imgDimensions.naturalW / imgDimensions.width;
      const scaleY = imgDimensions.naturalH / imgDimensions.height;

      const newBox: BoundingBox = {
        id: Math.random().toString(36).substring(2, 9),
        x: Math.round(minX * scaleX),
        y: Math.round(minY * scaleY),
        w: Math.round(w * scaleX),
        h: Math.round(h * scaleY),
      };

      onBoxesChange([...boxes, newBox]);
    }

    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
  };

  const handleRemoveBox = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onBoxesChange(boxes.filter((b) => b.id !== id));
  };

  const handleClearAll = () => {
    onBoxesChange([]);
  };

  // Convert natural image box to display percentages
  const getBoxStyle = (box: BoundingBox) => {
    const left = (box.x / imgDimensions.naturalW) * 100;
    const top = (box.y / imgDimensions.naturalH) * 100;
    const width = (box.w / imgDimensions.naturalW) * 100;
    const height = (box.h / imgDimensions.naturalH) * 100;
    return {
      left: `${left}%`,
      top: `${top}%`,
      width: `${width}%`,
      height: `${height}%`,
    };
  };

  // Active drawing box style
  const getActiveBoxStyle = () => {
    if (!startPos || !currentPos) return null;
    const left = Math.min(startPos.x, currentPos.x);
    const top = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);
    return { left, top, width, height };
  };

  const activeBox = getActiveBoxStyle();

  return (
    <div className="space-y-3">
      {/* Header bar with controls & status */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
          <Crosshair className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="font-semibold">
            {t('visualSelectorTitle') || 'Tandai Area Watermark Visual'}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            {boxes.length} {t('areasMarked') || 'area ditandai'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {boxes.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-medium transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('clearAll') || 'Hapus Semua'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Canvas Area */}
      <div
        ref={containerRef}
        className="relative mx-auto select-none overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md group touch-none"
        style={{ cursor: disabled ? 'not-allowed' : 'crosshair' }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Preview for watermark selection"
          onLoad={updateDimensions}
          className="w-full h-auto block max-h-[60vh] object-contain pointer-events-none mx-auto"
          draggable={false}
        />

        {/* Saved Bounding Boxes */}
        {boxes.map((box, index) => {
          const style = getBoxStyle(box);
          return (
            <div
              key={box.id}
              style={style}
              className="absolute border-2 border-indigo-500 bg-indigo-500/25 dark:bg-indigo-500/35 backdrop-blur-[1px] transition-all rounded shadow-sm z-20 group/box pointer-events-auto"
            >
              {/* Badge info & Delete button */}
              <div className="absolute -top-6 left-0 flex items-center space-x-1 bg-indigo-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                <span>#{index + 1}</span>
                <span className="text-[9px] opacity-80">
                  {box.w}×{box.h}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveBox(box.id, e)}
                  className="ml-1 hover:text-red-300 transition-colors p-0.5"
                  title="Hapus kotak ini"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Live Active Dragging Box */}
        {isDrawing && activeBox && (
          <div
            style={{
              left: activeBox.left,
              top: activeBox.top,
              width: activeBox.width,
              height: activeBox.height,
            }}
            className="absolute border-2 border-dashed border-indigo-400 bg-indigo-400/30 rounded pointer-events-none z-30 shadow-lg"
          >
            <div className="absolute -top-5 left-0 bg-slate-900/90 text-white text-[9px] font-mono px-1 py-0.5 rounded border border-slate-700">
              Menyeleksi...
            </div>
          </div>
        )}

        {/* Subtle instructions overlay at bottom */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/85 backdrop-blur-sm text-slate-200 text-[11px] px-3 py-1 rounded-full pointer-events-none border border-slate-700/60 shadow flex items-center space-x-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <Crosshair className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            {boxes.length === 0
              ? (t('visualSelectorHint') || 'Klik & geser (drag) di atas watermark untuk menandai area yang ingin dihapus')
              : (t('visualSelectorMoreHint') || 'Tandai area lain atau klik tombol Bersihkan Foto')}
          </span>
        </div>
      </div>

      {/* Coordinate list badge preview */}
      {boxes.length > 0 && (
        <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center space-x-1.5 font-semibold text-indigo-700 dark:text-indigo-400 mb-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>{t('readyToEraseAreas') || 'Area siap dihapus:'}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 font-mono">
            {boxes.map((b, i) => (
              <span
                key={b.id}
                className="px-2 py-0.5 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                #{i + 1}: x={b.x}, y={b.y}, w={b.w}, h={b.h}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
