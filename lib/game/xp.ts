export const XP_REWARDS = {
  LESSON_COMPLETE: { xp: 20, coins: 4 },
  QUIZ_CORRECT_ANSWER: { xp: 5, coins: 1 },
  QUIZ_PERFECT_BONUS: { xp: 15, coins: 3 },
  SIM_PASS: { xp: 50, coins: 10 },
  BOSS_WIN: { xp: 150, coins: 30 },
  DAILY_CHALLENGE: { xp: 30, coins: 6 },
  FIRST_ACTIVITY_DAY: { xp: 5, coins: 0 },
  INTERVIEW_CARD_FIRST: { xp: 5, coins: 1 },
  INTERVIEW_RAPID_FIRE: { xp: 40, coins: 8 },
  INTERVIEW_SCENARIO: { xp: 60, coins: 12 },
  INTERVIEW_MOCK: { xp: 120, coins: 25 },
  STAR_STORY_SAVED: { xp: 40, coins: 5 },
} as const;

export interface AwardXPResult {
  xp: number;
  coins: number;
  streak: number;
  best_streak: number;
  streak_freezes: number;
  level: number;
  levelTitle: string;
}

