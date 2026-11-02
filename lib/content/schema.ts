import { z } from 'zod';

export const BlockSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('pixie'),
    text: z.string(),
  }),
  z.object({
    type: z.literal('text'),
    text: z.string(),
  }),
  z.object({
    type: z.literal('analogy'),
    title: z.string(),
    text: z.string(),
  }),
  z.object({
    type: z.literal('example'),
    title: z.string().optional(),
    text: z.string(),
  }),
  z.object({
    type: z.literal('compare'),
    left: z.object({
      title: z.string(),
      points: z.array(z.string()),
    }),
    right: z.object({
      title: z.string(),
      points: z.array(z.string()),
    }),
  }),
  z.object({
    type: z.literal('steps'),
    title: z.string(),
    items: z.array(z.string()),
  }),
  z.object({
    type: z.literal('tip'),
    text: z.string(),
  }),
  z.object({
    type: z.literal('warning'),
    text: z.string(),
  }),
  z.object({
    type: z.literal('table'),
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
  z.object({
    type: z.literal('interactive-sort'),
    prompt: z.string(),
    items: z.array(z.string()),
    correctOrder: z.array(z.number()),
  }),
]);

export const QuizQuestionSchema = z.object({
  id: z.string(),
  q: z.string(),
  type: z.enum(['mcq', 'tf', 'order']).default('mcq'),
  options: z.array(z.string()).optional(),
  items: z.array(z.string()).optional(),
  answer: z.union([z.number(), z.boolean(), z.array(z.number())]),
  hint: z.string().optional(),
  explain: z.string(),
});

export const LessonSchema = z.object({
  slug: z.string(),
  world: z.string(),
  tier: z.enum(['rookie', 'operator', 'strategist']),
  order: z.number(),
  title: z.string(),
  minutes: z.number(),
  objectives: z.array(z.string()),
  glossary: z.array(z.string()),
  blocks: z.array(BlockSchema),
  quiz: z.array(QuizQuestionSchema),
  recap: z.array(z.string()),
  next: z.string().nullable().optional(),
});

export const GlossaryItemSchema = z.object({
  slug: z.string(),
  term: z.string(),
  simple: z.string(),
  example: z.string(),
});

export const DailyQuestionSchema = z.object({
  id: z.string(),
  lessonSlug: z.string(),
  q: z.string(),
  options: z.array(z.string()),
  answer: z.number(),
  explain: z.string(),
});

export const BossStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  context: z.string(),
  tableData: z.array(z.array(z.string())).optional(),
  question: z.string().optional(),
  q: z.string().optional(),
  options: z.array(z.string()),
  answer: z.number(),
  explain: z.string(),
  hint: z.string().optional(),
});

export const BossBattleSchema = z.object({
  slug: z.string(),
  tier: z.enum(['rookie', 'operator', 'strategist']),
  title: z.string(),
  description: z.string(),
  steps: z.array(BossStepSchema),
  passScorePct: z.number().default(70),
  xp: z.number().default(150),
  coins: z.number().default(30),
});

export const InterviewQuestionSchema = z.object({
  slug: z.string(),
  tier: z.enum(['rookie', 'operator', 'strategist', 'google']),
  platform: z.string(),
  type: z.enum(['concept', 'behavioral', 'scenario']),
  lessonSlug: z.string(),
  question: z.string(),
  levelTag: z.string(),
  keyPoints: z.array(z.string()),
  modelAnswer: z.string(),
  followUp: z.string(),
  commonMistakes: z.array(z.string()),
  tip: z.string(),
});

export const ScenarioStepSchema = z.object({
  prompt: z.string(),
  options: z.array(z.string()),
  answer: z.number(),
  explain: z.string(),
});

export const InterviewScenarioSchema = z.object({
  slug: z.string(),
  tier: z.enum(['rookie', 'operator', 'strategist']),
  title: z.string(),
  lessonSlug: z.string(),
  story: z.string(),
  data: z.object({
    table: z.array(z.array(z.string())),
  }),
  steps: z.array(ScenarioStepSchema),
  finalQuestion: z.string(),
  keyPoints: z.array(z.string()),
  modelAnswer: z.string(),
});

export type Block = z.infer<typeof BlockSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type GlossaryItem = z.infer<typeof GlossaryItemSchema>;
export type DailyQuestion = z.infer<typeof DailyQuestionSchema>;
export type BossBattle = z.infer<typeof BossBattleSchema>;
export type BossStep = z.infer<typeof BossStepSchema>;
export type InterviewQuestion = z.infer<typeof InterviewQuestionSchema>;
export type InterviewScenario = z.infer<typeof InterviewScenarioSchema>;

