/**
 * AxiomOS Core Engine
 * Pure domain logic implementing the 4 upstream-to-downstream (Hulu-Hilir) pillars:
 * 1. First Principles Deconstructor & Idiocy Index Calculator
 * 2. 5-Minute Micro-Block Time Engine & Context-Switch Shield
 * 3. Flat-Org DRI Graph & Autonomous Micro-ERP Ledger
 * 4. Anti-Meeting Burn-Rate Gatekeeper, Walk-Out Protocol & Decision Velocity Tracker
 */

/**
 * MODULE 1 (HULU): First Principles Thinking & Idiocy Index Calculator
 * Elon Musk's "Idiocy Index" = (Finished Product Market Price) / (Raw Material / Fundamental Component Cost).
 * A high ratio indicates massive inefficiency caused by reasoning by analogy rather than physical fundamentals.
 */
export function calculateFirstPrinciplesMetrics(canvas) {
  const marketPrice = Number(canvas.marketPrice) || 0;
  const components = Array.isArray(canvas.components) ? canvas.components : [];
  const rawMaterialCost = components.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);

  if (marketPrice <= 0 || rawMaterialCost <= 0) {
    return {
      rawMaterialCost,
      rawCostPercentage: 0,
      idiocyIndex: 0,
      potentialSavingsPercent: 0,
      verdict: 'DATA_INCOMPLETE'
    };
  }

  const rawCostPercentage = Number(((rawMaterialCost / marketPrice) * 100).toFixed(2));
  const idiocyIndex = Number((marketPrice / rawMaterialCost).toFixed(2));
  const targetBuildCost = Number(canvas.targetBuildCost) || rawMaterialCost * 2.5;
  const potentialSavingsPercent = Math.max(
    0,
    Number((((marketPrice - targetBuildCost) / marketPrice) * 100).toFixed(1))
  );

  let verdict = 'INCREMENTAL';
  if (idiocyIndex >= 10) {
    verdict = 'RADICAL_BREAKTHROUGH_OPPORTUNITY'; // e.g. SpaceX rocket (raw materials ~2% -> index 50x)
  } else if (idiocyIndex >= 3) {
    verdict = 'HIGH_OPTIMIZATION_POTENTIAL';
  }

  return {
    rawMaterialCost,
    rawCostPercentage,
    idiocyIndex,
    potentialSavingsPercent,
    verdict
  };
}

/**
 * MODULE 2 (HULU-TENGAH): 5-Minute Time Blocking & Context-Switch Shield
 * Evaluates a daily schedule of 5-minute granularity blocks against:
 * - 5-minute alignment discipline
 * - One-Day-One-Company/Context focus rule
 * - Morning cognitive peak allocation (07:00 - 11:00 for deep technical/decision work)
 * - Sleep guardrail (minimum 6 hours = 360 minutes)
 */
export function evaluateDailyTimeBlocks(schedule) {
  const designatedContext = schedule.designatedContext || 'General';
  const sleepHours = Number(schedule.sleepHours) || 0;
  const blocks = Array.isArray(schedule.blocks) ? schedule.blocks : [];

  let totalScheduledMinutes = 0;
  let fiveMinAlignedCount = 0;
  let contextSwitchViolations = 0;
  let contextTransitions = 0;
  let morningDeepWorkMinutes = 0;
  let previousContext = null;

  const sortedBlocks = [...blocks].sort((a, b) => a.startMinute - b.startMinute);

  for (const block of sortedBlocks) {
    const duration = Number(block.durationMinutes) || 0;
    totalScheduledMinutes += duration;

    if (duration > 0 && duration % 5 === 0 && block.startMinute % 5 === 0) {
      fiveMinAlignedCount += 1;
    }

    if (block.context && block.context !== designatedContext && block.category !== 'RECOVERY') {
      contextSwitchViolations += 1;
    }

    if (previousContext && block.context && block.context !== previousContext && block.category !== 'RECOVERY') {
      contextTransitions += 1;
    }
    if (block.category !== 'RECOVERY') {
      previousContext = block.context;
    }

    // Morning peak window: 07:00 (420m) to 11:00 (660m)
    const isMorningWindow = block.startMinute >= 420 && block.startMinute < 660;
    if (isMorningWindow && (block.category === 'DEEP_TECH' || block.category === 'CRITICAL_DECISION')) {
      morningDeepWorkMinutes += duration;
    }
  }

  const fiveMinuteSlotCount = Math.floor(totalScheduledMinutes / 5);
  const sleepCompliant = sleepHours >= 6;
  const contextPenaltyPoints = contextSwitchViolations * 15 + contextTransitions * 8;
  const sleepPenaltyPoints = sleepCompliant ? 0 : Math.round((6 - sleepHours) * 20);
  const morningBonusPoints = Math.min(20, Math.floor(morningDeepWorkMinutes / 15) * 4);

  const focusEfficiencyScore = Math.max(
    0,
    Math.min(100, 85 - contextPenaltyPoints - sleepPenaltyPoints + morningBonusPoints)
  );

  return {
    designatedContext,
    totalScheduledMinutes,
    fiveMinuteSlotCount,
    fiveMinAlignedRatio: blocks.length ? Number(((fiveMinAlignedCount / blocks.length) * 100).toFixed(0)) : 100,
    contextSwitchViolations,
    contextTransitions,
    morningDeepWorkMinutes,
    sleepHours,
    sleepCompliant,
    focusEfficiencyScore
  };
}

/**
 * MODULE 3 (TENGAH): Flat-Org & Autonomous Micro-ERP Engine
 * Enforces flat hierarchy (max 2 layers from Maker to CEO/Lead),
 * high A-player density, direct DRI ownership, and real-time ERP resource tracking.
 */
export function evaluateOrgAndErpState(pods) {
  const podList = Array.isArray(pods) ? pods : [];
  let totalBudgetAllocated = 0;
  let totalBudgetSpent = 0;
  let maxHierarchyDepth = 0;
  let autonomousPodCount = 0;
  let totalOutputScore = 0;
  let totalHoursLogged = 0;

  const evaluatedPods = podList.map((pod) => {
    const allocated = Number(pod.budgetAllocated) || 0;
    const spent = Number(pod.budgetSpent) || 0;
    const depth = Number(pod.hierarchyLayers) || 1;
    const teamSize = Number(pod.teamSize) || 1;
    const outputUnits = Number(pod.outputUnits) || 0;
    const hoursLogged = Number(pod.hoursLogged) || 1;

    totalBudgetAllocated += allocated;
    totalBudgetSpent += spent;
    if (depth > maxHierarchyDepth) maxHierarchyDepth = depth;

    const isFlatCompliant = depth <= 2;
    const isSmallTeamCompliant = teamSize <= 8;
    const hasClearDri = Boolean(pod.driName && pod.driName.trim().length > 0);
    const isAutonomous = isFlatCompliant && isSmallTeamCompliant && hasClearDri;

    if (isAutonomous) autonomousPodCount += 1;

    const outputPerHour = Number((outputUnits / hoursLogged).toFixed(2));
    totalOutputScore += outputUnits;
    totalHoursLogged += hoursLogged;

    return {
      ...pod,
      budgetUtilizationPercent: allocated > 0 ? Number(((spent / allocated) * 100).toFixed(1)) : 0,
      isFlatCompliant,
      isSmallTeamCompliant,
      hasClearDri,
      isAutonomous,
      outputPerHour
    };
  });

  return {
    pods: evaluatedPods,
    totalBudgetAllocated,
    totalBudgetSpent,
    budgetHealthPercent:
      totalBudgetAllocated > 0
        ? Number((((totalBudgetAllocated - totalBudgetSpent) / totalBudgetAllocated) * 100).toFixed(1))
        : 100,
    maxHierarchyDepth,
    isOrgFlat: maxHierarchyDepth <= 2,
    autonomyRatioPercent:
      podList.length > 0 ? Number(((autonomousPodCount / podList.length) * 100).toFixed(0)) : 100,
    avgOutputPerHour: totalHoursLogged > 0 ? Number((totalOutputScore / totalHoursLogged).toFixed(2)) : 0
  };
}

/**
 * MODULE 4 (HILIR): Anti-Meeting Gatekeeper, Walk-Out Protocol & Decision Velocity
 */
export function validateMeetingProposal(proposal) {
  const issues = [];
  const decisionGoal = (proposal.expectedDecision || '').trim();
  const participants = Array.isArray(proposal.participants) ? proposal.participants : [];
  const durationMinutes = Number(proposal.durationMinutes) || 0;

  if (decisionGoal.length < 10) {
    issues.push('Rapat wajib memiliki 1 keputusan/output konkret yang jelas (minimal 10 karakter).');
  }

  if (participants.length === 0) {
    issues.push('Rapat membutuhkan minimal 1 kontributor langsung.');
  }

  if (participants.length > 6) {
    issues.push('Terlalu banyak peserta (>6 orang). Pangkas menjadi tim kecil yang berkontribusi langsung.');
  }

  const passiveParticipants = participants.filter(
    (p) => !p.contributionRole || p.contributionRole.trim().length === 0 || p.isSpectator
  );
  if (passiveParticipants.length > 0) {
    issues.push(
      `${passiveParticipants.length} peserta tidak memiliki peran kontribusi langsung (penonton pasif dilarang).`
    );
  }

  if (durationMinutes > 30) {
    issues.push('Durasi rapat melebihi 30 menit. Pecah atau persingkat menjadi blok 5-25 menit yang to-the-point.');
  }

  const totalHourlyRate = participants.reduce((sum, p) => sum + (Number(p.hourlyRateCost) || 0), 0);
  const burnRatePerMinute = Number((totalHourlyRate / 60).toFixed(2));
  const burnRatePerSecond = Number((totalHourlyRate / 3600).toFixed(2));
  const projectedTotalCost = Number((burnRatePerMinute * durationMinutes).toFixed(2));

  return {
    approved: issues.length === 0,
    issues,
    burnRatePerMinute,
    burnRatePerSecond,
    projectedTotalCost
  };
}

export function calculateWalkOutSavings(meeting, walkOutMinute, participantHourlyRate) {
  const totalDuration = Number(meeting.durationMinutes) || 30;
  const elapsed = Math.max(0, Math.min(totalDuration, Number(walkOutMinute) || 0));
  const minutesSaved = Math.max(0, totalDuration - elapsed);
  const costSaved = Number(((minutesSaved / 60) * (Number(participantHourlyRate) || 0)).toFixed(2));

  return {
    minutesSaved,
    costSaved,
    message: `Walk-Out berhasil menghemat ${minutesSaved} menit waktu produktif.`
  };
}

export function evaluateDecisionVelocity(decisions) {
  const list = Array.isArray(decisions) ? decisions : [];
  if (list.length === 0) {
    return {
      averageHoursToDecide: 0,
      fastDecisionRatioPercent: 100,
      velocityGrade: 'S (Instant Execution)'
    };
  }

  let totalHours = 0;
  let fastCount = 0;

  for (const d of list) {
    const hours = Number(d.hoursToDecide) || 0;
    totalHours += hours;
    // Decisions taken within 24 hours count as high-velocity
    if (hours <= 24) {
      fastCount += 1;
    }
  }

  const averageHoursToDecide = Number((totalHours / list.length).toFixed(1));
  const fastDecisionRatioPercent = Number(((fastCount / list.length) * 100).toFixed(0));

  let velocityGrade = 'C (Lambat / Birokratis)';
  if (averageHoursToDecide <= 6) {
    velocityGrade = 'S (Kecepatan Ekstrem ala Elon Musk)';
  } else if (averageHoursToDecide <= 24) {
    velocityGrade = 'A (Agile & Cepat)';
  } else if (averageHoursToDecide <= 48) {
    velocityGrade = 'B (Moderat)';
  }

  return {
    averageHoursToDecide,
    fastDecisionRatioPercent,
    velocityGrade
  };
}
