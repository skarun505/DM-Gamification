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
  mentorTip: string;
}

export const METRIC_KNOWLEDGE_BASE: Record<string, MetricKnowledge> = {
  cpr: {
    name: 'CPR',
    fullName: 'Cost Per Result',
    shortDef: 'The average amount spent to achieve one primary campaign result (such as a lead, purchase, or sign-up).',
    formula: 'CPR = Total Ad Spend (₹) ÷ Total Results',
    breakdown: `📐 **The Formula:**
**CPR** = Total Ad Spend (₹) ÷ Total Results

🔢 **Step-by-Step Calculation:**
• **Total Ad Budget Spent:** ₹5,000
• **Desired Results (Leads):** 50 leads
• **Calculation:** ₹5,000 ÷ 50 = **₹100 per result**

💡 **Summary:**
You paid **₹100** for each qualified lead or result delivered!`,
    numericalExample: 'If your client spends ₹10,000 on Instagram and gets 200 appointment bookings, your CPR = ₹10,000 ÷ 200 = **₹50 per booking**.',
    mentorTip: 'If CPR is climbing, check your landing page conversion rate (CVR) and test 3 new ad creative hooks to lower acquisition cost!',
  },
  roas: {
    name: 'ROAS',
    fullName: 'Return On Ad Spend',
    shortDef: 'The revenue generated for every single rupee spent on advertising.',
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
  cpa: {
    name: 'CPA',
    fullName: 'Cost Per Acquisition (or Cost Per Action)',
    shortDef: 'The cost paid to acquire one paying customer or qualified client.',
    formula: 'CPA = Total Ad Spend ÷ Total Acquisitions',
    breakdown: `📐 **The Formula:**
**CPA** = Total Ad Spend ÷ Total Acquisitions

🔢 **Step-by-Step Calculation:**
• **Ad Spend:** ₹30,000
• **Completed Purchases:** 60 customers
• **Calculation:** ₹30,000 ÷ 60 = **₹500 per customer**

💡 **Summary:**
It costs you **₹500** in marketing to win one buying customer!`,
    numericalExample: '₹20,000 ad spend resulting in 40 course enrollments = ₹20,000 ÷ 40 = **₹500 CPA**.',
    mentorTip: 'Compare your CPA against your Customer Lifetime Value (LTV). If LTV is ₹2,000 and CPA is ₹500, you have a 4x profit engine!',
  },
  frequency: {
    name: 'Frequency',
    fullName: 'Ad Delivery Frequency',
    shortDef: 'The average number of times each unique person has seen your ad.',
    formula: 'Frequency = Total Impressions ÷ Total Unique Reach',
    breakdown: `📐 **The Formula:**
**Frequency** = Impressions ÷ Unique Reach

🔢 **Step-by-Step Calculation:**
• **Total Impressions:** 90,000
• **Unique People Reached:** 30,000
• **Calculation:** 90,000 ÷ 30,000 = **3.0 Frequency**

📊 **Action Thresholds:**
• **1.0 - 2.2:** Fresh audience, safe to scale
• **2.3 - 3.5:** Moderate saturation (monitor CPA)
• **Above 3.8:** Audience fatigue! Swap creatives or expand targeting.`,
    numericalExample: '50,000 impressions among 25,000 people gives 50,000 ÷ 25,000 = **2.0 Frequency**.',
    mentorTip: 'When frequency crosses 3.5 in prospecting campaigns, refresh your ad creative to prevent audience burn-out!',
  },
};

/**
 * Extracts plain text from any history turn representation.
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
 */
export function detectTopic(message: string, history: ConversationTurn[] = []): string | null {
  const combined = (message + ' ' + extractHistoryText(history)).toLowerCase();

  const keywords: [string, string[]][] = [
    ['cpr', ['cpr', 'cost per result', 'cost/result', 'result cost']],
    ['roas', ['roas', 'return on ad spend', 'revenue multiplier']],
    ['cpm', ['cpm', 'cost per mille', 'impressions cost', 'per thousand']],
    ['ctr', ['ctr', 'click through', 'click-through', 'clicks to impression']],
    ['cpc', ['cpc', 'cost per click', 'click cost']],
    ['cpl', ['cpl', 'cost per lead', 'lead cost']],
    ['cpa', ['cpa', 'cost per acquisition', 'cost per customer']],
    ['frequency', ['frequency', 'ad fatigue', 'creative fatigue', 'seen too many times']],
  ];

  for (const [key, terms] of keywords) {
    if (terms.some((term) => combined.includes(term))) {
      return key;
    }
  }

  return null;
}

/**
 * Intelligent, context-aware personalized response generator.
 * Provides deep ChatGPT/Claude-level answers for performance marketing queries
 * even when offline or when external AI endpoints are unavailable.
 */
export function generateExpertReply(
  message: string,
  learnerName: string = 'Deepana',
  history: ConversationTurn[] = []
): string {
  const lowerMsg = message.toLowerCase().trim();
  const pastText = extractHistoryText(history).toLowerCase();
  const combined = (lowerMsg + ' ' + pastText).toLowerCase();

  // 1. Identity & Name inquiries
  if (
    lowerMsg.includes('my name') ||
    lowerMsg.includes('my anme') ||
    lowerMsg.includes('who am i') ||
    lowerMsg.includes('what is my name')
  ) {
    return `Hey ${learnerName}! 🦊 Of course I know you! Your name is **${learnerName}**, and you're my dedicated performance marketer in training here on AdQuest! 🌟 What ad mission, campaign challenge, or formula should we conquer next?`;
  }

  if (
    lowerMsg.includes('who are you') ||
    lowerMsg.includes('what is pixie') ||
    lowerMsg.includes('tell me about yourself')
  ) {
    return `Hey ${learnerName}! 🦊 I am **Pixie**, your 1-on-1 personal AI media buying mentor. Think of me as your pocket senior agency strategist! I'm here 24/7 to:

• **Diagnose Campaign Problems:** Fix high CPMs, leaking funnels, or creative fatigue.
• **Break Down Numbers:** Explain ROAS, CPR, CPA, and media buying math step-by-step.
• **Plan Strategy:** Pick between CBO vs ABO, Broad vs Lookalikes, and optimize ad sets.
• **Prepare You for Clients:** Guide you on client pitches, audits, and interviews!

What's on your mind right now?`;
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
    return `Hey ${learnerName}! 🦊 Awesome to see you! Ready to dive into performance marketing today? 

Here are 3 high-impact things we can tackle together right now:
• **Test Campaign Math:** Type **"explain ROAS"** or **"calculate CPR"**.
• **Campaign Strategy:** Ask **"Broad vs Retargeting"** or **"CBO vs ABO"**.
• **Fix an Ad Problem:** Ask **"Why is my CPM high?"** or **"How to fix high CPL?"**.

What would you like to explore?`;
  }

  // 3. Gratitude & Motivation
  if (
    lowerMsg.includes('thank') ||
    lowerMsg.includes('thx') ||
    lowerMsg.includes('awesome') ||
    lowerMsg.includes('great job') ||
    lowerMsg.includes('love you')
  ) {
    return `You're so welcome, ${learnerName}! 🦊 You're putting in the work and learning the real skills that top media buyers use every day. Keep this momentum going! What would you like to practice next?`;
  }

  if (
    lowerMsg.includes('confused') ||
    lowerMsg.includes('hard') ||
    lowerMsg.includes('overwhelm') ||
    lowerMsg.includes('scared') ||
    lowerMsg.includes('struggling')
  ) {
    return `Take a breath, ${learnerName}! 🦊 Remember: every senior media buyer managing ₹10 Lakh/month ad accounts started right where you are today. Performance marketing looks like a wall of acronyms at first, but it is really just three simple levers:

• **The Hook:** Getting the thumb to stop scrolling (CTR).
• **The Offer:** Making something people actually want (CVR).
• **The Math:** Making sure revenue > ad spend (ROAS).

Tell me which part feels confusing right now, and I'll break it down with zero fluff!`;
  }

  // 4. Specific Marketing Topics & Strategy

  // A. Budgeting & How Much to Spend
  if (
    lowerMsg.includes('budget') ||
    lowerMsg.includes('how much to spend') ||
    lowerMsg.includes('small budget') ||
    lowerMsg.includes('scale budget') ||
    lowerMsg.includes('500') ||
    lowerMsg.includes('1000 rs')
  ) {
    return `Hey ${learnerName}! 🦊 Here is the exact **Media Buyer Budgeting Blueprint**:

💰 **1. For Testing New Ads (Daily Budget):**
• Start with **₹500 to ₹1,000 per day** in India (or $20 to $50/day in Tier-1 markets).
• Rule of Thumb: Your daily budget per ad set should be at least **3x to 5x your target CPA**. E.g., if you want leads at ₹100, set ₹300 - ₹500/day so Meta gets enough auction data.

📈 **2. The 70/20/10 Budget Rule:**
• **70% of Budget:** Put into your **Winning Proven Campaigns** (Scaling).
• **20% of Budget:** Put into **Testing New Creatives & Hooks** (Weekly).
• **10% of Budget:** Put into **High-Intent Retargeting** (Website & IG engagers).

🚀 **3. How to Scale Without Breaking the Algorithm:**
• Never double budget overnight! Increase winning ad set budgets by **15% to 20% every 48 hours** so Meta's auction optimization doesn't reset to learning phase.`;
  }

  // B. Creative Hooks & Copywriting
  if (
    lowerMsg.includes('hook') ||
    lowerMsg.includes('creative') ||
    lowerMsg.includes('3 second') ||
    lowerMsg.includes('video ad') ||
    lowerMsg.includes('ugc') ||
    lowerMsg.includes('copywriting')
  ) {
    return `Hey ${learnerName}! 🦊 In 2026, **Creative is your targeting**! If your hook is weak, nobody clicks. Here is the **Winning 3-Second Hook Formula**:

🎣 **3 Proven Hook Frameworks for Reels & Videos:**
• **1. The Negative Callout:** *"Stop wasting money on [Bad Habit] until you see this..."* (High CTR because human brains look for danger/mistakes).
• **2. The Curiosity Gap:** *"The #1 reason your Meta ads fail (and it's NOT your budget)..."*
• **3. The Direct Transformation:** *"How this Chennai salon booked 80 clients in 7 days without boosting posts."*

🎬 **Golden Production Rules:**
• **First 3 Seconds:** Fast movement, clear bold text overlay, clear spoken hook.
• **Resolution:** 9:16 vertical (1080x1920) for Reels/Stories, 4:5 for Feeds.
• **Always test 3 hooks:** Keep the body of the video identical, just swap the first 3 seconds!`;
  }

  // C. Targeting & Audiences (Broad vs Retargeting vs Lookalikes)
  if (
    lowerMsg.includes('broad') ||
    lowerMsg.includes('targeting') ||
    lowerMsg.includes('lookalike') ||
    lowerMsg.includes('custom audience') ||
    lowerMsg.includes('advantage+') ||
    lowerMsg.includes('interest')
  ) {
    return `Hey ${learnerName}! 🦊 Here is how modern media buyers structure **Targeting on Meta**:

🎯 **1. Broad Targeting (Top Recommendation):**
• Age: 21–55, Location: Your target cities/country, Interests: **Completely Empty (No interests)**.
• Meta's AI uses your creative hook to find the exact buyers. Broad targeting gives you the **cheapest CPM** and scales the best!

👥 **2. Advantage+ Audience:**
• Let Meta’s AI expand beyond your initial suggestions. Give Meta a "soft audience suggestion" (e.g., E-commerce / Fitness), and let the AI find converted buyers outside the box.

🔁 **3. Custom & Retargeting Audiences:**
• 30-day Instagram & Facebook page engagers.
• 180-day website visitors (tracked via Meta Pixel).
• Customer phone number/email list upload.

💡 **Rule:** Put 80% of your budget on Broad/Advantage+ prospecting, and 20% on warm retargeting!`;
  }

  // D. High CPM Diagnosis
  if (
    lowerMsg.includes('high cpm') ||
    lowerMsg.includes('cpm is high') ||
    lowerMsg.includes('why cpm') ||
    lowerMsg.includes('cpm high')
  ) {
    return `Hey ${learnerName}! 🦊 High CPM means Meta is charging you too much just to show your ad. Here is why it happens and how to fix it:

🔍 **Root Causes:**
• **Audience is too narrow:** Targeting a tiny niche (<100,000 people) makes ad auctions competitive.
• **Low Creative Engagement Score:** If people swipe past your ad in 1 second, Meta penalizes you with higher auction bids.
• **High Competition Seasons:** Diwali, Black Friday, or New Year will naturally hike CPMs by 30-50%.

🛠️ **Exact Steps to Drop Your CPM:**
• **Widen Targeting:** Switch to Broad targeting or expand geographic radius.
• **Test UGC / Native-looking creatives:** Ads that look like real organic Reels get higher watch time and lower CPMs!
• **Check Placements:** Make sure Advantage+ Placements (Automatic) is turned on so Meta can serve ads in cheaper spots like Stories and Audience Network.`;
  }

  // E. High CPL or Bad Lead Quality Diagnosis
  if (
    lowerMsg.includes('high cpl') ||
    lowerMsg.includes('lead quality') ||
    lowerMsg.includes('fake leads') ||
    lowerMsg.includes('cpl high') ||
    lowerMsg.includes('junk leads')
  ) {
    return `Hey ${learnerName}! 🦊 High CPL or bad leads is the #1 pain point for local businesses! Here is how agency pros fix it:

🚨 **If Leads are Cheap but FAKE / Not Picking Up:**
• In Meta Instant Forms, switch from **More Volume** to **Higher Intent**.
• Add a **Confirmation Review Slide** so people have to swipe to confirm before submitting.
• Add 1 **Custom Qualifying Question** (e.g., *"What is your budget for dental implants?"* with dropdown options). This stops accidental 1-tap submissions!

📉 **If CPL is Too Expensive (>₹250):**
• Your offer is boring! Change the headline from *"Contact us for a quote"* to a clear magnet: *"Claim Your 20% First-Time VIP Pass (Valid this week only)"*.
• Test WhatsApp Click-to-Chat ads instead of lead forms—in India, WhatsApp ads often convert at 40% lower cost!`;
  }

  // F. CBO vs ABO
  if (
    lowerMsg.includes('cbo') ||
    lowerMsg.includes('abo') ||
    lowerMsg.includes('campaign budget optimization') ||
    lowerMsg.includes('ad set budget')
  ) {
    return `Hey ${learnerName}! 🦊 Here is the simple distinction every media buyer must know:

⚖️ **ABO (Ad Set Budget Optimization):**
• **What it is:** You set the daily budget inside each individual Ad Set (e.g., ₹300 on Set A, ₹300 on Set B).
• **Best For:** **Testing Phase!** It guarantees that Meta spends equally on all tests so you know which creative wins.

🚀 **CBO (Advantage Campaign Budget):**
• **What it is:** You set one budget for the whole campaign (e.g., ₹2,000/day), and Meta's algorithm shifts money in real-time to whichever ad set is performing best today.
• **Best For:** **Scaling Phase!** Once you have 2–3 winning ad sets, combine them into 1 CBO campaign and let the AI maximize your conversions.`;
  }

  // G. Industry Playbooks: Real Estate, Salons, E-commerce
  if (
    lowerMsg.includes('real estate') ||
    lowerMsg.includes('property') ||
    lowerMsg.includes('builders') ||
    lowerMsg.includes('flat') ||
    lowerMsg.includes('apartment')
  ) {
    return `Hey ${learnerName}! 🦊 Here is the **Battle-Tested Real Estate Campaign Blueprint**:

🏢 **Real Estate Media Buying Setup:**
• **Objective:** Lead Generation (Instant Forms).
• **Targeting:** Pin code radius (5-10 km around the project) + Major IT corridors. Age: 28-55.
• **Form Setup:** Use **Higher Intent** with 2 custom questions:
  1. *"Are you looking for 2 BHK or 3 BHK?"*
  2. *"Expected move-in timeframe? (Immediate / Within 6 months / 1 year)"*
• **Creative Angle:** Walkthrough video tour of model flat with price starting point mentioned (e.g. *"2 BHK luxury homes starting ₹65 Lakhs"*). Mentioning price up-front eliminates unqualified leads!`;
  }

  if (
    lowerMsg.includes('salon') ||
    lowerMsg.includes('spa') ||
    lowerMsg.includes('beauty') ||
    lowerMsg.includes('parlour')
  ) {
    return `Hey ${learnerName}! 🦊 Here is the **Local Salon & Beauty Ad Blueprint**:

💇‍♀️ **Winning Salon Strategy:**
• **Campaign Objective:** Engagement -> **Click to WhatsApp** (Direct chat).
• **Radius:** 4 km to 7 km around the salon location. Women aged 20–48.
• **Irresistible Hook/Offer:** *"Hair Spa + Keratin + Blowdry Combo at ₹1,499 (Original ₹3,500) - Only 20 slots this weekend!"*
• **Creative:** Before-and-After Reels showing hair transformation or customer smile.
• **Follow-up:** Set an automated WhatsApp greeting with the appointment calendar link!`;
  }

  if (
    lowerMsg.includes('ecommerce') ||
    lowerMsg.includes('e-com') ||
    lowerMsg.includes('d2c') ||
    lowerMsg.includes('shopify') ||
    lowerMsg.includes('clothing')
  ) {
    return `Hey ${learnerName}! 🦊 Here is the **E-Commerce / D2C Scaling Framework**:

🛍️ **E-Commerce Media Buying Playbook:**
• **Campaign Type:** **Advantage+ Shopping Campaign (ASC)**.
• **Creative Mix:**
  • 1 UGC unboxing/review video (High trust).
  • 1 Dynamic Product Catalog Carousel (Shows products they viewed).
  • 1 Problem-Solution static image (Clear discount offer).
• **The Golden Rule:** Always ensure your **Break-Even ROAS** is calculated:
  Break-Even ROAS = 1 ÷ (Gross Margin %). If your margin is 50%, you need at least 2.0x ROAS to break even!`;
  }

  // H. Getting Clients & Freelancing
  if (
    lowerMsg.includes('client') ||
    lowerMsg.includes('freelance') ||
    lowerMsg.includes('agency') ||
    lowerMsg.includes('how to get') ||
    lowerMsg.includes('first job')
  ) {
    return `Hey ${learnerName}! 🦊 Here is how you win your first 3 paying performance marketing clients:

💼 **The 3-Step Client Acquisition Playbook:**
• **1. The Free Audit Strategy:** Pick 5 local businesses (dentists, gyms, boutique clothes) currently running ads. Find 2 mistakes (e.g. broken link, weak hook, no WhatsApp CTA). Send a 2-minute screen recording video showing how to fix it!
• **2. The Performance-Based Offer:** For your first client, propose: *"I will set up and manage your ads for 14 days. If I don't generate at least 20 verified leads, you pay me ₹0 in management fees."* (Zero risk for them, instant yes).
• **3. Retainer Pricing:** Once proven, charge **₹15,000 to ₹30,000/month flat retainer** + 10% of ad spend. 4 clients = ₹80,000+/month!`;
  }

  // 5. Check if user is asking for specific metric or numbers/math
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
    return `Hey ${learnerName}! 🦊 Here are the 5 core media buying math formulas you must master:

📐 **Performance Advertising Math Cheat Sheet:**

• **1. CPR / CPA (Cost Per Result):**
  Total Ad Spend ÷ Total Results

• **2. ROAS (Return On Ad Spend):**
  Total Sales Revenue ÷ Total Ad Spend

• **3. CTR (Click-Through Rate):**
  (Link Clicks ÷ Total Impressions) × 100%

• **4. CPM (Cost Per 1,000 Impressions):**
  (Total Ad Spend ÷ Total Impressions) × 1,000

• **5. CPC (Cost Per Click):**
  Total Ad Spend ÷ Total Link Clicks

Tell me which metric you want to calculate for your campaign, and I'll crunch the numbers with you! 🧮`;
  }

  // General intelligent fallback based on intent words
  return `Hey ${learnerName}! 🦊 Great question! In performance marketing, everything connects directly to your campaign funnel:

• **1. Upper Funnel (Awareness):** CPM & Impressions — How efficiently Meta shows your ad.
• **2. Middle Funnel (Interest):** CTR & Clicks — Did your 3-second hook stop the scroll?
• **3. Lower Funnel (Action):** CVR & CPA/ROAS — Did the landing page or lead form convert them into a paying customer?

Tell me more about what you're working on right now—are you setting up a new campaign, reviewing ad analytics, or preparing for a quiz question? Let's solve it! 🚀`;
}
