# AI Watermark Studio (Web App & CLI)

Aplikasi web modern berbasis **React Vite + Tailwind CSS** (Frontend) dan **FastAPI** (Backend) yang mengimplementasikan [wiltodelta/remove-ai-watermarks](https://github.com/wiltodelta/remove-ai-watermarks) untuk mendeteksi serta membersihkan watermark AI terlihat dan metadata provenance (C2PA, IPTC, EXIF, XMP).

---

## 1. Fitur Utama Web App

1. **Studio Clean (Single Image)**:
   - Drag & drop gambar (PNG, JPG, WEBP, AVIF).
   - Tombol 1-klik untuk mencoba sampel riil Google Gemini (`demo_banana_before.png`).
   - Pilihan mode:
     - **Visible Mark + Metadata (Default)**: Menghilangkan watermark visual (sparkle Gemini, Doubao, Kling, dll.) dengan AI Inpainting LaMa-ONNX + membersihkan C2PA/IPTC.
     - **Lossless Metadata Only**: Mempertahankan 100% data piksel asli tanpa re-encode visual, hanya menghapus metadata C2PA / EXIF / IPTC.
     - **Custom Region Erase**: Opsi manual koordinat kotak watermark jika tidak terdeteksi otomatis.
   - **Interactive Before / After Split Slider**: Slider perbandingan visual interaktif dengan pembatas geser real-time, toggle side-by-side, dan zoom/pan 50% - 300%.
   - **Provenance Verification Card**: Bukti inspeksi sebelum vs sesudah (status AI, platform, sertifikat C2PA, ukuran file, waktu proses).
   - Tombol unduh hasil bersih 1-klik.

2. **Batch Queue**:
   - Pemrosesan massal banyak gambar sekaligus.
   - Indikator status per file.
   - Unduh seluruh hasil bersih dalam satu file ZIP.

3. **C2PA Inspector**:
   - Inspeksi mendalam kredensial C2PA, verifikasi tanda tangan digital pembuat, klaim SynthID, dan tag EXIF tanpa memodifikasi file.

---

## 2. Cara Menjalankan Web App

### Opsi 1: Mode Produksi (Satu Perintah Langsung Buka Browser)
Cukup jalankan file batch:
```cmd
D:\remove-ai-watermarks-project\start-web.bat
```
Atau via terminal:
```powershell
cd D:\remove-ai-watermarks-project
D:\python.exe -m uvicorn server.app:app --host 0.0.0.0 --port 8000
```
Buka di browser: **`http://localhost:8000`**

### Opsi 2: Mode Developer (Hot-Reload Frontend & Backend)
```cmd
D:\remove-ai-watermarks-project\dev-web.bat
```
- Frontend Vite Dev Server berjalan di: `http://localhost:5173`
- Backend FastAPI berjalan di: `http://localhost:8000`

---

## 3. Struktur Direktori Proyek

```
D:\remove-ai-watermarks-project\
├── start-web.bat            # Launcher instan web app mode produksi
├── dev-web.bat              # Launcher mode development (Vite + FastAPI reload)
├── clean.bat                # Shortcut drag-and-drop CLI cepat
├── run_cleaner.py           # Script CLI Python mandiri
├── README.md                # Dokumentasi proyek
├── frontend/                # React 19 + Vite 6 + Tailwind CSS + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx                 # Navbar & deteksi hardware
│   │   │   ├── SingleCleaner.tsx          # Studio clean utama
│   │   │   ├── ImageComparisonSlider.tsx  # Slider perbandingan Before/After
│   │   │   ├── BatchCleaner.tsx           # Antrean pemrosesan massal & zip
│   │   │   ├── ProvenanceInspector.tsx    # Forensic metadata & C2PA viewer
│   │   │   └── InfoBanner.tsx             # Penjelasan Instagram & GPU
│   │   ├── types.ts                       # Typed interfaces
│   │   ├── App.tsx
│   │   └── index.css                      # Tailwind setup
│   └── dist/                              # Bundle produksi teroptimasi
└── server/                  # FastAPI Backend API
    ├── app.py               # REST API endpoints & static SPA server
    ├── uploads/             # Cache gambar upload
    └── outputs/             # File hasil pembersihan
```

---

## 4. Catatan Teknis Hardware & Platform (Instagram/Meta)

- **Akselerasi di Mesin Ini:** Menggunakan engine **CPU via LaMa-ONNX**. Pembersihan watermark visual dan metadata berjalan cepat tanpa butuh GPU diskrit.
- **Deteksi AI di Instagram:** Label *"AI info"* di Instagram dipicu oleh manifest **C2PA** dan tag **IPTC** (`digitalSourceType`). Menjalankan mode *Studio Clean* atau *Metadata Only* pada web app ini secara tervalidasi menghilangkan pemicu metadata tersebut.
