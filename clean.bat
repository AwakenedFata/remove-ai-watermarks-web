@echo off
if "%~1"=="" (
    echo =======================================================
    echo AI Watermark ^& Metadata Cleaner
    echo =======================================================
    echo Cara penggunaan:
    echo 1. Drag and drop file gambar langsung ke file batch ini.
    echo 2. Atau lewat terminal: clean.bat "path\ke\gambar.png"
    echo =======================================================
    pause
    exit /b
)

D:\python.exe D:\remove-ai-watermarks-project\run_cleaner.py clean "%~1"
pause
