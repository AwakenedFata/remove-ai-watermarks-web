import os
import sys
import argparse
from pathlib import Path
import remove_ai_watermarks as raiw
from remove_ai_watermarks.identify import identify
from remove_ai_watermarks.metadata import has_ai_metadata, remove_ai_metadata

def identify_image(input_path: str):
    """Cek keberadaan metadata provenance dan watermark pada file."""
    p = Path(input_path)
    if not p.exists():
        print(f"Error: File '{input_path}' tidak ditemukan.")
        return
    print(f"\n[INFO] Mengidentifikasi sinyal AI pada: {p.name}")
    report = identify(p)
    print(f"- AI Generated : {report.is_ai_generated} (Confidence: {report.confidence})")
    print(f"- Platform     : {report.platform}")
    print(f"- Markers      : {report.watermarks if report.watermarks else 'Tidak ditemukan'}")
    if report.caveats:
        print("- Catatan:")
        for c in report.caveats:
            print(f"  * {c}")

def clean_visible_and_metadata(input_path: str, output_path: str = None):
    """Hapus watermark terlihat dan bersihkan metadata AI sekaligus."""
    p = Path(input_path)
    if not p.exists():
        print(f"Error: File '{input_path}' tidak ditemukan.")
        return
    if not output_path:
        out_p = p.with_name(f"{p.stem}_clean{p.suffix}")
    else:
        out_p = Path(output_path)

    print(f"\n[INFO] Menghapus watermark terlihat & metadata AI...")
    print(f"Input : {p}")
    print(f"Output: {out_p}")

    _, removed = raiw.remove_visible(str(p), str(out_p))
    if removed:
        print(f"Hasil: Berhasil menghapus watermark: {', '.join(removed)}")
    else:
        print("Hasil: Tidak ditemukan watermark terlihat yang terdaftar, file disimpan dengan metadata dibersihkan.")

def clean_metadata_only(input_path: str, output_path: str = None):
    """Hapus metadata AI saja tanpa menyentuh piksel."""
    p = Path(input_path)
    if not p.exists():
        print(f"Error: File '{input_path}' tidak ditemukan.")
        return
    if not output_path:
        out_p = p.with_name(f"{p.stem}_no_meta{p.suffix}")
    else:
        out_p = Path(output_path)

    has_meta = has_ai_metadata(p)
    print(f"\n[INFO] Memeriksa metadata AI pada: {p.name}")
    print(f"Metadata AI terdeteksi: {has_meta}")
    
    saved_path = remove_ai_metadata(p, out_p)
    print(f"Selesai. File tanpa metadata AI disimpan di: {saved_path}")

def clean_folder_batch(folder_path: str, output_dir: str = None):
    """Bersihkan seluruh isi folder gambar secara massal."""
    p = Path(folder_path)
    if not p.is_dir():
        print(f"Error: Folder '{folder_path}' tidak ditemukan.")
        return
    if not output_dir:
        out_dir = p / "cleaned_results"
    else:
        out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n[INFO] Memproses folder: {p} -> {out_dir}")
    batch_result = raiw.remove_batch(str(p), str(out_dir), mode="visible")
    print(f"Selesai memproses batch. Total file diproses: {len(batch_result.items)}")
    for item in batch_result.items:
        print(f"File: {Path(item.source).name} | Status: {item.visible_status} | Marks: {item.visible_marks}")

def main():
    parser = argparse.ArgumentParser(description="AI Watermark & Metadata Cleaner Runner")
    subparsers = parser.add_subparsers(dest="command", help="Perintah yang tersedia")

    # Command: identify
    id_parser = subparsers.add_parser("identify", help="Cek sinyal AI dan metadata pada file")
    id_parser.add_argument("file", help="Path file gambar")

    # Command: clean
    clean_parser = subparsers.add_parser("clean", help="Hapus watermark terlihat dan metadata AI")
    clean_parser.add_argument("file", help="Path file gambar")
    clean_parser.add_argument("-o", "--output", help="Path file output (opsional)")

    # Command: metadata
    meta_parser = subparsers.add_parser("metadata", help="Hapus metadata AI saja (tanpa ubah piksel)")
    meta_parser.add_argument("file", help="Path file gambar")
    meta_parser.add_argument("-o", "--output", help="Path file output (opsional)")

    # Command: batch
    batch_parser = subparsers.add_parser("batch", help="Bersihkan seluruh gambar dalam folder")
    batch_parser.add_argument("folder", help="Path folder gambar")
    batch_parser.add_argument("-o", "--output", help="Folder tujuan (opsional)")

    args = parser.parse_args()

    if args.command == "identify":
        identify_image(args.file)
    elif args.command == "clean":
        clean_visible_and_metadata(args.file, args.output)
    elif args.command == "metadata":
        clean_metadata_only(args.file, args.output)
    elif args.command == "batch":
        clean_folder_batch(args.folder, args.output)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
