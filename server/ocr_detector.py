import os
import cv2
import numpy as np
from pathlib import Path
from typing import List, Tuple

_EASYOCR_READER = None

def _get_easyocr_reader():
    global _EASYOCR_READER
    if _EASYOCR_READER is None:
        try:
            import easyocr
            # Initialize reader in English with CPU execution (safe for all machines)
            _EASYOCR_READER = easyocr.Reader(['en'], gpu=False, verbose=False)
        except Exception as e:
            print(f"[OCR] EasyOCR initialization failed: {e}")
            _EASYOCR_READER = False
    return _EASYOCR_READER

def detect_text_boxes_easyocr(image_path: Path, padding: int = 8) -> List[Tuple[int, int, int, int]]:
    """
    Detects arbitrary text/watermarks using EasyOCR.
    Returns list of bounding boxes as (x, y, w, h).
    """
    reader = _get_easyocr_reader()
    if not reader:
        return []

    try:
        img = cv2.imread(str(image_path))
        if img is None:
            return []
        img_h, img_w = img.shape[:2]

        results = reader.readtext(str(image_path))
        boxes: List[Tuple[int, int, int, int]] = []

        for item in results:
            # item format: (bbox_coords, text, confidence)
            bbox = item[0]
            confidence = item[2] if len(item) > 2 else 1.0

            # Filter out very low confidence noise
            if confidence < 0.2:
                continue

            # bbox is list of 4 points: [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
            x_vals = [pt[0] for pt in bbox]
            y_vals = [pt[1] for pt in bbox]

            x_min = int(min(x_vals))
            y_min = int(min(y_vals))
            x_max = int(max(x_vals))
            y_max = int(max(y_vals))

            # Apply padding to capture dropshadows, copyright symbols and contours
            x = max(0, x_min - padding)
            y = max(0, y_min - padding)
            w = min(img_w - x, (x_max - x_min) + 2 * padding)
            h = min(img_h - y, (y_max - y_min) + 2 * padding)

            if w > 4 and h > 4:
                boxes.append((x, y, w, h))

        return boxes
    except Exception as e:
        print(f"[OCR] Error during EasyOCR detection: {e}")
        return []

def detect_text_boxes_opencv_fallback(image_path: Path) -> List[Tuple[int, int, int, int]]:
    """
    Morphology-based high-contrast text overlay detector fallback using OpenCV.
    Detects prominent text watermarks and high-contrast overlays.
    """
    try:
        img = cv2.imread(str(image_path))
        if img is None:
            return []
        img_h, img_w = img.shape[:2]

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # High-pass filter via morphological gradient
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        grad = cv2.morphologyEx(gray, cv2.MORPH_GRADIENT, kernel)
        
        # Binarize
        _, thresh = cv2.threshold(grad, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
        
        # Connect text horizontal lines
        rect_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (9, 3))
        connected = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, rect_kernel)
        
        contours, _ = cv2.findContours(connected, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        boxes = []
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            # Filter candidate text watermark size: width > 25, aspect ratio > 1.2
            if w > 25 and h > 10 and (w / float(h)) >= 1.2:
                # Discard boxes that are whole-image
                if w < img_w * 0.95 and h < img_h * 0.95:
                    boxes.append((x, y, w, h))
        return boxes
    except Exception as e:
        print(f"[OCR] Fallback detection error: {e}")
        return []

def detect_arbitrary_text_boxes(image_path: Path) -> List[Tuple[int, int, int, int]]:
    """
    Unified entry point for general text/copyright watermark detection.
    Attempts EasyOCR first, then falls back to morphology detection if unavailable.
    """
    boxes = detect_text_boxes_easyocr(image_path)
    if boxes:
        return boxes
    # If easyocr returned no boxes or isn't ready yet, return empty list (safe behavior)
    return []
