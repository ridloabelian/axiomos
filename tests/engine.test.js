import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFirstPrinciplesMetrics,
  evaluateDailyTimeBlocks,
  evaluateOrgAndErpState,
  validateMeetingProposal,
  calculateWalkOutSavings,
  evaluateDecisionVelocity
} from '../src/core/engine.js';
import { SEED_PRESETS } from '../src/data/seed.js';

test('Module 1 (Hulu): First Principles Calculator identifies SpaceX 2% raw material breakthrough', () => {
  const spaceXCanvas = SEED_PRESETS.elon_musk.firstPrinciples[0];
  const metrics = calculateFirstPrinciplesMetrics(spaceXCanvas);

  assert.equal(metrics.rawMaterialCost, 1300000);
  assert.equal(metrics.rawCostPercentage, 2);
  assert.equal(metrics.idiocyIndex, 50);
  assert.equal(metrics.verdict, 'RADICAL_BREAKTHROUGH_OPPORTUNITY');
  assert.ok(metrics.potentialSavingsPercent >= 85);
});

test('Module 2 (Hulu-Tengah): 5-Minute Time Engine rewards single-context focus and penalizes context switching', () => {
  const cleanSchedule = SEED_PRESETS.elon_musk.dailySchedule;
  const cleanResult = evaluateDailyTimeBlocks(cleanSchedule);

  assert.equal(cleanResult.contextSwitchViolations, 0);
  assert.equal(cleanResult.sleepCompliant, true);
  assert.equal(cleanResult.fiveMinAlignedRatio, 100);
  assert.ok(cleanResult.focusEfficiencyScore >= 90);

  // Inject context switching & sleep deprivation
  const messySchedule = {
    ...cleanSchedule,
    sleepHours: 4.5,
    blocks: [
      ...cleanSchedule.blocks,
      {
        id: 'tb-violation',
        startMinute: 600,
        durationMinutes: 25,
        title: 'Urus Iklan Perusahaan Lain Mendadak',
        context: 'Perusahaan_Lain',
        category: 'OPS_SYNC'
      }
    ]
  };
  const messyResult = evaluateDailyTimeBlocks(messySchedule);
  assert.equal(messyResult.contextSwitchViolations, 1);
  assert.equal(messyResult.sleepCompliant, false);
  assert.ok(messyResult.focusEfficiencyScore < cleanResult.focusEfficiencyScore);
});

test('Module 3 (Tengah): Flat-Org & Micro-ERP Engine validates DRI autonomy and hierarchy depth', () => {
  const erpState = evaluateOrgAndErpState(SEED_PRESETS.elon_musk.erpPods);

  assert.equal(erpState.isOrgFlat, true);
  assert.equal(erpState.autonomyRatioPercent, 100);
  assert.ok(erpState.avgOutputPerHour > 2);
});

test('Module 4 (Hilir): Anti-Meeting Gatekeeper blocks bloated/spectator meetings and calculates Walk-Out savings', () => {
  const validMeeting = SEED_PRESETS.elon_musk.meetingsAndDecisions.activeMeeting;
  const checkValid = validateMeetingProposal(validMeeting);
  assert.equal(checkValid.approved, true);
  assert.equal(checkValid.issues.length, 0);

  const bloatedMeeting = {
    expectedDecision: 'Rapat', // Too vague
    durationMinutes: 60, // Too long
    participants: [
      { name: 'A', contributionRole: 'Spec', hourlyRateCost: 100, isSpectator: false },
      { name: 'B', contributionRole: '', hourlyRateCost: 100, isSpectator: true }
    ]
  };
  const checkBloated = validateMeetingProposal(bloatedMeeting);
  assert.equal(checkBloated.approved, false);
  assert.ok(checkBloated.issues.length >= 3);

  const walkOut = calculateWalkOutSavings({ durationMinutes: 30 }, 5, 600);
  assert.equal(walkOut.minutesSaved, 25);
  assert.equal(walkOut.costSaved, 250);

  const velocity = evaluateDecisionVelocity(SEED_PRESETS.elon_musk.meetingsAndDecisions.decisions);
  assert.equal(velocity.fastDecisionRatioPercent, 100);
  assert.match(velocity.velocityGrade, /^S/);
});
