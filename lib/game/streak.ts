export function getTodayIST(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}

export function calculateDateDiffDays(dateA: string, dateB: string): number {
  const d1 = new Date(dateA + 'T00:00:00Z');
  const d2 = new Date(dateB + 'T00:00:00Z');
  const diffMs = d2.getTime() - d1.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export interface StreakUpdateResult {
  streak: number;
  bestStreak: number;
  streakFreezes: number;
  freezeUsed: boolean;
  isFirstActivityToday: boolean;
  today: string;
}

export function updateStreak(
  lastActiveDate: string | null,
  currentStreak: number,
  bestStreak: number,
  streakFreezes: number,
  today: string = getTodayIST()
): StreakUpdateResult {
  if (!lastActiveDate) {
    return {
      streak: 1,
      bestStreak: Math.max(bestStreak, 1),
      streakFreezes,
      freezeUsed: false,
      isFirstActivityToday: true,
      today,
    };
  }

  const diffDays = calculateDateDiffDays(lastActiveDate, today);

  if (diffDays === 0) {
    return {
      streak: currentStreak,
      bestStreak,
      streakFreezes,
      freezeUsed: false,
      isFirstActivityToday: false,
      today,
    };
  } else if (diffDays === 1) {
    const newStreak = currentStreak + 1;
    return {
      streak: newStreak,
      bestStreak: Math.max(bestStreak, newStreak),
      streakFreezes,
      freezeUsed: false,
      isFirstActivityToday: true,
      today,
    };
  } else if (diffDays === 2 && streakFreezes > 0) {
    const newStreak = currentStreak + 1;
    return {
      streak: newStreak,
      bestStreak: Math.max(bestStreak, newStreak),
      streakFreezes: streakFreezes - 1,
      freezeUsed: true,
      isFirstActivityToday: true,
      today,
    };
  } else {
    return {
      streak: 1,
      bestStreak: Math.max(bestStreak, 1),
      streakFreezes,
      freezeUsed: false,
      isFirstActivityToday: true,
      today,
    };
  }
}
