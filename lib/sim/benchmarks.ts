export interface IndustryBenchmark {
  industry: string;
  baseCPM: number;
  baseCTR: number;
  baseCVR: number;
  defaultAOV: number;
}

export const BENCHMARKS: Record<string, IndustryBenchmark> = {
  salon: { industry: "Beauty & Wellness", baseCPM: 140, baseCTR: 0.015, baseCVR: 0.08, defaultAOV: 800 },
  gym: { industry: "Fitness", baseCPM: 150, baseCTR: 0.014, baseCVR: 0.06, defaultAOV: 2000 },
  coaching: { industry: "Education", baseCPM: 180, baseCTR: 0.018, baseCVR: 0.07, defaultAOV: 15000 },
  ecommerce: { industry: "Fashion & D2C", baseCPM: 160, baseCTR: 0.016, baseCVR: 0.025, defaultAOV: 1200 },
  realestate: { industry: "Real Estate", baseCPM: 240, baseCTR: 0.011, baseCVR: 0.03, defaultAOV: 500000 },
  restaurant: { industry: "Food & Dining", baseCPM: 110, baseCTR: 0.020, baseCVR: 0.09, defaultAOV: 600 },
};
