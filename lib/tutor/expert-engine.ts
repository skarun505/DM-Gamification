import glossaryData from '../../content/glossary.json';

export interface ConversationTurn {
  sender: 'user' | 'pixie' | 'model';
  text?: string;
  parts?: { text: string }[];
  content?: string;
}

export interface MetricKnowledge {
  name: string;
  fullName: string;
  shortDef: string;
  formula: string;
  breakdown: string;
  numericalExample: string;
  jarvisDirective: string;
}

export const METRIC_KNOWLEDGE_BASE: Record<string, MetricKnowledge> = {
  cvr: {
    name: 'CVR',
    fullName: 'Conversion Rate',
    shortDef: 'The percentage of clicks, landing page visitors, or form viewers who complete the final desired action (purchase, lead, registration).',
    formula: 'CVR = (Total Conversions ÷ Total Outbound Clicks or Visitors) × 100%',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**CVR** = (Completed Conversions ÷ Total Visitors) × 100%

🔢 **Telemetry Breakdown (Sample E-Commerce Store):**
• **Landing Page Visitors:** 2,000 visitors
• **Completed Purchases:** 60 orders
• **Efficiency Calculation:** (60 ÷ 2,000) × 100% = **3.0% CVR**

📊 **Jarvis Industry Benchmarks:**
• **E-Commerce (Store Purchases):** 1.8% to 3.5% (Good). >4.0% (Superior).
• **Lead Gen (Instant Forms):** 15% to 30%.
• **Lead Gen (Landing Page):** 8% to 15%.`,
    numericalExample: 'If 800 people click your ad and 40 submit a dental consultation form, your CVR = (40 ÷ 800) × 100% = **5.0% CVR**.',
    jarvisDirective: 'If CVR drops below 1.5% on e-commerce, test your page loading speed (must be < 2.5s) and eliminate checkout friction with UPI / COD options.',
  },
  ltv: {
    name: 'LTV',
    fullName: 'Customer Lifetime Value',
    shortDef: 'The estimated total revenue or gross profit a single customer will generate across their entire commercial relationship with your business.',
    formula: 'LTV = Average Order Value (₹) × Annual Purchase Frequency × Average Customer Lifespan (Years)',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**LTV** = Average Order Value × Annual Purchase Count × Lifespan (Years)

🔢 **Telemetry Breakdown (Sample Salon / D2C Brand):**
• **Average Order Value (AOV):** ₹1,500
• **Annual Orders per Customer:** 4 visits per year
• **Average Customer Lifespan:** 2 years
• **Calculated Value:** ₹1,500 × 4 × 2 = **₹12,000 LTV**

💡 **Executive Summary:**
Every acquired customer is statistically worth **₹12,000** to the enterprise over a 24-month horizon.`,
    numericalExample: 'A fitness client paying ₹2,500/month and staying for 8 months yields an LTV of ₹2,500 × 8 = **₹20,000 LTV**.',
    jarvisDirective: 'LTV dictates your acquisition ceiling. If your LTV is ₹12,000, paying a ₹1,500 CAC guarantees massive profitability despite short-term cash flow lag.',
  },
  cac: {
    name: 'CAC',
    fullName: 'Customer Acquisition Cost',
    shortDef: 'The fully loaded financial investment required to win one net-new paying customer (includes ad spend, software tools, creative production, and sales overhead).',
    formula: 'CAC = (Total Sales + Marketing Spend in Period) ÷ Net New Customers Acquired',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**CAC** = (Total Ad Spend + Agency/Creative Overhead) ÷ Net New Customers

🔢 **Telemetry Breakdown (Sample Monthly Agency P&L):**
• **Ad Spend Deployed:** ₹80,000
• **Creative/Tool Overhead:** ₹20,000
• **Total Capital Invested:** ₹1,00,000
• **Net New Customers Won:** 100 customers
• **True Acquisition Cost:** ₹1,00,000 ÷ 100 = **₹1,000 CAC**

⚖️ **Golden Unit Economics Ratio:**
Target an **LTV:CAC ratio of at least 3:1**. If CAC is ₹1,000, LTV must be ₹3,000+ for scalable unit economics.`,
    numericalExample: 'Spending ₹30,000 on Meta Ads to acquire 15 new retainer clients gives ₹30,000 ÷ 15 = **₹2,000 CAC**.',
    jarvisDirective: 'Do not confuse CAC with CPA. CPA is an in-platform metric per individual order or conversion; CAC is the comprehensive business cost per net-new human customer.',
  },
  cpa: {
    name: 'CPA',
    fullName: 'Cost Per Acquisition (or Cost Per Action)',
    shortDef: 'The direct in-platform advertising capital spent to generate one specific conversion event (purchase, paid trial, or subscription).',
    formula: 'CPA = Total Ad Spend (₹) ÷ Total Conversions Count',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**CPA** = Total Ad Spend ÷ Total Attributed Conversions

🔢 **Telemetry Breakdown (Sample Campaign):**
• **Ad Spend Deployed:** ₹30,000
• **Attributed Purchases:** 60 orders
• **Unit Acquisition Cost:** ₹30,000 ÷ 60 = **₹500 CPA**

💡 **Executive Summary:**
You paid exactly **₹500** in Meta ad capital for each conversion logged in the ad account.`,
    numericalExample: '₹20,000 ad spend resulting in 40 course purchases gives ₹20,000 ÷ 40 = **₹500 CPA**.',
    jarvisDirective: 'Compare live CPA against your Target CPA. If Target CPA is ₹600 and live CPA is ₹500, scale daily budgets by 15% every 48 hours.',
  },
  roas: {
    name: 'ROAS',
    fullName: 'Return On Ad Spend',
    shortDef: 'The gross revenue multiplier generated for every single rupee or dollar deployed in advertising.',
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
  mer: {
    name: 'MER',
    fullName: 'Marketing Efficiency Ratio (Blended ROAS)',
    shortDef: 'The macro financial metric comparing total company revenue against total ad spend across all platforms combined.',
    formula: 'MER = Total Store Gross Net Sales (₹) ÷ Total Ad Spend Across All Channels (₹)',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**MER** = Total Store Net Sales (₹) ÷ Total Ad Spend Across All Channels (₹)

🔢 **Telemetry Breakdown (Omnichannel):**
• **Total Ad Spend (Meta + Google + YouTube):** ₹1,00,000
• **Total Store Revenue (Shopify):** ₹5,00,000
• **Blended Efficiency:** ₹5,00,000 ÷ ₹1,00,000 = **5.0x MER**

💡 **Executive Summary:**
Your holistic marketing engine generates **₹5** in revenue for every ₹1 invested across the entire digital ecosystem.`,
    numericalExample: 'Total revenue ₹10,00,000 across ₹2,00,000 total ad budget across all platforms = **5.0x MER**.',
    jarvisDirective: 'Due to iOS 14.5+ attribution loss, top agencies manage ad budgets using MER rather than trusting in-platform Meta ROAS alone.',
  },
  aov: {
    name: 'AOV',
    fullName: 'Average Order Value',
    shortDef: 'The average amount of revenue collected each time a customer completes a checkout transaction.',
    formula: 'AOV = Total Sales Revenue (₹) ÷ Total Number of Orders',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**AOV** = Total Gross Sales Revenue ÷ Total Orders Placed

🔢 **Telemetry Breakdown (Sample Store):**
• **Gross Revenue:** ₹1,20,000
• **Orders Placed:** 60 checkouts
• **Calculated Average Order:** ₹1,20,000 ÷ 60 = **₹2,000 AOV**

💡 **Executive Summary:**
Every customer checkout contributes an average of **₹2,000** in gross order value.`,
    numericalExample: '₹50,000 in sales across 25 checkouts gives ₹50,000 ÷ 25 = **₹2,000 AOV**.',
    jarvisDirective: 'Increasing AOV by 20% (via bundles or checkout upsells) instantly increases your ROAS by 20% with zero increase in advertising spend!',
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
  be_roas: {
    name: 'Break-Even ROAS',
    fullName: 'Break-Even Return On Ad Spend',
    shortDef: 'The minimum ROAS multiplier a campaign must achieve so the business makes ₹0 net loss after product manufacturing and shipping costs.',
    formula: 'Break-Even ROAS = 1 ÷ Gross Profit Margin %',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**Break-Even ROAS** = 1 ÷ Gross Margin %

🔢 **Telemetry Breakdown (Sample D2C Brand):**
• **Retail Selling Price:** ₹2,000
• **Product COGS + Shipping:** ₹1,000
• **Gross Profit Margin:** (₹1,000 ÷ ₹2,000) = 50% (0.50)
• **Calculated Threshold:** 1 ÷ 0.50 = **2.0x Break-Even ROAS**

💡 **Executive Summary:**
At 2.0x ROAS, the brand is net zero. Anything above 2.0x is pure profit. Anything below 2.0x burns capital.`,
    numericalExample: 'At 40% gross margin, 1 ÷ 0.40 = **2.5x Break-Even ROAS**. At 25% margin, 1 ÷ 0.25 = **4.0x Break-Even ROAS**.',
    jarvisDirective: 'Never scale ad budgets based on platform ROAS without calculating Break-Even ROAS first.',
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
  thumbstop: {
    name: 'Thumbstop Rate',
    fullName: 'Thumbstop Rate (3-Second Hook Rate)',
    shortDef: 'The percentage of ad viewers who stopped scrolling and watched at least the first 3 seconds of your video ad.',
    formula: 'Thumbstop Rate = (3-Second Video Plays ÷ Total Impressions) × 100%',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**Thumbstop Rate** = (3-Second Video Views ÷ Impressions) × 100%

🔢 **Telemetry Breakdown (Sample Reel Ad):**
• **Total Impressions Rendered:** 50,000
• **3-Second Video Plays:** 16,000
• **Efficiency Calculation:** (16,000 ÷ 50,000) × 100% = **32.0% Hook Rate**

📊 **Jarvis Benchmarks:**
• **Below 20%:** Failed hook. Swap opening visual immediately.
• **20% to 30%:** Average baseline.
• **Above 30%:** High-converting winner! 🚀`,
    numericalExample: '6,000 three-second plays from 20,000 impressions = (6,000 ÷ 20,000) × 100% = **30.0% Thumbstop Rate**.',
    jarvisDirective: 'Thumbstop rate isolates whether your creative hook works. If thumbstop is high (>30%) but link clicks are low, fix the pitch in the middle of the video.',
  },
  hold_rate: {
    name: 'Hold Rate',
    fullName: 'Hold Rate (Video Retention Rate)',
    shortDef: 'The percentage of viewers who hooked at 3 seconds that continued watching until the ThruPlay mark (15 seconds or video end).',
    formula: 'Hold Rate = (ThruPlays ÷ 3-Second Video Plays) × 100%',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**Hold Rate** = (ThruPlays ÷ 3-Second Plays) × 100%

🔢 **Telemetry Breakdown:**
• **3-Second Hook Plays:** 10,000
• **ThruPlays (15s Completed):** 3,500
• **Retention Efficiency:** (3,500 ÷ 10,000) × 100% = **35.0% Hold Rate**

💡 **Executive Summary:**
35% of all viewers who stopped scrolling stayed engaged through the primary value proposition of the ad.`,
    numericalExample: '2,000 ThruPlays from 8,000 3s views = (2,000 ÷ 8,000) × 100% = **25.0% Hold Rate**.',
    jarvisDirective: 'High thumbstop (>30%) with poor hold rate (<15%) signals a clickbait hook that didn\'t deliver on its promise. Match the body copy directly to the opening hook.',
  },
  emq: {
    name: 'EMQ',
    fullName: 'Event Match Quality (Meta Pixel & CAPI)',
    shortDef: 'A rating from 0.0 to 10.0 indicating how accurately customer telemetry sent from your server matches real Meta user profiles.',
    formula: 'Scored 0.0 to 10.0 based on matched customer parameters (Email, Phone, FBP, FBC, IP, User Agent).',
    breakdown: `📐 **Jarvis Telemetry Audit:**
**EMQ Score** = Parameter Matching Depth (Hashed Email + Phone + Client IP + Browser ID)

📊 **Match Quality Standards:**
• **0.0 - 5.0 (Critical Alert):** Severe attribution loss. Meta cannot match buyers to ad sets.
• **6.0 - 7.9 (Acceptable):** Standard basic pixel setup.
• **8.0 - 10.0 (Optimal Standard):** High data integrity. Server-side CAPI active! 🚀`,
    numericalExample: 'Passing hashed email, hashed phone, external ID, IP, and browser ID via Shopify CAPI produces an **EMQ of 8.8/10**.',
    jarvisDirective: 'An EMQ above 8.0 directly lowers your CPA by up to 25% because Meta gets clean feedback on who converted, allowing its algorithm to target identical high-intent profiles.',
  },
  churn: {
    name: 'Churn Rate',
    fullName: 'Customer / Subscriber Churn Rate',
    shortDef: 'The percentage of active customers or subscribers who cancel or fail to repurchase over a given calendar period.',
    formula: 'Churn Rate = (Customers Lost during Period ÷ Total Customers at Start of Period) × 100%',
    breakdown: `📐 **Jarvis Mathematical Architecture:**
**Churn Rate** = (Lost Customers ÷ Starting Customers) × 100%

🔢 **Telemetry Breakdown (Sample Subscription / Retainer):**
• **Starting Active Clients:** 200 clients
• **Cancellations in Month:** 10 clients
• **Monthly Churn Calculation:** (10 ÷ 200) × 100% = **5.0% Churn Rate**

💡 **Executive Summary:**
The business loses **5.0%** of its active recurring revenue base each month.`,
    numericalExample: 'Losing 8 clients out of 100 in a quarter = (8 ÷ 100) × 100% = **8.0% Churn**.',
    jarvisDirective: 'If monthly churn exceeds 7%, do not attempt to scale ad budgets. Fix product retention first, or new customers will leak as fast as you acquire them.',
  },
  ecpm: {
    name: 'eCPM',
    fullName: 'Effective Cost Per Mille (Auction Total Value)',
    shortDef: 'The unified auction score Meta calculates to rank every ad competing for a user\'s screen impression.',
    formula: 'eCPM = (Advertiser Bid × Estimated Action Rate) + User Value Score',
    breakdown: `📐 **Jarvis Auction Architecture:**
**Total Value (eCPM)** = [Advertiser Bid × Estimated Action Rate] + User Value Score

🔍 **The 3 Drivers of eCPM:**
• **1. Bid:** What you pay per conversion (lowest cost or cost cap).
• **2. Estimated Action Rate (EAR):** Machine learning prediction of conversion likelihood.
• **3. User Value:** Ad quality score, engagement, watch time, and negative feedback.`,
    numericalExample: 'An ad with a lower bid but double the engagement watch-time beats a high-bidding spam ad in Meta\'s eCPM auction.',
    jarvisDirective: 'Improving ad creative quality raises your User Value score, allowing you to win impressions against giant competitors while paying significantly lower CPMs.',
  },
};

export const COMPARISONS_VAULT: Record<string, { title: string; subtitle: string; content: string }> = {
  cpa_vs_cac: {
    title: 'CPA vs CAC Comparison Protocol',
    subtitle: 'Cost Per Action (Campaign Level) vs Customer Acquisition Cost (Business Level)',
    content: `⚖️ **Jarvis Strategic Analysis: CPA vs CAC**

Media buyers and founders frequently conflate these two metrics. Here is the vital distinction:

📋 **1. CPA (Cost Per Acquisition / Cost Per Action):**
• **Level:** Tactical Campaign Metric (In-Platform).
• **Formula:** Total Ad Spend ÷ Total Attributed Actions.
• **What it includes:** Direct media spend inside Meta Ads Manager.
• **Use Case:** Day-to-day ad set optimization and bid adjustments.

🏢 **2. CAC (Customer Acquisition Cost):**
• **Level:** Executive Business Metric (Macro Level).
• **Formula:** (Total Marketing Spend + Sales Team Salaries + Tool Overhead) ÷ Net New Customers.
• **What it includes:** Meta ad spend + Google ad spend + agency retainer + Shopify apps + telecaller commissions.
• **Use Case:** Company valuation, fundraising, and true net profitability.

⚡ **Jarvis Directive for ${'Deepana'}:**
Your CPA might be ₹400 on Meta, but after factoring in creative costs and sales salaries, your CAC could be ₹800. Always ensure your LTV comfortably covers your fully loaded CAC!`,
  },
  cbo_vs_abo: {
    title: 'CBO vs ABO Battle Protocol',
    subtitle: 'Advantage Campaign Budget (Scaling) vs Ad Set Budget (Testing)',
    content: `⚖️ **Jarvis Tactical Analysis: CBO vs ABO Protocol**

High-performance media buyers deploy both engine modes depending on the campaign phase:

🔧 **ABO (Ad Set Budget Optimization) — The Testing Lab:**
• **Mechanics:** You enforce fixed daily spend per ad set (e.g., ₹500 on Set A, ₹500 on Set B).
• **Best For:** **Phase 1: Creative & Audience Testing**. It guarantees equal spend distribution so Meta cannot prematurely starve new angles.

🚀 **CBO (Advantage Campaign Budget) — The Scaling Engine:**
• **Mechanics:** You assign one unified budget to the campaign (e.g., ₹5,000/day). Meta dynamically shifts capital to whichever ad set delivers the lowest CPA in real-time.
• **Best For:** **Phase 2: Scaling Winners**. Combine your top 2–4 proven winner ad sets into 1 CBO and scale budgets upward.

⚡ **Jarvis Directive for ${'Deepana'}:**
Test in ABO with 3:2:2 dynamic sets. Scale winners in CBO with Advantage+ audience liquidity.`,
  },
  broad_vs_lookalike: {
    title: 'Broad Targeting vs Lookalike Audiences',
    subtitle: 'Open Demographics vs Machine-Learned Seed Resemblance',
    content: `🎯 **Jarvis Audience Strategy: Broad vs Lookalike Protocol**

🌐 **1. Broad Targeting (Top Recommendation for 2026):**
• **Setup:** Age: 21–55, Target Geography, Interests: **Completely Empty (No Interests)**.
• **How it works:** Meta’s AI reads your creative video audio, visual frames, and caption hooks to auto-segment the exact buyers.
• **Advantages:** Lowest CPMs in the auction, zero audience saturation ceiling, scales seamlessly.

👥 **2. Lookalike Audiences (LAL):**
• **Setup:** 1% to 2% Lookalike created from high-value customer seed lists (e.g. top 500 repeat buyers).
• **How it works:** Meta identifies users with statistical behavioral overlap to your seed buyers.
• **Advantages:** High initial conversion velocity, but prone to audience fatigue after 3–4 weeks.

⚡ **Jarvis Directive for ${'Deepana'}:**
Allocate 75% of your budget to Broad targeting, and 25% to 1% Lookalikes and warm retargeting.`,
  },
  cpm_vs_cpc: {
    title: 'CPM vs CPC Metric Relationship',
    subtitle: 'Auction Inventory Price vs User Engagement Cost',
    content: `📊 **Jarvis Mathematical Analysis: CPM vs CPC**

• **CPM (Cost Per Mille):** The auction price you pay Meta to display your ad 1,000 times. Measures audience competition and ad quality penalties.
• **CPC (Cost Per Click):** The unit cost incurred when an interested user taps your destination link. Measures creative interest and offer relevance.

📐 **The Mathematical Bridge:**
**CPC = CPM ÷ (1,000 × CTR %)**

⚡ **Jarvis Tactical Directive for ${'Deepana'}:**
If your CPM increases due to festive auction competition, you can neutralize the cost by boosting your creative CTR! Doubling your CTR from 1% to 2% cuts your CPC in half, regardless of high CPMs.`,
  },
  roas_vs_roi_vs_mer: {
    title: 'ROAS vs ROI vs MER Triad',
    subtitle: 'Platform Return vs True Net Profitability vs Blended Efficiency',
    content: `📈 **Jarvis Financial Architecture: ROAS vs ROI vs MER**

• **ROAS (Return On Ad Spend):** Gross Sales ÷ Ad Spend. (e.g. ₹40,000 revenue ÷ ₹10,000 ads = **4.0x ROAS**). Ignores manufacturing cost, taxes, and shipping.
• **ROI (Return On Investment):** Net Profit ÷ Total Costs × 100%. Measures actual cash in bank after COGS and ad spend.
• **MER (Marketing Efficiency Ratio):** Total Net Revenue ÷ Total Ad Spend across all platforms (Meta + Google + Influencers). Blended agency health metric.

⚡ **Jarvis Directive for ${'Deepana'}:**
Never celebrate a 4.0x platform ROAS if your product margins are so thin that net ROI is negative. Always audit Break-Even ROAS before scaling!`,
  },
  instant_vs_landing: {
    title: 'Instant Forms vs Landing Page Web Leads',
    subtitle: 'In-App Speed vs Out-of-App Intent & Qualification',
    content: `📋 **Jarvis Lead Gen Architecture: Instant Forms vs Landing Pages**

📱 **1. Meta Instant Forms (In-App Lead Ads):**
• **Pros:** 1-tap submission with auto-filled name and phone. High conversion volume, low CPL.
• **Cons:** Risk of accidental submissions and invalid phone numbers.
• **Jarvis Fix:** Toggle "Higher Intent" + mandatory confirmation slide + 1 custom qualifying question.

💻 **2. Landing Page Leads (Website):**
• **Pros:** Deep customer education, video reviews, highest sales team contact rate.
• **Cons:** Higher CPL due to page bounce rate and mobile loading friction.

⚡ **Jarvis Directive for ${'Deepana'}:**
For local clinics, salons, and B2B, deploy Instant Forms with Higher Intent. For high-ticket real estate (>₹1 Crore), deploy dedicated landing pages.`,
  },
  meta_vs_google: {
    title: 'Meta Ads vs Google Ads Architecture',
    subtitle: 'Demand Generation (Push) vs Demand Capture (Pull)',
    content: `🌐 **Jarvis Strategic Brief: Meta Ads vs Google Ads**

• **Meta Ads (Demand Generation / Push Marketing):**
  • Users are casually scrolling feeds and Reels.
  • You visually interrupt them with an irresistible problem-solution creative.
  • Best for: D2C brands, impulse purchases, local experiences, disruptive new products.

• **Google Ads (Demand Capture / Pull Marketing):**
  • Users have active high commercial intent (e.g., searching "best hair transplant in Chennai").
  • You capture existing demand at the exact moment of search.
  • Best for: Emergency services, high-intent B2B software, specific product model searches.

⚡ **Jarvis Directive for ${'Deepana'}:**
Deploy Meta Ads to build demand and generate cold interest; deploy Google Search & Brand campaigns to capture users searching your brand name after seeing your Meta ads!`,
  },
  reach_vs_impressions: {
    title: 'Reach vs Impressions Distinction',
    subtitle: 'Unique Humans vs Gross View Counts',
    content: `👁️ **Jarvis Telemetry Brief: Reach vs Impressions**

• **Reach:** The total count of unique human beings who viewed your ad at least once.
• **Impressions:** The total gross number of times your ad was displayed on screens (including repeat views by the same person).
• **Frequency = Impressions ÷ Reach.**

⚡ **Jarvis Directive for ${'Deepana'}:**
If impressions are 100,000 and reach is 50,000, your frequency is 2.0. If frequency crosses 3.5 on prospecting campaigns, creative fatigue has set in!`,
  },
};

export const FRAMEWORKS_VAULT: Record<string, { title: string; subtitle: string; steps: string[]; directive: string }> = {
  diagnose_drop: {
    title: 'The 6-Step "Diagnose-a-Drop" Framework',
    subtitle: 'Immediate audit protocol when CPL spikes or ROAS plunges',
    steps: [
      '1. Tracking Audit: Verify Meta Pixel, CAPI, and landing page URLs. Are events firing cleanly in Events Manager?',
      '2. Frequency & Fatigue: Did frequency exceed 3.5? Check CTR decay over the past 3 days.',
      '3. Auction Competition: Did CPM spike due to a holiday, festival, or competitor auction aggression?',
      '4. Landing Page Telemetry: Compare Link Clicks vs Landing Page Views. Is mobile load time > 3 seconds?',
      '5. Budget Volatility: Did someone increase daily budgets by > 20%, resetting the machine learning phase?',
      '6. Offer & External Factors: Did checkout pricing, discounts, or stock status change on the website?',
    ],
    directive: 'Never touch budget or creative blindly. Run this 6-step diagnostic to isolate the single failing gear first.',
  },
  launch_plan: {
    title: 'The 8-Step Campaign Launch Protocol',
    subtitle: 'How senior media buyers launch a new brand or product campaign',
    steps: [
      '1. Business Target: Establish target CPA, target CPL, and break-even ROAS benchmarks.',
      '2. Audience Liquidity: Configure Broad targeting with demographic guardrails (Age, Location).',
      '3. Creative Weaponry: Produce 3 video variations (Hooks), 2 primary copy angles, and 2 headlines (3:2:2).',
      '4. Dynamic Creative Ad Set: Deploy testing in an ABO ad set with daily budget = 3x to 5x target CPA.',
      '5. Tracking Verification: Test Purchase / Lead events using Meta Pixel Helper and CAPI test payloads.',
      '6. Milestone Check (Day 1): Confirm clean delivery, CPM within range, and zero policy flags.',
      '7. Milestone Check (Day 3): Audit thumbstop rate (>30%) and outbound CTR (>1.5%).',
      '8. Scaling Transition (Day 7): Extract winning creative post IDs into the primary Scaling CBO campaign.',
    ],
    directive: 'Keep campaigns consolidated. Running 15 tiny ad sets starves Meta\'s machine learning algorithm.',
  },
  learning_limited: {
    title: 'How to Exit Meta "Learning Limited"',
    subtitle: 'Restoring algorithm stability when an ad set is stuck',
    steps: [
      '1. Root Cause: An ad set enters Learning Limited when it generates fewer than ~50 conversions within 7 days.',
      '2. Consolidate Ad Sets: Merge 5 fragmented ad sets into 2 to pool conversion signals into one place.',
      '3. Widen Audience: Remove restrictive interest filters and switch to Broad or Advantage+ targeting.',
      '4. Move Up-Funnel: If getting < 50 purchases/week, optimize for "Add to Cart" or "Initiate Checkout" temporarily.',
      '5. Budget Rule: Ensure your 7-day budget equals at least (50 × Target CPA).',
    ],
    directive: 'Learning Limited increases CPA volatility by up to 30%. Consolidate ad sets to exit immediately.',
  },
  client_talk: {
    title: 'The "Client-Talk" Reporting Formula',
    subtitle: 'How to present performance results to business owners without confusing jargon',
    steps: [
      '1. What Happened: State the core outcome in plain rupees ("We generated 64 verified leads this week at ₹95 each").',
      '2. Why: Explain the driver in plain English ("Our customer video testimonial achieved a 2.8% click rate").',
      '3. What I Did / Will Do: State concrete operational actions ("I scaled the winning ad set budget by 20% today").',
      '4. What I Need From You: State any feedback needed ("Please let me know lead quality feedback from your sales team").',
      '5. Next Milestone: State the exact day and time of the next performance report.',
    ],
    directive: 'Never dump raw acronyms like EMQ, EAR, and eCPM on a client without translating them into Revenue and Leads.',
  },
};

/**
 * Normalizes text for keyword and concept matching.
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

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
 * Detects if the user is asking for a comparison or difference between two terms.
 */
export function detectComparison(message: string): string | null {
  const norm = normalize(message);

  if (
    norm.includes('cpa') &&
    norm.includes('cac') &&
    (norm.includes('diff') || norm.includes('vs') || norm.includes('compare') || norm.includes('between'))
  ) {
    return 'cpa_vs_cac';
  }

  if (
    norm.includes('cbo') &&
    norm.includes('abo') &&
    (norm.includes('diff') || norm.includes('vs') || norm.includes('compare') || norm.includes('between') || norm.includes('or'))
  ) {
    return 'cbo_vs_abo';
  }

  if (
    (norm.includes('broad') || norm.includes('open')) &&
    (norm.includes('lookalike') || norm.includes('retargeting') || norm.includes('interest')) &&
    (norm.includes('diff') || norm.includes('vs') || norm.includes('compare') || norm.includes('which is better'))
  ) {
    return 'broad_vs_lookalike';
  }

  if (
    norm.includes('cpm') &&
    norm.includes('cpc') &&
    (norm.includes('diff') || norm.includes('vs') || norm.includes('compare') || norm.includes('between'))
  ) {
    return 'cpm_vs_cpc';
  }

  if (
    (norm.includes('roas') && norm.includes('mer')) ||
    (norm.includes('roas') && norm.includes('roi')) ||
    (norm.includes('mer') && norm.includes('roi'))
  ) {
    return 'roas_vs_roi_vs_mer';
  }

  if (
    (norm.includes('instant form') || norm.includes('lead ad')) &&
    (norm.includes('landing page') || norm.includes('website')) &&
    (norm.includes('diff') || norm.includes('vs') || norm.includes('better'))
  ) {
    return 'instant_vs_landing';
  }

  if (
    norm.includes('meta') &&
    norm.includes('google') &&
    (norm.includes('diff') || norm.includes('vs') || norm.includes('compare') || norm.includes('which'))
  ) {
    return 'meta_vs_google';
  }

  if (
    norm.includes('reach') &&
    norm.includes('impression') &&
    (norm.includes('diff') || norm.includes('vs') || norm.includes('between'))
  ) {
    return 'reach_vs_impressions';
  }

  return null;
}

/**
 * Detects if the user is asking about an interview framework or syllabus launch plan.
 */
export function detectFramework(message: string): string | null {
  const norm = normalize(message);

  if (
    norm.includes('diagnose') ||
    norm.includes('drop') ||
    norm.includes('sudden fall') ||
    norm.includes('roas fell') ||
    norm.includes('cpl jump')
  ) {
    return 'diagnose_drop';
  }

  if (
    norm.includes('launch plan') ||
    norm.includes('how to launch') ||
    norm.includes('8 step') ||
    norm.includes('launching a campaign') ||
    norm.includes('new client campaign')
  ) {
    return 'launch_plan';
  }

  if (
    norm.includes('learning limited') ||
    norm.includes('learning phase') ||
    norm.includes('stuck in learning')
  ) {
    return 'learning_limited';
  }

  if (
    norm.includes('client talk') ||
    norm.includes('explain to client') ||
    norm.includes('report to client') ||
    norm.includes('how to talk to client')
  ) {
    return 'client_talk';
  }

  return null;
}

/**
 * Detects the active marketing metric from the conversation.
 */
export function detectTopic(message: string, history: ConversationTurn[] = []): string | null {
  const current = message.toLowerCase().trim();

  const keywords: [string, RegExp[]][] = [
    ['cvr', [/\bcvr\b/i, /conversion rate/i]],
    ['ltv', [/\bltv\b/i, /lifetime value/i, /customer lifetime/i]],
    ['cac', [/\bcac\b/i, /customer acquisition cost/i]],
    ['cpa', [/\bcpa\b/i, /cost per acquisition/i, /cost per action/i]],
    ['roas', [/\broas\b/i, /return on ad spend/i]],
    ['mer', [/\bmer\b/i, /marketing efficiency ratio/i, /blended roas/i]],
    ['aov', [/\baov\b/i, /average order value/i]],
    ['be_roas', [/\bbreak-even\b/i, /break even roas/i, /breakeven roas/i]],
    ['thumbstop', [/\bthumbstop\b/i, /hook rate/i, /3 second view rate/i]],
    ['hold_rate', [/\bhold rate\b/i, /thruplay rate/i, /retention rate/i]],
    ['emq', [/\bemq\b/i, /event match quality/i]],
    ['churn', [/\bchurn\b/i, /churn rate/i]],
    ['ecpm', [/\becpm\b/i, /effective cpm/i, /total value auction/i]],
    ['cpm', [/\bcpm\b/i, /cost per mille/i, /cost per thousand/i, /impressions cost/i]],
    ['ctr', [/\bctr\b/i, /click through/i, /click-through/i]],
    ['cpc', [/\bcpc\b/i, /cost per click/i]],
    ['cpl', [/\bcpl\b/i, /cost per lead/i]],
    ['cpr', [/\bcpr\b/i, /cost per result/i, /cost\/result/i]],
    ['frequency', [/\bfrequency\b/i, /creative fatigue/i, /ad fatigue/i]],
  ];

  // 1. Strict regex patterns tested against current message first
  for (const [key, patterns] of keywords) {
    if (patterns.some((p) => p.test(current))) {
      return key;
    }
  }

  // 2. Only inspect previous turn if user asks a direct pronoun or follow-up request
  const isFollowUp =
    /^(it|that|this|the formula|calculate it|give me in|in number|show me|break it down|example for that|breakdown of that|numbers for that)\b/i.test(current) ||
    (Array.isArray(history) && history.length > 0 && /^(give me|show|calculate|breakdown|numbers|formula)/i.test(current) && !/(cpm|cpr|roas|ctr|cpc|cpl|cpa|mer|frequency|cvr|ltv|cac|aov)/i.test(current));

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
 * Searches the 80 syllabus glossary terms from glossary.json.
 */
export function searchGlossary(message: string): { term: string; simple: string; example: string } | null {
  const norm = normalize(message);

  for (const item of glossaryData) {
    const termNorm = normalize(item.term);
    const slugNorm = normalize(item.slug);

    if (
      norm === termNorm ||
      norm === slugNorm ||
      norm === `what is ${termNorm}` ||
      norm === `explain ${termNorm}` ||
      norm === `what is ${slugNorm}` ||
      norm === `explain ${slugNorm}` ||
      norm.includes(`what is ${termNorm}`) ||
      norm.includes(`explain ${termNorm}`) ||
      (norm.length > 4 && termNorm.length > 4 && norm.includes(termNorm))
    ) {
      return item;
    }
  }

  return null;
}

/**
 * Intelligent Jarvis-grade Digital Marketing Engine.
 * Fully trained on performance marketing metrics, comparisons, syllabus concepts, and frameworks.
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
    return `Systems operational, **${learnerName}**. 🦊 All telemetry confirms your profile identity:

• **Designation:** Performance Marketing Specialist in training
• **Assigned Tactical AI:** Pixie-Jarvis Co-Pilot Unit
• **Operational Goal:** Master media buying architecture, unit economics (CVR, LTV, CAC, ROAS), and auction bidding.

How may I assist your campaign directives today, Deepana?`;
  }

  if (
    lowerMsg.includes('who are you') ||
    lowerMsg.includes('what is pixie') ||
    lowerMsg.includes('jarvis') ||
    lowerMsg.includes('tell me about yourself')
  ) {
    return `Good day, **${learnerName}**. 🦊 I am **Pixie-Jarvis**—your elite AI Marketing Co-pilot and tactical performance mentor on AdQuest.

Engineered with the tactical intelligence and speed of JARVIS for performance media buyers:
• 🛰️ **Auction Intelligence:** Deconstructing Meta & Google eCPM bidding equations.
• 📐 **Mathematical Precision:** Real-time diagnostics for CVR, LTV, CAC, CPA, ROAS, MER, and Break-Even economics.
• 🎯 **Creative Engineering:** Deploying psychological pattern interrupts and 3:2:2 Dynamic Creative testing.
• 🚀 **Scaling Protocols:** Executing vertical budget expansions and audience liquidity structures.

What protocol shall we analyze today?`;
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
• **Protocol A (Core Metrics & Math):** Request deep breakdown of **"CVR"**, **"LTV"**, **"CAC"**, **"CPA"**, or **"Break-Even ROAS"**.
• **Protocol B (Tactical Comparisons):** Analyze **"CPA vs CAC"**, **"CBO vs ABO"**, or **"Broad vs Lookalike"**.
• **Protocol C (Syllabus Frameworks):** Run **"Diagnose a Drop"**, **"8-Step Launch Plan"**, or **"Exit Learning Limited"**.
• **Protocol D (Diagnostic Sweep):** Troubleshoot **"high CPM root causes"** or **"high CPL cleanup"**.

State your directive, Deepana.`;
  }

  // 3. Comparison / Difference Request (e.g. CPA vs CAC, CBO vs ABO)
  const comparisonKey = detectComparison(message);
  if (comparisonKey && COMPARISONS_VAULT[comparisonKey]) {
    const comp = COMPARISONS_VAULT[comparisonKey];
    return `Telemetry analysis locked, **${learnerName}**. 🦊 **${comp.title}**
*${comp.subtitle}*

${comp.content}`;
  }

  // 4. Framework / Syllabus Diagnostic (e.g. Diagnose a Drop, Launch Plan, Learning Limited)
  const frameworkKey = detectFramework(message);
  if (frameworkKey && FRAMEWORKS_VAULT[frameworkKey]) {
    const fw = FRAMEWORKS_VAULT[frameworkKey];
    return `🛰️ **Jarvis Tactical Framework: ${fw.title}**
*${fw.subtitle}*

📋 **Execution Steps:**
${fw.steps.map((s) => `• **${s}**`).join('\n')}

⚡ **Jarvis Directive for ${learnerName}:**
${fw.directive}`;
  }

  // 5. Specific Metric or Mathematical Request
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

  // 6. Syllabus Glossary Term Lookup (All 80 syllabus terms)
  const glossaryMatch = searchGlossary(message);
  if (glossaryMatch) {
    return `🛰️ **Jarvis Syllabus Vault: ${glossaryMatch.term}**

📖 **Core Definition:**
${glossaryMatch.simple}

🔢 **Real-World Agency Case:**
${glossaryMatch.example}

⚡ **Jarvis Directive for ${learnerName}:**
This concept is a core pillar in the AdQuest curriculum. Master how it interacts with CPA and ROAS to ace your campaign battles and client pitches!`;
  }

  // 7. Generic request for numbers/formulas
  if (wantsNumbers) {
    return `📐 **Jarvis Telemetry Vault: Media Buying Mathematical Cheat Sheet**

Here are the core equations governing modern performance marketing:

• **1. CVR (Conversion Rate):** (Conversions ÷ Outbound Clicks) × 100%
• **2. CPA (Cost Per Acquisition):** Total Ad Spend ÷ Total Conversions
• **3. CAC (Customer Acquisition Cost):** Total Sales & Marketing Spend ÷ Net New Customers
• **4. LTV (Lifetime Value):** Average Order Value × Annual Orders × Lifespan (Years)
• **5. ROAS (Return On Ad Spend):** Gross Sales Revenue ÷ Ad Spend
• **6. Break-Even ROAS:** 1 ÷ Gross Profit Margin %
• **7. MER (Blended ROAS):** Total Company Net Sales ÷ Total Ad Spend Across All Channels
• **8. Thumbstop Rate:** (3-Second Video Plays ÷ Impressions) × 100%

State which metric you want to crunch with your live budget numbers, Deepana! 🧮`;
  }

  // 8. Dynamic Tactical Fallback
  return `Acknowledged, **${learnerName}**. 🦊 Jarvis Marketing Co-pilot analyzing your directive:

To engineer the most effective solution, let us pinpoint the exact operational phase:
• **Phase 1 (Metrics & Math):** Ask for **"CVR"**, **"LTV"**, **"CAC"**, **"CPA"**, **"ROAS"**, or **"Break-Even ROAS"**.
• **Phase 2 (Tactical Comparisons):** Ask for **"CPA vs CAC"**, **"CBO vs ABO"**, or **"Broad vs Lookalike"**.
• **Phase 3 (Frameworks & Launch):** Ask for **"Diagnose a Drop"**, **"8-Step Launch Plan"**, or **"Exit Learning Limited"**.
• **Phase 4 (Creative & Auction):** Ask for **"3:2:2 Creative Testing"**, **"3-Second Hook Science"**, or **"Meta Ad Auction Equation"**.

Specify your active target, and we will formulate the exact tactical playbook! 🚀`;
}
