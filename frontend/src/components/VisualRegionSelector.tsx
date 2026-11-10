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
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number }>({ w: 1, h: 1 });

  // Update image natural dimensions
  const updateDimensions = useCallback(() => {
    if (!imgRef.current) return;
    const { naturalWidth, naturalHeight } = imgRef.current;
    if (naturalWidth > 0 && naturalHeight > 0) {
      setNaturalSize({ w: naturalWidth, h: naturalHeight });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
  }, [updateDimensions, imageSrc]);

  // Coordinates helper relative to the exact overlay container
  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    if (!overlayRef.current) return { x: 0, y: 0 };
    const rect = overlayRef.current.getBoundingClientRect();
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
    if (!isDrawing || !startPos || !currentPos || !overlayRef.current) {
      setIsDrawing(false);
      setStartPos(null);
      setCurrentPos(null);
      return;
    }

    const rect = overlayRef.current.getBoundingClientRect();
    const minX = Math.min(startPos.x, currentPos.x);
    const minY = Math.min(startPos.y, currentPos.y);
    const w = Math.abs(currentPos.x - startPos.x);
    const h = Math.abs(currentPos.y - startPos.y);

    // Only add if box is at least 6x6 pixels on screen
    if (w >= 6 && h >= 6 && rect.width > 0 && rect.height > 0) {
      const scaleX = naturalSize.w / rect.width;
      const scaleY = naturalSize.h / rect.height;

      const actualX = Math.max(0, Math.round(minX * scaleX));
      const actualY = Math.max(0, Math.round(minY * scaleY));
      const actualW = Math.min(naturalSize.w - actualX, Math.round(w * scaleX));
      const actualH = Math.min(naturalSize.h - actualY, Math.round(h * scaleY));

      if (actualW > 4 && actualH > 4) {
        const newBox: BoundingBox = {
          id: Math.random().toString(36).substring(2, 9),
          x: actualX,
          y: actualY,
          w: actualW,
          h: actualH,
        };
        onBoxesChange([...boxes, newBox]);
      }
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
    const nw = naturalSize.w || 1;
    const nh = naturalSize.h || 1;
    const left = (box.x / nw) * 100;
    const top = (box.y / nh) * 100;
    const width = (box.w / nw) * 100;
    const height = (box.h / nh) * 100;
    return {
      left: `${left}%`,
      top: `${top}%`,
      width: `${width}%`,
      height: `${height}%`,
    };
  };

  // Active drawing box style
  const getActiveBoxStyle = () => {
    if (!startPos || !currentPos || !overlayRef.current) return null;
    const rect = overlayRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    const left = (Math.min(startPos.x, currentPos.x) / rect.width) * 100;
    const top = (Math.min(startPos.y, currentPos.y) / rect.height) * 100;
    const width = (Math.abs(currentPos.x - startPos.x) / rect.width) * 100;
    const height = (Math.abs(currentPos.y - startPos.y) / rect.height) * 100;

    return {
      left: `${left}%`,
      top: `${top}%`,
      width: `${width}%`,
      height: `${height}%`,
    };
  };

  const activeBoxStyle = getActiveBoxStyle();

  return (
    <div className="space-y-3">
      {/* Header bar with controls & status */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
          <Crosshair className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="font-semibold">
            {t('visualSelectorTitle') || 'Tandai Area Watermark Visual'}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-mono">
            {boxes.length} {t('areasMarked') || 'area ditandai'}
          </span>
          {naturalSize.w > 1 && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              ({naturalSize.w}×{naturalSize.h}px)
            </span>
          )}
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

      {/* Interactive Visual Canvas Container: tightly wraps image with zero letterbox offset */}
      <div className="flex justify-center w-full p-2 bg-slate-950/90 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
        <div className="relative inline-block max-w-full select-none">
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Preview for watermark selection"
            onLoad={updateDimensions}
            className="block max-w-full max-h-[60vh] w-auto h-auto rounded-lg select-none pointer-events-none"
            draggable={false}
          />

          {/* Transparent interactive drawing overlay matching image pixel-for-pixel */}
          <div
            ref={overlayRef}
            className="absolute inset-0 cursor-crosshair touch-none select-none z-10"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          >
            {/* Saved Bounding Boxes */}
            {boxes.map((box, index) => {
              const style = getBoxStyle(box);
              return (
                <div
                  key={box.id}
                  style={style}
                  className="absolute border-2 border-indigo-400 bg-indigo-500/35 backdrop-blur-[0.5px] rounded-xs shadow-md z-20 group/box pointer-events-auto transition-all"
                >
                  {/* Badge info & Delete button */}
                  <div className="absolute -top-6 left-0 flex items-center space-x-1 bg-indigo-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                    <span>#{index + 1}</span>
                    <span className="text-[9px] opacity-85">
                      {box.w}×{box.h}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveBox(box.id, e)}
                      className="ml-1 hover:text-red-300 transition-colors p-0.5"
                      title="Hapus area ini"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Live Active Dragging Box */}
            {isDrawing && activeBoxStyle && (
              <div
                style={activeBoxStyle}
                className="absolute border-2 border-dashed border-indigo-400 bg-indigo-500/30 rounded-xs pointer-events-none z-30 shadow-lg"
              >
                <div className="absolute -top-5 left-0 bg-slate-900/90 text-white text-[9px] font-mono px-1 py-0.5 rounded border border-slate-700">
                  Menyeleksi...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coordinate list badge preview */}
      {boxes.length > 0 && (
        <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center space-x-1.5 font-semibold text-indigo-700 dark:text-indigo-400 mb-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>{t('readyToEraseAreas') || 'Area siap dihapus (neural inpainting):'}</span>
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
