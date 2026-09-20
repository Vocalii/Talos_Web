// Feature stepper content from the previous Qrome section. Not rendered yet —
// kept here for the upcoming "View the features" mode (stepper panel + timer
// phone screen) so the copy isn't lost.

export interface FeatureDetail {
  id: string;
  title: string;
  category: string;
  paragraph1: string;
  paragraph2: string;
  tags: string[];
  phonePreset: string;
  phoneInterval: string;
  cycle: string;
  minutes: string;
  seconds: string;
  accentColor: string;
}

export const TALOS_FEATURES: FeatureDetail[] = [
  {
    id: 'training-modes',
    title: 'Smarter Every Session',
    category: 'ADAPTIVE AI COACHING',
    paragraph1:
      'Your AI coach learns from how you train and adapts your guidance around your progress, performance, and goals.',
    paragraph2:
      'From personalized session recommendations to post-workout feedback, Talos helps you understand what to work on next and keeps your training moving in the right direction.',
    tags: ['Adaptive Coaching', 'Personalized Guidance', 'Session Insights'],
    phonePreset: 'The Power Hour',
    phoneInterval: '50 • 10 MIN',
    cycle: '1st Cycle',
    minutes: '49',
    seconds: '49',
    accentColor: '#22c55e',
  },
  {
    id: 'form-ai',
    title: 'The Path to Mastery',
    category: 'STRUCTURED SKILL PROGRESSION',
    paragraph1:
      'Every skill is broken down into clear, achievable stages so you always know what to train next.',
    paragraph2:
      'Talos guides you through progressions, drills, and milestones designed to build the strength, control, and technique needed to move confidently toward more advanced skills.',
    tags: ['Step-by-Step Progressions', 'Skill Milestones', 'Focused Training'],
    phonePreset: 'Muscle-Up Protocol',
    phoneInterval: '45 • 15 MIN',
    cycle: '2nd Cycle',
    minutes: '38',
    seconds: '12',
    accentColor: '#22c55e',
  },
  {
    id: 'progress-telemetry',
    title: 'Built to Evolve',
    category: 'GAMIFIED SKILL PROGRESSION',
    paragraph1:
      'Every skill evolves as you do, turning your training into a progression you can actually see and feel.',
    paragraph2: 'Build streaks, earn XP, unlock new levels, and watch your Talos evolve alongside your performance as you move closer to mastering each skill.',
    tags: ['Skill Levels', 'Streaks & XP', 'Evolving Talos'],
    phonePreset: 'Peak Hypertrophy',
    phoneInterval: '30 • 05 MIN',
    cycle: '3rd Cycle',
    minutes: '24',
    seconds: '50',
    accentColor: '#22c55e',
  },
];
