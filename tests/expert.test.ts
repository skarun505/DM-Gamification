import { describe, it, expect } from 'vitest';
import { generateExpertReply } from '../lib/tutor/expert-engine';

describe('Personalized Pixie Dialogue Engine', () => {
  it('greets Deepana by name with actionable suggestions', () => {
    const res = generateExpertReply('hey hi', 'Deepana');
    expect(res).toContain('Hey Deepana!');
    expect(res).toContain('ROAS');
  });

  it('provides the budget blueprint for budget queries', () => {
    const res = generateExpertReply('how much budget should I start with?', 'Deepana');
    expect(res).toContain('Budgeting Blueprint');
    expect(res).toContain('₹500 to ₹1,000 per day');
  });

  it('provides real estate guidance for real estate queries', () => {
    const res = generateExpertReply('can you help me run ads for real estate?', 'Deepana');
    expect(res).toContain('Real Estate');
    expect(res).toContain('Instant Forms');
  });

  it('answers name questions correctly for Deepana', () => {
    const res = generateExpertReply('what is my name', 'Deepana');
    expect(res).toContain('**Deepana**');
  });

  it('provides high CPL diagnosis when asked about bad lead quality', () => {
    const res = generateExpertReply('why is my CPL so high and leads are fake?', 'Deepana');
    expect(res).toContain('Higher Intent');
  });
});

