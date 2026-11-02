export interface ConversationTurn {
  sender: 'user' | 'pixie';
  text: string;
}

interface MetricKnowledge {
  name: string;
  fullName: string;
  shortDef: string;
  formula: string;
  breakdown: string;
  numericalExample: string;
  mentorTip: string;
}

export const METRIC_KNOWLEDGE_BASE: Record<string, MetricKnowledge> = {
  cpr: {
    name: 'CPR',
    fullName: 'Cost Per Result',
    shortDef: 'The average amount of money spent to achieve one primary campaign result (e.g., a lead, purchase, or sign-up).',
    formula: 'CPR = Total Ad Spend (₹) ÷ Total Results',
    breakdown: `📐 **The Formula:**
**CPR** = Total Ad Spend (₹) ÷ Total Results

🔢 **Step-by-Step Calculation:**
• **Total Ad Budget Spent:** ₹5,000
• **Desired Results (Leads):** 50 leads
• **Calculation:** ₹5,000 ÷ 50 = **₹100 per result**

💡 **Summary:**
You paid **₹100** for each qualified lead or result!`,
    numericalExample: 'If your client spends ₹10,000 on Instagram and gets 200 appointment bookings, your CPR = ₹10,000 ÷ 200 = **₹50 per booking**.',
    mentorTip: 'If your CPR is climbing, check your landing page conversion rate (CVR) and test 3 new ad creative hooks to lower your acquisition cost!',
  },
  roas: {
    name: 'ROAS',
    fullName: 'Return On Ad Spend',
    shortDef: 'The revenue generated for every single rupee or dollar spent on advertising.',
    formula: 'ROAS = Total Revenue Generated (₹) ÷ Total Ad Spend (₹)',
    breakdown: `📐 **The Formula:**
**ROAS** = Total Revenue (₹) ÷ Total Ad Spend (₹)

🔢 **Step-by-Step Calculation:**
• **Ad Spend:** ₹10,000
• **Total Sales Generated:** ₹40,000
• **Math Calculation:** ₹40,000 ÷ ₹10,000 = **4.0x ROAS**
• **Return in Percentage:** 4.0 × 100% = **400% ROI**

💡 **Summary:**
For every ₹1 you spent on ads, you made **₹4** back in customer sales!`,
    numericalExample: 'Spending ₹20,000 and generating ₹70,000 in e-commerce orders gives you ₹70,000 ÷ ₹20,000 = **3.5x ROAS**.',
    mentorTip: 'Always calculate your Break-Even ROAS (1 ÷ Profit Margin) before scaling ad budgets!',
  },
  cpm: {
    name: 'CPM',
    fullName: 'Cost Per Mille (Cost per 1,000 Impressions)',
    shortDef: 'The price Meta or Google charges you to show your ad 1,000 times in the auction.',
    formula: 'CPM = (Total Ad Spend ÷ Total Impressions) × 1,000',
    breakdown: `📐 **The Formula:**
**CPM** = (Total Spend ÷ Impressions) × 1,000

🔢 **Step-by-Step Calculation:**
• **Total Ad Spend:** ₹3,000
• **Impressions Delivered:** 200,000 ad views
• **Math Calculation:** (₹3,000 ÷ 200,000) × 1,000 = **₹15 CPM**

💡 **Summary:**
You pay Meta **₹15** every time 1,000 people see your ad in their feed!`,
    numericalExample: 'If spend is ₹6,000 and impressions are 150,000: (₹6,000 ÷ 150,000) × 1,000 = **₹40 CPM**.',
    mentorTip: 'High CPM (>₹150 in India or >$35 in US)? Widen your audience targeting or improve your creative engagement to score higher in Meta\'s ad auction!',
  },
  ctr: {
    name: 'CTR',
    fullName: 'Click-Through Rate',
    shortDef: 'The percentage of people who clicked your ad after seeing it.',
    formula: 'CTR = (Total Clicks ÷ Total Impressions) × 100%',
    breakdown: `📐 **The Formula:**
**CTR** = (Link Clicks ÷ Impressions) × 100%

🔢 **Step-by-Step Calculation:**
• **Total Impressions:** 50,000 views
• **Link Clicks:** 1,500 clicks
• **Math Calculation:** (1,500 ÷ 50,000) × 100% = **3.0% CTR**

📊 **Agency Benchmarks:**
• **Below 1.0%:** Weak hook (change the opening 3 seconds)
• **1.0% to 2.0%:** Average industry standard
• **Above 2.0%:** High-converting winner! 🚀`,
    numericalExample: '1,200 clicks out of 60,000 impressions = (1,200 ÷ 60,000) × 100% = **2.0% CTR**.',
    mentorTip: 'Test 3 different 3-second opening video hooks while keeping the rest of the ad identical to boost CTR fast.',
  },
  cpc: {
    name: 'CPC',
    fullName: 'Cost Per Click',
    shortDef: 'The exact amount you pay each time a prospect clicks on your ad link.',
    formula: 'CPC = Total Spend ÷ Total Link Clicks',
    breakdown: `📐 **The Formula:**
**CPC** = Total Spend ÷ Total Link Clicks

🔢 **Step-by-Step Calculation:**
• **Total Spend:** ₹4,000
• **Total Clicks:** 800 link clicks
• **Math Calculation:** ₹4,000 ÷ 800 = **₹5.00 per click**

💡 **Summary:**
You pay **₹5.00** each time an interested prospect taps your ad link!`,
    numericalExample: '₹2,500 spend with 500 clicks = ₹2,500 ÷ 500 = **₹5 per click**.',
    mentorTip: 'Higher CTR directly lowers your CPC because Meta rewards ads that users engage with!',
  },
  cpl: {
    name: 'CPL',
    fullName: 'Cost Per Lead',
    shortDef: 'The cost paid to acquire one verified prospective customer contact info (name, phone, email).',
    formula: 'CPL = Total Spend ÷ Total Verified Leads',
    breakdown: `📐 **The Formula:**
**CPL** = Total Spend ÷ Total Verified Leads

🔢 **Step-by-Step Calculation:**
• **Ad Spend:** ₹12,000 (Meta Lead Form)
• **Verified Leads:** 120 completed submissions
• **Calculation:** ₹12,000 ÷ 120 = **₹100 per lead**

💡 **Summary:**
Each new customer contact number costs **₹100** to generate!`,
    numericalExample: '₹15,000 budget generating 100 salon booking leads = ₹15,000 ÷ 100 = **₹150 CPL**.',
    mentorTip: 'Use Higher Intent instant forms with a confirmation slide to filter out fake numbers and junk leads!',
  },
};

/**
 * Detects the active marketing topic from the user's message or previous conversation turns.
 */
export function detectTopic(message: string, history: any[] = []): string | null {
  const historyText = Array.isArray(history)
    ? history
        .map((h: any) => {
          if (!h) return '';
          if (typeof h === 'string') return h;
          if (typeof h.text === 'string') return h.text;
          if (Array.isArray(h.parts) && h.parts[0]?.text) return h.parts[0].text;
          if (typeof h.content === 'string') return h.content;
          return '';
        })
        .join(' ')
    : '';

  const combined = (message + ' ' + historyText).toLowerCase();

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
 * Generates a deeply personalized, beautifully formatted answer for the learner.
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

${data.breakdown}

🔢 **Real-World Agency Example:**
${data.numericalExample}

💡 **Mentor Pro-Tip for ${learnerName}:**
${data.mentorTip}`;
    }

    return `Hey ${learnerName}! 🦊 **${data.name}** stands for **${data.fullName}**!

${data.shortDef}

${data.breakdown}

💡 **Quick Rule:** ${data.mentorTip}

Ask me if you want to calculate this with your specific campaign budget! 📈`;
  }

  // Generic request for numbers/formulas
  if (wantsNumbers) {
    return `Hey ${learnerName}! 🦊 Here are the 5 core performance advertising math formulas every media buyer must master:

📐 **Core Media Buying Math Cheat Sheet:**

• **1. CPR / CPA (Cost Per Result):**
  Total Spend ÷ Total Results

• **2. ROAS (Return On Ad Spend):**
  Total Sales Revenue ÷ Total Ad Spend

• **3. CTR (Click-Through Rate):**
  (Link Clicks ÷ Impressions) × 100%

• **4. CPM (Cost Per 1,000 Impressions):**
  (Total Spend ÷ Impressions) × 1,000

• **5. CPC (Cost Per Click):**
  Total Spend ÷ Total Link Clicks

Tell me which metric you want a deep step-by-step numerical calculation for, and I'll break down the math for you! 🧮`;
  }

  // General fallback
  return `Hey ${learnerName}! 🦊 In performance marketing, every campaign puzzle comes down to three measurable steps:

• **1. Attraction (CTR):** Are people clicking? *(Clicks ÷ Impressions × 100)*
• **2. Cost of Reach (CPM):** How much Meta charges per 1,000 views.
• **3. Conversion (CPR / CPL / ROAS):** Did they take the final action?

Ask me any specific metric, ad problem, or ask for a **number format** calculation, and I'll show you the exact math! 🚀`;
}
