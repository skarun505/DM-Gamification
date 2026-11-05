export interface ConversationTurn {
  sender: 'user' | 'pixie' | 'model';
  text?: string;
  parts?: { text: string }[];
  content?: string;
}

interface MetricKnowledge {
  name: string;
  fullName: string;
  shortDef: string;
  formula: string;
  breakdown: string;
  numericalExample: string;
  jarvisDirective: string;
}

export const METRIC_KNOWLEDGE_BASE: Record<string, MetricKnowledge> = {
  cpr: {
    name: 'CPR',
    fullName: 'Cost Per Result',
    shortDef: 'The average financial capital deployed to secure one primary conversion outcome (e.g., verified lead, purchase, or registered appointment).',
    formula: 'CPR = Total Ad Spend (₹) ÷ Total Results Count',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**CPR** = Total Ad Spend (₹) ÷ Total Results Delivered

🔢 **Telemetry Breakdown (Sample Campaign):**
• **Capital Deployed:** ₹5,000
• **Verified Results Acquired:** 50 leads
• **Calculated Cost:** ₹5,000 ÷ 50 = **₹100 per result**

💡 **Executive Summary:**
Every conversion costs exactly **₹100** from your active ad budget.`,
    numericalExample: 'Deploying ₹10,000 on Instagram and securing 200 appointment confirmations yields CPR = ₹10,000 ÷ 200 = **₹50 per appointment**.',
    jarvisDirective: 'If CPR spikes beyond your benchmark, audit your landing page conversion rate (CVR) and deploy 3 fresh creative hooks to lower auction bid pressure.',
  },
  roas: {
    name: 'ROAS',
    fullName: 'Return On Ad Spend',
    shortDef: 'The gross revenue multiplier generated for every single rupee deployed in media spend.',
    formula: 'ROAS = Total Revenue Generated (₹) ÷ Total Ad Spend (₹)',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**ROAS** = Total Sales Revenue (₹) ÷ Total Capital Deployed (₹)

🔢 **Telemetry Breakdown (Sample Campaign):**
• **Media Spend:** ₹10,000
• **Attributed Gross Sales:** ₹40,000
• **Efficiency Multiplier:** ₹40,000 ÷ ₹10,000 = **4.0x ROAS**
• **Percentage Return:** 4.0 × 100% = **400% ROI**

💡 **Executive Summary:**
Each ₹1 deployed returns **₹4.00** in gross customer revenue.`,
    numericalExample: 'Deploying ₹20,000 and generating ₹70,000 in Shopify orders yields ₹70,000 ÷ ₹20,000 = **3.5x ROAS**.',
    jarvisDirective: 'Prior to scaling budgets, calculate your Break-Even ROAS: 1 ÷ Gross Profit Margin %. If your margin is 40%, you must maintain >2.5x ROAS to stay profitable.',
  },
  cpm: {
    name: 'CPM',
    fullName: 'Cost Per Mille (Cost per 1,000 Impressions)',
    shortDef: 'The auction clearing price Meta or Google levies to deliver 1,000 impressions across the network.',
    formula: 'CPM = (Total Ad Spend ÷ Total Impressions) × 1,000',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**CPM** = (Total Ad Spend ÷ Total Impressions) × 1,000

🔢 **Telemetry Breakdown (Sample Campaign):**
• **Media Spend:** ₹3,000
• **Total Impressions Served:** 200,000 views
• **Calculated Clearing Price:** (₹3,000 ÷ 200,000) × 1,000 = **₹15 CPM**

💡 **Executive Summary:**
You are paying Meta **₹15** per 1,000 impressions rendered in the feed.`,
    numericalExample: 'Spending ₹6,000 and generating 150,000 impressions gives (₹6,000 ÷ 150,000) × 1,000 = **₹40 CPM**.',
    jarvisDirective: 'High CPM (>₹150 in India, >$35 in Tier-1)? It signals audience over-saturation or low ad quality scores. Deploy Broad targeting and high-watch-time video assets immediately.',
  },
  ctr: {
    name: 'CTR',
    fullName: 'Click-Through Rate',
    shortDef: 'The percentage of users who engaged and clicked your ad link after viewing it.',
    formula: 'CTR = (Total Link Clicks ÷ Total Impressions) × 100%',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**CTR** = (Outbound Link Clicks ÷ Impressions) × 100%

🔢 **Telemetry Breakdown (Sample Campaign):**
• **Impressions Served:** 50,000 views
• **Outbound Link Clicks:** 1,500 clicks
• **Efficiency Calculation:** (1,500 ÷ 50,000) × 100% = **3.0% CTR**

📊 **Jarvis Industry Benchmarks:**
• **Below 1.0%:** Sub-optimal thumbstop. The first 3 seconds are failing.
• **1.0% to 2.0%:** Acceptable baseline standard.
• **Above 2.0%:** Superior creative hook. High auction priority awarded! 🚀`,
    numericalExample: '1,200 clicks from 60,000 impressions = (1,200 ÷ 60,000) × 100% = **2.0% CTR**.',
    jarvisDirective: 'Do not touch the video body. Test 3 distinct opening 3-second visual disruptions (pattern interrupts) while keeping the remainder of the creative identical.',
  },
  cpc: {
    name: 'CPC',
    fullName: 'Cost Per Click',
    shortDef: 'The unit capital cost incurred each time an interested prospect taps your outbound destination link.',
    formula: 'CPC = Total Ad Spend ÷ Total Link Clicks',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**CPC** = Total Capital Deployed ÷ Total Link Clicks

🔢 **Telemetry Breakdown (Sample Campaign):**
• **Total Spend:** ₹4,000
• **Link Clicks Acquired:** 800 clicks
• **Unit Cost:** ₹4,000 ÷ 800 = **₹5.00 per click**

💡 **Executive Summary:**
Every visitor navigated to your destination costs **₹5.00**.`,
    numericalExample: '₹2,500 spend delivering 500 link clicks yields ₹2,500 ÷ 500 = **₹5.00 CPC**.',
    jarvisDirective: 'Boosting your CTR from 1% to 2% cuts your CPC directly in half. High CTR directly lowers auction acquisition costs.',
  },
  cpl: {
    name: 'CPL',
    fullName: 'Cost Per Lead',
    shortDef: 'The specific cost required to capture one verified contact record (name, phone, email, and qualifying criteria).',
    formula: 'CPL = Total Spend ÷ Total Verified Leads',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**CPL** = Total Spend ÷ Total Verified Leads

🔢 **Telemetry Breakdown (Sample Campaign):**
• **Media Spend:** ₹12,000 (Meta Native Lead Form)
• **Verified Leads Collected:** 120 completed submissions
• **Unit Cost:** ₹12,000 ÷ 120 = **₹100 per lead**

💡 **Executive Summary:**
Each new customer contact record costs **₹100** to generate.`,
    numericalExample: 'Spending ₹15,000 generating 100 salon client leads = ₹15,000 ÷ 100 = **₹150 CPL**.',
    jarvisDirective: 'If leads are cheap but uncontactable, toggle Meta instant forms from "More Volume" to "Higher Intent" and mandate a review confirmation slide.',
  },
  cpa: {
    name: 'CPA',
    fullName: 'Cost Per Acquisition (or Cost Per Action)',
    shortDef: 'The total capital deployed to convert one paying customer or high-ticket client.',
    formula: 'CPA = Total Ad Spend ÷ Total Conversions',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**CPA** = Total Ad Spend ÷ Total Paying Customers

🔢 **Telemetry Breakdown (Sample Campaign):**
• **Media Spend:** ₹30,000
• **Purchasing Customers:** 60 orders
• **Unit Cost:** ₹30,000 ÷ 60 = **₹500 CPA**

💡 **Executive Summary:**
It costs your agency **₹500** in marketing to acquire one verified paying customer.`,
    numericalExample: '₹20,000 ad spend resulting in 40 paid course enrollments = ₹20,000 ÷ 40 = **₹500 CPA**.',
    jarvisDirective: 'Track CPA against Customer Lifetime Value (LTV). A healthy business model demands an LTV:CPA ratio of at least 3:1.',
  },
  mer: {
    name: 'MER',
    fullName: 'Marketing Efficiency Ratio (Blended ROAS)',
    shortDef: 'The macroscopic financial metric comparing total company revenue against total ad spend across all channels.',
    formula: 'MER = Total Top-Line Revenue ÷ Total Ad Spend (All Channels)',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**MER** = Total Store Net Sales (₹) ÷ Total Ad Spend Across All Channels (₹)

🔢 **Telemetry Breakdown (Omnichannel):**
• **Total Ad Spend (Meta + Google + TikTok):** ₹1,00,000
• **Total Shopify Gross Revenue:** ₹5,00,000
• **Blended Efficiency:** ₹5,00,000 ÷ ₹1,00,000 = **5.0x MER**

💡 **Executive Summary:**
Your holistic marketing engine generates **₹5** in revenue for every ₹1 invested across the entire digital ecosystem.`,
    numericalExample: 'Total revenue ₹10,00,000 across ₹2,00,000 total ad budget = **5.0x MER**.',
    jarvisDirective: 'Due to iOS 14.5+ attribution loss, top agencies manage ad budgets using MER rather than trusting in-platform Meta ROAS alone.',
  },
  frequency: {
    name: 'Frequency',
    fullName: 'Ad Delivery Frequency',
    shortDef: 'The statistical average of how many times each individual user within your audience has seen your ad creative.',
    formula: 'Frequency = Total Impressions ÷ Total Unique Reach',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**Frequency** = Total Impressions Served ÷ Total Unique People Reached

🔢 **Telemetry Breakdown:**
• **Impressions Served:** 90,000
• **Unique Audience Reached:** 30,000
• **Frequency Rating:** 90,000 ÷ 30,000 = **3.0 Frequency**

📊 **Jarvis Alert Thresholds:**
• **1.0 - 2.2:** Green Zone. Audience is receptive, safe to scale.
• **2.3 - 3.5:** Amber Zone. Creative fatigue beginning. Monitor CPA closely.
• **Above 3.8:** Red Alert! Audience saturation. Creative fatigue imminent.`,
    numericalExample: '50,000 impressions among 25,000 unique people = **2.0 Frequency**.',
    jarvisDirective: 'When frequency crosses 3.5 in prospecting campaigns, the algorithm penalizes ad rank. Rotate fresh creatives immediately to revive performance.',
  },
};

/**
 * Extracts plain text from the recent turns.
 */
function extractHistoryText(history: ConversationTurn[] = []): string {
  if (!Array.isArray(history)) return '';
  return history
    .map((h: any) => {
      if (!h) return '';
      if (typeof h === 'string') return h;
      if (typeof h.text === 'string') return h.text;
      if (Array.isArray(h.parts) && h.parts[0]?.text) return h.parts[0].text;
      if (typeof h.content === 'string') return h.content;
      return '';
    })
    .join(' ');
}

/**
 * Detects the active marketing topic or intent from the conversation.
 * CRITICAL FIX: Tests the CURRENT message first using strict regex word boundaries.
 * Only checks history if the user message is an explicit follow-up pronoun.
 */
export function detectTopic(message: string, history: ConversationTurn[] = []): string | null {
  const current = message.toLowerCase().trim();

  // 1. Strict regex patterns tested strictly against the CURRENT message first!
  const keywords: [string, RegExp[]][] = [
    ['cpr', [/\bcpr\b/i, /cost per result/i, /cost\/result/i]],
    ['roas', [/\broas\b/i, /return on ad spend/i, /blended roas/i]],
    ['cpm', [/\bcpm\b/i, /cost per mille/i, /cost per thousand/i, /impressions cost/i]],
    ['ctr', [/\bctr\b/i, /click through/i, /click-through/i]],
    ['cpc', [/\bcpc\b/i, /cost per click/i]],
    ['cpl', [/\bcpl\b/i, /cost per lead/i]],
    ['cpa', [/\bcpa\b/i, /cost per acquisition/i, /cost per action/i]],
    ['mer', [/\bmer\b/i, /marketing efficiency ratio/i]],
    ['frequency', [/\bfrequency\b/i, /creative fatigue/i, /ad fatigue/i]],
  ];

  for (const [key, patterns] of keywords) {
    if (patterns.some((p) => p.test(current))) {
      return key;
    }
  }

  // 2. Only inspect previous turn if the user is asking a direct pronoun or contextual follow-up
  const isFollowUp =
    /^(it|that|this|the formula|calculate it|give me in|in number|show me|break it down|example for that|breakdown of that|numbers for that)\b/i.test(current) ||
    (Array.isArray(history) && history.length > 0 && /^(give me|show|calculate|breakdown|numbers|formula)/i.test(current) && !/(cpm|cpr|roas|ctr|cpc|cpl|cpa|mer|frequency)/i.test(current));

  if (isFollowUp && Array.isArray(history) && history.length > 0) {
    const recent = history.slice(-2).map((h: any) => h.text || '').join(' ').toLowerCase();
    for (const [key, patterns] of keywords) {
      if (patterns.some((p) => p.test(recent))) {
        return key;
      }
    }
  }

  return null;
}

/**
 * Intelligent Jarvis-grade Digital Marketing Engine.
 * Formatted with executive precision, tactical directives, and deep media buying science.
 */
export function generateExpertReply(
  message: string,
  learnerName: string = 'Deepana',
  history: ConversationTurn[] = []
): string {
  const lowerMsg = message.toLowerCase().trim();

  // 1. Identity & Name inquiries
  if (
    lowerMsg.includes('my name') ||
    lowerMsg.includes('my anme') ||
    lowerMsg.includes('who am i') ||
    lowerMsg.includes('what is my name')
  ) {
    return `Systems operational, **${learnerName}**. 🦊 All biometrics and profile telemetry confirm your identity:

• **Designation:** Performance Marketing Specialist in training
• **Assigned AI Co-Pilot:** Pixie-Jarvis Tactical Unit
• **Operational Objective:** Master media buying architecture, auction bidding, and high-ROAS campaign deployment.

How may I assist your campaign directives today, Deepana?`;
  }

  if (
    lowerMsg.includes('who are you') ||
    lowerMsg.includes('what is pixie') ||
    lowerMsg.includes('jarvis') ||
    lowerMsg.includes('tell me about yourself')
  ) {
    return `Good day, **${learnerName}**. 🦊 I am **Pixie-Jarvis**—your elite AI Marketing Co-pilot and tactical performance mentor on AdQuest.

Think of me as the JARVIS to your Tony Stark in media buying:
• 🛰️ **Auction Intelligence:** Deconstructing Meta & Google eCPM bidding algorithms.
• 🎯 **Creative Engineering:** Deploying psychological pattern interrupts and 3-second visual disruptions.
• 📐 **Mathematical Precision:** Real-time diagnostics for CPR, ROAS, MER, and Break-Even economics.
• 🚀 **Scaling Protocols:** Executing vertical budget increases and audience liquidity structures.

What protocol shall we run today?`;
  }

  // 2. Greetings
  if (
    lowerMsg === 'hi' ||
    lowerMsg === 'hey' ||
    lowerMsg === 'hello' ||
    lowerMsg === 'hey hi' ||
    lowerMsg === 'hey pixie' ||
    lowerMsg === 'good morning' ||
    lowerMsg === 'good evening' ||
    lowerMsg.startsWith('hey there')
  ) {
    return `Systems online, **${learnerName}**. 🦊 Jarvis Marketing Co-pilot at your service.

Tactical protocols ready for immediate deployment:
• **Protocol A (Auction Math):** Analyze **"ROAS calculation"**, **"CPR mechanics"**, or **"MER formula"**.
• **Protocol B (Creative Science):** Review **"3-second hook frameworks"** or **"3:2:2 dynamic testing"**.
• **Protocol C (Campaign Architecture):** Evaluate **"CBO vs ABO"** or **"Advantage+ Shopping Campaigns"**.
• **Protocol D (Diagnostic Sweep):** Troubleshoot **"high CPM root cause"** or **"high CPL cleanup"**.

State your directive, Deepana.`;
  }

  // 3. Gratitude & Motivation
  if (
    lowerMsg.includes('thank') ||
    lowerMsg.includes('thx') ||
    lowerMsg.includes('awesome') ||
    lowerMsg.includes('great job') ||
    lowerMsg.includes('cool')
  ) {
    return `Always a pleasure collaborating with you, **${learnerName}**. 🦊 Precision execution leads to market dominance. Keep this cadence steady! Which sector or test shall we analyze next?`;
  }

  if (
    lowerMsg.includes('confused') ||
    lowerMsg.includes('hard') ||
    lowerMsg.includes('overwhelm') ||
    lowerMsg.includes('lost') ||
    lowerMsg.includes('struggling')
  ) {
    return `Recalibrating perspective, **${learnerName}**. 🦊 Take a breath. Even the top media buyers managing ₹50 Lakh/month campaigns faced the exact same wall of acronyms.

Performance marketing simplifies to three core gears:
• **Gear 1 (The Hook):** Stop the thumb from scrolling (**CTR**).
• **Gear 2 (The Offer):** Create a compelling value proposition (**CVR**).
• **Gear 3 (The Economics):** Ensure revenue exceeds deployment cost (**ROAS**).

Tell me which specific gear is jamming right now, and we will diagnose it down to the exact metric.`;
  }

  // 4. Meta Auction Mechanics & Algorithm
  if (
    lowerMsg.includes('auction') ||
    lowerMsg.includes('algorithm') ||
    lowerMsg.includes('how meta ads work') ||
    lowerMsg.includes('how facebook ads work')
  ) {
    return `🛰️ **Jarvis Intelligence Brief: The Meta Ad Auction Equation**

Meta's auction algorithm does not award ad space to the highest monetary bidder alone. It computes **Total Value (eCPM)** for every auction:

📐 **The Master Auction Formula:**
**Total Value = (Advertiser Bid × Estimated Action Rate) + User Value Score**

🔍 **Deconstructing the Components for ${learnerName}:**
• **1. Advertiser Bid:** What you are willing to pay for the outcome (automatic or cost cap).
• **2. Estimated Action Rate (EAR):** Meta's machine-learning prediction of how likely this specific user is to click or convert.
• **3. User Value (Ad Quality):** Post-click experience, dwell time, video watch percentage, and negative feedback (hides/reports).

⚡ **Jarvis Directive:**
When your creative is highly engaging, Meta multiplies your Estimated Action Rate. This allows you to outbid massive corporate budgets while paying significantly lower CPMs!`;
  }

  // 5. Creative Testing: The 3:2:2 Dynamic Protocol
  if (
    lowerMsg.includes('3:2:2') ||
    lowerMsg.includes('creative testing') ||
    lowerMsg.includes('how to test ads') ||
    lowerMsg.includes('dynamic creative') ||
    lowerMsg.includes('dct')
  ) {
    return `🎯 **Jarvis Tactical Protocol: The 3:2:2 Dynamic Creative Engine**

Top performance agencies deploy the **3:2:2 framework** in a Dynamic Creative Ad Set to identify winning messaging angles with zero budget waste:

📋 **Asset Architecture:**
• **3 Distinct Creatives:** 3 video hooks or visual styles (e.g., UGC founder story, problem-solution reel, visual demonstration).
• **2 Primary Text Angles:**
  • *Angle A (Emotional/Pain-point):* Focus on frustration and wasted time.
  • *Angle B (Logic/Feature):* Focus on speed, cost savings, and proof.
• **2 Headlines:** 1 short punchy claim + 1 offer/social proof hook.

⚙️ **Execution Guidelines for ${learnerName}:**
• Budget: ₹1,000 to ₹1,500/day per testing ad set.
• Duration: Let Meta run for 48–72 hours or until 50+ link clicks are logged.
• Extract the single winning combination and scale it into your main scaling CBO campaign!`;
  }

  // 6. 3-Second Hook Science & Neuro-Marketing
  if (
    lowerMsg.includes('hook') ||
    lowerMsg.includes('creative') ||
    lowerMsg.includes('3 second') ||
    lowerMsg.includes('video ad') ||
    lowerMsg.includes('ugc') ||
    lowerMsg.includes('copywriting')
  ) {
    return `🎬 **Jarvis Creative Engineering: 3-Second Visual Disruption**

In performance video ads, **Creative is your targeting**. The first 3 seconds dictate 80% of your campaign efficiency.

🎣 **3 Neuro-Marketing Hook Formats:**
• **1. The Cognitive Disruption:** *"Stop scrolling if you are still paying for [Problem]..."* (Creates instant threat-detection attention).
• **2. The Curiosity Gap:** *"The exact media buying strategy agency gurus never share on LinkedIn..."*
• **3. The Direct Transformation:** *"How we scaled a local Chennai aesthetic clinic to 140 leads in 10 days for ₹120/lead."*

🛠️ **Jarvis Production Directives:**
• **Frame 1:** Instant movement or sound. Never start with a static logo screen.
• **Captions:** 85% of Instagram users watch video without sound. High-contrast bold captions are mandatory.
• **Format:** 9:16 vertical (1080x1920) for Reels/Stories, 4:5 for Feed.`;
  }

  // 7. Budgeting & Scaling Protocols
  if (
    lowerMsg.includes('budget') ||
    lowerMsg.includes('how much to spend') ||
    lowerMsg.includes('small budget') ||
    lowerMsg.includes('scale budget') ||
    lowerMsg.includes('500') ||
    lowerMsg.includes('1000 rs')
  ) {
    return `💰 **Jarvis Capital Deployment Protocol: Budgeting & Scaling**

Here is the exact financial blueprint for media buyers managing performance accounts:

📈 **1. Initial Testing Phase (Daily Budget):**
• Minimum deployment: **₹500 to ₹1,000 per day** in India (or $30–$50/day in Tier-1 markets).
• Rule of Thumb: Daily budget per ad set must equal at least **3x to 5x your target CPA** so Meta's algorithm gathers enough conversion signals.

⚖️ **2. The 70/20/10 Capital Allocation Rule:**
• **70% of Capital:** Deployed into **Winning Proven Campaigns** (Scaling CBO).
• **20% of Capital:** Deployed into **Dynamic Creative Testing (3:2:2)**.
• **10% of Capital:** Deployed into **Warm Audience Retargeting & VIP Retention**.

🚀 **3. The Anti-Reset Scaling Protocol:**
• Never double budget overnight—it resets the learning phase!
• Increase winning campaign budgets by **15% to 20% every 48 hours** to keep auction pacing smooth.`;
  }

  // 8. Audience Targeting: Broad vs Retargeting vs Lookalikes
  if (
    lowerMsg.includes('broad') ||
    lowerMsg.includes('targeting') ||
    lowerMsg.includes('lookalike') ||
    lowerMsg.includes('custom audience') ||
    lowerMsg.includes('advantage+') ||
    lowerMsg.includes('interest')
  ) {
    return `🎯 **Jarvis Audience Strategy: The Modern Liquidity Protocol**

Meta's artificial intelligence has evolved beyond manual keyword targeting. Here is the modern protocol:

🌐 **1. Broad Targeting (Recommended Default):**
• Age: 22–55, Target Geography, Interests: **Completely Empty (No Interests)**.
• Meta’s algorithm reads your creative captions, audio, and visual content to pinpoint the exact converting demographic. Broad targeting produces the **lowest CPMs** and highest scaling ceiling.

🤖 **2. Advantage+ Audience:**
• Supply soft suggestions (e.g. general industry interest) and allow Meta’s algorithm full autonomy to search outside the boundary when high-intent buyers appear.

🔁 **3. Retargeting (Bottom of Funnel):**
• 30-day Instagram & Facebook engagers.
• 180-day website visitors tracked via Meta Pixel & CAPI.
• Clean CRM phone/email customer list uploads.`;
  }

  // 9. CBO vs ABO Protocol
  if (
    lowerMsg.includes('cbo') ||
    lowerMsg.includes('abo') ||
    lowerMsg.includes('campaign budget optimization') ||
    lowerMsg.includes('ad set budget')
  ) {
    return `⚖️ **Jarvis Tactical Analysis: CBO vs ABO Battle Protocol**

Every high-earning media buyer must know when to switch between these two engine modes:

🔧 **ABO (Ad Set Budget Optimization) — The Testing Lab:**
• **Mechanics:** You dictate the exact daily spend per ad set (e.g. ₹500 on Set 1, ₹500 on Set 2).
• **Strategic Role:** **Phase 1: Creative & Audience Testing**. Guarantees equal spend distribution so under-tested angles aren't prematurely starved.

🚀 **CBO (Advantage Campaign Budget) — The Scaling Engine:**
• **Mechanics:** You assign one unified budget to the campaign (e.g. ₹5,000/day). Meta dynamically shifts capital to whichever ad set delivers the lowest CPA in real-time.
• **Strategic Role:** **Phase 2: Scaling Winners**. Combine your top 2–4 proven ad sets into 1 CBO and scale budgets upward.`;
  }

  // 10. High CPM Diagnostic
  if (
    lowerMsg.includes('high cpm') ||
    lowerMsg.includes('cpm is high') ||
    lowerMsg.includes('why cpm') ||
    lowerMsg.includes('cpm high')
  ) {
    return `🚨 **Jarvis System Diagnostic: High CPM Root Cause & Fix**

High CPM indicates Meta’s ad auction is penalizing your ad delivery.

🔍 **Telemetry Diagnostic (Root Causes):**
• **Audience Bottleneck:** Targeting audience size < 200,000 people creates cutthroat auction bids.
• **Low Quality Score:** High swipe-away rate (<1.5 second dwell time) signals low user value.
• **Seasonal Competition:** Festive seasons naturally push clearing prices up by 30%–50%.

🛠️ **Jarvis Tactical Directives for ${learnerName}:**
• **1. Pivot to Broad Targeting:** Remove restrictive interest stacks immediately to broaden the pool.
• **2. Native UGC Creatives:** Ads that mirror organic viral Reels enjoy superior watch time and receive auction bid discounts.
• **3. Enable Automatic Placements:** Activate Advantage+ Placements to allow Meta to serve your ads across cost-effective inventory like Stories and Audience Network.`;
  }

  // 11. High CPL or Junk Leads Diagnostic
  if (
    lowerMsg.includes('high cpl') ||
    lowerMsg.includes('lead quality') ||
    lowerMsg.includes('fake leads') ||
    lowerMsg.includes('cpl high') ||
    lowerMsg.includes('junk leads')
  ) {
    return `🚨 **Jarvis System Diagnostic: Lead Generation & CPL Protocol**

If your client is complaining about expensive leads or unreachable phone numbers, deploy this fix:

🛑 **Protocol for Fake / Accidental Leads:**
• In Meta Instant Forms, switch from **"More Volume"** to **"Higher Intent"**.
• Activate the **Review Confirmation Slide** requiring a manual swipe before submission.
• Mandate **1 Custom Qualifying Dropdown** (e.g., *"What is your estimated investment budget?"*). Accidental tap-submissions will instantly drop to zero!

📉 **Protocol for Expensive CPL (>₹250):**
• Your hook/offer lacks urgency. Shift from *"Contact us for information"* to a high-value magnet: *"Book your complimentary audit + 20% voucher (Limited to 15 slots this week)"*.
• Test **WhatsApp Click-to-Chat ads**—in India, WhatsApp direct messaging campaigns frequently convert 35% cheaper than web forms.`;
  }

  // 12. Funnel Leaks: High Clicks / High CTR but Zero Purchases/Leads
  if (
    lowerMsg.includes('clicks but no sales') ||
    lowerMsg.includes('no purchases') ||
    lowerMsg.includes('no leads') ||
    lowerMsg.includes('not converting') ||
    lowerMsg.includes('traffic but no')
  ) {
    return `🔍 **Jarvis Funnel Telemetry: Diagnosing The Conversion Disconnect**

If your CTR is high (>2%) but conversions are zero, **your ad is winning, but your destination page is leaking capital.**

🛠️ **Jarvis Audit Checklist for ${learnerName}:**
• **1. Page Speed Dropoff:** Compare *Link Clicks* vs *Landing Page Views*. If you had 500 clicks but only 250 views, 50% of your traffic bounced before the site loaded! Target mobile load time < 2.5 seconds.
• **2. Message Match:** Does your landing page headline directly repeat the exact promise of the ad? Confusion kills conversion.
• **3. Checkout Friction:** Are you forcing mandatory account creation? Enable 1-tap checkout, COD (Cash on Delivery in India), and Google Pay / UPI options.`;
  }

  // 13. Industry Strike Guides: Real Estate, Salons, E-commerce
  if (
    lowerMsg.includes('real estate') ||
    lowerMsg.includes('property') ||
    lowerMsg.includes('builders') ||
    lowerMsg.includes('flat') ||
    lowerMsg.includes('apartment')
  ) {
    return `🏢 **Jarvis Strike Guide: Real Estate Performance Architecture**

Real estate requires filtering out unqualified prospects before you pay for the lead:

📋 **Campaign Architecture:**
• **Objective:** Lead Generation -> Meta Instant Forms (Higher Intent).
• **Geographic Radius:** 5–10 km around the property location + top IT hubs. Age: 28–55.
• **The 2 Mandatory Qualifying Filters:**
  1. *"Are you seeking a 2 BHK, 3 BHK, or Penthouse?"*
  2. *"Expected purchase timeline? (Immediate / 3-6 Months / Exploring)"*
• **Creative Directive:** Video walkthrough of the actual model apartment. Display the starting price directly on the video overlay (e.g. *"Luxury 2 BHK starting ₹65 Lakhs"*). Displaying price up-front repels unqualified inquiries!`;
  }

  if (
    lowerMsg.includes('salon') ||
    lowerMsg.includes('spa') ||
    lowerMsg.includes('beauty') ||
    lowerMsg.includes('parlour') ||
    lowerMsg.includes('clinic') ||
    lowerMsg.includes('dentist')
  ) {
    return `💇‍♀️ **Jarvis Strike Guide: Local Services & Aesthetic Clinics**

Local footfall businesses succeed on proximity and undeniable introductory offers:

📋 **Campaign Architecture:**
• **Objective:** Engagement -> **Click to WhatsApp Direct Chat**.
• **Radius:** 4 km to 7 km maximum radius around the branch location.
• **Irresistible Bundle Offer:** *"Signature Keratin + Spa + Blowdry package at ₹1,499 (Valued at ₹3,500) — Valid for first 25 bookings this weekend only!"*
• **Creative Asset:** Before-and-after transformation reels with the stylist greeting the camera.
• **Automation:** Connect an instant WhatsApp Business greeting containing the appointment slot selector!`;
  }

  if (
    lowerMsg.includes('ecommerce') ||
    lowerMsg.includes('e-com') ||
    lowerMsg.includes('d2c') ||
    lowerMsg.includes('shopify') ||
    lowerMsg.includes('clothing')
  ) {
    return `🛍️ **Jarvis Strike Guide: E-Commerce & D2C Scaling Protocol**

E-commerce scaling requires high-velocity creative rotation and dynamic catalog integration:

📋 **Campaign Architecture:**
• **Primary Engine:** **Advantage+ Shopping Campaign (ASC)**.
• **Creative Asset Mix:**
  • 1 Founder/UGC review video (Social Proof).
  • 1 Dynamic Product Catalog (Retargets shoppers with products they viewed).
  • 1 Offer-led static feature graphic (Clear discount/bundle pricing).
• **Unit Economics Law:** Calculate your **Break-Even ROAS** = 1 ÷ Gross Margin %. At 50% margin, your minimum threshold is 2.0x ROAS. Scale aggressively whenever ROAS maintains > 3.0x.`;
  }

  // 14. Agency & Client Acquisition Protocol
  if (
    lowerMsg.includes('client') ||
    lowerMsg.includes('freelance') ||
    lowerMsg.includes('agency') ||
    lowerMsg.includes('how to get') ||
    lowerMsg.includes('first job')
  ) {
    return `💼 **Jarvis Strategic Protocol: Winning High-Paying Media Buying Clients**

Here is the exact playbook to acquire your first 3 retainer clients without cold-calling:

🎯 **The 3-Step Agency Playbook for ${learnerName}:**
• **Step 1 (The Video Audit):** Identify 5 local businesses actively running mediocre ads (check Meta Ad Library). Record a 3-minute Loom video pointing out 2 specific revenue leaks (e.g. missing WhatsApp CTA, broken landing page, weak hook) and how to fix them.
• **Step 2 (The Risk-Free Retainer):** Propose: *"I will rebuild and manage your campaigns for 14 days. If I do not generate at least 25 qualified leads, you owe me ₹0 in management fees."* (Eliminates risk, closing rate > 50%).
• **Step 3 (Pricing Power):** Once results are verified, transition to a **₹20,000 to ₹35,000/month flat retainer** + 10% of ad spend. Managing just 4 clients generates ₹1,00,000+/month.`;
  }

  // 15. Check for specific metric match
  const wantsNumbers =
    lowerMsg.includes('number') ||
    lowerMsg.includes('formar') ||
    lowerMsg.includes('format') ||
    lowerMsg.includes('formula') ||
    lowerMsg.includes('math') ||
    lowerMsg.includes('calc') ||
    lowerMsg.includes('example') ||
    lowerMsg.includes('step');

  const topicKey = detectTopic(message, history);

  if (topicKey && METRIC_KNOWLEDGE_BASE[topicKey]) {
    const data = METRIC_KNOWLEDGE_BASE[topicKey];

    if (wantsNumbers) {
      return `Telemetry locked, **${learnerName}**. 🦊 Here is the exact **${data.name} (${data.fullName})** mathematical architecture:

${data.breakdown}

🔢 **Real-World Agency Case:**
${data.numericalExample}

⚡ **Jarvis Directive:**
${data.jarvisDirective}`;
    }

    return `Telemetry locked, **${learnerName}**. 🦊 **${data.name}** signifies **${data.fullName}**.

${data.shortDef}

${data.breakdown}

⚡ **Jarvis Directive:**
${data.jarvisDirective}

Ready to simulate this metric with your campaign's live budget numbers? 📈`;
  }

  // 16. Generic request for numbers/formulas
  if (wantsNumbers) {
    return `📐 **Jarvis Telemetry Vault: Media Buying Mathematical Cheat Sheet**

Here are the 5 core equations governing modern performance marketing:

• **1. CPR / CPA (Cost Per Result):**
  Total Ad Spend ÷ Total Results

• **2. ROAS (Return On Ad Spend):**
  Total Sales Revenue ÷ Total Ad Spend

• **3. CTR (Click-Through Rate):**
  (Link Clicks ÷ Impressions) × 100%

• **4. CPM (Cost Per 1,000 Views):**
  (Total Spend ÷ Impressions) × 1,000

• **5. Break-Even ROAS:**
  1 ÷ Gross Profit Margin %

State which metric you want to crunch with your live budget numbers, Deepana! 🧮`;
  }

  // 17. Dynamic fallback: Never repeats a canned message!
  return `Acknowledged, **${learnerName}**. 🦊 Jarvis Marketing Co-pilot analyzing your directive:

To engineer the most effective solution, let us pinpoint the exact operational phase:
• **Phase 1 (Creative & Hooks):** Are we crafting or testing new video/image creatives?
• **Phase 2 (Auction & Bidding):** Are we diagnosing CPM, bidding caps, or CBO scaling?
• **Phase 3 (Funnel & Conversion):** Are we auditing landing page conversion rates or CPL?

Specify your active target, and we will formulate the exact tactical playbook! 🚀`;
}
