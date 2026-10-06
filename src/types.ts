export type GrammarTopic = 'verb-tenses' | 'subject-verb-agreement' | 'comparatives-superlatives' | 'prepositions' | 'mixed';

export type GameMode = 'practice' | 'arcade' | 'mission' | 'mixed-review';

export type Difficulty = 'beginner' | 'normal' | 'hard';

export interface StudentStats {
  playerName: string;
  coins: number;
  stars: number;
  currentLevel: number; // 1 to 8
  highScore: number;
  purchasedItems: string[]; // item IDs
  equippedAvatar: string;
  equippedHammer: string;
  equippedMole: string;
  equippedBg: string;
  badges: string[]; // badge IDs
  accuracyByTopic: Record<string, { correct: number; total: number }>;
  soundEnabled: boolean;
  gameHistory: Array<{
    id: string;
    playerName: string;
    score: number;
    accuracy: number;
    topic: string;
    level: number;
    date: string;
  }>;
}

export interface CustomizationItem {
  id: string;
  name: string;
  type: 'avatar' | 'hammer' | 'mole' | 'bg' | 'trail';
  cost: number;
  description: string;
  visual: string; // SVG code or special styling descriptor
  accentColor?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or short code
  color: string; // Tailwind color class
}

export const BADGES: Badge[] = [
  {
    id: "grammar_rookie",
    name: "Grammar Rookie",
    description: "Successfully complete your very first game round!",
    icon: "🌱",
    color: "from-green-400 to-emerald-600"
  },
  {
    id: "tense_hero",
    name: "Verb Tense Hero",
    description: "Answer 10 verb tense questions correctly.",
    icon: "⏳",
    color: "from-blue-400 to-indigo-600"
  },
  {
    id: "agreement_champion",
    name: "Agreement Champion",
    description: "Answer 10 subject-verb agreement questions correctly.",
    icon: "🤝",
    color: "from-purple-400 to-violet-600"
  },
  {
    id: "preposition_master",
    name: "Preposition Master",
    description: "Answer 10 preposition questions correctly.",
    icon: "🗺️",
    color: "from-teal-400 to-cyan-600"
  },
  {
    id: "superlative_star",
    name: "Superlative Star",
    description: "Answer 10 comparative/superlative questions correctly.",
    icon: "🌟",
    color: "from-amber-400 to-orange-600"
  },
  {
    id: "streak_master",
    name: "Grammar Legend",
    description: "Reach an incredible 10x question streak in a single round!",
    icon: "🔥",
    color: "from-red-500 to-rose-700"
  },
  {
    id: "coin_collector",
    name: "Gold Miner",
    description: "Earn 500 or more cumulative coins.",
    icon: "💰",
    color: "from-yellow-400 to-amber-600"
  },
  {
    id: "customizer",
    name: "Style Icon",
    description: "Unlock 5 or more custom shop items with your hard-earned coins.",
    icon: "🎨",
    color: "from-fuchsia-400 to-pink-600"
  },
  {
    id: "perfectionist",
    name: "Perfect Brain",
    description: "Complete any level of 10+ questions with perfect 100% accuracy!",
    icon: "🎯",
    color: "from-sky-400 to-blue-600"
  },
  {
    id: "boss_slayer",
    name: "Rigo's Champion",
    description: "Defeat Teacher Rigo's Ultimate Level 8 Grammar Boss Round!",
    icon: "👑",
    color: "from-red-600 to-indigo-900"
  }
];

export const AVATARS: CustomizationItem[] = [
  { id: 'av_student', name: 'Freshman Scholar', type: 'avatar', cost: 0, description: 'Eager high school student ready to learn.', visual: '🧑‍🎓' },
  { id: 'av_wizard', name: 'Grammar Wizard', type: 'avatar', cost: 80, description: 'Summons verb tenses from high heavens.', visual: '🧙‍♂️' },
  { id: 'av_ninja', name: 'Spelling Shinobi', type: 'avatar', cost: 150, description: 'Strikes down incorrect dangling prepositions silently.', visual: '🥷' },
  { id: 'av_cyborg', name: 'AI Lexicon Cyborg', type: 'avatar', cost: 250, description: 'Powered by 1,000 gigabytes of English syntax rules.', visual: '🤖' },
  { id: 'av_rigo_superfan', name: 'Rigo Superfan', type: 'avatar', cost: 400, description: 'Teacher Rigo\'s number one student badge of honor!', visual: '🦖' }
];

export const HAMMERS: CustomizationItem[] = [
  { id: 'hm_wooden', name: 'Arcade Mallet', type: 'hammer', cost: 0, description: 'A reliable rubber mallet from the classic carnival cabinets.', visual: '🔨', accentColor: '#b45309' },
  { id: 'hm_laser', name: 'Neon Gavel', type: 'hammer', cost: 100, description: 'Emits legal corrections in radiant cyberpunk magenta.', visual: '⚡', accentColor: '#ec4899' },
  { id: 'hm_ruler', name: 'Wooden Ruler', type: 'hammer', cost: 180, description: 'The old-school teacher ruler. Measures correct answers instantly.', visual: '📏', accentColor: '#f59e0b' },
  { id: 'hm_lightning', name: 'Plasma Pointer', type: 'hammer', cost: 300, description: 'Zaps incorrect moles with static electricity.', visual: '🪄', accentColor: '#3b82f6' },
  { id: 'hm_book', name: 'Holy Dictionary', type: 'hammer', cost: 500, description: 'Unleash the full weight of 2,000 pages of English vocabulary!', visual: '📕', accentColor: '#ef4444' }
];

export const MOLES: CustomizationItem[] = [
  { id: 'ml_classic', name: 'Garden Mole', type: 'mole', cost: 0, description: 'Just a regular friendly garden mole trying to help.', visual: '🦦' },
  { id: 'ml_nerdy', name: 'Scholar Mole', type: 'mole', cost: 90, description: 'Wears cute little glasses and reads books under the dirt.', visual: '🤓' },
  { id: 'ml_royal', name: 'Baron Von Mole', type: 'mole', cost: 170, description: 'A noble royal mole with a tiny gold crown.', visual: '👑' },
  { id: 'ml_cyber', name: 'Hacker Mole', type: 'mole', cost: 280, description: 'Equipped with a cybernetic glowing green visor.', visual: '🕶️' },
  { id: 'ml_boss', name: 'Chrono-Mole', type: 'mole', cost: 450, description: 'Teacher Rigo\'s personal assistant mole in a tiny tuxedo.', visual: '🎩' }
];

export const BGS: CustomizationItem[] = [
  { id: 'bg_garden', name: 'Magical Garden', type: 'bg', cost: 0, description: 'A tranquil field of high-contrast green grass and wild flowers.', visual: 'from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900', accentColor: '#10b981' },
  { id: 'bg_courtyard', name: 'School Yard', type: 'bg', cost: 120, description: 'Sunny high school brick courtyard with blackboards.', visual: 'from-orange-50 to-amber-100 dark:from-orange-950 dark:to-stone-900', accentColor: '#f59e0b' },
  { id: 'bg_classroom', name: 'Neon Arcade Room', type: 'bg', cost: 220, description: 'Cyberpunk retro gaming desk inside the English lab.', visual: 'from-purple-950 to-slate-900', accentColor: '#a855f7' },
  { id: 'bg_sky', name: 'Floating Academy', type: 'bg', cost: 350, description: 'Floating islands high in the clouds where grammar is sacred.', visual: 'from-sky-50 to-blue-200 dark:from-slate-900 dark:to-blue-950', accentColor: '#0ea5e9' }
];

export const TRAILS: CustomizationItem[] = [
  { id: 'tr_stars', name: 'Sparkle Star', type: 'trail', cost: 0, description: 'Gold sparks burst outwards upon clicking.', visual: '✨' },
  { id: 'tr_hearts', name: 'Cute Hearts', type: 'trail', cost: 100, description: 'Love for grammar! Hearts fly out upon hitting.', visual: '💖' },
  { id: 'tr_smoke', name: 'Comic Boom', type: 'trail', cost: 200, description: 'Kaboom! A comical cloud of chalk dust appears on hit.', visual: '💥' },
  { id: 'tr_notes', name: 'Music Notes', type: 'trail', cost: 300, description: 'Hear the harmony! Golden treble notes burst outwards.', visual: '🎵' }
];

export const LEVEL_MAP: Array<{
  level: number;
  name: string;
  topic: 'verb-tenses' | 'subject-verb-agreement' | 'comparatives-superlatives' | 'prepositions' | 'mixed';
  difficulty: 'beginner' | 'normal' | 'hard';
  description: string;
  questionsCount: number;
  timeLimit: number; // seconds per mole
  targetScore: number;
  isBoss?: boolean;
}> = [
  { level: 1, name: "Verb Tenses Basics", topic: "verb-tenses", difficulty: "beginner", description: "Identify basic present simple, continuous, and past actions.", questionsCount: 5, timeLimit: 14, targetScore: 300 },
  { level: 2, name: "Subject-Verb Match", topic: "subject-verb-agreement", difficulty: "beginner", description: "Learn how third person singular and plural verbs connect.", questionsCount: 5, timeLimit: 12, targetScore: 350 },
  { level: 3, name: "Preposition Garden", topic: "prepositions", difficulty: "normal", description: "Place items accurately in time and space using prepositions.", questionsCount: 6, timeLimit: 11, targetScore: 400 },
  { level: 4, name: "Comparative Challenge", topic: "comparatives-superlatives", difficulty: "normal", description: "Compare items using standard rules (e.g. taller than, more beautiful).", questionsCount: 6, timeLimit: 10, targetScore: 450 },
  { level: 5, name: "Superlative Showdown", topic: "comparatives-superlatives", difficulty: "hard", description: "Master the extremes: identify the tallest, best, and most difficult.", questionsCount: 8, timeLimit: 9.5, targetScore: 600 },
  { level: 6, name: "Mixed Grammar Rush", topic: "mixed", difficulty: "normal", description: "Hone your adaptability across multiple grammar categories.", questionsCount: 8, timeLimit: 10, targetScore: 600 },
  { level: 7, name: "Rapid-Fire Speed Round", topic: "mixed", difficulty: "hard", description: "The time limit is extremely short! Tap lightning-fast.", questionsCount: 10, timeLimit: 7.5, targetScore: 800 },
  { level: 8, name: "Teacher Rigo\'s Ultimate Boss Round", topic: "mixed", difficulty: "hard", description: "The final grammar test! Defeat the giant King Mole in an epic exam duel.", questionsCount: 12, timeLimit: 8.5, targetScore: 1000, isBoss: true }
];
