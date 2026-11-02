'use client';

export interface MistakeItem {
  id: string;
  lessonSlug: string;
  lessonTitle: string;
  questionIndex: number;
  question: string;
  options?: string[];
  type?: 'mcq' | 'tf' | 'order' | 'scenario';
  items?: string[];
  answer: any;
  explain: string;
  hint?: string;
  savedAt: string;
}

const STORAGE_KEY = 'adquest_mistake_notebook';

export function getSavedMistakes(): MistakeItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load mistakes:', e);
    return [];
  }
}

export function saveMistakeToNotebook(
  item: Omit<MistakeItem, 'id' | 'savedAt'>
): MistakeItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedMistakes();
    const id = `${item.lessonSlug}-q${item.questionIndex}`;

    // Deduplicate: replace if already exists
    const filtered = current.filter((m) => m.id !== id);
    const updated: MistakeItem[] = [
      {
        ...item,
        id,
        savedAt: new Date().toISOString(),
      },
      ...filtered,
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save mistake:', e);
    return [];
  }
}

export function removeMistakeFromNotebook(id: string): MistakeItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedMistakes();
    const updated = current.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to remove mistake:', e);
    return [];
  }
}
