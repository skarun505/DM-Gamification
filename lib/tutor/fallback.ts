export const FALLBACK_TUTOR_RESPONSES: Record<string, string> = {
  default: "In performance marketing, every campaign puzzle comes down to testing! Always look at CPM (cost to reach 1,000 people), CTR (creative hook appeal), and CVR (landing page conversion). Where are you currently seeing the bottleneck?",
  cpr: "CPR stands for **Cost Per Result** in Meta Ads Manager! It calculates your total ad spend divided by the total number of primary results (such as leads, app installs, or purchases) delivered by that ad set.",
  cpm: "CPM is Cost Per Mille (cost per 1,000 impressions). If it's too high, your audience might be too narrow, or your ad creative has low engagement in the auction.",
  ctr: "CTR is Click-Through Rate (clicks ÷ impressions). It measures hook and creative appeal. If CTR is low, test a new opening visual, stronger hook, or clearer Call-to-Action!",
  cpl: "CPL is Cost Per Lead. Total spend divided by total leads received. If CPL jumps, check if your pixel/form is working first, then check creative fatigue.",
  roas: "ROAS is Return On Ad Spend (Revenue ÷ Spend). For example, ₹5,000 revenue from ₹1,000 ad spend = 5.0x ROAS.",
  pixel: "The Meta Pixel and Conversions API (CAPI) send customer actions on your website back to Meta. Without them, Meta has zero feedback on what works and cannot optimize your budget!",
  learning: "The Learning Phase requires ~50 conversions per ad set within 7 days. If you don't hit this, the campaign enters 'Learning Limited' and costs rise by 10-15%.",
};

export function getFallbackReply(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, reply] of Object.entries(FALLBACK_TUTOR_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) {
      return reply;
    }
  }
  return FALLBACK_TUTOR_RESPONSES.default;
}

