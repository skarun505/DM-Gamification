import { describe, it, expect } from 'vitest';
import { runSimulation, evaluateSimPass, SimInputs, SimScenarioFixed } from '../lib/sim/engine';

describe('Simulator Engine', () => {
  const salonFixed: SimScenarioFixed = {
    baseCPM: 140,
    baseCTR: 0.015,
    baseCVR: 0.09,
    offerStrength: 1.0,
    landingQuality: 1.0,
    pixelInstalled: true,
  };

  const goodInputs: SimInputs = {
    objective: 'leads',
    dailyBudget: 500,
    days: 7,
    audience: { size: 'balanced', type: 'interests' },
    creative: { id: 'b', label: 'Before/after video', quality: 1.4 },
    placements: 'auto',
    pixelInstalled: true,
  };

  const badInputs: SimInputs = {
    objective: 'leads',
    dailyBudget: 500,
    days: 7,
    audience: { size: 'narrow', type: 'interests' },
    creative: { id: 'c', label: 'Logo only', quality: 0.6 },
    placements: 'manual',
    pixelInstalled: false, // Broken pixel!
  };

  it('is deterministic for a given seed', () => {
    const run1 = runSimulation(goodInputs, salonFixed, 42);
    const run2 = runSimulation(goodInputs, salonFixed, 42);
    expect(run1.totalSpend).toBe(run2.totalSpend);
    expect(run1.totalImpressions).toBe(run2.totalImpressions);
    expect(run1.totalConversions).toBe(run2.totalConversions);
    expect(run1.cpl).toBe(run2.cpl);
  });

  it('good setup produces strong conversions and passes Salon criteria', () => {
    const res = runSimulation(goodInputs, salonFixed, 42);
    expect(res.totalSpend).toBe(3500);
    expect(res.totalConversions).toBeGreaterThan(20);
    expect(res.cpl).toBeLessThanOrEqual(130);

    const passCheck = evaluateSimPass(res, [
      { metric: 'CPL', op: '<=', value: 140 },
      { metric: 'conversions', op: '>=', value: 20 },
    ]);
    expect(passCheck.passed).toBe(true);
  });

  it('fails with 0 conversions when pixel is missing for lead campaign', () => {
    const res = runSimulation(badInputs, salonFixed, 42);
    expect(res.totalConversions).toBe(0);
    const passCheck = evaluateSimPass(res, [
      { metric: 'conversions', op: '>=', value: 20 },
    ]);
    expect(passCheck.passed).toBe(false);
    expect(res.pixieCommentary.some((c) => c.includes('Pixel is not installed'))).toBe(true);
  });
});
