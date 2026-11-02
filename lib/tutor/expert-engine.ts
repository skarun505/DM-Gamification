export interface ConversationTurn {
  sender: 'user' | 'pixie';
  text: string;
}

interface MetricKnowledge {
  name: string;
  fullName: string;
  shortDef: string;
  formula: string;
  diagram: string;
  numericalExample: string;
  mentorTip: string;
}

export const METRIC_KNOWLEDGE_BASE: Record<string, MetricKnowledge> = {
  cpr: {
    name: 'CPR',
    fullName: 'Cost Per Result',
    shortDef: 'The average amount of money spent to achieve one primary campaign result (e.g., a lead, purchase, or sign-up).',
    formula: 'CPR = Total Ad Spend (₹) ÷ Total Results',
    diagram: `┌────────────────────────────────────────────────────────────┐
│ 📊 CPR (Cost Per Result) Step-by-Step Math                 │
├────────────────────────────────────────────────────────────┤
│ Formula:                                                   │
│    CPR = Total Ad Spend (₹) ÷ Total Results Count          │
│                                                            │
│ Step-by-Step Numerical Example:                            │
│    • Total Ad Budget Spent:   ₹5,000                       │
│    • Desired Results (Leads): 50 leads                     │
│                                                            │
│ Calculation:                                               │
│    ₹5,000 ÷ 50 = ₹100 per result                           │
│                                                            │
│ Result Breakdown:                                          │
│    • Spend:    ₹5,000 [ - Ad Budget ]                      │
│    • Output:   50 leads                                    │
│    • Cost/Lead: ₹100 / lead (CPR)                          │
└────────────────────────────────────────────────────────────┘`,
    numericalExample: 'If your client spends ₹10,000 on Instagram and gets 200 appointment bookings, your CPR = ₹10,000 ÷ 200 = ₹50 per booking.',
    mentorTip: 'If your CPR is climbing, check your landing page conversion rate (CVR) and test 3 new ad creative hooks to lower your acquisition cost!',
  },
  roas: {
    name: 'ROAS',
    fullName: 'Return On Ad Spend',
    shortDef: 'The revenue generated for every single rupee or dollar spent on advertising.',
    formula: 'ROAS = Total Revenue Generated (₹) ÷ Total Ad Spend (₹)',
    diagram: `┌────────────────────────────────────────────────────────────┐
│ 📈 ROAS (Return On Ad Spend) Calculation                   │
├────────────────────────────────────────────────────────────┤
│ Formula:                                                   │
│    ROAS = Total Revenue (₹) ÷ Total Ad Spend (₹)           │
│                                                            │
│ Step-by-Step Numerical Example:                            │
│    • Ad Spend:    ₹10,000                                  │
│    • Total Sales: ₹40,000                                  │
│                                                            │
│ Math Calculation:                                          │
│    ₹40,000 ÷ ₹10,000 = 4.0x ROAS                           │
│                                                            │
│ Return in Percentage:                                      │
│    4.0 × 100% = 400% Return on Investment                  │
└────────────────────────────────────────────────────────────┘`,
    numericalExample: 'Spending ₹20,000 and generating ₹70,000 in e-commerce orders gives you ₹70,000 ÷ ₹20,000 = 3.5x ROAS.',
    mentorTip: 'Always calculate your Break-Even ROAS (1 ÷ Profit Margin) before scaling ad budgets!',
  },
  cpm: {
    name: 'CPM',
    fullName: 'Cost Per Mille (Cost per 1,000 Impressions)',
    shortDef: 'The price Meta or Google charges you to show your ad 1,000 times in the auction.',
    formula: 'CPM = (Total Ad Spend ÷ Total Impressions) × 1,000',
    diagram: `┌────────────────────────────────────────────────────────────┐
│ 👁️ CPM (Cost Per 1,000 Impressions)                        │
├────────────────────────────────────────────────────────────┤
│ Formula:                                                   │
│    CPM = (Total Spend ÷ Impressions) × 1,000               │
│                                                            │
│ Step-by-Step Numerical Example:                            │
│    • Total Spend:       ₹3,000                             │
│    • Impressions:       200,000 ad views                   │
│                                                            │
│ Math:                                                      │
│    (₹3,000 ÷ 200,000) × 1,000 = ₹15 CPM                    │
│                                                            │
│ Interpretation:                                            │
│    You pay ₹15 for every 1,000 people who see your ad.     │
└────────────────────────────────────────────────────────────┘`,
    numericalExample: 'If spend is ₹6,000 and impressions are 150,000: (₹6,000 ÷ 150,000) × 1,000 = ₹40 CPM.',
    mentorTip: 'High CPM (>₹150 in India or >$35 in US)? Widen your audience targeting or improve your creative engagement to score higher in Meta\'s ad auction!',
  },
  ctr: {
    name: 'CTR',
    fullName: 'Click-Through Rate',
    shortDef: 'The percentage of people who clicked your ad after seeing it.',
    formula: 'CTR = (Total Clicks ÷ Total Impressions) × 100%',
    diagram: `┌────────────────────────────────────────────────────────────┐
│ 🎯 CTR (Click-Through Rate) Math                           │
├────────────────────────────────────────────────────────────┤
│ Formula:                                                   │
│    CTR = (Link Clicks ÷ Impressions) × 100%                │
│                                                            │
│ Step-by-Step Numerical Example:                            │
│    • Impressions: 50,000 views                             │
│    • Link Clicks: 1,500 clicks                             │
│                                                            │
│ Math:                                                      │
│    (1,500 ÷ 50,000) × 100% = 3.0% CTR                      │
│                                                            │
│ Agency Benchmark:                                          │
│    • < 1.0%: Weak hook (change opening 3 seconds)          │
│    • 1.0% - 2.0%: Average                                  │
│    • > 2.0%: High converting winner! 🚀                    │
└────────────────────────────────────────────────────────────┘`,
    numericalExample: '1,200 clicks out of 60,000 impressions = (1,200 ÷ 60,000) × 100% = 2.0% CTR.',
    mentorTip: 'Test 3 different 3-second opening video hooks while keeping the rest of the ad identical to boost CTR fast.',
  },
  cpc: {
    name: 'CPC',
    fullName: 'Cost Per Click',
    shortDef: 'The exact amount you pay each time a prospect clicks on your ad link.',
    formula: 'CPC = Total Spend ÷ Total Link Clicks',
    diagram: `┌────────────────────────────────────────────────────────────┐
│ 🖱️ CPC (Cost Per Click) Step-by-Step                       │
├────────────────────────────────────────────────────────────┤
│ Formula:                                                   │
│    CPC = Total Spend ÷ Total Link Clicks                   │
│                                                            │
│ Numerical Example:                                         │
│    • Total Spend: ₹4,000                                   │
│    • Clicks:      800 link clicks                          │
│                                                            │
│ Math:                                                      │
│    ₹4,000 ÷ 800 = ₹5.00 per click                          │
└────────────────────────────────────────────────────────────┘`,
    numericalExample: '₹2,500 spend with 500 clicks = ₹2,500 ÷ 500 = ₹5 per click.',
    mentorTip: 'Higher CTR directly lowers your CPC because Meta rewards ads that users engage with!',
  },
  cpl: {
    name: 'CPL',
    fullName: 'Cost Per Lead',
    shortDef: 'The cost paid to acquire one verified prospective customer contact info (name, phone, email).',
    formula: 'CPL = Total Spend ÷ Total Verified Leads',
    diagram: `┌────────────────────────────────────────────────────────────┐
│ 📋 CPL (Cost Per Lead) Formula                             │
├────────────────────────────────────────────────────────────┤
│ Formula:                                                   │
│    CPL = Total Spend ÷ Total Leads                         │
│                                                            │
│ Example:                                                   │
│    • Spend: ₹12,000 on Facebook Native Lead Form           │
│    • Leads: 120 completed form submissions                 │
│                                                            │
│ Calculation:                                               │
│    ₹12,000 ÷ 120 = ₹100 per lead                           │
└────────────────────────────────────────────────────────────┘`,
    numericalExample: '₹15,000 budget generating 100 salon booking leads = ₹15,000 ÷ 100 = ₹150 CPL.',
    mentorTip: 'Use Higher Intent instant forms with a confirmation slide to filter out fake numbers and junk leads!',
  },
};

/**
 * Detects the active marketing topic from the user's message or previous conversation turns.
 */
export function detectTopic(message: string, history: ConversationTurn[] = []): string | null {
  const combined = (
    message +
    ' ' +
    history
      .map((h) => h.text)
      .join(' ')
  ).toLowerCase();

  const keywords: [string, string[]][] = [
    ['cpr', ['cpr', 'cost per result', 'cost/result', 'result cost']],
    ['roas', ['roas', 'return on ad spend', 'revenue', 'return on spend']],
    ['cpm', ['cpm', 'cost per mille', 'impressions cost', 'per thousand']],
    ['ctr', ['ctr', 'click through', 'click-through', 'clicks to impression']],
    ['cpc', ['cpc', 'cost per click', 'click cost']],
    ['cpl', ['cpl', 'cost per lead', 'lead cost']],
  ];

  for (const [key, terms] of keywords) {
    if (terms.some((term) => combined.includes(term))) {
      return key;
    }
  }

  return null;
}

/**
 * Generates a deeply personalized, diagram-rich answer for the learner.
 */
export function generateExpertReply(
  message: string,
  learnerName: string = 'Deepana',
  history: ConversationTurn[] = []
): string {
  const lowerMsg = message.toLowerCase();
  const topicKey = detectTopic(message, history);

  // Check if learner is asking for numbers, math, formulas, or formatting
  const wantsNumbers =
    lowerMsg.includes('number') ||
    lowerMsg.includes('formar') ||
    lowerMsg.includes('format') ||
    lowerMsg.includes('formula') ||
    lowerMsg.includes('math') ||
    lowerMsg.includes('calc') ||
    lowerMsg.includes('example') ||
    lowerMsg.includes('detail') ||
    lowerMsg.includes('+') ||
    lowerMsg.includes('-') ||
    lowerMsg.includes('/') ||
    lowerMsg.includes('*') ||
    lowerMsg.includes('step');

  // Check if learner is asking personal identity questions
  if (
    lowerMsg.includes('what is my name') ||
    lowerMsg.includes('who am i') ||
    lowerMsg.includes('my name') ||
    lowerMsg.includes('my anme')
  ) {
    return `Hey ${learnerName}! 🦊 Of course I know you! Your name is **${learnerName}**, and you're my dedicated performance marketer in training here on AdQuest! 🌟 What ad mission or formula should we conquer next?`;
  }

  if (lowerMsg.includes('who are you') || lowerMsg.includes('what is pixie')) {
    return `Hey ${learnerName}! 🦊 I am **Pixie**, your 1-on-1 personal AI media buying mentor. I'm here 24/7 to solve your campaign problems, explain numbers and formulas, diagnose auction metrics, and help you get hired as a high-earning ad specialist!`;
  }

  // Topic-specific detailed response
  if (topicKey && METRIC_KNOWLEDGE_BASE[topicKey]) {
    const data = METRIC_KNOWLEDGE_BASE[topicKey];

    if (wantsNumbers) {
      return `Hey ${learnerName}! 🦊 Here is the exact **${data.name} (${data.fullName})** formula and numerical step-by-step breakdown:

\`\`\`text
${data.diagram}
\`\`\`

🔢 **Real-World Agency Example:**
${data.numericalExample}

💡 **Mentor Pro-Tip for ${learnerName}:**
${data.mentorTip}`;
    }

    return `Hey ${learnerName}! 🦊 **${data.name}** stands for **${data.fullName}**!

${data.shortDef}

\`\`\`text
${data.diagram}
\`\`\`

💡 **Quick Rule:** ${data.mentorTip}

Ask me if you want to calculate this with your specific campaign budget! 📈`;
  }

  // Generic request for numbers/formulas
  if (wantsNumbers) {
    return `Hey ${learnerName}! 🦊 Here are the 4 core performance advertising math formulas every media buyer must master:

\`\`\`text
┌────────────────────────────────────────────────────────────┐
│ 📐 CORE MEDIA BUYING MATH CHEAT SHEET                      │
├────────────────────────────────────────────────────────────┤
│ 1. CPR / CPA:  Total Spend ÷ Total Results (or Purchases)  │
│ 2. ROAS:       Total Sales Revenue ÷ Total Ad Spend        │
│ 3. CTR (%):    (Link Clicks ÷ Impressions) × 100%          │
│ 4. CPM:        (Total Spend ÷ Impressions) × 1,000         │
└────────────────────────────────────────────────────────────┘
\`\`\`

Tell me which metric you want a deep step-by-step numerical calculation for, and I'll break down the math for you! 🧮`;
  }

  // General fallback
  return `Hey ${learnerName}! 🦊 In performance marketing, every campaign puzzle comes down to three measurable steps:

1. **Attraction (CTR):** Are people clicking? *(Clicks ÷ Impressions × 100)*
2. **Cost of Reach (CPM):** How much Meta charges per 1,000 views.
3. **Conversion (CPR / CPL / ROAS):** Did they take the final action?

Ask me any specific metric, ad problem, or ask for a **"number format"** calculation, and I'll show you the exact math! 🚀`;
}
