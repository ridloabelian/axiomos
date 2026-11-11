/**
 * AxiomOS Seed Data
 * Pre-loaded datasets demonstrating the complete Hulu-to-Hilir pipeline:
 * - Preset 1: Elon Musk (SpaceX & Tesla Case Study from Raymond Chin's video)
 * - Preset 2: Startup / UMKM Indonesia (Transformasi Operasional & Produk)
 */

export const SEED_PRESETS = {
  elon_musk: {
    id: 'elon_musk',
    label: 'Studi Kasus Video: SpaceX & Tesla (Elon Musk)',
    firstPrinciples: [
      {
        id: 'fp-spacex-rocket',
        title: 'Peluncuran Roket Orbit (SpaceX Falcon 9)',
        analogyAssumption:
          'Harga beli 1 roket peluncuran adalah $65 Juta dan roket selalu habis terbuang sekali pakai setelah diluncurkan.',
        marketPrice: 65000000,
        targetBuildCost: 6500000,
        currency: 'USD',
        components: [
          { name: 'Aluminium Kelas Dirgantara (Aerospace Aluminum Alloy)', cost: 450000 },
          { name: 'Titanium & Tembaga Murni', cost: 380000 },
          { name: 'Serat Karbon (Carbon Fiber) & Avionik Dasar', cost: 320000 },
          { name: 'Propelan (Liquid Oxygen & RP-1 Kerosene)', cost: 150000 }
        ],
        fromScratchSolution:
          'Biaya material mentah di pasar komoditas hanya ~2% ($1,3 Juta) dari harga roket jadi. Solusi: Bangun manufaktur vertikal sendiri dan rancang roket pendorong yang bisa mendarat vertikal untuk dipakai ulang (Reusable Rocket).'
      },
      {
        id: 'fp-tesla-battery',
        title: 'Paket Baterai Mobil Listrik (Tesla Gigafactory)',
        analogyAssumption:
          'Harga baterai selalu $600/kWh sehingga mobil listrik tidak akan pernah bisa terjangkau oleh pasar massal.',
        marketPrice: 600,
        targetBuildCost: 110,
        currency: 'USD/kWh',
        components: [
          { name: 'Kobalt, Nikel, & Mangan (Harga Komoditas LME)', cost: 38 },
          { name: 'Litium & Karbon/Grafit', cost: 24 },
          { name: 'Polimer Separator & Casing Baja', cost: 20 }
        ],
        fromScratchSolution:
          'Material mentah baterai di London Metal Exchange hanya ~$82/kWh (~13,6%). Solusi: Bangun Gigafactory terintegrasi untuk merakit sel baterai dari bahan mentah dengan otomasi tinggi.'
      }
    ],
    dailySchedule: {
      dayLabel: 'Selasa — Fokus Penuh: SpaceX Engineering',
      designatedContext: 'SpaceX',
      sleepHours: 6.5,
      blocks: [
        {
          id: 'tb-1',
          startMinute: 420, // 07:00
          durationMinutes: 30,
          title: 'Bangun, Mandi, Tinjau Isu Teknis Kritis (Tanpa Sarapan Lama)',
          context: 'SpaceX',
          category: 'CRITICAL_DECISION'
        },
        {
          id: 'tb-2',
          startMinute: 450, // 07:30
          durationMinutes: 45,
          title: 'Review Desain Katup Mesin Raptor bersama Lead Engineer',
          context: 'SpaceX',
          category: 'DEEP_TECH'
        },
        {
          id: 'tb-3',
          startMinute: 495, // 08:15
          durationMinutes: 15,
          title: '3x Blok 5-Menit: Keputusan Cepat Pengadaan Baja Tahan Karat',
          context: 'SpaceX',
          category: 'CRITICAL_DECISION'
        },
        {
          id: 'tb-4',
          startMinute: 510, // 08:30
          durationMinutes: 60,
          title: 'Inspeksi Lantai Produksi & Debugging Jalur Perakitan',
          context: 'SpaceX',
          category: 'DEEP_TECH'
        },
        {
          id: 'tb-5',
          startMinute: 570, // 09:30
          durationMinutes: 15,
          title: 'Sinkronisasi Data Telemetry ERP & Logistik Peluncuran',
          context: 'SpaceX',
          category: 'OPS_SYNC'
        }
      ]
    },
    erpPods: [
      {
        id: 'pod-propulsion',
        name: 'Pod Propulsi Raptor (Reusable Engine)',
        driName: 'Tom Mueller (DRI)',
        teamSize: 5,
        hierarchyLayers: 1,
        budgetAllocated: 4500000,
        budgetSpent: 3100000,
        outputUnits: 94,
        hoursLogged: 40,
        erpModuleStatus: 'Odoo/ERP Synced: Inventori Logam & Uji Tekanan Real-Time'
      },
      {
        id: 'pod-avionics',
        name: 'Pod Avionik & Pendaratan Otonom',
        driName: 'Lars Blackmore (DRI)',
        teamSize: 4,
        hierarchyLayers: 1,
        budgetAllocated: 2200000,
        budgetSpent: 1650000,
        outputUnits: 88,
        hoursLogged: 38,
        erpModuleStatus: 'Odoo/ERP Synced: Komponen Chip & Simulasi Telemetri'
      },
      {
        id: 'pod-starship-hull',
        name: 'Pod Struktur Stainless Steel 30X',
        driName: 'Gwynne & Lead Welders (DRI)',
        teamSize: 6,
        hierarchyLayers: 2,
        budgetAllocated: 3800000,
        budgetSpent: 2900000,
        outputUnits: 91,
        hoursLogged: 42,
        erpModuleStatus: 'Odoo/ERP Synced: Supply Chain Baja & QA Otomatis'
      }
    ],
    meetingsAndDecisions: {
      activeMeeting: {
        title: 'Keputusan Desain Kaki Pendaratan Falcon 9',
        expectedDecision: 'Menentukan spesifikasi aktuator hidrolik vs pneumatik hari ini.',
        durationMinutes: 15,
        participants: [
          { name: 'Elon M.', contributionRole: 'Chief Engineer / Final Decision', hourlyRateCost: 1200, isSpectator: false },
          { name: 'Lead Mechanical', contributionRole: 'Analisis Beban Termal', hourlyRateCost: 250, isSpectator: false },
          { name: 'ERP Supply Lead', contributionRole: 'Ketersediaan Komponen', hourlyRateCost: 180, isSpectator: false }
        ]
      },
      decisions: [
        {
          id: 'dec-1',
          title: 'Ganti Material Serat Karbon ke Stainless Steel 301',
          dataBasis: 'Harga baja $3/kg vs serat karbon $135/kg + titik leleh baja lebih tinggi.',
          hoursToDecide: 3,
          status: 'VALIDATED',
          outcome: 'Hemat biaya material >90% dan percepat iterasi prototipe.'
        },
        {
          id: 'dec-2',
          title: 'Hapus Sensor Redundan pada Sirip Grid',
          dataBasis: 'Data telemetri 12 peluncuran menunjukkan 1 sensor utama sudah cukup akurat.',
          hoursToDecide: 1.5,
          status: 'DECIDED_FAST',
          outcome: 'Mengurangi bobot roket 18 kg dan memangkas waktu perakitan 4 jam.'
        }
      ]
    }
  },
  umkm_indonesia: {
    id: 'umkm_indonesia',
    label: 'Studi Kasus Bisnis/UMKM: Manufaktur & Brand Lokal',
    firstPrinciples: [
      {
        id: 'fp-umkm-packaging',
        title: 'Produksi Kemasan & Distribusi Brand Makanan Lokal',
        analogyAssumption:
          'Harus sewa pabrik maklon besar dengan MOQ Rp250 Juta dan sistem pembukuan manual di puluhan file spreadsheet terpisah.',
        marketPrice: 250000000,
        targetBuildCost: 48000000,
        currency: 'IDR',
        components: [
          { name: 'Bahan Baku Pangan Kualitas Grade-A Langsung Petani', cost: 18000000 },
          { name: 'Mesin Pengemas Semi-Otomatis Compact', cost: 14000000 },
          { name: 'Kemasan Foil Food-Grade & Cetak Label Mandiri', cost: 6000000 }
        ],
        fromScratchSolution:
          'Biaya komponen dasar hanya Rp38 Juta (15,2%). Solusi: Rakit lini pengemasan mikro in-house yang terhubung langsung ke sistem Odoo ERP untuk stok, HPP, dan penjualan otomatis.'
      }
    ],
    dailySchedule: {
      dayLabel: 'Senin — Fokus Penuh: R&D Produk & Integrasi ERP',
      designatedContext: 'Operasional_Inti',
      sleepHours: 6.5,
      blocks: [
        {
          id: 'tb-u1',
          startMinute: 420, // 07:00
          durationMinutes: 30,
          title: 'Tinjau Dashboard Kas & Stok Harian di ERP',
          context: 'Operasional_Inti',
          category: 'CRITICAL_DECISION'
        },
        {
          id: 'tb-u2',
          startMinute: 450, // 07:30
          durationMinutes: 60,
          title: 'Audit Formula HPP & Uji Kualitas Batch Produksi',
          context: 'Operasional_Inti',
          category: 'DEEP_TECH'
        },
        {
          id: 'tb-u3',
          startMinute: 510, // 08:30
          durationMinutes: 15,
          title: '3x Blok 5-Menit: Approval PO Bahan Baku & Kontrak Kurir',
          context: 'Operasional_Inti',
          category: 'CRITICAL_DECISION'
        }
      ]
    },
    erpPods: [
      {
        id: 'pod-produksi',
        name: 'Pod Produksi & QC Harian',
        driName: 'Budi Santoso (DRI Produksi)',
        teamSize: 4,
        hierarchyLayers: 1,
        budgetAllocated: 45000000,
        budgetSpent: 32000000,
        outputUnits: 1200,
        hoursLogged: 40,
        erpModuleStatus: 'Odoo ERP: Modul Manufacturing & Inventory Aktif'
      },
      {
        id: 'pod-growth',
        name: 'Pod Penjualan & Omnichannel',
        driName: 'Nadia Putri (DRI Sales)',
        teamSize: 3,
        hierarchyLayers: 1,
        budgetAllocated: 25000000,
        budgetSpent: 18500000,
        outputUnits: 950,
        hoursLogged: 36,
        erpModuleStatus: 'Odoo ERP: Modul POS, CRM, & Invoicing Otomatis'
      }
    ],
    meetingsAndDecisions: {
      activeMeeting: {
        title: 'Penentuan Supplier Bahan Baku Kemasan Baru',
        expectedDecision: 'Memilih 1 vendor kemasan berdasarkan harga dasar & ketahanan.',
        durationMinutes: 15,
        participants: [
          { name: 'Founder', contributionRole: 'Pengambil Keputusan Akhir', hourlyRateCost: 300000, isSpectator: false },
          { name: 'Budi (DRI Produksi)', contributionRole: 'Data Uji Ketahanan Kemasan', hourlyRateCost: 150000, isSpectator: false }
        ]
      },
      decisions: [
        {
          id: 'dec-u1',
          title: 'Migrasi 12 Spreadsheet Manual ke Sistem ERP Terpusat',
          dataBasis: 'Selisih stok bulanan turun dari 8% menjadi 0.2% pada uji coba 7 hari.',
          hoursToDecide: 4,
          status: 'VALIDATED',
          outcome: 'Menghemat 14 jam kerja admin per minggu.'
        }
      ]
    }
  }
};
