/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  Flame, 
  Zap, 
  Award, 
  RotateCcw, 
  Play, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Heart, 
  User, 
  X, 
  Coins, 
  HelpCircle, 
  Eye, 
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import local questions, types, and audio
import { QUESTIONS, Question } from './questions';
import { 
  StudentStats, 
  LEVEL_MAP, 
  BADGES, 
  AVATARS, 
  HAMMERS, 
  MOLES, 
  BGS, 
  TRAILS, 
  GameMode, 
  Difficulty, 
  GrammarTopic 
} from './types';
import { playSound, toggleMute } from './audio';

// Import custom school components
import LeaderboardView from './components/LeaderboardView';
import CustomizationShop from './components/CustomizationShop';
import TeacherDashboard from './components/TeacherDashboard';

// Helper for generating unique session IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

interface AppsScriptRunner {
  withFailureHandler: (handler: (error: unknown) => void) => AppsScriptRunner;
  saveScore: (record: AppsScriptRoundRecord) => void;
}

declare global {
  interface Window {
    google?: {
      script?: {
        run?: AppsScriptRunner;
      };
    };
  }
}

interface RoundAnswerRecord {
  id: string;
  questionNumber: number;
  questionId: string;
  sentence: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  topic: string;
  difficulty: string;
  explanation: string;
  answeredAt: string;
}

type AppsScriptRoundRecord = StudentStats['gameHistory'][number] & {
  mode: GameMode;
  difficulty: Difficulty;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  highestStreak: number;
  coinsEarned: number;
  starsEarned: number;
  answers: RoundAnswerRecord[];
};

const saveScoreToGoogleSheet = (record: AppsScriptRoundRecord) => {
  const runner = window.google?.script?.run;
  if (!runner) return;

  try {
    runner
      .withFailureHandler((error) => {
        console.error('Google Sheet score save failed', error);
      })
      .saveScore(record);
  } catch (error) {
    console.error('Google Sheet bridge error', error);
  }
};

// Default initial state for student persistence
const DEFAULT_STATS: StudentStats = {
  playerName: '',
  coins: 100, // Gift of 100 starter coins
  stars: 0,
  currentLevel: 1,
  highScore: 0,
  purchasedItems: ['av_student', 'hm_wooden', 'ml_classic', 'bg_garden', 'tr_stars'],
  equippedAvatar: 'av_student',
  equippedHammer: 'hm_wooden',
  equippedMole: 'ml_classic',
  equippedBg: 'bg_garden',
  badges: [],
  accuracyByTopic: {
    'verb-tenses': { correct: 0, total: 0 },
    'subject-verb-agreement': { correct: 0, total: 0 },
    'comparatives-superlatives': { correct: 0, total: 0 },
    'prepositions': { correct: 0, total: 0 }
  },
  soundEnabled: true,
  gameHistory: []
};

interface VisualParticle {
  id: number;
  x: number;
  y: number;
  char: string;
}

export default function App() {
  // --- STATE ---
  const [stats, setStats] = useState<StudentStats>(DEFAULT_STATS);
  const [activeView, setActiveView] = useState<'start' | 'playing' | 'results' | 'shop' | 'leaderboard' | 'teacher' | 'howto'>('start');
  const [largeTextEnabled, setLargeTextEnabled] = useState<boolean>(false);
  
  // Game Setup States
  const [inputName, setInputName] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic>('mixed');
  const [selectedMode, setSelectedMode] = useState<GameMode>('mission');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');

  // Active Level State
  const [activeLevelIdx, setActiveLevelIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [starsEarned, setStarsEarned] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  
  // Adaptive Difficulty States
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [adaptiveSpeedMultiplier, setAdaptiveSpeedMultiplier] = useState<number>(1.0); // multiplies the time limit
  const [lives, setLives] = useState<number>(3);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [challengeModeActive, setChallengeModeActive] = useState<boolean>(false);

  // Question Engine
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const answerLogRef = useRef<RoundAnswerRecord[]>([]);

  // Mole Board State
  // 6 holes total for high-contrast classic WAM gameplay grid
  const [moles, setMoles] = useState<Array<{
    id: number;
    value: string;
    isCorrect: boolean;
    isPopped: boolean;
    state: 'hidden' | 'popping' | 'popped' | 'correct-hit' | 'wrong-hit';
    timeLeftPopped: number;
  }>>([]);

  // Timers and Animation Loops
  const [timeLeft, setTimeLeft] = useState<number>(100); // percentage for progress bar
  const [explanationActive, setExplanationActive] = useState<boolean>(false);
  const [explanationText, setExplanationText] = useState<string>('');
  const [wasCorrectHit, setWasCorrectHit] = useState<boolean>(false);

  // Custom Cursor/Hammer Tracking State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringArena, setIsHoveringArena] = useState(false);
  const [isSwinging, setIsSwinging] = useState(false);

  // Particle Effects State
  const [clickTrails, setClickTrails] = useState<VisualParticle[]>([]);
  const trailIdCounter = useRef(0);

  // Reference for the game window or iframe resizing
  const containerRef = useRef<HTMLDivElement>(null);

  // --- LOCAL PERSISTENCE SYNC ---
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('teacher_rigo_wam_stats');
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
        setInputName(parsed.playerName || '');
        toggleMute(!parsed.soundEnabled);
      }
    } catch (e) {
      console.error("Local storage read error", e);
    }
  }, []);

  const updateStatsAndSave = (updates: Partial<StudentStats>) => {
    setStats((prev) => {
      const merged = { ...prev, ...updates };
      try {
        localStorage.setItem('teacher_rigo_wam_stats', JSON.stringify(merged));
      } catch (e) {
        console.error("Local storage write error", e);
      }
      return merged;
    });
  };

  // --- GAME TIMERS AND PHYSICS ---
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const moleSpawnRef = useRef<NodeJS.Timeout | null>(null);

  // Audio mute handler
  const handleToggleMute = (enabled: boolean) => {
    toggleMute(!enabled);
    updateStatsAndSave({ soundEnabled: enabled });
  };

  // Click trail burst effect
  const createTrailEffect = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Get current equipped trail icon
    const equippedTrailId = stats.equippedBg; // fallback/accessor
    const equippedTrailItem = TRAILS.find(t => t.id === stats.equippedBg) || TRAILS[0];
    const particleChar = equippedTrailItem ? equippedTrailItem.visual : '✨';

    playSound('click');

    const newParticle: VisualParticle = {
      id: trailIdCounter.current++,
      x,
      y,
      char: particleChar
    };

    setClickTrails((prev) => [...prev, newParticle]);

    // Clean up particles
    setTimeout(() => {
      setClickTrails((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 600);
  };

  // --- QUESTIONS SELECTION & INITIALIZATION ---
  const startNewGame = (topic: GrammarTopic, mode: GameMode, diff: Difficulty) => {
    // Determine level parameters
    let targetLevel = LEVEL_MAP[0];
    if (mode === 'mission') {
      const levelNum = stats.currentLevel > 8 ? 1 : stats.currentLevel;
      targetLevel = LEVEL_MAP[levelNum - 1] || LEVEL_MAP[0];
      setActiveLevelIdx(levelNum - 1);
    } else {
      // Mixed or Arcade defaults to standard customized settings
      targetLevel = {
        level: 0,
        name: topic === 'mixed' ? "Mixed Review" : `${topic.replace('-', ' ')} Practice`,
        topic: topic,
        difficulty: diff,
        description: "Hone your grammar reflexes under customized parameters.",
        questionsCount: 10,
        timeLimit: diff === 'beginner' ? 8 : diff === 'normal' ? 6 : 4,
        targetScore: 500
      };
    }

    // Filter relevant questions
    let filtered = QUESTIONS.filter(q => {
      if (targetLevel.topic === 'mixed') return true;
      return q.topic === targetLevel.topic;
    });

    // If practicing a topic, just use that topic's questions
    if (mode === 'practice' && topic !== 'mixed') {
      filtered = QUESTIONS.filter(q => q.topic === topic);
    }

    // Filter by difficulty or adjust
    let questionsForRound = [...filtered];
    if (mode === 'mission' && !targetLevel.isBoss) {
      questionsForRound = filtered.filter(q => q.difficulty === targetLevel.difficulty);
    }

    // Shuffle questions
    questionsForRound.sort(() => 0.5 - Math.random());

    // Slice to target count
    questionsForRound = questionsForRound.slice(0, targetLevel.questionsCount);

    // If we have fewer than count, fallback to all filtered
    if (questionsForRound.length === 0) {
      questionsForRound = QUESTIONS.slice(0, 10);
    }

    // Set up gameplay states
    setScore(0);
    setCoinsEarned(0);
    setStarsEarned(0);
    setCorrectCount(0);
    setWrongCount(0);
    setCurrentStreak(0);
    setHighestStreak(0);
    setLives(mode === 'practice' ? 99 : 3);
    setAdaptiveSpeedMultiplier(1.0);
    setChallengeModeActive(false);
    setCurrentHint(null);
    setExplanationActive(false);
    answerLogRef.current = [];

    setGameQuestions(questionsForRound);
    setQuestionIndex(0);
    setActiveView('playing');

    // Trigger first question
    loadQuestion(questionsForRound, 0, targetLevel);
  };

  // --- QUESTION DISPLAY ENGINE ---
  const loadQuestion = (questionsList: Question[], index: number, levelConfig: typeof LEVEL_MAP[0]) => {
    if (index >= questionsList.length || lives <= 0) {
      endGameRound();
      return;
    }

    const q = questionsList[index];
    setCurrentQuestion(q);
    setExplanationActive(false);
    setCurrentHint(null);

    // Adaptive speed adjustments
    // Beginner gets more options limits, hard gets faster, etc.
    let speedMult = adaptiveSpeedMultiplier;
    let moleShowTime = levelConfig.timeLimit * speedMult;

    // Build the options: correct answer + distractors
    const options = [...q.options];

    // Adaptive Rule: Beginner mode gets fewer options (fewer targets)
    let selectedOptions = [...options];
    if (levelConfig.difficulty === 'beginner' && selectedOptions.length > 2) {
      // Keep correct option and 1 wrong option
      const wrongOpts = selectedOptions.filter(o => o !== q.correct_answer);
      selectedOptions = [q.correct_answer, wrongOpts[0]];
    }

    // Shuffle options
    selectedOptions.sort(() => 0.5 - Math.random());

    // Map options to 6 available holes
    // Each option assigned to a hole. Ensure at least one has correct answer.
    const holeConfig = Array.from({ length: 6 }).map((_, i) => {
      const optionForHole = selectedOptions[i % selectedOptions.length];
      const isCorrectHole = optionForHole === q.correct_answer;
      
      return {
        id: i,
        value: optionForHole,
        isCorrect: isCorrectHole,
        isPopped: false,
        state: 'hidden' as const,
        timeLeftPopped: 0
      };
    });

    // Let's initially pop 2-3 moles (including the correct one, and 1-2 random incorrect ones)
    const correctMole = holeConfig.find(m => m.isCorrect);
    const wrongMoles = holeConfig.filter(m => !m.isCorrect);
    
    // Pick 1 or 2 random wrong ones
    const shuffledWrong = [...wrongMoles].sort(() => 0.5 - Math.random());
    const initialPoppedIds = new Set<number>();
    if (correctMole) initialPoppedIds.add(correctMole.id);
    shuffledWrong.slice(0, 2).forEach(m => initialPoppedIds.add(m.id));

    const initialHoleConfig = holeConfig.map(m => {
      if (initialPoppedIds.has(m.id)) {
        return {
          ...m,
          state: 'popped' as const,
          isPopped: true,
          timeLeftPopped: 3000 + Math.random() * 1500 // 3.0 to 4.5 seconds
        };
      }
      return m;
    });

    setMoles(initialHoleConfig);

    // Start Timer progress countdown
    let elapsed = 0;
    const duration = moleShowTime * 1000; // milliseconds
    const intervalMs = 100;
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    setTimeLeft(100);

    timerRef.current = setInterval(() => {
      elapsed += intervalMs;
      const progress = Math.max(0, 100 - (elapsed / duration) * 100);
      setTimeLeft(progress);

      // Organic up and down popping of moles
      setMoles((prevMoles) => {
        // Decrement timeLeftPopped for currently popped moles
        let updated = prevMoles.map((m) => {
          if (m.state === 'popped') {
            const nextTime = m.timeLeftPopped - intervalMs;
            if (nextTime <= 0) {
              return { ...m, state: 'hidden' as const, isPopped: false, timeLeftPopped: 0 };
            }
            return { ...m, timeLeftPopped: nextTime };
          }
          return m;
        });

        // Ensure we always have between 2 and 4 moles popped
        const currentlyPopped = updated.filter(m => m.state === 'popped');
        
        if (currentlyPopped.length < 2) {
          // We need to pop more!
          const hiddenMoles = updated.filter(m => m.state === 'hidden');
          if (hiddenMoles.length > 0) {
            // 65% chance to prefer correct mole if it's hidden, to make the game flow nicely
            const correctHidden = hiddenMoles.find(m => m.isCorrect);
            let moleToPop = null;
            if (correctHidden && Math.random() < 0.65) {
              moleToPop = correctHidden;
            } else {
              moleToPop = hiddenMoles[Math.floor(Math.random() * hiddenMoles.length)];
            }

            if (moleToPop) {
              playSound('pop');
              updated = updated.map(m => {
                if (m.id === moleToPop.id) {
                  return {
                    ...m,
                    state: 'popped' as const,
                    isPopped: true,
                    timeLeftPopped: 2500 + Math.random() * 1500 // 2.5 to 4.0 seconds
                  };
                }
                return m;
              });
            }
          }
        }

        return updated;
      });

      if (progress <= 0) {
        clearInterval(timerRef.current!);
        // Time expired! Treated as a missed / wrong hit
        handleMoleHit(null, false, "Time expired!");
      }
    }, intervalMs);
  };

  // --- INTERACTIVE WHACK ACTION ---
  const handleMoleHit = (holeId: number | null, isCorrect: boolean, valueHit: string) => {
    // Stop timer
    if (timerRef.current) clearInterval(timerRef.current);

    const levelConfig = selectedMode === 'mission' ? LEVEL_MAP[activeLevelIdx] : LEVEL_MAP[0];
    const q = currentQuestion;
    if (!q) return;

    answerLogRef.current = [
      ...answerLogRef.current,
      {
        id: generateId(),
        questionNumber: questionIndex + 1,
        questionId: q.id,
        sentence: q.sentence,
        selectedAnswer: valueHit,
        correctAnswer: q.correct_answer,
        isCorrect,
        topic: q.topic,
        difficulty: q.difficulty,
        explanation: q.explanation,
        answeredAt: new Date().toISOString()
      }
    ];

    let explanationTextString = "";
    
    if (isCorrect) {
      playSound('correct');
      // Sparkle reward
      const basePoints = levelConfig.difficulty === 'beginner' ? 100 : levelConfig.difficulty === 'normal' ? 150 : 200;
      const streakMultiplier = Math.min(5, 1 + Math.floor(currentStreak / 3));
      const pointsEarned = basePoints * streakMultiplier * (challengeModeActive ? 2 : 1);
      
      setScore((prev) => prev + pointsEarned);
      const earnedCoins = Math.ceil(pointsEarned / 10);
      setCoinsEarned((prev) => prev + earnedCoins);

      setCorrectCount((prev) => prev + 1);
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      if (nextStreak > highestStreak) setHighestStreak(nextStreak);

      setWasCorrectHit(true);
      explanationTextString = `Amazing job, ${stats.playerName || 'Scholar'}! "${valueHit}" is 100% correct. ${q.explanation}`;

      // Update mole visuals to show correct animation
      if (holeId !== null) {
        setMoles((prev) => 
          prev.map((m) => m.id === holeId ? { ...m, state: 'correct-hit' } : m)
        );
      }

      // ADAPTIVE RULE: 3 correct in a row increases speed & triggers visual flare
      if (nextStreak >= 3) {
        setAdaptiveSpeedMultiplier((p) => Math.max(0.6, p - 0.08)); // moles pop and hide faster!
        if (nextStreak % 3 === 0) playSound('streak');
      }

      // Check if unlocked a streak milestone
      if (nextStreak >= 10 && !stats.badges.includes('streak_master')) {
        updateStatsAndSave({ badges: [...stats.badges, 'streak_master'] });
      }

    } else {
      playSound('wrong');
      setWrongCount((prev) => prev + 1);
      setWasCorrectHit(false);

      const nextWrongChain = 2; // For trigger check
      const prevStreak = currentStreak;
      setCurrentStreak(0);

      // Lives reduction
      if (selectedMode !== 'practice') {
        setLives((prev) => Math.max(0, prev - 1));
      }

      explanationTextString = `Oops! Not quite. The correct answer was "${q.correct_answer}".\n\nExplanation: ${q.explanation}`;

      // Update mole visual to show wrong hit
      if (holeId !== null) {
        setMoles((prev) => 
          prev.map((m) => m.id === holeId ? { ...m, state: 'wrong-hit' } : m)
        );
      }

      // ADAPTIVE RULE: 2 wrong in a row slows down moles and offers hints
      setAdaptiveSpeedMultiplier((p) => Math.min(1.4, p + 0.15)); // slow down!
      
      // Auto-hint trigger
      setCurrentHint(`💡 Grammar Hint: Focus on the sentence subject and keywords.`);
    }

    setExplanationText(explanationTextString);
    setExplanationActive(true);
  };

  const handleNextQuestion = () => {
    playSound('click');
    setExplanationActive(false);

    if (lives <= 0 || questionIndex + 1 >= gameQuestions.length) {
      endGameRound();
    } else {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      const levelConfig = selectedMode === 'mission' ? LEVEL_MAP[activeLevelIdx] : LEVEL_MAP[0];
      loadQuestion(gameQuestions, nextIndex, levelConfig);
    }
  };

  // --- ROUND CONCLUSION & SCORE SAVING ---
  const endGameRound = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    playSound('levelComplete');

    // Compute accuracy percentage
    const totalAns = correctCount + wrongCount;
    const accuracy = totalAns > 0 ? Math.round((correctCount / totalAns) * 100) : 0;

    // Calculate stars earned (0 to 3)
    let stars = 0;
    if (accuracy >= 90) stars = 3;
    else if (accuracy >= 70) stars = 2;
    else if (accuracy >= 50) stars = 1;

    setStarsEarned(stars);

    // Badges unlock calculations
    const unlockedBadges = [...stats.badges];
    
    // 1st badge: Grammar Rookie
    if (!unlockedBadges.includes('grammar_rookie')) {
      unlockedBadges.push('grammar_rookie');
    }

    // Check perfectionist (100% on a level with 5+ questions)
    if (accuracy === 100 && gameQuestions.length >= 5 && !unlockedBadges.includes('perfectionist')) {
      unlockedBadges.push('perfectionist');
    }

    // Check specific topics count upgrades
    const currentTopicStats = { ...stats.accuracyByTopic };
    if (currentQuestion) {
      const topicKey = currentQuestion.topic;
      if (currentTopicStats[topicKey]) {
        currentTopicStats[topicKey].correct += correctCount;
        currentTopicStats[topicKey].total += totalAns;
      } else {
        currentTopicStats[topicKey] = { correct: correctCount, total: totalAns };
      }

      // Badge triggers for 10 correct topic answers
      if (currentTopicStats['verb-tenses']?.correct >= 10 && !unlockedBadges.includes('tense_hero')) {
        unlockedBadges.push('tense_hero');
      }
      if (currentTopicStats['subject-verb-agreement']?.correct >= 10 && !unlockedBadges.includes('agreement_champion')) {
        unlockedBadges.push('agreement_champion');
      }
      if (currentTopicStats['prepositions']?.correct >= 10 && !unlockedBadges.includes('preposition_master')) {
        unlockedBadges.push('preposition_master');
      }
      if (currentTopicStats['comparatives-superlatives']?.correct >= 10 && !unlockedBadges.includes('superlative_star')) {
        unlockedBadges.push('superlative_star');
      }
    }

    // Level progression
    let nextLevel = stats.currentLevel;
    if (selectedMode === 'mission' && accuracy >= 60 && activeLevelIdx + 1 === stats.currentLevel) {
      nextLevel = Math.min(8, stats.currentLevel + 1);
      // If completed level 8 (boss)
      if (activeLevelIdx === 7 && !unlockedBadges.includes('boss_slayer')) {
        unlockedBadges.push('boss_slayer');
      }
    }

    // Coin collection badge
    const nextTotalCoins = stats.coins + coinsEarned;
    if (nextTotalCoins >= 500 && !unlockedBadges.includes('coin_collector')) {
      unlockedBadges.push('coin_collector');
    }

    // Save Game record
    const newRecord = {
      id: generateId(),
      playerName: stats.playerName || 'Scholar',
      score: score,
      accuracy: accuracy,
      topic: selectedTopic,
      level: selectedMode === 'mission' ? activeLevelIdx + 1 : 0,
      date: new Date().toISOString()
    };

    saveScoreToGoogleSheet({
      ...newRecord,
      mode: selectedMode,
      difficulty: selectedDifficulty,
      totalQuestions: gameQuestions.length,
      correctCount,
      wrongCount,
      highestStreak,
      coinsEarned,
      starsEarned: stars,
      answers: answerLogRef.current
    });

    const nextHistory = [newRecord, ...stats.gameHistory].slice(0, 100); // limit local history to 100 entries

    updateStatsAndSave({
      coins: nextTotalCoins,
      stars: stats.stars + stars,
      currentLevel: nextLevel,
      highScore: Math.max(stats.highScore, score),
      badges: unlockedBadges,
      accuracyByTopic: currentTopicStats,
      gameHistory: nextHistory
    });

    setActiveView('results');
  };

  const handleResetData = () => {
    setStats(DEFAULT_STATS);
    setInputName('');
    setSelectedTopic('mixed');
    localStorage.removeItem('teacher_rigo_wam_stats');
    setActiveView('start');
  };

  // --- ACCESSOR DETAILS ---
  const currentBgClass = BGS.find(b => b.id === stats.equippedBg)?.visual || BGS[0].visual;
  const currentBgAccent = BGS.find(b => b.id === stats.equippedBg)?.accentColor || '#10b981';
  const equippedHammerItem = HAMMERS.find(h => h.id === stats.equippedHammer) || HAMMERS[0];
  const equippedAvatarItem = AVATARS.find(a => a.id === stats.equippedAvatar) || AVATARS[0];

  const getTopicColor = (topic: string) => {
    switch (topic) {
      case 'verb-tenses': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'subject-verb-agreement': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'comparatives-superlatives': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'prepositions': return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  const currentLevelConfig = LEVEL_MAP[activeLevelIdx] || LEVEL_MAP[0];

  return (
    <div 
      className={`android-safe-area min-h-screen min-h-[100dvh] bg-gradient-to-br ${currentBgClass} p-2 md:p-6 transition-all duration-300 font-sans relative overflow-hidden`}
      ref={containerRef}
      onMouseDown={createTrailEffect}
      id="root_app_container"
    >
      {/* Dynamic particles render */}
      {clickTrails.map((trail) => (
        <span 
          key={trail.id} 
          className="click-trail select-none text-2xl"
          style={{ left: trail.x, top: trail.y }}
        >
          {trail.char}
        </span>
      ))}

      {/* Retro Arcade Ambient Sound Toggle & Header Menu Bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-4 glass-panel p-3 rounded-xl relative z-40 text-white shadow-md border-emerald-800/50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { playSound('click'); setActiveView('start'); }}>
          <div className="text-2xl animate-bounce-small">🦦</div>
          <div>
            <h1 className="text-sm md:text-base font-extrabold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-rose-400">
              Teacher Rigo's Whack a Mole
            </h1>
            <p className="text-[10px] text-emerald-400 font-medium">High School Grammar Arcade v1.4</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Sound toggle */}
          <button
            onClick={() => handleToggleMute(stats.soundEnabled)}
            className="p-1.5 md:p-2 bg-slate-800/80 hover:bg-slate-750/80 border border-emerald-800 rounded-lg text-slate-300 transition"
            title={stats.soundEnabled ? "Mute sounds" : "Enable arcade audio"}
            id="toggle_sound"
          >
            {stats.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>

          {/* Teacher dashboard button */}
          <button
            onClick={() => { playSound('click'); setActiveView('teacher'); }}
            className="p-1.5 md:p-2 bg-slate-800/80 hover:bg-slate-750/80 border border-emerald-800 rounded-lg text-teal-400 transition text-xs font-bold flex items-center gap-1"
            title="Classroom Dashboard"
            id="btn_teacher_portal"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Teacher Board</span>
          </button>

          {/* Coins indicator */}
          <div className="flex items-center space-x-1.5 bg-slate-950/60 border border-emerald-800 px-2.5 py-1 rounded-lg text-yellow-400 text-xs font-mono font-bold">
            <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
            <span>{stats.coins}</span>
          </div>
        </div>
      </div>

      {/* MAIN VIEW CONTROLLER */}
      <div className="max-w-4xl mx-auto relative z-30">
        
        {/* VIEW: START SCREEN */}
        {activeView === 'start' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl border-2 border-emerald-800/80 p-5 md:p-8 shadow-2xl text-white overflow-hidden relative"
            id="start_screen_panel"
          >
            {/* Glowing background highlights */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-45 -right-40 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-center relative z-10 max-w-lg mx-auto">
              <span className="text-sm bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                🎯 Grammar Learning Mission
              </span>
              
              <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-white mt-3 leading-tight">
                Whack the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-yellow-400">Right Mole!</span>
              </h2>
              
              <p className="text-slate-400 text-xs md:text-sm mt-3 leading-relaxed">
                Test your high school English reflex! Pick a grammar topic, hit correct moles, unlock cool hammer skins, and beat the Level 8 Boss!
              </p>

              {/* Student Name Personalization Input */}
              <div className="mt-6 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-left">
                <label className="block text-xs font-mono text-teal-400 uppercase tracking-wider font-bold mb-2">
                  👤 Enter Your Name to Personalize Game
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="e.g. Carlos, Ana, Maria..."
                    value={inputName}
                    onChange={(e) => {
                      setInputName(e.target.value);
                      updateStatsAndSave({ playerName: e.target.value });
                    }}
                    className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    id="student_name_input"
                  />
                  {inputName && (
                    <div className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-2 rounded-lg font-bold flex items-center">
                      Hi, {inputName}! 👋
                    </div>
                  )}
                </div>
              </div>

              {/* QUICK NAV PANELS */}
              <div className="grid grid-cols-3 gap-2.5 mt-4">
                <button
                  onClick={() => { playSound('click'); setActiveView('shop'); }}
                  className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl p-3 flex flex-col items-center text-center transition cursor-pointer hover:-translate-y-0.5"
                  id="btn_view_shop"
                >
                  <span className="text-xl">🎨</span>
                  <span className="text-[10px] font-bold mt-1 text-pink-400">Skin Shop</span>
                </button>

                <button
                  onClick={() => { playSound('click'); setActiveView('leaderboard'); }}
                  className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl p-3 flex flex-col items-center text-center transition cursor-pointer hover:-translate-y-0.5"
                  id="btn_view_leaderboard"
                >
                  <span className="text-xl">🏆</span>
                  <span className="text-[10px] font-bold mt-1 text-yellow-400">Leaderboard</span>
                </button>

                <button
                  onClick={() => { playSound('click'); setActiveView('howto'); }}
                  className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl p-3 flex flex-col items-center text-center transition cursor-pointer hover:-translate-y-0.5"
                >
                  <span className="text-xl">📚</span>
                  <span className="text-[10px] font-bold mt-1 text-cyan-400">Rules / Topics</span>
                </button>
              </div>

              {/* CHOOSE TOPIC / MODE TAB */}
              <div className="mt-6 border-t border-slate-800 pt-6">
                <h3 className="text-xs font-mono text-left font-bold text-teal-400 uppercase tracking-wider mb-3">
                  🎮 Select Game Settings & Start
                </h3>

                {/* Mode Select */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {(['mission', 'practice', 'mixed-review'] as GameMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => { playSound('click'); setSelectedMode(mode); }}
                      className={`px-3 py-2 rounded-lg text-xs font-bold border transition ${
                        selectedMode === mode 
                          ? 'bg-emerald-600 text-white border-emerald-500' 
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {mode === 'mission' ? '🎒 Level Mission' : mode === 'practice' ? '🌸 Free Practice' : '⚡ Mixed Review'}
                    </button>
                  ))}
                </div>

                {selectedMode === 'mission' && (
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 text-left mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-indigo-400 font-bold font-mono">Current Mission: Level {stats.currentLevel} / 8</span>
                      <span className="text-[10px] text-slate-500 font-mono">Stars: {stats.stars} ⭐</span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-100">{LEVEL_MAP[Math.min(7, stats.currentLevel - 1)].name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{LEVEL_MAP[Math.min(7, stats.currentLevel - 1)].description}</p>
                    
                    <button
                      onClick={() => startNewGame('mixed', 'mission', 'normal')}
                      className="w-full mt-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
                      id="btn_start_mission"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>Start Level {stats.currentLevel} Mission</span>
                    </button>
                  </div>
                )}

                {selectedMode === 'practice' && (
                  <div className="space-y-3 text-left">
                    <p className="text-[11px] text-slate-400">Choose a single topic to practice. There are no timed pressure or lives reductions in Free Practice.</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { id: 'verb-tenses', label: 'Verb Tenses', icon: '⏳' },
                        { id: 'subject-verb-agreement', label: 'Subject-Verb', icon: '🤝' },
                        { id: 'comparatives-superlatives', label: 'Comparatives', icon: '🌟' },
                        { id: 'prepositions', label: 'Prepositions', icon: '🗺️' }
                      ] as const).map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => { playSound('click'); startNewGame(topic.id, 'practice', selectedDifficulty); }}
                          className="bg-slate-950/50 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800 p-3 rounded-xl flex items-center justify-between text-xs text-left text-slate-100 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{topic.icon}</span>
                            <span>{topic.label}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMode === 'mixed-review' && (
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 text-left space-y-3.5">
                    <div>
                      <p className="text-[11px] text-slate-400">Choose your round difficulty parameters. Difficulty adapts to your correct answer streaks.</p>
                    </div>

                    <div className="flex justify-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                      {(['beginner', 'normal', 'hard'] as Difficulty[]).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => { playSound('click'); setSelectedDifficulty(diff); }}
                          className={`flex-1 text-center py-1.5 rounded-md text-xs font-bold uppercase transition ${selectedDifficulty === diff ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => startNewGame('mixed', 'mixed-review', selectedDifficulty)}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-lg transition"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Play Custom Mixed Round</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: GAME PLAYING SCREEN */}
        {activeView === 'playing' && currentQuestion && (
          <div 
            className={`garden-floor border-4 border-emerald-800 rounded-2xl p-4 md:p-6 text-white shadow-2xl relative overflow-hidden ${isHoveringArena ? 'cursor-none' : ''}`} 
            id="gameplay_arena_view"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
              });
            }}
            onMouseEnter={() => setIsHoveringArena(true)}
            onMouseLeave={() => setIsHoveringArena(false)}
            onMouseDown={() => {
              setIsSwinging(true);
            }}
            onMouseUp={() => {
              setIsSwinging(false);
            }}
          >
            {/* Custom Floating Hammer */}
            {isHoveringArena && (
              <div 
                className="custom-hammer-cursor pointer-events-none absolute z-50 text-5xl select-none transition-transform duration-75"
                style={{ 
                  left: mousePos.x, 
                  top: mousePos.y, 
                  transform: `translate(-50%, -50%) rotate(${isSwinging ? '-45deg' : '0deg'}) scale(${isSwinging ? 0.8 : 1})`,
                  transformOrigin: 'bottom right'
                }}
              >
                {equippedHammerItem.visual}
              </div>
            )}

            {/* Overlay Effects from Immersive UI theme */}
            <div className="absolute inset-0 pointer-events-none border-[12px] border-black opacity-20 z-30"></div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/40 z-30"></div>
            
            {/* Top HUD */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-emerald-950/80 p-4 md:px-8 rounded-xl border border-emerald-800/80 mb-4 text-white z-20 gap-4" id="immersive_hud">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full border-2 border-yellow-400 overflow-hidden bg-emerald-800 flex items-center justify-center font-bold text-2xl">
                  {equippedAvatarItem.visual || '🧑‍🎓'}
                </div>
                <div>
                  <h2 className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Agent in Mission</h2>
                  <h1 className="text-base font-bold">{(stats.playerName || 'Carlos')} the Grammarian</h1>
                </div>
              </div>

              <div className="flex items-center space-x-6 md:space-x-12">
                <div className="text-center">
                  <p className="text-[10px] uppercase text-emerald-400">Score</p>
                  <p className="text-xl md:text-2xl font-black text-yellow-400 tracking-tighter">
                    {score.toString().padStart(6, '0')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase text-emerald-400">Streak</p>
                  <p className="text-xl md:text-2xl font-black glow-streak tracking-tighter">🔥 {currentStreak}X</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase text-emerald-400">Time</p>
                  <p className="text-xl md:text-2xl font-black font-mono">
                    0:{Math.ceil((timeLeft / 100) * (LEVEL_MAP[activeLevelIdx]?.timeLimit || 6)).toString().padStart(2, '0')}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                {selectedMode !== 'practice' ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-4 h-4 rounded-sm transition-all ${
                        i < lives 
                          ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' 
                          : 'bg-emerald-800'
                      }`}
                      title={`${lives} Lives Left`}
                    />
                  ))
                ) : (
                  <span className="text-[10px] font-bold text-teal-400 font-mono">FREE PLAY</span>
                )}
              </div>
            </div>

            {/* Level metadata panel / boss block */}
            {selectedMode === 'mission' && currentLevelConfig.isBoss && (
              <div className="bg-gradient-to-r from-red-600/20 via-rose-600/10 to-transparent p-2.5 rounded-lg border border-red-500/30 mb-4 text-xs flex justify-between items-center animate-pulse relative z-20">
                <span className="text-red-400 font-extrabold flex items-center gap-1">
                  👑 BOSS ROUND: Defeat the Giant King Mole!
                </span>
                <span className="text-slate-400">Answer correctly to decrease Boss HP!</span>
              </div>
            )}

            {/* THE QUESTION DISPLAY (Immersive UI footer-style question bar but on top / center) */}
            <div className="bg-neutral-900 p-5 rounded-2xl border-2 border-emerald-800 relative shadow-inner overflow-hidden mb-6 z-20">
              <div className="absolute top-2 right-2 flex space-x-1">
                <span className="px-2 py-0.5 bg-emerald-600 text-[9px] rounded font-bold uppercase tracking-widest text-white border border-emerald-500">
                  {currentQuestion.topic.replace('-', ' ')}
                </span>
                <span className="px-2 py-0.5 bg-yellow-600 text-[9px] rounded font-bold uppercase tracking-widest text-white border border-yellow-500">
                  {currentQuestion.difficulty}
                </span>
              </div>

              <div className="text-xs font-mono text-emerald-400 font-bold mb-2">
                Question {questionIndex + 1} of {gameQuestions.length}
              </div>

              <h3 className="text-lg md:text-3xl font-light tracking-tight text-center text-white mb-2" id="grammar_sentence">
                {(() => {
                  const rawSentence = currentQuestion.sentence;
                  const parts = rawSentence.split("____");
                  if (parts.length > 1) {
                    return (
                      <span className="leading-relaxed">
                        {parts[0]}
                        <span className="text-emerald-400 border-b-4 border-emerald-400 px-4 font-bold mx-2 inline-block">
                          {explanationActive ? currentQuestion.correct_answer : "________"}
                        </span>
                        {parts[1]}
                      </span>
                    );
                  }
                  return (
                    <span className="leading-relaxed">
                      {explanationActive 
                        ? rawSentence.replace("____", `[ ${currentQuestion.correct_answer} ]`)
                        : rawSentence
                      }
                    </span>
                  );
                })()}
              </h3>

              {/* Progress timer bar */}
              <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden mt-4 relative">
                <div 
                  className={`h-full rounded-full transition-all duration-100 ${
                    timeLeft > 50 ? 'progress-bar-fill' : timeLeft > 25 ? 'bg-amber-500' : 'bg-red-500 animate-pulse'
                  }`}
                  style={{ width: `${timeLeft}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1.5">
                <span className="flex items-center gap-0.5 text-emerald-600"><Clock className="w-3.5 h-3.5" /> Mole hiding countdown</span>
                <span className="text-emerald-600">Time: {Math.ceil((timeLeft / 100) * (LEVEL_MAP[activeLevelIdx]?.timeLimit || 6))}s</span>
              </div>
            </div>

            {/* MOLE SPOTTING HOLES GRID - 3x2 arcade bento matrix */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 py-4 mb-10 md:mb-12 relative z-20" id="mole_holes_grid">
              {moles.map((mole) => {
                const moleSkinItem = MOLES.find(m => m.id === stats.equippedMole) || MOLES[0];

                return (
                  <div 
                    key={mole.id}
                    className="mole-hole relative h-36 flex flex-col justify-end"
                  >
                    {/* Hole Rim (Background Depth Effect using .hole style) */}
                    <div className="hole absolute bottom-0 inset-x-0 h-10 z-10 overflow-hidden">
                      <div className="absolute inset-0 bg-black/40 opacity-30"></div>
                    </div>

                    {/* MOLE CHARACTER SPINDLE */}
                    <div 
                      className="relative z-20 transition-transform duration-250 cursor-pointer flex flex-col items-center select-none"
                      onClick={() => {
                        if (!explanationActive && mole.state === 'popped') {
                          handleMoleHit(mole.id, mole.isCorrect, mole.value);
                        }
                      }}
                      style={{
                        transform: (mole.state === 'popped') ? 'translateY(0) scale(1)' : 'translateY(120%) scaleY(0.4)',
                        pointerEvents: (mole.state === 'popped' && !explanationActive) ? 'auto' : 'none'
                      }}
                    >
                      {/* Interactive splash results above mole head */}
                      {mole.state === 'correct-hit' && (
                        <span className="absolute -top-12 text-3xl font-extrabold text-emerald-400 drop-shadow animate-bounce">
                          🎯 CORRECT!
                        </span>
                      )}
                      {mole.state === 'wrong-hit' && (
                        <span className="absolute -top-12 text-3xl font-extrabold text-red-500 drop-shadow animate-bounce">
                          💥 OOPS!
                        </span>
                      )}

                      {/* Giant boss hat accessory for Boss Round Level 8 */}
                      {selectedMode === 'mission' && currentLevelConfig.isBoss && mole.isCorrect && (
                        <span className="text-xl absolute -top-8 animate-bounce" style={{ animationDuration: '3s' }}>👑</span>
                      )}

                      {/* Mole Avatar and item representation */}
                      <div className="text-5xl md:text-6xl drop-shadow-lg filter transition-transform hover:scale-110 active:scale-95">
                        {moleSkinItem.visual}
                      </div>

                      {/* Answer board panel held by mole with Immersive UI .floating-sign style */}
                      <div className={`floating-sign mt-2 px-3 py-1.5 rounded-xl border font-display text-sm font-extrabold text-center max-w-[140px] truncate shadow-lg transition-all ${
                        mole.state === 'correct-hit' 
                          ? '!bg-emerald-600 !border-emerald-400 !text-white scale-105'
                          : mole.state === 'wrong-hit'
                            ? '!bg-red-600 !border-red-400 !text-white scale-95'
                            : ''
                      }`}>
                        {mole.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ADAPTIVE IN-GAME HELPER HINT */}
            {currentHint && !explanationActive && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400 text-xs flex items-center space-x-2 animate-bounce-small">
                <HelpCircle className="w-4 h-4 flex-shrink-0" />
                <span>{currentHint}</span>
              </div>
            )}

            {/* EXPLANATORY SUPPORT DIALOG FOR TEACHING GRAMMAR */}
            <AnimatePresence>
              {explanationActive && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mt-10 p-5 rounded-2xl border-2 shadow-xl ${
                    wasCorrectHit 
                      ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100' 
                      : 'bg-red-950/90 border-red-500/40 text-red-100'
                  }`}
                  id="explanation_panel"
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-4xl">🦖</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-extrabold font-display uppercase tracking-wider text-white mb-1 flex items-center gap-1.5">
                        {wasCorrectHit ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Teacher Rigo says: "Fantastic, {stats.playerName || 'Scholar'}!"
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-400" />
                            Teacher Rigo says: "Let's review this rule!"
                          </>
                        )}
                      </h4>
                      <p className="text-xs leading-relaxed whitespace-pre-line">{explanationText}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="bg-white text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1.5 transition-transform hover:scale-105"
                      id="btn_next_question"
                    >
                      <span>Continue Mission</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* VIEW: RESULTS VIEW SCREEN */}
        {activeView === 'results' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900/95 border-4 border-slate-700 rounded-2xl p-6 text-white shadow-2xl relative"
            id="results_screen_panel"
          >
            <div className="text-center max-w-md mx-auto">
              <span className="text-3xl animate-bounce">🏆</span>
              <h2 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white mt-2">
                Round Complete!
              </h2>
              <p className="text-slate-400 text-xs mt-1">Excellent work representing your high school class, <b className="text-teal-400">{stats.playerName || 'Guest'}</b>!</p>
              
              {/* Stars representation */}
              <div className="flex justify-center space-x-2 my-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-10 h-10 ${i < starsEarned ? 'text-yellow-400 fill-yellow-400' : 'text-slate-800'}`} 
                  />
                ))}
              </div>

              {/* Motivational grammar counselor message */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 text-left my-4 space-y-2">
                <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest block">🎓 Teacher Counselor Report</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {starsEarned === 3 
                    ? "Absolute mastery! You have successfully answered all moles accurately. You are fully prepared to advance to higher and faster levels!"
                    : starsEarned === 2
                      ? "Great progress! You understood most topics well, but keep practicing to avoid quick reflex errors. Try review mode next!"
                      : "A decent effort. Take a quick moment to review the grammar explanations carefully. Try practicing specific topics individually in Free Practice mode first!"
                  }
                </p>
              </div>

              {/* Scorecard Metrics */}
              <div className="grid grid-cols-2 gap-2 text-left mb-6 font-mono text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-500">Correct Whacks</span>
                  <p className="text-lg font-bold text-emerald-400">{correctCount}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-500">Wrong Hits</span>
                  <p className="text-lg font-bold text-rose-400">{wrongCount}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-500">Streak Bonus</span>
                  <p className="text-lg font-bold text-amber-400">{highestStreak}x</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-500">Total Score</span>
                  <p className="text-lg font-bold text-yellow-400">{score} pts</p>
                </div>
              </div>

              {/* Rewards collection display */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 text-left mb-6 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono text-pink-400 uppercase font-bold">Coins Earned</span>
                  <p className="text-md font-bold text-yellow-400 font-mono">+{coinsEarned} 🪙</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Active Badge</span>
                  <p className="text-xs font-bold text-slate-200">
                    {stats.badges.length > 0 ? BADGES.find(b => b.id === stats.badges[stats.badges.length - 1])?.name : 'Grammar Student'}
                  </p>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => { playSound('click'); startNewGame('mixed', selectedMode, selectedDifficulty); }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-1 transition shadow-lg cursor-pointer"
                  id="btn_replay_level"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={() => { playSound('click'); setActiveView('start'); }}
                  className="flex-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-1 transition cursor-pointer"
                >
                  <span>Main Menu</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW: SHOP VIEW */}
        {activeView === 'shop' && (
          <CustomizationShop
            stats={stats}
            onUpdateStats={(updates) => updateStatsAndSave(updates)}
            onClose={() => { playSound('click'); setActiveView('start'); }}
          />
        )}

        {/* VIEW: LEADERBOARD VIEW */}
        {activeView === 'leaderboard' && (
          <LeaderboardView
            history={stats.gameHistory}
            playerName={stats.playerName}
            onClose={() => { playSound('click'); setActiveView('start'); }}
            onClearHistory={() => updateStatsAndSave({ gameHistory: [] })}
          />
        )}

        {/* VIEW: TEACHER PORTAL ADMIN VIEW */}
        {activeView === 'teacher' && (
          <TeacherDashboard
            stats={stats}
            history={stats.gameHistory}
            onResetData={handleResetData}
            onClose={() => { playSound('click'); setActiveView('start'); }}
            soundEnabled={stats.soundEnabled}
            onToggleSound={handleToggleMute}
            largeTextEnabled={largeTextEnabled}
            onToggleLargeText={(enabled) => setLargeTextEnabled(enabled)}
          />
        )}

        {/* VIEW: HOW TO PLAY RULES */}
        {activeView === 'howto' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/95 border-4 border-slate-700 rounded-2xl p-6 text-white shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                📚 Arcade Rules & Grammar Help
              </h2>
              <button 
                onClick={() => { playSound('click'); setActiveView('start'); }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-300 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <h3 className="text-sm font-bold text-teal-400 font-display">How to Play</h3>
                <p>1. At the start of the question, read the sentence carefully with the blank <b>"____"</b> spaces.</p>
                <p>2. Moles pop up from the grass holes holding answer signs.</p>
                <p>3. Identify the grammatically correct word and <b>tap / whack</b> that mole before time runs out!</p>
                <p>4. Hitting correct answers gets you points, coins, streaks, and stars. Hitting wrong ones gives you a grammar explanation to study.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-teal-400 font-display">Topics Covered & Grammar Tips:</h3>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-white mb-1">⏳ 1. Verb Tenses</h4>
                  <p className="text-[11px] text-slate-400">
                    • <b>Present Simple</b>: Habits or routines (e.g. "He runs every morning"). Use -s for singular.<br />
                    • <b>Present Continuous</b>: Happening now (e.g. "We are playing right now").<br />
                    • <b>Past Simple</b>: Completed past events (e.g. "Yesterday, she studied tenses").<br />
                    • <b>Present Perfect</b>: Connected past/present experiences (e.g. "I have read that book").
                  </p>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-white mb-1">🤝 2. Subject-Verb Agreement</h4>
                  <p className="text-[11px] text-slate-400">
                    • Singular subjects need singular verbs; plural subjects need plural verbs.<br />
                    • Indefinite pronouns (everyone, someone, nobody) are always <b>singular</b> (e.g. "Everyone is excited").<br />
                    • With "either / or" or "neither / nor", make the verb agree with the <b>closest</b> noun.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-white mb-1">🌟 3. Comparatives & Superlatives</h4>
                  <p className="text-[11px] text-slate-400">
                    • <b>Comparative</b>: Comparing exactly two items. Short adjectives add -er (taller). Long ones use "more" (more difficult).<br />
                    • <b>Superlative</b>: Comparing three or more items. Short adjectives add -est (the tallest). Long ones use "the most".<br />
                    • Remember irregulars: good → better → best; bad → worse → worst.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-white mb-1">🗺️ 4. Basic Prepositions</h4>
                  <p className="text-[11px] text-slate-400">
                    • <b>In</b>: Closed rooms, boxes, cities, months/years/seasons.<br />
                    • <b>On</b>: Surfaces, streets, days, dates (on October 24th).<br />
                    • <b>At</b>: Specific times (at 3:00 PM), specific location spots (at the door).<br />
                    • <b>Under, Between, Next to</b>: Indicators of relative position.
                  </p>
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => { playSound('click'); setActiveView('start'); }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-lg text-xs transition"
                >
                  Return to Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
