# SMS Santri Lite — Paket PWA GitHub Pages

Aplikasi Progressive Web App (PWA) untuk manajemen data Santri. Berjalan 100% di browser, mendukung Service Worker, IndexedDB (localforage), kamera ( foto + QR scanner ), galeri, barcode, GPS, dan dapat dipasang ke homescreen seperti aplikasi native.

## 📦 Isi Paket

```
pwa-package/
├── index.html              # Aplikasi utama (kode asli, tidak diubah)
├── manifest.json           # Konfigurasi PWA
├── sw.js                   # Service Worker (offline + cache)
├── .nojekyll               # Mencegah GitHub Pages mengabaikan folder
├── README.md               # File ini
└── icons/
    ├── icon-192.png        # Ikon PWA standar
    ├── icon-512.png        # Ikon PWA standar
    ├── icon-maskable-512.png  # Ikon adaptive (Android)
    ├── apple-touch-icon.png   # Ikon untuk iOS
    └── favicon-32.png      # Favicon browser
```

## 🚀 Cara Hosting di GitHub Pages

### Langkah 1 — Buat Repository Baru
1. Buka https://github.com/new
2. Nama repo: `sms-santri-lite` (atau sesuai keinginan)
3. Pilih **Public**
4. Klik **Create repository**

### Langkah 2 — Upload Semua File
1. Klik **uploading an existing file** (link di halaman repo baru)
2. Drag & drop **SELURUH isi folder `pwa-package`** ke area upload
   - Pastikan `index.html`, `manifest.json`, `sw.js`, `.nojekyll`, dan folder `icons/` (beserta isinya) ikut terupload
3. Klik **Commit changes**

> ⚠️ Jangan upload folder `pwa-package/` itu sendiri. Upload **isi** foldernya langsung ke root repo.

### Langkah 3 — Aktifkan GitHub Pages
1. Buka **Settings** → **Pages**
2. Source: pilih **Deploy from a branch**
3. Branch: `main` (atau `master`), folder: `/ (root)`
4. Klik **Save**
5. Tunggu 1–2 menit, lalu buka URL yang muncul (misal: `https://username.github.io/sms-santri-lite/`)

### Langkah 4 — Pasang ke Homescreen
- **Android (Chrome)**: buka URL → klik menu (⋮) → **Add to Home screen** / **Install app**
- **iOS (Safari)**: buka URL → klik tombol Share (⬆) → **Add to Home Screen**

## ✅ Fitur PWA yang Aktif

| Fitur | Status |
|---|---|
| Service Worker (offline) | ✅ aktif |
| Cache app shell + CDN scripts | ✅ aktif |
| IndexedDB (localforage) | ✅ aktif |
| Kamera (foto + QR scan) | ✅ aktif (perlu HTTPS) |
| Galeri / file picker | ✅ aktif |
| Barcode (JsBarcode) | ✅ aktif |
| Audio (jika ditambah) | ✅ didukung browser |
| Geolocation / GPS | ✅ didukung browser |
| Push notifications | ✅ didukung (tidak dipakai di sini) |

## 🔒 Catatan HTTPS

GitHub Pages memberikan **HTTPS otomatis** — wajib untuk akses kamera & geolocation. Setelah halaman live via `https://username.github.io/...`, semua fitur browser (kamera, mic, GPS, service worker) akan berfungsi penuh.

## ☁️ Login & Supabase

- Buka halaman → klik **"QR Tarik dari Cloud"** → scan QR dari Super Admin untuk inject URL & Key Supabase
- Setelah itu, login via **Username/Password** **atau** **PIN** (keduanya tersedia)
- Kredensial user (`pondok_users`) ditarik dari cloud `backup_lms` table

## 🔧 Update / Re-deploy

Setiap push ke branch utama akan men-deploy ulang dalam ~1 menit. Untuk update Service Worker, naikkan versi di `sw.js` (`SW_VERSION`).

---
Versi: 1.0.0 • Semua file siap diupload langsung ke GitHub Pages.
