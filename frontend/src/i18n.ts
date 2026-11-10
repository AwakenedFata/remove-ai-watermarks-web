export type Language = 'en' | 'id';

export const translations = {
  en: {
    appTitle: 'AI Watermark Remover',
    appSubtitle: 'Remove AI watermarks, sparkles & hidden tags',

    // Tabs
    tabSingle: 'Clean Image',
    tabBatch: 'Batch Clean',
    tabInspect: 'Check AI Info',

    // Theme & Lang
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    language: 'Language',

    // Dropzone
    dropzoneTitle: 'Drop your photo here, or browse',
    dropzoneSubtitle: 'Supports PNG, JPG, WEBP, AVIF with Gemini, ChatGPT, TikTok, Kling logos',
    trySample: 'Try with a sample image',
    chooseAnother: 'Change Image',

    // Modes
    modeFullTitle: 'Auto AI Logos (Gemini, Doubao)',
    modeFullDesc: 'Erases known AI generator badges (sparkles, stamps) and clears hidden AI labels.',
    modeOcrTitle: 'Auto General Text / Copyright (OCR)',
    modeOcrDesc: 'Uses OCR AI vision to detect arbitrary text watermarks (e.g. ©Photographer, copyright) and erase them.',
    modeMetaTitle: 'Tags Only (Lossless)',
    modeMetaDesc: 'Leaves every single pixel 100% untouched. Only strips hidden AI tags.',
    recommended: 'Recommended',
    smartVision: 'AI Vision OCR',

    // Visual Box Selector & Custom region
    visualSelectorTitle: 'Visual Watermark Marker',
    visualSelectorHint: 'Click & drag on the watermark to mark the area you want to erase',
    visualSelectorMoreHint: 'Draw another box or click "Clean Photo" to erase',
    areasMarked: 'marked area(s)',
    clearAll: 'Clear All',
    readyToEraseAreas: 'Marked areas ready to erase:',
    visualSelectToggle: 'Draw / Mark Watermark on Image',
    visualSelectHide: 'Hide visual box drawer',
    customRegionToggle: 'Watermark in a custom spot? (Optional)',
    customRegionHide: 'Hide custom coordinates',
    customRegionLabel: 'Box coordinates (x, y, width, height in pixels):',
    customRegionHelp: 'Mark boxes visually above or type coordinates manually.',

    // Action
    btnClean: 'Clean Watermark & Tags',
    btnCleaning: 'Cleaning photo...',
    btnDownload: 'Download Clean Photo',

    // Status & Results
    timeTaken: 'Processed in',
    fileSize: 'Size',
    marksRemoved: 'Removed',
    originalLabel: 'ORIGINAL',
    cleanedLabel: 'CLEANED',

    // Comparison Cards
    originalCardTitle: 'Before Cleaning',
    cleanedCardTitle: 'After Cleaning',
    aiStatusDetected: 'AI Tags Detected',
    aiStatusClean: 'Clean & Verified',
    platform: 'Source Platform',
    detectedMarks: 'Detected Marks',
    noneDetected: 'None detected',
    readyToShare: 'All AI watermarks & tags have been removed. Ready to post!',

    // Batch
    batchTitle: 'Process Multiple Photos',
    batchSubtitle: 'Drop a bunch of photos to clean them all in one go',
    batchSelected: 'photos selected',
    clearQueue: 'Clear list',
    btnBatchClean: 'Process All Photos',
    btnBatchDownloading: 'Cleaning queue...',
    btnBatchZip: 'Download All (ZIP)',
    batchSuccess: 'photos cleaned successfully!',

    // Inspector
    inspectTitle: 'Check if an image has AI tags',
    inspectSubtitle: 'Look up hidden creator credentials without modifying the file',
    inspecting: 'Scanning image metadata...',
    inspectAnother: 'Check Another Photo',
    verdictAI: 'AI-Generated Content',
    verdictHuman: 'No AI Tags Found',
    confidence: 'Detection Confidence',
    hiddenMetadata: 'Hidden AI Tags',
    yesPresent: 'Yes, embedded tags found',
    notPresent: 'Clean / None found',
    notes: 'Helpful Tips',

    // FAQ banner
    faqTitle: 'How does social media (like Instagram) know it is AI?',
    faqInstagramTitle: 'Instagram & Facebook "AI info" Labels',
    faqInstagramDesc: 'Apps detect AI by reading hidden digital tags (C2PA & IPTC) embedded when generating images with ChatGPT, Photoshop, Midjourney, or Gemini. Our tool strips these tags so your posts stay clean.',
    faqQualityTitle: 'Visual Quality Guarantee',
    faqQualityDesc: 'Our smart AI eraser automatically refills the watermark area by blending textures from the surrounding image, keeping your photo sharp and natural.',

    // Footer
    footerCopy: '© 2026 AI Watermark Remover. Fast, private, and runs entirely on your device.'
  },
  id: {
    appTitle: 'AI Watermark Remover',
    appSubtitle: 'Hapus watermark AI, logo sparkle & label tersembunyi',

    // Tabs
    tabSingle: 'Bersihkan Foto',
    tabBatch: 'Banyak Foto',
    tabInspect: 'Cek Info AI',

    // Theme & Lang
    themeDark: 'Mode Gelap',
    themeLight: 'Mode Terang',
    language: 'Bahasa',

    // Dropzone
    dropzoneTitle: 'Tarik foto ke sini, atau klik untuk memilih',
    dropzoneSubtitle: 'Mendukung PNG, JPG, WEBP, AVIF dengan logo Gemini, ChatGPT, TikTok, Kling',
    trySample: 'Coba pakai foto sampel',
    chooseAnother: 'Ganti Foto',

    // Modes
    modeFullTitle: 'Otomatis Logo AI (Gemini, Doubao)',
    modeFullDesc: 'Menghapus logo vendor AI (sparkle/cap) sekaligus melucuti tanda AI tersembunyi.',
    modeOcrTitle: 'Otomatis Teks Umum / Hak Cipta (OCR)',
    modeOcrDesc: 'Memindai foto dengan model AI OCR untuk mendeteksi tanda teks fotografer (seperti ©Nama) lalu menghapusnya.',
    modeMetaTitle: 'Hanya Tanda AI (Kualitas Asli)',
    modeMetaDesc: 'Piksel foto 100% utuh tanpa diubah. Hanya menghapus metadata "Made with AI".',
    recommended: 'Direkomendasikan',
    smartVision: 'AI Vision OCR',

    // Visual Box Selector & Custom region
    visualSelectorTitle: 'Penanda Area Watermark Visual',
    visualSelectorHint: 'Klik & geser (drag) di atas watermark untuk menandai area yang ingin dihapus',
    visualSelectorMoreHint: 'Tandai area lain atau langsung klik tombol Bersihkan Foto',
    areasMarked: 'area ditandai',
    clearAll: 'Hapus Semua',
    readyToEraseAreas: 'Area siap dihapus:',
    visualSelectToggle: 'Tandai Watermark Langsung di Foto',
    visualSelectHide: 'Sembunyikan kanvas penanda',
    customRegionToggle: 'Watermark di posisi khusus? (Opsional)',
    customRegionHide: 'Sembunyikan koordinat khusus',
    customRegionLabel: 'Koordinat area (x, y, lebar, tinggi dalam piksel):',
    customRegionHelp: 'Tandai area secara visual di atas atau ketik angka koordinat secara manual.',

    // Action
    btnClean: 'Bersihkan Watermark & Tanda AI',
    btnCleaning: 'Sedang membersihkan...',
    btnDownload: 'Unduh Foto Bersih',

    // Status & Results
    timeTaken: 'Waktu proses',
    fileSize: 'Ukuran',
    marksRemoved: 'Dihapus',
    originalLabel: 'SEBELUM',
    cleanedLabel: 'SESUDAH',

    // Comparison Cards
    originalCardTitle: 'Sebelum Dibersihkan',
    cleanedCardTitle: 'Sesudah Dibersihkan',
    aiStatusDetected: 'Terdeteksi Tanda AI',
    aiStatusClean: 'Bersih & Tervalidasi',
    platform: 'Asal Pembuat',
    detectedMarks: 'Tanda Ditemukan',
    noneDetected: 'Tidak ada tanda',
    readyToShare: 'Semua watermark dan tanda AI telah dibersihkan. Siap dibagikan!',

    // Batch
    batchTitle: 'Bersihkan Banyak Foto Sekaligus',
    batchSubtitle: 'Pilih beberapa foto untuk dibersihkan otomatis dalam satu antrean',
    batchSelected: 'foto dipilih',
    clearQueue: 'Kosongkan daftar',
    btnBatchClean: 'Proses Semua Foto',
    btnBatchDownloading: 'Memproses antrean...',
    btnBatchZip: 'Unduh Semua (ZIP)',
    batchSuccess: 'foto berhasil dibersihkan!',

    // Inspector
    inspectTitle: 'Cek apakah foto memiliki tanda AI',
    inspectSubtitle: 'Periksa label pembuat tersembunyi tanpa mengubah file foto',
    inspecting: 'Memindai informasi foto...',
    inspectAnother: 'Cek Foto Lain',
    verdictAI: 'Konten Buatan AI',
    verdictHuman: 'Tidak Ditemukan Tanda AI',
    confidence: 'Tingkat Kepastian',
    hiddenMetadata: 'Tanda AI Tersembunyi',
    yesPresent: 'Ya, ditemukan tanda tersembunyi',
    notPresent: 'Bersih / Tidak ditemukan',
    notes: 'Informasi Penting',

    // FAQ banner
    faqTitle: 'Bagaimana Instagram / sosmed tahu kalau ini foto AI?',
    faqInstagramTitle: 'Label "AI info" di Instagram & Facebook',
    faqInstagramDesc: 'Sosmed mendeteksi AI dengan membaca tanda digital tersembunyi (C2PA & IPTC) yang otomatis ditanam oleh ChatGPT, Photoshop, atau Gemini. Aplikasi ini melucuti tanda tersebut agar foto Anda bebas dari label.',
    faqQualityTitle: 'Jaminan Kualitas Foto',
    faqQualityDesc: 'Penghapus pintar kami menambal area watermark dengan membaurkan tekstur alami di sekelilingnya, sehingga foto tetap tajam dan terlihat asli.',

    // Footer
    footerCopy: '© 2026 AI Watermark Remover. Cepat, aman, dan berjalan langsung di perangkat Anda.'
  }
};
