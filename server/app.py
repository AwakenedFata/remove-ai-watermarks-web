import os
import sys
import time
import uuid
import shutil
import zipfile
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

import remove_ai_watermarks as raiw
from remove_ai_watermarks.identify import identify
from remove_ai_watermarks.metadata import has_ai_metadata, remove_ai_metadata

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "server" / "uploads"
OUTPUT_DIR = BASE_DIR / "server" / "outputs"
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="Remove AI Watermarks Studio API",
    description="Production-ready API for identifying and removing AI watermarks and provenance metadata",
    version="1.0.0"
)

# Enable CORS for Vite dev server (port 5173) and any local origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount media directories
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
app.mount("/outputs", StaticFiles(directory=str(OUTPUT_DIR)), name="outputs")

def _try_torch() -> bool:
    try:
        import importlib
        torch = importlib.import_module("torch")
        return bool(torch.cuda.is_available())
    except Exception:
        return False

def get_system_hardware_info():
    """Detects available acceleration backends."""
    has_cuda = _try_torch()
    return {
        "cuda_available": has_cuda,
        "device_name": "NVIDIA GPU (CUDA)" if has_cuda else "CPU (LaMa-ONNX / OpenCV Engine)",
        "can_remove_visible": True,
        "can_remove_metadata": True,
        "can_remove_invisible": has_cuda
    }

@app.get("/api/system-status")
def system_status():
    return {
        "status": "online",
        "version": raiw.__version__,
        "hardware": get_system_hardware_info(),
        "supported_signals": [
            "Google Gemini & Imagen (Sparkle logo & C2PA)",
            "TikTok Doubao & Jimeng labels",
            "Kling AI, Qwen, Yuanbao, Dola, Baidu, LiblibAI",
            "Microsoft Copilot / Designer AI-badges",
            "Samsung Galaxy AI disclosures",
            "C2PA Content Credentials & IPTC AI tags",
            "Lossless EXIF / XMP / PNG / MP4 AIGC metadata stripping"
        ]
    }

def _build_provenance_dict(report) -> dict:
    c2pa_status = "Not Present"
    if hasattr(report, "c2pa_validation") and report.c2pa_validation:
        c2pa_status = str(report.c2pa_validation)

    return {
        "is_ai_generated": bool(getattr(report, "is_ai_generated", False)),
        "confidence": str(getattr(report, "confidence", "none")),
        "platform": str(getattr(report, "platform", "undetermined")),
        "watermarks": list(getattr(report, "watermarks", [])),
        "signals": getattr(report, "signals", {}),
        "c2pa": c2pa_status,
        "caveats": list(getattr(report, "caveats", []))
    }

@app.post("/api/identify")
async def identify_endpoint(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4().hex[:12]}_{file.filename}"
    file_path = UPLOAD_DIR / filename

    try:
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        report = identify(file_path)
        has_meta = has_ai_metadata(file_path)

        data = _build_provenance_dict(report)
        data["has_ai_metadata"] = has_meta
        data["file_url"] = f"/uploads/{filename}"
        data["filename"] = file.filename
        data["file_size_bytes"] = file_path.stat().st_size
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to inspect image: {str(e)}")

@app.post("/api/clean")
async def clean_endpoint(
    file: UploadFile = File(...),
    mode: str = Form("visible"), # "visible" or "metadata"
    region: Optional[str] = Form(None) # "x,y,w,h" optional manual region
):
    upload_name = f"{uuid.uuid4().hex[:12]}_{file.filename}"
    file_path = UPLOAD_DIR / upload_name

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    start_time = time.time()
    out_name = f"clean_{upload_name}"
    out_path = OUTPUT_DIR / out_name

    removed_marks = []
    try:
        # Pre-cleaning identification
        pre_report = identify(file_path)
        pre_info = _build_provenance_dict(pre_report)

        if mode == "metadata":
            # Lossless metadata stripping
            remove_ai_metadata(file_path, out_path)
            removed_marks = ["All AI Metadata (C2PA, IPTC, EXIF)"]
        else:
            # Mode "visible": strips visible watermark and metadata
            if region:
                # Manual region erase
                import cv2
                from remove_ai_watermarks.region_eraser import erase
                parts = [int(x.strip()) for x in region.split(",") if x.strip()]
                if len(parts) == 4:
                    x, y, w, h = parts
                    img = cv2.imread(str(file_path))
                    if img is not None:
                        erased_img = erase(img, boxes=[(x, y, w, h)])
                        cv2.imwrite(str(out_path), erased_img)
                        remove_ai_metadata(out_path, out_path)
                        removed_marks = [f"Manual region [{x},{y},{w},{h}] & Metadata"]
                    else:
                        _, removed = raiw.remove_visible(str(file_path), str(out_path))
                        removed_marks = removed or ["Metadata cleaned (No visible marks found)"]
                else:
                    _, removed = raiw.remove_visible(str(file_path), str(out_path))
                    removed_marks = removed or ["Metadata cleaned (No visible marks found)"]
            else:
                _, removed = raiw.remove_visible(str(file_path), str(out_path))
                removed_marks = removed if removed else ["Cleaned metadata (No recognized visible mark)"]

        elapsed = round(time.time() - start_time, 2)

        # Post-cleaning inspection to prove clean verdict
        post_report = identify(out_path)
        post_info = _build_provenance_dict(post_report)

        return {
            "success": True,
            "mode": mode,
            "elapsed_seconds": elapsed,
            "original_url": f"/uploads/{upload_name}",
            "cleaned_url": f"/outputs/{out_name}",
            "filename": file.filename,
            "original_size": file_path.stat().st_size,
            "cleaned_size": out_path.stat().st_size,
            "removed_marks": removed_marks,
            "pre_inspection": pre_info,
            "post_inspection": post_info
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleaning failed: {str(e)}")

@app.post("/api/batch")
async def batch_endpoint(
    files: List[UploadFile] = File(...),
    mode: str = Form("visible")
):
    results = []
    batch_id = uuid.uuid4().hex[:8]
    batch_out_dir = OUTPUT_DIR / f"batch_{batch_id}"
    batch_out_dir.mkdir(parents=True, exist_ok=True)

    for f in files:
        upload_name = f"{uuid.uuid4().hex[:8]}_{f.filename}"
        in_path = UPLOAD_DIR / upload_name
        with open(in_path, "wb") as buff:
            shutil.copyfileobj(f.file, buff)

        out_name = f"clean_{f.filename}"
        out_path = batch_out_dir / out_name

        try:
            if mode == "metadata":
                remove_ai_metadata(in_path, out_path)
                removed = ["AI Metadata stripped"]
            else:
                _, removed = raiw.remove_visible(str(in_path), str(out_path))

            post = identify(out_path)
            results.append({
                "filename": f.filename,
                "success": True,
                "original_url": f"/uploads/{upload_name}",
                "cleaned_url": f"/outputs/batch_{batch_id}/{out_name}",
                "removed_marks": removed,
                "ai_detected_after": post.is_ai_generated
            })
        except Exception as err:
            results.append({
                "filename": f.filename,
                "success": False,
                "error": str(err)
            })

    # Create zip archive of all cleaned files
    zip_filename = f"batch_cleaned_{batch_id}.zip"
    zip_path = OUTPUT_DIR / zip_filename
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, _, fs in os.walk(batch_out_dir):
            for file in fs:
                full_p = Path(root) / file
                zipf.write(full_p, arcname=file)

    return {
        "batch_id": batch_id,
        "total_files": len(files),
        "results": results,
        "zip_url": f"/outputs/{zip_filename}"
    }

# Mount SPA frontend if built
if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting server on http://0.0.0.0:{port}")
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
