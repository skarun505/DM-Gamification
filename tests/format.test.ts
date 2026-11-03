import { describe, it, expect } from 'vitest';
import { generateExpertReply, METRIC_KNOWLEDGE_BASE } from '../lib/tutor/expert-engine';

describe('Pixie Expert Engine Formatting', () => {
  it('does not contain any ASCII box border characters', () => {
    // Check all metric breakdowns
    for (const key of Object.keys(METRIC_KNOWLEDGE_BASE)) {
      const metric = METRIC_KNOWLEDGE_BASE[key];
      expect(metric.breakdown).not.toMatch(/[┌┐└┘├┤─│]/);
      expect(metric.breakdown).not.toMatch(/\|/);
    }
  });

  it('generates a clean number format without broken pipe symbols', () => {
    const reply = generateExpertReply('give me in number formar', 'Deepana', [
      { sender: 'user', text: 'what is cpl' },
      { sender: 'pixie', text: 'CPL stands for Cost Per Lead' },
    ]);

    expect(reply).toContain('Deepana');
    expect(reply).toContain('CPL (Cost Per Lead)');
    expect(reply).toContain('📐 **The Formula:**');
    expect(reply).toContain('🔢 **Step-by-Step Calculation:**');
    // Ensure zero ASCII box characters
    expect(reply).not.toMatch(/[┌┐└┘├┤─│]/);
    expect(reply).not.toMatch(/\|/);
  });

  it('answers "my name?" with high warmth and bold markdown', () => {
    const reply = generateExpertReply('my name?', 'Deepana');
    expect(reply).toContain('Deepana');
    expect(reply).toContain('**Deepana**');
  });
});

