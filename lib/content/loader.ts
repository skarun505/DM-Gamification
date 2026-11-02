import fs from 'fs';
import path from 'path';
import {
  Lesson,
  LessonSchema,
  GlossaryItem,
  GlossaryItemSchema,
  BossBattle,
  BossBattleSchema,
  InterviewQuestion,
  InterviewQuestionSchema,
  InterviewScenario,
  InterviewScenarioSchema,
} from './schema';
import { SimScenario } from '../sim/engine';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface WorldMapTier {
  id: 'rookie' | 'operator' | 'strategist';
  name: string;
  description: string;
  lessons: string[];
  sims: string[];
  boss: string;
}

export interface WorldMap {
  id: string;
  name: string;
  description: string;
  locked: boolean;
  tiers: WorldMapTier[];
}

export function getWorlds(): WorldMap[] {
  const filePath = path.join(CONTENT_DIR, 'worlds.json');
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function getLessonBySlug(slug: string): Lesson | null {
  const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim().replace(/[\s_]+/g, '-');
  // Search meta tiers: rookie, operator, strategist
  const tiers = ['rookie', 'operator', 'strategist'];
  for (const tier of tiers) {
    const filePath = path.join(CONTENT_DIR, 'meta', tier, `${normalizedSlug}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return LessonSchema.parse(data);
    }
  }
  return null;
}

export function getAllLessons(): Lesson[] {
  const lessons: Lesson[] = [];
  const tiers = ['rookie', 'operator', 'strategist'];
  for (const tier of tiers) {
    const tierDir = path.join(CONTENT_DIR, 'meta', tier);
    if (fs.existsSync(tierDir)) {
      const files = fs.readdirSync(tierDir).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        const fullPath = path.join(tierDir, file);
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        lessons.push(LessonSchema.parse(data));
      }
    }
  }
  return lessons.sort((a, b) => a.order - b.order);
}

export function getGlossary(): GlossaryItem[] {
  const filePath = path.join(CONTENT_DIR, 'glossary.json');
  if (!fs.existsSync(filePath)) return [];
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return data.map((item: any) => GlossaryItemSchema.parse(item));
}

export function getDailyQuestions(): any[] {
  const filePath = path.join(CONTENT_DIR, 'daily-bank.json');
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function getSimScenario(slug: string): SimScenario | null {
  const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim().replace(/[\s_]+/g, '-');
  const filePath = path.join(CONTENT_DIR, 'sim', `${normalizedSlug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function getBossBattle(slug: string): BossBattle | null {
  const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim().replace(/[\s_]+/g, '-');
  const filePath = path.join(CONTENT_DIR, 'boss', `${normalizedSlug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return BossBattleSchema.parse(data);
}

export function getInterviewQuestions(tier?: string): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  const tiers = tier ? [tier] : ['rookie', 'operator', 'strategist'];
  for (const t of tiers) {
    const filePath = path.join(CONTENT_DIR, 'interview', `questions-${t}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      data.forEach((q: any) => questions.push(InterviewQuestionSchema.parse(q)));
    }
  }
  return questions;
}

export function getInterviewScenarios(): InterviewScenario[] {
  const dir = path.join(CONTENT_DIR, 'interview', 'scenarios');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  return files.map((f) => {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'));
    return InterviewScenarioSchema.parse(data);
  });
}

