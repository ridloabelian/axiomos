import {
  calculateFirstPrinciplesMetrics,
  evaluateDailyTimeBlocks,
  evaluateOrgAndErpState,
  validateMeetingProposal,
  calculateWalkOutSavings,
  evaluateDecisionVelocity
} from './core/engine.js';
import { SEED_PRESETS } from './data/seed.js';

const STORAGE_KEY = 'axiomos_state_v1';

let state = loadState();
let activeTab = 'hulu-fp';
let meetingTimerInterval = null;
let meetingElapsedSeconds = 0;
let walkOutLog = [];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {
    // ignore storage errors
  }
  return structuredClone(SEED_PRESETS.elon_musk);
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {
    // ignore storage errors
  }
}

function formatMinutesToClock(totalMinutes) {
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function renderApp() {
  const fpCanvas = state.firstPrinciples[0];
  const fpMetrics = calculateFirstPrinciplesMetrics(fpCanvas);
  const timeMetrics = evaluateDailyTimeBlocks(state.dailySchedule);
  const erpMetrics = evaluateOrgAndErpState(state.erpPods);
  const meetingValidation = validateMeetingProposal(state.meetingsAndDecisions.activeMeeting);
  const decisionMetrics = evaluateDecisionVelocity(state.meetingsAndDecisions.decisions);

  // Update pipeline strip metrics
  document.getElementById('metric-fp').textContent =
    `Idiocy Index: ${fpMetrics.idiocyIndex}x (${fpMetrics.rawCostPercentage}% bahan dasar)`;
  document.getElementById('metric-time').textContent =
    `Fokus: ${timeMetrics.focusEfficiencyScore}/100 | ${timeMetrics.fiveMinuteSlotCount} blok 5-mnt`;
  document.getElementById('metric-erp').textContent =
    `Otonomi: ${erpMetrics.autonomyRatioPercent}% | Layer: ${erpMetrics.maxHierarchyDepth}`;
  document.getElementById('metric-decision').textContent =
    `Grade: ${decisionMetrics.velocityGrade.split(' ')[0]} | Rata-rata ${decisionMetrics.averageHoursToDecide} jam`;

  // Render Module 1: First Principles
  const fpContainer = document.getElementById('fp-content');
  fpContainer.innerHTML = `
    <div class="grid-3">
      <div class="panel-box">
        <div class="step-stage">1. Asumsi Umum (Analogy)</div>
        <h3 style="margin-bottom:8px;">${fpCanvas.title}</h3>
        <p style="color:var(--text-secondary);margin-bottom:12px;">"${fpCanvas.analogyAssumption}"</p>
        <div class="mono" style="font-size:13px;">
          Harga Pasar Saat Ini: <strong>${fpCanvas.marketPrice.toLocaleString()} ${fpCanvas.currency}</strong>
        </div>
      </div>

      <div class="panel-box">
        <div class="step-stage">2. Fakta & Komponen Dasar (Fundamental Truths)</div>
        <table class="data-table" style="margin-bottom:10px;">
          <thead>
            <tr><th>Komponen Dasar</th><th>Biaya</th></tr>
          </thead>
          <tbody>
            ${fpCanvas.components
              .map(
                (c) => `<tr><td>${c.name}</td><td class="mono">${c.cost.toLocaleString()}</td></tr>`
              )
              .join('')}
          </tbody>
        </table>
        <div class="mono" style="font-size:12px;">
          Total Bahan Dasar: <strong>${fpMetrics.rawMaterialCost.toLocaleString()} ${fpCanvas.currency} (${fpMetrics.rawCostPercentage}%)</strong>
        </div>
      </div>

      <div class="panel-box">
        <div class="step-stage">3. Solusi Baru dari Nol (First Principles)</div>
        <span class="badge ${fpMetrics.idiocyIndex >= 5 ? 'badge-ok' : 'badge-warn'}" style="margin-bottom:8px;">
          Idiocy Index: ${fpMetrics.idiocyIndex}x | Hemat ~${fpMetrics.potentialSavingsPercent}%
        </span>
        <p style="color:var(--text-primary);margin-bottom:14px;">${fpCanvas.fromScratchSolution}</p>
        <button id="btn-spawn-pod" class="btn btn-primary" style="width:100%;">
          Jadikan Pod Proyek di Micro-ERP &rarr;
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-spawn-pod')?.addEventListener('click', () => {
    const newPodName = `Pod Inovasi: ${fpCanvas.title.slice(0, 28)}`;
    state.erpPods.push({
      id: `pod-${Date.now()}`,
      name: newPodName,
      driName: 'Lead Engineer (DRI Baru)',
      teamSize: 4,
      hierarchyLayers: 1,
      budgetAllocated: fpCanvas.targetBuildCost,
      budgetSpent: Math.round(fpCanvas.targetBuildCost * 0.15),
      outputUnits: 50,
      hoursLogged: 20,
      erpModuleStatus: 'Odoo/ERP Synced: BoM First-Principles Terhubung'
    });
    saveState();
    switchTab('tengah-erp');
  });

  // Render Module 2: Time Engine
  const timeContainer = document.getElementById('time-content');
  timeContainer.innerHTML = `
    <div class="grid-2">
      <div class="panel-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div>
            <div class="step-stage">${state.dailySchedule.dayLabel}</div>
            <strong>Tema/Perusahaan Hari Ini: <span class="mono">${timeMetrics.designatedContext}</span></strong>
          </div>
          <span class="badge ${timeMetrics.focusEfficiencyScore >= 80 ? 'badge-ok' : 'badge-warn'}">
            Skor Fokus: ${timeMetrics.focusEfficiencyScore}/100
          </span>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Jam</th><th>Blok 5-Mnt</th><th>Aktivitas</th><th>Konteks</th></tr>
          </thead>
          <tbody>
            ${state.dailySchedule.blocks
              .map((b) => {
                const isViolation = b.context !== timeMetrics.designatedContext;
                return `
                  <tr>
                    <td class="mono">${formatMinutesToClock(b.startMinute)} (${b.durationMinutes}m)</td>
                    <td class="mono">${Math.floor(b.durationMinutes / 5)}x slot</td>
                    <td>${b.title}</td>
                    <td>
                      <span class="badge ${isViolation ? 'badge-danger' : 'badge-ok'}">${b.context}</span>
                    </td>
                  </tr>
                `;
              })
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="panel-box">
        <div class="step-stage">Tambah Blok Waktu (Kelipatan 5 Menit)</div>
        <div class="form-row">
          <label>Nama Aktivitas Spesifik</label>
          <input id="input-tb-title" type="text" placeholder="Contoh: Review arsitektur database" />
        </div>
        <div class="grid-2" style="gap:10px;">
          <div class="form-row">
            <label>Durasi (Kelipatan 5 Menit)</label>
            <select id="input-tb-duration">
              <option value="5">5 Menit (1 slot)</option>
              <option value="10">10 Menit (2 slot)</option>
              <option value="15" selected>15 Menit (3 slot)</option>
              <option value="30">30 Menit (6 slot)</option>
            </select>
          </div>
          <div class="form-row">
            <label>Konteks Perusahaan/Proyek</label>
            <input id="input-tb-context" type="text" value="${timeMetrics.designatedContext}" />
          </div>
        </div>
        <button id="btn-add-timeblock" class="btn btn-primary" style="width:100%;margin-top:6px;">
          + Jadwalkan Blok 5-Menit
        </button>
        <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border-subtle);font-size:12px;color:var(--text-secondary);">
          Guardrail Tidur: <strong>${timeMetrics.sleepHours} jam/malam</strong>
          (${timeMetrics.sleepCompliant ? 'Optimal >= 6 Jam' : 'Kurang Tidur!'}) |
          Pelanggaran Context-Switch: <strong>${timeMetrics.contextSwitchViolations}</strong>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-add-timeblock')?.addEventListener('click', () => {
    const titleEl = document.getElementById('input-tb-title');
    const durEl = document.getElementById('input-tb-duration');
    const ctxEl = document.getElementById('input-tb-context');
    const title = titleEl.value.trim() || 'Eksekusi Fokus Mikro';
    const durationMinutes = Number(durEl.value) || 15;
    const context = ctxEl.value.trim() || timeMetrics.designatedContext;
    const lastBlock = state.dailySchedule.blocks[state.dailySchedule.blocks.length - 1];
    const nextStart = lastBlock ? lastBlock.startMinute + lastBlock.durationMinutes : 420;

    state.dailySchedule.blocks.push({
      id: `tb-${Date.now()}`,
      startMinute: nextStart,
      durationMinutes,
      title,
      context,
      category: 'DEEP_TECH'
    });
    saveState();
    renderApp();
  });

  // Render Module 3: Flat-Org & Micro-ERP
  const erpContainer = document.getElementById('erp-content');
  erpContainer.innerHTML = `
    <div class="grid-3" style="margin-bottom:16px;">
      <div class="panel-box">
        <div class="step-stage">Struktur Organisasi</div>
        <div class="mono" style="font-size:18px;font-weight:700;">
          Max ${erpMetrics.maxHierarchyDepth} Layer (${erpMetrics.isOrgFlat ? 'FLAT' : 'BIROKRATIS'})
        </div>
      </div>
      <div class="panel-box">
        <div class="step-stage">Otonomi Tim Kecil (A-Players)</div>
        <div class="mono" style="font-size:18px;font-weight:700;">
          ${erpMetrics.autonomyRatioPercent}% Autonomous Pods
        </div>
      </div>
      <div class="panel-box">
        <div class="step-stage">Produktivitas (Output / Jam)</div>
        <div class="mono" style="font-size:18px;font-weight:700;">
          ${erpMetrics.avgOutputPerHour} Unit/Jam
        </div>
      </div>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Autonomous Pod</th>
          <th>DRI (Penanggung Jawab)</th>
          <th>Ukuran Tim & Layer</th>
          <th>Real-Time ERP Budget</th>
          <th>Output/Jam</th>
          <th>Status Integrasi ERP</th>
        </tr>
      </thead>
      <tbody>
        ${erpMetrics.pods
          .map(
            (pod) => `
          <tr>
            <td><strong>${pod.name}</strong></td>
            <td class="mono">${pod.driName}</td>
            <td class="mono">${pod.teamSize} org | ${pod.hierarchyLayers} layer</td>
            <td class="mono">${pod.budgetSpent.toLocaleString()} / ${pod.budgetAllocated.toLocaleString()} (${pod.budgetUtilizationPercent}%)</td>
            <td><span class="badge badge-ok">${pod.outputPerHour}/jam</span></td>
            <td style="font-size:12px;color:var(--text-secondary);">${pod.erpModuleStatus}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;

  // Render Module 4: Anti-Meeting & Decision Velocity
  const activeMeeting = state.meetingsAndDecisions.activeMeeting;
  const decisionContainer = document.getElementById('decision-content');
  decisionContainer.innerHTML = `
    <div class="grid-2">
      <div class="panel-box">
        <div class="step-stage">Live Anti-Meeting Gatekeeper & Walk-Out Protocol</div>
        <h3 style="margin-bottom:4px;">${activeMeeting.title}</h3>
        <p style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;">
          Target Keputusan: <strong>${activeMeeting.expectedDecision}</strong>
        </p>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:var(--bg-elevated);border-radius:6px;margin-bottom:12px;">
          <div>
            <div style="font-size:11px;color:var(--text-secondary);">BIAYA RAPAT TERBAKAR (REAL-TIME)</div>
            <div id="live-burn-display" class="mono" style="font-size:20px;font-weight:700;color:var(--status-warn);">
              ${(meetingValidation.burnRatePerSecond * meetingElapsedSeconds).toFixed(2)} (${meetingElapsedSeconds} dtk)
            </div>
          </div>
          <div style="display:flex;gap:8px;">
            <button id="btn-toggle-timer" class="btn btn-primary">
              ${meetingTimerInterval ? 'Jeda Rapat' : 'Mulai Timer Rapat'}
            </button>
          </div>
        </div>
        <table class="data-table" style="margin-bottom:12px;">
          <thead>
            <tr><th>Peserta</th><th>Kontribusi Langsung</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            ${activeMeeting.participants
              .map(
                (p, idx) => `
              <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.contributionRole}</td>
                <td>
                  <button class="btn btn-danger btn-walkout" data-index="${idx}" style="padding:4px 10px;font-size:11px;">
                    Walk Out (Hemat Waktu)
                  </button>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div id="walkout-feedback" style="font-size:12px;color:var(--status-ok);">
          ${walkOutLog.slice(-2).join(' | ')}
        </div>
      </div>

      <div class="panel-box">
        <div class="step-stage">High-Velocity Decision Log (Speed is Everything)</div>
        <div style="margin-bottom:12px;">
          <span class="badge badge-ok">Grade Kecepatan: ${decisionMetrics.velocityGrade}</span>
        </div>
        <table class="data-table" style="margin-bottom:14px;">
          <thead>
            <tr><th>Keputusan Cepat</th><th>Basis Data First-Principles</th><th>Waktu Putus</th></tr>
          </thead>
          <tbody>
            ${state.meetingsAndDecisions.decisions
              .map(
                (d) => `
              <tr>
                <td><strong>${d.title}</strong><br/><span style="font-size:11px;color:var(--text-secondary);">${d.outcome}</span></td>
                <td style="font-size:12px;">${d.dataBasis}</td>
                <td class="mono">${d.hoursToDecide} jam</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div class="form-row">
          <input id="input-dec-title" type="text" placeholder="Keputusan baru yang diambil hari ini..." />
        </div>
        <div class="form-row">
          <input id="input-dec-data" type="text" placeholder="Fakta/data pendukung..." />
        </div>
        <button id="btn-add-decision" class="btn btn-primary" style="width:100%;">
          + Catat Keputusan Cepat (< 24 Jam)
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-toggle-timer')?.addEventListener('click', () => {
    if (meetingTimerInterval) {
      clearInterval(meetingTimerInterval);
      meetingTimerInterval = null;
    } else {
      meetingTimerInterval = setInterval(() => {
        meetingElapsedSeconds += 1;
        const el = document.getElementById('live-burn-display');
        if (el) {
          el.textContent = `${(meetingValidation.burnRatePerSecond * meetingElapsedSeconds).toFixed(2)} (${meetingElapsedSeconds} dtk)`;
        }
      }, 1000);
    }
    renderApp();
  });

  document.querySelectorAll('.btn-walkout').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.currentTarget.getAttribute('data-index'));
      const participant = activeMeeting.participants[idx];
      if (!participant) return;
      const savings = calculateWalkOutSavings(activeMeeting, Math.floor(meetingElapsedSeconds / 60), participant.hourlyRateCost);
      walkOutLog.push(`${participant.name} Walk-Out: hemat ${savings.minutesSaved} mnt (${savings.costSaved.toLocaleString()})`);
      activeMeeting.participants.splice(idx, 1);
      saveState();
      renderApp();
    });
  });

  document.getElementById('btn-add-decision')?.addEventListener('click', () => {
    const title = document.getElementById('input-dec-title')?.value.trim();
    const dataBasis = document.getElementById('input-dec-data')?.value.trim();
    if (!title) return;
    state.meetingsAndDecisions.decisions.unshift({
      id: `dec-${Date.now()}`,
      title,
      dataBasis: dataBasis || 'Data telemetri & eksperimen langsung',
      hoursToDecide: 2,
      status: 'DECIDED_FAST',
      outcome: 'Langsung dieksekusi & diiterasi oleh DRI Pod.'
    });
    saveState();
    renderApp();
  });
}

function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll('.pipeline-step').forEach((el) => {
    el.classList.toggle('active', el.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.module-panel').forEach((el) => {
    el.classList.toggle('active', el.id === `panel-${tabId}`);
  });
  renderApp();
}

export function initApp() {
  document.querySelectorAll('.pipeline-step').forEach((el) => {
    el.addEventListener('click', () => switchTab(el.getAttribute('data-tab')));
  });

  const presetSelector = document.getElementById('preset-selector');
  if (presetSelector) {
    presetSelector.addEventListener('change', (e) => {
      const key = e.target.value;
      if (SEED_PRESETS[key]) {
        state = structuredClone(SEED_PRESETS[key]);
        walkOutLog = [];
        meetingElapsedSeconds = 0;
        saveState();
        renderApp();
      }
    });
  }

  renderApp();
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initApp);
}
