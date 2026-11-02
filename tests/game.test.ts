import { describe, it, expect } from 'vitest';
import { calculateLevel, getTitleForLevel, getLevelInfo } from '../lib/game/levels';
import { updateStreak, calculateDateDiffDays } from '../lib/game/streak';

describe('Gamification: Levels & Titles', () => {
  it('calculates level correctly from XP', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(49)).toBe(1);
    expect(calculateLevel(50)).toBe(2);
    expect(calculateLevel(199)).toBe(2);
    expect(calculateLevel(200)).toBe(3);
    expect(calculateLevel(450)).toBe(4);
  });

  it('assigns correct title for level tiers', () => {
    expect(getTitleForLevel(1)).toBe('Intern');
    expect(getTitleForLevel(2)).toBe('Intern');
    expect(getTitleForLevel(3)).toBe('Executive');
    expect(getTitleForLevel(5)).toBe('Executive');
    expect(getTitleForLevel(6)).toBe('Specialist');
    expect(getTitleForLevel(9)).toBe('Specialist');
    expect(getTitleForLevel(10)).toBe('Strategist');
    expect(getTitleForLevel(14)).toBe('Strategist');
    expect(getTitleForLevel(15)).toBe('Head of Performance');
  });

  it('calculates progress percentage towards next level', () => {
    const info0 = getLevelInfo(0);
    expect(info0.level).toBe(1);
    expect(info0.currentLevelXP).toBe(0);
    expect(info0.nextLevelXP).toBe(50);
    expect(info0.progressPercent).toBe(0);

    const info25 = getLevelInfo(25);
    expect(info25.level).toBe(1);
    expect(info25.progressPercent).toBe(50);
  });
});

describe('Gamification: Streak Logic', () => {
  it('calculates date diff in days correctly', () => {
    expect(calculateDateDiffDays('2026-11-01', '2026-11-02')).toBe(1);
    expect(calculateDateDiffDays('2026-11-01', '2026-11-01')).toBe(0);
    expect(calculateDateDiffDays('2026-10-31', '2026-11-02')).toBe(2);
  });

  it('handles first activity with no previous active date', () => {
    const res = updateStreak(null, 0, 0, 0, '2026-11-02');
    expect(res.streak).toBe(1);
    expect(res.bestStreak).toBe(1);
    expect(res.isFirstActivityToday).toBe(true);
  });

  it('does not increment streak on same day activity', () => {
    const res = updateStreak('2026-11-02', 3, 5, 1, '2026-11-02');
    expect(res.streak).toBe(3);
    expect(res.isFirstActivityToday).toBe(false);
  });

  it('increments streak on consecutive day', () => {
    const res = updateStreak('2026-11-01', 3, 5, 1, '2026-11-02');
    expect(res.streak).toBe(4);
    expect(res.bestStreak).toBe(5);
    expect(res.isFirstActivityToday).toBe(true);
  });

  it('protects streak with streak freeze on 2-day gap', () => {
    const res = updateStreak('2026-10-31', 5, 5, 1, '2026-11-02');
    expect(res.streak).toBe(6);
    expect(res.streakFreezes).toBe(0);
    expect(res.freezeUsed).toBe(true);
  });

  it('resets streak to 1 on gap when no freezes available', () => {
    const res = updateStreak('2026-10-31', 5, 5, 0, '2026-11-02');
    expect(res.streak).toBe(1);
    expect(res.bestStreak).toBe(5);
    expect(res.freezeUsed).toBe(false);
  });
});
