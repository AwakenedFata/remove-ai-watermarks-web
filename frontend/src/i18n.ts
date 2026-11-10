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
    modeFullTitle: 'Full Clean (Logo + AI Tags)',
    modeFullDesc: 'Erases visible watermarks (sparkles, stamps) and clears hidden AI labels.',
    modeMetaTitle: 'Tags Only (Lossless)',
    modeMetaDesc: 'Leaves every single pixel 100% untouched. Only strips hidden AI tags.',
    recommended: 'Recommended',

    // Custom region
    customRegionToggle: 'Watermark in a custom spot? (Optional)',
    customRegionHide: 'Hide custom coordinates',
    customRegionLabel: 'Box coordinates (x, y, width, height in pixels):',
    customRegionHelp: 'Leave blank to let our smart detector find the logo automatically.',

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
    modeFullTitle: 'Bersih Total (Logo + Tanda AI)',
    modeFullDesc: 'Menghapus logo terlihat (sparkle/cap) sekaligus melucuti tanda AI tersembunyi.',
    modeMetaTitle: 'Hanya Tanda AI (Kualitas Asli)',
    modeMetaDesc: 'Piksel foto 100% utuh tanpa diubah. Hanya menghapus metadata "Made with AI".',
    recommended: 'Direkomendasikan',

    // Custom region
    customRegionToggle: 'Watermark di posisi khusus? (Opsional)',
    customRegionHide: 'Sembunyikan koordinat khusus',
    customRegionLabel: 'Koordinat area (x, y, lebar, tinggi dalam piksel):',
    customRegionHelp: 'Kosongkan jika ingin detektor pintar mencari logo secara otomatis.',

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
