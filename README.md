# AxiomOS — Open-Source First-Principles Work & Company OS

**AxiomOS** adalah proyek *open-source* (*Work & Company Operating System*) yang mengimplementasikan secara **Hulu ke Hilir** empat pilar produktivitas, manajemen proses, dan pengambilan keputusan **Elon Musk** (sebagaimana dibedah dalam studi kasus *First Principles Thinking*):

1. **HULU 1 — First Principles Lab (`Assumption & BoM Deconstructor`):** Membongkar masalah kompleks ke komponen/fakta dasar (*fundamental truths*), menghitung **Idiocy Index** (rasio harga pasar terhadap biaya material mentah), dan merakit solusi baru dari nol (*rebuild from scratch*).
2. **HULU 2 — Extreme Time Engine (`5-Minute Micro-Block & Context Shield`):** Menjadwalkan aktivitas dalam presisi 5 menit, menegakkan aturan **One-Day-One-Context** (mencegah *context switching*), memprioritaskan kerja kognitif berat di jam puncak pagi (`07:00–11:00`), dan menjaga waktu tidur $\ge 6\text{ jam}$.
3. **TENGAH — Flat-Org & Autonomous Micro-ERP (`DRI Pods & Real-Time Ledger`):** Menggantikan birokrasi berlapis dengan jaringan datar berbasis **DRI (*Directly Responsible Individual*)**, delegasi penuh ke tim kecil bertalenta tinggi (*A-Player Pods*), serta integrasi *real-time* antara proyek, anggaran/inventori, dan metrik *Output per Jam*.
4. **HILIR — High-Velocity Decision & Anti-Meeting Engine (`Burn-Rate Timer & Walk-Out Protocol`):** Memangkas rapat tanpa tujuan jelas, menampilkan **Live Meeting Burn-Rate** detik demi detik, menyediakan tombol resmi **Walk Out** tanpa stigma bagi peserta yang tidak lagi relevan, dan mencatat keputusan cepat dengan target *Time-to-Decision (TTD)*.

---

## Arsitektur Hulu ke Hilir

```
[1. First Principles Lab] ──(Spawns Solution)──> [3. Flat-Org Micro-ERP Pod]
          │                                                  │
          ▼                                                  ▼
[2. 5-Min Timebox & Context Shield]             [4. Anti-Meeting & Rapid Decision]
```

## Struktur Proyek

```text
axiomos/
├── index.html              # Antarmuka Web Mandiri (Local-First)
├── package.json            # Konfigurasi paket & skrip pengujian
├── LICENSE                 # Lisensi Open-Source MIT
├── src/
│   ├── core/
│   │   └── engine.js       # Mesin kalkulasi murni (4 Modul Hulu-Hilir)
│   ├── data/
│   │   └── seed.js         # Data awal studi kasus (SpaceX/Tesla & UMKM/Startup)
│   ├── styles/
│   │   └── index.css       # Desain sistem CSS murni
│   └── app.js              # Pengendali state & UI interaktif
└── tests/
    └── engine.test.js      # Unit test otomatis untuk seluruh rumus & guardrail
```

## Cara Menjalankan

1. **Jalankan Unit Tests:**
   ```bash
   npm test
   ```
2. **Buka Aplikasi Web:**
   Buka `index.html` secara langsung di peramban atau jalankan server statis:
   ```bash
   npm start
   ```
3. **Build & Deploy ke Cloudflare (Pages / Workers):**
   - **Via Dashboard Cloudflare (Zero-Config Git Integration):**
     Hubungkan repositori `ridloabelian/axiomos` di **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**, gunakan:
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
   - **Via GitHub Actions (Otomatis setiap Push ke `main`):**
     Tambahkan `CLOUDFLARE_API_TOKEN` dan `CLOUDFLARE_ACCOUNT_ID` pada **Settings → Secrets and variables → Actions** di repositori GitHub. Workflow [`.github/workflows/deploy-cloudflare.yml`](./.github/workflows/deploy-cloudflare.yml) akan otomatis mempublikasikan ke proyek Cloudflare Pages `axiomos`.
   - **Via Wrangler CLI:**
     ```bash
     npm run deploy:cf:workers
     ```
4. **Instalasi Custom Addon di Odoo 20 (`odoo_addons/axiomos_erp`):**
   - Salin folder [`odoo_addons/axiomos_erp`](./odoo_addons/axiomos_erp) ke direktori `custom_addons` pada server **Odoo 20** Anda.
   - Restart layanan Odoo, aktifkan *Developer Mode*, klik **Apps → Update Apps List**, lalu cari dan instal **`AxiomOS — First-Principles Hulu-Hilir ERP`** (`axiomos_erp`).
   - Jalankan unit test logika Python Odoo secara lokal:
     ```bash
     npm run test:odoo
     ```

## Lisensi

Dirilis di bawah [MIT License](./LICENSE). Bebas digunakan, dimodifikasi, dan dikembangkan untuk individu, startup, maupun UMKM.
