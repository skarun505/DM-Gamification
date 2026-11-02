export type CampaignObjective = 'awareness' | 'traffic' | 'leads' | 'sales';
export type AudienceSize = 'narrow' | 'balanced' | 'broad';
export type AudienceType = 'interests' | 'lookalike' | 'retargeting' | 'broad';
export type PlacementChoice = 'auto' | 'manual';

export interface SimAudience {
  size: AudienceSize;
  type: AudienceType;
}

export interface SimCreativeOption {
  id: string;
  label: string;
  quality: number; // 0.6 - 1.6
}

export interface SimScenarioFixed {
  baseCPM: number;
  baseCTR: number;
  baseCVR: number;
  offerStrength: number; // 0.7 - 1.3
  landingQuality: number; // 0.6 - 1.3
  pixelInstalled: boolean;
  aov?: number;
}

export interface SimInputs {
  objective: CampaignObjective;
  dailyBudget: number;
  days: number;
  audience: SimAudience;
  creative: SimCreativeOption;
  placements: PlacementChoice;
  pixelInstalled?: boolean; // Can be toggled in some scenarios
}

export interface DailyMetrics {
  day: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpm: number;
  ctr: number;
  cpc: number;
  cpl: number;
  roas: number;
}

export interface SimResults {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  cpm: number;
  ctr: number;
  cpc: number;
  cpl: number; // or CPA
  roas: number;
  frequency: number;
  learningPhase: 'Active' | 'Learning limited';
  daily: DailyMetrics[];
  pixieCommentary: string[];
}

export interface PassRule {
  metric: 'CPL' | 'conversions' | 'ROAS' | 'CTR' | 'frequency' | 'spend';
  op: '<=' | '>=' | '<' | '>' | '==';
  value: number;
}

export interface SimScenario {
  slug: string;
  title: string;
  brief: string;
  fixed: SimScenarioFixed;
  editable: string[];
  creativeOptions: SimCreativeOption[];
  pass: {
    all: PassRule[];
  };
  hintIds: string[];
  xp: number;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function runSimulation(
  inputs: SimInputs,
  scenarioFixed: SimScenarioFixed,
  seed: number = 42
): SimResults {
  const prng = mulberry32(seed);

  const days = Math.max(1, Math.min(14, inputs.days || 7));
  const dailyBudget = Math.max(100, inputs.dailyBudget || 500);
  const pixel = inputs.pixelInstalled !== undefined ? inputs.pixelInstalled : scenarioFixed.pixelInstalled;
  const aov = scenarioFixed.aov || 1000;

  let reachPool = 800000;
  let audienceCPM = 1.0;
  if (inputs.audience.size === 'narrow') {
    reachPool = 75000;
    audienceCPM = 1.5;
  } else if (inputs.audience.size === 'broad') {
    reachPool = 3500000;
    audienceCPM = 0.85;
  }

  // Base raw daily calculation
  const placementMod = inputs.placements === 'auto' ? 0.92 : 1.0;
  const baseDayCPM = scenarioFixed.baseCPM * audienceCPM * placementMod;
  const rawDayImpressions = (dailyBudget / baseDayCPM) * 1000;
  const totalRawImpressions = rawDayImpressions * days;

  // Frequency formula from spec: min(8, 1 + (impressions / reachPool) * days^0.5)
  const frequency = Math.min(8, 1 + (totalRawImpressions / reachPool) * Math.pow(days, 0.5));
  const roundedFrequency = Math.round(frequency * 10) / 10;

  // Fatigue factor if frequency > 3
  const fatigueFactor = frequency > 3 ? Math.pow(0.85, frequency - 3) : 1.0;
  const baseCTR = scenarioFixed.baseCTR * inputs.creative.quality * fatigueFactor;
  const landingQuality = scenarioFixed.landingQuality || 1.0;
  const offerStrength = scenarioFixed.offerStrength || 1.0;
  const baseCVR = scenarioFixed.baseCVR * landingQuality * offerStrength;

  // Check 7-day conversion rate for learning phase
  const estimatedWeeklyConversions =
    (inputs.objective === 'leads' || inputs.objective === 'sales') && pixel
      ? (rawDayImpressions * 7 * baseCTR) * baseCVR
      : inputs.objective === 'leads' || inputs.objective === 'sales'
      ? 0
      : (rawDayImpressions * 7 * baseCTR) * baseCVR * 0.3;

  const learningPhase: 'Active' | 'Learning limited' =
    estimatedWeeklyConversions >= 50 ? 'Active' : 'Learning limited';

  const learningCPMMultiplier = learningPhase === 'Learning limited' ? 1.12 : 1.0;
  const learningConvMultiplier = learningPhase === 'Learning limited' ? 0.9 : 1.0;

  const daily: DailyMetrics[] = [];
  let cumSpend = 0;
  let cumImps = 0;
  let cumClicks = 0;
  let cumConvs = 0;

  for (let d = 1; d <= days; d++) {
    // ±8% seeded noise: prng() returns 0..1, so (prng() - 0.5) * 0.16 is -0.08..+0.08
    const noise = 1 + (prng() - 0.5) * 0.16;

    const dayCPM = baseDayCPM * learningCPMMultiplier * noise;
    const dayImpressions = Math.round((dailyBudget / dayCPM) * 1000);
    const dayCTR = Math.max(0.001, baseCTR * noise);
    const dayClicks = Math.round(dayImpressions * dayCTR);

    let dayConversions = 0;
    if ((inputs.objective === 'leads' || inputs.objective === 'sales') && pixel) {
      dayConversions = Math.round(dayClicks * baseCVR * learningConvMultiplier * noise);
    } else if (inputs.objective === 'leads' || inputs.objective === 'sales') {
      dayConversions = 0;
    } else {
      // Traffic / awareness generating incidental conversions
      dayConversions = Math.round(dayClicks * baseCVR * 0.3 * noise);
    }

    cumSpend += dailyBudget;
    cumImps += dayImpressions;
    cumClicks += dayClicks;
    cumConvs += dayConversions;

    const dayCpc = dayClicks > 0 ? dailyBudget / dayClicks : 0;
    const dayCpl = dayConversions > 0 ? dailyBudget / dayConversions : dailyBudget;
    const dayRoas = dailyBudget > 0 ? (dayConversions * aov) / dailyBudget : 0;

    daily.push({
      day: d,
      spend: dailyBudget,
      impressions: dayImpressions,
      clicks: dayClicks,
      conversions: dayConversions,
      cpm: Math.round(dayCPM),
      ctr: Math.round(dayCTR * 1000) / 10,
      cpc: Math.round(dayCpc * 10) / 10,
      cpl: Math.round(dayCpl),
      roas: Math.round(dayRoas * 10) / 10,
    });
  }

  const avgCPM = cumImps > 0 ? Math.round((cumSpend / cumImps) * 1000) : 0;
  const avgCTR = cumImps > 0 ? Math.round((cumClicks / cumImps) * 1000) / 10 : 0;
  const avgCPC = cumClicks > 0 ? Math.round((cumSpend / cumClicks) * 10) / 10 : 0;
  const avgCPL = cumConvs > 0 ? Math.round(cumSpend / cumConvs) : cumSpend;
  const totalRevenue = cumConvs * aov;
  const avgROAS = cumSpend > 0 ? Math.round((totalRevenue / cumSpend) * 10) / 10 : 0;

  // Pixie Commentary
  const commentary: string[] = [];
  if (roundedFrequency > 3.5) {
    commentary.push(`Your ad frequency is ${roundedFrequency}. People are seeing your ad repeatedly and getting tired of it! Consider broadening your audience or refreshing your creative.`);
  } else {
    commentary.push(`Frequency is healthy at ${roundedFrequency}. Your audience isn't exhausted.`);
  }

  if (!pixel && (inputs.objective === 'leads' || inputs.objective === 'sales')) {
    commentary.push(`Critical issue: The Pixel is not installed or tracking is broken! Ads Manager cannot optimize without conversion signal, leading to 0 recorded results.`);
  }

  if (learningPhase === 'Learning limited') {
    commentary.push(`Status: "Learning Limited". You need ~50 conversions per week for Meta to optimize well. Your volume is too low; CPM is 12% higher as a result.`);
  } else {
    commentary.push(`Great work! You hit over 50 conversions/week, so Meta's algorithm exited the learning phase successfully.`);
  }

  if (inputs.creative.quality < 0.8) {
    commentary.push(`Your creative scored low in ad auctions. Weak visuals or missing hooks make each click significantly more expensive.`);
  } else if (inputs.creative.quality >= 1.3) {
    commentary.push(`Awesome creative choice! The high engagement rate lowered your CPM and raised your CTR.`);
  }

  return {
    totalSpend: cumSpend,
    totalImpressions: cumImps,
    totalClicks: cumClicks,
    totalConversions: cumConvs,
    cpm: avgCPM,
    ctr: avgCTR,
    cpc: avgCPC,
    cpl: avgCPL,
    roas: avgROAS,
    frequency: roundedFrequency,
    learningPhase,
    daily,
    pixieCommentary: commentary,
  };
}

export function evaluateSimPass(results: SimResults, rules: PassRule[]): { passed: boolean; failures: string[] } {
  const failures: string[] = [];

  for (const rule of rules) {
    let actualValue = 0;
    if (rule.metric === 'CPL') actualValue = results.cpl;
    else if (rule.metric === 'conversions') actualValue = results.totalConversions;
    else if (rule.metric === 'ROAS') actualValue = results.roas;
    else if (rule.metric === 'CTR') actualValue = results.ctr;
    else if (rule.metric === 'frequency') actualValue = results.frequency;
    else if (rule.metric === 'spend') actualValue = results.totalSpend;

    let pass = false;
    if (rule.op === '<=') pass = actualValue <= rule.value;
    else if (rule.op === '>=') pass = actualValue >= rule.value;
    else if (rule.op === '<') pass = actualValue < rule.value;
    else if (rule.op === '>') pass = actualValue > rule.value;
    else if (rule.op === '==') pass = actualValue === rule.value;

    if (!pass) {
      failures.push(
        `Required ${rule.metric} ${rule.op} ${rule.value}, but achieved ${actualValue}`
      );
    }
  }

  return {
    passed: failures.length === 0,
    failures,
  };
}
