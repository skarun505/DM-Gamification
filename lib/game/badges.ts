export interface Badge {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export const ALL_BADGES: Badge[] = [
  { slug: 'first-lesson', name: 'First Step', description: 'Finish any lesson in the curriculum', icon: 'Footprints' },
  { slug: 'streak-3', name: 'On Fire', description: 'Maintain a 3-day learning streak', icon: 'Flame' },
  { slug: 'streak-7', name: 'Unstoppable', description: 'Maintain a 7-day learning streak', icon: 'Zap' },
  { slug: 'streak-30', name: 'Habit Hero', description: 'Maintain a 30-day learning streak', icon: 'Crown' },
  { slug: 'quiz-perfect-5', name: 'Sharp Mind', description: 'Score 100% on 5 different lesson quizzes', icon: 'Target' },
  { slug: 'pixel-master', name: 'Pixel Master', description: 'Complete the Meta Pixel & Events lesson', icon: 'Sparkles' },
  { slug: 'ctr-hunter', name: 'CTR Hunter', description: 'Pass the creative-testing simulator challenge', icon: 'MousePointerClick' },
  { slug: 'budget-boss', name: 'Budget Boss', description: 'Pass any budget simulator task on your first attempt', icon: 'CircleDollarSign' },
  { slug: 'first-boss', name: 'Boss Slayer', description: 'Defeat your first Boss Battle', icon: 'Shield' },
  { slug: 'rookie-grad', name: 'Rookie Graduate', description: 'Complete all lessons and challenges in Meta Rookie tier', icon: 'GraduationCap' },
  { slug: 'operator-grad', name: 'Operator Graduate', description: 'Complete all lessons and challenges in Meta Operator tier', icon: 'Trophy' },
  { slug: 'strategist-grad', name: 'Strategist Graduate', description: 'Complete all lessons and challenges in Meta Strategist tier', icon: 'Star' },
  { slug: 'night-owl', name: 'Night Owl', description: 'Complete a lesson after 10:00 PM IST', icon: 'Moon' },
  { slug: 'curious-cat', name: 'Curious Cat', description: 'Ask Pixie 10 questions across your journey', icon: 'HelpCircle' },
  { slug: 'mentor-fan', name: 'Mentor\'s Pick', description: 'Claim rewards from 3 Mentor challenges', icon: 'Heart' },
  { slug: 'interview-first', name: 'First Answer', description: 'Complete your first interview question', icon: 'MessageSquare' },
  { slug: 'star-shiner', name: 'STAR Shiner', description: 'Craft and save 3 personal STAR interview stories', icon: 'Sparkle' },
  { slug: 'rapid-10', name: 'Rapid Fire Pro', description: 'Score 100% in a Rapid Fire interview challenge', icon: 'Timer' },
  { slug: 'mock-grad', name: 'Mock Ace', description: 'Score 60% or higher on a full Mock Interview', icon: 'CheckCircle2' },
  { slug: 'interview-ready', name: 'Interview Ready', description: 'Reach an overall Interview Readiness score of 70%', icon: 'Briefcase' },
  { slug: 'hire-me', name: 'Hire Me!', description: 'Achieve an elite Interview Readiness score of 85%+', icon: 'Rocket' },
];

export function isNightOwlIST(): boolean {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hour12: false,
    });
    const hour = parseInt(formatter.format(new Date()), 10);
    return hour >= 22 || hour < 4;
  } catch {
    return false;
  }
}

