import { describe, it, expect } from 'vitest';
import { generateExpertReply, detectTopic } from '../lib/tutor/expert-engine';

describe('Pixie-Jarvis Tactical Performance AI Engine', () => {
  it('does NOT get locked on previous history topics (CPR bug fix)', () => {
    const history = [
      { sender: 'user' as const, text: 'what is cpr' },
      { sender: 'pixie' as const, text: 'CPR stands for Cost Per Result' },
    ];

    // User asks about real estate next: MUST NOT return CPR
    const realEstateReply = generateExpertReply('how to run ads for real estate?', 'Deepana', history);
    expect(realEstateReply).toContain('Real Estate');
    expect(realEstateReply).not.toContain('CPR stands for Cost Per Result');

    // User asks about budget next: MUST NOT return CPR
    const budgetReply = generateExpertReply('how much budget should I start with?', 'Deepana', history);
    expect(budgetReply).toContain('Budgeting & Scaling');
    expect(budgetReply).not.toContain('CPR stands for Cost Per Result');

    // User asks for identity next: MUST NOT return CPR
    const nameReply = generateExpertReply('what is my name', 'Deepana', history);
    expect(nameReply).toContain('**Deepana**');
    expect(nameReply).not.toContain('CPR stands for Cost Per Result');

    // User asks about ROAS next: MUST detect ROAS, not CPR
    const topic = detectTopic('can you explain roas?', history);
    expect(topic).toBe('roas');
  });

  it('adopts the Jarvis Iron Man AI co-pilot persona', () => {
    const greeting = generateExpertReply('hey hi', 'Deepana');
    expect(greeting).toContain('Jarvis Marketing Co-pilot');
    expect(greeting).toContain('Deepana');

    const whoAreYou = generateExpertReply('who are you', 'Deepana');
    expect(whoAreYou).toContain('Pixie-Jarvis');
    expect(whoAreYou).toContain('Tony Stark');
  });

  it('provides deep performance marketing protocols (Auction, 3:2:2, CBO vs ABO)', () => {
    const auctionReply = generateExpertReply('how does the meta ad auction algorithm work?', 'Deepana');
    expect(auctionReply).toContain('Meta Ad Auction Equation');
    expect(auctionReply).toContain('Estimated Action Rate');

    const testReply = generateExpertReply('how to test ads with 3:2:2?', 'Deepana');
    expect(testReply).toContain('3:2:2 Dynamic Creative Engine');

    const cboReply = generateExpertReply('explain cbo vs abo', 'Deepana');
    expect(cboReply).toContain('CBO vs ABO Battle Protocol');
  });

  it('correctly calculates metrics when explicitly requested with numbers', () => {
    const cprNumbers = generateExpertReply('give me in number format', 'Deepana', [
      { sender: 'user' as const, text: 'what is cpr' },
    ]);
    expect(cprNumbers).toContain('CPR (Cost Per Result)');
    expect(cprNumbers).toContain('Jarvis Mathematical Architecture');
  });
});
