export interface LevelInfo {
  level: number;
  title: string;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
  xpNeededForNext: number;
}

export function calculateLevel(xp: number): number {
  if (xp <= 0) return 1;
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

export function getTitleForLevel(level: number): string {
  if (level <= 2) return "Intern";
  if (level <= 5) return "Executive";
  if (level <= 9) return "Specialist";
  if (level <= 14) return "Strategist";
  return "Head of Performance";
}

export function getLevelInfo(xp: number): LevelInfo {
  const safeXP = Math.max(0, xp);
  const level = calculateLevel(safeXP);
  const title = getTitleForLevel(level);

  const currentLevelXP = 50 * Math.pow(level - 1, 2);
  const nextLevelXP = 50 * Math.pow(level, 2);
  const xpInCurrentLevel = safeXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((xpInCurrentLevel / xpNeeded) * 100))
  );

  return {
    level,
    title,
    currentLevelXP,
    nextLevelXP,
    progressPercent,
    xpNeededForNext: Math.max(0, nextLevelXP - safeXP),
  };
}

