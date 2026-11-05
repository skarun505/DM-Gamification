import { describe, it, expect } from 'vitest';
import { generateExpertReply, detectTopic, detectComparison, detectFramework, searchGlossary } from '../lib/tutor/expert-engine';

describe('Pixie-Jarvis Performance Marketing Knowledge Vault', () => {
  it('accurately answers CVR, LTV, CAC, and CPA queries', () => {
    const cvr = generateExpertReply('what is CVR and how to calculate it?', 'Deepana');
    expect(cvr).toContain('CVR');
    expect(cvr).toContain('Conversion Rate');
    expect(cvr).toContain('Jarvis Mathematical Architecture');

    const ltv = generateExpertReply('explain LTV with formula', 'Deepana');
    expect(ltv).toContain('LTV');
    expect(ltv).toContain('Customer Lifetime Value');

    const cac = generateExpertReply('what is CAC?', 'Deepana');
    expect(cac).toContain('CAC');
    expect(cac).toContain('Customer Acquisition Cost');

    const cpa = generateExpertReply('what is CPA?', 'Deepana');
    expect(cpa).toContain('CPA');
    expect(cpa).toContain('Cost Per Acquisition');
  });

  it('accurately detects and answers metric comparisons (CPA vs CAC, CBO vs ABO)', () => {
    const cpaCacComp = detectComparison('what is the difference between cpa and cac?');
    expect(cpaCacComp).toBe('cpa_vs_cac');

    const cpaCacReply = generateExpertReply('what is the difference between cpa and cac?', 'Deepana');
    expect(cpaCacReply).toContain('CPA vs CAC Comparison Protocol');
    expect(cpaCacReply).toContain('In-Platform');

    const cboAboReply = generateExpertReply('explain CBO vs ABO which is better?', 'Deepana');
    expect(cboAboReply).toContain('CBO vs ABO Battle Protocol');
    expect(cboAboReply).toContain('ABO (Ad Set Budget Optimization)');

    const broadLalReply = generateExpertReply('difference between broad and lookalike?', 'Deepana');
    expect(broadLalReply).toContain('Broad Targeting vs Lookalike Audiences');
  });

  it('provides syllabus frameworks like Diagnose a Drop and 8-Step Launch Plan', () => {
    const dropFw = detectFramework('how to diagnose a sudden drop in ROAS?');
    expect(dropFw).toBe('diagnose_drop');

    const dropReply = generateExpertReply('how to diagnose a drop in campaign performance?', 'Deepana');
    expect(dropReply).toContain('Diagnose-a-Drop');
    expect(dropReply).toContain('Tracking Audit');

    const launchReply = generateExpertReply('give me the 8 step launch plan for a new client', 'Deepana');
    expect(launchReply).toContain('8-Step Campaign Launch Protocol');

    const learnLimitedReply = generateExpertReply('my ad is stuck in learning limited how to fix it?', 'Deepana');
    expect(learnLimitedReply).toContain('Learning Limited');
  });

  it('searches the 80 syllabus glossary terms from glossary.json', () => {
    const term = searchGlossary('what is attribution window');
    expect(term).not.toBeNull();
    expect(term?.term).toContain('Attribution Window');

    const leadMagnet = generateExpertReply('what is a lead magnet?', 'Deepana');
    expect(leadMagnet).toContain('Jarvis Syllabus Vault');
    expect(leadMagnet).toContain('Lead Magnet');
  });
});
